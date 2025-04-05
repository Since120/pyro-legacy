import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';
import { RedisPubSubClient } from './core/pubsub-client';
import { CategoriesZonesPlugin } from './plugins/categories-zones';


dotenv.config({ path: './.env' });

// Lese die benötigten Variablen direkt aus process.env
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const BOT_URL = process.env.BOT_URL;
const BOT_PORT = process.env.BOT_PORT || '3001'; // Verwende einen zufälligen freien Port
const API_URL = process.env.API_URL || 'http://localhost:3333';
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID; // Guild-ID aus der .env-Datei

// Stelle sicher, dass die API_URL global verfügbar ist
process.env.API_URL = API_URL;

console.log('Using API URL:', API_URL);
console.log('Discord Guild ID from .env:', DISCORD_GUILD_ID || 'Not defined');

if (!DISCORD_TOKEN) {
	console.error('DISCORD_TOKEN is not defined in the environment variables.');
	throw new Error('DISCORD_TOKEN is not defined in the environment variables.');
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	],
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

// @ts-ignore
app.get('/', function(_req, res) {
	res.send('Bot is running!');
});



const server = app.listen(port, () => {
	const address = server.address();
	const actualPort = typeof address === 'string' ? address : address?.port;
	console.info(`HTTP server listening on port ${actualPort}`);
	// Setze die BOT_URL-Umgebungsvariable, damit der Server den Bot erreichen kann
	process.env.BOT_URL = `http://localhost:${actualPort}`;
	console.log(`Bot URL set to ${process.env.BOT_URL}`);
});



client.once('ready', async () => {
	// API-Endpunkte einrichten
	// @ts-ignore
	app.get('/api/guilds', (_req, res) => {
		try {
			const guilds = client.guilds.cache.map(guild => ({
				id: guild.id,
				name: guild.name,
				icon: guild.icon
			}));
			res.json(guilds);
		} catch (error) {
			console.error('Error fetching guilds:', error);
			res.status(500).json({ error: 'Failed to fetch guilds' });
		}
	});

	// @ts-ignore
	app.get('/api/guilds/:guildId', (req, res) => {
		try {
			const { guildId } = req.params;
			const guild = client.guilds.cache.get(guildId);

			if (!guild) {
				return res.status(404).json({ error: 'Guild not found' });
			}

			res.json({
				id: guild.id,
				name: guild.name,
				icon: guild.icon
			});
		} catch (error) {
			console.error('Error fetching guild:', error);
			res.status(500).json({ error: 'Failed to fetch guild' });
		}
	});

	// API-Endpunkt für die Rollen einer Guild
	// @ts-ignore
	app.get('/api/guilds/:guildId/roles', (req, res) => {
		try {
			const { guildId } = req.params;
			const guild = client.guilds.cache.get(guildId);

			if (!guild) {
				return res.status(404).json({ error: 'Guild not found' });
			}

			const roles = guild.roles.cache
				.filter(role => !role.managed && role.name !== '@everyone')
				.sort((a, b) => b.position - a.position)
				.map(role => ({
					id: role.id,
					name: role.name,
					color: role.hexColor,
					position: role.position
				}));

			res.json(roles);
		} catch (error) {
			console.error('Error fetching guild roles:', error);
			res.status(500).json({ error: 'Failed to fetch guild roles' });
		}
	});
	console.info(`Logged in as ${client.user?.tag}!`);
	console.info('Bot is online');

	try {
		// 1. Redis Pub/Sub initialisieren
		console.log('Initializing Redis Pub/Sub client...');
		const redisHost = process.env.REDIS_HOST;

		if (!redisHost) {
			throw new Error('REDIS_HOST is not defined in environment variables.');
		}

		// Verwende RedisPubSubClient statt RedisPubSub Interface für die Instanziierung
		const pubSubClient = new RedisPubSubClient();
		// Die Konfiguration wird jetzt im Konstruktor von RedisPubSubClient gehandhabt
		// basierend auf den Umgebungsvariablen.
		// Die Verbindung wird im Konstruktor von RedisPubSubClient hergestellt.
		console.log('Redis Pub/Sub client connected.');


		// Verfügbare Guilds anzeigen
		console.log('Available guilds:');
		client.guilds.cache.forEach(g => console.log(`- ${g.name} (${g.id})`));

		// Initialisiere das Categories & Zones Plugin
		console.log('Initializing Categories & Zones Plugin...');
		const categoriesZonesPlugin = new CategoriesZonesPlugin(client, pubSubClient);
		console.log('Categories & Zones Plugin initialized successfully.');

	} catch (error) {
		console.error('Error during post-login initialization:', error);
		process.exit(1);
	}
});

console.log('Attempting to log in to Discord...');
client.login(DISCORD_TOKEN)
	.then(() => {
		console.log('Discord login successful');
	})
	.catch((error) => {
		console.error('Error logging in to Discord:', error);
		process.exit(1);
	});
