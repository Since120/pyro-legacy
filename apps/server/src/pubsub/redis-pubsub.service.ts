import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
  private pubSub: RedisPubSub;

  constructor() {
    // Redis-Verbindungsoptionen
    const options = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times: number) => {
        // Wiederverbindungsstrategie
        return Math.min(times * 50, 2000);
      },
      // TLS-Konfiguration
      tls: process.env.REDIS_TLS === 'true' ? {
        // Im Produktionsumfeld sollten diese Pfade angepasst werden
        ca: process.env.REDIS_TLS_CA ? Buffer.from(process.env.REDIS_TLS_CA, 'base64').toString() : undefined,
        rejectUnauthorized: process.env.REDIS_REJECT_UNAUTHORIZED !== 'false',
      } : undefined,
    };

    // Erstelle Publisher- und Subscriber-Clients
    const publisher = new Redis(options);
    const subscriber = new Redis(options);

    // Initialisiere den RedisPubSub
    this.pubSub = new RedisPubSub({
      publisher,
      subscriber,
    });
  }

  // Service-Initialisierung
  async onModuleInit() {
    console.log('Redis PubSub Service initialized');
  }

  // Cleanup beim Herunterfahren
  async onModuleDestroy() {
    await this.pubSub.close();
    console.log('Redis PubSub Service closed');
  }

  // Getter für den PubSub-Instanz
  getPubSub(): RedisPubSub {
    return this.pubSub;
  }

  // Hilfsmethode zum Veröffentlichen von Events
  async publish(trigger: string, payload: any): Promise<void> {
    await this.pubSub.publish(trigger, payload);
  }

  // Hilfsmethode zum Abonnieren von Events
  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T> {
    return this.pubSub.asyncIterator<T>(triggers);
  }
}