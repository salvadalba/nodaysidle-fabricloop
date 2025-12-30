import cors from 'cors'
import { config } from '../config/index.js'

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      config.CORS_ORIGIN,
      'https://fabricloop.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173',
      // Allow Vercel preview deployments
      process.env.FRONTEND_URL
    ].filter(Boolean)

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID'],
})
