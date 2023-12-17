import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import * as storage from '../utils/storage';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function App(props) {
  const {push} = props.navigation;
  const [user, setUser] = useState({});

  useEffect(() => {
    load();
  }, []);
  // load data
  const load = async () => {
    let res = await storage.getUser();
    setUser(res);
    
  };

  const exit = async () => {
    await storage.clear();
    push('LoginHome');
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
        barStyle={'light-content'} 
      />
      <View
        style={{
          alignItems: 'center',
          paddingTop: 60,
          paddingBottom: 30,
          paddingHorizontal: 20,
        }}>
        <Image
          source={require('../images/avatar.png')}
          style={{width: 120, height: 120, borderRadius: 60}}></Image>

        <Text style={{fontSize: 25, color: '#fff', fontWeight: 'bold'}}>
        {user.username}
        </Text>
        <TouchableOpacity
          onPress={() => {
            exit();
          }}>
          <Text style={{fontSize: 15, color: '#eee', marginLeft: 10}}>
            exit
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingHorizontal: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={require('../images/account.png')}
            style={{width: 35, height: 35}}></Image>
          <Text
            style={{
              color: '#000',
              fontWeight: 'bold',
              padding: 10,
              fontSize: 20,
            }}>
            My Account
          </Text>
        </View>
        <View style={{flex: 1}}>
          <View style={styles.row}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{user.username}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
            <TouchableOpacity
              onPress={() => {
                push('ChangeEmail',{
                  refresh:async (email)=>{
                    user.email = email;
                    await storage.saveUser(user);
                    load();
                  }
                });
              }}>
              <Image
                source={require('../images/edit.png')}
                style={{width: 20, height: 20, borderRadius: 60}}></Image>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Password</Text>
            <TextInput secureTextEntry={true} style={styles.value} value={user.password}></TextInput>
            <TouchableOpacity
              onPress={() => {
                push('ChangePassword');
              }}>
              <Image
                source={require('../images/edit.png')}
                style={{width: 20, height: 20, borderRadius: 60}}></Image>
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
    backgroundColor: '#4978e8',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    window: 300,
    justifyContent: 'space-between',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  label: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  value: {
    color: '#aaa',
    fontSize: 20,
    flex: 1,
    textAlign: 'right',
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
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 30,
    color: '#000',
    paddingLeft: 10,
    width: 300,
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
