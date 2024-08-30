import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { PathNode } from '../types';

type ConnectionPathScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ConnectionPathScreen'>;
type ConnectionPathScreenRouteProp = RouteProp<RootStackParamList, 'ConnectionPathScreen'>;

type Props = {
  navigation: ConnectionPathScreenNavigationProp;
  route: ConnectionPathScreenRouteProp;
};

const ConnectionPathScreen: React.FC<Props> = ({ navigation, route }) => {
  const { path, moves } = route.params;

  const handleStartOver = () => {
    navigation.navigate('RandomMovies');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Connection Path</Text>
        <Text style={styles.subtitle}>Moves: {moves}</Text>
        {path.map((node, index) => (
          <View key={index} style={styles.nodeContainer}>
            <Text style={styles.nodeText}>
              {index + 1}. {node.title} ({node.side === 'A' ? 'Movie A' : 'Movie B'})
            </Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.startOverButton} onPress={handleStartOver}>
        <Text style={styles.startOverButtonText}>Start Over</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  nodeContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    width: '100%',
  },
  nodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  startOverButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  startOverButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ConnectionPathScreen;
