import { createLogger, format, transports } from 'winston';

// Import the PostgreSQL transport
// import PostgresTransport from 'winston-pg';




import { DB_URL, LOG_LEVEL } from '@/config/index';

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
    // new PostgresTransport(pgOptions)

    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
    
  ]
});

export default logger;