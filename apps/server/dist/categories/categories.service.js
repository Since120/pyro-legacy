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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_mapper_1 = require("../common/mappers/prisma.mapper");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCategoryInput) {
        console.log('Creating category with input:', JSON.stringify(createCategoryInput, null, 2));
        const data = {
            ...createCategoryInput,
            guild_id: createCategoryInput.guild_id || 'default_guild'
        };
        console.log('Final data for category creation:', JSON.stringify(data, null, 2));
        return this.prisma.category.create({
            data,
        });
    }
    async findAll(guild_id = 'default_guild', searchQuery) {
        const whereClause = { guild_id };
        if (searchQuery) {
            whereClause.OR = [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { zones: { some: { zoneName: { contains: searchQuery, mode: 'insensitive' } } } },
                { allowedRoles: { has: searchQuery } }
            ];
        }
        const prismaCategories = await this.prisma.category.findMany({
            where: whereClause,
            include: {
                zones: {
                    include: { category: true }
                }
            },
        });
        return prismaCategories.map(category => (0, prisma_mapper_1.mapPrismaCategoryToGraphQL)(category));
    }
    async findOne(id) {
        const prismaCategory = await this.prisma.category.findUnique({
            where: { id },
            include: {
                zones: {
                    include: { category: true }
                }
            },
        });
        if (!prismaCategory) {
            return null;
        }
        return (0, prisma_mapper_1.mapPrismaCategoryToGraphQL)(prismaCategory);
    }
    async update(id, updateCategoryInput) {
        const { id: omitId, ...inputData } = updateCategoryInput;
        console.log('Updating category with input:', JSON.stringify(updateCategoryInput, null, 2));
        const data = { ...inputData };
        if (!inputData.guild_id) {
            const existingCategory = await this.prisma.category.findUnique({
                where: { id },
                select: { guild_id: true }
            });
            if (existingCategory) {
                data.guild_id = existingCategory.guild_id;
            }
        }
        console.log('Final data for category update:', JSON.stringify(data, null, 2));
        const updatedPrismaCategory = await this.prisma.category.update({
            where: { id },
            data,
            include: {
                zones: {
                    include: { category: true }
                }
            },
        });
        return (0, prisma_mapper_1.mapPrismaCategoryToGraphQL)(updatedPrismaCategory);
    }
    async remove(id) {
        const zoneCount = await this.prisma.zone.count({
            where: { categoryId: id },
        });
        if (zoneCount > 0) {
            throw new common_1.BadRequestException(`Die Kategorie kann nicht gelöscht werden, da noch ${zoneCount} Zone(n) damit verknüpft sind.`);
        }
        const deletedPrismaCategory = await this.prisma.category.delete({
            where: { id },
        });
        return (0, prisma_mapper_1.mapPrismaCategoryToGraphQL)({ ...deletedPrismaCategory, zones: [] });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map