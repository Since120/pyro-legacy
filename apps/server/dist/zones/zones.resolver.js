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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZonesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const zones_service_1 = require("./zones.service");
const zone_entity_1 = require("./entities/zone.entity");
const create_zone_input_1 = require("./dto/create-zone.input");
const update_zone_input_1 = require("./dto/update-zone.input");
const zone_args_1 = require("./dto/zone.args");
const redis_pubsub_service_1 = require("../pubsub/redis-pubsub.service");
let ZonesResolver = class ZonesResolver {
    constructor(zonesService, pubSubService) {
        this.zonesService = zonesService;
        this.pubSubService = pubSubService;
    }
    async createZone(createZoneInput) {
        const zone = await this.zonesService.create(createZoneInput);
        await this.pubSubService.publish('zoneCreated', { zoneCreated: zone });
        return zone;
    }
    findAll(args) {
        return this.zonesService.findAll(args.guild_id);
    }
    findOne(args) {
        return this.zonesService.findOne(args.id);
    }
    findByCategory(args) {
        return this.zonesService.findByCategory(args.categoryId);
    }
    async updateZone(updateZoneInput) {
        const zone = await this.zonesService.update(updateZoneInput.id, updateZoneInput);
        await this.pubSubService.publish('zoneUpdated', { zoneUpdated: zone });
        return zone;
    }
    async removeZone(args) {
        const zone = await this.zonesService.remove(args.id);
        await this.pubSubService.publish('zoneRemoved', { zoneRemoved: zone });
        return zone;
    }
    zoneCreated() {
        return this.pubSubService.asyncIterator('zoneCreated');
    }
    zoneUpdated() {
        return this.pubSubService.asyncIterator('zoneUpdated');
    }
    zoneRemoved() {
        return this.pubSubService.asyncIterator('zoneRemoved');
    }
};
exports.ZonesResolver = ZonesResolver;
__decorate([
    (0, graphql_1.Mutation)(() => zone_entity_1.Zone),
    __param(0, (0, graphql_1.Args)('createZoneInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_zone_input_1.CreateZoneInput]),
    __metadata("design:returntype", Promise)
], ZonesResolver.prototype, "createZone", null);
__decorate([
    (0, graphql_1.Query)(() => [zone_entity_1.Zone], { name: 'zones' }),
    __param(0, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zone_args_1.ZonesByGuildArgs]),
    __metadata("design:returntype", Promise)
], ZonesResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => zone_entity_1.Zone, { name: 'zone', nullable: true }),
    __param(0, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zone_args_1.ZoneArgs]),
    __metadata("design:returntype", Promise)
], ZonesResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => [zone_entity_1.Zone], { name: 'zonesByCategory' }),
    __param(0, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zone_args_1.ZonesByCategoryArgs]),
    __metadata("design:returntype", Promise)
], ZonesResolver.prototype, "findByCategory", null);
__decorate([
    (0, graphql_1.Mutation)(() => zone_entity_1.Zone),
    __param(0, (0, graphql_1.Args)('updateZoneInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_zone_input_1.UpdateZoneInput]),
    __metadata("design:returntype", Promise)
], ZonesResolver.prototype, "updateZone", null);
__decorate([
    (0, graphql_1.Mutation)(() => zone_entity_1.Zone),
    __param(0, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zone_args_1.ZoneArgs]),
    __metadata("design:returntype", Promise)
], ZonesResolver.prototype, "removeZone", null);
__decorate([
    (0, graphql_1.Subscription)(() => zone_entity_1.Zone, { name: 'zoneCreated' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ZonesResolver.prototype, "zoneCreated", null);
__decorate([
    (0, graphql_1.Subscription)(() => zone_entity_1.Zone, { name: 'zoneUpdated' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ZonesResolver.prototype, "zoneUpdated", null);
__decorate([
    (0, graphql_1.Subscription)(() => zone_entity_1.Zone, { name: 'zoneRemoved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ZonesResolver.prototype, "zoneRemoved", null);
exports.ZonesResolver = ZonesResolver = __decorate([
    (0, graphql_1.Resolver)(() => zone_entity_1.Zone),
    __metadata("design:paramtypes", [zones_service_1.ZonesService,
        redis_pubsub_service_1.RedisPubSubService])
], ZonesResolver);
//# sourceMappingURL=zones.resolver.js.map