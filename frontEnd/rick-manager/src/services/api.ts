import axios from 'axios';
import { Character, CharactersResponse, AuthResponse, CharacterQueryParams } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3007/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
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
  // Authentication
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/register', { username, email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Characters
  getCharacters: async (params: CharacterQueryParams): Promise<CharactersResponse> => {
    try {
      // Clean up undefined values from params
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
      );
      
      const response = await apiClient.get('/characters', { params: cleanParams });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load characters');
    }
  },

  getCharacter: async (id: number): Promise<Character> => {
    try {
      const response = await apiClient.get(`/characters/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Character not found');
    }
  },

  searchCharacters: async (searchTerm: string, params: CharacterQueryParams): Promise<CharactersResponse> => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
      );
      
      const response = await apiClient.get('/characters/search', { 
        params: { q: searchTerm, ...cleanParams } 
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  },

  getFavoriteCharacters: async (): Promise<Character[]> => {
    try {
      const response = await apiClient.get('/characters/favorites');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load favorites');
    }
  },

  // Favorites
  addToFavorites: async (characterId: number): Promise<void> => {
    try {
      await apiClient.post(`/characters/${characterId}/favorite`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add to favorites');
    }
  },

  removeFromFavorites: async (characterId: number): Promise<void> => {
    try {
      await apiClient.delete(`/characters/${characterId}/favorite`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove from favorites');
    }
  },
};