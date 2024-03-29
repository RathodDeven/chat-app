import React from 'react';
import { Alert, Button, Col, Container, Grid, Icon, Panel, Row } from 'rsuite';
import { auth, db } from '../misc/firebase';
import firebase from 'firebase/app';
import Modal from '../components/Modal'

const SignIn = () => {
    const signInWithProvider = async (provider) => {
        try{
        const {additionalUserInfo,user} = await auth.signInWithPopup(provider);
        if(additionalUserInfo.isNewUser){
            await db.ref(`profiles/${user.uid}`).set({
                name: user.displayName,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            })
        }
        Alert.success('You have successfully signed in!',4000);
        } catch(error){
            Alert.error(error.message, 4000);
        }
    }
    const onFacebookSignIn = () => {
        signInWithProvider(new firebase.auth.FacebookAuthProvider());
    }
    const onGoogleSignIn = () => {
        signInWithProvider(new firebase.auth.GoogleAuthProvider())
    }
    return (
        <Container>
            <Grid className="mt-page">
                <Row>
                    <Col xs={24} md={12} mdOffset={6}>
                    <Panel>
                        <Modal>
                        <div className="text-center mt-3">
                            <h2>Welcome to Chat</h2>
                            <p>Progressive Chat Platform</p>
                        </div>
                        </Modal>
                        <div className="mt-3">
                            <Button block color="blue" onClick={onFacebookSignIn}>
                                <Icon icon="facebook" />  Continue with Facebook
                            </Button>
                            <Button block color="green" onClick={onGoogleSignIn}>
                                <Icon icon="google" />  Continue with Google
                                </Button>
                        </div>
                    </Panel>
                    </Col>
                </Row>
            </Grid>
        </Container>
    )
}

export default SignIn
