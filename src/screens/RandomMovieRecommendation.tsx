import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Button, StyleSheet, Alert, Dimensions, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import axios from 'axios';
import { TMDB_API_KEY } from '@env';
import { useSubscriptionStatus } from '../context/SubscriptionProvider'; 
import auth from '@react-native-firebase/auth'; 
import { useWatchlist } from '../context/WatchlistContext'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/Ionicons'; // Icon library

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

  const fetchRandomMovie = async () => {
    setLoading(true);
    setMovie(null);

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
      <TouchableOpacity style={styles.pickerButton} onPress={() => setShowGenrePicker(!showGenrePicker)}>
        <Text style={styles.pickerText}>Pick a Genre</Text>
        <Icon name="caret-down" size={20} color="#fff" />
      </TouchableOpacity>

      {showGenrePicker && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modal}>
            <Picker
              selectedValue={genre}
              onValueChange={(itemValue) => setGenre(itemValue)}
              style={styles.picker}>
              <Picker.Item label="Action" value="28" />
              <Picker.Item label="Adventure" value="12" />
              <Picker.Item label="Animation" value="16" />
              <Picker.Item label="Comedy" value="35" />
              <Picker.Item label="Crime" value="80" />
              <Picker.Item label="Documentary" value="99" />
              <Picker.Item label="Drama" value="18" />
              <Picker.Item label="Family" value="10751" />
              <Picker.Item label="Fantasy" value="14" />
              <Picker.Item label="History" value="36" />
              <Picker.Item label="Horror" value="27" />
              <Picker.Item label="Music" value="10402" />
              <Picker.Item label="Mystery" value="9648" />
              <Picker.Item label="Romance" value="10749" />
              <Picker.Item label="Science Fiction" value="878" />
              <Picker.Item label="TV Movie" value="10770" />
              <Picker.Item label="Thriller" value="53" />
              <Picker.Item label="War" value="10752" />
              <Picker.Item label="Western" value="37" />
            </Picker>
            <Button title="Close" onPress={() => setShowGenrePicker(false)} />
          </View>
        </Modal>
      )}

      {/* Year Picker Button */}
      <TouchableOpacity style={styles.pickerButton} onPress={() => setShowYearPicker(!showYearPicker)}>
        <Text style={styles.pickerText}>Pick a Year Range</Text>
        <Icon name="caret-down" size={20} color="#fff" />
      </TouchableOpacity>

      {showYearPicker && (
        <Modal transparent={true} animationType="slide">
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

      <View style={styles.shuffleButtonContainer}>
        <TouchableOpacity style={styles.blueButton} onPress={fetchRandomMovie} disabled={loading}>
          <Text style={styles.buttonText}>Shuffle</Text>
        </TouchableOpacity>
      </View>

      {loading && <Text>Loading...</Text>}

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
    justifyContent: 'flex-start',
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
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
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
