import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class ZoneArgs {
  @Field(() => ID)
  id: string;
}

@ArgsType()
export class ZonesByGuildArgs {
  @Field({ defaultValue: 'default_guild' })
  guild_id: string;
}

@ArgsType()
export class ZonesByCategoryArgs {
  @Field()
  categoryId: string;
}