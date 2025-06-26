import { 
    Controller, 
    Get, 
    Post, 
    Delete, 
    Param, 
    Query, 
    UseGuards,
    ParseIntPipe,
    HttpCode,
    HttpStatus
  } from '@nestjs/common';
  import { CharactersService } from './characters.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { GetUser } from '../utils/decorators/get-user.decorator';
  import { User } from '../entities/user.entity';
  import { CharacterQueryDto, CharacterFilterDto } from '../dtos/characters.dto';
  
  @Controller('characters')
  @UseGuards(JwtAuthGuard)
  export class CharactersController {
    constructor(private readonly charactersService: CharactersService) {}
  
    @Get()
    async getCharacters(
      @GetUser() user: User,
      @Query() query: CharacterQueryDto,
      @Query() filters: CharacterFilterDto,
    ) {
      if (filters.filter === 'favorites') {
        return this.charactersService.getUserFavoriteCharacters(user.id);
      }
  
      return this.charactersService.getCharacters(user.id, query, filters);
    }
  
    @Get('search')
    async searchCharacters(
      @GetUser() user: User,
      @Query('q') searchTerm: string,
      @Query() query: CharacterQueryDto,
    ) {
      return this.charactersService.searchCharacters(user.id, searchTerm, query);
    }
  
    @Get('favorites')
    async getFavoriteCharacters(@GetUser() user: User) {
      return this.charactersService.getUserFavoriteCharacters(user.id);
    }
  
    @Get(':id')
    async getCharacter(
      @GetUser() user: User,
      @Param('id', ParseIntPipe) characterId: number,
    ) {
      return this.charactersService.getCharacter(user.id, characterId);
    }
  
    @Post(':id/favorite')
    @HttpCode(HttpStatus.OK)
    async addToFavorites(
      @GetUser() user: User,
      @Param('id', ParseIntPipe) characterId: number,
    ) {
      return this.charactersService.addToFavorites(user.id, characterId);
    }
  
    @Delete(':id/favorite')
    @HttpCode(HttpStatus.OK)
    async removeFromFavorites(
      @GetUser() user: User,
      @Param('id', ParseIntPipe) characterId: number,
    ) {
      return this.charactersService.removeFromFavorites(user.id, characterId);
    }
  }