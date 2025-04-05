import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateZoneInput {
  @Field()
  zoneKey: string;

  @Field()
  zoneName: string;

  @Field(() => Int, { defaultValue: 60 })
  minutesRequired?: number;

  @Field(() => Int, { defaultValue: 1 })
  pointsGranted?: number;

  @Field({ nullable: true })
  categoryId?: string;

  @Field({ defaultValue: false })
  deletedInDiscord?: boolean;

  @Field({ defaultValue: 'default_guild' })
  guild_id?: string;

  @Field(() => [String], { defaultValue: [] })
  allowedRoles?: string[];
}