// apps/server/src/discord/entities/discord-guild.entity.ts
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DiscordGuild {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  icon: string | null;

  @Field()
  botPresent: boolean;
}
