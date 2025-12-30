import dotenv from 'dotenv'
import { z } from 'zod'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

// Environment schema with validation
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('8000'),
  API_URL: z.string().url().default('http://localhost:8000'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),

  // Database
  // Database
  DATABASE_URL: z.string().url(),
  DB_HOST: z.string().default('localhost').optional(),
  DB_PORT: z.string().transform(Number).default('5432').optional(),
  DB_NAME: z.string().default('fabricloop').optional(),
  DB_USER: z.string().default('fabricloop').optional(),
  DB_PASSWORD: z.string().optional(),

  // Redis
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('24h'),
  JWT_REFRESH_EXPIRY: z.string().default('30d'),

  // Stripe (optional for development)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Upload
  UPLOAD_DIR: z.string().default('uploads'),
  MAX_FILE_SIZE: z.string().transform(Number).default('5242880'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('60000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),

  // CORS
  CORS_ORIGIN: z.string().default(process.env.FRONTEND_URL || 'http://localhost:3000'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_DIR: z.string().default('logs'),
})

// Validate and export configuration
export const config = envSchema.parse(process.env)

export default config
