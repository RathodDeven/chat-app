import React, { useCallback, useState } from 'react'
import { Alert, Icon, Input, InputGroup } from 'rsuite'
import firebase from 'firebase/app'
import { useProfile } from '../../../context/profile.context'
import { useParams } from 'react-router'
import { db } from '../../../misc/firebase'

function assembleMessage(profile,chatId){
    return {
        roomId: chatId,
        author: {
            name: profile.name,
            uid: profile.uid,
            createdAt: profile.createdAt,
            ...(profile.avatar ? {avatar: profile.avatar}:{}),
        },
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        text: ''
    }
}

const Bottom = () => {
    const [input,setInput] = useState('');
    const [isLoading,setIsLoading] = useState(false);

    const {profile} = useProfile();
    const {chatId} = useParams();
    const onInputChange = useCallback((value) => {
        setInput(value);
    },[])

    const onKeyDown = (e) => {
        if(e.keyCode === 13){
            e.preventDefault();
            onSendClick();
        }
    }

    const onSendClick = async() => {
        setIsLoading(true);
        if(input.trim() === '')return;
        const msgData = assembleMessage(profile,chatId);
        msgData.text = input;
        const updates = {};
        const messageId = db.ref('messages').push().key;
        updates[`/messages/${messageId}`] = msgData;
        updates[`/rooms/${chatId}/lastMessage`] = {
            ...msgData,
            msgId: messageId
        };

        try{
            await db.ref().update(updates);
            setInput('');
            setIsLoading(false)
        }catch (err){
            setIsLoading(false);
            Alert.error(err.message);
        }
    }
    return (
        <div>
            <InputGroup>
            <Input placeholder="Write a new message here" value={input} onChange={onInputChange} onKeyDown={onKeyDown} />
            <InputGroup.Button color="blue" appearance="primary" onClick={onSendClick}  disabled={isLoading}>
                <Icon icon="send" />
            </InputGroup.Button>
            </InputGroup>
        </div>
    )
}

export default Bottom
