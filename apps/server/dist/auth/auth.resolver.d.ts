import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    me(context: any): any;
    isAuthenticated(context: any): boolean;
    validateToken(token: string): Promise<{
        user: User;
        accessToken: string;
    } | null> | null;
}
