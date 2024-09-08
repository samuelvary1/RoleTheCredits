import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useSubscriptionStatus } from '../context/SubscriptionProvider';  // Import subscription status hook

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

  const { isSubscriber, loading } = useSubscriptionStatus();  // Get subscription status and loading state
  const user = auth().currentUser;
  const isSamVary = user?.email === 'sam.vary@gmail.com';  // Check if the user is sam.vary@gmail.com

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
    navigation.navigate('Login', { resetFields: true });
  };

  const handleSubscriptionPress = () => {
    navigation.navigate('SubscriptionScreen');
  };

  const handleRandomMoviePress = () => {
    if (isSubscriber || isSamVary) {
      navigation.navigate('RandomMovieRecommendation');
    } else {
      Alert.alert('Access Denied', 'You must be subscribed to access this feature.');
    }
  };

  // Render loading screen until subscription status is checked
  if (loading) {
    return <Text>Checking subscription status...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
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

          {/* Manage Subscription */}
          <TouchableOpacity 
            style={[styles.square, styles.pastelOrange]}
            onPress={handleSubscriptionPress}
          >
            <Text style={styles.squareText}>Manage Subscription</Text>
          </TouchableOpacity>

          {/* Random Movie Recommendation */}
          <TouchableOpacity 
            style={[styles.square, styles.pastelPurple]}
            onPress={handleRandomMoviePress}
          >
            <Text style={styles.squareText}>Random Movie Recommendation</Text>
          </TouchableOpacity>

          {/* Help Button */}
          <TouchableOpacity 
            style={[styles.square, styles.pastelBlue]} 
            onPress={() => navigation.navigate('HelpScreen')}
          >
            <Text style={styles.squareText}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,  // Add padding at the top to move content down
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
    fontFamily: 'Olde English',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,  // Add space between the title and buttons
  },
  square: {
    width: '48%',
    aspectRatio: 1,
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
    backgroundColor: '#FFA500',
  },
  pastelPurple: {
    backgroundColor: '#DDA0DD',
  },
});

export default AccountOverviewScreen;
