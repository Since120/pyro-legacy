"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
require("./config/config");
// Erstelle den Axios-Client mit Basis-URL (aus .env oder Default)
const apiClient = axios_1.default.create({
    baseURL: process.env.API_URL || 'http://localhost:3002', // API_URL aus .env; passe ggf. an
    timeout: 10000, // 10 Sekunden Timeout
    headers: {
        'Content-Type': 'application/json',
    },
});
// Optional: Füge einen Response-Interceptor hinzu
apiClient.interceptors.response.use((response) => response, (error) => {
    console.error('API-Fehler:', error);
    return Promise.reject(error);
});
exports.default = apiClient;
