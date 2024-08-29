import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
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
  actors: { name: string; id: number }[];
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
    setLoading(true);
    const movie1 = await fetchRandomMovie();
    const movie2 = await fetchRandomMovie();
    if (movie1 && movie2) {
      setMovies([movie1, movie2]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMovies();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderMovie = ({ item, index }: { item: Movie; index: number }) => (
    <View style={styles.movieContainer}>
      <Text style={styles.movieTitle}>{index === 0 ? 'Movie A' : 'Movie B'}</Text>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.posterPath}` }}
        style={styles.poster}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>Top 10 Actors:</Text>
      <FlatList
        data={item.actors}
        keyExtractor={(actor) => actor.id.toString()}
        renderItem={({ item: actor }) => (
          <Text style={styles.actor}>{actor.name}</Text>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.moviesRow}>
        {movies.map((movie, index) => (
          <View key={index} style={styles.movieWrapper}>
            {renderMovie({ item: movie, index })}
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.shuffleButton} onPress={loadMovies}>
        <Text style={styles.shuffleButtonText}>Shuffle</Text>
      </TouchableOpacity>
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
    marginVertical: 2,
    textAlign: 'center',
  },
  shuffleButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
  },
  shuffleButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RandomMovies;
