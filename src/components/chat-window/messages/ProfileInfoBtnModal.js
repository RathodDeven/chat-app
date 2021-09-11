import React from 'react'
import { Button, Modal } from 'rsuite'
import { useModalState } from '../../../misc/custom-hooks'
import ProfileAvatar from '../../dashboard/ProfileAvatar';

const ProfileInfoBtnModal = ({profile, children,...btnProps}) => {
    const {name,avatar,createdAt} = profile;
    const {isOpen,open,close} = useModalState();
    const shortName = name.split(' ')[0];
    const memeberSince = new Date(createdAt).toLocaleDateString();
    return (
        <>
            <Button {...btnProps} onClick={open}>
                {shortName}
            </Button>

            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>About {shortName}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <ProfileAvatar src={avatar} name={name} className="width-200 height-200 img-fullsize font-huge" />
                    <h4 className="mt-2">{name}</h4>
                    <p>Member Since {memeberSince}</p>
                </Modal.Body>
                <Modal.Footer>
                    {children}
                    <Button block onClick={close}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ProfileInfoBtnModal
