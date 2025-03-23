// apps/server/src/roles/entities/discord-role.entity.ts
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DiscordRole {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  color: number;

  @Field()
  hoist: boolean; // Whether the role is displayed separately in the sidebar

  @Field(() => Int)
  position: number; // Position of the role in the role hierarchy

  @Field()
  permissions: string; // Discord permissions as a string

  @Field()
  managed: boolean; // Whether this role is managed by an integration (bot, etc.)

  @Field()
  mentionable: boolean; // Whether this role can be mentioned

  @Field({ nullable: true })
  icon?: string; // Role icon hash

  @Field({ nullable: true })
  unicode_emoji?: string; // The role's unicode emoji

  @Field()
  guild_id: string; // The guild the role belongs to

  @Field({ nullable: true })
  tags?: string; // JSON string of role tags information
}