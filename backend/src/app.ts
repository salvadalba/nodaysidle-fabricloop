import express from 'express'
import { corsMiddleware } from './middleware/cors.js'
import { compressionMiddleware } from './middleware/compression.js'
import { requestIdMiddleware } from './middleware/requestId.js'
import { rateLimitMiddleware } from './middleware/rateLimit.js'
import { requestLogger } from './logger/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import routes from './routes/index.js'

export function createApp() {
  const app = express()

  // Security and middleware
  app.use(corsMiddleware)
  app.use(compressionMiddleware)
  app.use(requestIdMiddleware)
  app.use(rateLimitMiddleware)
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))

  // Request logging
  app.use(requestLogger)

  // API routes
  app.use('/', routes)

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found',
      },
      requestId: req.id,
    })
  })

  // Error handler (must be last)
  app.use(errorHandler)

  return app
}
