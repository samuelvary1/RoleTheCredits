import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
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

        // Create or update the user document in Firestore
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
        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.guestButton]} onPress={handleGuestPlay}>
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
    backgroundColor: '#B3E5FC', // Baby blue background
  },
  title: {
    fontSize: 59,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#4E342E', // Darker color for the title
    fontFamily: 'Olde English', // Custom font family
  },
  input: {
    height: 48,
    borderColor: '#B0BEC5', // Light grey border
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF', // White background for input fields
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#FFCCBC', // Pastel orange
  },
  registerButton: {
    backgroundColor: '#CE93D8', // Pastel purple
  },
  guestButton: {
    backgroundColor: '#90CAF9', // Pastel blue
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
