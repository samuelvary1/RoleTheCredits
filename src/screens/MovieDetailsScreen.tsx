import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import axios from 'axios';
import { TMDB_API_KEY } from '@env';
import { Movie } from '../types';

type MovieDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MovieDetailsScreen'>;
type MovieDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetailsScreen'>;

type Props = {
  navigation: MovieDetailsScreenNavigationProp;
  route: MovieDetailsScreenRouteProp;
};

const MovieDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { movieA, movieTitle, moviePoster, movieId, movieB } = route.params;

  const [movieActors, setMovieActors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovieCredits = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
        );
        const topTenActors = response.data.cast.slice(0, 10).map((actor: any) => ({
          id: actor.id,
          name: actor.name,
          profilePath: actor.profile_path,
        }));
        setMovieActors(topTenActors);
      } catch (error) {
        console.error('Error fetching movie credits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieCredits();
  }, [movieId]);

  const handleActorPress = (actorId: number, actorName: string, actorImageUrl: string) => {
    navigation.navigate('ActorMoviesScreen', {
      actorId,
      actorName,
      actorImageUrl, // Pass the actor's profile image URL
      movieA, // Pass Movie A for context in ActorMoviesScreen
      movieB, // Pass Movie B as part of the ongoing game
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: `https://image.tmdb.org/t/p/w500${moviePoster}` }} style={styles.poster} />
      <Text style={styles.title}>{movieTitle}</Text>

      {/* Display the top ten actors */}
      <Text style={styles.subtitle}>Top 10 Actors:</Text>
      <FlatList
        data={movieActors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.actorContainer}
            onPress={() => handleActorPress(
              item.id,
              item.name,
              item.profilePath ? `https://image.tmdb.org/t/p/w200${item.profilePath}` : ''
            )}
          >
            {item.profilePath ? (
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w200${item.profilePath}` }}
                style={styles.actorImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}
            <Text style={styles.actorName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Button to navigate back to the current GameScreen */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('GameScreen', {
          movieA: movieA, // Navigate back with the original Movie A
          movieB: movieB, // Include movieB if needed
        })}
      >
        <Text style={styles.backButtonText}>Back to Game</Text>
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
  poster: {
    width: 300,
    height: 450,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  actorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  actorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  placeholderText: {
    fontSize: 10,
    color: '#fff',
  },
  actorName: {
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MovieDetailsScreen;
