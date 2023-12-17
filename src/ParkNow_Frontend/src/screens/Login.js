import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import * as api from '../api/api';
import * as storage from '../utils/storage';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import Toast from 'react-native-root-toast';

export default function App(props) {
  const {push} = props.navigation;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
   
    if (!username) {
      Toast.show('Please Enter your username.');
      return;
    }
    if (!password) {
      Toast.show('Please Enter your password.');
      return;
    }

  
    let res = await api.login({
      username: username,
      password: password,
    });
    console.log('res========', res);
    if (res.success) {
      await storage.saveUser(res.data);
      push("Main");
    } else {
      Toast.show(res.mess);
     
    }
  };

  useEffect(() => {
  
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        animated={false} 
        hidden={false} 
        networkActivityIndicatorVisible={false} 
        showHideTransition={'fade'} 
        backgroundColor="rgba(255,255,255,255)" 
        translucent={false} 
        barStyle={'dark-content'} 
      />
      <View style={{display: 'flex', alignItems: 'flex-start'}}>
        <Text
          style={{
            color: '#000',
            fontWeight: 'bold',
            fontSize: 20,
            marginTop: 20,
          }}>
          Welcome back!
        </Text>
        <View style={{flexDirection: 'row', marginBottom: 20}}>
          <Text style={{color: '#666'}}>Sign in to your account</Text>
        </View>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={text => {
            setUsername(text);
          }}
          placeholder="Enter your username"
          placeholderTextColor="#D1CDD0"></TextInput>

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={password}
          onChangeText={text => {
            setPassword(text);
          }}
          placeholder="Enter your password"
          placeholderTextColor="#D1CDD0"></TextInput>
        <TouchableOpacity
          style={{
            color: '#41D5FB',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width:windowWidth-40,
            marginTop:20
          }}>
          <Text style={{
            color: '#41D5FB',fontWeight:"bold"}}>Forgot your password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#7687ff',
            marginTop: 40,
            width: windowWidth - 40,
            flexDirection: 'row',
            height: 45,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            login();
          }}>
          <Text style={{fontSize: 18, color: '#fff'}}>Sign in</Text>
        </TouchableOpacity>
        <View style={{marginTop: 20, flexDirection: 'row'}}>
          <Text style={{color: '#666'}}>Don't have an account?</Text>
          <TouchableOpacity style={{color: '#41D5FB'}} onPress={()=>{
            props.navigation.push("Signup");
          }}>
            <Text style={{color: '#41D5FB'}}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    window: 300,
  },
  label: {
    color: '#000',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  bgImage: {
    width: windowWidth,
    height: windowHeight + 50,

    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'stretch',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    color: '#000',
    paddingLeft: 10,
    width:windowWidth-40
  },
  button: {
    marginTop: 20,
    width: 150,
    backgroundColor: '#fff',
    textAlign: 'center',
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button2: {
    marginTop: 20,
    width: 150,
    backgroundColor: '#fff',
    textAlign: 'center',
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeInput: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 30,
    color: '#000',
    paddingLeft: 10,
    width: 190,
  },
  select: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
});
