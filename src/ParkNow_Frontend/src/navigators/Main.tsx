import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Home from "../screens/Home";
import Map from "../screens/Map";
import Fav from "../screens/Fav";
import Mine from "../screens/Mine";

import { Image, Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

// @refresh reset
const MainNavigator = () => {


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#000000",
        tabBarShowLabel:false,
        tabBarIcon: ({ focused, color, size }) => {

          if (route.name === 'Home') {
            return focused ? <View style={{ backgroundColor: "#ecf2fd", borderRadius: 30, paddingHorizontal: 15, paddingVertical: 5 }}><Image
              source={
                require("../images/tabs/home_sel.png")
              }
              resizeMode='contain'
              style={{ width: 20, height: 20 }}
            /></View> : <Image
              source={
                require("../images/tabs/home.png")
              }
              resizeMode='contain'
              style={{ width: 20, height: 20 }}
            />
          } else if (route.name === 'Guiji') {
            return focused ? <View style={{ backgroundColor: "#ecf2fd", borderRadius: 30, paddingHorizontal: 15, paddingVertical: 5}}><Image
              source={
                require("../images/tabs/guiji_sel.png")
              }
              resizeMode='contain'
              style={{ width: 20, height: 20 }}
            /></View> : <Image
              source={
                require("../images/tabs/guiji.png")
              }
              resizeMode='contain'
              style={{ width: 20, height: 20 }}
            />

          }else if (route.name === 'Fav') {
            return focused ? <View style={{ backgroundColor: "#ecf2fd", borderRadius: 30, paddingHorizontal: 15, paddingVertical: 5 }}><Image
              source={
                require("../images/tabs/fav_sel.png")
              }
              resizeMode='contain'
              style={{ width: 20, height: 20 }}
            /></View> : <Image
              source={
                require("../images/tabs/fav.png")
              }
              resizeMode='contain'
              style={{ width: 20, height: 20 }}
            />

          }else if (route.name === 'Mine') {
            return focused ? <View style={{ backgroundColor: "#ecf2fd", borderRadius: 30, paddingHorizontal: 15, paddingVertical: 5 }}><Image
              source={
                require("../images/tabs/mine_sel.png")
              }
              resizeMode='contain'
              style={{ width: 20, height: 20 }}
            /></View> : <Image
              source={
                require("../images/tabs/mine.png")
              }
              resizeMode='contain'
              style={{ width: 20, height: 20 }}
            />

          }
        },
        header: () => null,
        tabBarLabel: ({ focused, color }) => {

          return <Text style={{ color }}></Text>;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Guiji" component={Map} />
      <Tab.Screen name="Fav" component={Fav} />
      <Tab.Screen name="Mine" component={Mine} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
