import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as api from '../api/api';
import { setAddress } from '../utils/utils';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function App(props) {
  const {push} = props.navigation;

  const [list, setList] = useState([]);
  const [searchkey, setSearchkey] = useState([]);

  useEffect(() => {}, []);
  // load data
  const search = async () => {
    let res = await api.search('50 Nanyang Avg 639798', 15);
    console.log('search res==', res.nearby_carparks.length);
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
      <View
        style={{
          alignItems: 'center',
          paddingTop: 60,
          paddingBottom: 30,
          paddingHorizontal: 20,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}>
          <Image
            source={require('../images/back.png')}
            style={{width: 25, height: 25, borderRadius: 25}}></Image>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: '#fff',
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 10,
            marginLeft: 10,
            alignItems: 'flex-start',
          }}>
          <Image
            source={require('../images/search.png')}
            style={{width: 30, height: 30, borderRadius: 25}}
            resizeMode="contain"></Image>
          <GooglePlacesAutocomplete
            height={30}
            placeholder="Search"
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              setAddress(data.description);
              props.route.params.onGoBack();
              props.navigation.goBack();
              console.log("search",data, details);
            }}
            query={{
              key: 'AIzaSyAA0p1K8FyfuhCf9B52iQmMPZnjU3FsxZA',
              language: 'en',
            }}
          />
          {/* <Image
            source={require('../images/location.png')}
            style={{width: 20, height: 20, borderRadius: 25}}></Image> */}
        </View>
      </View>

      {/* <View
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
            Results ({list.length})
          </Text>
          <Image
            source={require('../images/filter.png')}
            style={{width: 20, height: 20}}></Image>
        </View>
        <View style={{flex: 1, paddingTop: 20}}>
          <ScrollView>
            {list.map((item, i) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    push('Main');
                  }}
                  key={i}
                  style={{backgroundColor: '#fff', flexDirection: 'row'}}>
                  <Image
                    source={require('../images/star.png')}
                    style={{width: 20, height: 20}}
                    resizeMode="contain"></Image>
                  <View
                    style={{
                      marginLeft: 10,
                      borderBottomColor: '#eee',
                      paddingBottom: 10,
                      marginBottom: 10,
                      borderBottomWidth: 1,
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        color: '#000',
                        fontSize: 16,
                      }}>
                      {item.name}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          color: '#888',
                          fontSize: 14,
                        }}>
                        {item.address},
                      </Text>
                      <Text
                        style={{
                          color: '#888',
                          fontSize: 14,
                          marginLeft: 10,
                        }}>
                        {item.code}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View> */}
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
