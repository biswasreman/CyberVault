import CryptoJS from 'crypto-js';

export function encryptText(text: string, password: string): string {
  try {
    return CryptoJS.AES.encrypt(text, password).toString();
  } catch (error) {
    throw new Error('Encryption failed. Please try again.');
  }
}

export function decryptText(encryptedText: string, password: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, password);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedText) {
      throw new Error('Invalid password or corrupted text.');
    }
    
    return decryptedText;
  } catch (error) {
    throw new Error('Decryption failed. Please check your password and try again.');
  }
}
