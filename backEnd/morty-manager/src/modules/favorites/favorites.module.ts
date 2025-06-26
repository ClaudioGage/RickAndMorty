import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from '../entities/favorite.entity';
import { FavoritesService } from './favorites.service';
import { FavoritesRepository } from './favorites.repository';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    UsersModule,
  ],
  providers: [FavoritesService, FavoritesRepository],
  exports: [FavoritesService, FavoritesRepository],
})
export class FavoritesModule {}