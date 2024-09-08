import React, { createContext, useContext, useState, useEffect } from 'react';
import { Text, Alert } from 'react-native';
import * as RNIap from 'react-native-iap';
import { initConnection, endConnection, getAvailablePurchases, ProductPurchase } from 'react-native-iap';

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
        const connectionResult = await initConnection();
        if (connectionResult) {
          console.log("IAP connection initialized successfully");
          isConnectionActive = true;
        } else {
          console.error("Failed to initialize IAP connection");
          Alert.alert("Connection Error", "Could not establish connection to the store.");
          return;
        }

        // Fetch available purchases
        console.log("Fetching available purchases...");
        const purchases: ProductPurchase[] = await getAvailablePurchases();
        
        if (!purchases || purchases.length === 0) {
          console.warn("No purchases found. Make sure you are using a sandbox/test account.");
        } else {
          console.log("Available purchases:", purchases);
        }

        // Check if the user has the expected subscription for unlimited plays
        const hasSubscription = purchases.some(
          (purchase) =>
            purchase.productId === 'role_the_credits_99c_monthly' &&
            purchase.transactionReceipt &&
            purchase.transactionReceipt.length > 0 // Ensure receipt is valid
        );

        console.log("Has subscription:", hasSubscription); // Log subscription status for debugging
        setIsSubscriber(hasSubscription);
      } catch (error) {
        console.error('Error fetching available purchases:', error);
        Alert.alert('Error', 'There was an issue fetching available purchases. Please try again later.');
      } finally {
        console.log("Subscription status check complete");
        setLoading(false);
        
        // Only end connection if it was successfully established
        if (isConnectionActive) {
          console.log("Ending IAP connection...");
          endConnection();
        }
      }
    };

    checkSubscriptionStatus();

    return () => {
      console.log("Cleaning up IAP connection...");
      if (isConnectionActive) {
        endConnection();
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
