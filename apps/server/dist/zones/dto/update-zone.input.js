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
exports.UpdateZoneInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const create_zone_input_1 = require("./create-zone.input");
let UpdateZoneInput = class UpdateZoneInput extends (0, graphql_1.PartialType)(create_zone_input_1.CreateZoneInput) {
};
exports.UpdateZoneInput = UpdateZoneInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], UpdateZoneInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateZoneInput.prototype, "discordId", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], UpdateZoneInput.prototype, "allowedRoles", void 0);
exports.UpdateZoneInput = UpdateZoneInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateZoneInput);
//# sourceMappingURL=update-zone.input.js.map