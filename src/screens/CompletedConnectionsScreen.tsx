import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type CompletedConnectionsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CompletedConnectionsScreen'
>;

type CompletedConnectionsScreenRouteProp = RouteProp<
  RootStackParamList,
  'CompletedConnectionsScreen'
>;

type Props = {
  navigation: CompletedConnectionsScreenNavigationProp;
  route: CompletedConnectionsScreenRouteProp;
};

const CompletedConnectionsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { completedConnections } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Connections</Text>
      {/* Render the completed connections list here */}
      <Button title="Back to Account Overview" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default CompletedConnectionsScreen;
