import { Zone } from '@pyro/types';

// Erweiterte Zone-Schnittstelle mit den benötigten Feldern
interface ExtendedZone extends Zone {
  discordId?: string | null;
  allowedRoles?: string[];
}
import { ChannelService } from '../../../services/discord/channel-service';
import { Client } from 'discord.js';

/**
 * Handler für das Löschen von Zonen
 */
export class ZoneDeleteHandler {
  private channelService: ChannelService;

  constructor(private client: Client) {
    this.channelService = new ChannelService(client);
  }

  /**
   * Verarbeitet eine zoneRemoved-Nachricht
   * @param message Die Nachricht
   */
  async handle(message: string): Promise<void> {
    try {
      console.log(`Processing zoneRemoved event with message: ${message}`);

      // Extrahiere die Zone aus der Nachricht
      const zone = this.extractZone(message) as ExtendedZone;

      if (!zone) {
        console.error('No zone found in message');
        return;
      }

      // Lösche die Zone in Discord
      if (zone.discordId && zone.guild_id) {
        console.log(`Deleting Discord voice channel with ID ${zone.discordId} in guild ${zone.guild_id}`);
        await this.channelService.deleteVoiceChannel(zone.discordId, zone.guild_id);
        console.log(`Discord voice channel ${zone.discordId} deleted successfully`);
      } else {
        console.error('Missing discordId or guild_id in zone:', zone);
      }
    } catch (error) {
      console.error('Error handling zoneRemoved event:', error);
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

          if (reParsedMessage.zoneRemoved) {
            const zone = reParsedMessage.zoneRemoved;
            console.log('Zone from re-parsed message:', zone);
            return zone;
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
          return zone;
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
            return extractedZone;
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
