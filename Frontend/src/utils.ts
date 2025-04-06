// utils.ts
import CryptoJS from 'crypto-js';
import { JSEncrypt } from 'jsencrypt'; // Import jsencrypt

// --- RSA Functions (Using jsencrypt) ---

function generateKeyPair(): { publicKey: string; privateKey: string } {
    // Use JSEncrypt to generate keys
    const crypt = new JSEncrypt({ default_key_size: 2048 }); // Specify key size
    crypt.getKey(); // Generate the key pair

    // Get keys in PEM format
    const privateKey = crypt.getPrivateKey();
    const publicKey = crypt.getPublicKey();

    if (!privateKey || !publicKey) {
       throw new Error("Failed to generate key pair using jsencrypt.");
    }

    return { publicKey, privateKey };
}

function encryptData(publicKey: string, data: string): string {
    const crypt = new JSEncrypt();
    crypt.setPublicKey(publicKey);
    const encrypted = crypt.encrypt(data);
    if (encrypted === false) { // jsencrypt returns false on encryption failure
        throw new Error("Encryption failed using jsencrypt.");
    }
    return encrypted; // jsencrypt output is already Base64
}

function decryptData(privateKey: string, encryptedData: string): string {
     const crypt = new JSEncrypt();
     crypt.setPrivateKey(privateKey);
     const decrypted = crypt.decrypt(encryptedData);
     if (decrypted === false) { // jsencrypt returns false on decryption failure
         throw new Error("Decryption failed using jsencrypt (check key or data).");
     }
     // Ensure null is handled if decryption theoretically results in null but not false
     return decrypted === null ? "" : decrypted;
}


// --- Hashing and Symmetric Encryption (Implementable with crypto-js) ---
// Keep the crypto-js implementations for these as provided previously

function hashPassword(data: string): string {
    const hash = CryptoJS.SHA256(data);
    return hash.toString(CryptoJS.enc.Hex);
}

function encryptPrivateKey(privateKeyPem: string, passwordHashHex: string): string {
    const key = CryptoJS.enc.Hex.parse(passwordHashHex);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(privateKeyPem, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return iv.toString(CryptoJS.enc.Hex) + ':' + encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

function decryptPrivateKey(encryptedPrivateKey: string, passwordHashHex: string): string {
    const parts = encryptedPrivateKey.split(':');
    if (parts.length !== 2) {
        throw new Error("Invalid encrypted private key format. Expected 'iv:ciphertext'.");
    }
    const iv = CryptoJS.enc.Hex.parse(parts[0]);
    const encryptedTextHex = parts[1];
    const key = CryptoJS.enc.Hex.parse(passwordHashHex);
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Hex.parse(encryptedTextHex) } as any,
        key,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    try {
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
        if (!decryptedText && encryptedTextHex.length > 0) { // Check if output is empty but input wasn't
             throw new Error("Decryption failed (likely wrong key or corrupted data).");
        }
        return decryptedText;
    } catch (e) {
         console.error("Error converting decrypted data to Utf8:", e);
         throw new Error("Decryption failed (invalid UTF-8 output).");
    }
}

export {
    generateKeyPair, // Now uses jsencrypt
    encryptData,     // Now uses jsencrypt
    decryptData,     // Now uses jsencrypt
    hashPassword,
    encryptPrivateKey,
    decryptPrivateKey
};