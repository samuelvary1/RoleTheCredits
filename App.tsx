import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import RandomMovies from './src/screens/RandomMovies';

// Define the types for the navigation stack
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  RandomMovies: undefined;
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;