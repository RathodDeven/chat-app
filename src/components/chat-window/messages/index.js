import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { Alert, Button } from 'rsuite';
import { auth, db, storage } from '../../../misc/firebase';
import {groupBy, transformToArrWithId} from '../../../misc/helpers';
import MessageItem from './MessageItem';

const PAGE_SIZE = 15;
const messagesRef = db.ref('/messages');

// function shouldScrollBottom(node, threshold = 30){
//     const percentage = (100 * node.scrollTop) / node.scrollHeight - node.clientHeight || 0;
//     return percentage > threshold;
// }

const Messages = () => {
    const {chatId} = useParams();
    const [messages, setMessages] = useState(null);
    const [limit,setLimit] = useState(PAGE_SIZE);
    const selfRef = useRef();

    const isChatEmpty = messages && messages.length === 0;
    const canShowMessages = messages && messages.length > 0;

    const loadMessages = useCallback((limitToLast)=>{
        const node= selfRef.current;
        messagesRef.off();
        messagesRef
            .orderByChild('roomId')
            .equalTo(chatId)
            .limitToLast(limitToLast || PAGE_SIZE)
            .on('value',(snap) => {
                const data = transformToArrWithId(snap.val());
                setMessages(data);

                node.scrollTop= node.scrollHeight;
                
        })

        setLimit(p => p + PAGE_SIZE);
    },[chatId])

    const onLoadMore = useCallback(()=>{
        const node = selfRef.current;
        const oldHeight = node.scrollHeight;
        loadMessages(limit);
        setTimeout(()=>{
            const newHeight = node.scrollHeight;
            node.scrollTop = newHeight - oldHeight;
        },200)
    },[loadMessages,limit])
    

    useEffect(() => {
        const node = selfRef.current;
        loadMessages();
        setTimeout(()=>{
            node.scrollTop = node.scrollHeight;
        },200)

        return () => {
            messagesRef.off('value');
        }
    },[loadMessages]);
    const handleAdmin = useCallback(async (uid) => {
        const adminsRef = db.ref(`/rooms/${chatId}/admins`);
        let alertMsg;

        await adminsRef.transaction(admins => {
            if(admins){
                if(admins[uid]){
                    admins[uid] = null;
                    alertMsg = 'Admin permission removed';
                }else{
                    admins[uid] = true;
                    alertMsg = 'Admin permission granted';
                }
            }

            return admins;
        });

        Alert.info(alertMsg,4000);
    },[chatId])

    const handleLike = useCallback(async (msgId) => {
        const messageRef = db.ref(`/messages/${msgId}`);
        const {uid} = auth.currentUser;
        let alertMsg;

        await messageRef.transaction(msg => {
            if(msg){
                if(msg.likes && msg.likes[uid]){
                    msg.likeCount -= 1;
                    msg.likes[uid] = null;
                    alertMsg = 'Like removed';
                }else{
                    msg.likeCount += 1;
                    if(!msg.likes){
                        msg.likes = {};
                    }
                    msg.likes[uid] = true;
                    alertMsg = 'Like added';
                }
            }

            return msg;
        });

        Alert.info(alertMsg,4000);
    },[])

    const handleDelete = useCallback(async (msgId,file)=> {
        if(!window.confirm('Are you sure you want to delete this message?')){
            return;
        }
        const isLast = messages[messages.length - 1].id === msgId;
        const updates = {};
        updates[`/messages/${msgId}`] = null;
        if(isLast && messages.length > 1){
            updates[`/rooms/${chatId}/lastMessage`] = {
                ...messages[messages.length - 2],
                msgId: [messages[messages.length - 2].id]
            };
        }
        if(isLast && messages.length === 1){
            updates[`/rooms/${chatId}/lastMessage`] = null;
        }

        try{
            await db.ref().update(updates);
            Alert.info('Message deleted',4000);
        }catch (err){
            return Alert.error(err.message,4000);
        }
        if(file){
            try{
                const fileRef = storage.refFromURL(file.url);
                await fileRef.delete();
            }catch(err){
                Alert.error(err.message,4000);
            }
        }

    },[chatId,messages])

    const renderMessages = () => {

        const groups = groupBy(messages,(item)=> new Date(item.createdAt).toDateString());
        const items = [];
        Object.keys(groups).forEach((date) => {
            items.push(<li key={date} className="text-center mb-1 padded">{date}</li>)
            const msgs = groups[date].map(msg => (
                <MessageItem 
                key={msg.id} 
                msg={msg} 
                handleLike={handleLike} 
                handleAdmin={handleAdmin}
                handleDelete={handleDelete}/>
            ))
             items.push(...msgs);

        })

        return items;
        
    }
    return (
        <ul ref={selfRef} className="msg-list custom-scroll">
            {messages && messages.length >= PAGE_SIZE && (
                <li className="text-center mt-2 mb-2">
                    <Button onClick={onLoadMore} color="green">Load previous messages</Button>
                </li>
            )}
            {isChatEmpty && <li>No messages yet...</li>}
            {canShowMessages && renderMessages()}
        </ul>
    )
}

export default Messages
