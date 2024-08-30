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

export type PathNode = {
  id: number;
  title: string;
  type: 'movie' | 'actor';
  side: 'A' | 'B'; // Add this to track which side (Movie A or Movie B) the node is associated with
  connectedTo?: number[]; // Optional: IDs of connected nodes
};
