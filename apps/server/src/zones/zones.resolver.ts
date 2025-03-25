import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { ZonesService } from './zones.service';
import { Zone } from './entities/zone.entity';
import { CreateZoneInput } from './dto/create-zone.input';
import { UpdateZoneInput } from './dto/update-zone.input';
import { ZoneArgs, ZonesByGuildArgs, ZonesByCategoryArgs } from './dto/zone.args';
import { RedisPubSubService } from '../pubsub/redis-pubsub.service';

@Resolver(() => Zone)
export class ZonesResolver {
  constructor(
    private readonly zonesService: ZonesService,
    private readonly pubSubService: RedisPubSubService,
  ) {}

  @Mutation(() => Zone)
  async createZone(@Args('createZoneInput') createZoneInput: CreateZoneInput): Promise<Zone> {
    const zone = await this.zonesService.create(createZoneInput);
    await this.pubSubService.publish('zoneCreated', { zoneCreated: zone });
    return zone;
  }

  @Query(() => [Zone], { name: 'zones' })
  findAll(@Args() args: ZonesByGuildArgs): Promise<Zone[]> {
    return this.zonesService.findAll(args.guild_id);
  }

  @Query(() => Zone, { name: 'zone', nullable: true })
  findOne(@Args() args: ZoneArgs): Promise<Zone | null> {
    return this.zonesService.findOne(args.id);
  }

  @Query(() => [Zone], { name: 'zonesByCategory' })
  findByCategory(@Args() args: ZonesByCategoryArgs): Promise<Zone[]> {
    return this.zonesService.findByCategory(args.categoryId);
  }

  @Mutation(() => Zone)
  async updateZone(@Args('updateZoneInput') updateZoneInput: UpdateZoneInput): Promise<Zone> {
    const zone = await this.zonesService.update(updateZoneInput.id, updateZoneInput);
    await this.pubSubService.publish('zoneUpdated', { zoneUpdated: zone });
    return zone;
  }

  @Mutation(() => Zone)
  async removeZone(@Args() args: ZoneArgs): Promise<Zone> {
    const zone = await this.zonesService.remove(args.id);
    await this.pubSubService.publish('zoneRemoved', { zoneRemoved: zone });
    return zone;
  }

  @Subscription(() => Zone, { name: 'zoneCreated' })
  zoneCreated() {
    return this.pubSubService.asyncIterator('zoneCreated');
  }

  @Subscription(() => Zone, { name: 'zoneUpdated' })
  zoneUpdated() {
    return this.pubSubService.asyncIterator('zoneUpdated');
  }

  @Subscription(() => Zone, { name: 'zoneRemoved' })
  zoneRemoved() {
    return this.pubSubService.asyncIterator('zoneRemoved');
  }
}