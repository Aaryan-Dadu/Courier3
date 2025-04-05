import crypto from 'crypto';
import fs from 'fs';
import { Buffer } from 'buffer';

// Function to generate private key and public key pair
function generateKeyPair() {
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });
    return keyPair;
}

// Function to encrypt data using the public key using SHA256 with RSA
function encryptData(publicKey, data) {
    const buffer = Buffer.from(data, 'utf8');
    const encryptedData = crypto.publicEncrypt(publicKey, buffer);
    return encryptedData.toString('base64');
}

// Function to decrypt data using the private key
function decryptData(privateKey, encryptedData) {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decryptedData = crypto.privateDecrypt(privateKey, buffer);
    return decryptedData.toString('utf8');
}

// SHA256 hash function
function hashPassword(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}

function encryptPrivateKey(privateKey, passwordHashHex) {
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(passwordHashHex, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

// Function to decrypt private key using AES-256-CBC
function decryptPrivateKey(encryptedPrivateKey, passwordHashHex) {
    const parts = encryptedPrivateKey.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    const key = Buffer.from(passwordHashHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export {
    generateKeyPair,
    encryptData,
    decryptData,
    hashPassword,
    encryptPrivateKey,
    decryptPrivateKey
};


// // Tests
// console.log('Generating key pair...');
// const { publicKey, privateKey } = generateKeyPair();
// console.log('Key pair generated successfully!');

// console.log('Encrypting data...');
// const encryptedData = encryptData(publicKey, 'Hello, world!');
// console.log('Data encrypted successfully!');

// console.log('Decrypting data...');
// const decryptedData = decryptData(privateKey, encryptedData);
// console.log('Data decrypted successfully!: ', decryptedData);
// console.log('Data: ', decryptedData);

// console.log('Hashing data...');
// const hashedData = hashData('Hello, world!');
// console.log('Data hashed successfully!');

// console.log('Hashed Data: ', hashedData);
// console.log('Encrypting private key...');
// const encryptedPrivateKey = encryptPrivateKey(privateKey, hashData('password'));
// console.log('Private key encrypted successfully!');

// console.log('Decrypting private key...');
// const decryptedPrivateKey = decryptPrivateKey(encryptedPrivateKey, hashData('password'));
// console.log('Private key decrypted successfully!');

// // console.log('Private key: ', decryptedPrivateKey);
// console.log(privateKey);
// console.log('Decrypted Private Key: ', decryptedPrivateKey);