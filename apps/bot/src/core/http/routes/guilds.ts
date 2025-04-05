import { Router } from 'express';
import { Client } from 'discord.js';

/**
 * Erstellt die Router für Guild-bezogene Endpunkte
 * @param client Der Discord-Client
 * @returns Der Express-Router
 */
export function createGuildsRouter(client: Client): Router {
  const router = Router();
  
  // Endpunkt für alle Guilds
  router.get('/', (req, res) => {
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
  router.get('/:guildId', (req, res) => {
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
  router.get('/:guildId/roles', (req, res) => {
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
  
  return router;
}
