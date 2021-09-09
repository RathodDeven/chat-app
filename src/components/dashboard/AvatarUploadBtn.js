import React, { useState, useRef } from 'react'
import { Alert, Button, Modal } from 'rsuite';
import { useModalState } from '../../misc/custom-hooks'
import AvatarEditor from 'react-avatar-editor'
import { db, storage } from '../../misc/firebase';
import { useProfile } from '../../context/profile.context';
import ProfileAvatar from './ProfileAvatar';
const fileInputTypes = ".png, .jpeg, .jpg"

const acceptedFileTypes = ['image/png','image/jpeg','image/pjpeg']

const getBlob = (canvas) => {
    return new Promise((resolve,reject) => {
        canvas.toBlob(blob => {
            if(blob){
                resolve(blob)
            }else{
                reject(new Error('File process error'));
            }
        })
    })
}

const AvatarUploadBtn = () => {
    const {isOpen,open,close} = useModalState();
    const [img,setImg] = useState(null);
    const avatarEditorRef = useRef();
    const {profile} = useProfile();
    const [isLoading, setIsLoading] = useState(false);

    const fileInputChange = (ev) => {
        const currFiles = ev.target.files;
        if(currFiles.length === 1){
            const file = currFiles[0];
            if(acceptedFileTypes.includes(file.type)){
                setImg(file);
                open();
            }else{
                Alert.warning(`Wrong file type ${file.type}`,4000)
            }
        }
    }

    const onUploadClick = async () => {
        const canvas = avatarEditorRef.current.getImageScaledToCanvas();
        setIsLoading(true);
        try{
            const blob = await getBlob(canvas);
            const avatarFileRef = storage.ref(`/profiles/${profile.uid}`).child('avatar');
            const uploadAvatarResult = await avatarFileRef.put(blob,{
                cacheControl: `public, max-age=${3600*24*3}`
            });

            const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();
            const userAvatarRef = db.ref(`/profiles/${profile.uid}`).child('avatar');
            userAvatarRef.set(downloadUrl);
            setIsLoading(false);
            Alert.info('Avatar updated',4000);
        }catch (err){
            setIsLoading(false);
            Alert.error(err.message,4000);
        }
    }
    return (
        <div className="mt-3 text-center">
            <ProfileAvatar src={profile.avatar} name={profile.name} className="width-200 height-200 img-fullsize font-huge"/>
            <div>
                <label htmlFor="avatar-upload" className="d-block cursor-pointer padded">
                    Select new avatar
                    <input id="avatar-upload" type="file" className="d-none" accept={fileInputTypes} onChange={fileInputChange} disabled={isLoading}/>
                </label>

                <Modal show={isOpen} onHide={close}>
                    <Modal.Header>
                        <Modal.Title>Adjust and Upload Avatar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex justify-content-center align-items-center h-100">
                        {img && 
                         <AvatarEditor
                         ref={avatarEditorRef}
                         image={img}
                         width={200}
                         height={200}
                         border={10}
                         borderRadius={100}
                         rotate={0}
                       />}
                       </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button block appearance="ghost" onClick={onUploadClick}>
                            Upload new avatar
                        </Button>
                    </Modal.Footer>

                </Modal>
            </div>
        </div>
    )
}

export default AvatarUploadBtn
