import CryptoJS from 'crypto-js';

type EncryptionMethod = 'AES' | 'Triple DES' | 'RC4';

export function encryptText(text: string, password: string, method: EncryptionMethod = 'AES'): string {
  try {
    switch (method) {
      case 'AES':
        return CryptoJS.AES.encrypt(text, password).toString();
      case 'Triple DES':
        return CryptoJS.TripleDES.encrypt(text, password).toString();
      case 'RC4':
        return CryptoJS.RC4.encrypt(text, password).toString();
      default:
        throw new Error('Unsupported encryption method');
    }
  } catch (error) {
    throw new Error('Encryption failed. Please try again.');
  }
}

export function decryptText(encryptedText: string, password: string, method: EncryptionMethod = 'AES'): string {
  try {
    let bytes;
    switch (method) {
      case 'AES':
        bytes = CryptoJS.AES.decrypt(encryptedText, password);
        break;
      case 'Triple DES':
        bytes = CryptoJS.TripleDES.decrypt(encryptedText, password);
        break;
      case 'RC4':
        bytes = CryptoJS.RC4.decrypt(encryptedText, password);
        break;
      default:
        throw new Error('Unsupported encryption method');
    }

    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) {
      throw new Error('Invalid password or corrupted text.');
    }

    return decryptedText;
  } catch (error) {
    throw new Error('Decryption failed. Please check your password and try again.');
  }
}

export const encryptionMethods: EncryptionMethod[] = ['AES', 'Triple DES', 'RC4'];