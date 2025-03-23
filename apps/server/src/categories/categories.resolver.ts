// apps/server/src/categories/categories.resolver.ts
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { CategoryArgs, CategoriesByGuildArgs } from './dto/category.args';
import { RedisPubSubService } from '../pubsub/redis-pubsub.service';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly pubSubService: RedisPubSubService,
  ) {}

  @Mutation(() => Category)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    const category = await this.categoriesService.create(createCategoryInput);
    await this.pubSubService.publish('categoryCreated', { categoryCreated: category });
    return category;
  }

  @Query(() => [Category], { name: 'categories' })
  findAll(
    @Args() args: CategoriesByGuildArgs,
  ): Promise<Category[]> {
    return this.categoriesService.findAll(args.guild_id);
  }

  @Query(() => Category, { name: 'category', nullable: true })
  findOne(@Args() args: CategoryArgs): Promise<Category | null> {
    return this.categoriesService.findOne(args.id);
  }

  @Mutation(() => Category)
  async updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    const category = await this.categoriesService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
    await this.pubSubService.publish('categoryUpdated', { categoryUpdated: category });
    return category;
  }

  @Mutation(() => Category)
  async removeCategory(@Args() args: CategoryArgs): Promise<Category> {
    const category = await this.categoriesService.remove(args.id);
    await this.pubSubService.publish('categoryRemoved', { categoryRemoved: category });
    return category;
  }

  @Subscription(() => Category, { name: 'categoryCreated' })
  categoryCreated() {
    return this.pubSubService.asyncIterator('categoryCreated');
  }

  @Subscription(() => Category, { name: 'categoryUpdated' })
  categoryUpdated() {
    return this.pubSubService.asyncIterator('categoryUpdated');
  }

  @Subscription(() => Category, { name: 'categoryRemoved' })
  categoryRemoved() {
    return this.pubSubService.asyncIterator('categoryRemoved');
  }
}