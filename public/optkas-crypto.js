/* ═══════════════════════════════════════════════════════════
   OPTKAS Cryptographic Core — v1.20.0
   WebCrypto ECDSA P-256 keypair generation, PBKDF2 key
   derivation, AES-GCM encryption/decryption, SHA-256
   hashing, signature creation & verification.
   
   Mode 1: Local private mode (IndexedDB + encrypted storage)
   Mode 2 hooks: Clean interface for future server-side HSM
   ═══════════════════════════════════════════════════════════ */

window.OPTKAS_CRYPTO = (function () {
    'use strict';

    const CRYPTO_VERSION = '1.20.0';
    const ECDSA_PARAMS = { name: 'ECDSA', namedCurve: 'P-256' };
    const AES_KEY_LENGTH = 256;
    const PBKDF2_ITERATIONS = 600000; // OWASP 2023 recommendation
    const SALT_BYTES = 32;
    const IV_BYTES = 12; // AES-GCM standard
    const crypto = window.crypto || window.msCrypto;
    const subtle = crypto.subtle;

    // ─── Utility: ArrayBuffer ↔ Hex/Base64 ───
    function bufToHex(buf) {
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function hexToBuf(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes.buffer;
    }

    function bufToBase64(buf) {
        const bytes = new Uint8Array(buf);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    function base64ToBuf(b64) {
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    function strToUtf8(str) {
        return new TextEncoder().encode(str);
    }

    function utf8ToStr(buf) {
        return new TextDecoder().decode(buf);
    }

    // ─── SHA-256 ───
    async function sha256(data) {
        let buf;
        if (typeof data === 'string') {
            buf = strToUtf8(data);
        } else {
            buf = data;
        }
        const hashBuf = await subtle.digest('SHA-256', buf);
        return bufToHex(hashBuf);
    }

    // ─── ECDSA P-256 Key Generation ───
    async function generateKeyPair() {
        const keyPair = await subtle.generateKey(
            ECDSA_PARAMS,
            true, // extractable
            ['sign', 'verify']
        );
        return keyPair;
    }

    // Export public key as JWK
    async function exportPublicKey(publicKey) {
        return await subtle.exportKey('jwk', publicKey);
    }

    // Export private key as JWK
    async function exportPrivateKey(privateKey) {
        return await subtle.exportKey('jwk', privateKey);
    }

    // Import public key from JWK
    async function importPublicKey(jwk) {
        return await subtle.importKey(
            'jwk',
            jwk,
            ECDSA_PARAMS,
            true,
            ['verify']
        );
    }

    // Import private key from JWK
    async function importPrivateKey(jwk) {
        return await subtle.importKey(
            'jwk',
            jwk,
            ECDSA_PARAMS,
            true,
            ['sign']
        );
    }

    // ─── ECDSA Sign / Verify ───
    async function sign(privateKey, data) {
        const buf = typeof data === 'string' ? strToUtf8(data) : data;
        const sig = await subtle.sign(
            { name: 'ECDSA', hash: 'SHA-256' },
            privateKey,
            buf
        );
        return bufToBase64(sig);
    }

    async function verify(publicKey, signature, data) {
        const buf = typeof data === 'string' ? strToUtf8(data) : data;
        const sigBuf = base64ToBuf(signature);
        return await subtle.verify(
            { name: 'ECDSA', hash: 'SHA-256' },
            publicKey,
            sigBuf,
            buf
        );
    }

    // ─── PBKDF2 Key Derivation from Passphrase ───
    async function deriveKeyFromPassphrase(passphrase, salt) {
        const keyMaterial = await subtle.importKey(
            'raw',
            strToUtf8(passphrase),
            'PBKDF2',
            false,
            ['deriveKey']
        );

        const derivedKey = await subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: PBKDF2_ITERATIONS,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: AES_KEY_LENGTH },
            false,
            ['encrypt', 'decrypt']
        );

        return derivedKey;
    }

    // ─── AES-GCM Encryption ───
    async function encrypt(key, plaintext) {
        const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
        const buf = typeof plaintext === 'string' ? strToUtf8(plaintext) : plaintext;

        const cipherBuf = await subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            buf
        );

        // Return iv + ciphertext as base64
        return {
            iv: bufToBase64(iv),
            ciphertext: bufToBase64(cipherBuf)
        };
    }

    async function decrypt(key, encryptedObj) {
        const iv = base64ToBuf(encryptedObj.iv);
        const cipherBuf = base64ToBuf(encryptedObj.ciphertext);

        const plainBuf = await subtle.decrypt(
            { name: 'AES-GCM', iv: new Uint8Array(iv) },
            key,
            cipherBuf
        );

        return utf8ToStr(plainBuf);
    }

    // ─── Encrypt Private Key with Passphrase ───
    async function encryptPrivateKey(privateKeyJwk, passphrase) {
        const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
        const derivedKey = await deriveKeyFromPassphrase(passphrase, salt);
        const plaintext = JSON.stringify(privateKeyJwk);
        const encrypted = await encrypt(derivedKey, plaintext);

        return {
            salt: bufToBase64(salt),
            iv: encrypted.iv,
            ciphertext: encrypted.ciphertext,
            iterations: PBKDF2_ITERATIONS,
            algorithm: 'PBKDF2-AES-GCM-256',
            version: CRYPTO_VERSION
        };
    }

    async function decryptPrivateKey(encryptedBundle, passphrase) {
        const salt = base64ToBuf(encryptedBundle.salt);
        const derivedKey = await deriveKeyFromPassphrase(passphrase, new Uint8Array(salt));
        const plaintext = await decrypt(derivedKey, {
            iv: encryptedBundle.iv,
            ciphertext: encryptedBundle.ciphertext
        });
        return JSON.parse(plaintext);
    }

    // ─── Generate User ID ───
    async function generateUserId(email, createdAt) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const saltHex = bufToHex(salt);
        const hash = await sha256(email + '|' + createdAt + '|' + saltHex);
        return {
            userId: 'USER-' + hash.substring(0, 16),
            salt: saltHex
        };
    }

    // ─── Encrypt State Blob ───
    async function encryptState(stateObj, passphrase, salt) {
        const saltBuf = typeof salt === 'string' ? new Uint8Array(hexToBuf(salt)) : salt;
        const derivedKey = await deriveKeyFromPassphrase(passphrase, saltBuf);
        const plaintext = JSON.stringify(stateObj);
        return await encrypt(derivedKey, plaintext);
    }

    async function decryptState(encryptedObj, passphrase, salt) {
        const saltBuf = typeof salt === 'string' ? new Uint8Array(hexToBuf(salt)) : salt;
        const derivedKey = await deriveKeyFromPassphrase(passphrase, saltBuf);
        const plaintext = await decrypt(derivedKey, encryptedObj);
        return JSON.parse(plaintext);
    }

    // ─── Generate Random Bytes ───
    function randomBytes(count) {
        return crypto.getRandomValues(new Uint8Array(count));
    }

    console.log('[CRYPTO] OPTKAS Cryptographic Core v' + CRYPTO_VERSION + ' loaded.');

    // ─── Public API ───
    return {
        version: CRYPTO_VERSION,
        sha256: sha256,
        generateKeyPair: generateKeyPair,
        exportPublicKey: exportPublicKey,
        exportPrivateKey: exportPrivateKey,
        importPublicKey: importPublicKey,
        importPrivateKey: importPrivateKey,
        sign: sign,
        verify: verify,
        encryptPrivateKey: encryptPrivateKey,
        decryptPrivateKey: decryptPrivateKey,
        generateUserId: generateUserId,
        encryptState: encryptState,
        decryptState: decryptState,
        encrypt: encrypt,
        decrypt: decrypt,
        deriveKeyFromPassphrase: deriveKeyFromPassphrase,
        randomBytes: randomBytes,
        bufToHex: bufToHex,
        hexToBuf: hexToBuf,
        bufToBase64: bufToBase64,
        base64ToBuf: base64ToBuf
    };
})();
