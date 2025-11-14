// lib/logger.js - minimal winston logger + stream for morgan
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ stderrLevels: ['error'] }),
  ],
});

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
