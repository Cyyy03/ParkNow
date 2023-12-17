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
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Polyline
} from 'react-native-maps';
import * as api from '../api/api';
import { getAddress } from '../utils/utils';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function App(props) {
  const {push} = props.navigation;
  const [positions, setPositions] = useState(null);
  const detail = props.route.params?.detail;
  const [navigateRoute, setNavigateRoute] = useState(null);

  useEffect(() => {
    if (detail) {
      getLatLng();
    }
  }, []);

  const getLatLng = async () => {
    let res = await api.directionsf(
      `start_address=${getAddress()}&end_address=${detail.Address}`,
    );

    setPositions(res);
    let res2 = await api.navigateRoute(
      res.source_lat,
      res.source_lng,
      res.dest_lat,
      res.dest_lng,
    );
    res2.route_path = res2.route_path.map(item=>{
      return {
        latitude:item[0],
        longitude:item[1],
      }
    });
    console.log('res=====', res);
    setNavigateRoute(res2);
  };

  const onPressMap = async () => {};

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
      <View style={{flex: 1}}>
        {positions && navigateRoute && (
          <MapView
            provider={
              Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            }
            initialRegion={
              positions
                ? {
                    latitude: positions.source_lat,
                    longitude: positions.source_lng,
                    latitudeDelta: 0.322,
                    longitudeDelta: 0.221,
                  }
                : null
            }
            zoomControlEnabled={true}
            onPress={onPressMap}
            style={{...StyleSheet.absoluteFillObject}}>
            <Polyline coordinates={navigateRoute.route_path} strokeWidth={5} strokeColor='#ff0000'></Polyline>
            <Marker
              title= {getAddress()}
              description=""
              pinColor="#f0d1a3"
              coordinate={{
                latitude: navigateRoute.start_point[0],
                longitude: navigateRoute.start_point[1],
              }}
            />
            <Marker
              title={detail?.Address}
              description=""
              pinColor="#f0d1a3"
              coordinate={{
                latitude: navigateRoute.end_point[0],
                longitude: navigateRoute.end_point[1],
              }}
            />
          </MapView>
        )}
      </View>

      <View
        style={{
          padding: 20,
          position: 'absolute',
          top: 50,
          left: 0,
          right: 0,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            // backgroundColor: '#fff',
            color: '#000',
            padding: 15,
            flex: 1,
            height: 50,
            borderRadius: 10,
          }}>
          <Text
            style={{
              color: '#000',
              fontWeight: 'bold',
            }}>
           
          </Text>
        </View>
        <Image
          source={require('../images/avatar.png')}
          style={{width: 80, height: 80, borderRadius: 40}}></Image>
      </View>

      <View
        style={{
          backgroundColor: '#000000aa',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          padding: 20,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <Text style={{fontSize: 17, color: '#fff'}}>Navigating to</Text>
        <Text style={{fontSize: 17, color: '#fff', fontWeight: 'bold'}}>
        {detail?.Address}
        </Text>
        <Text style={{fontSize: 17, color: '#fff', fontWeight: 'bold'}}>
          Distance: {detail?.distance}
        </Text>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#3879F0',
              flex: 1,
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
            onPress={() => {
              setShowShare(false);
            }}>
            <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#3879F0',
              flex: 1,
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setShowShare(false);
            }}>
            <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
              Cancel
            </Text>
          </TouchableOpacity>
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
