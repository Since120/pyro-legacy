import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Category } from '../../categories/entities/category.entity';
import { Zone as PrismaZone } from '@prisma/client';

/**
 * GraphQL Zone Entity
 * Implementiert das Prisma Zone Model für Typkonsistenz
 */
@ObjectType()
export class Zone implements Omit<PrismaZone, 'category'> {
  @Field(() => ID)
  id: string;

  @Field()
  zoneKey: string;

  @Field()
  zoneName: string;

  @Field(() => Int)
  minutesRequired: number;

  @Field(() => Int)
  pointsGranted: number;

  @Field(() => Date, { nullable: true })
  lastUsage: Date | null;

  @Field(() => Int)
  totalSecondsInZone: number;

  @Field(() => String, { nullable: true })
  categoryId: string | null;

  @Field(() => Category, { nullable: true })
  category?: Category | null;

  @Field(() => String, { nullable: true })
  discordId: string | null;

  @Field(() => [String])
  allowedRoles: string[];

  @Field()
  deletedInDiscord: boolean;

  @Field()
  guild_id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}