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
exports.CategoriesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const categories_service_1 = require("./categories.service");
const category_entity_1 = require("./entities/category.entity");
const create_category_input_1 = require("./dto/create-category.input");
const update_category_input_1 = require("./dto/update-category.input");
const category_args_1 = require("./dto/category.args");
const redis_pubsub_service_1 = require("../pubsub/redis-pubsub.service");
let CategoriesResolver = class CategoriesResolver {
    constructor(categoriesService, pubSubService) {
        this.categoriesService = categoriesService;
        this.pubSubService = pubSubService;
    }
    async createCategory(createCategoryInput) {
        const category = await this.categoriesService.create(createCategoryInput);
        await this.pubSubService.publish('categoryCreated', { categoryCreated: category });
        return category;
    }
    findAll(args) {
        return this.categoriesService.findAll(args.guild_id);
    }
    findOne(args) {
        return this.categoriesService.findOne(args.id);
    }
    async updateCategory(updateCategoryInput) {
        const category = await this.categoriesService.update(updateCategoryInput.id, updateCategoryInput);
        await this.pubSubService.publish('categoryUpdated', { categoryUpdated: category });
        return category;
    }
    async removeCategory(args) {
        const category = await this.categoriesService.remove(args.id);
        await this.pubSubService.publish('categoryRemoved', { categoryRemoved: category });
        return category;
    }
    categoryCreated() {
        return this.pubSubService.asyncIterator('categoryCreated');
    }
    categoryUpdated() {
        return this.pubSubService.asyncIterator('categoryUpdated');
    }
    categoryRemoved() {
        return this.pubSubService.asyncIterator('categoryRemoved');
    }
};
exports.CategoriesResolver = CategoriesResolver;
__decorate([
    (0, graphql_1.Mutation)(() => category_entity_1.Category),
    __param(0, (0, graphql_1.Args)('createCategoryInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_input_1.CreateCategoryInput]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "createCategory", null);
__decorate([
    (0, graphql_1.Query)(() => [category_entity_1.Category], { name: 'categories' }),
    __param(0, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_args_1.CategoriesByGuildArgs]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => category_entity_1.Category, { name: 'category', nullable: true }),
    __param(0, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_args_1.CategoryArgs]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Mutation)(() => category_entity_1.Category),
    __param(0, (0, graphql_1.Args)('updateCategoryInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_category_input_1.UpdateCategoryInput]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "updateCategory", null);
__decorate([
    (0, graphql_1.Mutation)(() => category_entity_1.Category),
    __param(0, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_args_1.CategoryArgs]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "removeCategory", null);
__decorate([
    (0, graphql_1.Subscription)(() => category_entity_1.Category, { name: 'categoryCreated' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriesResolver.prototype, "categoryCreated", null);
__decorate([
    (0, graphql_1.Subscription)(() => category_entity_1.Category, { name: 'categoryUpdated' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriesResolver.prototype, "categoryUpdated", null);
__decorate([
    (0, graphql_1.Subscription)(() => category_entity_1.Category, { name: 'categoryRemoved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriesResolver.prototype, "categoryRemoved", null);
exports.CategoriesResolver = CategoriesResolver = __decorate([
    (0, graphql_1.Resolver)(() => category_entity_1.Category),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService,
        redis_pubsub_service_1.RedisPubSubService])
], CategoriesResolver);
//# sourceMappingURL=categories.resolver.js.map