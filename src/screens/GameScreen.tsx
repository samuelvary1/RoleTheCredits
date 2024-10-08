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
const guestPlayLimit = 1; // Play limit for guests (1 play per day)

const GameScreen: React.FC<Props> = ({ navigation, route }) => {
  const { addToWatchlist } = useWatchlist();  
  const { addCompletedConnection } = useCompletedConnections();
  const dispatch = useDispatch();

  const isSubscriber = useSubscriptionStatus(); // Check subscription status
  const user = auth().currentUser; // Get the currently logged-in user
  const [playCount, setPlayCount] = useState<number>(0); // Track play count
  const [lastPlayedDate, setLastPlayedDate] = useState<Date>(new Date());
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Control modal visibility

  // Bypass paywall if the logged-in user is sam.vary@gmail.com
  const isSamVary = user?.email === 'sam.vary@gmail.com';

  // Determine max plays: Sam has unlimited, subscribers get 3, regular users get 1, guests get 1
  const maxPlays = isSamVary ? Infinity : (isSubscriber ? 3 : (user ? 1 : guestPlayLimit));

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
    if (!user) { // Only for guest users
      const loadGuestPlayData = async () => {
        const storedPlayCount = await AsyncStorage.getItem('guestPlayCount');
        const storedLastPlayedDate = await AsyncStorage.getItem('guestLastPlayedDate');
        const today = new Date();
        
        if (storedLastPlayedDate && new Date(storedLastPlayedDate).toDateString() === today.toDateString()) {
          setPlayCount(parseInt(storedPlayCount || '0', 10)); // Set stored play count for the current day
        } else {
          setPlayCount(0); // Reset play count if it's a new day
        }

        setLastPlayedDate(today);
      };
      loadGuestPlayData();
    }
  }, [user]);

  // Save guest play data to AsyncStorage
  useEffect(() => {
    if (!user) { // Only for guest users
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
        sku: subscriptionSku, // Pass the subscription product ID as part of an object
      });
      setModalVisible(false); // Close the modal after subscribing
      Alert.alert('Subscription initiated');
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      Alert.alert('Error purchasing subscription');
    }
  };

  const handlePlayGame = () => {
    if (playCount < maxPlays) {
      setPlayCount(playCount + 1);
      Alert.alert('You played the game!');
    } else {
      // Show the subscription modal when the play limit is reached, but not for Sam
      if (!isSamVary) {
        setModalVisible(true);
      }
    }
  };

  const handleActorPress = async (actorId: number, actorName: string, fromMovie: 'A' | 'B') => {
    if (fromMovie === 'A') {
      setLoadingA(true);
    } else {
      setLoadingB(true);
    }

    try {
      const actorResponse = await axios.get(
        `https://api.themoviedb.org/3/person/${actorId}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const profilePath = actorResponse.data.profile_path;

      if (fromMovie === 'A') {
        setSelectedActorA({ id: actorId, name: actorName, profilePath });
        setPath([...path, { id: actorId, title: actorName, type: 'actor', side: 'A' }]);
        setLoadingA(false);
      } else {
        setSelectedActorB({ id: actorId, name: actorName, profilePath });
        setPath([...path, { id: actorId, title: actorName, type: 'actor', side: 'B' }]);
        setLoadingB(false);
      }

      const moviesResponse = await axios.get(
        `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const movies = moviesResponse.data.cast.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
      }));

      if (fromMovie === 'A') {
        setActorMoviesA(movies);
      } else {
        setActorMoviesB(movies);
      }
    } catch (error) {
      console.error('Error fetching actor details or movies:', error);
      setLoadingA(false);
      setLoadingB(false);
    }
  };

  const handleMoviePress = async (movieId: number, movieTitle: string, posterPath: string, fromMovie: 'A' | 'B') => {
    if (fromMovie === 'A') {
      setLoadingA(true);
    } else {
      setLoadingB(true);
    }

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const actors = response.data.cast.slice(0, 10).map((actor: any) => ({
        id: actor.id,
        name: actor.name,
        profilePath: actor.profile_path,
      }));

      if (fromMovie === 'A') {
        setCurrentMovieA({ id: movieId, title: movieTitle, actors, posterPath, type: 'movie' });
        setCurrentActorsA(actors);
        setSelectedActorA(null);
        setPath([...path, { id: movieId, title: movieTitle, type: 'movie', side: 'A' }]);
        setLoadingA(false);
      } else {
        setCurrentMovieB({ id: movieId, title: movieTitle, actors, posterPath, type: 'movie' });
        setCurrentActorsB(actors);
        setSelectedActorB(null);
        setPath([...path, { id: movieId, title: movieTitle, type: 'movie', side: 'B' }]);
        setLoadingB(false);
      }
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      setLoadingA(false);
      setLoadingB(false);
    }
  };

  const handleAddToWatchlist = async (movie: WatchlistItem) => {
    const user = auth().currentUser;
    if (user) {
      const userDocRef = firestore().collection('users').doc(user.uid);
      
      try {
        await userDocRef.update({
          watchlist: firestore.FieldValue.arrayUnion(movie),
        });
        Alert.alert('Success', 'Successfully added to watchlist!');
      } catch (error) {
        console.error('Error adding movie to watchlist:', error);
        Alert.alert('Error', 'Could not add to watchlist.');
      }
    }  else {
      Alert.alert('Not Logged In', 'You need to be logged in to add movies to your watchlist.');
    }
  };

  // Handle the win condition when a connection is confirmed
  const handleWin = async () => {
    const user = auth().currentUser;
  
    if (user) {
      const completedConnection = {
        id: firestore().collection('users').doc().id, // Generate a unique ID for the connection
        movieA: movieA,
        movieB: movieB,
        moves: path.length - 1, // Subtract 1 to not count the starting node
        timestamp: new Date(), // Use JavaScript's Date object to add the timestamp
      };
  
      const userDocRef = firestore().collection('users').doc(user.uid);
  
      try {
        await userDocRef.update({
          completedConnections: firestore.FieldValue.arrayUnion(completedConnection),
        });
        Alert.alert(`Congratulations! You've connected the movies in ${path.length - 1} moves!`);
        navigation.navigate('RandomMovies'); // Navigate back to the movie selection screen
      } catch (error) {
        console.error('Error storing completed connection:', error);
        Alert.alert('Error', 'Could not save the completed connection.');
      }
    }
  };

  const handleConfirmConnection = () => {
    handleWin();
  };

  const handleStartOver = () => {
    navigation.navigate('RandomMovies');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.moviesRow}>
          {/* Movie A side */}
          <View style={styles.movieContainer}>
            <Text style={styles.movieLabel}>
              {selectedActorA ? selectedActorA.name : currentMovieA.title}
            </Text>
            <TouchableOpacity onPress={() => handleAddToWatchlist(currentMovieA)}>
              <Image
                source={{
                  uri: selectedActorA?.profilePath
                    ? `https://image.tmdb.org/t/p/w500${selectedActorA.profilePath}`
                    : `https://image.tmdb.org/t/p/w500${currentMovieA.posterPath}`,
                }}
                style={styles.poster}
              />
            </TouchableOpacity>
            <Text style={styles.title}>
              {selectedActorA ? 'Movies' : 'Top 10 Actors'}
            </Text>
            <Text style={styles.subtitle}>
              {selectedActorA ? 'Movies this actor has been in:' : 'Top 10 Actors in this Movie:'}
            </Text>
            {loadingA ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : selectedActorA ? (
              <ScrollView>
                {actorMoviesA.map((item, index) => (
                  <TouchableOpacity
                    key={`A-${item.id}-${index}`}
                    style={styles.actorContainer}
                    onPress={() => handleMoviePress(item.id, item.title, item.posterPath, 'A')}
                  >
                    <Text style={styles.actorName}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <ScrollView>
                {currentActorsA.map((actor, index) => (
                  <TouchableOpacity
                    key={`A-${actor.id}-${index}`}
                    style={styles.actorContainer}
                    onPress={() => handleActorPress(actor.id, actor.name, 'A')}
                  >
                    <Text style={styles.actorName}>{actor.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Movie B side */}
          <View style={styles.movieContainer}>
            <Text style={styles.movieLabel}>
              {selectedActorB ? selectedActorB.name : currentMovieB.title}
            </Text>
            <TouchableOpacity onPress={() => handleAddToWatchlist(currentMovieB)}>
              <Image
                source={{
                  uri: selectedActorB?.profilePath
                    ? `https://image.tmdb.org/t/p/w500${selectedActorB.profilePath}`
                    : `https://image.tmdb.org/t/p/w500${currentMovieB.posterPath}`,
                }}
                style={styles.poster}
              />
            </TouchableOpacity>
            <Text style={styles.title}>
              {selectedActorB ? 'Movies' : 'Top 10 Actors'}
            </Text>
            <Text style={styles.subtitle}>
              {selectedActorB ? 'Movies this actor has been in:' : 'Top 10 Actors in this Movie:'}
            </Text>
            {loadingB ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : selectedActorB ? (
              <ScrollView>
                {actorMoviesB.map((item, index) => (
                  <TouchableOpacity
                    key={`B-${item.id}-${index}`}
                    style={styles.actorContainer}
                    onPress={() => handleMoviePress(item.id, item.title, item.posterPath, 'B')}
                  >
                    <Text style={styles.actorName}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <ScrollView>
                {currentActorsB.map((actor, index) => (
                  <TouchableOpacity
                    key={`B-${actor.id}-${index}`}
                    style={styles.actorContainer}
                    onPress={() => handleActorPress(actor.id, actor.name, 'B')}
                  >
                    <Text style={styles.actorName}>{actor.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </ScrollView>

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
  moviesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  movieContainer: {
    flex: 1,
    margin: 10,
  },
  movieLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center', // Center the movie title above the poster
  },
  poster: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center', // Center the "Top 10 Actors" or "Movies" text
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center', // Center the subtitle text
  },
  actorContainer: {
    marginBottom: 10,
  },
  actorName: {
    fontSize: 14,
    textAlign: 'center', // Center the actor's name
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
