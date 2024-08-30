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
import { RootStackParamList } from './src/navigation/AppNavigator';
import MoviePairDetailsScreen from './src/screens/MoviePairDetailsScreen';
import ConnectionPathScreen from './src/screens/ConnectionPathScreen';

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
        <Stack.Screen name="MoviePairDetailsScreen" component={MoviePairDetailsScreen} />
        <Stack.Screen name="ConnectionPathScreen" component={ConnectionPathScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
