import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { CategoryArgs, CategoriesByGuildArgs } from './dto/category.args';
import { RedisPubSubService } from '../pubsub/redis-pubsub.service';
export declare class CategoriesResolver {
    private readonly categoriesService;
    private readonly pubSubService;
    constructor(categoriesService: CategoriesService, pubSubService: RedisPubSubService);
    createCategory(createCategoryInput: CreateCategoryInput): Promise<Category>;
    findAll(args: CategoriesByGuildArgs): Promise<Category[]>;
    findOne(args: CategoryArgs): Promise<Category | null>;
    updateCategory(updateCategoryInput: UpdateCategoryInput): Promise<Category>;
    removeCategory(args: CategoryArgs): Promise<Category>;
    categoryCreated(): AsyncIterator<unknown, any, any>;
    categoryUpdated(): AsyncIterator<unknown, any, any>;
    categoryRemoved(): AsyncIterator<unknown, any, any>;
}
