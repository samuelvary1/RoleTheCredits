import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
  const { path, startNode, targetNode, moves } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Connection Path</Text>
        <Text style={styles.subtitle}>From {startNode.title} to {targetNode.title}</Text>
        <Text style={styles.moves}>Total Moves: {moves}</Text>

        {path.map((node, index) => (
          <View key={index} style={styles.nodeContainer}>
            <Text style={styles.nodeText}>
              {node.type === 'actor' ? `Actor: ${node.title}` : `Movie: ${node.title}`}
              {' '}
              {node.type === 'movie' ? (index === 0 ? '(Start)' : index === path.length - 1 ? '(End)' : '') : ''}
            </Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.startOverButton} onPress={() => navigation.navigate('RandomMovies')}>
        <Text style={styles.startOverButtonText}>Start Over</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  moves: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  nodeContainer: {
    marginBottom: 10,
  },
  nodeText: {
    fontSize: 16,
    textAlign: 'center',
  },
  startOverButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
  },
  startOverButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ConnectionPathScreen;
