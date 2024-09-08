import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type HelpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HelpScreen'>;

type Props = {
  navigation: HelpScreenNavigationProp;
};

const HelpScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help & Features</Text>
      
      <Text style={styles.helpText}>
        This app helps you connect movies through actors. You can explore movies, 
        create connections, and track your progress. Subscribers get extra benefits like 
        random movie recommendations and unlimited plays. Non-subscribers are limited 
        to a certain number of plays per day.
      </Text>

      {/* Back to Account Overview Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('AccountOverviewScreen')}
      >
        <Text style={styles.backButtonText}>Back to Account Overview</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007BFF',  // Pleasing blue color for the title
  },
  helpText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333333',
    paddingHorizontal: 15,
  },
  backButton: {
    backgroundColor: '#32CD32',  // Light green color for the button
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HelpScreen;
