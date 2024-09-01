import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useCompletedConnections } from '../context/CompletedConnectionsContext';
import { Movie } from '../types';

type CompletedConnectionsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CompletedConnectionsScreen'
>;

type Props = {
  navigation: CompletedConnectionsScreenNavigationProp;
};

const CompletedConnectionsScreen: React.FC<Props> = ({ navigation }) => {
  const { completedConnections } = useCompletedConnections();

  const renderItem = ({ item }: { item: { movieA: Movie; movieB: Movie; moves: number } }) => (
    <View style={styles.itemContainer}>
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Completed Connections</Text>
      <FlatList
        data={completedConnections}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No completed connections yet.</Text>}
        contentContainerStyle={styles.flatListContent}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    marginBottom: 20,
    alignItems: 'center',
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
