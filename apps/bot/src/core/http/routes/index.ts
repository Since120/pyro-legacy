import { Application } from 'express';
import { Client } from 'discord.js';

/**
 * Registriert alle API-Routen
 * @param app Die Express-Anwendung
 * @param client Der Discord-Client
 */
export function registerRoutes(app: Application, client: Client): void {
  // Endpunkt für alle Guilds
  app.get('/api/guilds', function(req, res) {
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
  app.get('/api/guilds/:guildId', function(req, res) {
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
  app.get('/api/guilds/:guildId/roles', function(req, res) {
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
