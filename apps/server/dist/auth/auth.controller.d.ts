import { Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    discordAuth(): Promise<void>;
    discordAuthCallback(req: any, res: Response): Promise<void>;
    getProfile(req: any): any;
    logout(res: Response): void;
    checkAuth(req: any): {
        authenticated: boolean;
        user: any;
    };
}
