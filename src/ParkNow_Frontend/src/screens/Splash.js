import React, { useEffect } from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  Text,
  View
} from 'react-native';
import * as storage from '../utils/storage';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function App(props) {
  useEffect(() => {
    setTimeout(()=>{
        
        init();
    },1000)
  }, []);

  const init = async ()=>{
    let guide = await storage.getGuide();
    if(!guide){
      props.navigation.push("Guide");
    }else{
      let user = await storage.getUser();
      if(user){
        props.navigation.push("Main");
      }else{
        props.navigation.push("LoginHome");
      }
    }
   
  }

  return (
    <View
      style={{
        backgroundColor: '#3879F0',
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
      <View style={{flex: 1,justifyContent:"center"}}>
        <Image
          source={require('../images/wenhao.png')}
          style={{width: 150, height: 150}}></Image>
      </View>
      <Text style={{color: '#fff',marginBottom:30,fontSize:17}}>ParkNow</Text>
    </View>
  );
}
