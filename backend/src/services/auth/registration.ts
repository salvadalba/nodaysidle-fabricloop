import { query } from '../../config/database.js'
import { hashPassword, isStrongPassword } from './password.js'
import {
  isValidEmail,
  isValidPhone,
  isValidCompanyName,
  isValidRole,
} from '../../utils/validation.js'
import { conflict, unprocessableEntity } from '../../middleware/errorHandler.js'

export interface RegisterInput {
  email: string
  password: string
  companyName: string
  role: 'manufacturer' | 'brand'
  phone: string
}

export interface User {
  id: string
  email: string
  companyName: string
  role: string
  phone: string | null
  isVerified: boolean
  createdAt: Date
}

/**
 * Register a new user
 * @param input - User registration data
 * @returns Created user
 */
export async function registerUser(input: RegisterInput): Promise<User> {
  // Validate input
  validateRegistrationInput(input)

  // Check if email already exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1',
    [input.email.toLowerCase()]
  )

  if (existingUser.rows.length > 0) {
    throw conflict('Email already registered')
  }

  // Hash password
  const passwordHash = await hashPassword(input.password)

  // Insert user
  const result = await query(
    `INSERT INTO users (email, password_hash, company_name, role, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, company_name, role, phone, is_verified, created_at`,
    [
      input.email.toLowerCase(),
      passwordHash,
      input.companyName.trim(),
      input.role,
      input.phone || null,
    ]
  )

  const user = result.rows[0]

  return {
    id: user.id,
    email: user.email,
    companyName: user.company_name,
    role: user.role,
    phone: user.phone,
    isVerified: user.is_verified,
    createdAt: user.created_at,
  }
}

/**
 * Validate user registration input
 * @param input - Registration data to validate
 */
function validateRegistrationInput(input: RegisterInput): void {
  if (!isValidEmail(input.email)) {
    throw unprocessableEntity('Invalid email format')
  }

  if (!isStrongPassword(input.password)) {
    throw unprocessableEntity(
      'Password must be at least 8 characters with uppercase, lowercase, and number'
    )
  }

  if (!isValidCompanyName(input.companyName)) {
    throw unprocessableEntity('Company name must be between 2 and 255 characters')
  }

  if (!isValidRole(input.role)) {
    throw unprocessableEntity('Role must be either manufacturer or brand')
  }

  if (input.phone && !isValidPhone(input.phone)) {
    throw unprocessableEntity('Invalid phone number format')
  }
}
