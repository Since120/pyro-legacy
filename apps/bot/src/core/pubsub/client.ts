import Redis from 'ioredis';

/**
 * Redis PubSub Client für die Kommunikation mit dem Server
 */
export class RedisPubSub {
  private redis: Redis;
  private subscriber: Redis;
  private subscriptions: Map<string, (message: string) => void> = new Map();

  constructor() {
    // Erstelle Redis-Clients für Publisher und Subscriber
    this.redis = new Redis();
    this.subscriber = new Redis();

    // Konfiguriere den Subscriber
    this.subscriber.on('message', (channel: string, message: string) => {
      const callback = this.subscriptions.get(channel);
      if (callback) {
        callback(message);
      }
    });

    console.log('Initializing Redis Pub/Sub client...');
  }

  /**
   * Verbindet den Redis-Client
   */
  async connect(): Promise<void> {
    try {
      // Warte auf die Verbindung
      await Promise.all([
        new Promise<void>((resolve) => {
          this.redis.on('connect', () => {
            resolve();
          });
        }),
        new Promise<void>((resolve) => {
          this.subscriber.on('connect', () => {
            resolve();
          });
        }),
      ]);

      console.log('Redis Pub/Sub client connected.');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  /**
   * Abonniert einen Kanal
   * @param channel Der zu abonnierende Kanal
   * @param callback Die Callback-Funktion, die bei einer Nachricht aufgerufen wird
   * @returns Ein Subscription-Objekt
   */
  subscribe(channel: string, callback: (message: string) => void): { unsubscribe: () => void } {
    this.subscriptions.set(channel, callback);
    this.subscriber.subscribe(channel);

    return {
      unsubscribe: () => {
        this.subscriber.unsubscribe(channel);
        this.subscriptions.delete(channel);
      },
    };
  }

  /**
   * Veröffentlicht eine Nachricht auf einem Kanal
   * @param channel Der Kanal, auf dem die Nachricht veröffentlicht werden soll
   * @param message Die zu veröffentlichende Nachricht
   */
  publish(channel: string, message: string): void {
    this.redis.publish(channel, message);
  }

  /**
   * Schließt die Redis-Verbindungen
   */
  disconnect(): void {
    this.redis.disconnect();
    this.subscriber.disconnect();
  }
}
