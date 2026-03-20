import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

// Standard API rate limit: 100 requests per 15 minutes
const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

// Auth endpoints: stricter — 10 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please wait before trying again.' },
});

// Stripe webhook: no rate limit (Stripe retries)
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 200,
});

// File upload: 5 uploads per minute per user
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Upload limit reached. Please wait before uploading again.' },
});

// Admin draw simulation: 10 per hour (expensive operation)
const drawLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Draw simulation limit reached for this hour.' },
});

// Slow down: begin delaying after 50 requests, +100ms per request
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: (hits) => hits * 100,
});

export {
  standardLimiter,
  authLimiter,
  webhookLimiter,
  uploadLimiter,
  drawLimiter,
  speedLimiter,
};

