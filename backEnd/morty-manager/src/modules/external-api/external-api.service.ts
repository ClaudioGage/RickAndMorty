import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from '@nestjs/cache-manager';
import { Injectable, Logger, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosError } from "axios";
import { CharacterFilters, RickMortyApiResponse, RickMortyCharacter } from "./external-api.interface";

@Injectable()
export class RickMortyApiService {
  private readonly logger = new Logger(RickMortyApiService.name);
  private readonly apiUrl: string;
  private readonly cacheTtl: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('RICK_MORTY_API_URL', 'https://rickandmortyapi.com/api');
    this.cacheTtl = this.configService.get<number>('API_CACHE_TTL', 3600000);
  }

  async getCharacters(filters: CharacterFilters = {}): Promise<RickMortyApiResponse> {
    const { page = 1, name, status, species, type, gender } = filters;
    
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (name) params.append('name', name);
    if (status) params.append('status', status);
    if (species) params.append('species', species);
    if (type) params.append('type', type);
    if (gender) params.append('gender', gender);

    const cacheKey = `characters_${params.toString()}`;
    
    let cachedResponse = await this.cacheManager.get<RickMortyApiResponse>(cacheKey);
    if (cachedResponse) {
      this.logger.debug(`Cache hit for key: ${cacheKey}`);
      return cachedResponse;
    }

    try {
      this.logger.debug(`Fetching characters from API: ${this.apiUrl}/character?${params}`);
      const response = await axios.get(`${this.apiUrl}/character?${params}`, {
        timeout: 10000,
      });
      
      const apiResponse: RickMortyApiResponse = response.data;
      
      await this.cacheManager.set(cacheKey, apiResponse, this.cacheTtl);
      this.logger.debug(`Cached response for key: ${cacheKey}`);
      
      return apiResponse;
    } catch (error) {
      this.logger.error(`Error fetching characters: ${error.message}`);
      
      cachedResponse = await this.getStaleCache(cacheKey);
      if (cachedResponse) {
        this.logger.warn(`Returning stale cache for key: ${cacheKey}`);
        return cachedResponse;
      }
      
      throw this.handleApiError(error);
    }
  }

  async getCharacter(characterId: number): Promise<RickMortyCharacter | null> {
    const cacheKey = `character_${characterId}`;
    
    let cachedCharacter = await this.cacheManager.get<RickMortyCharacter>(cacheKey);
    if (cachedCharacter) {
      this.logger.debug(`Cache hit for character: ${characterId}`);
      return cachedCharacter;
    }

    try {
      this.logger.debug(`Fetching character ${characterId} from API`);
      const response = await axios.get(`${this.apiUrl}/character/${characterId}`, {
        timeout: 10000,
      });
      
      const character: RickMortyCharacter = response.data;
      
      await this.cacheManager.set(cacheKey, character, this.cacheTtl);
      this.logger.debug(`Cached character: ${characterId}`);
      
      return character;
    } catch (error) {
      this.logger.error(`Error fetching character ${characterId}: ${error.message}`);
      
      if (this.isNotFoundError(error)) {
        return null;
      }
      
      cachedCharacter = await this.getStaleCache(cacheKey);
      if (cachedCharacter) {
        this.logger.warn(`Returning stale cache for character: ${characterId}`);
        return cachedCharacter;
      }
      
      throw this.handleApiError(error);
    }
  }

  async getMultipleCharacters(characterIds: number[]): Promise<RickMortyCharacter[]> {
    if (characterIds.length === 0) return [];

    const idsString = characterIds.join(',');
    const cacheKey = `characters_multiple_${idsString}`;
    
    let cachedCharacters = await this.cacheManager.get<RickMortyCharacter[]>(cacheKey);
    if (cachedCharacters) {
      this.logger.debug(`Cache hit for multiple characters: ${idsString}`);
      return cachedCharacters;
    }

    try {
      this.logger.debug(`Fetching multiple characters: ${idsString}`);
      const response = await axios.get(`${this.apiUrl}/character/${idsString}`, {
        timeout: 15000,
      });
      
      const characters: RickMortyCharacter[] = Array.isArray(response.data) 
        ? response.data 
        : [response.data];
      
      await this.cacheManager.set(cacheKey, characters, this.cacheTtl);
      this.logger.debug(`Cached multiple characters: ${idsString}`);
      
      return characters;
    } catch (error) {
      this.logger.error(`Error fetching multiple characters ${idsString}: ${error.message}`);
      
      cachedCharacters = await this.getStaleCache(cacheKey);
      if (cachedCharacters) {
        this.logger.warn(`Returning stale cache for multiple characters: ${idsString}`);
        return cachedCharacters;
      }
      
      return [];
    }
  }

  async searchCharacters(searchTerm: string, page: number = 1): Promise<RickMortyApiResponse> {
    return this.getCharacters({ name: searchTerm, page });
  }

  async isApiHealthy(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.apiUrl}/character/1`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      this.logger.error(`API health check failed: ${error.message}`);
      return false;
    }
  }
  
  private async getStaleCache(cacheKey: string): Promise<any> {
    try {
      return await this.cacheManager.get(cacheKey);
    } catch (error) {
      this.logger.error(`Error getting stale cache for ${cacheKey}: ${error.message}`);
      return null;
    }
  }

  private isNotFoundError(error: any): boolean {
    return error.response?.status === 404;
  }

  private handleApiError(error: any): Error {
    if (error instanceof AxiosError) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        return new Error('Rick & Morty API is currently unavailable');
      }
      if (error.response?.status === 404) {
        return new Error('Character not found');
      }
      if (error.response?.status >= 500) {
        return new Error('Rick & Morty API is experiencing issues');
      }
    }
    return new Error('Failed to fetch data from Rick & Morty API');
  }
}
