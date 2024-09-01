import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Movie } from '../types';
import { v4 as uuidv4 } from 'uuid';  // Import a UUID generator


type CompletedConnection = {
  id: string;
  movieA: Movie;
  movieB: Movie;
  moves: number;
};

type CompletedConnectionsContextType = {
  completedConnections: CompletedConnection[];
  addCompletedConnection: (connection: CompletedConnection) => void;
  removeCompletedConnection: (id: string) => void;
};

const CompletedConnectionsContext = createContext<CompletedConnectionsContextType | undefined>(undefined);

export const CompletedConnectionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [completedConnections, setCompletedConnections] = useState<CompletedConnection[]>([]);

  const addCompletedConnection = (connection: Omit<CompletedConnection, 'id'>) => {
    setCompletedConnections((prevConnections) => [
      ...prevConnections,
      { ...connection, id: uuidv4() }  // Generate a unique id for each connection
    ]);
  };

  const removeCompletedConnection = (id: string) => {
    setCompletedConnections((prevConnections) => {
      // Create a new array without the item of the given id
      const updatedConnections = prevConnections.filter((_) => _.id !== id);
      return updatedConnections;
    });
  };

  return (
    <CompletedConnectionsContext.Provider value={{ completedConnections, addCompletedConnection, removeCompletedConnection }}>
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
