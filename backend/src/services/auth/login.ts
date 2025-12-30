import { query } from '../../config/database.js'
import { comparePassword } from './password.js'
import { generateTokenPair } from './jwt.js'
import { unauthorized, unprocessableEntity } from '../../middleware/errorHandler.js'

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResult {
  user: {
    userId: string
    email: string
    companyName: string
    role: string
  }
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

/**
 * Authenticate user and generate tokens
 * @param input - Login credentials
 * @returns User data and tokens
 */
export async function loginUser(input: LoginInput): Promise<LoginResult> {
  // Validate input
  if (!input.email || !input.password) {
    throw unprocessableEntity('Email and password are required')
  }

  // Find user by email
  const result = await query(
    `SELECT id, email, password_hash, company_name, role, is_active
     FROM users
     WHERE email = $1`,
    [input.email.toLowerCase()]
  )

  if (result.rows.length === 0) {
    throw unauthorized('Invalid credentials')
  }

  const user = result.rows[0]

  // Check if account is active
  if (!user.is_active) {
    throw unauthorized('Account is deactivated')
  }

  // Verify password
  const isPasswordValid = await comparePassword(input.password, user.password_hash)

  if (!isPasswordValid) {
    throw unauthorized('Invalid credentials')
  }

  // Generate tokens
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  return {
    user: {
      userId: user.id,
      email: user.email,
      companyName: user.company_name,
      role: user.role,
    },
    tokens,
  }
}
