import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Movie } from '../types';
import { TMDB_API_KEY } from '@env';
import auth from '@react-native-firebase/auth';

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
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=${randomPage}`
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

  useEffect(() => {
    loadMovies();
  }, []);

  const user = auth().currentUser;

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
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${movie.posterPath}` }}
                  style={styles.poster}
                />
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
        {user && (
          <TouchableOpacity style={styles.accountButton} onPress={handleAccountNavigation}>
            <Text style={styles.buttonText}>Account</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Conditionally render the login button if the user is playing as a guest */}
      {!user && (
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}
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
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  poster: {
    width: 100,
    height: 150,
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 3,
    textAlign: 'center',
  },
  actor: {
    fontSize: 12,
    marginVertical: 1,
    textAlign: 'center',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 30, // Add padding from the bottom
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  shuffleButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  startGameButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  accountButton: {
    backgroundColor: '#FFA500', // Add a different color to distinguish the account button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  loginButton: {
    position: 'absolute',
    top: 50, // Lowered from the top
    alignSelf: 'center', // Center the button horizontally
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RandomMovies;
