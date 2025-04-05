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
    const createdCategory = await this.categoriesService.create(createCategoryInput);
    // Refetch the category with all relations included by findOne
    const fullCategory = await this.categoriesService.findOne(createdCategory.id);
    if (!fullCategory) {
      // This should ideally not happen after a successful creation
      console.error(`Failed to find category ${createdCategory.id} immediately after creation.`);
      throw new Error(`Category creation succeeded but retrieval failed for ID: ${createdCategory.id}`);
    }
    // Publish the standard wrapped payload
    await this.pubSubService.publish('categoryCreated', { categoryCreated: fullCategory });
    return fullCategory;
  }

  @Query(() => [Category], { name: 'categories' })
  findAll(
    @Args() args: CategoriesByGuildArgs,
  ): Promise<Category[]> {
    return this.categoriesService.findAll(args.guild_id, args.searchQuery);
  }

  @Query(() => Category, { name: 'category', nullable: true })
  findOne(@Args() args: CategoryArgs): Promise<Category | null> {
    return this.categoriesService.findOne(args.id);
  }

  @Mutation(() => Category)
  async updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    const updatedCategory = await this.categoriesService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
    // Refetch the category with all relations included by findOne
    const fullCategory = await this.categoriesService.findOne(updatedCategory.id);
     if (!fullCategory) {
      // This should ideally not happen after a successful update
      console.error(`Failed to find category ${updatedCategory.id} immediately after update.`);
      throw new Error(`Category update succeeded but retrieval failed for ID: ${updatedCategory.id}`);
    }
    // Publish the standard wrapped payload
    await this.pubSubService.publish('categoryUpdated', { categoryUpdated: fullCategory });
    return fullCategory;
  }

  @Mutation(() => Category)
  async removeCategory(@Args() args: CategoryArgs): Promise<Category> {
    // Fetch the category before removing it to publish its data
    const categoryToRemove = await this.categoriesService.findOne(args.id);
    if (!categoryToRemove) {
       // Handle case where category doesn't exist before removal attempt
       console.error(`Attempted to remove non-existent category with ID: ${args.id}`);
       // Depending on requirements, you might throw an error or return a specific response
       // For now, let's throw an error to indicate the issue clearly
       throw new Error(`Category with ID ${args.id} not found for removal.`);
    }
    const removedCategory = await this.categoriesService.remove(args.id);
    // Publish the standard wrapped payload
    await this.pubSubService.publish('categoryRemoved', { categoryRemoved: categoryToRemove });
    return removedCategory;
  }

  @Subscription(() => Category, {
    name: 'categoryCreated',
    // Basic filter (always true for now, can be refined later e.g., by guildId)
    filter: (payload) => Boolean(payload?.categoryCreated),
    // Explicitly resolve the payload assuming the standard { categoryCreated: payload } structure
    resolve: (payload) => {
       // Check if payload exists and has the expected structure
       if (payload && payload.categoryCreated) {
         return payload.categoryCreated;
       }
       // Wenn die Payload nicht die erwartete Struktur hat, werfen wir einen Fehler
       // anstatt null zurückzugeben, da das Feld nicht-nullable ist
       throw new Error("Invalid payload received for categoryCreated");
    }
  })
  categoryCreated() {
    // The asyncIterator yields the object published by pubSub.publish
    // e.g., { categoryCreated: { id: '...', name: '...' } }
    return this.pubSubService.asyncIterator('categoryCreated');
  }

  @Subscription(() => Category, {
    name: 'categoryUpdated',
    filter: (payload) => Boolean(payload?.categoryUpdated),
    resolve: (payload) => {
      if (payload && payload.categoryUpdated) {
        return payload.categoryUpdated;
      }
      throw new Error("Invalid payload received for categoryUpdated");
    }
  })
  categoryUpdated() {
    return this.pubSubService.asyncIterator('categoryUpdated');
  }

  @Subscription(() => Category, {
    name: 'categoryRemoved',
    filter: (payload) => Boolean(payload?.categoryRemoved),
    resolve: (payload) => {
      if (payload && payload.categoryRemoved) {
        return payload.categoryRemoved;
      }
      throw new Error("Invalid payload received for categoryRemoved");
    }
  })
  categoryRemoved() {
    return this.pubSubService.asyncIterator('categoryRemoved');
  }
}