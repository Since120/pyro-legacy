import Redis, { RedisOptions } from 'ioredis';

export interface RedisPubSub {
  subscribe: (channel: string, callback: (message: string) => void) => void;
  publish: (channel: string, message: string) => Promise<number>;
}

export class RedisPubSubClient implements RedisPubSub {
  private publisher: Redis;
  private subscriber: Redis;

  constructor() {
    const redisOptions: RedisOptions = {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times: number) => Math.min(times * 100, 5000)
    };

    if (process.env.REDIS_TLS === 'true') {
      redisOptions.tls = {
        rejectUnauthorized: process.env.REDIS_REJECT_UNAUTHORIZED !== 'false' // Default to true if REDIS_TLS is true
      };
      // Optional: Add CA cert if provided
      // if (process.env.REDIS_TLS_CA) {
      //   redisOptions.tls.ca = Buffer.from(process.env.REDIS_TLS_CA, 'base64').toString('ascii');
      // }
    }

    this.publisher = new Redis(redisOptions);
    this.subscriber = new Redis(redisOptions);
  }

  subscribe(channel: string, callback: (message: string) => void) {
    this.subscriber.subscribe(channel, (err, count) => {
      if (err) {
        console.error(`Failed to subscribe to ${channel}:`, err);
      } else {
        console.log(`Subscribed to ${channel}. Total subscriptions: ${count}`);
      }
    });
    
    this.subscriber.on('message', (chnl: string, message: string) => {
      try {
        const parsed = JSON.parse(message);
        if (chnl === channel) {
          callback(JSON.stringify(parsed));
        }
      } catch (error) {
        console.error(`Failed to parse message from ${chnl}:`, message, error);
      }
    });
  }

  async publish(channel: string, message: string) {
    try {
      const parsed = JSON.parse(message);
      return this.publisher.publish(channel, JSON.stringify(parsed));
    } catch (error) {
      console.error(`Failed to publish to ${channel}:`, message, error);
      throw error;
    }
  }
}