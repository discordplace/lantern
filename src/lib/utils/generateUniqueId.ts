import crypto from 'crypto';

/**
 * Generates a unique identifier string.
 *
 * @param bytes - The number of bytes to generate. Defaults to 16.
 * @returns A unique identifier string in hexadecimal format.
 */
function generateUniqueId(bytes: number = 16) {
  return crypto.randomBytes(bytes).toString('hex');
}

export default generateUniqueId;