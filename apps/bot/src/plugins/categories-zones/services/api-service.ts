import { Client } from 'discord.js';
import express from 'express';

/**
 * Service für die API-Endpunkte
 */
export class ApiService {
  constructor(
    private client: Client,
    private app: express.Application
  ) {
    console.log('Initializing API Service...');
    this.setupApiEndpoints();
    console.log('API Service initialized successfully');
  }

  /**
   * Richtet die API-Endpunkte ein
   */
  private setupApiEndpoints(): void {
    // API-Endpunkt für alle Guilds
    this.app.get('/api/guilds', (req, res) => {
      try {
        const guilds = this.client.guilds.cache.map(guild => ({
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

    // API-Endpunkt für eine bestimmte Guild
    this.app.get('/api/guilds/:guildId', (req, res) => {
      try {
        const { guildId } = req.params;
        const guild = this.client.guilds.cache.get(guildId);

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
    this.app.get('/api/guilds/:guildId/roles', (req, res) => {
      try {
        const { guildId } = req.params;
        const guild = this.client.guilds.cache.get(guildId);

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

    console.log('API endpoints set up successfully');
  }
}
