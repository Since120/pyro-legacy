"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const url_1 = require("url");
class WinstonLoggerWrapper {
    log(message, context) {
        const msg = context ? `[${context}] ${String(message)}` : String(message);
        console.info(msg);
    }
    error(message, trace, context) {
        const msg = context ? `[${context}] ${String(message)}` : String(message);
        console.error(msg, trace ? String(trace) : undefined);
    }
    warn(message, context) {
        const msg = context ? `[${context}] ${String(message)}` : String(message);
        console.warn(msg);
    }
    debug(message, context) {
        if (console.debug) {
            const msg = context ? `[${context}] ${String(message)}` : String(message);
            console.debug(msg);
        }
    }
    verbose(message, context) {
        const msg = context ? `[${context}] ${String(message)}` : String(message);
        console.log(`[verbose] ${msg}`);
    }
}
async function bootstrap() {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
        throw new Error('API_URL is not defined in the environment variables.');
    }
    let port;
    try {
        const parsedUrl = new url_1.URL(apiUrl);
        if (!parsedUrl.port) {
            throw new Error(`No port specified in API_URL: ${apiUrl}`);
        }
        port = Number(parsedUrl.port);
        if (isNaN(port)) {
            throw new Error(`Invalid port in API_URL: ${apiUrl}`);
        }
    }
    catch (error) {
        console.error('Error parsing API_URL:', error);
        process.exit(1);
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: new WinstonLoggerWrapper(),
    });
    app.use((req, res, next) => {
        if (req.cookies)
            return next();
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
    console.log('Eigene Cookie-Parser-Middleware aktiviert');
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://192.168.1.227:3000',
            'http://192.168.1.227:3001',
            process.env.FRONTEND_URL,
        ].filter(Boolean),
        credentials: true,
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
//# sourceMappingURL=main.js.map