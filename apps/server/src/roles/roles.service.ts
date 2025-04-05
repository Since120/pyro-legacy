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
    // Wenn keine gültige Guild-ID angegeben ist oder es sich um die Standard-ID handelt,
    // geben wir einige Beispielrollen zurück
    if (!guild_id || guild_id === 'default_guild' || guild_id === 'undefined') {
      console.log('Using mock roles for guild_id:', guild_id);
      return this.getMockRoles(guild_id);
    }

    try {
      // Assuming your Discord bot exposes an API endpoint to get roles
      const response = await lastValueFrom(
        this.httpService.get(`${BOT_URL}/api/guilds/${guild_id}/roles`)
      );

      return response.data.map(role => {
        // Konvertiere die Farbe in einen Hex-String
        const colorHex = role.color ? `#${role.color.toString(16).padStart(6, '0')}` : undefined;

        // Stelle sicher, dass die Farbe eine Zahl ist
        const color = typeof role.color === 'string' ?
          parseInt(role.color.replace('#', ''), 16) :
          (typeof role.color === 'number' ? role.color : 0);

        return {
          ...role,
          guild_id,
          color,
          colorHex
        };
      });
    } catch (error) {
      console.error('Error fetching Discord roles:', error);
      // Wenn ein Fehler auftritt, geben wir Beispielrollen zurück
      return this.getMockRoles(guild_id);
    }
  }

  async findOne(guild_id: string, role_id: string): Promise<DiscordRole | null> {
    // Wenn keine gültige Guild-ID angegeben ist oder es sich um die Standard-ID handelt,
    // geben wir eine Beispielrolle zurück
    if (!guild_id || guild_id === 'default_guild' || guild_id === 'undefined') {
      const mockRoles = this.getMockRoles(guild_id);
      return mockRoles.find(role => role.id === role_id) || null;
    }

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

  /**
   * Gibt Beispielrollen zurück, wenn keine echten Rollen verfügbar sind
   */
  private getMockRoles(guild_id: string): DiscordRole[] {
    return [
      {
        id: '123456789',
        name: 'Admin',
        color: 16711680, // Rot in Dezimal (0xFF0000)
        colorHex: '#FF0000',
        hoist: true,
        position: 5,
        permissions: '8',
        managed: false,
        mentionable: true,
        guild_id: guild_id || 'default_guild'
      },
      {
        id: '234567890',
        name: 'Moderator',
        color: 65280, // Grün in Dezimal (0x00FF00)
        colorHex: '#00FF00',
        hoist: true,
        position: 4,
        permissions: '4',
        managed: false,
        mentionable: true,
        guild_id: guild_id || 'default_guild'
      },
      {
        id: '345678901',
        name: 'VIP',
        color: 255, // Blau in Dezimal (0x0000FF)
        colorHex: '#0000FF',
        hoist: true,
        position: 3,
        permissions: '2',
        managed: false,
        mentionable: true,
        guild_id: guild_id || 'default_guild'
      },
      {
        id: '456789012',
        name: 'Member',
        color: 16776960, // Gelb in Dezimal (0xFFFF00)
        colorHex: '#FFFF00',
        hoist: false,
        position: 2,
        permissions: '1',
        managed: false,
        mentionable: true,
        guild_id: guild_id || 'default_guild'
      },
      {
        id: '567890123',
        name: 'Newbie',
        color: 65535, // Cyan in Dezimal (0x00FFFF)
        colorHex: '#00FFFF',
        hoist: false,
        position: 1,
        permissions: '0',
        managed: false,
        mentionable: true,
        guild_id: guild_id || 'default_guild'
      },
      {
        id: '678901234',
        name: 'Bot',
        color: 16711935, // Magenta in Dezimal (0xFF00FF)
        colorHex: '#FF00FF',
        hoist: false,
        position: 0,
        permissions: '0',
        managed: true,
        mentionable: false,
        guild_id: guild_id || 'default_guild'
      }
    ];
  }
}