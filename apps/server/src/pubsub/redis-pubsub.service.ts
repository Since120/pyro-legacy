import { Injectable } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Injectable()
export class RedisPubSubService {
  private pubSub: RedisPubSub;

  constructor() {
    if (!process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.REDIS_PASSWORD) {
      throw new Error('Redis configuration is missing required environment variables');
    }

    const redisOptions: RedisOptions = {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      lazyConnect: true,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3
    };

    if (process.env.REDIS_TLS === 'true') {
      redisOptions.tls = {
        rejectUnauthorized: process.env.REDIS_REJECT_UNAUTHORIZED !== 'false'
      };
      if (process.env.REDIS_TLS_CA) {
        try {
          redisOptions.tls.ca = Buffer.from(process.env.REDIS_TLS_CA, 'base64').toString('ascii');
        } catch (e) {
          console.error('Failed to decode REDIS_TLS_CA from base64', e);
        }
      }
    }

    const publisher = new Redis(redisOptions);
    const subscriber = new Redis(redisOptions);

    publisher.on('error', (err) => console.error('Redis Publisher Error:', err));
    subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));

    this.pubSub = new RedisPubSub({
      publisher,
      subscriber,
      reviver: (key, value) => {
        try {
          return JSON.parse(value);
        } catch (e) {
          console.error('Failed to parse Redis message:', value);
          return value;
        }
      }
    });
  }

  async publish<T>(channel: string, payload: T): Promise<void> {
    await this.pubSub.publish(channel, JSON.stringify(payload));
  }

  asyncIterator<T>(channel: string): AsyncIterator<T> {
    return this.pubSub.asyncIterator(channel);
  }
}