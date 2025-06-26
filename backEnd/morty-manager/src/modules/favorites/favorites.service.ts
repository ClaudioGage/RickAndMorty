import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { FavoritesRepository } from './favorites.repository';
import { UsersService } from '../users/user.service';
import { Favorite } from '../entities/favorite.entity';

export interface FavoriteResponse {
  message: string;
  favorite?: Favorite;
}

@Injectable()
export class FavoritesService {
  constructor(
    private readonly favoritesRepository: FavoritesRepository,
    private readonly usersService: UsersService,
  ) {}

  async getUserFavoriteIds(userId: number): Promise<number[]> {
    await this.usersService.findById(userId);
    return this.favoritesRepository.findUserFavoriteIds(userId);
  }

  async getUserFavorites(userId: number): Promise<Favorite[]> {
    await this.usersService.findById(userId);
    return this.favoritesRepository.findByUserId(userId);
  }

  async isCharacterFavorited(userId: number, characterId: number): Promise<boolean> {
    return this.favoritesRepository.exists(userId, characterId);
  }

  async addFavorite(userId: number, characterId: number): Promise<FavoriteResponse> {
    await this.usersService.findById(userId);

    const existingFavorite = await this.favoritesRepository.findByUserAndCharacter(userId, characterId);
    if (existingFavorite) {
      throw new ConflictException('Character is already in favorites');
    }

    const favorite = await this.favoritesRepository.create({
      userId,
      characterId,
    });

    return {
      message: 'Character added to favorites',
      favorite,
    };
  }

  async removeFavorite(userId: number, characterId: number): Promise<FavoriteResponse> {
    await this.usersService.findById(userId);

    const deleted = await this.favoritesRepository.delete(userId, characterId);
    
    if (!deleted) {
      throw new NotFoundException('Character was not in favorites');
    }

    return {
      message: 'Character removed from favorites',
    };
  }

  async toggleFavorite(userId: number, characterId: number): Promise<FavoriteResponse> {
    const isFavorited = await this.isCharacterFavorited(userId, characterId);
    
    if (isFavorited) {
      return this.removeFavorite(userId, characterId);
    } else {
      return this.addFavorite(userId, characterId);
    }
  }

  async getFavoriteCount(userId: number): Promise<number> {
    await this.usersService.findById(userId);
    return this.favoritesRepository.getFavoriteCount(userId);
  }

  async clearAllFavorites(userId: number): Promise<FavoriteResponse> {
    await this.usersService.findById(userId);
    
    await this.favoritesRepository.deleteAllByUserId(userId);
    
    return {
      message: 'All favorites cleared',
    };
  }

  async getFavoritesByCharacterIds(userId: number, characterIds: number[]): Promise<Favorite[]> {
    if (characterIds.length === 0) return [];
    
    return this.favoritesRepository.getFavoritesByCharacterIds(userId, characterIds);
  }
}