import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../misc/firebase";
import firebase from "firebase/app"

export const isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const ProfileContext = createContext();

export const ProfileProvider = ({children}) => {
    const [profile, setProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        let userRef;
        let userStatusRef;
        const authUnsub = auth.onAuthStateChanged(authObj => {
            if(authObj){
                userStatusRef = db.ref('/status/' + authObj.uid);
                userRef = db.ref(`/profiles/${authObj.uid}`);
                userRef.on('value', (snap) => {
                    const {name,createdAt,avatar} = snap.val();
                    
                    const data = {
                        name,
                        avatar,
                        createdAt,
                        uid: authObj.uid,
                        email: authObj.email,
                    }
                    setProfile(data);
                    setIsLoading(false);
                })

                db.ref('.info/connected').on('value', function(snapshot) {
                    // If we're not currently connected, don't do anything.
                    if (!!snapshot.val() === false) {
                        return;
                    }
                    userStatusRef.onDisconnect().set(isOfflineForDatabase).then(() => {
                        userStatusRef.set(isOnlineForDatabase);
                    });
                });
                
                
            }else{
                if(userRef){
                    userRef.off();
                }
                if(userStatusRef){
                    userStatusRef.off();
                }
                db.ref('.info/connected').off();
                setProfile(null);
                setIsLoading(false);
            }
        });
        return () => {
            if(userRef){
                userRef.off();
            }
            if(userStatusRef){
                userStatusRef.off();
            }
            db.ref('.info/connected').off();
            authUnsub();
        }
    }, [])
    return <ProfileContext.Provider value={{isLoading,profile}}>{children}</ProfileContext.Provider>;
}

export const useProfile = () => useContext(ProfileContext);