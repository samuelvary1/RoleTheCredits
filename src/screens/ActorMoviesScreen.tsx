import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { TMDB_API_KEY } from '@env';
import { Actor, Movie } from '../types';

type ActorMoviesNavigationProp = StackNavigationProp<RootStackParamList, 'ActorMoviesScreen'>;
type ActorMoviesRouteProp = RouteProp<RootStackParamList, 'ActorMoviesScreen'>;

type Props = {
  navigation: ActorMoviesNavigationProp;
  route: ActorMoviesRouteProp;
};

const ActorMoviesScreen: React.FC<Props> = ({ route, navigation }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showTargetMovie, setShowTargetMovie] = useState<boolean>(false);

  const { actorId, actorName, actorImageUrl, movieA, movieB } = route.params;

  useEffect(() => {
    const fetchActorMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const moviesData = response.data.cast.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          releaseYear: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
        }));

        console.log(response.data);

        // Sort the movies in reverse chronological order (most recent first)
        const sortedMovies = moviesData.sort((a: { releaseYear: string; }, b: { releaseYear: string; }) => {
          if (a.releaseYear === 'N/A') return 1;
          if (b.releaseYear === 'N/A') return -1;
          return b.releaseYear.localeCompare(a.releaseYear);
        });

        setMovies(sortedMovies);
      } catch (error) {
        console.error('Error fetching actor movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActorMovies();
  }, [actorId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: actorImageUrl }} style={styles.actorImage} />
        <Text style={styles.actorName}>{actorName}</Text>
      </View>

      <TouchableOpacity style={styles.bullseyeButton} onPress={() => setShowTargetMovie(!showTargetMovie)}>
        <FontAwesome name="crosshairs" size={24} color="#007BFF" />
        {showTargetMovie && (
          <View style={styles.targetMovieContainer}>
            <Image source={{ uri: `https://image.tmdb.org/t/p/w200${movieB.posterPath}` }} style={styles.targetMoviePoster} />
            <Text style={styles.targetMovieText}>{movieB.title}</Text>
            <Text style={styles.targetMovieSubtitle}>Movie you're trying to get to</Text>
          </View>
        )}
      </TouchableOpacity>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieItem}
            onPress={() =>
              navigation.navigate('MovieDetailsScreen', {
                movieId: item.id,
                movieTitle: item.title,
                moviePoster: item.posterPath,
                movieActors: item.actors,
                movieA: movieA,
                movieB: movieB, // Pass Movie B along
              })
            }
          >
            <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.posterPath}` }} style={styles.moviePoster} />
            <Text style={styles.movieTitle}>{item.title}</Text>
            <Text style={styles.movieYear}>{item.releaseYear}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.moviesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  actorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  actorName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  moviesList: {
    paddingBottom: 20,
  },
  movieItem: {
    alignItems: 'center',
    marginBottom: 20,
  },
  moviePoster: {
    width: 120,
    height: 180,
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  movieYear: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bullseyeButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  targetMovieContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  targetMoviePoster: {
    width: 120,
    height: 180,
    marginBottom: 10,
  },
  targetMovieText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  targetMovieSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ActorMoviesScreen;
