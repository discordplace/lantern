const crypto = require('node:crypto');

function encrypt(text, secret) {
  if (!text || !secret) throw new Error('Text and secret are required');

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secret, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  
  return { iv: iv.toString('hex'), encryptedText: encrypted.toString('hex'), tag: tag.toString('hex') };
}

function decrypt(encryptedData, secret) {
  if (!encryptedData || !encryptedData.iv || !encryptedData.encryptedText || !encryptedData.tag || !secret) throw new Error('Invalid encrypted data or secret.');

  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(secret, 'hex'), Buffer.from(encryptedData.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData.encryptedText, 'hex')), decipher.final()]);
  
  return decrypted.toString('utf-8');
}


module.exports = {
  encrypt,
  decrypt
};