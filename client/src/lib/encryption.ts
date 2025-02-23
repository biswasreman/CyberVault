import CryptoJS from 'crypto-js';

export type EncryptionMethod = 'AES' | 'Triple DES' | 'RC4';
export type KeySize = '128' | '192' | '256';

interface EncryptionConfig {
  method: EncryptionMethod;
  keySize: KeySize;
}

function deriveKey(password: string, keySize: KeySize): CryptoJS.lib.WordArray {
  // PBKDF2 for key derivation with 1000 iterations
  return CryptoJS.PBKDF2(password, CryptoJS.lib.WordArray.random(128/8), {
    keySize: parseInt(keySize) / 32, // Convert bits to words
    iterations: 1000
  });
}

export function encryptText(text: string, password: string, config: EncryptionConfig): string {
  try {
    const key = deriveKey(password, config.keySize);

    switch (config.method) {
      case 'AES':
        return CryptoJS.AES.encrypt(text, key, {
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }).toString();
      case 'Triple DES':
        return CryptoJS.TripleDES.encrypt(text, key, {
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }).toString();
      case 'RC4':
        return CryptoJS.RC4.encrypt(text, key).toString();
      default:
        throw new Error('Unsupported encryption method');
    }
  } catch (error) {
    throw new Error('Encryption failed. Please try again.');
  }
}

export function decryptText(encryptedText: string, password: string, config: EncryptionConfig): string {
  try {
    const key = deriveKey(password, config.keySize);
    let bytes;

    switch (config.method) {
      case 'AES':
        bytes = CryptoJS.AES.decrypt(encryptedText, key, {
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });
        break;
      case 'Triple DES':
        bytes = CryptoJS.TripleDES.decrypt(encryptedText, key, {
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });
        break;
      case 'RC4':
        bytes = CryptoJS.RC4.decrypt(encryptedText, key);
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
export const keySizes: KeySize[] = ['128', '192', '256'];