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
  const [email, setEmail] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [codeAddr, setCodeAddr] = useState('');

  const [types, setTypes] = useState([
    {
      label: '普通用户',
      value: 0,
    },
    {
      label: '用人单位',
      value: 1,
    },
  ]);
  const signup = async () => {
    if (!email) {
      Toast.show('Please Enter your email.');
      return;
    }
    if (!username) {
      Toast.show('Please Enter your username.');
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

    let res = await api.send_otp({
      recipient_email: email,
    });

    if (res) {
      push('SignupVerify', {
        type: 1,
        email: email,
        success: async () => {
          let res = await api.register({
            username: username,
            password: password,
            email: email,
          });
          if (res.success) {
            Toast.show('Success!');
            push('Login');
          } else {
            Toast.show(res.mess);
          }
        },
      });
    } else {
      Toast.show(res.message);
    }

    console.log('res', res);

    // console.log('res========', res);
    // if (res.status == 200) {

    // } else {
    //   Toast.show(res.msg);
    //   getImageCode();
    // }
  };

  useEffect(() => {
    load();
  }, []);
  // load data
  const load = async () => {
    let user = await storage.getUser();
  };

  const getImageCode = async () => {
    let url = 'http://tao.siqint.com/api/Base/captcha';
    let res = await api.getImagecode(url);

    console.log('res===', url);

    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(res);
    fileReaderInstance.onload = () => {
      let base64data = fileReaderInstance.result;
      setCodeAddr(base64data);
    };

    // setCodeAddr(URL.createObjectURL(res));
    // console.log("ImageCode", res);
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
          Create your account
        </Text>
        <View style={{flexDirection: 'row', marginBottom: 20}}>
          <Text style={{color: '#666'}}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              push('Login');
            }}>
            <Text style={{color: '#41D5FB'}}>Log in</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          placeholder="Enter your email"
          onChangeText={text => {
            setEmail(text);
          }}
          placeholderTextColor="#D1CDD0"></TextInput>

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

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={cpassword}
          onChangeText={text => {
            setCpassword(text);
          }}
          placeholder="Enter your password"
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
            signup();
          }}>
          <Text style={{fontSize: 18, color: '#fff'}}>Signup</Text>
        </TouchableOpacity>
        <View style={{marginTop: 20}}>
          <Text style={{color: '#666'}}>
            By clicking "Sign Up" you agree to our terms and conditions as well
            as our privacy policy
          </Text>
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
    window: windowWidth - 40,
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
    width: windowWidth - 40,
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
