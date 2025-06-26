import { Injectable, NotFoundException } from '@nestjs/common';
import { RickMortyApiService } from '../external-api/external-api.service';
import { FavoritesService } from '../favorites/favorites.service';
import { CharacterQueryDto, CharacterFilterDto } from '../dtos/characters.dto';
import { CharacterWithFavorite, CharactersResponse } from './characters.interface';

@Injectable()
export class CharactersService {
  constructor(
    private rickMortyApiService: RickMortyApiService,
    private favoritesService: FavoritesService,
  ) {}

  async getCharacters(
    userId: number, 
    query: CharacterQueryDto, 
    filters: CharacterFilterDto
  ): Promise<CharactersResponse> {
    const apiResponse = await this.rickMortyApiService.getCharacters(query);
    
    const favoriteIds = await this.favoritesService.getUserFavoriteIds(userId);
    
    let charactersWithFavorites = apiResponse.results.map(character => ({
      ...character,
      isFavorite: favoriteIds.includes(character.id),
    }));

    if (filters.sortBy && filters.sortOrder) {
      charactersWithFavorites = this.sortCharacters(charactersWithFavorites, filters.sortBy, filters.sortOrder);
    }

    if (filters.search) {
      charactersWithFavorites = this.searchCharactersClientSide(charactersWithFavorites, filters.search);
    }

    return {
      ...apiResponse,
      results: charactersWithFavorites,
    };
  }

  async getCharacter(userId: number, characterId: number): Promise<CharacterWithFavorite> {
    const character = await this.rickMortyApiService.getCharacter(characterId);
    
    if (!character) {
      throw new NotFoundException('Character not found');
    }

    const isFavorite = await this.favoritesService.isCharacterFavorited(userId, characterId);
    
    return {
      ...character,
      isFavorite,
    };
  }

  async searchCharacters(
    userId: number, 
    searchTerm: string, 
    query: CharacterQueryDto
  ): Promise<CharactersResponse> {
    const searchQuery = { ...query, name: searchTerm };
    return this.getCharacters(userId, searchQuery, {});
  }

  async getUserFavoriteCharacters(userId: number): Promise<CharacterWithFavorite[]> {
    const favoriteIds = await this.favoritesService.getUserFavoriteIds(userId);
    
    if (favoriteIds.length === 0) {
      return [];
    }

    const characters = await this.rickMortyApiService.getMultipleCharacters(favoriteIds);
    
    return characters.map(character => ({
      ...character,
      isFavorite: true,
    }));
  }

  async addToFavorites(userId: number, characterId: number) {
    const character = await this.rickMortyApiService.getCharacter(characterId);
    if (!character) {
      throw new NotFoundException('Character not found');
    }

    return this.favoritesService.addFavorite(userId, characterId);
  }

  async removeFromFavorites(userId: number, characterId: number) {
    return this.favoritesService.removeFavorite(userId, characterId);
  }

  private sortCharacters(
    characters: CharacterWithFavorite[], 
    sortBy: string, 
    sortOrder: 'asc' | 'desc'
  ): CharacterWithFavorite[] {
    return characters.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'species':
          comparison = a.species.localeCompare(b.species);
          break;
        case 'gender':
          comparison = a.gender.localeCompare(b.gender);
          break;
        case 'created':
          comparison = new Date(a.created).getTime() - new Date(b.created).getTime();
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  private searchCharactersClientSide(
    characters: CharacterWithFavorite[], 
    searchTerm: string
  ): CharacterWithFavorite[] {
    const term = searchTerm.toLowerCase();
    return characters.filter(character => 
      character.name.toLowerCase().includes(term) ||
      character.species.toLowerCase().includes(term) ||
      character.status.toLowerCase().includes(term) ||
      character.origin.name.toLowerCase().includes(term) ||
      character.location.name.toLowerCase().includes(term)
    );
  }
}
