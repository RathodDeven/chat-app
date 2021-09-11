import React, { memo } from 'react';
import ProfileAvatar from '../../dashboard/ProfileAvatar';
import TimeAgo from 'react-timeago';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';
import PresenceDot from '../../PresenceDot';
import { useCurrentRoom } from '../../../context/current-room.context';
import { auth } from '../../../misc/firebase';
import { Button } from 'rsuite';
import { useHover, useMediaQuery } from '../../../misc/custom-hooks';
import IconBtnControl from './IconBtnControl';
import ImgBtnModal from './ImgBtnModal';

const renderFile = (file) => {
    const {name, contentType, url} = file;
    if(contentType.includes('image')) {
        return <div className="height-220">
            <ImgBtnModal src={url} name={name}/>
        </div>
    }
    if(contentType.includes('audio')){
        return <audio controls>
            <source src={url} type='audio/mp3'/>
            Your browser does not support the audio element.
        </audio>
    }
    return <a href={url} target="_blank" rel="noopener noreferrer">Download {name}</a>
}

const MessageItem = ({msg, handleAdmin, handleLike, handleDelete}) => {
    const isMobile = useMediaQuery(('(max-width: 992px'))
    const {author,createdAt,text,file, likes, likeCount} = msg;
    const isAdmin = useCurrentRoom(v => v.isAdmin);
    const admins = useCurrentRoom(v => v.admins);
    const isAdminMsg = admins.includes(author.uid);
    const isAuthor = auth.currentUser.uid === author.uid;
    const canGrantAdmin = isAdmin && !isAuthor;
    const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);

    const [selfRef,isHovered] = useHover();
    
    const canShowIcons = isMobile || isHovered;    

    return <li className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02': ''}`} ref={selfRef}>
        <div className="d-flex align-items-center font-bolder mb-1">
            <PresenceDot uid={author.uid}/>
            <ProfileAvatar 
                src={author.avatar} 
                name={author.name} 
                className="ml-1" 
                size="xs"/>
            <ProfileInfoBtnModal 
                profile={author} 
                appearnance="link" 
                className="p-0 ml-1 text-black"> 
                {canGrantAdmin &&
                <Button block onClick={()=> handleAdmin(author.uid)} color="blue">
                    {isAdminMsg  ? 'Remove Admin' : 'Grant Admin'}
                </Button>
                }
            </ProfileInfoBtnModal>
            <TimeAgo 
                date={createdAt} 
                className="font-normal text-black-45 ml-2" />
            <IconBtnControl
                {...(isLiked ? {color: 'red'}: {})} 
                isVisible={canShowIcons}
                iconName="heart"
                tooltip="Like the message"
                onClick={()=> handleLike(msg.id)}
                badgeContent={likeCount}
                />

            {isAuthor && <IconBtnControl
                size="md"
                isVisible={canShowIcons}
                iconName="trash-o"
                tooltip="Delete this message"
                onClick={()=> handleDelete(msg.id,file)}
                />
            }
        </div>
        <div>
            {text && <span className="word-break-all">{text}</span>}
            {file && renderFile(file)}
        </div>
    </li>
}

export default memo(MessageItem); 
