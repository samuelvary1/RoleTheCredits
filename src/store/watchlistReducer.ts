import { WatchlistState, WatchlistActionTypes, ADD_TO_WATCHLIST, REMOVE_FROM_WATCHLIST } from '../types';
import { REHYDRATE } from 'redux-persist/es/constants';
import { PersistPartial } from 'redux-persist/es/persistReducer';

const initialState: WatchlistState & PersistPartial = {
  watchlist: [],
  _persist: {
    version: -1,
    rehydrated: false,
  },
};

// Define a specific rehydrate action for watchlist
type WatchlistRehydrateAction = {
  type: typeof REHYDRATE;
  payload?: WatchlistState | undefined;
};

// Combine action types for watchlist reducer
type WatchlistActions = WatchlistActionTypes | WatchlistRehydrateAction;

const watchlistReducer = (
  state = initialState,
  action: WatchlistActionTypes | { type: typeof REHYDRATE; payload?: WatchlistState | undefined }
): WatchlistState & PersistPartial => {
  switch (action.type) {
    case ADD_TO_WATCHLIST:
      return {
        ...state,
        watchlist: [...state.watchlist, action.payload],
      };
    case REMOVE_FROM_WATCHLIST:
      return {
        ...state,
        watchlist: state.watchlist.filter((movie) => movie.id !== action.payload),
      };
    case REHYDRATE:
      return {
        ...state,
        ...action.payload,
        _persist: { ...state._persist, rehydrated: true }, // Ensure _persist is maintained
      };
    default:
      return state;
  }
};

export default watchlistReducer;