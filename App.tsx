import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import RandomMovies from './src/screens/RandomMovies';
import ActorMoviesScreen from './src/screens/ActorMoviesScreen';
import MovieDetailsScreen from './src/screens/MovieDetailsScreen';
import LockedInPairScreen from './src/screens/LockedInPairScreen';
import GameScreen from './src/screens/GameScreen';
import ConnectionPathScreen from './src/screens/ConnectionPathScreen';
import AccountOverviewScreen from './src/screens/AccountOverviewScreen';
import CompletedConnectionsScreen from './src/screens/CompletedConnectionsScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';
import { RootStackParamList } from './src/navigation/AppNavigator';
import { WatchlistProvider } from './src/context/WatchlistContext';
import { CompletedConnectionsProvider } from './src/context/CompletedConnectionsContext';
import { SubscriptionProvider } from './src/context/SubscriptionProvider';


const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WatchlistProvider userId={null}>
          <CompletedConnectionsProvider>
            <SubscriptionProvider>
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="SignUp" component={SignUpScreen} />
                  <Stack.Screen name="RandomMovies" component={RandomMovies} />
                  <Stack.Screen name="ActorMoviesScreen" component={ActorMoviesScreen} />
                  <Stack.Screen name="MovieDetailsScreen" component={MovieDetailsScreen} />
                  <Stack.Screen name="LockedInPairScreen" component={LockedInPairScreen} />
                  <Stack.Screen name="GameScreen" component={GameScreen} />
                  <Stack.Screen name="ConnectionPathScreen" component={ConnectionPathScreen} />
                  <Stack.Screen name="AccountOverviewScreen" component={AccountOverviewScreen} />
                  <Stack.Screen name="WatchlistScreen" component={WatchlistScreen} />
                  <Stack.Screen name="CompletedConnectionsScreen" component={CompletedConnectionsScreen} />
                  <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </SubscriptionProvider>
          </CompletedConnectionsProvider>
        </WatchlistProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
