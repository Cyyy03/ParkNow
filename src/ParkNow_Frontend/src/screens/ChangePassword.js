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
  const [opassword, setOpassword] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  const confirm = async () => {
    if (!opassword) {
      Toast.show('Please Enter your existing password.');
      return;
    }
    if (!password) {
      Toast.show('Please Enter your password.');
      return;
    }
    if (!cpassword) {
      Toast.show('Please Enter your confirm password.');
      return;
    }
    if (cpassword != password) {
      Toast.show('Two type password is not equal.');
      return;
    }
    let user = await storage.getUser();
    let res = await api.update_password(user.id,{
      password: password
    });

    if (res.success) {
      Toast.show("Success!");
      await storage.clear();
      push("Login");
    } else {
      Toast.show(res.message);
    }

    console.log('res', res);
  };

  useEffect(() => {
    load();
  }, []);
  // load data
  const load = async () => {
    let user = await storage.getUser();
  };


  return (
    <View style={styles.container}>
      <StatusBar
        animated={false} 
        hidden={false} 
        networkActivityIndicatorVisible={false} 
        showHideTransition={'fade'} 
        backgroundColor="rgba(255,255,255,0)" 
        translucent={true} 
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
          Change your password
        </Text>
        <View style={{flexDirection: 'row', marginBottom: 20}}>
          <Text style={{color: '#666'}}>
            Enter your old and new passwords to change
          </Text>
        </View>
        <Text style={styles.label}>Existing Password</Text>
        <TextInput
          style={styles.input}
          value={opassword}
          secureTextEntry={true}
          placeholder="Enter your existing password"
          onChangeText={text => {
            setOpassword(text);
          }}
          placeholderTextColor="#D1CDD0"></TextInput>

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={password}
          onChangeText={text => {
            setPassword(text);
          }}
          placeholder="Enter your password"
          placeholderTextColor="#D1CDD0"></TextInput>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={cpassword}
          onChangeText={text => {
            setCpassword(text);
          }}
          placeholder="Confirm your new password"
          placeholderTextColor="#D1CDD0"></TextInput>

        <TouchableOpacity
          style={{
            backgroundColor: '#7687ff',
            marginTop: 80,
            width: windowWidth - 40,
            flexDirection: 'row',
            height: 45,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            confirm();
          }}>
          <Text style={{fontSize: 18, color: '#fff'}}>Change</Text>
        </TouchableOpacity>
       
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
    width: windowWidth-40,
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
