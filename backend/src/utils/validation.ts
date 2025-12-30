/**
 * Email validation regex pattern
 * Matches standard email formats
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }

  // Check length
  if (email.length > 254) {
    return false
  }

  return EMAIL_REGEX.test(email)
}

/**
 * Validate phone number format (basic)
 * @param phone - Phone number to validate
 * @returns True if phone number appears valid
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false
  }

  // Remove spaces, dashes, parentheses, plus
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')

  // Check if it's 7-15 digits
  return /^\d{7,15}$/.test(cleaned)
}

/**
 * Validate company name
 * @param name - Company name to validate
 * @returns True if company name is valid
 */
export function isValidCompanyName(name: string): boolean {
  if (!name || typeof name !== 'string') {
    return false
  }

  // At least 2 characters, max 255
  return name.trim().length >= 2 && name.trim().length <= 255
}

/**
 * Validate user role
 * @param role - Role to validate
 * @returns True if role is valid
 */
export function isValidRole(role: string): boolean {
  return role === 'manufacturer' || role === 'brand'
}
