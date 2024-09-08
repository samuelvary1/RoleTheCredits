import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSubscriptionStatus } from '../context/SubscriptionProvider'; // Custom hook for subscription status
import { requestSubscription } from 'react-native-iap'; // Import IAP functions

type SubscriptionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SubscriptionScreen'>;

type Props = {
  navigation: SubscriptionScreenNavigationProp;
};

const subscriptionSku = 'role_the_credits_99c_monthly';

const SubscriptionScreen: React.FC<Props> = ({ navigation }) => {
  const { isSubscriber, loading: checkingSubscriptionStatus } = useSubscriptionStatus(); // Use custom hook to check if the user is a subscriber
  const [loading, setLoading] = useState<boolean>(false); // Loading state for subscriptions

  // Handle purchase subscription
  const handlePurchaseSubscription = async () => {
    try {
      setLoading(true);
      console.log(subscriptionSku);
      await requestSubscription({ sku: subscriptionSku });
      Alert.alert('Success', 'Subscription purchased successfully!');
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      Alert.alert('Error', 'Failed to purchase subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel subscription (note: actual subscription management may need to be done in app store)
  const handleManageSubscription = () => {
    Alert.alert('Manage Subscription', 'To manage or cancel your subscription, please go to your app store’s subscription settings.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Subscription</Text>

      {checkingSubscriptionStatus || loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : isSubscriber ? (
        <>
          {/* If user is subscribed */}
          <Text style={styles.infoText}>You are currently subscribed.</Text>
          <TouchableOpacity style={styles.button} onPress={handleManageSubscription}>
            <Text style={styles.buttonText}>Manage Subscription</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* If user is not subscribed */}
          <Text style={styles.infoText}>You are not subscribed.</Text>
          <TouchableOpacity style={styles.button} onPress={handlePurchaseSubscription}>
            <Text style={styles.buttonText}>Subscribe for $0.99/month</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SubscriptionScreen;
