import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

type CompletedConnection = {
  movieA: string;
  movieB: string;
  moves: number;
  timestamp: FirebaseFirestoreTypes.Timestamp;
};

const CompletedConnectionsScreen: React.FC = () => {
  const [completedConnections, setCompletedConnections] = useState<CompletedConnection[]>([]);

  useEffect(() => {
    const fetchCompletedConnections = async () => {
      const user = auth().currentUser;
      if (user) {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        const data = userDoc.data();
        setCompletedConnections(data?.completedConnections || []);
      }
    };

    fetchCompletedConnections();
  }, []);

  const renderConnection = ({ item }: { item: CompletedConnection }) => (
    <View style={styles.connectionItem}>
      <Text style={styles.movieText}>Movie A: {item.movieA}</Text>
      <Text style={styles.movieText}>Movie B: {item.movieB}</Text>
      <Text style={styles.movesText}>Moves: {item.moves}</Text>
      <Text style={styles.timestampText}>
        Completed on: {item.timestamp?.toDate().toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={completedConnections}
        renderItem={renderConnection}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  connectionItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  movieText: {
    fontSize: 16,
  },
  movesText: {
    fontSize: 14,
    color: 'gray',
  },
  timestampText: {
    fontSize: 12,
    color: 'gray',
  },
});

export default CompletedConnectionsScreen;
