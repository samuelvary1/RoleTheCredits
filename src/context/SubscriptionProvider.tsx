import React, { createContext, useContext, useState, useEffect } from 'react';
import { Text } from 'react-native';
import * as RNIap from 'react-native-iap';
import { initConnection, endConnection, getAvailablePurchases, ProductPurchase } from 'react-native-iap';

// Define the context to handle both subscription status and play limits
type SubscriptionContextType = {
  isSubscriber: boolean;
  playsRemaining: number | null; // Allow playsRemaining to be either a number or null for unlimited
};

const SubscriptionContext = createContext<SubscriptionContextType>({
  isSubscriber: false,
  playsRemaining: null,
});

// Export a custom hook to use the subscription status
export const useSubscriptionStatus = () => useContext(SubscriptionContext);

// SubscriptionProvider component to provide subscription status and play limits
export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playsRemaining, setPlaysRemaining] = useState<number | null>(null); // null for unlimited

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        // Initialize connection to the in-app purchase system
        const connectionResult = await initConnection();
        if (connectionResult) {
          console.log("IAP connection initialized successfully");
        } else {
          console.error("Failed to initialize IAP connection");
        }

        // Fetch available purchases
        const purchases: ProductPurchase[] = await getAvailablePurchases();
        console.log("Available purchases:", purchases);

        // Check if the user has the expected subscription for unlimited plays
        const hasSubscription = purchases.some(
          (purchase) =>
            purchase.productId === 'role_the_credits_99c_monthly' && purchase.transactionReceipt
        );

        // If the user has a subscription, grant unlimited plays
        if (hasSubscription) {
          setIsSubscriber(true);
          setPlaysRemaining(null); // Unlimited plays for subscribers
        } else {
          setIsSubscriber(false);
          setPlaysRemaining(1); // Non-subscribers get 1 play (or modify this based on your logic)
        }

        setLoading(false); // Mark loading as complete
      } catch (error) {
        console.error('Error checking subscription status:', error);
        setLoading(false); // Mark loading as complete even on error
      }
    };

    // Call the function to check subscription status
    checkSubscriptionStatus();

    // Clean up the in-app purchase connection on component unmount
    return () => {
      RNIap.endConnection();
    };
  }, []);

  // Display a loading message while checking subscription status
  if (loading) {
    return <Text>Checking subscription status...</Text>;
  }

  return (
    <SubscriptionContext.Provider value={{ isSubscriber, playsRemaining }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;
