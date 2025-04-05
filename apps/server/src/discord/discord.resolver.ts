// apps/server/src/discord/discord.resolver.ts
import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordGuild } from './entities/discord-guild.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@Resolver(() => DiscordGuild)
export class DiscordResolver {
  constructor(private readonly discordService: DiscordService) {}

  @Query(() => [DiscordGuild])
  @UseGuards(JwtAuthGuard)
  async availableGuilds(@CurrentUser() user: User): Promise<DiscordGuild[]> {
    return this.discordService.getUserGuilds(user.id);
  }

  @Query(() => DiscordGuild, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async guildById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<DiscordGuild | null> {
    return this.discordService.getGuildById(id);
  }
}
