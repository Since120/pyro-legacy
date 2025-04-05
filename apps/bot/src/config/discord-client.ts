import { Client, GatewayIntentBits } from 'discord.js';
import { DISCORD_TOKEN } from './environment';

/**
 * Konfiguriert und erstellt den Discord-Client
 */
export function createDiscordClient(): Client {
  // Erstelle einen neuen Discord-Client mit den benötigten Intents
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
    ],
  });

  return client;
}

/**
 * Initialisiert den Discord-Client und meldet ihn an
 */
export async function initializeDiscordClient(client: Client): Promise<void> {
  console.log('Attempting to log in to Discord...');

  try {
    await client.login(DISCORD_TOKEN);
    console.log('Discord login successful');
    console.log(`Logged in as ${client.user?.tag}!`);
    console.log('Bot is online');
  } catch (error) {
    console.error('Failed to log in to Discord:', error);
    throw error;
  }
}
