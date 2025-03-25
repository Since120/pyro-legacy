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
exports.ZonesByCategoryArgs = exports.ZonesByGuildArgs = exports.ZoneArgs = void 0;
const graphql_1 = require("@nestjs/graphql");
let ZoneArgs = class ZoneArgs {
};
exports.ZoneArgs = ZoneArgs;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ZoneArgs.prototype, "id", void 0);
exports.ZoneArgs = ZoneArgs = __decorate([
    (0, graphql_1.ArgsType)()
], ZoneArgs);
let ZonesByGuildArgs = class ZonesByGuildArgs {
};
exports.ZonesByGuildArgs = ZonesByGuildArgs;
__decorate([
    (0, graphql_1.Field)({ defaultValue: 'default_guild' }),
    __metadata("design:type", String)
], ZonesByGuildArgs.prototype, "guild_id", void 0);
exports.ZonesByGuildArgs = ZonesByGuildArgs = __decorate([
    (0, graphql_1.ArgsType)()
], ZonesByGuildArgs);
let ZonesByCategoryArgs = class ZonesByCategoryArgs {
};
exports.ZonesByCategoryArgs = ZonesByCategoryArgs;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ZonesByCategoryArgs.prototype, "categoryId", void 0);
exports.ZonesByCategoryArgs = ZonesByCategoryArgs = __decorate([
    (0, graphql_1.ArgsType)()
], ZonesByCategoryArgs);
//# sourceMappingURL=zone.args.js.map