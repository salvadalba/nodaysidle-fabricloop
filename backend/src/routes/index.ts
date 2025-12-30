import { Router } from 'express'
import healthRouter from './health.js'
import authRouter from './auth.js'
import materialsRouter from './materials.js'
import passportsRouter from './passports.js'
import messagesRouter from './messages.js'

const router = Router()

// Health check endpoint (no auth required)
router.use('/health', healthRouter)

// Authentication routes
router.use('/api/auth', authRouter)

// Materials routes
router.use('/api/materials', materialsRouter)

// Digital Product Passports routes
router.use('/api/passports', passportsRouter)

// Messages routes
router.use('/api/messages', messagesRouter)

// TODO: Implement remaining routes
// router.use('/api/transactions', transactionRoutes)
// router.use('/api/reports', reportRoutes)
// router.use('/api/payments', paymentRoutes)

export default router
