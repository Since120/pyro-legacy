import express from 'express';
import cors from 'cors';
import { Client } from 'discord.js';
import { determinePort } from '../../config/environment';

/**
 * Erstellt und konfiguriert den Express-Server
 * @param client Der Discord-Client
 */
export function createHttpServer(client?: Client): express.Application {
  const app = express();

  // Middleware
  app.use(cors({
    origin: '*', // Erlaube alle Ursprünge
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());

  // Basis-Route für Gesundheitschecks
  app.get('/health', (_req: any, res: any) => {
    res.status(200).json({ status: 'ok' });
  });

  // API-Routen für Discord-Guilds
  if (client) {
    // Endpunkt für alle Guilds
    app.get('/api/guilds', (_req: any, res: any) => {
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

    // Endpunkt für eine bestimmte Guild
    app.get('/api/guilds/:guildId', (req: any, res: any) => {
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

    // Endpunkt für die Rollen einer Guild
    app.get('/api/guilds/:guildId/roles', (req: any, res: any) => {
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

    console.log('API routes registered');
  }

  return app;
}

/**
 * Startet den HTTP-Server
 * @param app Die Express-Anwendung
 * @returns Der HTTP-Server
 */
export function startHttpServer(app: express.Application): any {
  const port = determinePort();

  const server = app.listen(port, () => {
    const address = server.address();
    const actualPort = typeof address === 'string' ? address : address?.port;
    console.info(`HTTP server listening on port ${actualPort}`);
  });

  return server;
}
