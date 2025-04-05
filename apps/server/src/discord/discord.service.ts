// apps/server/src/discord/discord.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { DiscordGuild } from './entities/discord-guild.entity';
import { BOT_URL } from '../config/constants';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DiscordService {
  constructor(
    private httpService: HttpService,
    private authService: AuthService,
  ) {}

  async getBotGuilds(): Promise<DiscordGuild[]> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${BOT_URL}/api/guilds`)
      );

      return response.data.map(guild => ({
        ...guild,
        botPresent: true,
      }));
    } catch (error) {
      console.error('Error fetching bot guilds:', error);
      return [];
    }
  }

  async getUserGuilds(userId: string): Promise<DiscordGuild[]> {
    try {
      // Benutzer aus der Datenbank abrufen
      const user = await this.authService.findUserById(userId);

      if (!user || !user.guilds || user.guilds.length === 0) {
        return [];
      }

      // Bot-Guilds abrufen
      const botGuilds = await this.getBotGuilds();
      const botGuildIds = botGuilds.map(guild => guild.id);

      // Discord API aufrufen, um Details zu den Guilds des Benutzers zu erhalten
      const response = await lastValueFrom(
        this.httpService.get(`https://discord.com/api/v10/users/@me/guilds`, {
          headers: {
            Authorization: `Bearer ${user.discordAccessToken}`,
          },
        })
      );

      // Nur Guilds zurückgeben, auf denen auch der Bot ist
      return response.data
        .filter(guild => botGuildIds.includes(guild.id))
        .map(guild => ({
          id: guild.id,
          name: guild.name,
          icon: guild.icon,
          botPresent: true,
        }));
    } catch (error) {
      console.error('Error fetching user guilds:', error);
      return [];
    }
  }

  async getGuildById(guildId: string): Promise<DiscordGuild | null> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${BOT_URL}/api/guilds/${guildId}`)
      );

      return {
        ...response.data,
        botPresent: true,
      };
    } catch (error) {
      console.error(`Error fetching guild with ID ${guildId}:`, error);
      return null;
    }
  }
}
