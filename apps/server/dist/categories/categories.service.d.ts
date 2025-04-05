import { PrismaService } from '../prisma/prisma.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCategoryInput: CreateCategoryInput): Promise<Category>;
    findAll(guild_id?: string, searchQuery?: string): Promise<Category[]>;
    findOne(id: string): Promise<Category | null>;
    update(id: string, updateCategoryInput: UpdateCategoryInput): Promise<Category>;
    remove(id: string): Promise<Category>;
}
