// src/types.ts
export type Actor = {
  id: number;
  name: string;
  profilePath: string;
};

export type Movie = {
  id: number;
  title: string;
  actors: Actor[];
  releaseYear?: string;
  posterPath: string;
};
