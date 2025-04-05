import { User as PrismaUser } from '@prisma/client';
export declare class User implements Omit<PrismaUser, 'discordAccessToken' | 'discordRefreshToken'> {
    id: string;
    discordId: string;
    username: string;
    discriminator: string | null;
    avatar: string | null;
    email: string | null;
    guilds: string[];
    discordAccessToken?: string | null;
    discordRefreshToken?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
