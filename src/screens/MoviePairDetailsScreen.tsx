import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
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
  const {
    movieA = { id: 0, title: 'Unknown Movie A', posterPath: '', actors: [] },
    movieB = { id: 0, title: 'Unknown Movie B', posterPath: '', actors: [] },
    selectedActorA: prevSelectedActorA = null,
    selectedActorB: prevSelectedActorB = null,
    currentMovieA: prevCurrentMovieA = null,
    currentMovieB: prevCurrentMovieB = null,
  } = route.params;

  const [selectedActorA, setSelectedActorA] = useState<Actor | null>(prevSelectedActorA);
  const [selectedActorB, setSelectedActorB] = useState<Actor | null>(prevSelectedActorB);
  const [actorMoviesA, setActorMoviesA] = useState<Movie[]>([]);
  const [actorMoviesB, setActorMoviesB] = useState<Movie[]>([]);
  const [currentMovieA, setCurrentMovieA] = useState<Movie>(prevCurrentMovieA || movieA);
  const [currentMovieB, setCurrentMovieB] = useState<Movie>(prevCurrentMovieB || movieB);
  const [currentActorsA, setCurrentActorsA] = useState<Actor[]>(prevCurrentMovieA?.actors || movieA.actors);
  const [currentActorsB, setCurrentActorsB] = useState<Actor[]>(prevCurrentMovieB?.actors || movieB.actors);
  const [loadingA, setLoadingA] = useState<boolean>(false);
  const [loadingB, setLoadingB] = useState<boolean>(false);

  const handleActorPress = async (actorId: number, actorName: string, fromMovie: 'A' | 'B') => {
    if (fromMovie === 'A') {
      setLoadingA(true);
    } else {
      setLoadingB(true);
    }

    try {
      const actorResponse = await axios.get(
        `https://api.themoviedb.org/3/person/${actorId}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const profilePath = actorResponse.data.profile_path;

      if (fromMovie === 'A') {
        setSelectedActorA({ id: actorId, name: actorName, profilePath });
        setLoadingA(false);
      } else {
        setSelectedActorB({ id: actorId, name: actorName, profilePath });
        setLoadingB(false);
      }

      const moviesResponse = await axios.get(
        `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const movies = moviesResponse.data.cast.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
      }));

      if (fromMovie === 'A') {
        setActorMoviesA(movies);
      } else {
        setActorMoviesB(movies);
      }
    } catch (error) {
      console.error('Error fetching actor details or movies:', error);
      setLoadingA(false);
      setLoadingB(false);
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
      setLoadingA(false);
      setLoadingB(false);
    }
  };

  const handleStartOver = () => {
    navigation.navigate('RandomMovies');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.moviesRow}>
          {/* Movie A side */}
          <View style={styles.movieContainer}>
            <Text style={styles.movieLabel}>
              {selectedActorA ? selectedActorA.name : currentMovieA.title}
            </Text>
            <Image
              source={{ uri: selectedActorA?.profilePath
                ? `https://image.tmdb.org/t/p/w500${selectedActorA.profilePath}`
                : `https://image.tmdb.org/t/p/w500${currentMovieA.posterPath}` }}
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
              <ScrollView>
                {actorMoviesA.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.actorContainer} onPress={() => handleMoviePress(item.id, item.title, item.posterPath, 'A')}>
                    <Text style={styles.actorName}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <ScrollView>
                {currentActorsA.map(actor => (
                  <TouchableOpacity
                    key={actor.id}
                    style={styles.actorContainer}
                    onPress={() => handleActorPress(actor.id, actor.name, 'A')}
                  >
                    <Text style={styles.actorName}>{actor.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Movie B side */}
          <View style={styles.movieContainer}>
            <Text style={styles.movieLabel}>
              {selectedActorB ? selectedActorB.name : currentMovieB.title}
            </Text>
            <Image
              source={{ uri: selectedActorB?.profilePath
                ? `https://image.tmdb.org/t/p/w500${selectedActorB.profilePath}`
                : `https://image.tmdb.org/t/p/w500${currentMovieB.posterPath}` }}
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
              <ScrollView>
                {actorMoviesB.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.actorContainer} onPress={() => handleMoviePress(item.id, item.title, item.posterPath, 'B')}>
                    <Text style={styles.actorName}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <ScrollView>
                {currentActorsB.map(actor => (
                  <TouchableOpacity
                    key={actor.id}
                    style={styles.actorContainer}
                    onPress={() => handleActorPress(actor.id, actor.name, 'B')}
                  >
                    <Text style={styles.actorName}>{actor.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.startOverButton} onPress={handleStartOver}>
        <Text style={styles.startOverButtonText}>Start Over</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 70, // Adjusted padding to ensure all content is accessible
  },
  moviesRow: {
    flex: 1,
    flexDirection: 'row',
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
  startOverButton: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  startOverButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MoviePairDetailsScreen;
