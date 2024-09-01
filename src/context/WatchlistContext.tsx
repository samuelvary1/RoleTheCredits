// WatchlistContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { WatchlistItem } from '../types';
import auth from '@react-native-firebase/auth';

type WatchlistContextType = {
  watchlist: WatchlistItem[];
  addToWatchlist: (movie: WatchlistItem) => void;
  removeFromWatchlist: (movieId: number) => void;
  setWatchlistForUser: (userId: string) => void;
};

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: ReactNode; userId: string | null }> = ({ children, userId }) => {
  const [watchlists, setWatchlists] = useState<{ [userId: string]: WatchlistItem[] }>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  
  const user = auth().currentUser;

  useEffect(() => {
    if (user) {
      setWatchlistForUser(user.uid);
    }
  }, [user]);


  const setWatchlistForUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const addToWatchlist = (movie: WatchlistItem) => {
    if (currentUserId) {
      setWatchlists((prevWatchlists) => ({
        ...prevWatchlists,
        [currentUserId]: [...(prevWatchlists[currentUserId] || []), movie],
      }));
    } else {
      console.warn("Cannot add to watchlist: no user is currently set.");
    }
  };

  const removeFromWatchlist = (movieId: number) => {
    if (currentUserId) {
      setWatchlists((prevWatchlists) => ({
        ...prevWatchlists,
        [currentUserId]: prevWatchlists[currentUserId].filter((movie) => movie.id !== movieId),
      }));
    } else {
      console.warn("Cannot remove from watchlist: no user is currently set.");
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist: currentUserId ? watchlists[currentUserId] || [] : [],
        addToWatchlist,
        removeFromWatchlist,
        setWatchlistForUser,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
