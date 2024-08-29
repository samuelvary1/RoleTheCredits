import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { TMDB_API_KEY } from '@env';

type ActorMoviesNavigationProp = StackNavigationProp<RootStackParamList, 'ActorMoviesScreen'>;
type ActorMoviesRouteProp = RouteProp<RootStackParamList, 'ActorMoviesScreen'>;

type Props = {
  navigation: ActorMoviesNavigationProp;
  route: ActorMoviesRouteProp;
};

type Movie = {
  id: number;
  title: string;
  posterPath: string;
  releaseYear: string;
};

const ActorMoviesScreen: React.FC<Props> = ({ route, navigation }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [moveIndex, setMoveIndex] = useState<number>(0); // Track the current move index

  const { actorId, actorName, actorImageUrl } = route.params;

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
        setMovies(moviesData);
      } catch (error) {
        console.error('Error fetching actor movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActorMovies();
  }, [actorId]);

  const handleBack = () => {
    if (moveIndex > 0) {
      setMoveIndex(moveIndex - 1);
      // Implement your logic for going back a move
    }
  };

  const handleForward = () => {
    if (moveIndex < movies.length - 1) {
      setMoveIndex(moveIndex + 1);
      // Implement your logic for going forward a move
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: actorImageUrl }} style={styles.actorImage} />
        <Text style={styles.actorName}>{actorName}</Text>
      </View>
      
      <View style={styles.navigationButtons}>
        <Button title="Back" onPress={handleBack} disabled={moveIndex <= 0} />
        <Button title="Forward" onPress={handleForward} disabled={moveIndex >= movies.length - 1} />
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>
            <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.posterPath}` }} style={styles.moviePoster} />
            <Text style={styles.movieTitle}>{item.title}</Text>
            <Text style={styles.movieYear}>{item.releaseYear}</Text>
          </View>
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
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 20,
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
});

export default ActorMoviesScreen;
