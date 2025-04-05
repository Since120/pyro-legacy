import { Client } from 'discord.js';
import { RedisPubSub } from '../core/pubsub/client';
import { SubscriptionManager } from '../core/pubsub/handlers';

/**
 * Basis-Klasse für alle Plugins
 */
export abstract class BasePlugin {
  protected subscriptionManager: SubscriptionManager;

  constructor(
    protected client: Client,
    protected pubSub: RedisPubSub
  ) {
    this.subscriptionManager = new SubscriptionManager(pubSub);
  }

  /**
   * Initialisiert das Plugin
   */
  abstract initialize(): void;

  /**
   * Bereinigt das Plugin
   */
  cleanup(): void {
    // Kündige alle Subscriptions
    this.subscriptionManager.unsubscribeAll();
  }
}
