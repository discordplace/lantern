import * as crypto from 'crypto';

interface EncryptedData {
  iv: string;
  encryptedText: string;
  tag: string;
}

/**
 * Encrypts a given text using AES-256-GCM encryption algorithm.
 *
 * @param text - The text to be encrypted.
 * @param secret - The secret key used for encryption, in hexadecimal format.
 * @returns {EncryptedData} - The encrypted data, including the initialization vector (iv), encrypted text, and authentication tag (tag).
 * @throws {Error} - Throws an error if the text or secret is invalid.
 */
function encrypt(text: string, secret: string): EncryptedData {
  if (!text || !secret) throw new Error('Text and secret are required');

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secret, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return { iv: iv.toString('hex'), encryptedText: encrypted.toString('hex'), tag: tag.toString('hex') };
}

/**
 * Decrypts the given encrypted data using the provided secret.
 *
 * @param {EncryptedData} encryptedData - The data to decrypt, including the initialization vector (iv), encrypted text, and authentication tag (tag).
 * @param {string} secret - The secret key used for decryption, in hexadecimal format.
 * @returns {string} - The decrypted text in UTF-8 format.
 * @throws {Error} - Throws an error if the encrypted data or secret is invalid.
 */
function decrypt(encryptedData: EncryptedData, secret: string): string {
  if (!encryptedData || !encryptedData.iv || !encryptedData.encryptedText || !encryptedData.tag || !secret) throw new Error('Invalid encrypted data or secret.');

  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(secret, 'hex'), Buffer.from(encryptedData.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData.encryptedText, 'hex')), decipher.final()]);

  return decrypted.toString('utf-8');
}

export { encrypt, decrypt };