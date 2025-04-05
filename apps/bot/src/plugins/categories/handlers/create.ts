import { Category } from '@pyro/types';
import { ChannelService } from '../../../services/discord/channel-service';
import { Client } from 'discord.js';

/**
 * Handler für das Erstellen von Kategorien
 */
export class CategoryCreateHandler {
  private channelService: ChannelService;

  constructor(private client: Client) {
    this.channelService = new ChannelService(client);
  }

  /**
   * Verarbeitet eine categoryCreated-Nachricht
   * @param message Die Nachricht
   */
  async handle(message: string): Promise<void> {
    try {
      console.log(`Processing categoryCreated event with message: ${message}`);
      
      // Extrahiere die Kategorie aus der Nachricht
      const category = this.extractCategory(message);
      
      if (!category) {
        console.error('No category found in message');
        return;
      }
      
      // Erstelle die Kategorie in Discord
      await this.channelService.createCategory(category);
    } catch (error) {
      console.error('Error handling categoryCreated event:', error);
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
          console.log('Re-parsed message:', reParsedMessage);
          
          if (reParsedMessage.categoryCreated) {
            const category = reParsedMessage.categoryCreated;
            console.log('Category from re-parsed message:', category);
            return category;
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
          return category;
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
            return extractedCategory;
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
