export declare class Category {
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
}
