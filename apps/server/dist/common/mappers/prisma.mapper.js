"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapPrismaCategoryToGraphQL = mapPrismaCategoryToGraphQL;
exports.mapPrismaZoneToGraphQL = mapPrismaZoneToGraphQL;
exports.mapPrismaUserToGraphQL = mapPrismaUserToGraphQL;
exports.isCategory = isCategory;
exports.isZone = isZone;
exports.isUser = isUser;
function mapPrismaCategoryToGraphQL(prismaCategory) {
    return {
        ...prismaCategory,
        zones: prismaCategory.zones?.map(mapPrismaZoneToGraphQL) || [],
    };
}
function mapPrismaZoneToGraphQL(prismaZone) {
    return {
        ...prismaZone,
        category: prismaZone.category ? mapPrismaCategoryToGraphQL({ ...prismaZone.category, zones: [] }) : null,
    };
}
function mapPrismaUserToGraphQL(prismaUser) {
    return {
        ...prismaUser,
    };
}
function isCategory(obj) {
    return obj &&
        typeof obj.id === 'string' &&
        typeof obj.name === 'string' &&
        typeof obj.guild_id === 'string';
}
function isZone(obj) {
    return obj &&
        typeof obj.id === 'string' &&
        typeof obj.zoneName === 'string' &&
        typeof obj.zoneKey === 'string';
}
function isUser(obj) {
    return obj &&
        typeof obj.id === 'string' &&
        typeof obj.discordId === 'string' &&
        typeof obj.username === 'string';
}
//# sourceMappingURL=prisma.mapper.js.map