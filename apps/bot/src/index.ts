import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ path: './.env' });

// Lese die benötigten Variablen direkt aus process.env
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const BOT_URL = process.env.BOT_URL;

if (!DISCORD_TOKEN) {
	console.error('DISCORD_TOKEN is not defined in the environment variables.');
	throw new Error('DISCORD_TOKEN is not defined in the environment variables.');
}

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

const app = express();
let port = 3000;

if (BOT_URL) {
	try {
		const url = new URL(BOT_URL);
		port = parseInt(url.port, 10) || 3000;
	} catch {
		console.warn('BOT_URL is not correctly formatted. Using default port 3000.');
	}
} else {
	console.warn('BOT_URL is not defined. Using default port 3000.');
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
