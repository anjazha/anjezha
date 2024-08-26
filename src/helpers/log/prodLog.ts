import { createLogger, format, transports } from 'winston';
import PostgresTransport from 'winston-postgres';

import { DB_URL, LOG_LEVEL } from '@/Config';

// PostgreSQL connection options
const pgOptions = {
  connectionString: DB_URL,
  tableName: 'logs'
};

// Determine log level from environment variable or default to 'info'
const logLevel =LOG_LEVEL || 'info';

// Custom log format
const customFormat = format.combine(
  format.timestamp(),
  format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${JSON.stringify(meta)}`;
  })
);

// Create the logger
const logger = createLogger({
  level: logLevel,
  format: customFormat,
  transports: [
    new transports.Console(),
    new PostgresTransport({
      ...pgOptions,
      level: logLevel // Set log level for PostgreSQL transport
    })
  ]
});

export default logger;