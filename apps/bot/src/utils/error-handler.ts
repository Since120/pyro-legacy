import { error } from './logger';

/**
 * Globaler Error-Handler für den Bot
 */
export function setupGlobalErrorHandlers(): void {
  // Unhandled Promise Rejections
  process.on('unhandledRejection', (reason, promise) => {
    error(`Unhandled Promise Rejection: ${reason}`);
    console.error('Promise:', promise);
  });
  
  // Uncaught Exceptions
  process.on('uncaughtException', (err) => {
    error(`Uncaught Exception: ${err.message}`);
    console.error('Stack Trace:', err.stack);
    
    // In Produktionsumgebungen sollte der Prozess beendet werden
    // process.exit(1);
  });
  
  // SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    error('Bot was interrupted by SIGINT (Ctrl+C)');
    process.exit(0);
  });
  
  // SIGTERM
  process.on('SIGTERM', () => {
    error('Bot was terminated by SIGTERM');
    process.exit(0);
  });
}
