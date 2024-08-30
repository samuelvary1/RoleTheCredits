import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { TMDB_API_KEY } from '@env';

type RandomMoviesNavigationProp = StackNavigationProp<RootStackParamList, 'RandomMovies'>;

type Props = {
  navigation: RandomMoviesNavigationProp;
};

type Movie = {
  id: number;
  title: string;
  posterPath: string;
  actors: { name: string; id: number; profilePath: string }[];
};

const RandomMovies: React.FC<Props> = ({ navigation }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        profilePath: actor.profile_path,
      }));

      return {
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        actors: topActors,
      };
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  const loadMovies = async () => {
    setLoading(true); // Start loading
    const movie1 = await fetchRandomMovie();
    const movie2 = await fetchRandomMovie();
    if (movie1 && movie2) {
      setMovies([movie1, movie2]);
    }
    setLoading(false); // End loading
  };

  useEffect(() => {
    loadMovies();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.moviesRow}>
        {movies.map((movie, index) => (
          <View key={index} style={styles.movieWrapper}>
            <View style={styles.movieContainer}>
              <Text style={styles.movieTitle}>{index === 0 ? 'Movie A' : 'Movie B'}</Text>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${movie.posterPath}` }}
                style={styles.poster}
              />
              <Text style={styles.title}>{movie.title}</Text>
              <Text style={styles.subtitle}>Top 10 Actors:</Text>
              <FlatList
                data={movie.actors}
                keyExtractor={(actor) => actor.id.toString()}
                renderItem={({ item: actor }) => (
                  <Text style={styles.actor}>{actor.name}</Text>
                )}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.startGameButton}
          onPress={() =>
            navigation.navigate('GameScreen', {
              movieA: movies[0], // Pass Movie A to GameScreen
              movieB: movies[1], // Pass Movie B to GameScreen
            })
          }
        >
          <Text style={styles.startGameButtonText}>Start Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shuffleButton} onPress={loadMovies}>
          <Text style={styles.shuffleButtonText}>Shuffle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moviesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 60, // Add padding to accommodate the buttons
  },
  movieWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  movieContainer: {
    alignItems: 'center',
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  poster: {
    width: 150,
    height: 225,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  actor: {
    fontSize: 14,
    color: '#007BFF',
    textAlign: 'center',
  },
  // Buttons Container
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  startGameButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    flex: 1,
    marginRight: 10, // Space between the buttons
  },
  startGameButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shuffleButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10, // Space between the buttons
  },
  shuffleButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RandomMovies;
