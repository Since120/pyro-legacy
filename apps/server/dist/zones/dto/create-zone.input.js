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
exports.CreateZoneInput = void 0;
const graphql_1 = require("@nestjs/graphql");
let CreateZoneInput = class CreateZoneInput {
};
exports.CreateZoneInput = CreateZoneInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateZoneInput.prototype, "zoneKey", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateZoneInput.prototype, "zoneName", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { defaultValue: 60 }),
    __metadata("design:type", Number)
], CreateZoneInput.prototype, "minutesRequired", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { defaultValue: 1 }),
    __metadata("design:type", Number)
], CreateZoneInput.prototype, "pointsGranted", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateZoneInput.prototype, "categoryId", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], CreateZoneInput.prototype, "deletedInDiscord", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 'default_guild' }),
    __metadata("design:type", String)
], CreateZoneInput.prototype, "guild_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { defaultValue: [] }),
    __metadata("design:type", Array)
], CreateZoneInput.prototype, "allowedRoles", void 0);
exports.CreateZoneInput = CreateZoneInput = __decorate([
    (0, graphql_1.InputType)()
], CreateZoneInput);
//# sourceMappingURL=create-zone.input.js.map