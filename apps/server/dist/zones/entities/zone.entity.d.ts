import { Category } from '../../categories/entities/category.entity';
export declare class Zone {
    id: string;
    zoneKey: string;
    zoneName: string;
    minutesRequired: number;
    pointsGranted: number;
    lastUsage: Date | null;
    totalSecondsInZone: number;
    categoryId: string | null;
    category: Category | null;
    deletedInDiscord: boolean;
    guild_id: string;
    createdAt: Date;
    updatedAt: Date;
}
