import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Movie } from '../types';
import { TMDB_API_KEY } from '@env';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type RandomMoviesNavigationProp = StackNavigationProp<RootStackParamList, 'RandomMovies'>;

type Props = {
  navigation: RandomMoviesNavigationProp;
};

const RandomMovies: React.FC<Props> = ({ navigation }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRandomMovie = async (): Promise<Movie | undefined> => {
    try {
      const randomPage = Math.floor(Math.random() * 500) + 1;
      const movieResponse = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=${randomPage}&region=US&with_original_language=en`
      );
  
      const randomMovieIndex = Math.floor(Math.random() * movieResponse.data.results.length);
      const movie = movieResponse.data.results[randomMovieIndex];
  
      const creditsResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${TMDB_API_KEY}&language=en-US`
      );
  
      const topActors = creditsResponse.data.cast.slice(0, 10).map((actor: any) => ({
        name: actor.name,
        id: actor.id,
      }));
  
      return {
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        actors: topActors,
        type: 'movie'
      };
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  const loadMovies = async () => {
    setLoading(true);
    const movie1 = await fetchRandomMovie();
    const movie2 = await fetchRandomMovie();
    if (movie1 && movie2) {
      setMovies([movie1, movie2]);
    }
    setLoading(false);
  };

  const handleViewPairDetails = () => {
    if (movies.length === 2) {
      navigation.navigate('GameScreen', {
        movieA: movies[0],
        movieB: movies[1],
      });
    }
  };

  const handleAccountNavigation = () => {
    navigation.navigate('AccountOverviewScreen');
  };

  const addToWatchlist = async (movie: Movie) => {
    const user = auth().currentUser;
    if (user) {
      try {
        const userDocRef = firestore().collection('users').doc(user.uid);
        await userDocRef.update({
          watchlist: firestore.FieldValue.arrayUnion(movie),
        });
        Alert.alert('Success', 'Successfully added movie to watchlist!');
      } catch (error) {
        console.error('Error adding movie to watchlist:', error);
        Alert.alert('Error', 'Failed to add movie to watchlist.');
      }
    } else {
      Alert.alert('Not Logged In', 'You need to be logged in to add movies to your watchlist.');
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.moviesRow}>
            {movies.map((movie, index) => (
              <View key={index} style={styles.movieContainer}>
                <Text style={styles.movieLabel}>{index === 0 ? 'Movie A' : 'Movie B'}</Text>
                <TouchableOpacity onPress={() => addToWatchlist(movie)}>
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.posterPath}` }}
                    style={styles.poster}
                  />
                </TouchableOpacity>
                <Text style={styles.title}>{movie.title}</Text>
                <Text style={styles.subtitle}>Top 10 Actors:</Text>
                {movie.actors.map(actor => (
                  <Text key={actor.id} style={styles.actor}>{actor.name}</Text>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.shuffleButton} onPress={loadMovies}>
          <Text style={styles.buttonText}>Shuffle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startGameButton} onPress={handleViewPairDetails}>
          <Text style={styles.buttonText}>Start Game with this Pair</Text>
        </TouchableOpacity>
        {!auth().currentUser && (
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login', { resetFields: true })}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
        {auth().currentUser && (
          <TouchableOpacity style={styles.accountButton} onPress={handleAccountNavigation}>
            <Text style={styles.buttonText}>Account</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  moviesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  movieContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  movieLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  poster: {
    width: 120,
    height: 180,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  actor: {
    fontSize: 14,
    marginVertical: 2,
    textAlign: 'center',
  },
  buttonsContainer: {
    marginTop: 20,
  },
  shuffleButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 10,
  },
  startGameButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 10,
  },
  accountButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RandomMovies;
