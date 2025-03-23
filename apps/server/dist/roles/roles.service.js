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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const config_1 = require("../config");
let RolesService = class RolesService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async findAllByGuild(guild_id) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${config_1.BOT_URL}/api/guilds/${guild_id}/roles`));
            return response.data.map(role => ({
                ...role,
                guild_id,
            }));
        }
        catch (error) {
            console.error('Error fetching Discord roles:', error);
            return [];
        }
    }
    async findOne(guild_id, role_id) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${config_1.BOT_URL}/api/guilds/${guild_id}/roles/${role_id}`));
            return {
                ...response.data,
                guild_id,
            };
        }
        catch (error) {
            console.error(`Error fetching Discord role ${role_id}:`, error);
            return null;
        }
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], RolesService);
//# sourceMappingURL=roles.service.js.map