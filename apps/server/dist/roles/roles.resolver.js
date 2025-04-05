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
exports.RolesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const roles_service_1 = require("./roles.service");
const discord_role_entity_1 = require("./entities/discord-role.entity");
const roles_args_1 = require("./dto/roles.args");
const redis_pubsub_service_1 = require("../pubsub/redis-pubsub.service");
let RolesResolver = class RolesResolver {
    constructor(rolesService, pubSubService) {
        this.rolesService = rolesService;
        this.pubSubService = pubSubService;
    }
    findAll(args) {
        return this.rolesService.findAllByGuild(args.guild_id);
    }
    findOne(args, guild_id) {
        return this.rolesService.findOne(guild_id, args.id);
    }
    roleCreated() {
        return this.pubSubService.asyncIterator('roleCreated');
    }
    roleUpdated() {
        return this.pubSubService.asyncIterator('roleUpdated');
    }
    roleDeleted() {
        return this.pubSubService.asyncIterator('roleDeleted');
    }
};
exports.RolesResolver = RolesResolver;
__decorate([
    (0, graphql_1.Query)(() => [discord_role_entity_1.DiscordRole], { name: 'roles' }),
    __param(0, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [roles_args_1.RolesByGuildArgs]),
    __metadata("design:returntype", Promise)
], RolesResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => discord_role_entity_1.DiscordRole, { name: 'role', nullable: true }),
    __param(0, (0, graphql_1.Args)()),
    __param(1, (0, graphql_1.Args)('guild_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [roles_args_1.RoleArgs, String]),
    __metadata("design:returntype", Promise)
], RolesResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Subscription)(() => discord_role_entity_1.DiscordRole, { name: 'roleCreated', nullable: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesResolver.prototype, "roleCreated", null);
__decorate([
    (0, graphql_1.Subscription)(() => discord_role_entity_1.DiscordRole, { name: 'roleUpdated', nullable: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesResolver.prototype, "roleUpdated", null);
__decorate([
    (0, graphql_1.Subscription)(() => discord_role_entity_1.DiscordRole, { name: 'roleDeleted', nullable: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesResolver.prototype, "roleDeleted", null);
exports.RolesResolver = RolesResolver = __decorate([
    (0, graphql_1.Resolver)(() => discord_role_entity_1.DiscordRole),
    __metadata("design:paramtypes", [roles_service_1.RolesService,
        redis_pubsub_service_1.RedisPubSubService])
], RolesResolver);
//# sourceMappingURL=roles.resolver.js.map