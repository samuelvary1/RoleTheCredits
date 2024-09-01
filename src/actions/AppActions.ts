import { PersistPartial } from 'redux-persist/es/persistReducer';

// Basic types for Actor and Movie
export type Actor = {
  id: number;
  name: string;
  profilePath: string;
  type?: 'actor';
};

export type Movie = {
  id: number;
  title: string;
  actors: Actor[];
  releaseYear?: string;
  posterPath: string;
  type: 'movie'; // Ensure the type is always 'movie'
};

// Type for PathNode in the game
export type PathNode = {
  id: number;
  title: string;
  type: 'movie' | 'actor';
  side: 'A' | 'B'; // To track which side (Movie A or Movie B) the node is associated with
  connectedTo?: number[]; // Optional: IDs of connected nodes
};

// Watchlist state and action types
export const ADD_TO_WATCHLIST = 'ADD_TO_WATCHLIST';
export const REMOVE_FROM_WATCHLIST = 'REMOVE_FROM_WATCHLIST';

export interface WatchlistState extends PersistPartial {
  watchlist: Movie[];
}

export interface AddToWatchlistAction {
  type: typeof ADD_TO_WATCHLIST;
  payload: Movie;
}

export interface RemoveFromWatchlistAction {
  type: typeof REMOVE_FROM_WATCHLIST;
  payload: number; // Assume we use the movie's ID to remove it
}

export type WatchlistActionTypes = AddToWatchlistAction | RemoveFromWatchlistAction;

// Completed Connections state and action types
export const ADD_COMPLETED_CONNECTION = 'ADD_COMPLETED_CONNECTION';

export interface CompletedConnection {
  movieA: Movie;
  movieB: Movie;
  moves: number;
}

export interface CompletedConnectionsState extends PersistPartial {
  completedConnections: CompletedConnection[];
}

export interface AddCompletedConnectionAction {
  type: typeof ADD_COMPLETED_CONNECTION;
  payload: CompletedConnection;
}

export type CompletedConnectionsActionTypes = AddCompletedConnectionAction;

// Combine all action types into a single type
export type AppActions = WatchlistActionTypes | CompletedConnectionsActionTypes;

// Root state type
export type AppState = {
  watchlist: WatchlistState;
  completedConnections: CompletedConnectionsState;
};
