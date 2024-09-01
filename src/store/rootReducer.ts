import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import watchlistReducer from './watchlistReducer';
import completedConnectionsReducer from './completedConnectionsReducer';

// Persist configurations
const watchlistPersistConfig = {
  key: 'watchlist',
  storage: AsyncStorage,
};

const completedConnectionsPersistConfig = {
  key: 'completedConnections',
  storage: AsyncStorage,
};

// Persisted reducers
const persistedWatchlistReducer = persistReducer(watchlistPersistConfig, watchlistReducer);
const persistedCompletedConnectionsReducer = persistReducer(completedConnectionsPersistConfig, completedConnectionsReducer);

// Combine reducers
const rootReducer = combineReducers({
  watchlist: persistedWatchlistReducer,
  completedConnections: persistedCompletedConnectionsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;