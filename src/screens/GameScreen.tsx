import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import axios from 'axios';
import { TMDB_API_KEY } from '@env';
import { Actor, Movie, PathNode, WatchlistItem } from '../types';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { useWatchlist } from '../context/WatchlistContext';
import { useCompletedConnections } from '../context/CompletedConnectionsContext';
import { useSubscriptionStatus } from '../context/SubscriptionProvider'; // Updated subscription hook
import { requestSubscription } from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For guest play count storage
import SubscriptionModal from '../components/SubscriptionModal'; // Subscription modal

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameScreen'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'GameScreen'>;

type Props = {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
};

const subscriptionSku = 'role_the_credits_99c_monthly'; // Subscription product ID
const guestPlayLimit = 1; // Limit for guest users

const GameScreen: React.FC<Props> = ({ navigation, route }) => {
  const { addToWatchlist } = useWatchlist();  
  const { addCompletedConnection } = useCompletedConnections();
  const dispatch = useDispatch();

  // Get subscription status and playsRemaining from the SubscriptionProvider
  const { isSubscriber, playsRemaining } = useSubscriptionStatus();
  const user = auth().currentUser;
  const [playCount, setPlayCount] = useState<number>(0); // Guest play count
  const [lastPlayedDate, setLastPlayedDate] = useState<Date>(new Date());
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Subscription modal visibility

  // Determine max plays: Unlimited for subscribers, 1 for guests
  const maxPlays = isSubscriber ? Infinity : (user ? 1 : guestPlayLimit);

  // Determine if the current user is "Sam Vary"
  const isSamVary = user?.email === 'sam.vary@gmail.com';
  
  const {
    movieA = { id: 0, title: 'Unknown Movie A', posterPath: '', actors: [], type: 'movie' },
    movieB = { id: 0, title: 'Unknown Movie B', posterPath: '', actors: [], type: 'movie' },
    selectedActorA: prevSelectedActorA = null,
    selectedActorB: prevSelectedActorB = null,
    currentMovieA: prevCurrentMovieA = null,
    currentMovieB: prevCurrentMovieB = null,
  } = route.params;

  const [selectedActorA, setSelectedActorA] = useState<Actor | null>(prevSelectedActorA);
  const [selectedActorB, setSelectedActorB] = useState<Actor | null>(prevSelectedActorB);
  const [actorMoviesA, setActorMoviesA] = useState<Movie[]>([]);
  const [actorMoviesB, setActorMoviesB] = useState<Movie[]>([]);
  const [currentMovieA, setCurrentMovieA] = useState<Movie>(prevCurrentMovieA || movieA);
  const [currentMovieB, setCurrentMovieB] = useState<Movie>(prevCurrentMovieB || movieB);
  const [currentActorsA, setCurrentActorsA] = useState<Actor[]>(prevCurrentMovieA?.actors || movieA.actors);
  const [currentActorsB, setCurrentActorsB] = useState<Actor[]>(prevCurrentMovieB?.actors || movieB.actors);
  const [loadingA, setLoadingA] = useState<boolean>(false);
  const [loadingB, setLoadingB] = useState<boolean>(false);
  const [showConfirmButton, setShowConfirmButton] = useState<boolean>(false);
  const [path, setPath] = useState<PathNode[]>([{ id: movieA.id, title: movieA.title, type: 'movie', side: 'A' }]);

  // Load guest play data from AsyncStorage
  useEffect(() => {
    if (!user) {
      const loadGuestPlayData = async () => {
        const storedPlayCount = await AsyncStorage.getItem('guestPlayCount');
        const storedLastPlayedDate = await AsyncStorage.getItem('guestLastPlayedDate');
        const today = new Date();
        
        if (storedLastPlayedDate && new Date(storedLastPlayedDate).toDateString() === today.toDateString()) {
          setPlayCount(parseInt(storedPlayCount || '0', 10));
        } else {
          setPlayCount(0);
        }

        setLastPlayedDate(today);
      };
      loadGuestPlayData();
    }
  }, [user]);

  // Save guest play data to AsyncStorage
  useEffect(() => {
    if (!user) {
      const saveGuestPlayData = async () => {
        await AsyncStorage.setItem('guestPlayCount', playCount.toString());
        await AsyncStorage.setItem('guestLastPlayedDate', lastPlayedDate.toISOString());
      };
      saveGuestPlayData();
    }
  }, [playCount, lastPlayedDate, user]);

  useEffect(() => {
    const hasCommonActor = selectedActorA && selectedActorB && selectedActorA.id === selectedActorB.id;
    const hasCommonMovie = currentMovieA.id === currentMovieB.id;

    setShowConfirmButton(hasCommonActor || hasCommonMovie);
  }, [selectedActorA, selectedActorB, currentMovieA, currentMovieB]);

  // Subscription purchase flow
  const handlePurchaseSubscription = async () => {
    try {
      await requestSubscription({
        sku: subscriptionSku, // The correct way is to pass an object with the SKU
      });
      setModalVisible(false); // Close the modal after subscribing
      Alert.alert('Subscription initiated');
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      Alert.alert('Error purchasing subscription');
    }
  };

  // Handle play game logic based on subscription/guest status
  const handlePlayGame = () => {
    if (isSamVary || isSubscriber || playCount < maxPlays) {
      setPlayCount(playCount + 1);
      Alert.alert('You played the game!');
    } else {
      setModalVisible(true); // Show subscription modal when play limit is reached
    }
  };

  const handleActorPress = async (actorId: number, actorName: string, fromMovie: 'A' | 'B') => {
    // Same logic for handling actor presses
  };

  const handleMoviePress = async (movieId: number, movieTitle: string, posterPath: string, fromMovie: 'A' | 'B') => {
    // Same logic for handling movie presses
  };

  const handleAddToWatchlist = async (movie: WatchlistItem) => {
    // Logic for adding movies to the watchlist
  };

  const handleConfirmConnection = () => {
    // Logic for handling confirmed connections
  };

  const handleStartOver = () => {
    navigation.navigate('RandomMovies');
  };

  return (
    <View style={styles.container}>
      {/* Main screen content */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Rest of your screen logic goes here */}
      </ScrollView>

      {/* Play Game Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handlePlayGame}>
        <Text style={styles.confirmButtonText}>Play Game</Text>
      </TouchableOpacity>

      {/* Confirm Connection Button */}
      {showConfirmButton && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmConnection}>
          <Text style={styles.confirmButtonText}>Confirm Connection!</Text>
        </TouchableOpacity>
      )}

      {/* Start Over Button */}
      <TouchableOpacity style={styles.startOverButton} onPress={handleStartOver}>
        <Text style={styles.startOverButtonText}>Start Over</Text>
      </TouchableOpacity>

      {/* Subscription Modal */}
      <SubscriptionModal 
        visible={modalVisible} 
        onSubscribe={handlePurchaseSubscription} 
        onClose={() => setModalVisible(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
    alignSelf: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  startOverButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
  },
  startOverButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameScreen;
