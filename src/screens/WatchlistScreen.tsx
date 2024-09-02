import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Movie } from '../types';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = StackScreenProps<RootStackParamList, 'WatchlistScreen'>;

const WatchlistScreen: React.FC<Props> = ({ navigation }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const user = auth().currentUser;
      if (user) {
        try {
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setWatchlist(userData?.watchlist || []);
          }
        } catch (error) {
          console.error('Error fetching watchlist:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWatchlist();
  }, []);

  const removeFromWatchlist = async (movieId: number) => {
    const user = auth().currentUser;
    if (user) {
      try {
        const userDocRef = firestore().collection('users').doc(user.uid);
        await userDocRef.update({
          watchlist: firestore.FieldValue.arrayRemove(
            watchlist.find(movie => movie.id === movieId)
          ),
        });
        setWatchlist(watchlist.filter(movie => movie.id !== movieId));
      } catch (error) {
        console.error('Error removing movie from watchlist:', error);
      }
    }
  };

  const renderItem = ({ item }: { item: Movie }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.posterPath}` }} style={styles.poster} />
      <View style={styles.movieDetails}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <TouchableOpacity
          onPress={() => removeFromWatchlist(item.id)}
          style={styles.deleteIconContainer}
        >
          <Icon
            name="trash"
            size={24}
            color="#FF6347"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Watchlist</Text>
      <FlatList
        data={watchlist}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyMessage}>Your watchlist is empty.</Text>}
        contentContainerStyle={watchlist.length === 0 ? styles.flatListEmpty : styles.flatListContent}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Account Overview</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  flatListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  poster: {
    width: 50,
    height: 75,
    marginRight: 15,
    borderRadius: 5,
  },
  movieDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteIconContainer: {
    padding: 5,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  backButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WatchlistScreen;
