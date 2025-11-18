/**
 * Cifrado Simétrico (Symmetric Encryption)
 *
 * En el cifrado simétrico, la misma clave se usa para cifrar y descifrar.
 * Es rápido y eficiente para grandes volúmenes de datos.
 *
 * Algoritmos comunes:
 * - AES (Advanced Encryption Standard) - Más usado hoy
 * - DES (obsoleto, inseguro)
 * - 3DES (obsoleto)
 * - ChaCha20
 *
 * Modos de operación:
 * - ECB (NO usar - inseguro)
 * - CBC (requiere padding, vulnerable sin HMAC)
 * - GCM (recomendado - incluye autenticación)
 * - CTR (recomendado con HMAC separado)
 */

import * as crypto from 'crypto';

// ============================================================================
// VULNERABLE: Uso incorrecto de cifrado simétrico
// ============================================================================

/**
 * VULNERABLE: Uso de DES (algoritmo obsoleto e inseguro)
 */
class InsecureDESEncryption {
    private key: Buffer;

    constructor() {
        // DES usa claves de solo 56 bits efectivos - muy débil
        this.key = crypto.randomBytes(8);
    }

    encrypt(plaintext: string): string {
        const cipher = crypto.createCipheriv('des-ecb', this.key, null);
        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        console.log('[INSEGURO] Cifrado con DES (algoritmo débil)');
        return encrypted;
    }

    decrypt(encrypted: string): string {
        const decipher = crypto.createDecipheriv('des-ecb', this.key, null);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}

/**
 * VULNERABLE: Modo ECB (Electronic Codebook)
 * Problema: Bloques idénticos de texto plano producen bloques cifrados idénticos
 */
class InsecureECBMode {
    private key: Buffer;

    constructor() {
        this.key = crypto.randomBytes(32); // AES-256
    }

    encrypt(plaintext: string): string {
        // ECB mode - NO usar en producción
        const cipher = crypto.createCipheriv('aes-256-ecb', this.key, null);
        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        console.log('[INSEGURO] Modo ECB - patrones de texto visibles en cifrado');
        return encrypted;
    }

    decrypt(encrypted: string): string {
        const decipher = crypto.createDecipheriv('aes-256-ecb', this.key, null);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}

/**
 * VULNERABLE: Reutilización de IV (Initialization Vector)
 */
class InsecureIVReuse {
    private key: Buffer;
    private iv: Buffer; // IV fijo - INSEGURO

    constructor() {
        this.key = crypto.randomBytes(32);
        this.iv = crypto.randomBytes(16); // IV que nunca cambia
    }

    encrypt(plaintext: string): string {
        // VULNERABLE: Reutilizando el mismo IV
        const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv);
        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        console.log('[INSEGURO] Reutilizando IV - permite ataques de análisis');
        return encrypted;
    }
}

// ============================================================================
// SEGURO: Implementación correcta de cifrado simétrico
// ============================================================================

/**
 * SEGURO: AES-256-GCM (modo recomendado)
 * GCM = Galois/Counter Mode - incluye autenticación integrada
 */
class SecureAESGCM {
    private key: Buffer;

    constructor(key?: Buffer) {
        // AES-256 requiere clave de 32 bytes
        this.key = key || crypto.randomBytes(32);
    }

    encrypt(plaintext: string): {
        ciphertext: string;
        iv: string;
        authTag: string;
    } {
        // Generar IV único para cada operación
        const iv = crypto.randomBytes(12); // GCM recomienda 12 bytes

        const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);

        let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
        ciphertext += cipher.final('hex');

        // GCM proporciona tag de autenticación
        const authTag = cipher.getAuthTag();

        console.log('[SEGURO] Cifrado con AES-256-GCM');

        return {
            ciphertext,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }

    decrypt(encrypted: {
        ciphertext: string;
        iv: string;
        authTag: string;
    }): string {
        const iv = Buffer.from(encrypted.iv, 'hex');
        const authTag = Buffer.from(encrypted.authTag, 'hex');

        const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
        decipher.setAuthTag(authTag);

        let plaintext = decipher.update(encrypted.ciphertext, 'hex', 'utf8');
        plaintext += decipher.final('utf8');

        console.log('[SEGURO] Descifrado y verificación de autenticidad');

        return plaintext;
    }

    // Exportar clave de forma segura (debe cifrarse en producción)
    exportKey(): string {
        console.log('[ADVERTENCIA] Exportando clave - cifrar antes de almacenar');
        return this.key.toString('base64');
    }

    // Importar clave
    static fromKey(key: string): SecureAESGCM {
        const keyBuffer = Buffer.from(key, 'base64');

        if (keyBuffer.length !== 32) {
            throw new Error('Clave debe ser de 32 bytes (256 bits)');
        }

        return new SecureAESGCM(keyBuffer);
    }
}

/**
 * SEGURO: AES-256-CBC con HMAC (Encrypt-then-MAC)
 */
class SecureAESCBC {
    private encryptionKey: Buffer;
    private macKey: Buffer;

    constructor() {
        // Claves separadas para cifrado y MAC
        this.encryptionKey = crypto.randomBytes(32); // AES-256
        this.macKey = crypto.randomBytes(32); // HMAC-SHA256
    }

    encrypt(plaintext: string): {
        ciphertext: string;
        iv: string;
        mac: string;
    } {
        // IV único
        const iv = crypto.randomBytes(16); // CBC requiere 16 bytes

        const cipher = crypto.createCipheriv(
            'aes-256-cbc',
            this.encryptionKey,
            iv
        );

        let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
        ciphertext += cipher.final('hex');

        // Encrypt-then-MAC: Calcular HMAC sobre IV + ciphertext
        const dataToMac = Buffer.concat([
            iv,
            Buffer.from(ciphertext, 'hex')
        ]);

        const mac = crypto
            .createHmac('sha256', this.macKey)
            .update(dataToMac)
            .digest('hex');

        console.log('[SEGURO] AES-CBC con HMAC (Encrypt-then-MAC)');

        return {
            ciphertext,
            iv: iv.toString('hex'),
            mac
        };
    }

    decrypt(encrypted: {
        ciphertext: string;
        iv: string;
        mac: string;
    }): string {
        const iv = Buffer.from(encrypted.iv, 'hex');

        // Verificar MAC PRIMERO (antes de descifrar)
        const dataToMac = Buffer.concat([
            iv,
            Buffer.from(encrypted.ciphertext, 'hex')
        ]);

        const expectedMac = crypto
            .createHmac('sha256', this.macKey)
            .update(dataToMac)
            .digest('hex');

        if (
            !crypto.timingSafeEqual(
                Buffer.from(encrypted.mac, 'hex'),
                Buffer.from(expectedMac, 'hex')
            )
        ) {
            throw new Error('MAC verification failed - data tampered!');
        }

        // Solo descifrar si el MAC es válido
        const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            this.encryptionKey,
            iv
        );

        let plaintext = decipher.update(encrypted.ciphertext, 'hex', 'utf8');
        plaintext += decipher.final('utf8');

        console.log('[SEGURO] MAC verificado, descifrado exitoso');

        return plaintext;
    }
}

/**
 * SEGURO: ChaCha20-Poly1305 (alternativa moderna a AES-GCM)
 */
class SecureChaCha20 {
    private key: Buffer;

    constructor() {
        // ChaCha20 usa claves de 256 bits
        this.key = crypto.randomBytes(32);
    }

    encrypt(plaintext: string): {
        ciphertext: string;
        nonce: string;
        authTag: string;
    } {
        // Nonce único de 12 bytes
        const nonce = crypto.randomBytes(12);

        const cipher = crypto.createCipheriv(
            'chacha20-poly1305',
            this.key,
            nonce,
            { authTagLength: 16 }
        );

        let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
        ciphertext += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        console.log('[SEGURO] ChaCha20-Poly1305 (excelente para móviles)');

        return {
            ciphertext,
            nonce: nonce.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }

    decrypt(encrypted: {
        ciphertext: string;
        nonce: string;
        authTag: string;
    }): string {
        const nonce = Buffer.from(encrypted.nonce, 'hex');
        const authTag = Buffer.from(encrypted.authTag, 'hex');

        const decipher = crypto.createDecipheriv(
            'chacha20-poly1305',
            this.key,
            nonce,
            { authTagLength: 16 }
        );

        decipher.setAuthTag(authTag);

        let plaintext = decipher.update(encrypted.ciphertext, 'hex', 'utf8');
        plaintext += decipher.final('utf8');

        return plaintext;
    }
}

// ============================================================================
// COMPARACIÓN Y DEMOSTRACIÓN
// ============================================================================

function demonstrateECBWeakness(): void {
    console.log('\n=== DEMOSTRACIÓN: Debilidad de ECB ===\n');

    const ecb = new InsecureECBMode();

    // Texto con bloques repetidos
    const plaintext = 'HELLO WORLD '.repeat(5);

    const encrypted = ecb.encrypt(plaintext);

    console.log('Texto plano:', plaintext);
    console.log('Cifrado ECB:', encrypted);
    console.log('\nProblema: Bloques repetidos en texto plano producen');
    console.log('bloques repetidos en cifrado (visible en el hex)');
}

function compareEncryptionModes(): void {
    console.log('\n=== COMPARACIÓN DE ALGORITMOS ===\n');

    const plaintext = 'Datos confidenciales de la empresa';

    // 1. Inseguro: DES
    console.log('1. DES (INSEGURO):');
    const des = new InsecureDESEncryption();
    const desEncrypted = des.encrypt(plaintext);
    console.log(`   Cifrado: ${desEncrypted.substring(0, 40)}...`);
    console.log('   ❌ Clave de solo 56 bits - fácil de romper\n');

    // 2. Inseguro: ECB
    console.log('2. AES-ECB (INSEGURO):');
    const ecb = new InsecureECBMode();
    const ecbEncrypted = ecb.encrypt(plaintext);
    console.log(`   Cifrado: ${ecbEncrypted.substring(0, 40)}...`);
    console.log('   ❌ Patrones de texto visibles\n');

    // 3. Seguro: AES-GCM
    console.log('3. AES-256-GCM (RECOMENDADO):');
    const gcm = new SecureAESGCM();
    const gcmEncrypted = gcm.encrypt(plaintext);
    console.log(`   Cifrado: ${gcmEncrypted.ciphertext.substring(0, 40)}...`);
    console.log(`   IV: ${gcmEncrypted.iv}`);
    console.log(`   AuthTag: ${gcmEncrypted.authTag}`);
    console.log('   ✅ Cifrado + autenticación integrados\n');

    // 4. Seguro: AES-CBC + HMAC
    console.log('4. AES-256-CBC + HMAC (RECOMENDADO):');
    const cbc = new SecureAESCBC();
    const cbcEncrypted = cbc.encrypt(plaintext);
    console.log(`   Cifrado: ${cbcEncrypted.ciphertext.substring(0, 40)}...`);
    console.log(`   IV: ${cbcEncrypted.iv}`);
    console.log(`   MAC: ${cbcEncrypted.mac.substring(0, 40)}...`);
    console.log('   ✅ Encrypt-then-MAC pattern\n');

    // 5. Seguro: ChaCha20-Poly1305
    console.log('5. ChaCha20-Poly1305 (RECOMENDADO):');
    const chacha = new SecureChaCha20();
    const chachaEncrypted = chacha.encrypt(plaintext);
    console.log(`   Cifrado: ${chachaEncrypted.ciphertext.substring(0, 40)}...`);
    console.log(`   Nonce: ${chachaEncrypted.nonce}`);
    console.log(`   AuthTag: ${chachaEncrypted.authTag}`);
    console.log('   ✅ Rápido en software, sin AES-NI\n');

    // Verificar descifrado
    console.log('Verificación de descifrado:');
    const gcmDecrypted = gcm.decrypt(gcmEncrypted);
    console.log(`   ✓ AES-GCM: ${gcmDecrypted === plaintext ? 'OK' : 'FAILED'}`);

    const cbcDecrypted = cbc.decrypt(cbcEncrypted);
    console.log(`   ✓ AES-CBC+HMAC: ${cbcDecrypted === plaintext ? 'OK' : 'FAILED'}`);

    const chachaDecrypted = chacha.decrypt(chachaEncrypted);
    console.log(`   ✓ ChaCha20: ${chachaDecrypted === plaintext ? 'OK' : 'FAILED'}`);
}

function demonstrateAuthentication(): void {
    console.log('\n=== IMPORTANCIA DE LA AUTENTICACIÓN ===\n');

    const cbc = new SecureAESCBC();
    const plaintext = 'Transfer $100';

    const encrypted = cbc.encrypt(plaintext);

    console.log('Mensaje original cifrado:');
    console.log(`  "${plaintext}"`);

    console.log('\nAtacante modifica el cifrado:');
    const tamperedEncrypted = {
        ...encrypted,
        ciphertext: encrypted.ciphertext.replace(/a/g, 'b')
    };

    try {
        cbc.decrypt(tamperedEncrypted);
        console.log('  ❌ Descifrado exitoso (NO DEBERÍA PASAR)');
    } catch (error) {
        console.log('  ✅ MAC verification failed - alteración detectada!');
        console.log(`     Error: ${(error as Error).message}`);
    }
}

// ============================================================================
// DEMOSTRACIÓN
// ============================================================================

function demonstrateSymmetricEncryption(): void {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║           SYMMETRIC ENCRYPTION                    ║');
    console.log('╚════════════════════════════════════════════════════╝');

    demonstrateECBWeakness();
    compareEncryptionModes();
    demonstrateAuthentication();

    console.log('\n=== MEJORES PRÁCTICAS ===\n');

    console.log('✅ HACER:');
    console.log('  • Usar AES-256-GCM o ChaCha20-Poly1305');
    console.log('  • Generar IV/nonce único para cada mensaje');
    console.log('  • Usar cifrado autenticado (AEAD)');
    console.log('  • Proteger la clave de cifrado (HSM, KMS)');
    console.log('  • Rotar claves periódicamente\n');

    console.log('❌ NO HACER:');
    console.log('  • Usar DES, 3DES, RC4 (obsoletos)');
    console.log('  • Usar modo ECB');
    console.log('  • Reutilizar IV/nonce');
    console.log('  • Cifrar sin autenticación');
    console.log('  • Hardcodear claves en código');
}

// Ejecutar demostración
if (require.main === module) {
    demonstrateSymmetricEncryption();
}

export {
    SecureAESGCM,
    SecureAESCBC,
    SecureChaCha20
};
