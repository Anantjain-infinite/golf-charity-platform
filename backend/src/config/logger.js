import winston from 'winston';
import path from 'path';
import fs from 'fs';

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const isProduction = process.env.NODE_ENV === 'production';

// Create logs directory if it does not exist
// Only on local — Railway filesystem is ephemeral so file logs are useless there
if (!isProduction) {
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

const transports = [
  new winston.transports.Console({
    format: isProduction
      ? combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), json())
      : combine(colorize(), simple()),
  }),
];

// Add file transports only in development
if (!isProduction) {
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10,
    })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: { service: 'golf-charity-api' },
  transports,
});

export default logger;
