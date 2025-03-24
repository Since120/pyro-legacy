import './config'; // Lädt die Umgebungsvariablen (z.B. API_URL)
import { NestFactory } from '@nestjs/core';
import { LoggerService } from '@nestjs/common';
import { AppModule } from './app.module';
import { URL } from 'url';

// Erstelle einen Wrapper, der das NestJS LoggerService-Interface erfüllt:
class WinstonLoggerWrapper implements LoggerService {
  log(message: any, context?: string): void {
    const msg = context ? `[${context}] ${String(message)}` : String(message);
    console.info(msg);
  }
  error(message: any, trace?: string, context?: string): void {
    const msg = context ? `[${context}] ${String(message)}` : String(message);
    console.error(msg, trace ? String(trace) : undefined);
  }
  warn(message: any, context?: string): void {
    const msg = context ? `[${context}] ${String(message)}` : String(message);
    console.warn(msg);
  }
  debug(message: any, context?: string): void {
    if (console.debug) {
      const msg = context ? `[${context}] ${String(message)}` : String(message);
      console.debug(msg);
    }
  }
  verbose(message: any, context?: string): void {
    const msg = context ? `[${context}] ${String(message)}` : String(message);
    console.log(`[verbose] ${msg}`);
  }
}

async function bootstrap(): Promise<void> {
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
    console.error('Error parsing API_URL:', error);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLoggerWrapper(),
  });

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
  console.info(`API is running on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
