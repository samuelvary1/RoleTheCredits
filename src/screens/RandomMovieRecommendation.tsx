import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Button, StyleSheet, Alert, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Genre Picker
import axios from 'axios';
import { TMDB_API_KEY } from '@env';
import { useSubscriptionStatus } from '../context/SubscriptionProvider'; // Subscription status hook
import auth from '@react-native-firebase/auth'; // Firebase auth
import { useWatchlist } from '../context/WatchlistContext'; // Add to watchlist
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { height: windowHeight } = Dimensions.get('window');
const { width: windowWidth } = Dimensions.get('window');

type RandomMovieScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RandomMovieRecommendation'>;

type Props = {
  navigation: RandomMovieScreenNavigationProp;
};

const RandomMovieRecommendation: React.FC<Props> = ({ navigation }) => {
  const { isSubscriber } = useSubscriptionStatus();
  const user = auth().currentUser;
  const { addToWatchlist } = useWatchlist();
  const isSamVary = user?.email === 'sam.vary@gmail.com';

  const [movie, setMovie] = useState<any>(null); // Random movie state
  const [genre, setGenre] = useState<string>('28'); // Default genre: Action
  const [yearRange, setYearRange] = useState<string>('2000-2023'); // Default year range as a string
  const [loading, setLoading] = useState<boolean>(false);
  const [showGenrePicker, setShowGenrePicker] = useState<boolean>(false); // Toggle for Genre Picker
  const [showYearPicker, setShowYearPicker] = useState<boolean>(false); // Toggle for Year Range Picker

  // Only allow access if subscribed or email is 'sam.vary@gmail.com'
  useEffect(() => {
    if (!isSubscriber && !isSamVary) {
      Alert.alert('Access Denied', 'You must be subscribed to use this feature.');
    }
  }, [isSubscriber, isSamVary]);

  // Fetch a random movie based on selected genre and year range
  const fetchRandomMovie = async () => {
    setLoading(true);
    setMovie(null); // Clear the previous movie state

    try {
      const randomPage = Math.floor(Math.random() * 10) + 1; // Pick a random page from the results
      const [startYear, endYear] = yearRange.split('-'); // Split the year range string into start and end year

      // Debugging Log: Ensure the parameters are correct
      console.log(`Fetching movies with genre: ${genre}, from ${startYear} to ${endYear}`);

      // Build the query string with genre and year filters
      const genreFilter = genre ? `&with_genres=${genre}` : ''; 
      const yearFilter = `&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`;

      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}${genreFilter}${yearFilter}&page=${randomPage}`
      );
      
      const movies = response.data.results;
      if (movies.length === 0) {
        Alert.alert('No movies found', 'Try a different genre or year range.');
      } else {
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        setMovie(randomMovie);
      }
    } catch (error) {
      // Enhanced Error Logging
      console.error('Error fetching random movie:', error);
      Alert.alert('Error', 'Failed to fetch random movies. Please check your network and API settings.');
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
      {/* Movie Poster */}
      {movie && (
        <View style={styles.posterContainer}>
          <TouchableOpacity onPress={handleAddToWatchlist}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
              style={styles.poster}
            />
          </TouchableOpacity>
          <Text style={styles.movieTitle}>{movie.title}</Text>
        </View>
      )}

      {/* Toggle Genre Picker */}
      <TouchableOpacity onPress={() => setShowGenrePicker(!showGenrePicker)}>
        <Text style={styles.label}>Pick a Genre:</Text>
      </TouchableOpacity>
      {showGenrePicker && (
        <Picker selectedValue={genre} onValueChange={(itemValue) => setGenre(itemValue)}>
          {/* Populate the Picker with available genres */}
          <Picker.Item label="Action" value="28" />
          <Picker.Item label="Comedy" value="35" />
          <Picker.Item label="Drama" value="18" />
          {/* Add more genres as needed */}
        </Picker>
      )}

      {/* Toggle Year Range Picker */}
      <TouchableOpacity onPress={() => setShowYearPicker(!showYearPicker)}>
        <Text style={styles.label}>Pick a Year Range:</Text>
      </TouchableOpacity>
      {showYearPicker && (
        <Picker selectedValue={yearRange} onValueChange={(itemValue) => setYearRange(itemValue)}>
          <Picker.Item label="2000-2023" value="2000-2023" />
          <Picker.Item label="1990-1999" value="1990-1999" />
          <Picker.Item label="1980-1989" value="1980-1989" />
          {/* Add more year ranges as needed */}
        </Picker>
      )}

      {/* Shuffle Button */}
      <View style={styles.shuffleButtonContainer}>
        <TouchableOpacity style={styles.blueButton} onPress={fetchRandomMovie} disabled={loading}>
          <Text style={styles.buttonText}>Shuffle</Text>
        </TouchableOpacity>
      </View>

      {loading && <Text>Loading...</Text>}

      {/* Back to Account Overview Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.blueButton} onPress={() => navigation.navigate('AccountOverviewScreen')}>
          <Text style={styles.buttonText}>Back to Account Overview</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Add padding to avoid the top speaker/notch
    justifyContent: 'flex-start', // Ensure top alignment
    padding: 20,
  },
  posterContainer: {
    alignItems: 'center',
    marginBottom: 15, // Reduced margin for lowering the poster
  },
  poster: {
    width: windowWidth * 0.4, // Shrink the poster size
    height: windowHeight * 0.25, // Shrink the poster height proportionally
    resizeMode: 'cover',
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  label: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  shuffleButtonContainer: {
    position: 'absolute',
    bottom: 80, // Adjusted to allow space for the Back button
    left: 20,
    right: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 30, // Keep the back button fixed at the bottom
    left: 20,
    right: 20,
  },
  blueButton: {
    backgroundColor: '#007BFF', // Blue background for the buttons
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RandomMovieRecommendation;
