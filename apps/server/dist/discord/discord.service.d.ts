import { HttpService } from '@nestjs/axios';
import { DiscordGuild } from './entities/discord-guild.entity';
import { AuthService } from '../auth/auth.service';
export declare class DiscordService {
    private httpService;
    private authService;
    constructor(httpService: HttpService, authService: AuthService);
    getBotGuilds(): Promise<DiscordGuild[]>;
    getUserGuilds(userId: string): Promise<DiscordGuild[]>;
    getGuildById(guildId: string): Promise<DiscordGuild | null>;
}
