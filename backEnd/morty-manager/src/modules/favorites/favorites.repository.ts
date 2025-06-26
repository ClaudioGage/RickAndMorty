import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';

export interface CreateFavoriteData {
  userId: number;
  characterId: number;
}

@Injectable()
export class FavoritesRepository {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async findByUserId(userId: number): Promise<Favorite[]> {
    return this.favoriteRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findUserFavoriteIds(userId: number): Promise<number[]> {
    const favorites = await this.favoriteRepository.find({
      where: { userId },
      select: ['characterId'],
    });
    return favorites.map(fav => fav.characterId);
  }

  async findByUserAndCharacter(userId: number, characterId: number): Promise<Favorite | null> {
    return this.favoriteRepository.findOne({
      where: { userId, characterId },
    });
  }

  async create(favoriteData: CreateFavoriteData): Promise<Favorite> {
    const favorite = this.favoriteRepository.create(favoriteData);
    return this.favoriteRepository.save(favorite);
  }

  async delete(userId: number, characterId: number): Promise<boolean> {
    const result = await this.favoriteRepository.delete({
      userId,
      characterId,
    });
    return result.affected > 0;
  }

  async exists(userId: number, characterId: number): Promise<boolean> {
    const count = await this.favoriteRepository.count({
      where: { userId, characterId },
    });
    return count > 0;
  }

  async deleteAllByUserId(userId: number): Promise<void> {
    await this.favoriteRepository.delete({ userId });
  }

  async getFavoriteCount(userId: number): Promise<number> {
    return this.favoriteRepository.count({
      where: { userId },
    });
  }

  async getFavoritesByCharacterIds(userId: number, characterIds: number[]): Promise<Favorite[]> {
    if (characterIds.length === 0) return [];
    
    return this.favoriteRepository
      .createQueryBuilder('favorite')
      .where('favorite.userId = :userId', { userId })
      .andWhere('favorite.characterId IN (:...characterIds)', { characterIds })
      .getMany();
  }
}
