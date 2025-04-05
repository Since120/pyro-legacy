import { AuthService } from '../auth.service';
declare const DiscordStrategy_base: new (...args: any) => any;
export declare class DiscordStrategy extends DiscordStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<import("../entities/user.entity").User>;
}
export {};
