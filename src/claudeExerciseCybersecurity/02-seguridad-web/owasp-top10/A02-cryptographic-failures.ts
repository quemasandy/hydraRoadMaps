/**
 * OWASP A02:2021 - Cryptographic Failures
 * (antes "Sensitive Data Exposure")
 *
 * Fallas relacionadas con criptografía que llevan a exposición de datos sensibles.
 */

import * as crypto from 'crypto';

// VULNERABLE: Almacenar passwords en texto plano
class InsecurePasswordStorage {
    private passwords = new Map<string, string>();

    storePassword(username: string, password: string): void {
        this.passwords.set(username, password); // VULNERABLE!
        console.log(`[VULNERABLE] Password stored in plaintext`);
    }
}

// SEGURO: Usar PBKDF2/scrypt
class SecurePasswordStorage {
    private passwords = new Map<string, string>();

    storePassword(username: string, password: string): void {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
        this.passwords.set(username, `${salt}:${hash}`);
        console.log(`[SECURE] Password hashed with PBKDF2`);
    }

    verifyPassword(username: string, password: string): boolean {
        const stored = this.passwords.get(username);
        if (!stored) return false;

        const [salt, hash] = stored.split(':');
        const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
        return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash));
    }
}

// VULNERABLE: Transmisión sin cifrado
class InsecureDataTransmission {
    sendCreditCard(cardNumber: string): void {
        console.log(`[VULNERABLE] Sending ${cardNumber} over HTTP`);
        // Datos enviados sin cifrar
    }
}

// SEGURO: Siempre usar HTTPS/TLS
class SecureDataTransmission {
    sendCreditCard(cardNumber: string): void {
        console.log(`[SECURE] Sending encrypted data over HTTPS`);
        // En producción: usar HTTPS, no almacenar números completos de tarjeta
    }
}

if (require.main === module) {
    console.log('=== OWASP A02: Cryptographic Failures ===');
    console.log('\nMitigaciones:');
    console.log('✓ Usar algoritmos modernos (AES-256-GCM, ChaCha20)');
    console.log('✓ TLS 1.3 para datos en tránsito');
    console.log('✓ PBKDF2/scrypt/Argon2 para passwords');
    console.log('✓ No inventar criptografía propia');
}

export { SecurePasswordStorage, SecureDataTransmission };
