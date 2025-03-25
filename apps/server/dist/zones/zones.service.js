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
let ZonesService = class ZonesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createZoneInput) {
        return this.prisma.zone.create({
            data: createZoneInput,
            include: {
                category: true,
            },
        });
    }
    async findAll(guild_id = 'default_guild') {
        return this.prisma.zone.findMany({
            where: { guild_id },
            include: {
                category: true,
            },
        });
    }
    async findOne(id) {
        return this.prisma.zone.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });
    }
    async findByCategory(categoryId) {
        return this.prisma.zone.findMany({
            where: { categoryId },
            include: {
                category: true,
            },
        });
    }
    async update(id, updateZoneInput) {
        const { id: _, ...data } = updateZoneInput;
        return this.prisma.zone.update({
            where: { id },
            data,
            include: {
                category: true,
            },
        });
    }
    async remove(id) {
        return this.prisma.zone.delete({
            where: { id },
            include: {
                category: true,
            },
        });
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