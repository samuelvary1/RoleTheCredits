import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import RandomMovies from '../screens/RandomMovies';
import ActorMoviesScreen from '../screens/ActorMoviesScreen'; // Import ActorMoviesScreen

// Define the types for the navigation stack
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  RandomMovies: undefined;
  ActorMoviesScreen: {
    actorId: number;
    actorName: string;
    actorImageUrl: string;
  }; // Define parameters for ActorMoviesScreen
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="RandomMovies" component={RandomMovies} />
      <Stack.Screen 
        name="ActorMoviesScreen" 
        component={ActorMoviesScreen} 
        options={{ headerShown: true, title: 'Actor Movies' }} // Optionally show header with title
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
