import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as api from '../api/api';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function App(props) {
  const {push} = props.navigation;
  let {id,distance} = props.route.params;


  const [showShare, setShowShare] = useState(false);

  const [detail, setDetail] = useState({
   
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    console.log("Detail",id);
    let res = await api.getCarpark(id);
   
    res.carpark.image = "https://img-md.veimg.cn/meadincms/img5/2023/5/91DC8B9373434160AD90F5D19B45E2FF.jpg";
    setDetail({
      ...res.carpark,
      distance:distance
    });

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
          height: windowWidth * 0.7,
        }}>
        <Image
          source={{uri: detail.image}}
          style={{
            width: windowWidth,
            height: windowWidth * 0.7,
            position: 'absolute',
          }}></Image>
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}>
          <Image
            source={require('../images/backwhite.png')}
            style={{width: 20, height: 20, marginTop: 50, marginLeft: 10}}
            resizeMode="contain"></Image>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingHorizontal: 15,
          marginTop: -30,
          paddingVertical: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomColor: '#eee',
            borderBottomWidth: 1,
            paddingBottom: 10,
          }}>
          <View style={{flex: 1}}>
            <Text
              style={{
                color: '#000',
                fontWeight: 'bold',
                fontSize: 20,
              }}>
              {detail.CarParkName}
            </Text>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Image
                source={require('../images/location.png')}
                style={{width: 25, height: 25}}
                resizeMode="contain"></Image>
              <Text
                style={{
                  color: '#aaa',
                  fontSize: 14,
                  marginRight: 10,
                }}>
                {detail.Address},
              </Text>
              <Text
                style={{
                  color: '#aaa',
                  fontSize: 14,
                }}>
                {detail.code}
              </Text>
            </View>
          </View>
          <Image
            source={require('../images/fav.png')}
            style={{width: 25, height: 25}}
            resizeMode="contain"></Image>
          <TouchableOpacity onPress={()=>{
            setShowShare(true);
          }}>
            <Image
              source={require('../images/share.png')}
              style={{width: 25, height: 25}}
              resizeMode="contain"></Image>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, paddingTop: 20}}>
          <ScrollView>
            <View style={styles.row}>
              <Text style={styles.label}>Availability</Text>
              <Text style={styles.value}>{detail.Availability}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Saturday Min</Text>
              <Text style={styles.value}>{detail.satdayMin}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Saturday Rate</Text>
              <Text style={styles.value}>{detail.satdayRate}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Sunday Min</Text>
              <Text style={styles.value}>{detail.sunPHMin}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Sunday Rate</Text>
              <Text style={styles.value}>{detail.sunPHRate}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Weekday Min</Text>
              <Text style={styles.value}>{detail.weekdayMin}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Weekday Rate</Text>
              <Text style={styles.value}>{detail.weekdayRate}</Text>
            </View>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <TouchableOpacity
                onPress={()=>{
                  push("Map",{detail:detail});
                }}
                style={{
                  backgroundColor: '#3879F0',
                  width: 200,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
                  See Nearest Route
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
      {showShare && (
        <View
          style={{
            backgroundColor: '#000000aa',
            justifyContent: 'flex-end',
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              padding: 20,
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', width: '100%'}}>
              <View style={{marginBottom: 10}}>
                <Image
                  source={require('../images/copy.png')}
                  resizeMode="contain"
                  style={{width: 30, height: 30}}></Image>
                <Text style={{fontWeight: 'bold', marginTop: 10}}>Copy</Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#3879F0',
                width: 200,
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }} onPress={()=>{
                setShowShare(false);
              }}>
              <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fcf6f6',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    window: 300,
    justifyContent: 'space-between',
  },
  label: {
    color: '#999999',
    fontWeight: 'bold',
    fontSize: 18,
  },
  value: {
    color: '#999999',
    fontWeight: 'bold',
    fontSize: 18,
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
