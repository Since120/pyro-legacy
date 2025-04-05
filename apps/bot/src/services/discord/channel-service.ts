import { CategoryChannel, ChannelType, Client, Guild, GuildChannel, PermissionsBitField, VoiceChannel } from 'discord.js';
import { GuildService } from './guild-service';
import { PermissionService } from './permission-service';
import { Category, Zone } from '@pyro/types';

// Erweiterte Zone-Schnittstelle mit den benötigten Feldern
interface ExtendedZone extends Zone {
  discordId?: string | null;
  allowedRoles?: string[];
}

/**
 * Service für die Verwaltung von Discord-Channels
 */
export class ChannelService {
  private guildService: GuildService;
  private permissionService: PermissionService;

  constructor(private client: Client) {
    this.guildService = new GuildService(client);
    this.permissionService = new PermissionService();
  }

  /**
   * Erstellt eine Kategorie in Discord
   * @param category Die zu erstellende Kategorie
   * @returns Die erstellte Kategorie oder null, wenn ein Fehler auftritt
   */
  async createCategory(category: Category): Promise<CategoryChannel | null> {
    console.log('Creating Discord category:', category.name);
    console.log('Category data:', JSON.stringify(category, null, 2));

    // Hole die Guild
    const guild = this.guildService.getGuild(category.guild_id || 'default_guild');
    if (!guild) {
      throw new Error('No Discord guild available');
    }

    try {
      // Erstelle die Kategorie
      const discordCategory = await guild.channels.create({
        name: category.name,
        type: ChannelType.GuildCategory,
        permissionOverwrites: this.permissionService.createOverrides(category.allowedRoles, category.isVisible)
      });

      console.log(`Discord category created with ID: ${discordCategory.id}`);

      // Aktualisiere die Kategorie in der Datenbank mit der Discord-ID
      await this.updateCategoryInDatabase(category.id, discordCategory.id);

      return discordCategory;
    } catch (error) {
      console.error('Error creating Discord category:', error);
      return null;
    }
  }

  /**
   * Aktualisiert eine Kategorie in Discord
   * @param category Die zu aktualisierende Kategorie
   * @returns Die aktualisierte Kategorie oder null, wenn ein Fehler auftritt
   */
  async updateCategory(category: Category): Promise<CategoryChannel | null> {
    if (!category.discordCategoryId) {
      console.log('No discordCategoryId provided for category update:', category);
      return null;
    }

    // Hole die Guild anhand der guild_id aus der Kategorie
    // Wenn guild_id 'default_guild' ist, versuche die Guild anhand der discordCategoryId zu finden
    let guild = null;

    if (category.guild_id && category.guild_id !== 'default_guild') {
      guild = this.guildService.getGuild(category.guild_id);
    } else {
      // Versuche, die Guild anhand der discordCategoryId zu finden
      console.log('Trying to find guild by discordCategoryId:', category.discordCategoryId);

      // Durchsuche alle verfügbaren Guilds
      const allGuilds = this.guildService.getAllGuilds();
      for (const g of allGuilds) {
        try {
          const channel = await g.channels.fetch(category.discordCategoryId);
          if (channel) {
            guild = g;
            console.log(`Found guild for category ${category.name}: ${guild.name} (${guild.id})`);
            break;
          }
        } catch (error) {
          // Ignoriere Fehler, wenn der Kanal in dieser Guild nicht gefunden wird
        }
      }
    }

    if (!guild) {
      throw new Error('No Discord guild available for this category');
    }

    console.log(`Updating Discord category with ID ${category.discordCategoryId} in guild ${guild.name} (${guild.id})`);

    try {
      // Hole den existierenden Channel
      const existing = await guild.channels.fetch(category.discordCategoryId);
      if (!existing || existing.type !== ChannelType.GuildCategory) {
        console.log(`Channel with ID ${category.discordCategoryId} is not a category or does not exist`);
        return null;
      }

      console.log(`Found existing category: ${existing.name} (${existing.id})`);
      console.log(`Updating category name to: ${category.name}`);

      // Aktualisiere die Kategorie
      const updated = await (existing as CategoryChannel).edit({
        name: category.name,
        permissionOverwrites: this.permissionService.createOverrides(category.allowedRoles, category.isVisible)
      });

      console.log(`Category updated successfully: ${updated.name} (${updated.id})`);
      return updated;
    } catch (error) {
      console.error(`Error updating Discord category ${category.discordCategoryId}:`, error);
      return null;
    }
  }

  /**
   * Löscht eine Kategorie in Discord
   * @param categoryId Die ID der zu löschenden Kategorie
   * @param guildId Die ID der Guild
   */
  async deleteCategory(categoryId: string, guildId: string): Promise<void> {
    // Hole die Guild
    const guild = this.guildService.getGuild(guildId);
    if (!guild) {
      throw new Error('No Discord guild available');
    }

    try {
      // Hole den Channel
      const channel = await guild.channels.fetch(categoryId);
      if (!channel) {
        console.log(`Category with ID ${categoryId} not found`);
        return;
      }

      // Lösche die Kategorie
      await channel.delete();
      console.log(`Category ${categoryId} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting Discord category ${categoryId}:`, error);
    }
  }

  /**
   * Erstellt einen Voice-Channel in Discord
   * @param zone Die zu erstellende Zone
   * @returns Der erstellte Voice-Channel oder null, wenn ein Fehler auftritt
   */
  async createVoiceChannel(zone: ExtendedZone): Promise<VoiceChannel | null> {
    console.log('Creating voice channel:', zone.zoneName);
    console.log('Zone data:', JSON.stringify(zone, null, 2));

    // Hole die Guild
    const guild = this.guildService.getGuild(zone.guild_id || 'default_guild');
    if (!guild) {
      throw new Error('No Discord guild available');
    }

    try {
      // Hole die Kategorie-ID aus der Datenbank
      const categoryId = await this.getCategoryDiscordId(zone.categoryId);
      if (!categoryId) {
        console.error(`No Discord category ID found for category ${zone.categoryId}`);
        return null;
      }

      console.log(`Using Discord category ID: ${categoryId}`);

      // Erstelle den Voice-Channel
      const voiceChannel = await guild.channels.create({
        name: zone.zoneName,
        type: ChannelType.GuildVoice,
        parent: categoryId,
        permissionOverwrites: this.permissionService.createOverrides(zone.allowedRoles || [], true)
      });

      console.log(`Neuer Voice-Kanal erstellt: ${voiceChannel.name} (${voiceChannel.id}) in Kategorie ${voiceChannel.parent?.name} (${voiceChannel.parent?.id})`);
      console.log(`Discord voice channel ID: ${voiceChannel.id}`);

      // Aktualisiere die Zone in der Datenbank mit der Discord-ID
      await this.updateZoneInDatabase(zone.id, voiceChannel.id);

      return voiceChannel;
    } catch (error) {
      console.error('Error creating Discord voice channel:', error);
      return null;
    }
  }

  /**
   * Aktualisiert einen Voice-Channel in Discord
   * @param zone Die zu aktualisierende Zone
   * @returns Der aktualisierte Voice-Channel oder null, wenn ein Fehler auftritt
   */
  async updateVoiceChannel(zone: ExtendedZone): Promise<VoiceChannel | null> {
    if (!zone.discordId) {
      console.log('No discordId provided for zone update:', zone);
      return null;
    }

    // Hole die Guild anhand der guild_id aus der Zone
    // Wenn guild_id 'default_guild' ist, versuche die Guild anhand der discordId zu finden
    let guild = null;

    if (zone.guild_id && zone.guild_id !== 'default_guild') {
      guild = this.guildService.getGuild(zone.guild_id);
    } else {
      // Versuche, die Guild anhand der discordId zu finden
      console.log('Trying to find guild by discordId:', zone.discordId);

      // Durchsuche alle verfügbaren Guilds
      const allGuilds = this.guildService.getAllGuilds();
      for (const g of allGuilds) {
        try {
          const channel = await g.channels.fetch(zone.discordId);
          if (channel) {
            guild = g;
            console.log(`Found guild for zone ${zone.zoneName}: ${guild.name} (${guild.id})`);
            break;
          }
        } catch (error) {
          // Ignoriere Fehler, wenn der Kanal in dieser Guild nicht gefunden wird
        }
      }
    }

    if (!guild) {
      throw new Error('No Discord guild available for this zone');
    }

    console.log(`Updating voice channel: ${zone.zoneName}`);
    console.log('Zone data:', JSON.stringify(zone, null, 2));

    try {
      // Hole den existierenden Channel
      const existing = await guild.channels.fetch(zone.discordId);
      if (!existing || existing.type !== ChannelType.GuildVoice) {
        console.log(`Channel with ID ${zone.discordId} is not a voice channel or does not exist`);
        return null;
      }

      // Hole die Kategorie-ID aus der Datenbank
      const categoryId = await this.getCategoryDiscordId(zone.categoryId);
      if (!categoryId) {
        console.error(`No Discord category ID found for category ${zone.categoryId}`);
        return null;
      }

      console.log(`Found voice channel in guild: ${guild.name} (${guild.id})`);
      console.log(`Moving voice channel to category: ${categoryId}`);

      // Aktualisiere den Voice-Channel
      const updated = await (existing as VoiceChannel).edit({
        name: zone.zoneName,
        parent: categoryId,
        permissionOverwrites: this.permissionService.createOverrides(zone.allowedRoles || [], true)
      });

      console.log(`Discord voice channel updated with ID: ${updated.id}`);
      return updated;
    } catch (error) {
      console.error(`Error updating Discord voice channel ${zone.discordId}:`, error);
      return null;
    }
  }

  /**
   * Löscht einen Voice-Channel in Discord
   * @param channelId Die ID des zu löschenden Voice-Channels
   * @param guildId Die ID der Guild
   */
  async deleteVoiceChannel(channelId: string, guildId: string): Promise<void> {
    // Hole die Guild
    const guild = this.guildService.getGuild(guildId);
    if (!guild) {
      throw new Error('No Discord guild available');
    }

    try {
      // Hole den Channel
      const channel = await guild.channels.fetch(channelId);
      if (!channel) {
        console.log(`Voice channel with ID ${channelId} not found`);
        return;
      }

      // Lösche den Voice-Channel
      await channel.delete();
      console.log(`Voice channel ${channelId} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting Discord voice channel ${channelId}:`, error);
    }
  }

  /**
   * Behandelt Channel-Updates in Discord
   * @param oldChannel Der alte Channel
   * @param newChannel Der neue Channel
   */
  async handleChannelUpdate(oldChannel: GuildChannel, newChannel: GuildChannel): Promise<void> {
    try {
      if (newChannel.type === ChannelType.GuildVoice && oldChannel.parentId !== newChannel.parentId) {
        console.log(`Voice channel ${newChannel.name} (${newChannel.id}) was moved from category ${oldChannel.parentId} to ${newChannel.parentId}`);

        // Aktualisiere die Zone in der Datenbank
        await this.updateZoneCategoryInDatabase(newChannel.id, newChannel.parentId);
      }
    } catch (error) {
      console.error('Channel update sync failed:', error instanceof Error ? error.stack : error);
    }
  }

  /**
   * Aktualisiert die Kategorie in der Datenbank mit der Discord-ID
   * @param categoryId Die ID der Kategorie
   * @param discordCategoryId Die Discord-ID der Kategorie
   */
  private async updateCategoryInDatabase(categoryId: string, discordCategoryId: string): Promise<void> {
    try {
      const updateCategoryMutation = `
        mutation UpdateCategory($input: UpdateCategoryInput!) {
          updateCategory(updateCategoryInput: $input) {
            id
            discordCategoryId
          }
        }
      `;

      const response = await fetch(`${process.env.API_URL}/graphql`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          query: updateCategoryMutation,
          variables: {
            input: {
              id: categoryId,
              discordCategoryId: discordCategoryId
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`GraphQL request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API update result:', data);

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }
    } catch (error) {
      console.error('Error updating category in database:', error);
    }
  }

  /**
   * Aktualisiert die Zone in der Datenbank mit der Discord-ID
   * @param zoneId Die ID der Zone
   * @param discordId Die Discord-ID des Voice-Channels
   */
  private async updateZoneInDatabase(zoneId: string, discordId: string): Promise<void> {
    try {
      const updateZoneMutation = `
        mutation UpdateZone($input: UpdateZoneInput!) {
          updateZone(updateZoneInput: $input) {
            id
            discordId
            zoneName
            guild_id
          }
        }
      `;

      console.log(`Updating zone ${zoneId} with Discord ID ${discordId}`);

      const response = await fetch(`${process.env.API_URL}/graphql`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          query: updateZoneMutation,
          variables: {
            input: {
              id: zoneId,
              discordId: discordId
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`GraphQL request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API zone update result:', data.data);

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      console.log(`Successfully updated zone ${zoneId} with Discord ID ${discordId}`);
    } catch (error) {
      console.error('Error updating zone in database:', error);
    }
  }

  /**
   * Aktualisiert die Kategorie einer Zone in der Datenbank
   * @param discordId Die Discord-ID des Voice-Channels
   * @param discordCategoryId Die Discord-ID der Kategorie
   */
  private async updateZoneCategoryInDatabase(discordId: string, discordCategoryId: string | null): Promise<void> {
    try {
      // Finde die Zone anhand der Discord-ID
      const findZoneQuery = `
        query FindZoneByDiscordId {
          # Suche nach allen Zonen
          zones {
            id
            zoneName
            zoneKey
            discordId
            categoryId
            guild_id
          }
          # Suche nach Kategorien
          categories {
            id
            name
            discordCategoryId
            guild_id
          }
        }
      `;

      console.log('Executing GraphQL query to find zone:', findZoneQuery);

      const findResponse = await fetch(`${process.env.API_URL}/graphql`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          query: findZoneQuery
        })
      });

      if (!findResponse.ok) {
        throw new Error(`GraphQL request failed with status ${findResponse.status}`);
      }

      const findData = await findResponse.json();

      // Debugging: Zeige die vollständige Antwort an
      console.log('GraphQL response:', JSON.stringify(findData, null, 2));

      const zones = findData.data?.zones || [];
      const categories = findData.data?.categories || [];

      // Debugging: Zeige alle gefundenen Zonen und Kategorien an
      console.log(`Found ${zones.length} zones and ${categories.length} categories`);

      // Suche nach der Zone mit der Discord-ID
      const zone = zones.find((z: any) => z.discordId === discordId);
      if (!zone) {
        console.log(`No zone found with Discord ID ${discordId}`);
        return;
      }

      console.log(`Found zone ${zone.zoneName || zone.zoneKey} (${zone.id}) with Discord ID ${discordId}`);

      // Finde die Kategorie anhand der Discord-Kategorie-ID
      const category = categories.find((c: any) => c.discordCategoryId === discordCategoryId);
      if (!category) {
        console.log(`No category found with Discord ID ${discordCategoryId}`);
        return;
      }

      console.log(`Found category ${category.name} (${category.id}) with Discord ID ${discordCategoryId}`);

      // Aktualisiere die Zone mit der neuen Kategorie-ID
      const updateZoneMutation = `
        mutation UpdateZone($input: UpdateZoneInput!) {
          updateZone(updateZoneInput: $input) {
            id
            zoneName
            zoneKey
            categoryId
            discordId
            guild_id
          }
        }
      `;

      console.log(`Updating zone ${zone.zoneName || zone.zoneKey} (${zone.id}) with category ${category.name} (${category.id})`);

      const updateResponse = await fetch(`${process.env.API_URL}/graphql`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          query: updateZoneMutation,
          variables: {
            input: {
              id: zone.id,
              categoryId: category.id,
              guild_id: category.guild_id
            }
          }
        })
      });

      if (!updateResponse.ok) {
        throw new Error(`GraphQL request failed with status ${updateResponse.status}`);
      }

      const updateData = await updateResponse.json();

      console.log('GraphQL response for updating zone:', JSON.stringify(updateData, null, 2));

      if (updateData.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(updateData.errors)}`);
      }

      console.log(`Successfully updated zone ${zone.zoneName || zone.zoneKey} (${zone.id}) to category ${category.name} (${category.id})`);
    } catch (error) {
      console.error('Error updating zone category in database:', error);
    }
  }

  /**
   * Holt die Discord-ID einer Kategorie aus der Datenbank
   * @param categoryId Die ID der Kategorie
   * @returns Die Discord-ID der Kategorie oder null, wenn keine gefunden wurde
   */
  private async getCategoryDiscordId(categoryId: string): Promise<string | null> {
    try {
      const getCategoryQuery = `
        query GetCategory($id: ID!) {
          category(id: $id) {
            id
            discordCategoryId
          }
        }
      `;

      const response = await fetch(`${process.env.API_URL}/graphql`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          query: getCategoryQuery,
          variables: {
            id: categoryId
          }
        })
      });

      if (!response.ok) {
        throw new Error(`GraphQL request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API category result:', data);

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      return data.data?.category?.discordCategoryId || null;
    } catch (error) {
      console.error('Error getting category Discord ID from database:', error);
      return null;
    }
  }
}
