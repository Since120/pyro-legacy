import { DiscordRole } from './entities/discord-role.entity';
import { HttpService } from '@nestjs/axios';
export declare class RolesService {
    private httpService;
    constructor(httpService: HttpService);
    findAllByGuild(guild_id: string): Promise<DiscordRole[]>;
    findOne(guild_id: string, role_id: string): Promise<DiscordRole | null>;
    private getMockRoles;
}
