// apps/server/src/auth/strategies/discord.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { AuthService } from '../auth.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_REDIRECT_URI,
      scope: ['identify', 'guilds', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    const { id: discordId, username, discriminator, avatar, email } = profile;
    const guilds = profile.guilds ? profile.guilds.map(g => g.id) : [];

    return this.authService.validateUser({
      discordId,
      username,
      discriminator,
      avatar,
      email,
      guilds,
      accessToken,
      refreshToken,
    });
  }
}