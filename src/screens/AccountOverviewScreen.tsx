import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import auth from '@react-native-firebase/auth';

type AccountOverviewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AccountOverviewScreen'>;
type AccountOverviewScreenRouteProp = RouteProp<RootStackParamList, 'AccountOverviewScreen'>;

type Props = {
  navigation: AccountOverviewScreenNavigationProp;
  route: AccountOverviewScreenRouteProp;
};

const AccountOverviewScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogout = () => {
    auth().signOut().then(() => {
      navigation.replace('Login'); // Navigate back to the login screen after logout
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Overview</Text>
      <Button title="View Watchlist" onPress={() => navigation.navigate('WatchlistScreen')} />
      <Button title="View Completed Connections" onPress={() => navigation.navigate('CompletedConnectionsScreen')} />
      <Button title="Change Password" onPress={() => navigation.navigate('ChangePasswordScreen')} />
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default AccountOverviewScreen;
