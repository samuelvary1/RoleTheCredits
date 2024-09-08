import React, { createContext, useContext, useState, useEffect } from 'react';
import { Text, Alert } from 'react-native';
import * as RNIap from 'react-native-iap';

// Define the context for the subscription status
const SubscriptionContext = createContext({ isSubscriber: false, loading: true });

// Export a custom hook to use the subscription status
export const useSubscriptionStatus = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isConnectionActive = false;

    const checkSubscriptionStatus = async () => {
      try {
        console.log("Starting IAP connection...");

        // Initialize connection to the in-app purchase system
        const connectionResult = await RNIap.initConnection();
        if (!connectionResult) {
          throw new Error('Failed to initialize IAP connection');
        }
        isConnectionActive = true;

        // Fetch available purchases
        console.log("Fetching available purchases...");
        const purchases = await RNIap.getAvailablePurchases();

        if (!purchases || purchases.length === 0) {
          console.log("No purchases found.");
          setIsSubscriber(false); // No purchases means the user is not subscribed
        } else {
          console.log("Available purchases:", purchases);
          // Check if the user has an active subscription
          const hasSubscription = purchases.some(
            (purchase) =>
              purchase.productId === 'role_the_credits_99c_monthly' && purchase.transactionReceipt
          );
          setIsSubscriber(hasSubscription);
        }
      } catch (error) {
        console.error('Error fetching available purchases:', error);
        Alert.alert('Error', 'There was an issue fetching available purchases. Please try again later.');
        setIsSubscriber(false); // Default to not subscribed on error
      } finally {
        setLoading(false);
        if (isConnectionActive) {
          console.log("Ending IAP connection...");
          await RNIap.endConnection();
        }
      }
    };

    checkSubscriptionStatus();

    return () => {
      if (isConnectionActive) {
        RNIap.endConnection();
      }
    };
  }, []);

  if (loading) {
    return <Text>Checking subscription status...</Text>;
  }

  return (
    <SubscriptionContext.Provider value={{ isSubscriber, loading }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;
