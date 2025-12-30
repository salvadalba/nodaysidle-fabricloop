import { createApp } from './app.js'
import { config } from './config/index.js'
import { logger } from './logger/index.js'
import { closePool } from './config/database.js'

const app = createApp()

const server = app.listen(config.PORT, () => {
  logger.info(`FabricLoop API server started`, {
    port: config.PORT,
    environment: config.NODE_ENV,
    apiUrl: config.API_URL,
    frontendUrl: config.FRONTEND_URL,
  })
})

// Graceful shutdown
function shutdown(signal: string) {
  logger.info(`${signal} received, shutting down gracefully...`)

  server.close(async () => {
    logger.info('HTTP server closed')

    try {
      await closePool()
      logger.info('Database pool closed')

      logger.info('Shutdown complete')
      process.exit(0)
    } catch (error) {
      logger.error('Error during shutdown:', error)
      process.exit(1)
    }
  })

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}

// Handle shutdown signals
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error)
  shutdown('uncaughtException')
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason)
})
