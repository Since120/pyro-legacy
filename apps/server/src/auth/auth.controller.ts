// apps/server/src/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
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
    
    // Weiterleitung zum Frontend mit Token
    res.redirect(`${DASHBOARD_URL}/auth/callback?token=${accessToken}`);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }
}