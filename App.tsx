import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import RandomMovies from './src/screens/RandomMovies';
import ActorMoviesScreen from './src/screens/ActorMoviesScreen';
import MovieDetailsScreen from './src/screens/MovieDetailsScreen';
import LockedInPairScreen from './src/screens/LockedInPairScreen';
import GameScreen from './src/screens/GameScreen';

// Define the types for the navigation stack
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  RandomMovies: undefined;
  ActorMoviesScreen: {
    actorId: number;
    actorName: string;
    actorImageUrl: string;
    movieB: { id: number; title: string; posterPath: string };
  };
  MovieDetailsScreen: {
    movieId: number;
    movieTitle: string;
    moviePoster: string;
    movieB: { id: number; title: string; posterPath: string };
  };
  LockedInPairScreen: {
    movieA: { title: string; posterPath: string };
    movieB: { title: string; posterPath: string };
  };
  GameScreen: {
    movieA: { id: number; title: string; posterPath: string };
    movieB: { id: number; title: string; posterPath: string };
  };
};

// Create the stack navigator
const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,  // Optionally hide headers globally
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="RandomMovies" component={RandomMovies} />
        <Stack.Screen name="ActorMoviesScreen" component={ActorMoviesScreen} />
        <Stack.Screen name="MovieDetailsScreen" component={MovieDetailsScreen} />
        <Stack.Screen name="LockedInPairScreen" component={LockedInPairScreen} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
