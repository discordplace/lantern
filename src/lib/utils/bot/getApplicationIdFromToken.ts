/**
 * Extracts the application ID from a given token.
 *
 * The token is expected to be a base64 encoded string, where the application ID
 * is located in the first segment of the token (before the first dot).
 *
 * @param token - The token from which to extract the application ID.
 * @returns The decoded application ID as a string.
 */
function getApplicationIdFromToken(token: string) {
  return Buffer.from(token.split('.')[0], 'base64').toString();
}

export default getApplicationIdFromToken;