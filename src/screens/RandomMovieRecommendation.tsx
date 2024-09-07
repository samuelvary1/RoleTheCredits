import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Genre Picker
import axios from 'axios';
import { TMDB_API_KEY } from '@env';
import { useSubscriptionStatus } from '../context/SubscriptionProvider'; // Subscription status hook
import auth from '@react-native-firebase/auth'; // Firebase auth
import { useWatchlist } from '../context/WatchlistContext'; // Add to watchlist

const RandomMovieRecommendation: React.FC = () => {
  const { isSubscriber } = useSubscriptionStatus();
  const user = auth().currentUser;
  const { addToWatchlist } = useWatchlist();
  const isSamVary = user?.email === 'sam.vary@gmail.com';

  const [movie, setMovie] = useState<any>(null); // Random movie state
  const [genre, setGenre] = useState<string>(''); // Genre picker
  const [yearRange, setYearRange] = useState<[number, number]>([2000, 2023]); // Year range picker
  const [loading, setLoading] = useState<boolean>(false);

  // Only allow access if subscribed or email is 'sam.vary@gmail.com'
  useEffect(() => {
    if (!isSubscriber && !isSamVary) {
      Alert.alert('Access Denied', 'You must be subscribed to use this feature.');
    }
  }, [isSubscriber, isSamVary]);

  // Fetch a random movie based on selected genre and year range
  const fetchRandomMovie = async () => {
    setLoading(true);
    try {
      const randomPage = Math.floor(Math.random() * 10) + 1; // Pick a random page from the results
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genre}&primary_release_date.gte=${yearRange[0]}&primary_release_date.lte=${yearRange[1]}&page=${randomPage}`
      );
      const movies = response.data.results;
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      setMovie(randomMovie);
    } catch (error) {
      console.error('Error fetching random movie:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding the movie to the watchlist
  const handleAddToWatchlist = async () => {
    if (movie) {
      try {
        await addToWatchlist({
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
        });
        Alert.alert('Success', 'Movie added to your watchlist!');
      } catch (error) {
        console.error('Error adding movie to watchlist:', error);
        Alert.alert('Error', 'Failed to add the movie.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Genre Picker */}
      <Text style={styles.label}>Pick a Genre:</Text>
      <Picker selectedValue={genre} onValueChange={(itemValue) => setGenre(itemValue)}>
        {/* Populate the Picker with available genres */}
        <Picker.Item label="Action" value="28" />
        <Picker.Item label="Comedy" value="35" />
        <Picker.Item label="Drama" value="18" />
        {/* Add more genres as needed */}
      </Picker>

      {/* Year Range Picker */}
      <Text style={styles.label}>Pick a Year Range:</Text>
      <Picker selectedValue={yearRange} onValueChange={(itemValue) => setYearRange(itemValue)}>
        <Picker.Item label="2000-2023" value={[2000, 2023]} />
        <Picker.Item label="1990-1999" value={[1990, 1999]} />
        <Picker.Item label="1980-1989" value={[1980, 1989]} />
        {/* Add more year ranges as needed */}
      </Picker>

      {/* Shuffle Button */}
      <Button title="Shuffle" onPress={fetchRandomMovie} disabled={loading} />
      {loading && <Text>Loading...</Text>}

      {/* Movie Recommendation */}
      {movie && (
        <View style={styles.movieContainer}>
          <Text style={styles.movieTitle}>{movie.title}</Text>
          <TouchableOpacity onPress={handleAddToWatchlist}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
              style={styles.poster}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  movieContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  poster: {
    width: 200,
    height: 300,
    resizeMode: 'cover',
    marginVertical: 20,
  },
});

export default RandomMovieRecommendation;
