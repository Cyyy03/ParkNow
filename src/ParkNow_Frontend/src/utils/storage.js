import AsyncStorage from '@react-native-async-storage/async-storage';
export const saveUser = async (user) => {
  try {
    const jsonValue = JSON.stringify(user)
    await AsyncStorage.setItem('@userinfo', jsonValue)
  } catch (e) {
    // saving error
  }
}

export const saveGuide = async () => {
  try {
    await AsyncStorage.setItem('@guide', "true")
  } catch (e) {
    // saving error
  }
}

export const getGuide = async () => {
  try {
    const value = await AsyncStorage.getItem('@guide')
    return value;
  } catch (e) {
    // error reading value
  }
}

export const clear = async () => {
  try {
    await AsyncStorage.removeItem('@userinfo')
    await AsyncStorage.removeItem('@guide')
  } catch (e) {
    // saving error
  }
}

export const getUser = async () => {
  try {
    const value = await AsyncStorage.getItem('@userinfo')
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    // error reading value
  }
}
