import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';

import logger from './config/logger.js';
import { standardLimiter, speedLimiter } from './config/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import routes from './routes.js';

const app = express();

// Security headers
app.use(helmet());

// CORS: allow only known frontend origins
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Stripe webhook needs raw body — register BEFORE express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Gzip compression
app.use(compression());

// HTTP request logging via Morgan → Winston
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.http(message.trim()) },
  })
);

// Global rate limiting and throttling on all API routes
app.use('/api', standardLimiter);
app.use('/api', speedLimiter);

// API routes
app.use('/api', routes);

// 404 and global error handler — must be last
app.use(notFound);
app.use(errorHandler);

export default app;

