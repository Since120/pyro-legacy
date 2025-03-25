import './config'; // Lädt die Umgebungsvariablen (z.B. API_URL)
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { URL } from 'url';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    throw new Error('API_URL is not defined in the environment variables.');
  }

  let port: number;
  try {
    const parsedUrl = new URL(apiUrl);
    if (!parsedUrl.port) {
      throw new Error(`No port specified in API_URL: ${apiUrl}`);
    }
    port = Number(parsedUrl.port);
    if (isNaN(port)) {
      throw new Error(`Invalid port in API_URL: ${apiUrl}`);
    }
  } catch (error) {
    logger.error(`Error parsing API_URL: ${error.message}`, error.stack);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);

  // Einfache Cookie-Parser Middleware implementieren
  app.use((req, res, next) => {
    // Wenn die Cookies bereits geparst wurden, nichts tun
    if (req.cookies) return next();
    
    // Cookies manuell parsen
    const cookieHeader = req.headers.cookie;
    req.cookies = {};
    
    if (cookieHeader) {
      cookieHeader.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        const key = parts[0].trim();
        if (key) {
          const value = parts.slice(1).join('=');
          req.cookies[key] = decodeURIComponent(value);
        }
      });
    }
    
    next();
  });
  
  logger.log('Eigene Cookie-Parser-Middleware aktiviert');
  
  // CORS-Konfiguration aktivieren
  app.enableCors({
    origin: [
      'http://localhost:3000',  // Frontend-Entwicklungsserver
      'http://localhost:3001',  // Alternative Frontend-Port
      'http://192.168.1.227:3000', // Frontend-Netzwerkzugriff
      'http://192.168.1.227:3001', // Alternative Frontend-Netzwerkzugriff
      process.env.FRONTEND_URL, // Produktions-Frontend-URL (falls vorhanden)
    ].filter(Boolean), // Entfernt undefined-Werte
    credentials: true, // Wichtig für Cookies und Authentifizierung
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  await app.listen(port);
  logger.log(`API is running on port ${port}`);
}

bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap');
  logger.error('Bootstrap failed:', err.stack);
  process.exit(1);
});