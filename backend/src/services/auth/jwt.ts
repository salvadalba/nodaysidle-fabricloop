import jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken'
import { config } from '../../config/index.js'

export interface JwtPayload {
  userId: string
  email: string
  role: string
  type?: 'access' | 'refresh'
}

/**
 * Generate an access token for a user
 * @param payload - User data to encode in token
 * @returns JWT access token
 */
export function generateAccessToken(payload: Omit<JwtPayload, 'type'>): string {
  const options: SignOptions = {
    expiresIn: config.JWT_ACCESS_EXPIRY as any,
  }
  return jwt.sign(
    { ...payload, type: 'access' as const },
    config.JWT_SECRET,
    options
  )
}

/**
 * Generate a refresh token for a user
 * @param payload - User data to encode in token
 * @returns JWT refresh token
 */
export function generateRefreshToken(payload: Omit<JwtPayload, 'type'>): string {
  const options: SignOptions = {
    expiresIn: config.JWT_REFRESH_EXPIRY as any,
  }
  return jwt.sign(
    { ...payload, type: 'refresh' as const },
    config.JWT_SECRET,
    options
  )
}

/**
 * Generate both access and refresh tokens
 * @param payload - User data to encode in tokens
 * @returns Object with access and refresh tokens
 */
export function generateTokenPair(
  payload: Omit<JwtPayload, 'type'>
): { accessToken: string; refreshToken: string } {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  }
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload
 * @throws Error if token is invalid
 */
export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload
    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired')
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token')
    }
    throw error
  }
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}
