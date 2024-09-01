import {
  CompletedConnectionsState,
  CompletedConnectionsActionTypes,
  ADD_COMPLETED_CONNECTION,
  CompletedConnection,
} from '../types';
import { REHYDRATE } from 'redux-persist/es/constants';
import { PersistPartial } from 'redux-persist/es/persistReducer';

const initialState: CompletedConnectionsState & PersistPartial = {
  completedConnections: [],
  _persist: {
    version: -1,
    rehydrated: false,
  },
};

// Define a specific rehydrate action for completed connections
type CompletedConnectionsRehydrateAction = {
  type: typeof REHYDRATE;
  payload?: CompletedConnectionsState | undefined;
};

// Combine the action types
type CompletedConnectionsActions = CompletedConnectionsActionTypes | CompletedConnectionsRehydrateAction;

const completedConnectionsReducer = (
  state = initialState,
  action: CompletedConnectionsActions
): CompletedConnectionsState & PersistPartial => {
  switch (action.type) {
    case ADD_COMPLETED_CONNECTION:
      return {
        ...state,
        completedConnections: [...state.completedConnections, action.payload as CompletedConnection],
      };
    case REHYDRATE:
      return action.payload ? { ...state, ...action.payload } : state;
    default:
      return state;
  }
};

export default completedConnectionsReducer;
