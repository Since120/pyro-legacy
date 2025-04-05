import { RedisPubSub } from '../client';
import { ALL_EVENTS } from '../events';

/**
 * Verwaltet die Subscriptions für das PubSub-System
 */
export class SubscriptionManager {
  private subscriptions: { [key: string]: { unsubscribe: () => void } } = {};
  private totalSubscriptions = 0;

  constructor(private pubSub: RedisPubSub) {}

  /**
   * Abonniert einen Kanal
   * @param channelName Der zu abonnierende Kanal
   * @param handler Die Handler-Funktion, die bei einer Nachricht aufgerufen wird
   */
  subscribeToChannel(channelName: string, handler: (message: string) => Promise<void>): void {
    try {
      const subscription = this.pubSub.subscribe(channelName, async (message: string) => {
        try {
          console.log(`Received message on ${channelName} channel: ${message}`);
          await handler(message);
        } catch (error) {
          console.error(`Error handling message from ${channelName}:`, error);
        }
      });
      
      this.subscriptions[channelName] = subscription;
      this.totalSubscriptions++;
      console.log(`Subscribed to ${channelName}. Total subscriptions: ${this.totalSubscriptions}`);
    } catch (error) {
      console.error(`Failed to subscribe to ${channelName}:`, error);
    }
  }

  /**
   * Abonniert alle Kanäle
   * @param handlers Ein Objekt mit Handler-Funktionen für jeden Kanal
   */
  subscribeToAllChannels(handlers: { [key: string]: (message: string) => Promise<void> }): void {
    console.log('Initializing Pub/Sub subscriptions for specific channels...');
    
    ALL_EVENTS.forEach(eventName => {
      if (handlers[eventName]) {
        this.subscribeToChannel(eventName, handlers[eventName]);
      } else {
        console.warn(`No handler found for event ${eventName}`);
      }
    });
  }

  /**
   * Kündigt alle Subscriptions
   */
  unsubscribeAll(): void {
    Object.values(this.subscriptions).forEach(subscription => {
      subscription.unsubscribe();
    });
    
    this.subscriptions = {};
    this.totalSubscriptions = 0;
    console.log('Unsubscribed from all channels');
  }
}
