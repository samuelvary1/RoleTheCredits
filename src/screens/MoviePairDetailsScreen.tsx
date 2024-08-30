import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import axios from 'axios';
import { TMDB_API_KEY } from '@env';
import { Actor, Movie } from '../types';

type MoviePairDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MoviePairDetailsScreen'>;
type MoviePairDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MoviePairDetailsScreen'>;

type Props = {
  navigation: MoviePairDetailsScreenNavigationProp;
  route: MoviePairDetailsScreenRouteProp;
};

const MoviePairDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { movieA, movieB } = route.params;

  const [selectedActorA, setSelectedActorA] = useState<Actor | null>(null);
  const [selectedActorB, setSelectedActorB] = useState<Actor | null>(null);
  const [actorMoviesA, setActorMoviesA] = useState<Movie[]>([]);
  const [actorMoviesB, setActorMoviesB] = useState<Movie[]>([]);
  const [currentMovieA, setCurrentMovieA] = useState<Movie | null>(movieA);
  const [currentMovieB, setCurrentMovieB] = useState<Movie | null>(movieB);
  const [currentActorsA, setCurrentActorsA] = useState<Actor[]>(movieA.actors);
  const [currentActorsB, setCurrentActorsB] = useState<Actor[]>(movieB.actors);
  const [loadingA, setLoadingA] = useState<boolean>(false);
  const [loadingB, setLoadingB] = useState<boolean>(false);

  const handleActorPress = async (actorId: number, actorName: string, profilePath: string, fromMovie: 'A' | 'B') => {
    if (fromMovie === 'A') {
      setSelectedActorA({ id: actorId, name: actorName, profilePath });
      setLoadingA(true);
    } else {
      setSelectedActorB({ id: actorId, name: actorName, profilePath });
      setLoadingB(true);
    }

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const movies = response.data.cast.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
      }));

      if (fromMovie === 'A') {
        setActorMoviesA(movies);
        setLoadingA(false);
      } else {
        setActorMoviesB(movies);
        setLoadingB(false);
      }
    } catch (error) {
      console.error('Error fetching actor movies:', error);
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
        setCurrentMovieA({ id: movieId, title: movieTitle, actors, posterPath });
        setCurrentActorsA(actors);
        setSelectedActorA(null);  // Reset selected actor
        setLoadingA(false);
      } else {
        setCurrentMovieB({ id: movieId, title: movieTitle, actors, posterPath });
        setCurrentActorsB(actors);
        setSelectedActorB(null);  // Reset selected actor
        setLoadingB(false);
      }
    } catch (error) {
      console.error('Error fetching movie credits:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.moviesRow}>
          {/* Movie A side */}
          <View style={styles.movieContainer}>
            <Text style={styles.movieLabel}>
              {selectedActorA ? selectedActorA.name : currentMovieA!.title}
            </Text>
            <Image
              source={{ uri: selectedActorA
                ? `https://image.tmdb.org/t/p/w500${selectedActorA.profilePath}`
                : `https://image.tmdb.org/t/p/w500${currentMovieA!.posterPath}` }}
              style={styles.poster}
            />
            <Text style={styles.title}>
              {selectedActorA ? 'Movies' : 'Top 10 Actors'}
            </Text>
            <Text style={styles.subtitle}>
              {selectedActorA ? 'Movies this actor has been in:' : 'Top 10 Actors in this Movie:'}
            </Text>
            {loadingA ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : selectedActorA ? (
              <FlatList
                data={actorMoviesA}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.actorContainer} onPress={() => handleMoviePress(item.id, item.title, item.posterPath, 'A')}>
                    <Text style={styles.actorName}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              currentActorsA.map(actor => (
                <TouchableOpacity
                  key={actor.id}
                  style={styles.actorContainer}
                  onPress={() => handleActorPress(actor.id, actor.name, actor.profilePath, 'A')}
                >
                  <Text style={styles.actorName}>{actor.name}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Movie B side */}
          <View style={styles.movieContainer}>
            <Text style={styles.movieLabel}>
              {selectedActorB ? selectedActorB.name : currentMovieB!.title}
            </Text>
            <Image
              source={{ uri: selectedActorB
                ? `https://image.tmdb.org/t/p/w500${selectedActorB.profilePath}`
                : `https://image.tmdb.org/t/p/w500${currentMovieB!.posterPath}` }}
              style={styles.poster}
            />
            <Text style={styles.title}>
              {selectedActorB ? 'Movies' : 'Top 10 Actors'}
            </Text>
            <Text style={styles.subtitle}>
              {selectedActorB ? 'Movies this actor has been in:' : 'Top 10 Actors in this Movie:'}
            </Text>
            {loadingB ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : selectedActorB ? (
              <FlatList
                data={actorMoviesB}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.actorContainer} onPress={() => handleMoviePress(item.id, item.title, item.posterPath, 'B')}>
                    <Text style={styles.actorName}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              currentActorsB.map(actor => (
                <TouchableOpacity
                  key={actor.id}
                  style={styles.actorContainer}
                  onPress={() => handleActorPress(actor.id, actor.name, actor.profilePath, 'B')}
                >
                  <Text style={styles.actorName}>{actor.name}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 10,
    paddingBottom: 70, // Adjusted padding to ensure all content is accessible
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
    marginBottom: 3,
  },
  poster: {
    width: 120,
    height: 180,
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
  actorContainer: {
    marginBottom: 8,
  },
  actorName: {
    fontSize: 12,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MoviePairDetailsScreen;
