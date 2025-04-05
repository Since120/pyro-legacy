/**
 * Umgebungsvariablen und Konfiguration für den Bot
 */

// Lese die benötigten Variablen direkt aus process.env
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const BOT_URL = process.env.BOT_URL;
export const BOT_PORT = process.env.BOT_PORT || '3001';
export const API_URL = process.env.API_URL || 'http://localhost:3333';
export const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

// Stelle sicher, dass die API_URL global verfügbar ist
process.env.API_URL = API_URL;

// Validiere die Umgebungsvariablen
export function validateEnvironment(): void {
  console.log('Using API URL:', API_URL);
  console.log('Discord Guild ID from .env:', DISCORD_GUILD_ID || 'Not defined');
  console.log('Environment variables:', process.env);

  if (!process.env.DISCORD_TOKEN) {
    console.error('DISCORD_TOKEN is not defined in the environment variables.');
    throw new Error('DISCORD_TOKEN is not defined in the environment variables.');
  }
}

// Bestimme den Port für den HTTP-Server
export function determinePort(): number {
  let port = parseInt(BOT_PORT, 10);

  if (BOT_URL) {
    try {
      const url = new URL(BOT_URL);
      port = parseInt(url.port, 10) || port;
    } catch {
      console.warn(`BOT_URL is not correctly formatted. Using default port ${port}.`);
    }
  } else {
    console.warn(`BOT_URL is not defined. Using default port ${port}.`);
  }

  return port;
}
