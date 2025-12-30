import rateLimit from 'express-rate-limit'
import { config } from '../config/index.js'

export const rateLimitMiddleware = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again later.',
    },
  },
  keyGenerator: (req) => {
    return req.ip || 'unknown'
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health'
  },
})
