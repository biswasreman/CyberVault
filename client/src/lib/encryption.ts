import CryptoJS from 'crypto-js';

export type EncryptionMethod = 'AES' | 'Triple DES' | 'RC4';
export type KeySize = '128' | '192' | '256';

interface EncryptionConfig {
  method: EncryptionMethod;
  keySize: KeySize;
}

function deriveKey(password: string, keySize: KeySize): { key: CryptoJS.lib.WordArray; salt: CryptoJS.lib.WordArray } {
  // Generate a random salt
  const salt = CryptoJS.lib.WordArray.random(16);

  // Derive key using PBKDF2
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: parseInt(keySize) / 32, // Convert bits to words
    iterations: 1000
  });

  return { key, salt };
}

export function encryptText(text: string, password: string, config: EncryptionConfig): string {
  try {
    // Derive key and get salt
    const { key, salt } = deriveKey(password, config.keySize);
    let encrypted;

    // Common encryption options
    const options = {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: CryptoJS.lib.WordArray.random(16)
    };

    switch (config.method) {
      case 'AES':
        encrypted = CryptoJS.AES.encrypt(text, key, options);
        break;
      case 'Triple DES':
        encrypted = CryptoJS.TripleDES.encrypt(text, key, options);
        break;
      case 'RC4':
        encrypted = CryptoJS.RC4.encrypt(text, key);
        break;
      default:
        throw new Error('Unsupported encryption method');
    }

    // Combine salt, IV and ciphertext
    const combined = salt.toString() + options.iv.toString() + encrypted.toString();
    return combined;

  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed. Please try again.');
  }
}

export function decryptText(encryptedText: string, password: string, config: EncryptionConfig): string {
  try {
    // Extract salt, IV and ciphertext
    const saltSize = 32; // 16 bytes = 32 hex characters
    const ivSize = 32; // 16 bytes = 32 hex characters

    const salt = CryptoJS.enc.Hex.parse(encryptedText.slice(0, saltSize));
    const iv = CryptoJS.enc.Hex.parse(encryptedText.slice(saltSize, saltSize + ivSize));
    const ciphertext = encryptedText.slice(saltSize + ivSize);

    // Derive the same key using the extracted salt
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: parseInt(config.keySize) / 32,
      iterations: 1000
    });

    let decrypted;
    const options = {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: iv
    };

    switch (config.method) {
      case 'AES':
        decrypted = CryptoJS.AES.decrypt(ciphertext, key, options);
        break;
      case 'Triple DES':
        decrypted = CryptoJS.TripleDES.decrypt(ciphertext, key, options);
        break;
      case 'RC4':
        decrypted = CryptoJS.RC4.decrypt(ciphertext, key);
        break;
      default:
        throw new Error('Unsupported encryption method');
    }

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) {
      throw new Error('Invalid password or corrupted text.');
    }

    return decryptedText;

  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed. Please check your password and try again.');
  }
}

export const encryptionMethods: EncryptionMethod[] = ['AES', 'Triple DES', 'RC4'];
export const keySizes: KeySize[] = ['128', '192', '256'];