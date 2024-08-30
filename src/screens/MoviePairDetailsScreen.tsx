import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Actor } from '../types';

type MoviePairDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MoviePairDetailsScreen'>;
type MoviePairDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MoviePairDetailsScreen'>;

type Props = {
  navigation: MoviePairDetailsScreenNavigationProp;
  route: MoviePairDetailsScreenRouteProp;
};

const MoviePairDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { movieA, movieB } = route.params;

  const handleActorPress = (actorId: number, actorName: string) => {
    navigation.navigate('ActorMoviesScreen', {
      actorId,
      actorName,
      movieA, // Pass Movie A for context in ActorMoviesScreen
      movieB, // Pass Movie B as part of the ongoing game
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.moviesRow}>
          <View style={styles.movieContainer}>
            <Text style={styles.movieLabel}>Movie A</Text>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${movieA.posterPath}` }}
              style={styles.poster}
            />
            <Text style={styles.title}>{movieA.title}</Text>
            <Text style={styles.subtitle}>Top 10 Actors:</Text>
            {movieA.actors.map(actor => (
              <TouchableOpacity
                key={actor.id}
                style={styles.actorContainer}
                onPress={() => handleActorPress(actor.id, actor.name)}
              >
                {actor.profilePath ? (
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w200${actor.profilePath}` }}
                    style={styles.actorImage}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>No Image</Text>
                  </View>
                )}
                <Text style={styles.actorName}>{actor.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.movieContainer}>
            <Text style={styles.movieLabel}>Movie B</Text>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${movieB.posterPath}` }}
              style={styles.poster}
            />
            <Text style={styles.title}>{movieB.title}</Text>
            <Text style={styles.subtitle}>Top 10 Actors:</Text>
            {movieB.actors.map(actor => (
              <TouchableOpacity
                key={actor.id}
                style={styles.actorContainer}
                onPress={() => handleActorPress(actor.id, actor.name)}
              >
                {actor.profilePath ? (
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w200${actor.profilePath}` }}
                    style={styles.actorImage}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>No Image</Text>
                  </View>
                )}
                <Text style={styles.actorName}>{actor.name}</Text>
              </TouchableOpacity>
            ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actorImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  placeholderImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  placeholderText: {
    fontSize: 10,
    color: '#fff',
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
