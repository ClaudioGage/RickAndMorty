import { Module } from '@nestjs/common';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { FavoritesModule } from '../favorites/favorites.module';
import { ExternalApiModule } from '../external-api/external-api.module';

@Module({
  imports: [
    FavoritesModule,
    ExternalApiModule,
  ],
  controllers: [CharactersController],
  providers: [CharactersService],
  exports: [CharactersService],
})
export class CharactersModule {}