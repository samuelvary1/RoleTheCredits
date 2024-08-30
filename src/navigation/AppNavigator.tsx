import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import RandomMovies from '../screens/RandomMovies';
import ActorMoviesScreen from '../screens/ActorMoviesScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import LockedInPairScreen from '../screens/LockedInPairScreen';
import GameScreen from '../screens/GameScreen';
import MoviePairDetailsScreen from '../screens/MoviePairDetailsScreen';
import ConnectionPathScreen from '../screens/ConnectionPathScreen';
import { Actor, Movie, PathNode } from '../types';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  RandomMovies: undefined;
  ActorMoviesScreen: {
    actorId: number;
    actorName: string;
    actorImageUrl?: string;
    movieA: Movie;
    movieB: Movie;
  };
  MovieDetailsScreen: {
    movieId: number;
    movieTitle: string;
    moviePoster: string;
    movieActors: Actor[];
    movieA: Movie;
    movieB: Movie;
  };
  LockedInPairScreen: {
    movieA: Movie;
    movieB: Movie;
  };
  GameScreen: {
    movieA: Movie;
    movieB: Movie;
    selectedActorA?: Actor | null;
    selectedActorB?: Actor | null;
    currentMovieA?: Movie | null;
    currentMovieB?: Movie | null;
  };
  MoviePairDetailsScreen: {
    movieA: Movie;
    movieB: Movie;
    selectedActorA?: Actor | null;
    selectedActorB?: Actor | null;
    currentMovieA?: Movie | null;
    currentMovieB?: Movie | null;
  };
  ConnectionPathScreen: {
    path: PathNode[];
    startNode: PathNode;
    targetNode: PathNode;
    moves: number;
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
      <Stack.Screen name="LockedInPairScreen" component={LockedInPairScreen} />
      <Stack.Screen name="GameScreen" component={GameScreen} />
      <Stack.Screen name="MoviePairDetailsScreen" component={MoviePairDetailsScreen} />
      <Stack.Screen name="ConnectionPathScreen" component={ConnectionPathScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
