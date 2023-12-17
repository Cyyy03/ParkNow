import { Alert } from 'react-native';

let default_address = "50 nanyang ave";
export const getAddress = ()=>{
    return default_address;
}
export const setAddress = (address)=>{
    return default_address = address;
}
export const alertMsg = (msg) => {
    if (alert) {
        alert(msg)
    } else {
        Alert.alert(msg);
    }
}