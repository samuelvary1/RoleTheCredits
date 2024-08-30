import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SectionList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Movie } from '../types';

type MoviePairDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'MoviePairDetailsScreen'>;
type MoviePairDetailsRouteProp = RouteProp<RootStackParamList, 'MoviePairDetailsScreen'>;

type Props = {
  navigation: MoviePairDetailsNavigationProp;
  route: MoviePairDetailsRouteProp;
};

const MoviePairDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { movieA, movieB } = route.params;

  const sections = [
    { title: 'Movies', data: [{ type: 'movies', movies: [movieA, movieB] }] },
  ];

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'movies') {
      return (
        <View style={styles.moviesContainer}>
          {item.movies.map((movie: Movie, index: number) => (
            <View key={index} style={styles.movieContainer}>
              <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie.posterPath}` }} style={styles.poster} />
              <Text style={styles.movieTitle}>{movie.title}</Text>
              <Text style={styles.subtitle}>Top 10 Actors:</Text>
              {movie.actors.map((actor) => (
                <View key={actor.id} style={styles.actorContainer}>
                  <Image source={{ uri: `https://image.tmdb.org/t/p/w200${actor.profilePath}` }} style={styles.actorImage} />
                  <Text style={styles.actorName}>{actor.name}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Floating Back to Game Button */}
      <TouchableOpacity
        style={styles.backToGameButton}
        onPress={() => navigation.navigate('GameScreen', { movieA, movieB })}
      >
        <Text style={styles.backToGameButtonText}>Back to Game</Text>
      </TouchableOpacity>

      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        contentContainerStyle={styles.sectionListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionListContainer: {
    paddingTop: 60, // Add padding to make space for the floating button
  },
  moviesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  movieContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  poster: {
    width: 150,
    height: 225,
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  actorContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  actorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  actorName: {
    fontSize: 14,
    textAlign: 'center',
  },
  backToGameButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    zIndex: 10, // Ensure the button stays on top
  },
  backToGameButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MoviePairDetailsScreen;
