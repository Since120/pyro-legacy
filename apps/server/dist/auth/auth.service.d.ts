import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';
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
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(userData: UserData): Promise<User>;
    findUserById(id: string): Promise<User | null>;
    findUserByDiscordId(discordId: string): Promise<User | null>;
    login(user: User): Promise<{
        accessToken: string;
        user: User;
    }>;
    validateToken(token: string): any;
    getAvatarUrl(user: User): string | null;
}
export {};
