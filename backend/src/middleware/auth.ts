import { Request, Response, NextFunction } from 'express'
import { verifyToken, extractToken } from '../services/auth/jwt.js'
import { unauthorized, forbidden } from './errorHandler.js'

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        email: string
        role: string
      }
      id?: string
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractToken(req.headers.authorization)

    if (!token) {
      throw unauthorized('Authentication required')
    }

    const decoded = verifyToken(token)

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    }

    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Optional authentication middleware
 * Attaches user to request if token is present, but doesn't require it
 */
export function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const token = extractToken(req.headers.authorization)

    if (token) {
      const decoded = verifyToken(token)
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      }
    }

    next()
  } catch {
    // If token is invalid, just continue without user
    next()
  }
}

/**
 * Role-based authorization middleware factory
 * @param allowedRoles - Array of roles that can access the route
 */
export function authorize(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(unauthorized('Authentication required'))
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(forbidden('Insufficient permissions'))
    }

    next()
  }
}
