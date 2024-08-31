import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type AccountOverviewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AccountOverviewScreen'>;

type Props = {
  navigation: AccountOverviewScreenNavigationProp;
};

const AccountOverviewScreen: React.FC<Props> = ({ navigation }) => {
  const [userData, setUserData] = useState<{ firstName: string; lastName: string; email: string }>({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth().currentUser;
      if (user) {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserData({
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            email: user.email || '',
          });
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Overview</Text>

      {/* User Info */}
      <Text style={styles.userInfo}>{`${userData.firstName} ${userData.lastName}`}</Text>
      <Text style={styles.userInfo}>{userData.email}</Text>

      {/* Button to navigate to Watchlist */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('WatchlistScreen', { watchlist: [], removeFromWatchlist: () => {} })}
      >
        <Text style={styles.buttonText}>View Watchlist</Text>
      </TouchableOpacity>
      
      {/* Button to navigate to Completed Connections */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('CompletedConnectionsScreen', { completedConnections: [] })}
      >
        <Text style={styles.buttonText}>View Completed Connections</Text>
      </TouchableOpacity>
            
      {/* Button to navigate back to RandomMovies */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('RandomMovies')}
      >
        <Text style={styles.buttonText}>Back to Movies</Text>
      </TouchableOpacity>

      {/* Button to navigate to Login */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  userInfo: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AccountOverviewScreen;
