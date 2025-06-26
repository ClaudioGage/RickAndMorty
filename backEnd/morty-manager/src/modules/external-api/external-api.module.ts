import { Module } from '@nestjs/common';
import { RickMortyApiService } from './external-api.service';

@Module({
  providers: [RickMortyApiService],
  exports: [RickMortyApiService],
})
export class ExternalApiModule {}