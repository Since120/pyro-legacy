// apps/server/src/roles/roles.service.ts
import { Injectable } from '@nestjs/common';
import { DiscordRole } from './entities/discord-role.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { BOT_URL } from '../config';

@Injectable()
export class RolesService {
  constructor(private httpService: HttpService) {}

  async findAllByGuild(guild_id: string): Promise<DiscordRole[]> {
    try {
      // Assuming your Discord bot exposes an API endpoint to get roles
      const response = await lastValueFrom(
        this.httpService.get(`${BOT_URL}/api/guilds/${guild_id}/roles`)
      );
      
      return response.data.map(role => ({
        ...role,
        guild_id,
      }));
    } catch (error) {
      console.error('Error fetching Discord roles:', error);
      return [];
    }
  }

  async findOne(guild_id: string, role_id: string): Promise<DiscordRole | null> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${BOT_URL}/api/guilds/${guild_id}/roles/${role_id}`)
      );
      
      return {
        ...response.data,
        guild_id,
      };
    } catch (error) {
      console.error(`Error fetching Discord role ${role_id}:`, error);
      return null;
    }
  }
}