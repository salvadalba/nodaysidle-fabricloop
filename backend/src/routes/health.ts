import { Router } from 'express'
import { healthCheck as dbHealthCheck } from '../config/database.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    // Check database connection
    const dbHealthy = await dbHealthCheck()

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: {
          status: dbHealthy ? 'up' : 'down',
        },
        redis: {
          status: 'unknown', // TODO: Add Redis health check
        },
      },
    }

    // Return 503 if any critical service is down
    const allHealthy = dbHealthy
    res.status(allHealthy ? 200 : 503).json(health)
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    })
  }
})

export default router
