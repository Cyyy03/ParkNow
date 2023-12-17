import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
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

  const [codes, setCodes] = useState([]);

  const [wrong, setWrong] = useState(false);
  console.log('navigation', props);
  let vtype = props.route.params.type;
  let email = props.route.params.email;

  useEffect(() => {}, []);
  // load data
  const confirm = async () => {
    let res = await api.verify_otp({
      email: email,
      otp: codes.join(''),
    });

    console.log('邮箱验证结果', res);

    if (res.indexOf('wrong') != -1) {
      //认证失败
      console.log('wrong');
      Toast.show(res);
      setWrong(true);
      return;
    }else{
      if (vtype === 1) {
        // 注册验证
        props.route.params.success();
        props.navigation.goBack();
      } else if (vtype === 2) {
        // 修改邮箱认证
        let user = await storage.getUser();
        let res = await api.update_email(user.id, {
          email: email,
        });
        if(res.success){
          Toast.show("Success!");
          props.route.params.back(email);
          props.navigation.goBack();
        }else{
          Toast.show(res.mess);
        }
      }
    }
  };

  const type = async val => {
    setWrong(false);
    if (codes.length < 6) {
      codes.push(val);
    } else {
      confirm();
    }
    setCodes([...codes]);
  };

  const delCode = async () => {
    setWrong(false);
    codes.splice(codes.length - 1, 1);
    setCodes([...codes]);
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
      <View style={{display: 'flex', flex: 1, alignItems: 'flex-start'}}>
        <View style={{paddingLeft: 20}}>
          <Text
            style={{
              color: '#000',
              fontWeight: 'bold',
              fontSize: 20,
              marginTop: 20,
            }}>
            Verify email address
          </Text>
          <View style={{flexDirection: 'row', marginBottom: 20, marginTop: 3}}>
            <Text style={{color: '#666'}}>
              Check your mailbox for our verification OTP
            </Text>
          </View>

          {wrong && <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{color: '#ff0000'}}>
              Incorrect code. Please try again.
            </Text>
          </View>}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
              marginTop: 20,
            }}>
            <Text style={styles.input}>{codes.length > 0 ? codes[0] : ''}</Text>
            <Text style={styles.input} keyboardType="numeric">
              {codes.length > 1 ? codes[1] : ''}
            </Text>
            <Text style={styles.input} keyboardType="numeric">
              {codes.length > 2 ? codes[2] : ''}
            </Text>
            <Text style={styles.input} keyboardType="numeric">
              {codes.length > 3 ? codes[3] : ''}
            </Text>
            <Text style={styles.input} keyboardType="numeric">
              {codes.length > 4 ? codes[4] : ''}
            </Text>
            <Text style={styles.input} keyboardType="numeric">
              {codes.length > 5 ? codes[5] : ''}
            </Text>
          </View>

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
            <Text style={{fontSize: 18, color: '#fff'}}>Verify</Text>
          </TouchableOpacity>
          <View style={{marginTop: 20}}>
            <Text style={{color: '#666'}}>Didn't receive OTP? Resend Code</Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: '#D1D5DB',
            padding: 20,
            gap: 10,
            marginTop: 20,
          }}>
          <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity
              onPress={() => {
                type(1);
              }}
              style={styles.keyitem}>
              <Text style={styles.keyvalue}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                type(2);
              }}
              style={styles.keyitem}>
              <Text style={styles.keyvalue}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                type(3);
              }}
              style={styles.keyitem}>
              <Text style={styles.keyvalue}>3</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity
              onPress={() => {
                type(4);
              }}
              style={styles.keyitem}>
              <Text style={styles.keyvalue}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                type(5);
              }}
              style={styles.keyitem}>
              <Text style={styles.keyvalue}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                type(6);
              }}
              style={styles.keyitem}>
              <Text style={styles.keyvalue}>6</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity
              onPress={() => {
                type(7);
              }}
              style={styles.keyitem}>
              <Text style={styles.keyvalue}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                type(8);
              }}
              style={styles.keyitem}>
              <Text style={styles.keyvalue}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                type(9);
              }}
              style={styles.keyitem}>
              <Text style={styles.keyvalue}>9</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {}}
              style={{flex: 1}}></TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                type(0);
              }}
              style={styles.keyitem}>
              <Text style={styles.keyvalue}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                delCode();
              }}
              style={{flex: 1, alignContent: 'center', alignItems: 'center'}}>
              <Image
                style={{width: 50, height: 30}}
                resizeMode="contain"
                source={require('../images/delete.png')}></Image>
            </TouchableOpacity>
          </View>
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
    borderRadius: 20,
    color: '#000',
    marginRight: 10,
    width: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
    fontWeight: 'bold',
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
  keyitem: {
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 50,
  },
  keyvalue: {
    fontSize: 22,
    color: '#000',
  },
});
