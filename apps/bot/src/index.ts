import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ path: './.env' });

// Lese die benötigten Variablen direkt aus process.env
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const BOT_URL = process.env.BOT_URL;
const BOT_PORT = process.env.BOT_PORT || '3001'; // Standard-Port auf 3001 ändern

if (!DISCORD_TOKEN) {
	console.error('DISCORD_TOKEN is not defined in the environment variables.');
	throw new Error('DISCORD_TOKEN is not defined in the environment variables.');
}

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

const app = express();
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

app.get('/', (req, res) => {
	res.send('Bot is running!');
});

app.listen(port, () => {
	console.info(`HTTP server listening on port ${port}`);
});

client.once('ready', () => {
	console.info('Bot is online');
});

client.login(DISCORD_TOKEN).catch((error) => {
	console.error('Error logging in:', error);
	process.exit(1);
});
