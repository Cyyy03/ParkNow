import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';


import Login from '../screens/Login';
import MainNavigator from './Main';
import Splash from '../screens/Splash';
import Guide from '../screens/Guide';
import LoginHome from '../screens/LoginHome';
import Signup from '../screens/Signup';
import SignupVerify from '../screens/SignupVerify';
import Search from '../screens/Search';
import Detail from '../screens/Detail';
import Map from '../screens/Map';
import ChangePassword from '../screens/ChangePassword';
import ChangeEmail from '../screens/ChangeEmail';

const Stack = createStackNavigator();

// @refresh reset
const ApplicationNavigator = () => {

  const navigationRef = useNavigationContainerRef();


  return (

    <NavigationContainer ref={navigationRef}>
      <StatusBar barStyle={'light-content'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash"  component={Splash} />
        <Stack.Screen name="Main" component={MainNavigator} />
        <Stack.Screen name="Login" options={{ headerShown: true,title:"" }} component={Login} />
        <Stack.Screen name="Guide" component={Guide} />
        <Stack.Screen name="LoginHome" component={LoginHome} />
        <Stack.Screen name="Signup" options={{ headerShown: true,title:"" }} component={Signup} />
        <Stack.Screen name="SignupVerify" options={{ headerShown: true }} component={SignupVerify} />
        <Stack.Screen name="Search" options={{ headerShown: false }} component={Search} />
        <Stack.Screen name="Detail" options={{ headerShown: false }} component={Detail} />
        <Stack.Screen name="Map" options={{ headerShown: false }} component={Map} />
        <Stack.Screen name="ChangeEmail" options={{ headerShown: true,title:"" }} component={ChangeEmail} />
        <Stack.Screen name="ChangePassword" options={{ headerShown: true,title:"" }} component={ChangePassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ApplicationNavigator;
