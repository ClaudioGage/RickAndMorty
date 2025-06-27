import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from '../utils/decorators/get-user.decorator';
import { User } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  private getMockAuthResponse(username: string, email: string) {
    return {
      user: {
        id: 1,
        username,
        email,
      },
      token: 'mock-jwt-token',
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    if (process.env.BYPASS_AUTH === 'true') {
      return this.getMockAuthResponse(registerDto.username, registerDto.email);
    }
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    if (process.env.BYPASS_AUTH === 'true') {
      return this.getMockAuthResponse('testuser', loginDto.email);
    }
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}