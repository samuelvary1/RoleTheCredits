import React, { createContext, useContext, useState, useEffect } from 'react';
import RNIap, { getAvailablePurchases, ProductPurchase } from 'react-native-iap';

// Define the context for the subscription status
const SubscriptionContext = createContext(false);

// Export a custom hook to use the subscription status
export const useSubscriptionStatus = () => useContext(SubscriptionContext);

// Update SubscriptionProvider to accept children
export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSubscriber, setIsSubscriber] = useState(false);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        await RNIap.initConnection();
        const purchases: ProductPurchase[] = await getAvailablePurchases();
        const hasSubscription = purchases.some(purchase => 
          purchase.productId === 'role_the_credits_99c_monthly' && purchase.transactionReceipt
        );
        setIsSubscriber(hasSubscription);
      } catch (error) {
        console.error('Error checking subscription status:', error);
      }
    };

    checkSubscriptionStatus();
    
    return () => {
      RNIap.endConnection();
    };
  }, []);

  return (
    <SubscriptionContext.Provider value={isSubscriber}>
      {children} {/* Render the children passed into the provider */}
    </SubscriptionContext.Provider>
  );
};