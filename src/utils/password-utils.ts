
/**
 * Password utility functions for generating and managing secure passwords
 */

/**
 * Generates a strong password with at least one uppercase letter, 
 * one lowercase letter, one number, and one special character
 * @param length The length of the password (default: 10)
 * @returns A secure randomly generated password
 */
export function generateStrongPassword(length: number = 10): string {
  const charset = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
  };
  
  // Ensure we have at least one character from each category
  let password = '';
  password += charset.uppercase.charAt(Math.floor(Math.random() * charset.uppercase.length));
  password += charset.lowercase.charAt(Math.floor(Math.random() * charset.lowercase.length));
  password += charset.numbers.charAt(Math.floor(Math.random() * charset.numbers.length));
  password += charset.symbols.charAt(Math.floor(Math.random() * charset.symbols.length));
  
  // Fill the rest with random characters from all categories
  const allCharset = charset.uppercase + charset.lowercase + charset.numbers + charset.symbols;
  
  for (let i = password.length; i < length; i++) {
    password += allCharset.charAt(Math.floor(Math.random() * allCharset.length));
  }
  
  // Shuffle the password characters to make it more random
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

/**
 * Checks if a password meets minimum security requirements
 * @param password The password to check
 * @returns True if the password meets security requirements
 */
export function isStrongPassword(password: string): boolean {
  // At least 8 characters
  if (password.length < 8) return false;
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // Check for at least one number
  if (!/[0-9]/.test(password)) return false;
  
  // Check for at least one special character
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  
  return true;
}
