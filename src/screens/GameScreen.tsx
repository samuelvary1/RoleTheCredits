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
import { useSubscriptionStatus } from '../context/SubscriptionProvider'; // Import subscription status hook
import { requestSubscription } from 'react-native-iap'; // Import to handle purchases
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for guest play count storage
import SubscriptionModal from '../components/SubscriptionModal'; // Import the SubscriptionModal component

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameScreen'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'GameScreen'>;

type Props = {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
};

const subscriptionSku = 'role_the_credits_99c_monthly'; // Your subscription product ID
const freePlayLimit = 3; // Free play limit for non-subscribers and guests

const GameScreen: React.FC<Props> = ({ navigation, route }) => {
  const { addToWatchlist } = useWatchlist();  
  const { addCompletedConnection } = useCompletedConnections();
  const dispatch = useDispatch();

  const { isSubscriber } = useSubscriptionStatus(); // Check subscription status
  const user = auth().currentUser; // Get the currently logged-in user
  const [playCount, setPlayCount] = useState<number>(0); // Track play count
  const [lastPlayedDate, setLastPlayedDate] = useState<string>(new Date().toDateString());
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Control modal visibility

  // Bypass paywall if the logged-in user is sam.vary@gmail.com
  const isSamVary = user?.email === 'sam.vary@gmail.com';

  // Determine max plays: Sam has unlimited, subscribers have unlimited, non-subscribers and guests get 3
  const maxPlays = isSamVary ? Infinity : isSubscriber ? Infinity : freePlayLimit;

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

  // Load play data from AsyncStorage (applies to non-subscribers and guests)
  useEffect(() => {
    const loadPlayData = async () => {
      const storedPlayCount = await AsyncStorage.getItem('playCount');
      const storedLastPlayedDate = await AsyncStorage.getItem('lastPlayedDate');
      const today = new Date().toDateString();

      // Reset play count if it's a new day
      if (storedLastPlayedDate !== today) {
        setPlayCount(0);
        setLastPlayedDate(today);
        await AsyncStorage.setItem('playCount', '0');
        await AsyncStorage.setItem('lastPlayedDate', today);
      } else {
        setPlayCount(parseInt(storedPlayCount || '0', 10));
        setLastPlayedDate(storedLastPlayedDate || today);
      }
    };

    if (!isSubscriber && !isSamVary) {
      loadPlayData();
    }
  }, [isSubscriber, isSamVary]);

  // Save play data to AsyncStorage
  useEffect(() => {
    const savePlayData = async () => {
      await AsyncStorage.setItem('playCount', playCount.toString());
      await AsyncStorage.setItem('lastPlayedDate', lastPlayedDate);
    };

    if (!isSubscriber && !isSamVary) {
      savePlayData();
    }
  }, [playCount, lastPlayedDate, isSubscriber, isSamVary]);

  // Check if user has exceeded play limit
  const handlePlayGame = () => {
    if (playCount < maxPlays) {
      setPlayCount(playCount + 1);
      Alert.alert('Success', 'You played the game!');
    } else if (!isSubscriber) {
      setModalVisible(true); // Show subscription modal when free play limit is reached
    }
  };

  useEffect(() => {
    const hasCommonActor = selectedActorA && selectedActorB && selectedActorA.id === selectedActorB.id;
    const hasCommonMovie = currentMovieA.id === currentMovieB.id;

    setShowConfirmButton(hasCommonActor || hasCommonMovie);
  }, [selectedActorA, selectedActorB, currentMovieA, currentMovieB]);

  // Subscription purchase flow
  const handlePurchaseSubscription = async () => {
    try {
      await requestSubscription({
        sku: subscriptionSku, // Pass the subscription product ID as part of an object
      });
      setModalVisible(false); // Close the modal after subscribing
      Alert.alert('Subscription initiated');
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      Alert.alert('Error purchasing subscription');
    }
  };

  const handleActorPress = async (actorId: number, actorName: string, fromMovie: 'A' | 'B') => {
    // ... Actor press logic remains the same ...
  };

  const handleMoviePress = async (movieId: number, movieTitle: string, posterPath: string, fromMovie: 'A' | 'B') => {
    // ... Movie press logic remains the same ...
  };

  const handleAddToWatchlist = async (movie: WatchlistItem) => {
    // ... Add to watchlist logic remains the same ...
  };

  const handleConfirmConnection = () => {
    // ... Confirm connection logic remains the same ...
  };

  const handleStartOver = () => {
    navigation.navigate('RandomMovies');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Movie A and B display logic remains the same */}
      </ScrollView>

      {/* Play Game Button */}
      <TouchableOpacity style={styles.playButton} onPress={handlePlayGame}>
        <Text style={styles.playButtonText}>Play Game</Text>
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
  playButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startOverButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
  },
  startOverButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameScreen;
