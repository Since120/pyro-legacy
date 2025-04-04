// apps/server/src/auth/dto/auth.dto.ts
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}