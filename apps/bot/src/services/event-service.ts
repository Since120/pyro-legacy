import { ChannelType, GuildChannel } from 'discord.js';
import fetch from 'node-fetch';
import { DiscordUtils } from '../utilities/discord-utils';
import { RedisPubSub } from '../core/pubsub-client';

export class EventService {
  private subscriptions: { [key: string]: any } = {};
  private totalSubscriptions = 0;

  constructor(
    private pubSub: RedisPubSub,
    private discordUtils: DiscordUtils
  ) {
    console.log('Initializing EventService...');
    this.initializeSubscriptions();
  }

  private initializeSubscriptions() {
    console.log('Initializing Pub/Sub subscriptions for specific channels...');
    
    // Abonniere die verschiedenen Event-Typen
    this.subscribeToChannel('categoryCreated', this.handleCategoryCreated.bind(this));
    this.subscribeToChannel('categoryUpdated', this.handleCategoryUpdated.bind(this));
    this.subscribeToChannel('categoryRemoved', this.handleCategoryRemoved.bind(this));
    this.subscribeToChannel('zoneCreated', this.handleZoneCreated.bind(this));
    this.subscribeToChannel('zoneUpdated', this.handleZoneUpdated.bind(this));
    this.subscribeToChannel('zoneRemoved', this.handleZoneRemoved.bind(this));
    
    console.log('EventService initialized and subscriptions started.');
    console.log('Listening for channel updates.');
  }

  private subscribeToChannel(channelName: string, handler: (message: string) => Promise<void>) {
    try {
      const subscription = this.pubSub.subscribe(channelName, async (message: string) => {
        try {
          console.log(`Received message on ${channelName} channel: ${message}`);
          await handler(message);
        } catch (error) {
          console.error(`Error handling message from ${channelName}:`, error);
        }
      });
      
      this.subscriptions[channelName] = subscription;
      this.totalSubscriptions++;
      console.log(`Subscribed to ${channelName}. Total subscriptions: ${this.totalSubscriptions}`);
    } catch (error) {
      console.error(`Failed to subscribe to ${channelName}:`, error);
    }
  }

  private async handleCategoryCreated(message: string): Promise<void> {
    try {
      console.log(`Processing categoryCreated event with message: ${message}`);
      
      // Parse the message
      const parsedMessage = JSON.parse(message);
      const category = parsedMessage.categoryCreated;
      
      if (!category) {
        console.error('Invalid payload format:', message);
        return;
      }
      
      console.log(`Creating category: ${category.name}`);
      await this.discordUtils.createCategory(category);
    } catch (error) {
      console.error('Category creation error:', error);
    }
  }

  private async handleCategoryUpdated(message: string): Promise<void> {
    try {
      console.log(`Processing categoryUpdated event with message: ${message}`);
      
      // Parse the message
      const parsedMessage = JSON.parse(message);
      const category = parsedMessage.categoryUpdated;
      
      if (!category) {
        console.error('Invalid payload format:', message);
        return;
      }
      
      console.log(`Updating category: ${category.name}`);
      await this.discordUtils.updateCategory(category);
    } catch (error) {
      console.error('Category update error:', error);
    }
  }

  private async handleCategoryRemoved(message: string): Promise<void> {
    try {
      console.log(`Processing categoryRemoved event with message: ${message}`);
      
      // Parse the message
      const parsedMessage = JSON.parse(message);
      const category = parsedMessage.categoryRemoved;
      
      if (!category) {
        console.error('Invalid payload format:', message);
        return;
      }
      
      console.log(`Deleting category: ${category.name}`);
      await this.discordUtils.deleteCategory(category);
    } catch (error) {
      console.error('Category deletion error:', error);
    }
  }

  private async handleZoneCreated(message: string): Promise<void> {
    try {
      console.log(`Processing zoneCreated event with message: ${message}`);
      
      // Parse the message
      const parsedMessage = JSON.parse(message);
      const zone = parsedMessage.zoneCreated;
      
      if (!zone) {
        console.error('Invalid payload format:', message);
        return;
      }
      
      console.log(`Creating voice channel for zone: ${zone.zoneName}`);
      await this.discordUtils.createVoiceChannel(zone);
    } catch (error) {
      console.error('Zone creation error:', error);
    }
  }

  private async handleZoneUpdated(message: string): Promise<void> {
    try {
      console.log(`Processing zoneUpdated event with message: ${message}`);
      
      // Parse the message
      const parsedMessage = JSON.parse(message);
      const zone = parsedMessage.zoneUpdated;
      
      if (!zone) {
        console.error('Invalid payload format:', message);
        return;
      }
      
      console.log(`Updating voice channel for zone: ${zone.zoneName}`);
      await this.discordUtils.updateVoiceChannel(zone);
    } catch (error) {
      console.error('Zone update error:', error);
    }
  }

  private async handleZoneRemoved(message: string): Promise<void> {
    try {
      console.log(`Processing zoneRemoved event with message: ${message}`);
      
      // Parse the message
      const parsedMessage = JSON.parse(message);
      const zone = parsedMessage.zoneRemoved;
      
      if (!zone) {
        console.error('Invalid payload format:', message);
        return;
      }
      
      console.log(`Deleting voice channel for zone: ${zone.zoneName}`);
      await this.discordUtils.deleteVoiceChannel(zone);
    } catch (error) {
      console.error('Zone deletion error:', error);
    }
  }

  public async handleChannelUpdate(oldChannel: GuildChannel, newChannel: GuildChannel): Promise<void> {
    try {
      if (newChannel.type === ChannelType.GuildVoice && oldChannel.parentId !== newChannel.parentId) {
        console.log(`Voice channel ${newChannel.name} (${newChannel.id}) was moved from category ${oldChannel.parentId} to ${newChannel.parentId}`);
        
        // Zuerst versuchen wir, die Zone anhand der Discord-ID zu finden
        // Wir suchen in allen Guilds, da die Zone möglicherweise mit 'default_guild' gespeichert ist
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
            # Suche nach Kategorien in der aktuellen Guild
            categories(guild_id: "${newChannel.guild.id}") {
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
        if (zones.length > 0) {
          console.log('Zone IDs:', zones.map((z: any) => `${z.zoneName} (${z.id}) - Discord ID: ${z.discordId || 'none'} - Category ID: ${z.categoryId || 'none'}`).join(', '));
        } else {
          console.log('No zones found in the database. This could be because the zones are not properly stored or the GraphQL query is not returning any results.');
        }
        
        if (categories.length > 0) {
          console.log('Category IDs:', categories.map((c: any) => `${c.name} (${c.id}) - Discord ID: ${c.discordCategoryId || 'none'}`).join(', '));
        } else {
          console.log('No categories found in the database. This could be because the categories are not properly stored or the GraphQL query is not returning any results.');
        }
        
        // Suche nach der Zone mit der Discord-ID
        let zone = zones.find((z: any) => z.discordId === newChannel.id);

        // Wenn keine Zone gefunden wurde, versuchen wir, sie anhand des Namens zu finden
        if (!zone) {
          console.log(`No zone found with Discord ID ${newChannel.id}, trying to find by name`);
          zone = zones.find((z: any) => z.zoneName && z.zoneName.toLowerCase() === newChannel.name.toLowerCase());
          
          // Wenn immer noch keine Zone gefunden wurde, versuchen wir, sie anhand des zoneKey zu finden
          if (!zone) {
            console.log(`No zone found with name ${newChannel.name}, trying to find by zoneKey`);
            zone = zones.find((z: any) => z.zoneKey && z.zoneKey.toLowerCase() === newChannel.name.toLowerCase());
            
            if (!zone) {
              console.log(`No zone found with zoneKey ${newChannel.name}, cannot update category`);
              
              // Debugging: Zeige alle Zonen an, um zu sehen, was in der Datenbank ist
              if (zones.length > 0) {
                console.log('All zones in database:');
                zones.forEach((z: any) => {
                  console.log(`- ${z.zoneName || 'No name'} (${z.id}) - zoneKey: ${z.zoneKey || 'none'} - Discord ID: ${z.discordId || 'none'}`);
                });
              }
              
              return;
            } else {
              console.log(`Found zone by zoneKey: ${zone.zoneName || zone.zoneKey} (${zone.id})`);
              
              // Aktualisiere die Zone mit der Discord-ID
              const updateDiscordIdMutation = `
                mutation UpdateZoneDiscordId($input: UpdateZoneInput!) {
                  updateZone(updateZoneInput: $input) {
                    id
                    zoneName
                    zoneKey
                    discordId
                  }
                }
              `;
              
              const updateDiscordIdResponse = await fetch(`${process.env.API_URL}/graphql`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  query: updateDiscordIdMutation,
                  variables: {
                    input: {
                      id: zone.id,
                      discordId: newChannel.id
                    }
                  }
                })
              });
              
              if (!updateDiscordIdResponse.ok) {
                throw new Error(`GraphQL request failed with status ${updateDiscordIdResponse.status}`);
              }
              
              const updateDiscordIdData = await updateDiscordIdResponse.json();
              
              console.log('GraphQL response for updating Discord ID:', JSON.stringify(updateDiscordIdData, null, 2));
              
              if (updateDiscordIdData.errors) {
                throw new Error(`GraphQL errors: ${JSON.stringify(updateDiscordIdData.errors)}`);
              }
              
              console.log(`Successfully updated zone ${zone.zoneName || zone.zoneKey} (${zone.id}) with Discord ID ${newChannel.id}`);
            }
          } else {
            console.log(`Found zone by name: ${zone.zoneName} (${zone.id})`);
            
            // Aktualisiere die Zone mit der Discord-ID
            const updateDiscordIdMutation = `
              mutation UpdateZoneDiscordId($input: UpdateZoneInput!) {
                updateZone(updateZoneInput: $input) {
                  id
                  zoneName
                  zoneKey
                  discordId
                }
              }
            `;
            
            const updateDiscordIdResponse = await fetch(`${process.env.API_URL}/graphql`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                query: updateDiscordIdMutation,
                variables: {
                  input: {
                    id: zone.id,
                    discordId: newChannel.id
                  }
                }
              })
            });
            
            if (!updateDiscordIdResponse.ok) {
              throw new Error(`GraphQL request failed with status ${updateDiscordIdResponse.status}`);
            }
            
            const updateDiscordIdData = await updateDiscordIdResponse.json();
            
            console.log('GraphQL response for updating Discord ID:', JSON.stringify(updateDiscordIdData, null, 2));
            
            if (updateDiscordIdData.errors) {
              throw new Error(`GraphQL errors: ${JSON.stringify(updateDiscordIdData.errors)}`);
            }
            
            console.log(`Successfully updated zone ${zone.zoneName || zone.zoneKey} (${zone.id}) with Discord ID ${newChannel.id}`);
          }
        } else {
          console.log(`Found zone ${zone.zoneName || zone.zoneKey} (${zone.id}) with Discord ID ${newChannel.id} in guild ${zone.guild_id || 'unknown'}`);
        }

        // Finde die Kategorie anhand der Discord-Kategorie-ID
        const category = categories.find((c: any) => c.discordCategoryId === newChannel.parentId);

        if (!category) {
          console.log(`No category found with Discord ID ${newChannel.parentId}, cannot update zone`);
          
          // Debugging: Zeige alle Kategorien an, um zu sehen, was in der Datenbank ist
          if (categories.length > 0) {
            console.log('All categories in database:');
            categories.forEach((c: any) => {
              console.log(`- ${c.name || 'No name'} (${c.id}) - Discord ID: ${c.discordCategoryId || 'none'}`);
            });
          }
          
          return;
        }

        console.log(`Found category ${category.name} (${category.id}) with Discord ID ${newChannel.parentId} in guild ${category.guild_id || 'unknown'}`);

        // Jetzt aktualisieren wir die Zone mit der neuen Kategorie-ID
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
        
        const updateInput = {
          id: zone.id,
          categoryId: category.id, // Verwende die interne Kategorie-ID, nicht die Discord-ID
          guild_id: category.guild_id, // Aktualisiere die Guild-ID, um sicherzustellen, dass sie mit der Kategorie übereinstimmt
          discordId: newChannel.id // Stelle sicher, dass die Discord-ID aktualisiert wird
        };
        
        console.log('Update input:', JSON.stringify(updateInput, null, 2));
        
        const updateResponse = await fetch(`${process.env.API_URL}/graphql`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            query: updateZoneMutation,
            variables: {
              input: updateInput
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
        
        // Versuche, den Voice-Channel in die richtige Kategorie zu verschieben
        try {
          const guild = this.discordUtils.getGuild(category.guild_id);
          if (!guild) {
            console.log(`Could not find guild with ID ${category.guild_id}`);
            return;
          }
          
          const voiceChannel = await guild.channels.fetch(newChannel.id).catch(() => null);
          if (!voiceChannel) {
            console.log(`Could not find voice channel with ID ${newChannel.id} in guild ${guild.name} (${guild.id})`);
            return;
          }
          
          const discordCategory = await guild.channels.fetch(category.discordCategoryId).catch(() => null);
          if (!discordCategory) {
            console.log(`Could not find category with ID ${category.discordCategoryId} in guild ${guild.name} (${guild.id})`);
            return;
          }
          
          console.log(`Moving voice channel ${voiceChannel.name} (${voiceChannel.id}) to category ${discordCategory.name} (${discordCategory.id})`);
          
          // Prüfe, ob der Kanal ein Voice-Channel ist und die Kategorie eine Kategorie ist
          if (voiceChannel.type === ChannelType.GuildVoice && discordCategory.type === ChannelType.GuildCategory) {
            await voiceChannel.setParent(discordCategory.id, {
              lockPermissions: false // Behalte die benutzerdefinierten Berechtigungen bei
            });
          } else {
            console.log(`Channel types not compatible: voiceChannel.type = ${voiceChannel.type}, discordCategory.type = ${discordCategory.type}`);
          }
          
          console.log(`Successfully moved voice channel ${voiceChannel.name} (${voiceChannel.id}) to category ${discordCategory.name} (${discordCategory.id})`);
        } catch (error) {
          console.error('Error moving voice channel to category:', error instanceof Error ? error.message : error);
        }
      }
    } catch (error) {
      console.error('Channel update sync failed:', error instanceof Error ? error.stack : error);
    }
  }
}
