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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(userData) {
        const { discordId } = userData;
        let user = await this.prisma.user.findUnique({
            where: { discordId },
        });
        if (user) {
            user = await this.prisma.user.update({
                where: { discordId },
                data: {
                    username: userData.username,
                    discriminator: userData.discriminator,
                    avatar: userData.avatar,
                    email: userData.email,
                    guilds: userData.guilds,
                    discordAccessToken: userData.accessToken,
                    discordRefreshToken: userData.refreshToken,
                },
            });
        }
        else {
            user = await this.prisma.user.create({
                data: {
                    discordId: userData.discordId,
                    username: userData.username,
                    discriminator: userData.discriminator,
                    avatar: userData.avatar,
                    email: userData.email,
                    guilds: userData.guilds,
                    discordAccessToken: userData.accessToken,
                    discordRefreshToken: userData.refreshToken,
                },
            });
        }
        return user;
    }
    async findUserById(id) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    async findUserByDiscordId(discordId) {
        return this.prisma.user.findUnique({
            where: { discordId },
        });
    }
    async login(user) {
        const payload = { username: user.username, sub: user.id };
        return {
            accessToken: this.jwtService.sign(payload),
            user,
        };
    }
    validateToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch (error) {
            return null;
        }
    }
    getAvatarUrl(user) {
        if (!user.avatar || !user.discordId)
            return null;
        return `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map