import { Client } from 'discord.js';
import { RedisPubSub } from '../../core/pubsub-client';
import { DiscordUtils } from '../../utilities/discord-utils';

/**
 * Plugin für die Verwaltung von Kategorien und Zonen
 */
export class CategoriesZonesPlugin {
  private discordUtils: DiscordUtils;
  private subscriptions: { [key: string]: any } = {};
  private totalSubscriptions = 0;

  constructor(
    private client: Client,
    private pubSub: RedisPubSub
  ) {
    console.log('Initializing Categories & Zones Plugin...');

    // DiscordUtils initialisieren
    this.discordUtils = new DiscordUtils(client);

    // Redis-Subscriptions einrichten
    this.setupSubscriptions();

    console.log('Categories & Zones Plugin initialized successfully');
  }

  /**
   * Richtet die Redis-Subscriptions ein
   */
  private setupSubscriptions(): void {
    console.log('Setting up Redis subscriptions for Categories & Zones...');

    // Kategorie-Events
    this.subscribeToChannel('categoryCreated', this.handleCategoryCreated.bind(this));
    this.subscribeToChannel('categoryUpdated', this.handleCategoryUpdated.bind(this));
    this.subscribeToChannel('categoryRemoved', this.handleCategoryRemoved.bind(this));

    // Zone-Events
    this.subscribeToChannel('zoneCreated', this.handleZoneCreated.bind(this));
    this.subscribeToChannel('zoneUpdated', this.handleZoneUpdated.bind(this));
    this.subscribeToChannel('zoneRemoved', this.handleZoneRemoved.bind(this));

    console.log('Redis subscriptions set up successfully');
  }

  /**
   * Abonniert einen Redis-Kanal
   */
  private subscribeToChannel(channelName: string, handler: (message: string) => Promise<void>): void {
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

  /**
   * Verarbeitet eine categoryCreated-Nachricht
   */
  private async handleCategoryCreated(message: string): Promise<void> {
    try {
      console.log(`Processing categoryCreated event with message: ${message}`);

      // Versuche, die Kategorie aus der Nachricht zu extrahieren
      try {
        // Versuche, die Nachricht als JSON-Objekt zu parsen
        const parsedMessage = JSON.parse(message);
        console.log('Parsed message type:', typeof parsedMessage);

        // Wenn die Nachricht ein String ist, versuche sie erneut zu parsen
        if (typeof parsedMessage === 'string') {
          try {
            const reParsedMessage = JSON.parse(parsedMessage);
            console.log('Re-parsed message:', reParsedMessage);

            if (reParsedMessage.categoryCreated) {
              const category = reParsedMessage.categoryCreated;
              console.log('Category from re-parsed message:', category);
              await this.discordUtils.createCategory(category);
              return;
            }
          } catch (reParseError) {
            console.error('Error re-parsing message:', reParseError);
          }
        }

        // Wenn die Nachricht ein Objekt ist, versuche die Kategorie direkt zu extrahieren
        if (typeof parsedMessage === 'object' && parsedMessage !== null) {
          if (parsedMessage.categoryCreated) {
            const category = parsedMessage.categoryCreated;
            console.log('Category from parsed message:', category);
            await this.discordUtils.createCategory(category);
            return;
          }
        }

        // Wenn die Nachricht ein Array ist (was bei JSON.parse manchmal passieren kann),
        // versuche die Kategorie aus dem String zu extrahieren
        if (Array.isArray(parsedMessage)) {
          console.log('Parsed message is an array, trying to extract category from string...');

          // Versuche, die Kategorie mit einem Regex zu extrahieren
          const categoryMatch = message.match(/\\{\"categoryCreated\":(\\{.*\\})\\}/);
          if (categoryMatch && categoryMatch[1]) {
            try {
              const extractedCategory = JSON.parse(categoryMatch[1]);
              console.log('Extracted category:', extractedCategory);
              await this.discordUtils.createCategory(extractedCategory);
              return;
            } catch (extractError) {
              console.error('Error extracting category from message:', extractError);
            }
          }

          // Versuche, die Nachricht als String zu behandeln und die Kategorie zu erstellen
          const messageStr = message.toString();
          const categoryObj = JSON.parse(messageStr);
          if (categoryObj.categoryCreated) {
            const category = categoryObj.categoryCreated;
            console.log('Category from string message:', category);
            await this.discordUtils.createCategory(category);
            return;
          }
        }

        console.error('Could not extract category from message:', message);
      } catch (parseError) {
        console.error('Error parsing message:', parseError);
      }
    } catch (error) {
      console.error('Category creation error:', error);
    }
  }

  /**
   * Verarbeitet eine categoryUpdated-Nachricht
   */
  private async handleCategoryUpdated(message: string): Promise<void> {
    try {
      console.log(`Processing categoryUpdated event with message: ${message}`);

      // Versuche, die Kategorie aus der Nachricht zu extrahieren
      try {
        // Versuche, die Nachricht als JSON-Objekt zu parsen
        const parsedMessage = JSON.parse(message);

        // Wenn die Nachricht ein String ist, versuche sie erneut zu parsen
        if (typeof parsedMessage === 'string') {
          try {
            const reParsedMessage = JSON.parse(parsedMessage);

            if (reParsedMessage.categoryUpdated) {
              const category = reParsedMessage.categoryUpdated;
              console.log('Category from re-parsed message:', category);
              await this.discordUtils.updateCategory(category);
              return;
            }
          } catch (reParseError) {
            console.error('Error re-parsing message:', reParseError);
          }
        }

        // Wenn die Nachricht ein Objekt ist, versuche die Kategorie direkt zu extrahieren
        if (typeof parsedMessage === 'object' && parsedMessage !== null) {
          if (parsedMessage.categoryUpdated) {
            const category = parsedMessage.categoryUpdated;
            console.log('Category from parsed message:', category);
            await this.discordUtils.updateCategory(category);
            return;
          }
        }

        // Wenn die Nachricht ein Array ist (was bei JSON.parse manchmal passieren kann),
        // versuche die Kategorie aus dem String zu extrahieren
        if (Array.isArray(parsedMessage)) {
          console.log('Parsed message is an array, trying to extract category from string...');

          // Versuche, die Kategorie mit einem Regex zu extrahieren
          const categoryMatch = message.match(/\\{\"categoryUpdated\":(\\{.*\\})\\}/);
          if (categoryMatch && categoryMatch[1]) {
            try {
              const extractedCategory = JSON.parse(categoryMatch[1]);
              console.log('Extracted category:', extractedCategory);
              await this.discordUtils.updateCategory(extractedCategory);
              return;
            } catch (extractError) {
              console.error('Error extracting category from message:', extractError);
            }
          }

          // Versuche, die Nachricht als String zu behandeln und die Kategorie zu aktualisieren
          const messageStr = message.toString();
          const categoryObj = JSON.parse(messageStr);
          if (categoryObj.categoryUpdated) {
            const category = categoryObj.categoryUpdated;
            console.log('Category from string message:', category);
            await this.discordUtils.updateCategory(category);
            return;
          }
        }

        console.error('Could not extract category from message:', message);
      } catch (parseError) {
        console.error('Error parsing message:', parseError);
      }
    } catch (error) {
      console.error('Category update error:', error);
    }
  }

  /**
   * Verarbeitet eine categoryRemoved-Nachricht
   */
  private async handleCategoryRemoved(message: string): Promise<void> {
    try {
      console.log(`Processing categoryRemoved event with message: ${message}`);

      // Versuche, die Kategorie aus der Nachricht zu extrahieren
      try {
        // Versuche, die Nachricht als JSON-Objekt zu parsen
        const parsedMessage = JSON.parse(message);

        // Wenn die Nachricht ein String ist, versuche sie erneut zu parsen
        if (typeof parsedMessage === 'string') {
          try {
            const reParsedMessage = JSON.parse(parsedMessage);

            if (reParsedMessage.categoryRemoved) {
              const category = reParsedMessage.categoryRemoved;
              console.log('Category from re-parsed message:', category);

              if (category.discordCategoryId && category.guild_id) {
                console.log(`Deleting Discord category with ID ${category.discordCategoryId} in guild ${category.guild_id}`);
                await this.discordUtils.deleteCategory(category.discordCategoryId, category.guild_id);
                console.log(`Discord category ${category.discordCategoryId} deleted successfully`);
              } else {
                console.error('Missing discordCategoryId or guild_id in category:', category);
              }
              return;
            }
          } catch (reParseError) {
            console.error('Error re-parsing message:', reParseError);
          }
        }

        // Wenn die Nachricht ein Objekt ist, versuche die Kategorie direkt zu extrahieren
        if (typeof parsedMessage === 'object' && parsedMessage !== null) {
          if (parsedMessage.categoryRemoved) {
            const category = parsedMessage.categoryRemoved;
            console.log('Category from parsed message:', category);

            if (category.discordCategoryId && category.guild_id) {
              console.log(`Deleting Discord category with ID ${category.discordCategoryId} in guild ${category.guild_id}`);
              await this.discordUtils.deleteCategory(category.discordCategoryId, category.guild_id);
              console.log(`Discord category ${category.discordCategoryId} deleted successfully`);
            } else {
              console.error('Missing discordCategoryId or guild_id in category:', category);
            }
            return;
          }
        }

        // Wenn die Nachricht ein Array ist (was bei JSON.parse manchmal passieren kann),
        // versuche die Kategorie aus dem String zu extrahieren
        if (Array.isArray(parsedMessage)) {
          console.log('Parsed message is an array, trying to extract category from string...');

          // Versuche, die Kategorie mit einem Regex zu extrahieren
          const categoryMatch = message.match(/\\{\"categoryRemoved\":(\\{.*\\})\\}/);
          if (categoryMatch && categoryMatch[1]) {
            try {
              const extractedCategory = JSON.parse(categoryMatch[1]);
              console.log('Extracted category:', extractedCategory);

              if (extractedCategory.discordCategoryId && extractedCategory.guild_id) {
                console.log(`Deleting Discord category with ID ${extractedCategory.discordCategoryId} in guild ${extractedCategory.guild_id}`);
                await this.discordUtils.deleteCategory(extractedCategory.discordCategoryId, extractedCategory.guild_id);
                console.log(`Discord category ${extractedCategory.discordCategoryId} deleted successfully`);
              } else {
                console.error('Missing discordCategoryId or guild_id in category:', extractedCategory);
              }
              return;
            } catch (extractError) {
              console.error('Error extracting category from message:', extractError);
            }
          }

          // Versuche, die Nachricht als String zu behandeln und die Kategorie zu löschen
          const messageStr = message.toString();
          const categoryObj = JSON.parse(messageStr);
          if (categoryObj.categoryRemoved) {
            const category = categoryObj.categoryRemoved;
            console.log('Category from string message:', category);

            if (category.discordCategoryId && category.guild_id) {
              console.log(`Deleting Discord category with ID ${category.discordCategoryId} in guild ${category.guild_id}`);
              await this.discordUtils.deleteCategory(category.discordCategoryId, category.guild_id);
              console.log(`Discord category ${category.discordCategoryId} deleted successfully`);
            } else {
              console.error('Missing discordCategoryId or guild_id in category:', category);
            }
            return;
          }
        }

        console.error('Could not extract category from message:', message);
      } catch (parseError) {
        console.error('Error parsing message:', parseError);
      }
    } catch (error) {
      console.error('Category deletion error:', error);
    }
  }

  /**
   * Verarbeitet eine zoneCreated-Nachricht
   */
  private async handleZoneCreated(message: string): Promise<void> {
    try {
      console.log(`Processing zoneCreated event with message: ${message}`);

      // Versuche, die Zone aus der Nachricht zu extrahieren
      try {
        // Versuche, die Nachricht als JSON-Objekt zu parsen
        const parsedMessage = JSON.parse(message);

        // Wenn die Nachricht ein String ist, versuche sie erneut zu parsen
        if (typeof parsedMessage === 'string') {
          try {
            const reParsedMessage = JSON.parse(parsedMessage);

            if (reParsedMessage.zoneCreated) {
              const zone = reParsedMessage.zoneCreated;
              console.log('Zone from re-parsed message:', zone);
              await this.discordUtils.createVoiceChannel(zone);
              return;
            }
          } catch (reParseError) {
            console.error('Error re-parsing message:', reParseError);
          }
        }

        // Wenn die Nachricht ein Objekt ist, versuche die Zone direkt zu extrahieren
        if (typeof parsedMessage === 'object' && parsedMessage !== null) {
          if (parsedMessage.zoneCreated) {
            const zone = parsedMessage.zoneCreated;
            console.log('Zone from parsed message:', zone);
            await this.discordUtils.createVoiceChannel(zone);
            return;
          }
        }

        // Wenn die Nachricht ein Array ist (was bei JSON.parse manchmal passieren kann),
        // versuche die Zone aus dem String zu extrahieren
        if (Array.isArray(parsedMessage)) {
          console.log('Parsed message is an array, trying to extract zone from string...');

          // Versuche, die Zone mit einem Regex zu extrahieren
          const zoneMatch = message.match(/\\{\"zoneCreated\":(\\{.*\\})\\}/);
          if (zoneMatch && zoneMatch[1]) {
            try {
              const extractedZone = JSON.parse(zoneMatch[1]);
              console.log('Extracted zone:', extractedZone);
              await this.discordUtils.createVoiceChannel(extractedZone);
              return;
            } catch (extractError) {
              console.error('Error extracting zone from message:', extractError);
            }
          }

          // Versuche, die Nachricht als String zu behandeln und die Zone zu erstellen
          const messageStr = message.toString();
          const zoneObj = JSON.parse(messageStr);
          if (zoneObj.zoneCreated) {
            const zone = zoneObj.zoneCreated;
            console.log('Zone from string message:', zone);
            await this.discordUtils.createVoiceChannel(zone);
            return;
          }
        }

        console.error('Could not extract zone from message:', message);
      } catch (parseError) {
        console.error('Error parsing message:', parseError);
      }
    } catch (error) {
      console.error('Zone creation error:', error);
    }
  }

  /**
   * Verarbeitet eine zoneUpdated-Nachricht
   */
  private async handleZoneUpdated(message: string): Promise<void> {
    try {
      console.log(`Processing zoneUpdated event with message: ${message}`);

      // Versuche, die Zone aus der Nachricht zu extrahieren
      try {
        // Versuche, die Nachricht als JSON-Objekt zu parsen
        const parsedMessage = JSON.parse(message);

        // Wenn die Nachricht ein String ist, versuche sie erneut zu parsen
        if (typeof parsedMessage === 'string') {
          try {
            const reParsedMessage = JSON.parse(parsedMessage);

            if (reParsedMessage.zoneUpdated) {
              const zone = reParsedMessage.zoneUpdated;
              console.log('Zone from re-parsed message:', zone);
              await this.discordUtils.updateVoiceChannel(zone);
              return;
            }
          } catch (reParseError) {
            console.error('Error re-parsing message:', reParseError);
          }
        }

        // Wenn die Nachricht ein Objekt ist, versuche die Zone direkt zu extrahieren
        if (typeof parsedMessage === 'object' && parsedMessage !== null) {
          if (parsedMessage.zoneUpdated) {
            const zone = parsedMessage.zoneUpdated;
            console.log('Zone from parsed message:', zone);
            await this.discordUtils.updateVoiceChannel(zone);
            return;
          }
        }

        // Wenn die Nachricht ein Array ist (was bei JSON.parse manchmal passieren kann),
        // versuche die Zone aus dem String zu extrahieren
        if (Array.isArray(parsedMessage)) {
          console.log('Parsed message is an array, trying to extract zone from string...');

          // Versuche, die Zone mit einem Regex zu extrahieren
          const zoneMatch = message.match(/\\{\"zoneUpdated\":(\\{.*\\})\\}/);
          if (zoneMatch && zoneMatch[1]) {
            try {
              const extractedZone = JSON.parse(zoneMatch[1]);
              console.log('Extracted zone:', extractedZone);
              await this.discordUtils.updateVoiceChannel(extractedZone);
              return;
            } catch (extractError) {
              console.error('Error extracting zone from message:', extractError);
            }
          }

          // Versuche, die Nachricht als String zu behandeln und die Zone zu aktualisieren
          const messageStr = message.toString();
          const zoneObj = JSON.parse(messageStr);
          if (zoneObj.zoneUpdated) {
            const zone = zoneObj.zoneUpdated;
            console.log('Zone from string message:', zone);
            await this.discordUtils.updateVoiceChannel(zone);
            return;
          }
        }

        console.error('Could not extract zone from message:', message);
      } catch (parseError) {
        console.error('Error parsing message:', parseError);
      }
    } catch (error) {
      console.error('Zone update error:', error);
    }
  }

  /**
   * Verarbeitet eine zoneRemoved-Nachricht
   */
  private async handleZoneRemoved(message: string): Promise<void> {
    try {
      console.log(`Processing zoneRemoved event with message: ${message}`);

      // Versuche, die Zone aus der Nachricht zu extrahieren
      try {
        // Versuche, die Nachricht als JSON-Objekt zu parsen
        const parsedMessage = JSON.parse(message);

        // Wenn die Nachricht ein String ist, versuche sie erneut zu parsen
        if (typeof parsedMessage === 'string') {
          try {
            const reParsedMessage = JSON.parse(parsedMessage);

            if (reParsedMessage.zoneRemoved) {
              const zone = reParsedMessage.zoneRemoved;
              console.log('Zone from re-parsed message:', zone);

              if (zone.discordId && zone.guild_id) {
                console.log(`Deleting Discord voice channel with ID ${zone.discordId} in guild ${zone.guild_id}`);
                await this.discordUtils.deleteVoiceChannel(zone.discordId, zone.guild_id);
                console.log(`Discord voice channel ${zone.discordId} deleted successfully`);
              } else {
                console.error('Missing discordId or guild_id in zone:', zone);
              }
              return;
            }
          } catch (reParseError) {
            console.error('Error re-parsing message:', reParseError);
          }
        }

        // Wenn die Nachricht ein Objekt ist, versuche die Zone direkt zu extrahieren
        if (typeof parsedMessage === 'object' && parsedMessage !== null) {
          if (parsedMessage.zoneRemoved) {
            const zone = parsedMessage.zoneRemoved;
            console.log('Zone from parsed message:', zone);

            if (zone.discordId && zone.guild_id) {
              console.log(`Deleting Discord voice channel with ID ${zone.discordId} in guild ${zone.guild_id}`);
              await this.discordUtils.deleteVoiceChannel(zone.discordId, zone.guild_id);
              console.log(`Discord voice channel ${zone.discordId} deleted successfully`);
            } else {
              console.error('Missing discordId or guild_id in zone:', zone);
            }
            return;
          }
        }

        // Wenn die Nachricht ein Array ist (was bei JSON.parse manchmal passieren kann),
        // versuche die Zone aus dem String zu extrahieren
        if (Array.isArray(parsedMessage)) {
          console.log('Parsed message is an array, trying to extract zone from string...');

          // Versuche, die Zone mit einem Regex zu extrahieren
          const zoneMatch = message.match(/\\{\"zoneRemoved\":(\\{.*\\})\\}/);
          if (zoneMatch && zoneMatch[1]) {
            try {
              const extractedZone = JSON.parse(zoneMatch[1]);
              console.log('Extracted zone:', extractedZone);

              if (extractedZone.discordId && extractedZone.guild_id) {
                console.log(`Deleting Discord voice channel with ID ${extractedZone.discordId} in guild ${extractedZone.guild_id}`);
                await this.discordUtils.deleteVoiceChannel(extractedZone.discordId, extractedZone.guild_id);
                console.log(`Discord voice channel ${extractedZone.discordId} deleted successfully`);
              } else {
                console.error('Missing discordId or guild_id in zone:', extractedZone);
              }
              return;
            } catch (extractError) {
              console.error('Error extracting zone from message:', extractError);
            }
          }

          // Versuche, die Nachricht als String zu behandeln und die Zone zu löschen
          const messageStr = message.toString();
          const zoneObj = JSON.parse(messageStr);
          if (zoneObj.zoneRemoved) {
            const zone = zoneObj.zoneRemoved;
            console.log('Zone from string message:', zone);

            if (zone.discordId && zone.guild_id) {
              console.log(`Deleting Discord voice channel with ID ${zone.discordId} in guild ${zone.guild_id}`);
              await this.discordUtils.deleteVoiceChannel(zone.discordId, zone.guild_id);
              console.log(`Discord voice channel ${zone.discordId} deleted successfully`);
            } else {
              console.error('Missing discordId or guild_id in zone:', zone);
            }
            return;
          }
        }

        console.error('Could not extract zone from message:', message);
      } catch (parseError) {
        console.error('Error parsing message:', parseError);
      }
    } catch (error) {
      console.error('Zone deletion error:', error);
    }
  }
}
