import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { registerUser } from '../services/auth/registration.js'
import { loginUser } from '../services/auth/login.js'
import { getUserById } from '../services/auth/me.js'
import { authenticate } from '../middleware/auth.js'
import { unprocessableEntity } from '../middleware/errorHandler.js'

const router = Router()

/**
 * Validation middleware
 */
function handleValidationErrors(
  req: any,
  _res: any,
  next: any
) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw unprocessableEntity(errors.array()[0].msg)
  }
  next()
}

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('companyName')
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage('Company name must be between 2 and 255 characters'),
    body('role')
      .isIn(['manufacturer', 'brand'])
      .withMessage('Role must be either manufacturer or brand'),
    body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
    handleValidationErrors,
  ],
  async (req: any, res: any, next: any) => {
    try {
      const user = await registerUser(req.body)

      res.status(201).json({
        user: {
          userId: user.id,
          email: user.email,
          companyName: user.companyName,
          role: user.role,
          createdAt: user.createdAt,
        },
      })
    } catch (error) {
      next(error)
    }
  }
)

/**
 * POST /api/auth/login
 * Login user
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
  ],
  async (req: any, res: any, next: any) => {
    try {
      const result = await loginUser(req.body)

      res.status(200).json({
        user: result.user,
        tokens: result.tokens,
      })
    } catch (error) {
      next(error)
    }
  }
)

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticate, async (req: any, res: any, next: any) => {
  try {
    const user = await getUserById(req.user!.userId)

    res.status(200).json({
      user: {
        userId: user.userId,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
