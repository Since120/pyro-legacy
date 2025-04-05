export declare class ErrorHandlerService {
    private readonly logger;
    handleError(error: any, context?: string): string;
    logError(error: any, context?: string): void;
    private getErrorMessage;
    private getPrismaErrorMessage;
}
