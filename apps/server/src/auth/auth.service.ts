// apps/server/src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';

interface UserData {
  discordId: string;
  username: string;
  discriminator?: string;
  avatar?: string;
  guilds: string[];
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userData: UserData): Promise<User> {
    const { discordId } = userData;

    // Check if user already exists
    let user = await this.prisma.user.findUnique({
      where: { discordId },
    });

    if (user) {
      // Update existing user data
      user = await this.prisma.user.update({
        where: { discordId },
        data: {
          username: userData.username,
          discriminator: userData.discriminator,
          avatar: userData.avatar,
          guilds: userData.guilds,
          // Discord OAuth credentials are stored securely but not exposed in GraphQL
          discordAccessToken: userData.accessToken,
          discordRefreshToken: userData.refreshToken,
        },
      });
    } else {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          discordId: userData.discordId,
          username: userData.username,
          discriminator: userData.discriminator,
          avatar: userData.avatar,
          guilds: userData.guilds,
          discordAccessToken: userData.accessToken,
          discordRefreshToken: userData.refreshToken,
        },
      });
    }

    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserByDiscordId(discordId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { discordId },
    });
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}