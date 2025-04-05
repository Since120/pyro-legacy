// apps/server/src/categories/entities/category.entity.ts
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Zone } from '../../zones/entities/zone.entity';
import { Category as PrismaCategory } from '@prisma/client';

/**
 * GraphQL Category Entity
 * Implementiert das Prisma Category Model für Typkonsistenz
 */
@ObjectType()
export class Category implements Omit<PrismaCategory, 'zones'> {
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

  @Field(() => [Zone], { nullable: true })
  zones?: Zone[];
}