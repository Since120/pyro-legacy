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
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
const ioredis_1 = require("ioredis");
let RedisPubSubService = class RedisPubSubService {
    constructor() {
        const options = {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
            retryStrategy: (times) => {
                return Math.min(times * 50, 2000);
            },
            tls: process.env.REDIS_TLS === 'true' ? {
                ca: process.env.REDIS_TLS_CA ? Buffer.from(process.env.REDIS_TLS_CA, 'base64').toString() : undefined,
                rejectUnauthorized: process.env.REDIS_REJECT_UNAUTHORIZED !== 'false',
            } : undefined,
        };
        const publisher = new ioredis_1.default(options);
        const subscriber = new ioredis_1.default(options);
        this.pubSub = new graphql_redis_subscriptions_1.RedisPubSub({
            publisher,
            subscriber,
        });
    }
    async onModuleInit() {
        console.log('Redis PubSub Service initialized');
    }
    async onModuleDestroy() {
        await this.pubSub.close();
        console.log('Redis PubSub Service closed');
    }
    getPubSub() {
        return this.pubSub;
    }
    async publish(trigger, payload) {
        await this.pubSub.publish(trigger, payload);
    }
    asyncIterator(triggers) {
        return this.pubSub.asyncIterator(triggers);
    }
};
exports.RedisPubSubService = RedisPubSubService;
exports.RedisPubSubService = RedisPubSubService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RedisPubSubService);
//# sourceMappingURL=redis-pubsub.service.js.map