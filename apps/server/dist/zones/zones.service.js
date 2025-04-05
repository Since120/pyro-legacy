"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZonesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_mapper_1 = require("../common/mappers/prisma.mapper");
let ZonesService = class ZonesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createZoneInput) {
        console.log('Creating zone with input:', JSON.stringify(createZoneInput, null, 2));
        const data = {
            ...createZoneInput,
            guild_id: createZoneInput.guild_id || 'default_guild',
            allowedRoles: createZoneInput.allowedRoles || []
        };
        console.log('Final data for zone creation:', JSON.stringify(data, null, 2));
        try {
            const existingZones = await this.prisma.zone.findMany({
                where: {
                    categoryId: data.categoryId,
                    OR: [
                        { zoneName: data.zoneName },
                        { zoneName: { contains: data.zoneName, mode: 'insensitive' } },
                        { zoneName: { startsWith: data.zoneName, mode: 'insensitive' } },
                        { zoneName: { endsWith: data.zoneName, mode: 'insensitive' } }
                    ]
                }
            });
            if (existingZones.length > 0) {
                console.log(`Found ${existingZones.length} existing zones with similar name: ${data.zoneName}`);
                console.log('Existing zones:', JSON.stringify(existingZones.map(z => ({ id: z.id, name: z.zoneName })), null, 2));
                const existingZone = await this.prisma.zone.findUnique({
                    where: { id: existingZones[0].id },
                    include: { category: true }
                });
                if (!existingZone) {
                    throw new common_1.ConflictException('Existing zone not found');
                }
                console.log(`Using existing zone: ${existingZone.zoneName} (${existingZone.id})`);
                return (0, prisma_mapper_1.mapPrismaZoneToGraphQL)(existingZone);
            }
            const prismaZone = await this.prisma.zone.create({
                data,
                include: {
                    category: true
                }
            });
            console.log(`Created new zone: ${prismaZone.zoneName} (${prismaZone.id})`);
            return (0, prisma_mapper_1.mapPrismaZoneToGraphQL)(prismaZone);
        }
        catch (error) {
            throw new common_1.ConflictException(`Failed to create zone: ${error.message}`);
        }
    }
    async findAll(guild_id = 'default_guild') {
        const prismaZones = await this.prisma.zone.findMany({
            where: { guild_id },
            include: {
                category: true,
            },
        });
        return prismaZones.map(zone => (0, prisma_mapper_1.mapPrismaZoneToGraphQL)(zone));
    }
    async findOne(id) {
        const prismaZone = await this.prisma.zone.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });
        if (!prismaZone) {
            return null;
        }
        return (0, prisma_mapper_1.mapPrismaZoneToGraphQL)(prismaZone);
    }
    async findByCategory(categoryId) {
        const prismaZones = await this.prisma.zone.findMany({
            where: { categoryId },
            include: {
                category: true,
            },
        });
        return prismaZones.map(zone => (0, prisma_mapper_1.mapPrismaZoneToGraphQL)(zone));
    }
    async update(id, updateZoneInput) {
        const { id: _, ...inputData } = updateZoneInput;
        console.log('Updating zone with input:', JSON.stringify(updateZoneInput, null, 2));
        const data = {
            ...inputData,
            guild_id: inputData.guild_id || 'default_guild'
        };
        console.log('Final data for zone update:', JSON.stringify(data, null, 2));
        if (data.categoryId) {
            const categoryExists = await this.prisma.category.findUnique({
                where: { id: data.categoryId }
            });
            if (!categoryExists) {
                throw new Error(`Category with ID ${data.categoryId} does not exist`);
            }
            console.log(`Category with ID ${data.categoryId} exists, updating zone`);
        }
        if (data.discordId) {
            console.log(`Updating zone with Discord ID ${data.discordId}`);
            const existingZone = await this.prisma.zone.findFirst({
                where: {
                    discordId: data.discordId,
                    NOT: { id }
                }
            });
            if (existingZone) {
                console.log(`Found existing zone with Discord ID ${data.discordId}: ${existingZone.zoneName} (${existingZone.id})`);
                const zoneToDelete = await this.prisma.zone.findUnique({
                    where: { id }
                });
                if (zoneToDelete) {
                    console.log(`Removing duplicate zone with ID ${id}`);
                    await this.prisma.zone.delete({
                        where: { id }
                    });
                }
                else {
                    console.log(`Zone with ID ${id} already deleted, skipping deletion`);
                }
                const existingZoneWithCategory = await this.prisma.zone.findUnique({
                    where: { id: existingZone.id },
                    include: { category: true }
                });
                if (!existingZoneWithCategory) {
                    throw new Error(`Existing zone with ID ${existingZone.id} not found`);
                }
                return (0, prisma_mapper_1.mapPrismaZoneToGraphQL)(existingZoneWithCategory);
            }
        }
        const updatedPrismaZone = await this.prisma.zone.update({
            where: { id },
            data,
            include: {
                category: true,
            },
        });
        console.log(`Zone updated successfully: ${updatedPrismaZone.zoneName} (${updatedPrismaZone.id})`);
        return (0, prisma_mapper_1.mapPrismaZoneToGraphQL)(updatedPrismaZone);
    }
    async remove(id) {
        const deletedPrismaZone = await this.prisma.zone.delete({
            where: { id },
            include: {
                category: true,
            },
        });
        return (0, prisma_mapper_1.mapPrismaZoneToGraphQL)(deletedPrismaZone);
    }
    async countZonesByCategory(categoryId) {
        return this.prisma.zone.count({
            where: { categoryId },
        });
    }
};
exports.ZonesService = ZonesService;
exports.ZonesService = ZonesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ZonesService);
//# sourceMappingURL=zones.service.js.map