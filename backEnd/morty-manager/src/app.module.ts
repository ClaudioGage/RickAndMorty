import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { User } from './modules/entities/user.entity';
import { Favorite } from './modules/entities/favorite.entity';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/user.module';
import { ExternalApiModule } from './modules/external-api/external-api.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { CharactersModule } from './modules/characters/characters.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_DATABASE', 'rick_morty_app'),
        entities: [User, Favorite],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
        autoLoadEntities: true,
      }),
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('API_CACHE_TTL', 3600000),
        max: configService.get<number>('CACHE_MAX_ITEMS', 1000),
      }),
    }),

    CharactersModule,
    FavoritesModule,
    ExternalApiModule,
    UsersModule,
    AuthModule,
  ],

})
export class AppModule {}
