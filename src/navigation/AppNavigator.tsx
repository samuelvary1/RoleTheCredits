import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import RandomMovies from '../screens/RandomMovies';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  RandomMovies: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="RandomMovies" component={RandomMovies} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
