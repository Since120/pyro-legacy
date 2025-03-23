// apps/server/src/categories/entities/category.entity.ts
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category {
  @Field(() => ID)
  id: string;

  @Field()
  guild_id: string;

  @Field()
  name: string;

  @Field()
  categoryType: string;

  @Field()
  isVisible: boolean;

  @Field()
  trackingActive: boolean;

  @Field()
  sendSetup: boolean;

  @Field(() => [String])
  allowedRoles: string[];

  @Field(() => Date, { nullable: true })
  lastUsage: Date | null;

  @Field(() => Int)
  totalSecondsInCateg: number;

  @Field(() => String, { nullable: true })
  discordCategoryId: string | null;

  @Field()
  deletedInDiscord: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}