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

  const send = async () => {
    if (!email) {
      Toast.show('Please Enter your email.');
      return;
    }

    let res = await api.send_otp({
      recipient_email: email,
    });

    if (res) {
      push('SignupVerify', {
        type: 2,
        email: email,
        back: (email) => {
          props.route.params.refresh(email);
          props.navigation.goBack();
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
        animated={false} //Specify whether status bar changes should be animated. Currently, these styles are supported: backgroundColor, barStyle and hidden
        hidden={false} //Whether to hide the status bar.
        networkActivityIndicatorVisible={false} //Whether to show that the network is being used.
        showHideTransition={'fade'} //Only works on ios. The animation effect ('fade', 'slide') used when showing or hiding the status bar.
        backgroundColor="rgba(255,255,255,0)" // {'transparent'} background
        translucent={true} //Specifies whether the status bar is transparent. When set to true, the application will be drawn under the status bar (the so-called "immersive" - ​​partially covered by the status bar). Often used in conjunction with a status bar with a translucent background color.
        barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
      />
      <View style={{display: 'flex', alignItems: 'flex-start'}}>
        <Text
          style={{
            color: '#000',
            fontWeight: 'bold',
            fontSize: 20,
            marginTop: 20,
          }}>
          Change your email
        </Text>
        <View style={{flexDirection: 'row', marginBottom: 20}}>
          <Text style={{color: '#666'}}>
            Enter your new email and get a verification code?
          </Text>
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
            send();
          }}>
          <Text style={{fontSize: 18, color: '#fff'}}>Send</Text>
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
