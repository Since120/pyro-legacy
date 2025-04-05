import { Client, Guild } from 'discord.js';
import { DISCORD_GUILD_ID } from '../../config/environment';

/**
 * Service für die Verwaltung von Discord-Guilds
 */
export class GuildService {
  constructor(private client: Client) {}

  /**
   * Holt eine Guild anhand ihrer ID
   * @param guildId Die ID der Guild
   * @returns Die Guild oder null, wenn keine gefunden wurde
   */
  getGuild(guildId: string): Guild | null {
    // Wenn keine Guild-ID angegeben wurde, versuche die Standard-Guild zu verwenden
    if (!guildId || guildId === 'default_guild') {
      // Wenn eine Standard-Guild-ID in der Umgebung definiert ist, verwende diese
      if (DISCORD_GUILD_ID) {
        const guild = this.client.guilds.cache.get(DISCORD_GUILD_ID);
        if (guild) return guild;
      }
      
      // Andernfalls verwende die erste verfügbare Guild
      const firstGuild = this.client.guilds.cache.first();
      if (firstGuild) {
        console.log(`Using first guild as default: ${firstGuild.name} (${firstGuild.id})`);
        return firstGuild;
      }
      
      console.error('No Discord guild available');
      return null;
    }
    
    // Versuche, die Guild anhand der ID zu finden
    const guild = this.client.guilds.cache.get(guildId);
    if (!guild) {
      console.error(`Guild with ID ${guildId} not found`);
      return null;
    }
    
    console.log(`Using Discord guild: ${guild.name} (${guild.id})`);
    return guild;
  }

  /**
   * Holt alle verfügbaren Guilds
   * @returns Eine Liste aller Guilds
   */
  getAllGuilds(): Guild[] {
    return Array.from(this.client.guilds.cache.values());
  }
}
