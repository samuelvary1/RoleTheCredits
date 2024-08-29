import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import RandomMovies from '../screens/RandomMovies';
import ActorMoviesScreen from '../screens/ActorMoviesScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen'; // Import MovieDetailsScreen

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  RandomMovies: undefined;
  ActorMoviesScreen: {
    actorId: number;
    actorName: string;
    actorImageUrl: string;
    movieB: {
      id: number;
      title: string;
      posterPath: string;
    };
  };
  MovieDetailsScreen: {
    movieId: number;
    movieTitle: string;
    moviePoster: string;
    movieB: {
      id: number;
      title: string;
      posterPath: string;
    };
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="RandomMovies" component={RandomMovies} />
      <Stack.Screen name="ActorMoviesScreen" component={ActorMoviesScreen} />
      <Stack.Screen name="MovieDetailsScreen" component={MovieDetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
