import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Dimensions, Modal, Button, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import axios from 'axios';
import { TMDB_API_KEY } from '@env';
import { useSubscriptionStatus } from '../context/SubscriptionProvider'; 
import auth from '@react-native-firebase/auth'; 
import { useWatchlist } from '../context/WatchlistContext'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Icon library

const { height: windowHeight } = Dimensions.get('window');
const { width: windowWidth } = Dimensions.get('window');

type RandomMovieScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RandomMovieRecommendation'>;

type Props = {
  navigation: RandomMovieScreenNavigationProp;
};

// Genre mappings (number to string)
const genreMappings: { [key: string]: string } = {
  '28': 'Action',
  '12': 'Adventure',
  '16': 'Animation',
  '35': 'Comedy',
  '80': 'Crime',
  '99': 'Documentary',
  '18': 'Drama',
  '10751': 'Family',
  '14': 'Fantasy',
  '36': 'History',
  '27': 'Horror',
  '10402': 'Music',
  '9648': 'Mystery',
  '10749': 'Romance',
  '878': 'Science Fiction',
  '10770': 'TV Movie',
  '53': 'Thriller',
  '10752': 'War',
  '37': 'Western',
};

const RandomMovieRecommendation: React.FC<Props> = ({ navigation }) => {
  const { isSubscriber } = useSubscriptionStatus();
  const user = auth().currentUser;
  const { addToWatchlist } = useWatchlist();
  const isSamVary = user?.email === 'sam.vary@gmail.com';

  const [movie, setMovie] = useState<any>(null); 
  const [genre, setGenre] = useState<string>('28'); 
  const [yearRange, setYearRange] = useState<string>('2000-2023'); 
  const [loading, setLoading] = useState<boolean>(false);
  const [showGenrePicker, setShowGenrePicker] = useState<boolean>(false);
  const [showYearPicker, setShowYearPicker] = useState<boolean>(false);

  useEffect(() => {
    if (!isSubscriber && !isSamVary) {
      Alert.alert('Access Denied', 'You must be subscribed to use this feature.');
    }
  }, [isSubscriber, isSamVary]);

  // Generate year ranges (this part stays the same)
  const generateYearRanges = () => {
    const currentYear = new Date().getFullYear();
    const yearRanges: string[] = [];

    for (let startYear = 1900; startYear < currentYear; startYear += 10) {
      const endYear = Math.min(startYear + 9, currentYear);
      yearRanges.push(`${startYear}-${endYear}`);
    }

    yearRanges.push(`2000-${currentYear}`);
    return yearRanges;
  };

  // Fetch a random movie (this part stays the same)
  const fetchRandomMovie = async () => {
    setLoading(true);

    try {
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const [startYear, endYear] = yearRange.split('-');
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
      console.error('Error fetching random movie:', error);
      Alert.alert('Error', 'Failed to fetch random movies. Please check your network and API settings.');
    } finally {
      setLoading(false);
    }
  };

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
      {/* Poster Container */}
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

      {/* Genre Picker Button */}
      <View style={styles.fixedPickerButton}>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowGenrePicker(!showGenrePicker)}>
          <Text style={styles.pickerText}>{genreMappings[genre]}</Text>
          <FontAwesome name="caret-down" size={20} color="#fff" />
        </TouchableOpacity>
        {showGenrePicker && (
          <Modal transparent={true} animationType="none">
            <View style={styles.modal}>
              <Picker
                selectedValue={genre}
                onValueChange={(itemValue) => setGenre(itemValue)}
                style={styles.picker}>
                {Object.entries(genreMappings).map(([value, label]) => (
                  <Picker.Item label={label} value={value} key={value} />
                ))}
              </Picker>
              <Button title="Close" onPress={() => setShowGenrePicker(false)} />
            </View>
          </Modal>
        )}
      </View>

      {/* Year Picker Button */}
      <View style={styles.fixedPickerButton}>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowYearPicker(!showYearPicker)}>
          <Text style={styles.pickerText}>{yearRange}</Text>
          <FontAwesome name="caret-down" size={20} color="#fff" />
        </TouchableOpacity>
        {showYearPicker && (
          <Modal transparent={true} animationType="none">
            <View style={styles.modal}>
              <Picker
                selectedValue={yearRange}
                onValueChange={(itemValue) => setYearRange(itemValue)}
                style={styles.picker}>
                {generateYearRanges().map((range) => (
                  <Picker.Item label={range} value={range} key={range} />
                ))}
              </Picker>
              <Button title="Close" onPress={() => setShowYearPicker(false)} />
            </View>
          </Modal>
        )}
      </View>

      {/* Shuffle Button */}
      <View style={styles.shuffleButtonContainer}>
        <TouchableOpacity style={styles.blueButton} onPress={fetchRandomMovie} disabled={loading}>
          <Text style={styles.buttonText}>Shuffle</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {/* Back Button */}
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
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  posterContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  poster: {
    width: windowWidth * 0.4,
    height: windowHeight * 0.25,
    resizeMode: 'cover',
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  fixedPickerButton: {
    marginBottom: 20, // Add space between pickers and buttons
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  pickerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    height: 200,
    width: '100%',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shuffleButtonContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  blueButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RandomMovieRecommendation;
