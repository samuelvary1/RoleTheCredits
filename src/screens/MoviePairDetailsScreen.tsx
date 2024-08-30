import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type MoviePairDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'MoviePairDetailsScreen'>;
type MoviePairDetailsRouteProp = RouteProp<RootStackParamList, 'MoviePairDetailsScreen'>;

type Props = {
  navigation: MoviePairDetailsNavigationProp;
  route: MoviePairDetailsRouteProp;
};

const MoviePairDetailsScreen: React.FC<Props> = ({ route }) => {
  const { movieA, movieB } = route.params;

  const renderActors = (actors: { name: string; id: number; profilePath: string }[]) => (
    <FlatList
      data={actors}
      keyExtractor={(actor) => actor.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.actorContainer}>
          <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.profilePath}` }} style={styles.actorImage} />
          <Text style={styles.actorName}>{item.name}</Text>
        </View>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie Pair Details</Text>
      <View style={styles.moviePair}>
        <View style={styles.movieContainer}>
          <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movieA.posterPath}` }} style={styles.poster} />
          <Text style={styles.movieTitle}>{movieA.title}</Text>
          <Text style={styles.subtitle}>Top 10 Actors:</Text>
          {renderActors(movieA.actors)}
        </View>
        <View style={styles.movieContainer}>
          <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movieB.posterPath}` }} style={styles.poster} />
          <Text style={styles.movieTitle}>{movieB.title}</Text>
          <Text style={styles.subtitle}>Top 10 Actors:</Text>
          {renderActors(movieB.actors)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  moviePair: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});

export default MoviePairDetailsScreen;
