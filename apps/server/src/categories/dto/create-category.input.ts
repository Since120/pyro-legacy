// apps/server/src/categories/dto/create-category.input.ts
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  @Field()
  name: string;

  @Field()
  categoryType: string;

  @Field({ defaultValue: 'default_guild' })
  guild_id?: string;

  @Field({ defaultValue: true })
  isVisible?: boolean;

  @Field({ defaultValue: false })
  trackingActive?: boolean;

  @Field({ defaultValue: false })
  sendSetup?: boolean;

  @Field(() => [String], { defaultValue: [] })
  allowedRoles?: string[];

  @Field({ nullable: true })
  discordCategoryId?: string;
}