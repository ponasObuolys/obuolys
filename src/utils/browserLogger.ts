/**
 * Browser-compatible secure logger
 * Simplified version of Winston logger for client-side use
 */

// Security patterns for sensitive data detection
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /key/i,
  /secret/i,
  /auth/i,
  /credential/i,
  /session/i,
  /cookie/i,
  /bearer/i,
  /jwt/i
];

/**
 * Sanitizes data to remove sensitive information before logging
 */
function sanitizeData(data: any): any {
  if (typeof data === 'string') {
    if (SENSITIVE_PATTERNS.some(pattern => pattern.test(data))) {
      return '[REDACTED]';
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_PATTERNS.some(pattern => pattern.test(key))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeData(value);
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * Log levels for browser environment
 */
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Check if we're in production environment
 */
const isProduction = import.meta.env.PROD;

/**
 * Should log based on environment and level
 */
function shouldLog(level: LogLevel): boolean {
  if (isProduction) {
    // In production, only log errors and warnings
    return level === 'error' || level === 'warn';
  }
  // In development, log everything
  return true;
}

/**
 * Format log message with timestamp and level
 */
function formatMessage(level: LogLevel, message: string, meta?: any): string {
  const timestamp = new Date().toISOString();
  const sanitizedMeta = meta ? sanitizeData(meta) : {};

  let log = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;

  if (Object.keys(sanitizedMeta).length > 0) {
    log += ` ${JSON.stringify(sanitizedMeta)}`;
  }

  return log;
}

/**
 * Browser-compatible secure logger
 */
export const secureLogger = {
  /**
   * Log error message with automatic sanitization
   */
  error: (message: string, meta?: any) => {
    if (shouldLog('error')) {
      const formattedMessage = formatMessage('error', message, meta);
      console.error(formattedMessage);

      // In production, could send to external logging service
      if (isProduction) {
        // TODO: Send to external logging service (e.g., Sentry, LogRocket)
        // sendToLoggingService('error', formattedMessage);
      }
    }
  },

  /**
   * Log warning message with automatic sanitization
   */
  warn: (message: string, meta?: any) => {
    if (shouldLog('warn')) {
      const formattedMessage = formatMessage('warn', message, meta);
      console.warn(formattedMessage);
    }
  },

  /**
   * Log info message with automatic sanitization (development only)
   */
  info: (message: string, meta?: any) => {
    if (shouldLog('info')) {
      const formattedMessage = formatMessage('info', message, meta);
      console.info(formattedMessage);
    }
  },

  /**
   * Log debug message with automatic sanitization (development only)
   */
  debug: (message: string, meta?: any) => {
    if (shouldLog('debug')) {
      const formattedMessage = formatMessage('debug', message, meta);
      console.debug(formattedMessage);
    }
  },

  /**
   * Log HTTP request/response with security filtering
   */
  http: (method: string, url: string, status: number, duration?: number, meta?: any) => {
    const sanitizedMeta = sanitizeData(meta || {});
    const message = `${method} ${url} ${status}${duration ? ` ${duration}ms` : ''}`;

    if (status >= 400) {
      secureLogger.error(`HTTP Error: ${message}`, sanitizedMeta);
    } else {
      secureLogger.info(`HTTP: ${message}`, sanitizedMeta);
    }
  },

  /**
   * Log authentication events with security focus
   */
  auth: (event: string, userId?: string, meta?: any) => {
    const sanitizedMeta = sanitizeData(meta || {});
    const logData = {
      event,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
      ...sanitizedMeta
    };

    secureLogger.info(`Auth: ${event}`, logData);
  },

  /**
   * Log security events (always logged, even in production)
   */
  security: (event: string, severity: 'low' | 'medium' | 'high' | 'critical', meta?: any) => {
    const sanitizedMeta = sanitizeData(meta || {});
    const logData = {
      event,
      severity,
      timestamp: new Date().toISOString(),
      ...sanitizedMeta
    };

    if (severity === 'critical' || severity === 'high') {
      secureLogger.error(`Security: ${event}`, logData);
    } else {
      secureLogger.warn(`Security: ${event}`, logData);
    }
  }
};

/**
 * Legacy console.log replacement
 * Use this as a drop-in replacement for console statements
 */
export const log = {
  error: (message: any, ...args: any[]) => {
    secureLogger.error(String(message), { args: args.length > 0 ? args : undefined });
  },

  warn: (message: any, ...args: any[]) => {
    secureLogger.warn(String(message), { args: args.length > 0 ? args : undefined });
  },

  info: (message: any, ...args: any[]) => {
    secureLogger.info(String(message), { args: args.length > 0 ? args : undefined });
  },

  log: (message: any, ...args: any[]) => {
    secureLogger.info(String(message), { args: args.length > 0 ? args : undefined });
  },

  debug: (message: any, ...args: any[]) => {
    secureLogger.debug(String(message), { args: args.length > 0 ? args : undefined });
  }
};

export default secureLogger;