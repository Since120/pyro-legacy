export declare class RedisPubSubService {
    private pubSub;
    constructor();
    publish<T>(channel: string, payload: T): Promise<void>;
    asyncIterator<T>(channel: string): AsyncIterator<T>;
}
