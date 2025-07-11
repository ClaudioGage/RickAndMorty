export interface RickMortyCharacter {
    id: number;
    name: string;
    status: 'Alive' | 'Dead' | 'unknown';
    species: string;
    type: string;
    gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
    origin: {
      name: string;
      url: string;
    };
    location: {
      name: string;
      url: string;
    };
    image: string;
    episode: string[];
    url: string;
    created: string;
  }
  
  export interface RickMortyApiResponse {
    info: {
      count: number;
      pages: number;
      next: string | null;
      prev: string | null;
    };
    results: RickMortyCharacter[];
  }
  
  export interface CharacterFilters {
    page?: number;
    name?: string;
    status?: string;
    species?: string;
    type?: string;
    gender?: string;
  }