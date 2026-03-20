import './config/env.js';
import http from 'http';

import app from './app.js';
import logger from './config/logger.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info({ message: 'HTTP server started', port: PORT });
});

process.on('unhandledRejection', (err) => {
  logger.error({ message: 'Unhandled Rejection', error: err?.stack || err });
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error({ message: 'Uncaught Exception', error: err?.stack || err });
  process.exit(1);
});

