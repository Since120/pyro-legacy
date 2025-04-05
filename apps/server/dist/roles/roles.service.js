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
        if (!guild_id || guild_id === 'default_guild' || guild_id === 'undefined') {
            console.log('Using mock roles for guild_id:', guild_id);
            return this.getMockRoles(guild_id);
        }
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${config_1.BOT_URL}/api/guilds/${guild_id}/roles`));
            return response.data.map(role => {
                const colorHex = role.color ? `#${role.color.toString(16).padStart(6, '0')}` : undefined;
                const color = typeof role.color === 'string' ?
                    parseInt(role.color.replace('#', ''), 16) :
                    (typeof role.color === 'number' ? role.color : 0);
                return {
                    ...role,
                    guild_id,
                    color,
                    colorHex
                };
            });
        }
        catch (error) {
            console.error('Error fetching Discord roles:', error);
            return this.getMockRoles(guild_id);
        }
    }
    async findOne(guild_id, role_id) {
        if (!guild_id || guild_id === 'default_guild' || guild_id === 'undefined') {
            const mockRoles = this.getMockRoles(guild_id);
            return mockRoles.find(role => role.id === role_id) || null;
        }
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
    getMockRoles(guild_id) {
        return [
            {
                id: '123456789',
                name: 'Admin',
                color: 16711680,
                colorHex: '#FF0000',
                hoist: true,
                position: 5,
                permissions: '8',
                managed: false,
                mentionable: true,
                guild_id: guild_id || 'default_guild'
            },
            {
                id: '234567890',
                name: 'Moderator',
                color: 65280,
                colorHex: '#00FF00',
                hoist: true,
                position: 4,
                permissions: '4',
                managed: false,
                mentionable: true,
                guild_id: guild_id || 'default_guild'
            },
            {
                id: '345678901',
                name: 'VIP',
                color: 255,
                colorHex: '#0000FF',
                hoist: true,
                position: 3,
                permissions: '2',
                managed: false,
                mentionable: true,
                guild_id: guild_id || 'default_guild'
            },
            {
                id: '456789012',
                name: 'Member',
                color: 16776960,
                colorHex: '#FFFF00',
                hoist: false,
                position: 2,
                permissions: '1',
                managed: false,
                mentionable: true,
                guild_id: guild_id || 'default_guild'
            },
            {
                id: '567890123',
                name: 'Newbie',
                color: 65535,
                colorHex: '#00FFFF',
                hoist: false,
                position: 1,
                permissions: '0',
                managed: false,
                mentionable: true,
                guild_id: guild_id || 'default_guild'
            },
            {
                id: '678901234',
                name: 'Bot',
                color: 16711935,
                colorHex: '#FF00FF',
                hoist: false,
                position: 0,
                permissions: '0',
                managed: true,
                mentionable: false,
                guild_id: guild_id || 'default_guild'
            }
        ];
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], RolesService);
//# sourceMappingURL=roles.service.js.map