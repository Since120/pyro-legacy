import { ZonesService } from './zones.service';
import { Zone } from './entities/zone.entity';
import { CreateZoneInput } from './dto/create-zone.input';
import { UpdateZoneInput } from './dto/update-zone.input';
import { ZoneArgs, ZonesByGuildArgs, ZonesByCategoryArgs } from './dto/zone.args';
import { RedisPubSubService } from '../pubsub/redis-pubsub.service';
export declare class ZonesResolver {
    private readonly zonesService;
    private readonly pubSubService;
    constructor(zonesService: ZonesService, pubSubService: RedisPubSubService);
    createZone(createZoneInput: CreateZoneInput): Promise<Zone>;
    findAll(args: ZonesByGuildArgs): Promise<Zone[]>;
    findOne(args: ZoneArgs): Promise<Zone | null>;
    findByCategory(args: ZonesByCategoryArgs): Promise<Zone[]>;
    updateZone(updateZoneInput: UpdateZoneInput): Promise<Zone>;
    removeZone(args: ZoneArgs): Promise<Zone>;
    zoneCreated(): AsyncIterator<unknown, any, any>;
    zoneUpdated(): AsyncIterator<unknown, any, any>;
    zoneRemoved(): AsyncIterator<unknown, any, any>;
}
