import { Client } from 'discord.js';
import { RedisPubSub } from '../core/pubsub/client';
import { CategoriesPlugin } from './categories';
import { ZonesPlugin } from './zones';

/**
 * Initialisiert alle Plugins
 * @param client Der Discord-Client
 * @param pubSub Der PubSub-Client
 * @returns Die initialisierten Plugins
 */
export function initializePlugins(client: Client, pubSub: RedisPubSub): any[] {
  console.log('Initializing plugins...');
  
  // Erstelle die Plugins
  const categoriesPlugin = new CategoriesPlugin(client, pubSub);
  const zonesPlugin = new ZonesPlugin(client, pubSub);
  
  // Initialisiere die Plugins
  categoriesPlugin.initialize();
  zonesPlugin.initialize();
  
  console.log('All plugins initialized successfully');
  
  // Gib die Plugins zurück, damit sie später bereinigt werden können
  return [categoriesPlugin, zonesPlugin];
}
