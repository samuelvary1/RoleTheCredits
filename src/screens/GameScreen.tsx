import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Alert } from 'react-native';

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameScreen'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'GameScreen'>;

type Props = {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
};

type PathNode = {
  id: number;
  title: string;
  type: 'movie' | 'actor';
  connectedTo?: number[]; // IDs of connected nodes
};

type UserProgress = {
  path: PathNode[];
  startNode: PathNode;
  targetNode: PathNode;
  currentNode: PathNode;
  moves: number;
  isConnected: boolean;
};

const GameScreen: React.FC<Props> = ({ route }) => {
  const { movieA, movieB } = route.params;

  const initialProgress: UserProgress = {
    path: [],
    startNode: { id: movieA.id, title: movieA.title, type: 'movie' }, // Initialize with Movie A
    targetNode: { id: movieB.id, title: movieB.title, type: 'movie' }, // Target Movie B
    currentNode: { id: movieA.id, title: movieA.title, type: 'movie' }, // Start at Movie A
    moves: 0,
    isConnected: false,
  };

  const [progress, setProgress] = useState<UserProgress>(initialProgress);

  const navigateToNode = (newNode: PathNode) => {
    setProgress((prevProgress) => {
      const newPath = [...prevProgress.path, newNode];
      const isConnected = newNode.id === prevProgress.targetNode.id;

      return {
        ...prevProgress,
        path: newPath,
        currentNode: newNode,
        moves: prevProgress.moves + 1,
        isConnected,
      };
    });
  };

  useEffect(() => {
    if (progress.isConnected) {
      handleWin();
    }
  }, [progress.isConnected]);

  const handleWin = () => {
    Alert.alert(`You connected the movies in ${progress.moves} moves!`);
    // Additional win logic can be added here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect {progress.startNode.title} to {progress.targetNode.title}</Text>
      <Text style={styles.currentNode}>Current Node: {progress.currentNode.title}</Text>
      <Text style={styles.moves}>Total Moves: {progress.moves}</Text>

      <TouchableOpacity
        style={styles.navigateButton}
        onPress={() => navigateToNode({ id: 3, title: 'Next Movie', type: 'movie' })} // Example next node
      >
        <Text style={styles.navigateButtonText}>Go to Next Node</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  currentNode: {
    fontSize: 18,
    marginBottom: 10,
  },
  moves: {
    fontSize: 16,
    marginBottom: 20,
  },
  navigateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
  },
  navigateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameScreen;