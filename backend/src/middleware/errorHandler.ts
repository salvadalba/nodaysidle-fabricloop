import { logger } from '../logger/index.js'
import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
  errorCode?: string
  details?: any
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode || 500
  const errorCode = err.errorCode || 'INTERNAL_ERROR'

  logger.error('Error occurred', {
    requestId: req.id,
    statusCode,
    errorCode,
    message: err.message,
    stack: err.stack,
    details: err.details,
  })

  // Don't expose stack trace in production
  const isDevelopment = process.env.NODE_ENV === 'development'

  res.status(statusCode).json({
    error: {
      code: errorCode,
      message: err.message || 'An unexpected error occurred',
      ...(isDevelopment && { stack: err.stack }),
      ...(err.details && { details: err.details }),
    },
    requestId: req.id,
  })
}

export function createError(
  message: string,
  statusCode: number = 500,
  errorCode?: string
): AppError {
  const error = new Error(message) as AppError
  error.statusCode = statusCode
  error.errorCode = errorCode || 'INTERNAL_ERROR'
  return error
}

export function badRequest(message: string = 'Bad request'): AppError {
  return createError(message, 400, 'BAD_REQUEST')
}

export function unauthorized(message: string = 'Unauthorized'): AppError {
  return createError(message, 401, 'UNAUTHORIZED')
}

export function forbidden(message: string = 'Forbidden'): AppError {
  return createError(message, 403, 'FORBIDDEN')
}

export function notFound(message: string = 'Resource not found'): AppError {
  return createError(message, 404, 'NOT_FOUND')
}

export function conflict(message: string = 'Resource already exists'): AppError {
  return createError(message, 409, 'CONFLICT')
}

export function unprocessableEntity(message: string = 'Validation failed'): AppError {
  return createError(message, 422, 'UNPROCESSABLE_ENTITY')
}

export function tooManyRequests(message: string = 'Too many requests'): AppError {
  return createError(message, 429, 'TOO_MANY_REQUESTS')
}
