export function getNameInitials(name) {
  const initials = name.split(' ').map(word => word[0]).join('');
  return initials.toUpperCase();
}


export function transformToArrWithId(snapVal){
    return snapVal ? Object.keys(snapVal).map(key => {return {id: key, ...snapVal[key]}}) : [];
}