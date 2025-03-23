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
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const user_entity_1 = require("./entities/user.entity");
const auth_dto_1 = require("./dto/auth.dto");
const auth_service_1 = require("./auth.service");
let AuthResolver = class AuthResolver {
    constructor(authService) {
        this.authService = authService;
    }
    me(context) {
        return context.req.user;
    }
    isAuthenticated(context) {
        return !!context.req.user;
    }
    validateToken(token) {
        const payload = this.authService.validateToken(token);
        if (!payload)
            return null;
        return this.authService.findUserById(payload.sub).then(user => {
            if (!user)
                return null;
            return { user, accessToken: token };
        });
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, graphql_1.Query)(() => user_entity_1.User, { nullable: true, description: 'Gibt den aktuell eingeloggten Benutzer zurück' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthResolver.prototype, "me", null);
__decorate([
    (0, graphql_1.Query)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.OptionalJwtAuthGuard),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthResolver.prototype, "isAuthenticated", null);
__decorate([
    (0, graphql_1.Mutation)(() => auth_dto_1.AuthResponse, { nullable: true, description: 'Validiert einen JWT Token' }),
    __param(0, (0, graphql_1.Args)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthResolver.prototype, "validateToken", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)(() => user_entity_1.User),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map