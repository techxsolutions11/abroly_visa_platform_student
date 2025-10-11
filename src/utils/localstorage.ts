


const addToLocal = (key: string, value: string) => {

    localStorage.setItem(`${key}`, `${value}`)
    return true
}

const getFromLocal = (key: string) => {
    const item = localStorage.getItem(key);
    return item
}

const removeKey = (key: string) => {
    localStorage.removeItem(key);
    return true
}


const getAuthToken = () =>{
    return getFromLocal("token")
}

export { addToLocal, getFromLocal ,removeKey,getAuthToken}