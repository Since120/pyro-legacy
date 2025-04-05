import { Category } from '@pyro/types';
import { ChannelService } from '../../../services/discord/channel-service';
import { Client } from 'discord.js';

/**
 * Handler für das Löschen von Kategorien
 */
export class CategoryDeleteHandler {
  private channelService: ChannelService;

  constructor(private client: Client) {
    this.channelService = new ChannelService(client);
  }

  /**
   * Verarbeitet eine categoryRemoved-Nachricht
   * @param message Die Nachricht
   */
  async handle(message: string): Promise<void> {
    try {
      console.log(`Processing categoryRemoved event with message: ${message}`);
      
      // Extrahiere die Kategorie aus der Nachricht
      const category = this.extractCategory(message);
      
      if (!category) {
        console.error('No category found in message');
        return;
      }
      
      // Lösche die Kategorie in Discord
      if (category.discordCategoryId && category.guild_id) {
        console.log(`Deleting Discord category with ID ${category.discordCategoryId} in guild ${category.guild_id}`);
        await this.channelService.deleteCategory(category.discordCategoryId, category.guild_id);
        console.log(`Discord category ${category.discordCategoryId} deleted successfully`);
      } else {
        console.error('Missing discordCategoryId or guild_id in category:', category);
      }
    } catch (error) {
      console.error('Error handling categoryRemoved event:', error);
    }
  }

  /**
   * Extrahiert die Kategorie aus der Nachricht
   * @param message Die Nachricht
   * @returns Die extrahierte Kategorie oder null, wenn keine gefunden wurde
   */
  private extractCategory(message: string): Category | null {
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
            return category;
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
          return category;
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
            return extractedCategory;
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
          return category;
        }
      }
      
      console.error('Could not extract category from message:', message);
      return null;
    } catch (parseError) {
      console.error('Error parsing message:', parseError);
      return null;
    }
  }
}
