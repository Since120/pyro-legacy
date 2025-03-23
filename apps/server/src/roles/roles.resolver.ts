// apps/server/src/roles/roles.resolver.ts
import { Resolver, Query, Args, Subscription } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { DiscordRole } from './entities/discord-role.entity';
import { RoleArgs, RolesByGuildArgs } from './dto/roles.args';
import { RedisPubSubService } from '../pubsub/redis-pubsub.service';

@Resolver(() => DiscordRole)
export class RolesResolver {
  constructor(
    private readonly rolesService: RolesService,
    private readonly pubSubService: RedisPubSubService,
  ) {}

  @Query(() => [DiscordRole], { name: 'roles' })
  findAll(@Args() args: RolesByGuildArgs): Promise<DiscordRole[]> {
    return this.rolesService.findAllByGuild(args.guild_id);
  }

  @Query(() => DiscordRole, { name: 'role', nullable: true })
  findOne(
    @Args() args: RoleArgs,
    @Args('guild_id') guild_id: string,
  ): Promise<DiscordRole | null> {
    return this.rolesService.findOne(guild_id, args.id);
  }

  // Subscriptions for role updates (assuming the Discord bot will publish these events)
  @Subscription(() => DiscordRole, { name: 'roleCreated', nullable: true })
  roleCreated() {
    return this.pubSubService.asyncIterator('roleCreated');
  }

  @Subscription(() => DiscordRole, { name: 'roleUpdated', nullable: true })
  roleUpdated() {
    return this.pubSubService.asyncIterator('roleUpdated');
  }

  @Subscription(() => DiscordRole, { name: 'roleDeleted', nullable: true })
  roleDeleted() {
    return this.pubSubService.asyncIterator('roleDeleted');
  }
}