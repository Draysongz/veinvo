import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { config } from './index';

// Ensure logs directory exists
const logsDir = path.dirname(config.logging.filePath);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for security (remove sensitive data)
const securityFilter = winston.format((info) => {
  // Remove sensitive fields from logs
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
  const filteredInfo = { ...info };

  sensitiveFields.forEach(field => {
    if (filteredInfo[field]) {
      filteredInfo[field] = '[REDACTED]';
    }
  });

  // Remove sensitive data from error objects
  if (filteredInfo.error && typeof filteredInfo.error === 'object') {
    const errorObj = filteredInfo.error as { stack?: string };
    if (errorObj.stack) {
      // Remove file paths that might contain sensitive information
      errorObj.stack = errorObj.stack
        .split('\n')
        .map((line: string) => {
          if (line.includes('/Users/') || line.includes('/home/') || line.includes('C:\\')) {
            return line.replace(/\/[^\/]+\/[^\/]+\//, '/[REDACTED]/');
          }
          return line;
        })
        .join('\n');
    }
  }

  return filteredInfo;
});

// Custom format for structured logging
const customFormat = winston.format.combine(
  securityFilter(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    return log;
  })
);

// Console format for development
const consoleFormat = winston.format.combine(
  securityFilter(),
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    return log;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  format: customFormat,
  defaultMeta: {
    service: 'veinvo-api',
    environment: config.nodeEnv,
    version: process.env['npm_package_version'] || '1.0.0',
  },
  transports: [
    // File transport for all logs
    new winston.transports.File({
      filename: config.logging.filePath,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true,
    }),
    
    // Separate file for errors
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true,
    }),
  ],
  // Handle uncaught exceptions and unhandled rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport in development
if (config.nodeEnv !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}

// Create a stream for Morgan HTTP logging
export const logStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// Log uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export { logger }; 