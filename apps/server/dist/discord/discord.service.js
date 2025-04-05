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
exports.DiscordService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const constants_1 = require("../config/constants");
const auth_service_1 = require("../auth/auth.service");
let DiscordService = class DiscordService {
    constructor(httpService, authService) {
        this.httpService = httpService;
        this.authService = authService;
    }
    async getBotGuilds() {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${constants_1.BOT_URL}/api/guilds`));
            return response.data.map(guild => ({
                ...guild,
                botPresent: true,
            }));
        }
        catch (error) {
            console.error('Error fetching bot guilds:', error);
            return [];
        }
    }
    async getUserGuilds(userId) {
        try {
            const user = await this.authService.findUserById(userId);
            if (!user || !user.guilds || user.guilds.length === 0) {
                return [];
            }
            const botGuilds = await this.getBotGuilds();
            const botGuildIds = botGuilds.map(guild => guild.id);
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`https://discord.com/api/v10/users/@me/guilds`, {
                headers: {
                    Authorization: `Bearer ${user.discordAccessToken}`,
                },
            }));
            return response.data
                .filter(guild => botGuildIds.includes(guild.id))
                .map(guild => ({
                id: guild.id,
                name: guild.name,
                icon: guild.icon,
                botPresent: true,
            }));
        }
        catch (error) {
            console.error('Error fetching user guilds:', error);
            return [];
        }
    }
    async getGuildById(guildId) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${constants_1.BOT_URL}/api/guilds/${guildId}`));
            return {
                ...response.data,
                botPresent: true,
            };
        }
        catch (error) {
            console.error(`Error fetching guild with ID ${guildId}:`, error);
            return null;
        }
    }
};
exports.DiscordService = DiscordService;
exports.DiscordService = DiscordService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        auth_service_1.AuthService])
], DiscordService);
//# sourceMappingURL=discord.service.js.map