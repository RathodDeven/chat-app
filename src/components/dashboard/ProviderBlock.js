import React, { useState } from 'react'
import { auth } from '../../misc/firebase'
import { Tag,Icon, Button, Alert } from 'rsuite';
import firebase from 'firebase/app';

const ProviderBlock = () => {
    const [isConnected, setIsConnected] = useState({
        'google.com': auth.currentUser.providerData.some(provider => provider.providerId === 'google.com'),
        'facebook.com': auth.currentUser.providerData.some(provider => provider.providerId === 'facebook.com')
    })
    const updateIsConnected  = (providerId,value) => {
        setIsConnected(p => {
            return {
                ...p,
                [providerId]: value
            }
        })
    }

    const unLink = async (providerId) => {
        try{
            if(auth.currentUser.providerData.length === 1){
                throw new Error(`You can not unlink from you last provider ${providerId}`)
            }
            await auth.currentUser.unlink(providerId)
            updateIsConnected(providerId,false)
            Alert.info(`You have unlinked ${providerId}`,4000)
        } catch (e){
            Alert.error(e.message,4000);
        }
    }
    const unLinkGoogle = () => {unLink('google.com')}
    const unLinkFacebook = () => {unLink('facebook.com')}

    const link = async (provider) => {
        try{
            await auth.currentUser.linkWithPopup(provider);
            Alert.info(`You have linked ${provider.providerId}`,4000);
            updateIsConnected(provider.providerId,true)
        }catch (e){
            Alert.error(e.message,4000);
        }
    }

    const linkGoogle = () => {
        link(new firebase.auth.GoogleAuthProvider())
    }
    const linkFacebook = () => {
        link(new firebase.auth.FacebookAuthProvider())
    }

    return (
        <div>
            {isConnected['google.com'] && 
            <Tag color="green" closable onClose={unLinkGoogle}>
            <Icon icon="google" /> Connected
            </Tag>
            }
            

            {isConnected['facebook.com'] &&
            <Tag color="blue" closable onClose={unLinkFacebook}>
                <Icon icon="facebook" /> Connected
            </Tag>
            }

            <div className="mt-2">

                {!isConnected['google.com'] && 
                <Button block color="green" onClick={linkGoogle}>
                    <Icon icon="google" /> Link with Google
                </Button>
                }

                {!isConnected['facebook.com'] &&
                <Button block color="blue" onClick={linkFacebook}>
                    <Icon icon="facebook" /> Link with Facebook
                </Button>
        }
            </div>
        </div>
    )
}

export default ProviderBlock
