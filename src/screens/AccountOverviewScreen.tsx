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

  const handleLogout = () => {
    auth().signOut();
    navigation.navigate('Login', { resetFields: true });  // Pass resetFields via route.params
  };

  // New function to handle subscription button press
  const handleSubscriptionPress = () => {
    navigation.navigate('SubscriptionScreen');  // Replace with your actual subscription screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Overview</Text>

      {/* User Info */}
      <Text style={styles.userInfo}>{`${userData.firstName} ${userData.lastName}`}</Text>
      <Text style={styles.userInfo}>{userData.email}</Text>

      <View style={styles.gridContainer}>
        {/* Watchlist */}
        <TouchableOpacity 
          style={[styles.square, styles.pastelBlue]}
          onPress={() => navigation.navigate('WatchlistScreen')}
        >
          <Text style={styles.squareText}>View Watchlist</Text>
        </TouchableOpacity>

        {/* Completed Connections */}
        <TouchableOpacity 
          style={[styles.square, styles.pastelGreen]}
          onPress={() => navigation.navigate('CompletedConnectionsScreen')}
        >
          <Text style={styles.squareText}>View Completed Connections</Text>
        </TouchableOpacity>

        {/* Back to Movies */}
        <TouchableOpacity 
          style={[styles.square, styles.pastelPink]}
          onPress={() => navigation.navigate('RandomMovies')}
        >
          <Text style={styles.squareText}>Back to Movies</Text>
        </TouchableOpacity>

        {/* Log Out */}
        <TouchableOpacity 
          style={[styles.square, styles.pastelYellow]}
          onPress={handleLogout}
        >
          <Text style={styles.squareText}>Log Out</Text>
        </TouchableOpacity>

        {/* New Subscription Button */}
        <TouchableOpacity 
          style={[styles.square, styles.pastelOrange]}  // You can add a new style for this
          onPress={handleSubscriptionPress}
        >
          <Text style={styles.squareText}>Manage Subscription</Text>
        </TouchableOpacity>

      </View>
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
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Olde English'
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  square: {
    width: '48%',
    aspectRatio: 1, // Keeps the squares square-shaped
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  squareText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pastelBlue: {
    backgroundColor: '#A7C7E7',
  },
  pastelGreen: {
    backgroundColor: '#B5EAD7',
  },
  pastelPink: {
    backgroundColor: '#FFC3D8',
  },
  pastelYellow: {
    backgroundColor: '#FFEDB3',
  },
  pastelOrange: {
    backgroundColor: '#FFA500',  // Add new style for the subscription button
  },
});

export default AccountOverviewScreen;
