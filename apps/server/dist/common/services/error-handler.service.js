"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ErrorHandlerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandlerService = void 0;
const common_1 = require("@nestjs/common");
let ErrorHandlerService = ErrorHandlerService_1 = class ErrorHandlerService {
    constructor() {
        this.logger = new common_1.Logger(ErrorHandlerService_1.name);
    }
    handleError(error, context) {
        this.logError(error, context);
        return this.getErrorMessage(error);
    }
    logError(error, context) {
        const errorMessage = this.getErrorMessage(error);
        const errorStack = error.stack || 'No stack trace available';
        const contextMessage = context ? `[${context}] ` : '';
        this.logger.error(`${contextMessage}${errorMessage}`);
        this.logger.debug(errorStack);
    }
    getErrorMessage(error) {
        if (error.code && error.code.startsWith('P')) {
            return this.getPrismaErrorMessage(error);
        }
        return error.message || 'Ein unbekannter Fehler ist aufgetreten';
    }
    getPrismaErrorMessage(error) {
        switch (error.code) {
            case 'P2002':
                return `Ein Eintrag mit diesem Wert existiert bereits: ${error.meta?.target?.join(', ')}`;
            case 'P2025':
                return 'Der angeforderte Datensatz wurde nicht gefunden';
            default:
                return `Datenbankfehler: ${error.message}`;
        }
    }
};
exports.ErrorHandlerService = ErrorHandlerService;
exports.ErrorHandlerService = ErrorHandlerService = ErrorHandlerService_1 = __decorate([
    (0, common_1.Injectable)()
], ErrorHandlerService);
//# sourceMappingURL=error-handler.service.js.map