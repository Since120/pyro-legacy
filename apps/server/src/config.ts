// apps/server/src/config.ts
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

const logger = new Logger('Config');
const isProduction = process.env.NODE_ENV === 'production';

const envFilePath = isProduction
  ? path.resolve(__dirname, '../.env') // Produktion: apps/api/.env
  : path.resolve(__dirname, '../../../.env'); // Monorepo-Root .env

dotenv.config({ path: envFilePath });
logger.log(`Environment variables loaded from: ${envFilePath}`);

// Falls du in der Root-.env z. B. BOT_URL=http://localhost:3001 hast:
export const BOT_URL = process.env.BOT_URL || 'http://localhost:3001';
export const DASHBOARD_URL =
  process.env.DASHBOARD_URL || 'http://localhost:3000';