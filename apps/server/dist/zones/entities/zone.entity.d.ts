import { Category } from '../../categories/entities/category.entity';
import { Zone as PrismaZone } from '@prisma/client';
export declare class Zone implements Omit<PrismaZone, 'category'> {
    id: string;
    zoneKey: string;
    zoneName: string;
    minutesRequired: number;
    pointsGranted: number;
    lastUsage: Date | null;
    totalSecondsInZone: number;
    categoryId: string | null;
    category?: Category | null;
    discordId: string | null;
    allowedRoles: string[];
    deletedInDiscord: boolean;
    guild_id: string;
    createdAt: Date;
    updatedAt: Date;
}
