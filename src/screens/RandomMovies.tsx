import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Image } from 'react-native';
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

console.log(TMDB_API_KEY);

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

  return (
    <View style={styles.container}>
      {movies.map((movie, index) => (
        <View key={index} style={styles.movieContainer}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie.posterPath}` }}
            style={styles.poster}
          />
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.subtitle}>Top 10 Actors:</Text>
          <FlatList
            data={movie.actors}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Text style={styles.actor}>{item.name}</Text>
            )}
          />
        </View>
      ))}
      <Button title="Shuffle" onPress={loadMovies} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  movieContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  poster: {
    width: 200,
    height: 300,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
  },
  actor: {
    fontSize: 16,
    marginVertical: 2,
    color: 'blue',
  },
});

export default RandomMovies;
