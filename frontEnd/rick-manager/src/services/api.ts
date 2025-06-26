import axios from 'axios';
import { User, Character, CharactersResponse, AuthResponse, CharacterQueryParams } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const api = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'test@test.com' && password === 'password') {
      return { 
        access_token: 'mock-token', 
        user: { id: 1, username: 'testuser', email: 'test@test.com' } 
      };
    }
    throw new Error('Invalid credentials');
  },

  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { 
      access_token: 'mock-token', 
      user: { id: 1, username, email } 
    };
  },

  getCharacters: async (params: CharacterQueryParams): Promise<CharactersResponse> => {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockCharacters: Character[] = [
      {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth (C-137)', url: '' },
        location: { name: 'Citadel of Ricks', url: '' },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        episode: [],
        url: '',
        created: '2017-11-04T18:48:46.250Z',
        isFavorite: false
      },
      {
        id: 2,
        name: 'Morty Smith',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'unknown', url: '' },
        location: { name: 'Citadel of Ricks', url: '' },
        image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
        episode: [],
        url: '',
        created: '2017-11-04T18:50:21.651Z',
        isFavorite: true
      },
      {
        id: 3,
        name: 'Summer Smith',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Female',
        origin: { name: 'Earth (Replacement Dimension)', url: '' },
        location: { name: 'Earth (Replacement Dimension)', url: '' },
        image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
        episode: [],
        url: '',
        created: '2017-11-04T19:09:56.428Z',
        isFavorite: false
      }
    ];

    return {
      info: { count: 3, pages: 1, next: null, prev: null },
      results: mockCharacters
    };
  },

  addToFavorites: async (characterId: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  removeFromFavorites: async (characterId: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },
};

/*
export const api = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', { username, email, password });
    return response.data;
  },

  getCharacters: async (params: CharacterQueryParams): Promise<CharactersResponse> => {
    const response = await apiClient.get('/characters', { params });
    return response.data;
  },

  addToFavorites: async (characterId: number): Promise<void> => {
    await apiClient.post(`/characters/${characterId}/favorite`);
  },

  removeFromFavorites: async (characterId: number): Promise<void> => {
    await apiClient.delete(`/characters/${characterId}/favorite`);
  },
};
*/