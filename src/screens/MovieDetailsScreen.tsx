import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { TMDB_API_KEY } from '@env';

type MovieDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'MovieDetailsScreen'>;
type MovieDetailsRouteProp = RouteProp<RootStackParamList, 'MovieDetailsScreen'>;

type Props = {
  navigation: MovieDetailsNavigationProp;
  route: MovieDetailsRouteProp;
};

type Actor = {
  id: number;
  name: string;
  profilePath: string;
};

const MovieDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showTargetMovie, setShowTargetMovie] = useState<boolean>(false);

  const { movieId, movieTitle, moviePoster, movieB } = route.params;

  useEffect(() => {
    const fetchMovieActors = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const topActors = response.data.cast.slice(0, 10).map((actor: any) => ({
          id: actor.id,
          name: actor.name,
          profilePath: actor.profile_path,
        }));
        setActors(topActors);
      } catch (error) {
        console.error('Error fetching movie actors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieActors();
  }, [movieId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: `https://image.tmdb.org/t/p/w500${moviePoster}` }} style={styles.poster} />
      <Text style={styles.title}>{movieTitle}</Text>
      
      <TouchableOpacity style={styles.bullseyeButton} onPress={() => setShowTargetMovie(!showTargetMovie)}>
        <FontAwesome name="bullseye" size={24} color="#007BFF" />
        {showTargetMovie && (
          <View style={styles.targetMovieContainer}>
            <Image source={{ uri: `https://image.tmdb.org/t/p/w200${movieB.posterPath}` }} style={styles.targetMoviePoster} />
            <Text style={styles.targetMovieText}>{movieB.title}</Text>
            <Text style={styles.targetMovieSubtitle}>Movie you're trying to get to</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.subtitle}>Top 10 Actors:</Text>
      <FlatList
        data={actors}
        keyExtractor={(actor) => actor.id.toString()}
        renderItem={({ item: actor }) => (
          <TouchableOpacity
            style={styles.actorTouchable}
            onPress={() =>
              navigation.navigate('ActorMoviesScreen', {
                actorId: actor.id,
                actorName: actor.name,
                actorImageUrl: `https://image.tmdb.org/t/p/w200${actor.profilePath}`,
                movieB: movieB, // Pass Movie B along
              })
            }
          >
            <Text style={styles.actor}>{actor.name}</Text>
          </TouchableOpacity>
        )}
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
  poster: {
    width: 200,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
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
  actorTouchable: {
    marginVertical: 5,
  },
  actor: {
    fontSize: 16,
    color: '#007BFF',
  },
});

export default MovieDetailsScreen;
