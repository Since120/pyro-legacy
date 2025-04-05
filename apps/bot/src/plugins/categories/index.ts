import { Client } from 'discord.js';
import { RedisPubSub } from '../../core/pubsub/client';
import { BasePlugin } from '../base-plugin';
import { CATEGORY_EVENTS } from '../../core/pubsub/events';
import { CategoryCreateHandler, CategoryUpdateHandler, CategoryDeleteHandler } from './handlers';

/**
 * Plugin für die Verwaltung von Kategorien
 */
export class CategoriesPlugin extends BasePlugin {
  private createHandler: CategoryCreateHandler;
  private updateHandler: CategoryUpdateHandler;
  private deleteHandler: CategoryDeleteHandler;

  constructor(client: Client, pubSub: RedisPubSub) {
    super(client, pubSub);
    
    // Initialisiere die Handler
    this.createHandler = new CategoryCreateHandler(client);
    this.updateHandler = new CategoryUpdateHandler(client);
    this.deleteHandler = new CategoryDeleteHandler(client);
  }

  /**
   * Initialisiert das Plugin
   */
  initialize(): void {
    console.log('Initializing Categories Plugin...');
    
    // Abonniere die Kategorie-Events
    this.subscriptionManager.subscribeToChannel(
      CATEGORY_EVENTS.CREATED,
      this.createHandler.handle.bind(this.createHandler)
    );
    
    this.subscriptionManager.subscribeToChannel(
      CATEGORY_EVENTS.UPDATED,
      this.updateHandler.handle.bind(this.updateHandler)
    );
    
    this.subscriptionManager.subscribeToChannel(
      CATEGORY_EVENTS.REMOVED,
      this.deleteHandler.handle.bind(this.deleteHandler)
    );
    
    console.log('Categories Plugin initialized successfully');
  }
}
