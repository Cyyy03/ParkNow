import React, { useEffect } from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function App(props) {
  useEffect(() => {}, []);

  const signup = () => {
    props.navigation.push('Signup');
  };

  const login = () => {
    props.navigation.push('Login');
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <StatusBar
        animated={false} 
        hidden={false} 
        networkActivityIndicatorVisible={false} 
        showHideTransition={'fade'} 
        barStyle={'light-content'} 
      />
      <Image
        source={require('../images/loginhome.png')}
        style={{position: 'absolute', width: windowWidth, height: windowHeight+50}}
        resizeMode="cover"></Image>
      <View style={{flex:1,paddingTop:80}}>
        <Image
          source={require('../images/logo.png')}
          style={{width: 100, height: 150}}
          resizeMode="cover"></Image>
        <Text style={{color: '#000', fontSize: 20, fontWeight: 'bold'}}>
          ParkNow
        </Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 40,
          paddingBottom: 40,
        }}>
        <TouchableOpacity
          onPress={() => {
            signup();
          }}
          style={{
            backgroundColor: '#3879F0',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
          }}>
          <Text style={{color: '#fff'}}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            login();
          }}
          style={{
            borderColor: '#fff',
            borderWidth:1,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            marginLeft:20
          }}>
          <Text style={{color: '#fff'}}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
