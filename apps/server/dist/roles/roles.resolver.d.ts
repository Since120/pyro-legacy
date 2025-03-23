import { RolesService } from './roles.service';
import { DiscordRole } from './entities/discord-role.entity';
import { RoleArgs, RolesByGuildArgs } from './dto/roles.args';
import { RedisPubSubService } from '../pubsub/redis-pubsub.service';
export declare class RolesResolver {
    private readonly rolesService;
    private readonly pubSubService;
    constructor(rolesService: RolesService, pubSubService: RedisPubSubService);
    findAll(args: RolesByGuildArgs): Promise<DiscordRole[]>;
    findOne(args: RoleArgs, guild_id: string): Promise<DiscordRole | null>;
    roleCreated(): AsyncIterator<unknown, any, any>;
    roleUpdated(): AsyncIterator<unknown, any, any>;
    roleDeleted(): AsyncIterator<unknown, any, any>;
}
