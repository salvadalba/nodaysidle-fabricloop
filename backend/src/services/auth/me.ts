import { query } from '../../config/database.js'
import { notFound } from '../../middleware/errorHandler.js'

export interface User {
  userId: string
  email: string
  companyName: string
  role: string
  phone: string | null
  isVerified: boolean
  createdAt: Date
}

/**
 * Get user by ID
 * @param userId - User ID to look up
 * @returns User data
 */
export async function getUserById(userId: string): Promise<User> {
  const result = await query(
    `SELECT id, email, company_name, role, phone, is_verified, created_at
     FROM users
     WHERE id = $1`,
    [userId]
  )

  if (result.rows.length === 0) {
    throw notFound('User not found')
  }

  const user = result.rows[0]

  return {
    userId: user.id,
    email: user.email,
    companyName: user.company_name,
    role: user.role,
    phone: user.phone,
    isVerified: user.is_verified,
    createdAt: user.created_at,
  }
}
