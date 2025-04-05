import { Zone } from '@pyro/types';

// Erweiterte Zone-Schnittstelle mit den benötigten Feldern
interface ExtendedZone extends Zone {
  discordId?: string | null;
  allowedRoles?: string[];
}
import { ChannelService } from '../../../services/discord/channel-service';
import { Client } from 'discord.js';

/**
 * Handler für das Erstellen von Zonen
 */
export class ZoneCreateHandler {
  private channelService: ChannelService;

  constructor(private client: Client) {
    this.channelService = new ChannelService(client);
  }

  /**
   * Verarbeitet eine zoneCreated-Nachricht
   * @param message Die Nachricht
   */
  async handle(message: string): Promise<void> {
    try {
      console.log(`Processing zoneCreated event with message: ${message}`);

      // Extrahiere die Zone aus der Nachricht
      const zone = this.extractZone(message) as ExtendedZone;

      if (!zone) {
        console.error('No zone found in message');
        return;
      }

      // Erstelle die Zone in Discord
      await this.channelService.createVoiceChannel(zone);
    } catch (error) {
      console.error('Error handling zoneCreated event:', error);
    }
  }

  /**
   * Extrahiert die Zone aus der Nachricht
   * @param message Die Nachricht
   * @returns Die extrahierte Zone oder null, wenn keine gefunden wurde
   */
  private extractZone(message: string): ExtendedZone | null {
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
            return zone;
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
          return zone;
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
            return extractedZone;
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
          return zone;
        }
      }

      console.error('Could not extract zone from message:', message);
      return null;
    } catch (parseError) {
      console.error('Error parsing message:', parseError);
      return null;
    }
  }
}
