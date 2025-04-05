// apps/server/src/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { DASHBOARD_URL } from '../config';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth() {
    // Discord OAuth2 route - initiiert den Auth-Flow, wird von Passport.js verarbeitet
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthCallback(@Req() req, @Res() res: Response) {
    const { accessToken } = await this.authService.login(req.user);
    
    // Token als HttpOnly Cookie setzen (server-seitige Authentifizierung)
    res.cookie('pyro_auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
      path: '/',
      sameSite: 'lax'
    });
    
    // Weiterleitung zum Frontend Dashboard
    res.redirect(`${DASHBOARD_URL}/dashboard`);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }
  
  @Get('logout')
  logout(@Res() res: Response) {
    console.log('Auth Controller: Logout-Anfrage erhalten, lösche Cookie');
    
    // Cookie löschen
    res.clearCookie('pyro_auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    
    // Nur HTTP-Status 200 zurückgeben, keine Weiterleitung
    // Client entscheidet selbst über die Navigation
    res.status(200).json({ success: true, message: 'Logout successful' });
  }
  
  @Get('check')
  @UseGuards(AuthGuard('jwt'))
  checkAuth(@Req() req) {
    console.log('Auth Check: Benutzer authentifiziert', req.user?.username);
    // Einfache Route zum Prüfen, ob der Benutzer authentifiziert ist
    return { authenticated: true, user: req.user };
  }
}