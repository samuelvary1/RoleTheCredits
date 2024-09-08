import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as RNIap from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For tracking free plays

// Define the context for the subscription status
const SubscriptionContext = createContext({ isSubscriber: false, loading: true });

// Export a custom hook to use the subscription status
export const useSubscriptionStatus = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        // Initialize connection to the in-app purchase system
        const connectionResult = await RNIap.initConnection();
        if (!connectionResult) {
          throw new Error('Failed to initialize IAP connection');
        }

        // Fetch available purchases
        const purchases = await RNIap.getAvailablePurchases();
        const hasSubscription = purchases.some(
          (purchase) => purchase.productId === 'role_the_credits_99c_monthly' && purchase.transactionReceipt
        );

        setIsSubscriber(hasSubscription);
      } catch (error) {
        console.error('Error fetching available purchases:', error);
        Alert.alert('Error', 'There was an issue fetching available purchases. Please try again later.');
        setIsSubscriber(false); // Default to not subscribed on error
      } finally {
        setLoading(false);
        await RNIap.endConnection();
      }
    };

    checkSubscriptionStatus();
  }, []);

  return (
    <SubscriptionContext.Provider value={{ isSubscriber, loading }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;
