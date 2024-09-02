import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async userCredential => {
        console.log('User signed in!');
        const { uid } = userCredential.user;
  
        const userDocRef = firestore().collection('users').doc(uid);
  
        try {
          const userDoc = await userDocRef.get();
          if (!userDoc.exists) {
            await userDocRef.set({
              email: userCredential.user.email,
              displayName: userCredential.user.displayName || "",
              createdAt: firestore.FieldValue.serverTimestamp(),
              lastLogin: firestore.FieldValue.serverTimestamp(),
              watchlist: [],  // Initialize with an empty array
              completedConnections: [],  // Initialize with an empty array
            });
          } else {
            const data = userDoc.data();
            await userDocRef.update({
              lastLogin: firestore.FieldValue.serverTimestamp(),
              watchlist: data?.watchlist || [],
              completedConnections: data?.completedConnections || [],
            });
          }
        } catch (error) {
          console.error('Error creating or updating user document:', error);
        }
  
        navigation.navigate('RandomMovies'); // Navigate to the main app screen after login
      })
      .catch((error: any) => {
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Invalid Email Address');
        } else {
          Alert.alert('Login Failed', error.message);
        }
      });
  };

  const handleGuestPlay = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        await auth().signOut();
        console.log('User signed out');
      } else {
        console.log('No user is currently signed in');
      }
      navigation.navigate('RandomMovies'); // Allow guest access without login
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Role the Credits</Text>
      <Icon
        name="film"
        size={100}
        color="#4E342E"
        style={styles.icon}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.guestButton} onPress={handleGuestPlay}>
          <Text style={styles.buttonText}>Play as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#B3E5FC',
  },
  title: {
    fontSize: 54,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4E342E',
    fontFamily: 'Olde English',
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 10,
  },
  guestButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginScreen;
