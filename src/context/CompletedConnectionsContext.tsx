import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Movie } from '../types';

type CompletedConnection = {
  movieA: Movie;
  movieB: Movie;
  moves: number;
};

type CompletedConnectionsContextType = {
  completedConnections: CompletedConnection[];
  addCompletedConnection: (connection: CompletedConnection) => void;
};

const CompletedConnectionsContext = createContext<CompletedConnectionsContextType | undefined>(undefined);

export const CompletedConnectionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [completedConnections, setCompletedConnections] = useState<CompletedConnection[]>([]);

  const addCompletedConnection = (connection: CompletedConnection) => {
    setCompletedConnections((prevConnections) => [...prevConnections, connection]);
  };

  return (
    <CompletedConnectionsContext.Provider value={{ completedConnections, addCompletedConnection }}>
      {children}
    </CompletedConnectionsContext.Provider>
  );
};

export const useCompletedConnections = (): CompletedConnectionsContextType => {
  const context = useContext(CompletedConnectionsContext);
  if (!context) {
    throw new Error('useCompletedConnections must be used within a CompletedConnectionsProvider');
  }
  return context;
};
