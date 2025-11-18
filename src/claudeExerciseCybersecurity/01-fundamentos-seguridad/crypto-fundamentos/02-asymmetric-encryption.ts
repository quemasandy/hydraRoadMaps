/**
 * Cifrado Asimétrico (Asymmetric Encryption / Public Key Cryptography)
 *
 * Usa un par de claves: pública (encrypt) y privada (decrypt)
 *
 * Algoritmos:
 * - RSA (más común, pero lento)
 * - ECC/ECDH (Elliptic Curve - más eficiente)
 * - ElGamal
 *
 * Usos:
 * - Intercambio seguro de claves simétricas
 * - Firmas digitales
 * - TLS/SSL handshake
 */

import * as crypto from 'crypto';

// ============================================================================
// VULNERABLE: RSA sin padding adecuado
// ============================================================================

class InsecureRSANoPadding {
    private publicKey: string;
    private privateKey: string;

    constructor() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 1024, // VULNERABLE: muy corto
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });

        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }

    encrypt(plaintext: string): string {
        // VULNERABLE: Sin padding o padding débil
        const encrypted = crypto.publicEncrypt(
            {
                key: this.publicKey,
                padding: crypto.constants.RSA_NO_PADDING // INSEGURO
            },
            Buffer.from(plaintext)
        );

        console.log('[INSEGURO] RSA sin padding - vulnerable a ataques');
        return encrypted.toString('base64');
    }

    decrypt(encrypted: string): string {
        const decrypted = crypto.privateDecrypt(
            {
                key: this.privateKey,
                padding: crypto.constants.RSA_NO_PADDING
            },
            Buffer.from(encrypted, 'base64')
        );

        return decrypted.toString('utf8');
    }
}

// ============================================================================
// SEGURO: RSA con OAEP padding
// ============================================================================

class SecureRSAOAEP {
    private publicKey: string;
    private privateKey: string;

    constructor(keySize: number = 2048) {
        if (keySize < 2048) {
            console.warn('[ADVERTENCIA] Tamaño de clave < 2048 no recomendado');
        }

        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: keySize,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });

        this.publicKey = publicKey;
        this.privateKey = privateKey;

        console.log(`[SEGURO] RSA-${keySize} con OAEP padding generado`);
    }

    encrypt(plaintext: string): string {
        const encrypted = crypto.publicEncrypt(
            {
                key: this.publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, // SEGURO
                oaepHash: 'sha256'
            },
            Buffer.from(plaintext, 'utf8')
        );

        return encrypted.toString('base64');
    }

    decrypt(encrypted: string): string {
        const decrypted = crypto.privateDecrypt(
            {
                key: this.privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256'
            },
            Buffer.from(encrypted, 'base64')
        );

        return decrypted.toString('utf8');
    }

    getPublicKey(): string {
        return this.publicKey;
    }

    getPrivateKey(): string {
        console.log('[ADVERTENCIA] Exportando clave privada - proteger adecuadamente');
        return this.privateKey;
    }
}

// ============================================================================
// SEGURO: Elliptic Curve (más eficiente)
// ============================================================================

class SecureECDH {
    private privateKey: crypto.KeyObject;
    private publicKey: crypto.KeyObject;

    constructor(curve: string = 'secp256k1') {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
            namedCurve: curve // secp256k1 (Bitcoin), prime256v1 (común)
        });

        this.publicKey = publicKey;
        this.privateKey = privateKey;

        console.log(`[SEGURO] ECDH con curva ${curve} generado`);
    }

    // Derivar clave compartida (Diffie-Hellman con curvas elípticas)
    deriveSharedSecret(otherPublicKey: crypto.KeyObject): Buffer {
        const ecdh = crypto.createECDH('secp256k1');

        // Exportar nuestra clave privada
        const privateKeyDER = this.privateKey.export({
            type: 'sec1',
            format: 'der'
        });

        ecdh.setPrivateKey(privateKeyDER as Buffer);

        // Exportar clave pública de la otra parte
        const publicKeyDER = otherPublicKey.export({
            type: 'spki',
            format: 'der'
        });

        const sharedSecret = crypto.createECDH('secp256k1').computeSecret(
            publicKeyDER as Buffer
        );

        return sharedSecret;
    }

    getPublicKey(): crypto.KeyObject {
        return this.publicKey;
    }

    exportPublicKey(): string {
        return this.publicKey.export({ type: 'spki', format: 'pem' }).toString();
    }
}

// ============================================================================
// PATRÓN: Hybrid Encryption (RSA + AES)
// ============================================================================

/**
 * Cifrado híbrido: Combina ventajas de simétrico y asimétrico
 * 1. Generar clave AES aleatoria
 * 2. Cifrar datos con AES (rápido)
 * 3. Cifrar clave AES con RSA (seguro)
 * 4. Enviar: RSA(AESKey) + AES(Data)
 */
class HybridEncryption {
    private rsaPublicKey: string;
    private rsaPrivateKey: string;

    constructor(publicKey?: string, privateKey?: string) {
        if (publicKey && privateKey) {
            this.rsaPublicKey = publicKey;
            this.rsaPrivateKey = privateKey;
        } else {
            const rsa = new SecureRSAOAEP(2048);
            this.rsaPublicKey = rsa.getPublicKey();
            this.rsaPrivateKey = rsa.getPrivateKey();
        }
    }

    encrypt(plaintext: string): {
        encryptedData: string;
        encryptedKey: string;
        iv: string;
        authTag: string;
    } {
        // 1. Generar clave AES aleatoria
        const aesKey = crypto.randomBytes(32); // AES-256

        // 2. Cifrar datos con AES-GCM
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);

        let encryptedData = cipher.update(plaintext, 'utf8', 'hex');
        encryptedData += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        // 3. Cifrar clave AES con RSA
        const encryptedKey = crypto.publicEncrypt(
            {
                key: this.rsaPublicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256'
            },
            aesKey
        );

        console.log('[SEGURO] Cifrado híbrido: AES para datos, RSA para clave');

        return {
            encryptedData,
            encryptedKey: encryptedKey.toString('base64'),
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }

    decrypt(encrypted: {
        encryptedData: string;
        encryptedKey: string;
        iv: string;
        authTag: string;
    }): string {
        // 1. Descifrar clave AES con RSA
        const aesKey = crypto.privateDecrypt(
            {
                key: this.rsaPrivateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256'
            },
            Buffer.from(encrypted.encryptedKey, 'base64')
        );

        // 2. Descifrar datos con AES
        const iv = Buffer.from(encrypted.iv, 'hex');
        const authTag = Buffer.from(encrypted.authTag, 'hex');

        const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, iv);
        decipher.setAuthTag(authTag);

        let plaintext = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
        plaintext += decipher.final('utf8');

        console.log('[SEGURO] Descifrado híbrido exitoso');

        return plaintext;
    }
}

// ============================================================================
// DEMOSTRACIÓN
// ============================================================================

function demonstrateAsymmetricEncryption(): void {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║         ASYMMETRIC ENCRYPTION                     ║');
    console.log('╚════════════════════════════════════════════════════╝');

    const plaintext = 'Mensaje confidencial';

    // 1. RSA básico
    console.log('\n=== RSA con OAEP ===\n');
    const rsa = new SecureRSAOAEP(2048);

    const rsaEncrypted = rsa.encrypt(plaintext);
    console.log(`Cifrado (primeros 50 chars): ${rsaEncrypted.substring(0, 50)}...`);

    const rsaDecrypted = rsa.decrypt(rsaEncrypted);
    console.log(`Descifrado: ${rsaDecrypted}`);
    console.log(`✓ Verificación: ${rsaDecrypted === plaintext ? 'OK' : 'FAILED'}\n`);

    // 2. Cifrado híbrido
    console.log('=== HYBRID ENCRYPTION (RSA + AES) ===\n');

    const hybrid = new HybridEncryption();
    const largeData = 'Datos muy largos que serían ineficientes con RSA puro. '.repeat(100);

    console.log(`Tamaño de datos: ${largeData.length} bytes`);

    const start = Date.now();
    const hybridEncrypted = hybrid.encrypt(largeData);
    const encryptTime = Date.now() - start;

    console.log(`Tiempo de cifrado: ${encryptTime}ms`);
    console.log(`Clave cifrada (RSA): ${hybridEncrypted.encryptedKey.substring(0, 50)}...`);
    console.log(`Datos cifrados (AES): ${hybridEncrypted.encryptedData.substring(0, 50)}...`);

    const hybridDecrypted = hybrid.decrypt(hybridEncrypted);
    console.log(`✓ Verificación: ${hybridDecrypted === largeData ? 'OK' : 'FAILED'}\n`);

    // 3. Comparación de tamaños de clave
    console.log('=== COMPARACIÓN DE TAMAÑOS DE CLAVE ===\n');

    console.log('RSA:');
    console.log('  1024 bits: ❌ Inseguro (deprecado)');
    console.log('  2048 bits: ✅ Mínimo aceptable');
    console.log('  3072 bits: ✅ Recomendado para datos sensibles');
    console.log('  4096 bits: ✅ Máxima seguridad (más lento)\n');

    console.log('ECC (equivalencia de seguridad):');
    console.log('  256 bits (secp256r1): ≈ RSA 3072 bits');
    console.log('  384 bits (secp384r1): ≈ RSA 7680 bits');
    console.log('  521 bits (secp521r1): ≈ RSA 15360 bits\n');

    console.log('=== CASOS DE USO ===\n');

    console.log('Usar cifrado asimétrico para:');
    console.log('  ✅ Intercambio de claves simétricas');
    console.log('  ✅ Firmas digitales');
    console.log('  ✅ Autenticación (TLS certificates)');
    console.log('  ✅ Mensajes pequeños (<= 190 bytes para RSA-2048)\n');

    console.log('NO usar cifrado asimétrico para:');
    console.log('  ❌ Cifrar grandes volúmenes de datos');
    console.log('  ❌ Operaciones de alta frecuencia');
    console.log('  ❌ Cifrado en tiempo real de streams\n');

    console.log('Solución: Cifrado híbrido (RSA/ECC para clave + AES para datos)');
}

if (require.main === module) {
    demonstrateAsymmetricEncryption();
}

export { SecureRSAOAEP, SecureECDH, HybridEncryption };
