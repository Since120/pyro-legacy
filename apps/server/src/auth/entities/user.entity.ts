// apps/server/src/auth/entities/user.entity.ts
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
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

  @Field(() => [String], { defaultValue: [] })
  guilds: string[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}