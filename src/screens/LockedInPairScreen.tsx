import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type LockedInPairNavigationProp = StackNavigationProp<RootStackParamList, 'LockedInPairScreen'>;
type LockedInPairRouteProp = RouteProp<RootStackParamList, 'LockedInPairScreen'>;

type Props = {
  navigation: LockedInPairNavigationProp;
  route: LockedInPairRouteProp;
};

const LockedInPairScreen: React.FC<Props> = ({ navigation, route }) => {
  const { movieA, movieB } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Locked-In Pair</Text>
      <View style={styles.moviePair}>
        <View style={styles.movie}>
          <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movieA.posterPath}` }} style={styles.poster} />
          <Text style={styles.movieTitle}>{movieA.title}</Text>
        </View>
        <View style={styles.movie}>
          <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movieB.posterPath}` }} style={styles.poster} />
          <Text style={styles.movieTitle}>{movieB.title}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={() => navigation.goBack()}>
        <Text style={styles.continueButtonText}>Continue Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '100%',
  },
  movie: {
    alignItems: 'center',
    flex: 1,
  },
  poster: {
    width: 150,
    height: 225,
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 30,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LockedInPairScreen;
