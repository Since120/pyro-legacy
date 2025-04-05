// apps/server/src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';
import { mapPrismaUserToGraphQL } from '../common/mappers/prisma.mapper';

interface UserData {
  discordId: string;
  username: string;
  discriminator?: string;
  avatar?: string;
  email?: string;
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
    let prismaUser = await this.prisma.user.findUnique({
      where: { discordId },
    });

    if (prismaUser) {
      // Update existing user data
      prismaUser = await this.prisma.user.update({
        where: { discordId },
        data: {
          username: userData.username,
          discriminator: userData.discriminator,
          avatar: userData.avatar,
          email: userData.email,
          guilds: userData.guilds,
          // Discord OAuth credentials are stored securely but not exposed in GraphQL
          discordAccessToken: userData.accessToken,
          discordRefreshToken: userData.refreshToken,
        },
      });
    } else {
      // Create new user
      prismaUser = await this.prisma.user.create({
        data: {
          discordId: userData.discordId,
          username: userData.username,
          discriminator: userData.discriminator,
          avatar: userData.avatar,
          email: userData.email,
          guilds: userData.guilds,
          discordAccessToken: userData.accessToken,
          discordRefreshToken: userData.refreshToken,
        },
      });
    }

    // Konvertiere Prisma-Objekt in GraphQL-Objekt
    return mapPrismaUserToGraphQL(prismaUser);
  }

  async findUserById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!prismaUser) {
      return null;
    }

    // Konvertiere Prisma-Objekt in GraphQL-Objekt
    return mapPrismaUserToGraphQL(prismaUser);
  }

  async findUserByDiscordId(discordId: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { discordId },
    });

    if (!prismaUser) {
      return null;
    }

    // Konvertiere Prisma-Objekt in GraphQL-Objekt
    return mapPrismaUserToGraphQL(prismaUser);
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

  getAvatarUrl(user: User): string | null {
    if (!user.avatar || !user.discordId) return null;
    return `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`;
  }
}