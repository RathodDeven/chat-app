import React, { useCallback } from 'react'
import { Alert, Button, Drawer, Icon } from 'rsuite'
import { isOfflineForDatabase } from '../../context/profile.context';
import { useMediaQuery, useModalState } from '../../misc/custom-hooks'
import { auth, db } from '../../misc/firebase';
import Dashboard from './Dashboard';

const DashboardToggle = () => {
    const {isOpen, open, close}= useModalState();
    const isMobile = useMediaQuery('(max-width: 720px');
    const onSignOut = useCallback(() => {
        db
            .ref(`/status/${auth.currentUser.uid}`)
            .set(isOfflineForDatabase)
            .then(() => {                        
                auth.signOut();
                Alert.info('Signed Out', 4000);
                close();
            })
            .catch(err => {
                Alert.error(err.message, 4000);
                close();
            })
    }, [close])
    return (
        <>
            <Button block color="blue" onClick={open}>
                <Icon icon="dashboard" />Dashboard
            </Button>
            <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
                <Dashboard onSignOut={onSignOut}/>
            </Drawer>
        </>
    )
}

export default DashboardToggle
