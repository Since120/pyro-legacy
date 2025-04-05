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
        const createdCategory = await this.categoriesService.create(createCategoryInput);
        const fullCategory = await this.categoriesService.findOne(createdCategory.id);
        if (!fullCategory) {
            console.error(`Failed to find category ${createdCategory.id} immediately after creation.`);
            throw new Error(`Category creation succeeded but retrieval failed for ID: ${createdCategory.id}`);
        }
        await this.pubSubService.publish('categoryCreated', { categoryCreated: fullCategory });
        return fullCategory;
    }
    findAll(args) {
        return this.categoriesService.findAll(args.guild_id, args.searchQuery);
    }
    findOne(args) {
        return this.categoriesService.findOne(args.id);
    }
    async updateCategory(updateCategoryInput) {
        const updatedCategory = await this.categoriesService.update(updateCategoryInput.id, updateCategoryInput);
        const fullCategory = await this.categoriesService.findOne(updatedCategory.id);
        if (!fullCategory) {
            console.error(`Failed to find category ${updatedCategory.id} immediately after update.`);
            throw new Error(`Category update succeeded but retrieval failed for ID: ${updatedCategory.id}`);
        }
        await this.pubSubService.publish('categoryUpdated', { categoryUpdated: fullCategory });
        return fullCategory;
    }
    async removeCategory(args) {
        const categoryToRemove = await this.categoriesService.findOne(args.id);
        if (!categoryToRemove) {
            console.error(`Attempted to remove non-existent category with ID: ${args.id}`);
            throw new Error(`Category with ID ${args.id} not found for removal.`);
        }
        const removedCategory = await this.categoriesService.remove(args.id);
        await this.pubSubService.publish('categoryRemoved', { categoryRemoved: categoryToRemove });
        return removedCategory;
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
    (0, graphql_1.Subscription)(() => category_entity_1.Category, {
        name: 'categoryCreated',
        filter: (payload) => Boolean(payload?.categoryCreated),
        resolve: (payload) => {
            if (payload && payload.categoryCreated) {
                return payload.categoryCreated;
            }
            throw new Error("Invalid payload received for categoryCreated");
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriesResolver.prototype, "categoryCreated", null);
__decorate([
    (0, graphql_1.Subscription)(() => category_entity_1.Category, {
        name: 'categoryUpdated',
        filter: (payload) => Boolean(payload?.categoryUpdated),
        resolve: (payload) => {
            if (payload && payload.categoryUpdated) {
                return payload.categoryUpdated;
            }
            throw new Error("Invalid payload received for categoryUpdated");
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriesResolver.prototype, "categoryUpdated", null);
__decorate([
    (0, graphql_1.Subscription)(() => category_entity_1.Category, {
        name: 'categoryRemoved',
        filter: (payload) => Boolean(payload?.categoryRemoved),
        resolve: (payload) => {
            if (payload && payload.categoryRemoved) {
                return payload.categoryRemoved;
            }
            throw new Error("Invalid payload received for categoryRemoved");
        }
    }),
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