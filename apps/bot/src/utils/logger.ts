/**
 * Logger-Funktionen für den Bot
 */

/**
 * Loggt eine Nachricht auf der Konsole
 * @param message Die zu loggende Nachricht
 * @param level Das Log-Level
 */
export function log(message: string, level: 'info' | 'warn' | 'error' | 'debug' = 'info'): void {
  const timestamp = new Date().toISOString();
  
  switch (level) {
    case 'info':
      console.info(`[${timestamp}] [INFO] ${message}`);
      break;
    case 'warn':
      console.warn(`[${timestamp}] [WARN] ${message}`);
      break;
    case 'error':
      console.error(`[${timestamp}] [ERROR] ${message}`);
      break;
    case 'debug':
      console.debug(`[${timestamp}] [DEBUG] ${message}`);
      break;
  }
}

/**
 * Loggt eine Nachricht auf der Konsole mit dem Level 'info'
 * @param message Die zu loggende Nachricht
 */
export function info(message: string): void {
  log(message, 'info');
}

/**
 * Loggt eine Nachricht auf der Konsole mit dem Level 'warn'
 * @param message Die zu loggende Nachricht
 */
export function warn(message: string): void {
  log(message, 'warn');
}

/**
 * Loggt eine Nachricht auf der Konsole mit dem Level 'error'
 * @param message Die zu loggende Nachricht
 */
export function error(message: string): void {
  log(message, 'error');
}

/**
 * Loggt eine Nachricht auf der Konsole mit dem Level 'debug'
 * @param message Die zu loggende Nachricht
 */
export function debug(message: string): void {
  log(message, 'debug');
}
