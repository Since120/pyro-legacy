import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateZoneInput } from './create-zone.input';

@InputType()
export class UpdateZoneInput extends PartialType(CreateZoneInput) {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  discordId?: string;

  @Field(() => [String], { nullable: true })
  allowedRoles?: string[];
}