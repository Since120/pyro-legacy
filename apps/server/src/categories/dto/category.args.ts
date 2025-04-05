// apps/server/src/categories/dto/category.args.ts
import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class CategoryArgs {
  @Field(() => ID)
  id: string;
}

@ArgsType()
export class CategoriesByGuildArgs {
  @Field({ defaultValue: 'default_guild' })
  guild_id: string;

  @Field(() => String, { nullable: true })
  searchQuery?: string;
}