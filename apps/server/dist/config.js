"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DASHBOARD_URL = exports.BOT_URL = void 0;
const path = require("path");
const dotenv = require("dotenv");
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('Config');
const isProduction = process.env.NODE_ENV === 'production';
const envFilePath = isProduction
    ? path.resolve(__dirname, '../.env')
    : path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envFilePath });
logger.log(`Environment variables loaded from: ${envFilePath}`);
exports.BOT_URL = process.env.BOT_URL || 'http://localhost:3001';
exports.DASHBOARD_URL = process.env.DASHBOARD_URL || 'http://localhost:3000';
//# sourceMappingURL=config.js.map