import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import EZSwiper from 'react-native-ezswiper';
import * as storage from '../utils/storage';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function App(props) {

  const [index,setIndex] = useState(0);
  useEffect(() => {

  }, []);

  const swiperRef = useRef(null);

  

  const next =  async() => {
    if(index>=2){
      await storage.saveGuide();
      props.navigation.push('LoginHome');
    }else{
      swiperRef.current.scrollTo(index+1,true);
      setIndex(index+1);
    }
    
   
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
        backgroundColor="rgba(255,255,255,0)" 
        translucent={true} 
        barStyle={'dark-content'} 
      />
      <View style={{flex: 1, justifyContent: 'center'}}>
        <EZSwiper
          ref={swiperRef}
          style={{width: windowWidth, backgroundColor: 'white'}}
          dataSource={[1, 2, 3]}
          width={windowWidth}
          loop={false}
          height={300}
          index={index} 
          renderRow={val => {
            console.log('val', val);
            if (val == 1) {
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../images/guide1.png')}
                    style={{width: 150, height: 150}}></Image>
                  <Text
                    style={{fontSize: 20, color: '#000', fontWeight: 'bold'}}>
                    Find Parking Spots
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#757F8c',
                      marginTop: 0,
                      padding: 20,
                    }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labores
                  </Text>
                </View>
              );
            } else if (val == 2) {
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../images/guide2.png')}
                    style={{width: 150, height: 150}}></Image>
                  <Text
                    style={{fontSize: 20, color: '#000', fontWeight: 'bold'}}>
                    Seamless Navigation
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#757F8c',
                      marginTop: 0,
                      padding: 20,
                    }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  </Text>
                </View>
              );
            } else {
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../images/guide3.png')}
                    style={{width: 150, height: 150}}></Image>
                  <Text
                    style={{fontSize: 20, color: '#000', fontWeight: 'bold'}}>
                    Know Your Expenses
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#757F8c',
                      marginTop: 0,
                      padding: 20,
                    }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  </Text>
                </View>
              );
            }
          }}
          onPress={this.onPressRow}
        />
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 40,
          marginBottom: 40,
        }}>
        <Text style={{color: '#8193AE', fontSize: 17}}>Skip</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 6,
              backgroundColor: index==0?'#4978e8':'#a8b8d0',
              marginRight: 15,
            }}></View>
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 6,
              backgroundColor: index==1?'#4978e8':'#a8b8d0',
              marginRight: 15,
            }}></View>
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 6,
              backgroundColor: index==2?'#4978e8':'#a8b8d0',
              marginRight: 15,
            }}></View>
        </View>
        <TouchableOpacity
          onPress={() => {
            next();
          }}
          style={{
            backgroundColor: '#3879F0',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
          }}>
          <Text style={{color: '#fff'}}>Next</Text>
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
