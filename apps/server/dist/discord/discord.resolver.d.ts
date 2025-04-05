import { DiscordService } from './discord.service';
import { DiscordGuild } from './entities/discord-guild.entity';
import { User } from '../auth/entities/user.entity';
export declare class DiscordResolver {
    private readonly discordService;
    constructor(discordService: DiscordService);
    availableGuilds(user: User): Promise<DiscordGuild[]>;
    guildById(id: string): Promise<DiscordGuild | null>;
}
