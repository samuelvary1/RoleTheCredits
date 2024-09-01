import { createStore, applyMiddleware, Reducer } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { AppState, CombinedActions, CompletedConnectionsState, WatchlistState } from '../types'; 
import watchlistReducer from './watchlistReducer';
import completedConnectionsReducer from './completedConnectionsReducer';

// Persist configs
const watchlistPersistConfig = {
  key: 'watchlist',
  storage: AsyncStorage,
};

const completedConnectionsPersistConfig = {
  key: 'completedConnections',
  storage: AsyncStorage,
};

// Persisted reducers
const persistedWatchlistReducer = persistReducer<WatchlistState & PersistPartial, CombinedActions>(
  watchlistPersistConfig,
  watchlistReducer as Reducer<WatchlistState & PersistPartial, CombinedActions>
);

const persistedCompletedConnectionsReducer = persistReducer<CompletedConnectionsState & PersistPartial, CombinedActions>(
  completedConnectionsPersistConfig,
  completedConnectionsReducer as Reducer<CompletedConnectionsState & PersistPartial, CombinedActions>
);

// Root reducer
const rootReducer: Reducer<AppState & PersistPartial, CombinedActions> = (
  state: (AppState & PersistPartial) | undefined,
  action: CombinedActions
): AppState & PersistPartial => ({
  watchlist: persistedWatchlistReducer(state?.watchlist, action),
  completedConnections: persistedCompletedConnectionsReducer(state?.completedConnections, action),
  _persist: state?._persist as PersistPartial['_persist'],
});

// Middleware setup
const middleware = [thunk as unknown as ThunkMiddleware<AppState & PersistPartial, CombinedActions>]; // Cast thunk as ThunkMiddleware

// Create the store
const store = createStore(
  rootReducer,
  applyMiddleware(...middleware) // Apply middleware correctly
);

const persistor = persistStore(store);

export { store, persistor };
