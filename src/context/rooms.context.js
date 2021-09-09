import React,{ createContext, useContext, useEffect, useState } from "react";
import { db } from "../misc/firebase";
import { transformToArrWithId } from "../misc/helpers";


const RoomsContext = createContext();

export const RoomsProvider = ({children}) => {
    const [rooms, setRooms] = useState(null);

    useEffect(() => {
        const roomListRef = db.ref('rooms');
        roomListRef.on('value', (snap)=>{
            const data = transformToArrWithId(snap.val());
            setRooms(data);
        })
        return () => {
            roomListRef.off();
        }
    },[])

    return <RoomsContext.Provider value={rooms}>{children} </RoomsContext.Provider>
}

export const useRooms = () => useContext(RoomsContext);