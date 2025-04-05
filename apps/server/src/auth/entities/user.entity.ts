// apps/server/src/auth/entities/user.entity.ts
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User as PrismaUser } from '@prisma/client';

/**
 * GraphQL User Entity
 * Implementiert das Prisma User Model für Typkonsistenz
 */
@ObjectType()
export class User implements Omit<PrismaUser, 'discordAccessToken' | 'discordRefreshToken'> {
  @Field(() => ID)
  id: string;

  @Field()
  discordId: string;

  @Field()
  username: string;

  @Field(() => String, { nullable: true })
  discriminator: string | null;

  @Field(() => String, { nullable: true })
  avatar: string | null;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => [String], { defaultValue: [] })
  guilds: string[];

  // Nicht in GraphQL exponiert, aber für interne Verwendung
  discordAccessToken?: string | null;
  discordRefreshToken?: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}