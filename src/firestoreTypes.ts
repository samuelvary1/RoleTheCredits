// src/firestoreTypes.ts

export interface User {
    uid: string;
    email: string;
    watchlist: Movie[];
    completedConnections: CompletedConnection[];
  }
  
  export interface Movie {
    id: number;
    title: string;
    posterPath: string;
    actors: Actor[];
  }
  
  export interface Actor {
    id: number;
    name: string;
  }
  
  export interface CompletedConnection {
    id: string;
    startMovie: Movie;
    endMovie: Movie;
    path: PathNode[];
    dateCompleted: Date;
  }
  
  export interface PathNode {
    id: number;
    title: string;
    type: 'movie' | 'actor';
    side: 'A' | 'B';
  }
