import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Movie } from '../types';

const WatchlistScreen = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setWatchlist(doc.data()?.watchlist || []);
          }
        });

      return () => unsubscribe();
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Watchlist</Text>
      {watchlist.length === 0 ? (
        <Text style={styles.emptyText}>Your watchlist is empty.</Text>
      ) : (
        watchlist.map((movie, index) => (
          <View key={index} style={styles.movieContainer}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${movie.posterPath}` }}
              style={styles.poster}
            />
            <Text style={styles.movieTitle}>{movie.title}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  movieContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  poster: {
    width: 150,
    height: 225,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WatchlistScreen;
