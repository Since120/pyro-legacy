import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
export declare class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
    private pubSub;
    private readonly logger;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    getPubSub(): RedisPubSub;
    publish(trigger: string, payload: any): Promise<void>;
    asyncIterator<T>(triggers: string | string[]): AsyncIterator<T>;
}
