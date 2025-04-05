import dotenv from 'dotenv';
import path from 'path';
import { GuildChannel } from 'discord.js';
import { validateEnvironment } from './config/environment';
import { createDiscordClient, initializeDiscordClient } from './config/discord-client';
import { RedisPubSub } from './core/pubsub/client';
import { createHttpServer, startHttpServer } from './core/http/server';
// import { registerRoutes } from './core/http/routes';
import { initializePlugins } from './plugins';
import { setupGlobalErrorHandlers } from './utils/error-handler';
import { ChannelService } from './services/discord/channel-service';

// Lade die Umgebungsvariablen
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env file from:', envPath);
dotenv.config({ path: envPath });

// Prüfe, ob der Discord-Token vorhanden ist
if (!process.env.DISCORD_TOKEN) {
  console.error('DISCORD_TOKEN is not defined in the environment variables. Please check your .env file.');
  // Wir setzen keinen Token manuell, da dies ein Sicherheitsrisiko darstellt
}
if (!process.env.DISCORD_GUILD_ID && process.env.GUILD_ID) {
  console.log('Setting DISCORD_GUILD_ID from GUILD_ID');
  process.env.DISCORD_GUILD_ID = process.env.GUILD_ID;
}

// Validiere die Umgebungsvariablen
validateEnvironment();

// Erstelle den Discord-Client
const client = createDiscordClient();

// Erstelle den Express-Server
const app = createHttpServer(client);

// Erstelle den PubSub-Client
const pubSubClient = new RedisPubSub();

// Initialisiere den Bot
async function initializeBot() {
  try {
    // Globale Error-Handler einrichten
    setupGlobalErrorHandlers();

    // Verbinde den PubSub-Client
    await pubSubClient.connect();

    // Melde den Discord-Client an
    await initializeDiscordClient(client);

    // API-Routen werden direkt in createHttpServer registriert

    // Starte den HTTP-Server und setze die BOT_URL-Umgebungsvariable
    const server = startHttpServer(app);

    // Stelle sicher, dass die BOT_URL-Umgebungsvariable korrekt gesetzt ist
    const address = server.address();
    const actualPort = typeof address === 'string' ? address : address?.port;
    process.env.BOT_URL = `http://localhost:${actualPort}`;
    console.log(`Bot URL set to ${process.env.BOT_URL}`);

    // Warte einen Moment, damit der Server vollständig gestartet ist
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Initialisiere die Plugins
    initializePlugins(client, pubSubClient);

    // Erstelle den Channel-Service für Channel-Updates
    const channelService = new ChannelService(client);

    // Füge Event-Listener für Channel-Updates hinzu
    client.on('channelUpdate', (oldChannel, newChannel) => {
      if (oldChannel.isDMBased() || newChannel.isDMBased()) return;
      channelService.handleChannelUpdate(oldChannel as GuildChannel, newChannel as GuildChannel);
    });

    console.log('Bot initialization completed');
  } catch (error) {
    console.error('Failed to initialize bot:', error);
    process.exit(1);
  }
}

// Starte den Bot
initializeBot();
