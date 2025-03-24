// apps/server/src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

// Alternative Cookie-Extraktor-Funktion ohne direkte Cookie-Abhängigkeit
const cookieExtractor = (req: any): string | null => {
  // Cookies manuell aus dem Cookie-Header parsen
  if (req && req.headers && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';')
      .map(c => c.trim())
      .reduce((acc, curr) => {
        const [key, value] = curr.split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
    
    // Token aus den geparsten Cookies extrahieren
    return cookies['pyro_auth_token'] || null;
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      // Primär aus Cookie extrahieren
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        // Fallback: Auch Bearer-Token aus Authorization-Header akzeptieren
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Benutzer anhand der ID im Token suchen
    const user = await this.authService.findUserById(payload.sub);
    
    // Debug-Ausgabe
    if (user) {
      console.log(`JWT Strategy: Benutzer ${user.username} authentifiziert`);
    } else {
      console.log(`JWT Strategy: Ungültiger Benutzer in Token: ${payload.sub}`);
    }
    
    return user;
  }
}