import { Zone } from '../../zones/entities/zone.entity';
import { Category as PrismaCategory } from '@prisma/client';
export declare class Category implements Omit<PrismaCategory, 'zones'> {
    id: string;
    guild_id: string;
    name: string;
    categoryType: string;
    isVisible: boolean;
    trackingActive: boolean;
    sendSetup: boolean;
    allowedRoles: string[];
    lastUsage: Date | null;
    totalSecondsInCateg: number;
    discordCategoryId: string | null;
    deletedInDiscord: boolean;
    createdAt: Date;
    updatedAt: Date;
    zones?: Zone[];
}
