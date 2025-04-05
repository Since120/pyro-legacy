"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisPubSubService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
let RedisPubSubService = class RedisPubSubService {
    constructor() {
        if (!process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.REDIS_PASSWORD) {
            throw new Error('Redis configuration is missing required environment variables');
        }
        const redisOptions = {
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
                }
                catch (e) {
                    console.error('Failed to decode REDIS_TLS_CA from base64', e);
                }
            }
        }
        const publisher = new ioredis_1.default(redisOptions);
        const subscriber = new ioredis_1.default(redisOptions);
        publisher.on('error', (err) => console.error('Redis Publisher Error:', err));
        subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));
        this.pubSub = new graphql_redis_subscriptions_1.RedisPubSub({
            publisher,
            subscriber,
            reviver: (key, value) => {
                try {
                    return JSON.parse(value);
                }
                catch (e) {
                    console.error('Failed to parse Redis message:', value);
                    return value;
                }
            }
        });
    }
    async publish(channel, payload) {
        await this.pubSub.publish(channel, JSON.stringify(payload));
    }
    asyncIterator(channel) {
        return this.pubSub.asyncIterator(channel);
    }
};
exports.RedisPubSubService = RedisPubSubService;
exports.RedisPubSubService = RedisPubSubService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RedisPubSubService);
//# sourceMappingURL=redis-pubsub.service.js.map