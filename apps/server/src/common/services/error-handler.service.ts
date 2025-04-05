import { Injectable, Logger } from '@nestjs/common';

/**
 * Zentraler Fehlerbehandlungsdienst
 * Bietet einheitliche Methoden zur Fehlerbehandlung und -protokollierung
 */
@Injectable()
export class ErrorHandlerService {
  private readonly logger = new Logger(ErrorHandlerService.name);

  /**
   * Behandelt einen Fehler und gibt eine einheitliche Fehlermeldung zurück
   * @param error Der aufgetretene Fehler
   * @param context Zusätzlicher Kontext für die Fehlerprotokollierung
   * @returns Eine einheitliche Fehlermeldung
   */
  handleError(error: any, context?: string): string {
    // Protokolliere den Fehler mit Kontext
    this.logError(error, context);

    // Gib eine benutzerfreundliche Fehlermeldung zurück
    return this.getErrorMessage(error);
  }

  /**
   * Protokolliert einen Fehler
   * @param error Der aufgetretene Fehler
   * @param context Zusätzlicher Kontext für die Fehlerprotokollierung
   */
  logError(error: any, context?: string): void {
    const errorMessage = this.getErrorMessage(error);
    const errorStack = error.stack || 'No stack trace available';
    const contextMessage = context ? `[${context}] ` : '';

    this.logger.error(`${contextMessage}${errorMessage}`);
    this.logger.debug(errorStack);
  }

  /**
   * Extrahiert eine benutzerfreundliche Fehlermeldung aus einem Fehler
   * @param error Der aufgetretene Fehler
   * @returns Eine benutzerfreundliche Fehlermeldung
   */
  private getErrorMessage(error: any): string {
    // Prisma-Fehler
    if (error.code && error.code.startsWith('P')) {
      return this.getPrismaErrorMessage(error);
    }

    // Standard-Fehler
    return error.message || 'Ein unbekannter Fehler ist aufgetreten';
  }

  /**
   * Extrahiert eine benutzerfreundliche Fehlermeldung aus einem Prisma-Fehler
   * @param error Der aufgetretene Prisma-Fehler
   * @returns Eine benutzerfreundliche Fehlermeldung
   */
  private getPrismaErrorMessage(error: any): string {
    switch (error.code) {
      case 'P2002':
        return `Ein Eintrag mit diesem Wert existiert bereits: ${error.meta?.target?.join(', ')}`;
      case 'P2025':
        return 'Der angeforderte Datensatz wurde nicht gefunden';
      default:
        return `Datenbankfehler: ${error.message}`;
    }
  }
}
