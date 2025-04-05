// apps/server/src/pubsub/pubsub.module.ts
import { Module, Global } from '@nestjs/common';
import { RedisPubSubService } from './redis-pubsub.service';

@Global()
@Module({
  providers: [RedisPubSubService],
  exports: [RedisPubSubService],
})
export class PubSubModule {}