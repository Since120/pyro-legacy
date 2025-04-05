import { Client } from 'discord.js';
import { RedisPubSub } from '../../core/pubsub/client';
import { BasePlugin } from '../base-plugin';
import { ZONE_EVENTS } from '../../core/pubsub/events';
import { ZoneCreateHandler, ZoneUpdateHandler, ZoneDeleteHandler } from './handlers';

/**
 * Plugin für die Verwaltung von Zonen
 */
export class ZonesPlugin extends BasePlugin {
  private createHandler: ZoneCreateHandler;
  private updateHandler: ZoneUpdateHandler;
  private deleteHandler: ZoneDeleteHandler;

  constructor(client: Client, pubSub: RedisPubSub) {
    super(client, pubSub);
    
    // Initialisiere die Handler
    this.createHandler = new ZoneCreateHandler(client);
    this.updateHandler = new ZoneUpdateHandler(client);
    this.deleteHandler = new ZoneDeleteHandler(client);
  }

  /**
   * Initialisiert das Plugin
   */
  initialize(): void {
    console.log('Initializing Zones Plugin...');
    
    // Abonniere die Zonen-Events
    this.subscriptionManager.subscribeToChannel(
      ZONE_EVENTS.CREATED,
      this.createHandler.handle.bind(this.createHandler)
    );
    
    this.subscriptionManager.subscribeToChannel(
      ZONE_EVENTS.UPDATED,
      this.updateHandler.handle.bind(this.updateHandler)
    );
    
    this.subscriptionManager.subscribeToChannel(
      ZONE_EVENTS.REMOVED,
      this.deleteHandler.handle.bind(this.deleteHandler)
    );
    
    console.log('Zones Plugin initialized successfully');
  }
}
