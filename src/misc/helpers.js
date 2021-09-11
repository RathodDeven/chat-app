export function getNameInitials(name) {
  const initials = name.split(' ').map(word => word[0]).join('');
  return initials.toUpperCase();
}

export function transformToArr(snapVal){
  return snapVal ? Object.keys(snapVal) : [];
}

export function transformToArrWithId(snapVal){
    return snapVal ? Object.keys(snapVal).map(key => {return {id: key, ...snapVal[key]}}) : [];
}

export async function getUserUpDates(userId,keyToUpdate,value,db){
  const updates = {};
  updates[`/profiles/${userId}/${keyToUpdate}`] = value;

  const getMsg = db
    .ref('/messages')
    .orderByChild('author/uid')
    .equalTo(userId)
    .once('value');

  const getRooms = db
    .ref('/rooms')
    .orderByChild('lastMessage/author/uid')
    .equalTo(userId)
    .once('value');

  const [mSnap,rSnap] = await Promise.all([getMsg,getRooms])
  

  mSnap.forEach(snap => {
    updates[`/messages/${snap.key}/author/${keyToUpdate}`] = value;
  })

  rSnap.forEach(snap => {
    updates[`/rooms/${snap.key}/lastMessage/author/${keyToUpdate}`] = value;
  })

  return updates;
}

export function groupBy(array , groupingKeyFn){
  return array.reduce((result,item)=>{
    const groupingKey = groupingKeyFn(item);
    if(!result[groupingKey]){
      result[groupingKey] = [];
    }
    result[groupingKey].push(item);
    return result;
  },[])
}