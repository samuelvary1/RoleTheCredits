import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image, ActivityIndicator, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { CompletedConnection } from '../types';
import Icon from 'react-native-vector-icons/FontAwesome';

type CompletedConnectionsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CompletedConnectionsScreen'
>;

type Props = {
  navigation: CompletedConnectionsScreenNavigationProp;
};

const CompletedConnectionsScreen: React.FC<Props> = ({ navigation }) => {
  const [completedConnections, setCompletedConnections] = useState<CompletedConnection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompletedConnections = async () => {
      const user = auth().currentUser;
      if (user) {
        try {
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setCompletedConnections(userData?.completedConnections || []);
          }
        } catch (error) {
          console.error('Error fetching completed connections:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCompletedConnections();
  }, []);

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this connection?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => removeCompletedConnection(id) }
      ],
      { cancelable: true }
    );
  };

  const removeCompletedConnection = async (id: string) => {
    const user = auth().currentUser;
    if (user) {
      try {
        const connectionToRemove = completedConnections.find(conn => conn.id === id);
        const userDocRef = firestore().collection('users').doc(user.uid);
        await userDocRef.update({
          completedConnections: firestore.FieldValue.arrayRemove(connectionToRemove),
        });
        setCompletedConnections(completedConnections.filter(conn => conn.id !== id));
      } catch (error) {
        console.error('Error removing completed connection:', error);
      }
    }
  };

  const renderItem = ({ item }: { item: CompletedConnection }) => (
    <View style={styles.itemContainer}>
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w200${item.movieA.posterPath}` }}
          style={styles.posterImage}
        />
        <Icon
          name="arrow-right"
          size={24}
          color="#000"
          style={styles.arrowIcon}
        />
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w200${item.movieB.posterPath}` }}
          style={styles.posterImage}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.movieTitle}>{`${item.movieA.title} to ${item.movieB.title}`}</Text>
        <Text style={styles.movesText}>{`Moves: ${item.moves}`}</Text>
        <TouchableOpacity
          style={styles.tryAgainButton}
          onPress={() =>
            navigation.navigate('GameScreen', {
              movieA: item.movieA,
              movieB: item.movieB,
            })
          }
        >
          <Text style={styles.buttonText}>Try this pair again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDelete(item.id)}
        >
          <Icon
            name="trash"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Completed Connections</Text>
      <FlatList
        data={completedConnections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No completed connections yet.</Text>}
        contentContainerStyle={completedConnections.length === 0 ? styles.flatListEmpty : styles.flatListContent}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Account Overview</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  flatListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  posterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  posterImage: {
    width: 50,
    height: 75,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  arrowIcon: {
    marginHorizontal: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  itemContainer: {
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5dc', // Creamy off-white background color
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  movesText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  tryAgainButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF4136',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  emptyMessage: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
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

export default CompletedConnectionsScreen;
