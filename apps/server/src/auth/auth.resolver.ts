// apps/server/src/auth/auth.resolver.ts
import { Resolver, Query, Context, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard, OptionalJwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { AuthResponse } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => User, { nullable: true, description: 'Gibt den aktuell eingeloggten Benutzer zurück' })
  @UseGuards(JwtAuthGuard)
  me(@Context() context) {
    return context.req.user;
  }

  @Query(() => Boolean)
  @UseGuards(OptionalJwtAuthGuard)
  isAuthenticated(@Context() context) {
    return !!context.req.user;
  }

  // Optional: Wenn du einen Token verifizieren möchtest
  @Mutation(() => AuthResponse, { nullable: true, description: 'Validiert einen JWT Token' })
  validateToken(@Args('token') token: string) {
    const payload = this.authService.validateToken(token);
    if (!payload) return null;
    
    return this.authService.findUserById(payload.sub).then(user => {
      if (!user) return null;
      return { user, accessToken: token };
    });
  }
}