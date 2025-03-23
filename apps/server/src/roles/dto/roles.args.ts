// apps/server/src/roles/dto/roles.args.ts
import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class RoleArgs {
  @Field(() => ID)
  id: string;
}

@ArgsType()
export class RolesByGuildArgs {
  @Field()
  guild_id: string;
}