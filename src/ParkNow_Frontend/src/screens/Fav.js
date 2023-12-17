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
import { Card } from 'react-native-shadow-cards';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function App(props) {
  const {push} = props.navigation;
  const shadowOpt = {
    width: windowWidth - 40,
    height: 200,
    color: '#000',
    border: 2,
    radius: 3,
    opacity: 0.2,
    x: 0,
    y: 3,
    style: {marginVertical: 5},
  };
  const [list, setList] = useState([
    {
      image:
        'https://img-md.veimg.cn/meadincms/img5/2023/5/91DC8B9373434160AD90F5D19B45E2FF.jpg',
      name: 'Metropolis Tower One',
      num: 22,
      distance: '5.7Km',
    },
    {
      image:
        'https://ptf.flyertrip.com/forum/2021/03/02/212826OSDTCXIVBZKRPZMC.png',
      name: 'Rochester Commons',
      num: 0,
      distance: '7.6Km',
    },
    {
      image:
        'https://ptf.flyertrip.com/forum/2021/03/02/212826OSDTCXIVBZKRPZMC.png',
      name: 'Rochester Commons',
      num: 0,
      distance: '7.6Km',
    },
  ]);

  useEffect(() => {
    load();
  }, []);
  // load data
  const load = async () => {};

  const gotoSearch = () => {
    push('Search');
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
          alignItems: 'flex-start',
          paddingTop: 60,
          paddingBottom: 30,
          paddingHorizontal: 20,
        }}>
        <Text
          style={{
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: 20,
            marginBottom:20
          }}>
          Your Favorites
        </Text>
        <TouchableOpacity
          onPress={() => {
            gotoSearch();
          }}
          style={{
            flexDirection: 'row',
            width: '100%',
            backgroundColor: '#fff',
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: 'center',
          }}>
          <Image
            source={require('../images/search.png')}
            style={{width: 30, height: 30, borderRadius: 25}}
            resizeMode="contain"></Image>
          <Text
            style={{flex: 1, fontSize: 16, fontWeight: 'bold', color: '#aaa'}}>
            Search within favorites
          </Text>
          
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingHorizontal: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: '#000',
              fontWeight: 'bold',
              padding: 10,
              fontSize: 20,
            }}>
            Favorited
          </Text>
          <Image
            source={require('../images/more.png')}
            style={{width: 20, height: 20}}></Image>
        </View>
        <View style={{flex: 1}}>
          <ScrollView>
            {list.map((item, i) => {
              return (
                <Card
                  key={i}
                  style={{margin: 10, paddingBottom: 10, borderRadius: 10}}
                  elevation={3}
                  backgroundColor="#fff"
                  opacity={0.3}>
                  <TouchableOpacity
                    onPress={() => {
                      push('Detail', {id: 1});
                    }}
                    style={{backgroundColor: '#fff'}}>
                    <Image
                      source={{uri: item.image}}
                      style={{
                        height: 162,
                        width: '100%',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}></Image>
                    <View style={{padding: 10}}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: '#000',
                          fontWeight: 'bold',
                        }}>
                        {item.name}
                      </Text>
                      <View style={{flexDirection: 'row', marginTop: 15}}>
                        <Text
                          style={{
                            color: '#2EBD2E',
                            fontWeight: 'bold',
                            fontSize: 16,
                          }}>
                          {item.num > 0 ? item.num : 'No'} Slots Available
                        </Text>
                        <Text
                          style={{
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: 16,
                            marginLeft: 30,
                          }}>
                          {item.distance}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Card>
              );
            })}
          </ScrollView>
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
  },
  label: {
    color: '#fff',
    width: 80,
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
