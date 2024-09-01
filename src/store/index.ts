import { createStore, applyMiddleware, Reducer, Store, AnyAction } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { AppState, CombinedActions } from '../types'; // Assuming you have CombinedActions in your types
import watchlistReducer from './watchlistReducer';
import completedConnectionsReducer from './completedConnectionsReducer';
import { REHYDRATE } from 'redux-persist/es/constants';

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
const persistedWatchlistReducer = persistReducer(
  watchlistPersistConfig,
  watchlistReducer as Reducer<AppState['watchlist'], CombinedActions>
);

const persistedCompletedConnectionsReducer = persistReducer(
  completedConnectionsPersistConfig,
  completedConnectionsReducer as Reducer<AppState['completedConnections'], CombinedActions>
);

// Root reducer
const rootReducer: Reducer<AppState & PersistPartial, CombinedActions> = (
  state,
  action
) => ({
  watchlist: persistedWatchlistReducer(state?.watchlist, action),
  completedConnections: persistedCompletedConnectionsReducer(state?.completedConnections, action),
  _persist: state?._persist as PersistPartial['_persist'],
});

// Middleware setup
const middleware = [thunk as unknown as ThunkMiddleware<AppState & PersistPartial, CombinedActions>];

// Create the store
const store: Store<AppState & PersistPartial, CombinedActions> = createStore(
  rootReducer,
  applyMiddleware(...middleware)
);

const persistor = persistStore(store);

export { store, persistor };
