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
exports.DiscordResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const discord_service_1 = require("./discord.service");
const discord_guild_entity_1 = require("./entities/discord-guild.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../auth/entities/user.entity");
let DiscordResolver = class DiscordResolver {
    constructor(discordService) {
        this.discordService = discordService;
    }
    async availableGuilds(user) {
        return this.discordService.getUserGuilds(user.id);
    }
    async guildById(id) {
        return this.discordService.getGuildById(id);
    }
};
exports.DiscordResolver = DiscordResolver;
__decorate([
    (0, graphql_1.Query)(() => [discord_guild_entity_1.DiscordGuild]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], DiscordResolver.prototype, "availableGuilds", null);
__decorate([
    (0, graphql_1.Query)(() => discord_guild_entity_1.DiscordGuild, { nullable: true }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscordResolver.prototype, "guildById", null);
exports.DiscordResolver = DiscordResolver = __decorate([
    (0, graphql_1.Resolver)(() => discord_guild_entity_1.DiscordGuild),
    __metadata("design:paramtypes", [discord_service_1.DiscordService])
], DiscordResolver);
//# sourceMappingURL=discord.resolver.js.map