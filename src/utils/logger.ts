import winston from 'winston';

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
 * @param data - The data to sanitize
 * @returns Sanitized data safe for logging
 */
function sanitizeData(data: any): any {
  if (typeof data === 'string') {
    // Check if string looks like sensitive data
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
      // Redact sensitive keys
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
 * Environment-aware logger configuration
 * In production: only errors and warnings
 * In development: full logging with sanitization
 */
const logLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'info';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
      // Sanitize metadata
      const sanitizedMeta = sanitizeData(meta);

      let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

      if (Object.keys(sanitizedMeta).length > 0) {
        log += ` ${JSON.stringify(sanitizedMeta)}`;
      }

      if (stack) {
        log += `\n${stack}`;
      }

      return log;
    })
  ),
  defaultMeta: { service: 'ponas-obuolys' },
  transports: [
    // Error logs to separate file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),

    // All logs to combined file (if not production)
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.File({
        filename: 'logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        tailable: true
      })
    ] : [])
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

/**
 * Production-safe logger interface
 * Automatically sanitizes sensitive data
 */
export const secureLogger = {
  /**
   * Log error message with automatic sanitization
   */
  error: (message: string, meta?: any) => {
    logger.error(message, sanitizeData(meta || {}));
  },

  /**
   * Log warning message with automatic sanitization
   */
  warn: (message: string, meta?: any) => {
    logger.warn(message, sanitizeData(meta || {}));
  },

  /**
   * Log info message with automatic sanitization (development only)
   */
  info: (message: string, meta?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      logger.info(message, sanitizeData(meta || {}));
    }
  },

  /**
   * Log debug message with automatic sanitization (development only)
   */
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      logger.debug(message, sanitizeData(meta || {}));
    }
  },

  /**
   * Log HTTP request/response with security filtering
   */
  http: (method: string, url: string, status: number, duration?: number, meta?: any) => {
    const sanitizedMeta = sanitizeData(meta || {});
    const message = `${method} ${url} ${status}${duration ? ` ${duration}ms` : ''}`;

    if (status >= 400) {
      logger.error(`HTTP Error: ${message}`, sanitizedMeta);
    } else if (process.env.NODE_ENV !== 'production') {
      logger.info(`HTTP: ${message}`, sanitizedMeta);
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

    logger.info(`Auth: ${event}`, logData);
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
      logger.error(`Security: ${event}`, logData);
    } else {
      logger.warn(`Security: ${event}`, logData);
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