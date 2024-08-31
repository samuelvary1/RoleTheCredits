import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth'; 
import firestore from '@react-native-firebase/firestore'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
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
              completedConnections: [],
              watchlist: [],
            });
          } else {
            await userDocRef.update({
              lastLogin: firestore.FieldValue.serverTimestamp(),
            });
          }
        } catch (error) {
          console.error('Error creating or updating user document:', error);
        }

        navigation.navigate('RandomMovies'); // Navigate to the main app screen after login
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Invalid Email Address');
        } else {
          Alert.alert('Login Failed', error.message);
        }
      });
  };

  const handleGuestPlay = () => {
    navigation.navigate('RandomMovies'); // Allow guest access without login
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
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Register"
        onPress={() => navigation.navigate('SignUp')}
        color="#841584"
      />
      <Button title="Play as Guest" onPress={handleGuestPlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
});

export default LoginScreen;
