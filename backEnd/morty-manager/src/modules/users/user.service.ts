import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersRepository, CreateUserData } from './user.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findByUsername(username);
  }

  async findByEmailOrUsername(email: string, username: string): Promise<User | null> {
    return this.usersRepository.findByEmailOrUsername(email, username);
  }

  async create(userData: CreateUserData): Promise<User> {
    const existingUser = await this.findByEmailOrUsername(userData.email, userData.username);
    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new ConflictException('User with this email already exists');
      }
      if (existingUser.username === userData.username) {
        throw new ConflictException('User with this username already exists');
      }
    }

    return this.usersRepository.create(userData);
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    await this.findById(id);
    
    if (updateData.email || updateData.username) {
      const existingUser = await this.findByEmailOrUsername(
        updateData.email || '',
        updateData.username || ''
      );
      
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email or username already taken');
      }
    }

    return this.usersRepository.update(id, updateData);
  }

  async deleteUser(id: number): Promise<void> {
    await this.findById(id);
    await this.usersRepository.delete(id);
  }

  async getUserWithFavorites(id: number): Promise<User> {
    const user = await this.usersRepository.findWithFavorites(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async userExists(id: number): Promise<boolean> {
    return this.usersRepository.exists(id);
  }
}