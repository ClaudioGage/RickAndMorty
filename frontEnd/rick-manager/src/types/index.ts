export interface User {
    id: number;
    username: string;
    email: string;
  }
  
  export interface Character {
    id: number;
    name: string;
    status: 'Alive' | 'Dead' | 'unknown';
    species: string;
    type: string;
    gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
    origin: { name: string; url: string };
    location: { name: string; url: string };
    image: string;
    episode: string[];
    url: string;
    created: string;
    isFavorite: boolean;
  }
  
  export interface CharactersResponse {
    info: {
      count: number;
      pages: number;
      next: string | null;
      prev: string | null;
    };
    results: Character[];
  }
  
  export interface AuthResponse {
    access_token: string;
    user: User;
  }
  
  export interface CharacterQueryParams {
    page?: number;
    name?: string;
    status?: 'alive' | 'dead' | 'unknown';
    species?: string;
    type?: string;
    gender?: 'female' | 'male' | 'genderless' | 'unknown';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filter?: 'favorites';
    search?: string;
  }