// apps/server/src/discord/discord.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiscordService } from './discord.service';
import { DiscordResolver } from './discord.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule, AuthModule],
  providers: [DiscordService, DiscordResolver],
  exports: [DiscordService],
})
export class DiscordModule {}
