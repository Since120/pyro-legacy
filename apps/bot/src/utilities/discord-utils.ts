import {
  ChannelType,
  Client,
  Guild,
  PermissionsBitField,
  OverwriteType,
  GuildChannel,
  CategoryChannel,
  VoiceChannel
} from 'discord.js';
export interface Category {
  id: string;
  name: string;
  guild_id?: string;
  discordId?: string | null;
  discordCategoryId?: string | null;
  allowedRoles: string[];
  isVisible?: boolean;
  trackingActive?: boolean;
  sendSetup?: boolean;
}

export interface Zone {
  id: string;
  zoneName: string;
  zoneKey: string;
  guild_id?: string;
  categoryId: string;
  discordId?: string | null;
  allowedRoles?: string[];
  minutesRequired?: number;
  pointsGranted?: number;
  category?: {
    id: string;
    name: string;
    discordCategoryId: string;
  };
}

export class DiscordUtils {
  private guilds: Map<string, Guild> = new Map();

  constructor(private client: Client) {
    // Alle verfügbaren Guilds initialisieren
    client.guilds.cache.forEach(guild => {
      this.guilds.set(guild.id, guild);

      // Für Abwärtskompatibilität: Wenn nur eine Guild vorhanden ist, setze sie als default_guild
      if (client.guilds.cache.size === 1) {
        console.log(`Setting default_guild to ${guild.name} (${guild.id})`);
      }
    });

    console.log(`Initialized with ${this.guilds.size} guilds`);
  }

  // Hilfsmethode zum Abrufen einer Guild anhand der ID
  getGuild(guildId: string): Guild | undefined {
    // Wenn die guildId 'default_guild' ist, verwende die erste verfügbare Guild
    if (guildId === 'default_guild' && this.guilds.size > 0) {
      const firstGuild = this.guilds.values().next().value;
      if (firstGuild) {
        console.log(`Using first guild as default: ${firstGuild.name} (${firstGuild.id})`);
        return firstGuild;
      }
    }

    // Ansonsten versuche, die Guild mit der angegebenen ID zu finden
    const guild = this.guilds.get(guildId);
    if (guild) {
      return guild;
    }

    // Wenn keine Guild gefunden wurde, gib die erste Guild zurück (Fallback)
    if (this.guilds.size > 0) {
      const fallbackGuild = this.guilds.values().next().value;
      if (fallbackGuild) {
        console.warn(`Guild with ID ${guildId} not found. Using fallback: ${fallbackGuild.name} (${fallbackGuild.id})`);
        return fallbackGuild;
      }
    }

    console.error('No guilds available!');
    return undefined;
  }

  async createCategory(category: Category): Promise<CategoryChannel> {
    try {
      console.log('Creating Discord category:', category.name);
      console.log('Category data:', JSON.stringify(category, null, 2));

      // Hole die Guild anhand der guild_id aus der Kategorie
      const guild = this.getGuild(category.guild_id || 'default_guild');
      if (!guild) {
        throw new Error('No Discord guild available');
      }

      console.log(`Using Discord guild: ${guild.name} (${guild.id})`);

      const channel = await guild.channels.create({
        name: category.name,
        type: ChannelType.GuildCategory,
        permissionOverwrites: this.createOverrides(category.allowedRoles, category.isVisible)
      });

      console.log('Discord category created with ID:', channel.id);

      // Aktualisiere die Kategorie in der API mit der Discord-ID
      try {
        const apiUrl = process.env.API_URL || 'http://localhost:3333';
        const response = await fetch(`${apiUrl}/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              mutation UpdateCategory($input: UpdateCategoryInput!) {
                updateCategory(updateCategoryInput: $input) {
                  id
                  discordCategoryId
                }
              }
            `,
            variables: {
              input: {
                id: category.id,
                discordCategoryId: channel.id,
                guild_id: category.guild_id || 'default_guild', // Guild-ID mitschicken
                allowedRoles: category.allowedRoles || [], // Rollen mitschicken
                isVisible: category.isVisible !== undefined ? category.isVisible : true, // Sichtbarkeit mitschicken
                trackingActive: category.trackingActive !== undefined ? category.trackingActive : true, // Tracking-Status mitschicken
                sendSetup: category.sendSetup !== undefined ? category.sendSetup : false // Setup-Status mitschicken
              }
            }
          })
        });

        const result = await response.json();
        console.log('API update result:', result);
      } catch (apiError) {
        console.error('Failed to update API with Discord category ID:', apiError);
      }

      return channel;
    } catch (error) {
      console.error('Error creating Discord category:', error);
      throw error;
    }
  }

  async updateCategory(category: Category): Promise<CategoryChannel | null> {
    if (!category.discordCategoryId) {
      console.log('No discordCategoryId provided for category update:', category);
      return null;
    }

    // Hole die Guild anhand der guild_id aus der Kategorie
    const guild = this.getGuild(category.guild_id || 'default_guild');
    if (!guild) {
      throw new Error('No Discord guild available');
    }

    console.log(`Updating Discord category with ID ${category.discordCategoryId} in guild ${guild.name} (${guild.id})`);

    try {
      const existing = await guild.channels.fetch(category.discordCategoryId);
      if (!existing || existing.type !== ChannelType.GuildCategory) {
        console.log(`Channel with ID ${category.discordCategoryId} is not a category or does not exist`);
        return null;
      }

      console.log(`Found existing category: ${existing.name} (${existing.id})`);
      console.log(`Updating category name to: ${category.name}`);

      const updated = await (existing as CategoryChannel).edit({
        name: category.name,
        permissionOverwrites: this.createOverrides(category.allowedRoles, category.isVisible)
      });

      console.log(`Category updated successfully: ${updated.name} (${updated.id})`);
      return updated;
    } catch (error) {
      console.error(`Error updating Discord category ${category.discordCategoryId}:`, error);
      return null;
    }
  }

  async deleteCategory(discordId: string, guildId: string = 'default_guild'): Promise<void> {
    // Hole die Guild anhand der guild_id
    const guild = this.getGuild(guildId);
    if (!guild) {
      throw new Error('No Discord guild available');
    }

    const channel = await guild.channels.fetch(discordId);
    await channel?.delete();
  }

  async createVoiceChannel(zone: Zone): Promise<VoiceChannel> {
    try {
      console.log('Creating voice channel:', zone.zoneName);
      console.log('Zone data:', JSON.stringify(zone, null, 2));

      // Hole die Guild anhand der guild_id aus der Zone
      const guild = this.getGuild(zone.guild_id || 'default_guild');
      if (!guild) {
        throw new Error('No Discord guild available');
      }

      console.log(`Using Discord guild: ${guild.name} (${guild.id})`);

      // Wir müssen zuerst die Kategorie aus der Datenbank abrufen, um die Discord-Kategorie-ID zu erhalten
      const apiUrl = process.env.API_URL || 'http://localhost:3333';
      const response = await fetch(`${apiUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query GetCategory($id: ID!) {
              category(id: $id) {
                id
                discordCategoryId
              }
            }
          `,
          variables: {
            id: zone.categoryId
          }
        })
      });

      const result = await response.json();
      console.log('API category result:', result);

      if (!result.data?.category?.discordCategoryId) {
        throw new Error(`No Discord category ID found for category ${zone.categoryId}`);
      }

      const discordCategoryId = result.data.category.discordCategoryId;
      console.log(`Using Discord category ID: ${discordCategoryId}`);

      const category = await guild.channels.fetch(discordCategoryId);
      if (category?.type !== ChannelType.GuildCategory) {
        throw new Error(`Invalid Discord category ID: ${discordCategoryId}`);
      }

      // Prüfe, ob bereits ein Voice-Kanal mit demselben Namen existiert
      let channel;
      const existingChannels = await guild.channels.fetch();
      const existingChannel = existingChannels.find(
        (ch) => ch && ch.name === zone.zoneName && ch.type === ChannelType.GuildVoice
      ) as VoiceChannel | undefined;

      if (existingChannel) {
        console.log(`Voice-Kanal mit Namen ${zone.zoneName} existiert bereits: ${existingChannel.id}`);

        // Verschiebe den existierenden Kanal in die richtige Kategorie
        channel = await existingChannel.setParent(category.id, {
          lockPermissions: false // Behalte die benutzerdefinierten Berechtigungen bei
        });

        // Aktualisiere die Berechtigungen
        await channel.permissionOverwrites.set(this.createOverrides(zone.allowedRoles));

        console.log(`Existierender Voice-Kanal verschoben: ${channel.name} (${channel.id}) in Kategorie ${category.name} (${category.id})`);
      } else {
        // Erstelle einen neuen Voice-Kanal mit dem Namen der Zone
        channel = await guild.channels.create({
          name: zone.zoneName,
          type: ChannelType.GuildVoice,
          parent: category.id,
          permissionOverwrites: this.createOverrides(zone.allowedRoles)
        });

        console.log(`Neuer Voice-Kanal erstellt: ${channel.name} (${channel.id}) in Kategorie ${category.name} (${category.id})`);
      }

      console.log('Discord voice channel ID:', channel.id);

      // Aktualisiere die Zone in der API mit der Discord-ID
      try {
        console.log(`Updating zone ${zone.id} with Discord ID ${channel.id}`);

        const updateResponse = await fetch(`${apiUrl}/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              mutation UpdateZone($input: UpdateZoneInput!) {
                updateZone(updateZoneInput: $input) {
                  id
                  discordId
                  zoneName
                  guild_id
                }
              }
            `,
            variables: {
              input: {
                id: zone.id,
                discordId: channel.id,
                guild_id: zone.guild_id || 'default_guild' // Guild-ID mitschicken
              }
            }
          })
        });

        if (!updateResponse.ok) {
          throw new Error(`GraphQL request failed with status ${updateResponse.status}`);
        }

        const updateResult = await updateResponse.json();

        if (updateResult.errors) {
          throw new Error(`GraphQL errors: ${JSON.stringify(updateResult.errors)}`);
        }

        console.log('API zone update result:', JSON.stringify(updateResult.data, null, 2));
        console.log(`Successfully updated zone ${zone.id} with Discord ID ${channel.id}`);
      } catch (apiError) {
        console.error('Failed to update API with Discord voice channel ID:', apiError);
        throw apiError; // Fehler weiterleiten, damit er nicht ignoriert wird
      }

      return channel as VoiceChannel;
    } catch (error) {
      console.error('Error creating Discord voice channel:', error);
      throw error;
    }
  }

  async updateVoiceChannel(zone: Zone): Promise<VoiceChannel | null> {
    try {
      console.log('Updating voice channel:', zone.zoneName);
      console.log('Zone data:', JSON.stringify(zone, null, 2));

      if (!zone.discordId) {
        console.warn('Missing discordId for voice channel update');
        return null;
      }

      // Versuche, den Kanal in allen verfügbaren Guilds zu finden
      let existingChannel: VoiceChannel | null = null;
      let guildWithChannel: Guild | null = null;

      // Durchsuche alle Guilds nach dem Kanal
      for (const guild of this.guilds.values()) {
        try {
          const channel = await guild.channels.fetch(zone.discordId).catch(() => null);
          if (channel && channel.type === ChannelType.GuildVoice) {
            existingChannel = channel as VoiceChannel;
            guildWithChannel = guild;
            console.log(`Found voice channel in guild: ${guild.name} (${guild.id})`);
            break;
          }
        } catch (error) {
          // Ignoriere Fehler beim Abrufen des Kanals in dieser Guild
          console.log(`Could not find channel in guild ${guild.name} (${guild.id})`);
        }
      }

      if (!existingChannel || !guildWithChannel) {
        console.warn(`Voice channel with ID ${zone.discordId} not found in any guild`);
        return null;
      }

      console.log(`Using Discord guild: ${guildWithChannel.name} (${guildWithChannel.id})`);

      // Wenn die Zone eine Kategorie hat, versuchen wir, sie in die richtige Kategorie zu verschieben
      if (zone.category?.discordCategoryId) {
        try {
          const category = await guildWithChannel.channels.fetch(zone.category.discordCategoryId).catch(() => null);
          if (category && category.type === ChannelType.GuildCategory) {
            console.log(`Moving voice channel to category: ${zone.category.name} (${zone.category.discordCategoryId})`);
            existingChannel = await existingChannel.setParent(category.id, {
              lockPermissions: false // Behalte die benutzerdefinierten Berechtigungen bei
            }) as VoiceChannel;
          }
        } catch (error) {
          console.warn(`Could not move voice channel to category: ${error instanceof Error ? error.message : error}`);
        }
      }

      const updatedChannel = await existingChannel.edit({
        name: zone.zoneName,
        permissionOverwrites: this.createOverrides(zone.allowedRoles)
      });

      console.log('Discord voice channel updated with ID:', updatedChannel.id);

      return updatedChannel;
    } catch (error) {
      console.error('Error updating Discord voice channel:', error);
      throw error;
    }
  }

  async deleteVoiceChannel(discordId: string, guildId: string = 'default_guild'): Promise<void> {
    // Hole die Guild anhand der guild_id
    const guild = this.getGuild(guildId);
    if (!guild) {
      throw new Error('No Discord guild available');
    }

    const channel = await guild.channels.fetch(discordId);
    await channel?.delete();
  }

  async handleChannelUpdate(oldChannel: GuildChannel, newChannel: GuildChannel) {
    if (newChannel.type === ChannelType.GuildVoice && oldChannel.parentId !== newChannel.parentId) {
      await fetch(`${process.env.API_URL}/zones/${newChannel.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({categoryId: newChannel.parentId})
      });
    }
  }

  private createOverrides(roleIds: string[] | undefined, isVisible: boolean = true) {
    const overrides = [];

    // Standardeinstellung für @everyone
    overrides.push({
      id: '0', // @everyone hat immer die ID 0
      // Wenn isVisible true ist, kann jeder die Kategorie sehen, aber nicht joinen
      // Wenn isVisible false ist, kann niemand die Kategorie sehen (außer den erlaubten Rollen)
      deny: isVisible ?
        [PermissionsBitField.Flags.Connect] :
        [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
      type: OverwriteType.Role
    });

    // Wenn keine Rollen angegeben sind und isVisible true ist, dann ist die Kategorie für alle sichtbar und joinbar
    if (!roleIds || roleIds.length === 0) {
      if (isVisible) {
        // Überschreibe die @everyone Einstellung, um Connect zu erlauben
        overrides[0] = {
          id: '0',
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
          type: OverwriteType.Role
        };
      }
      return overrides;
    }

    // Füge Berechtigungen für die angegebenen Rollen hinzu
    roleIds.forEach(id => {
      overrides.push({
        id,
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
        type: OverwriteType.Role
      });
    });

    return overrides;
  }
}