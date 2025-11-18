/**
 * Funciones Hash Criptográficas (Cryptographic Hash Functions)
 *
 * Propiedades:
 * - Determinista: mismo input → mismo output
 * - Unidireccional: imposible revertir
 * - Resistencia a colisiones: difícil encontrar dos inputs con mismo hash
 * - Efecto avalancha: pequeño cambio → hash completamente diferente
 *
 * Algoritmos:
 * - MD5: ❌ Roto, no usar
 * - SHA-1: ❌ Débil, deprecado
 * - SHA-256: ✅ Estándar actual
 * - SHA-3: ✅ Alternativa moderna
 * - BLAKE2/BLAKE3: ✅ Muy rápidos
 */

import * as crypto from 'crypto';

// ============================================================================
// VULNERABLE: Algoritmos hash débiles
// ============================================================================

class InsecureHashing {
    // MD5 - ROTO desde 2004
    md5(data: string): string {
        console.log('[INSEGURO] MD5 - vulnerable a colisiones');
        return crypto.createHash('md5').update(data).digest('hex');
    }

    // SHA-1 - Deprecado desde 2017
    sha1(data: string): string {
        console.log('[INSEGURO] SHA-1 - ataques de colisión prácticos');
        return crypto.createHash('sha1').update(data).digest('hex');
    }

    // Hash simple sin salt para passwords - TERRIBLE
    hashPasswordNoSalt(password: string): string {
        console.log('[INSEGURO] Hash de password sin salt - vulnerable a rainbow tables');
        return crypto.createHash('sha256').update(password).digest('hex');
    }
}

// ============================================================================
// SEGURO: Hashing moderno
// ============================================================================

class SecureHashing {
    // SHA-256 para integridad de datos
    sha256(data: string | Buffer): string {
        const hash = crypto.createHash('sha256');

        if (typeof data === 'string') {
            hash.update(data, 'utf8');
        } else {
            hash.update(data);
        }

        return hash.digest('hex');
    }

    // SHA-512 para mayor seguridad
    sha512(data: string | Buffer): string {
        const hash = crypto.createHash('sha512');

        if (typeof data === 'string') {
            hash.update(data, 'utf8');
        } else {
            hash.update(data);
        }

        return hash.digest('hex');
    }

    // SHA3-256 (algoritmo Keccak)
    sha3_256(data: string): string {
        return crypto.createHash('sha3-256').update(data, 'utf8').digest('hex');
    }

    // BLAKE2 (más rápido que SHA-2)
    blake2s256(data: string): string {
        return crypto.createHash('blake2s256').update(data, 'utf8').digest('hex');
    }

    // Verificar integridad de archivo
    hashFile(filePath: string, algorithm: string = 'sha256'): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash(algorithm);
            const fs = require('fs');
            const stream = fs.createReadStream(filePath);

            stream.on('data', (chunk: Buffer) => hash.update(chunk));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', reject);
        });
    }
}

// ============================================================================
// PASSWORD HASHING - Nunca usar hash simple
// ============================================================================

/**
 * VULNERABLE: Hash simple de passwords
 */
class InsecurePasswordHashing {
    private passwords: Map<string, string> = new Map();

    register(username: string, password: string): void {
        // VULNERABLE: SHA-256 simple, sin salt, sin key derivation
        const hash = crypto.createHash('sha256').update(password).digest('hex');

        this.passwords.set(username, hash);

        console.log('[INSEGURO] Password hasheado con SHA-256 simple');
        console.log('  Vulnerable a: rainbow tables, GPU cracking, precomputación');
    }

    verify(username: string, password: string): boolean {
        const storedHash = this.passwords.get(username);
        if (!storedHash) return false;

        const inputHash = crypto.createHash('sha256').update(password).digest('hex');

        return storedHash === inputHash;
    }
}

/**
 * SEGURO: PBKDF2 (Password-Based Key Derivation Function 2)
 */
class SecurePBKDF2 {
    private passwords: Map<string, string> = new Map();
    private readonly ITERATIONS = 100000; // OWASP recomienda >= 100,000
    private readonly KEYLEN = 64;
    private readonly DIGEST = 'sha512';

    hashPassword(password: string): string {
        const salt = crypto.randomBytes(16).toString('hex');

        const hash = crypto
            .pbkdf2Sync(password, salt, this.ITERATIONS, this.KEYLEN, this.DIGEST)
            .toString('hex');

        // Almacenar: iteraciones:salt:hash
        return `${this.ITERATIONS}:${salt}:${hash}`;
    }

    verifyPassword(password: string, storedHash: string): boolean {
        const [iterations, salt, hash] = storedHash.split(':');

        const verifyHash = crypto
            .pbkdf2Sync(
                password,
                salt,
                parseInt(iterations),
                this.KEYLEN,
                this.DIGEST
            )
            .toString('hex');

        return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash));
    }
}

/**
 * SEGURO: scrypt (más resistente a hardware especializado)
 */
class SecureScrypt {
    private readonly SALT_SIZE = 16;
    private readonly KEYLEN = 64;
    private readonly OPTIONS = {
        N: 16384, // CPU/memoria cost (2^14)
        r: 8,     // block size
        p: 1,     // parallelization
        maxmem: 32 * 1024 * 1024 // 32 MB
    };

    hashPassword(password: string): string {
        const salt = crypto.randomBytes(this.SALT_SIZE);

        const hash = crypto.scryptSync(password, salt, this.KEYLEN, this.OPTIONS);

        // Almacenar salt + hash
        const combined = Buffer.concat([salt, hash]);

        console.log('[SEGURO] Password hasheado con scrypt');

        return combined.toString('base64');
    }

    verifyPassword(password: string, storedHash: string): boolean {
        const combined = Buffer.from(storedHash, 'base64');

        const salt = combined.slice(0, this.SALT_SIZE);
        const hash = combined.slice(this.SALT_SIZE);

        const verifyHash = crypto.scryptSync(
            password,
            salt,
            this.KEYLEN,
            this.OPTIONS
        );

        return crypto.timingSafeEqual(hash, verifyHash);
    }
}

// ============================================================================
// CASOS DE USO
// ============================================================================

/**
 * Verificación de integridad de datos
 */
class DataIntegrityChecker {
    private checksums: Map<string, string> = new Map();
    private hasher = new SecureHashing();

    storeChecksum(dataId: string, data: string): void {
        const checksum = this.hasher.sha256(data);
        this.checksums.set(dataId, checksum);

        console.log(`[INTEGRIDAD] Checksum almacenado para ${dataId}`);
        console.log(`  SHA-256: ${checksum}`);
    }

    verifyIntegrity(dataId: string, data: string): boolean {
        const expectedChecksum = this.checksums.get(dataId);

        if (!expectedChecksum) {
            console.log('[INTEGRIDAD] Sin checksum almacenado');
            return false;
        }

        const actualChecksum = this.hasher.sha256(data);

        if (actualChecksum === expectedChecksum) {
            console.log('[INTEGRIDAD] ✓ Datos íntegros');
            return true;
        }

        console.log('[INTEGRIDAD] ✗ DATOS ALTERADOS!');
        console.log(`  Esperado: ${expectedChecksum}`);
        console.log(`  Actual:   ${actualChecksum}`);

        return false;
    }
}

/**
 * Proof of Work (similar a blockchain)
 */
class ProofOfWork {
    // Encontrar nonce tal que hash(data + nonce) comience con N ceros
    findNonce(data: string, difficulty: number): {
        nonce: number;
        hash: string;
        attempts: number;
    } {
        const target = '0'.repeat(difficulty);
        let nonce = 0;

        while (true) {
            const hash = crypto
                .createHash('sha256')
                .update(data + nonce)
                .digest('hex');

            if (hash.startsWith(target)) {
                console.log(`[POW] Nonce encontrado: ${nonce}`);
                console.log(`      Hash: ${hash}`);
                console.log(`      Intentos: ${nonce + 1}`);

                return { nonce, hash, attempts: nonce + 1 };
            }

            nonce++;

            if (nonce > 1000000) {
                throw new Error('PoW: demasiados intentos');
            }
        }
    }

    verify(data: string, nonce: number, difficulty: number): boolean {
        const hash = crypto
            .createHash('sha256')
            .update(data + nonce)
            .digest('hex');

        return hash.startsWith('0'.repeat(difficulty));
    }
}

// ============================================================================
// DEMOSTRACIÓN
// ============================================================================

function demonstrateHashing(): void {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║          CRYPTOGRAPHIC HASH FUNCTIONS             ║');
    console.log('╚════════════════════════════════════════════════════╝');

    // 1. Comparación de algoritmos
    console.log('\n=== COMPARACIÓN DE ALGORITMOS ===\n');

    const data = 'Datos de ejemplo';
    const hasher = new SecureHashing();
    const insecure = new InsecureHashing();

    console.log(`Input: "${data}"\n`);

    console.log('MD5 (INSEGURO):');
    console.log(`  ${insecure.md5(data)}`);
    console.log('  128 bits - ROTO\n');

    console.log('SHA-1 (INSEGURO):');
    console.log(`  ${insecure.sha1(data)}`);
    console.log('  160 bits - Deprecado\n');

    console.log('SHA-256 (SEGURO):');
    console.log(`  ${hasher.sha256(data)}`);
    console.log('  256 bits - Estándar actual\n');

    console.log('SHA-512 (SEGURO):');
    console.log(`  ${hasher.sha512(data)}`);
    console.log('  512 bits - Máxima seguridad\n');

    // 2. Efecto avalancha
    console.log('=== EFECTO AVALANCHA ===\n');

    const original = 'Hello World';
    const modified = 'Hello World!'; // Un carácter diferente

    const hashOriginal = hasher.sha256(original);
    const hashModified = hasher.sha256(modified);

    console.log(`Original: "${original}"`);
    console.log(`  ${hashOriginal}`);
    console.log(`\nModified: "${modified}"`);
    console.log(`  ${hashModified}`);
    console.log('\nUn solo carácter cambia el hash completamente\n');

    // 3. Password hashing
    console.log('=== PASSWORD HASHING ===\n');

    const password = 'MySecurePassword123!';

    console.log('Inseguro (SHA-256 simple):');
    const insecurePass = new InsecurePasswordHashing();
    insecurePass.register('alice', password);

    console.log('\nSeguro (PBKDF2):');
    const pbkdf2 = new SecurePBKDF2();
    const pbkdf2Hash = pbkdf2.hashPassword(password);
    console.log(`  Hash: ${pbkdf2Hash.substring(0, 50)}...`);
    console.log('  ✓ Incluye salt único');
    console.log('  ✓ 100,000 iteraciones');

    console.log('\nSeguro (scrypt):');
    const scrypt = new SecureScrypt();
    const scryptHash = scrypt.hashPassword(password);
    console.log(`  Hash: ${scryptHash.substring(0, 50)}...`);
    console.log('  ✓ Resistente a GPUs/ASICs');

    // 4. Integridad de datos
    console.log('\n=== VERIFICACIÓN DE INTEGRIDAD ===\n');

    const integrity = new DataIntegrityChecker();
    const document = 'Contrato legal importante';

    integrity.storeChecksum('contract-001', document);

    console.log('\nVerificación con datos originales:');
    integrity.verifyIntegrity('contract-001', document);

    console.log('\nVerificación con datos modificados:');
    integrity.verifyIntegrity('contract-001', document + ' MODIFICADO');

    // 5. Proof of Work
    console.log('\n=== PROOF OF WORK (blockchain-style) ===\n');

    const pow = new ProofOfWork();
    const blockData = 'Transaction: Alice -> Bob 10 BTC';

    console.log('Buscando nonce con dificultad 4 (hash debe comenzar con 0000)...\n');

    const result = pow.findNonce(blockData, 4);

    console.log(`\nVerificación: ${pow.verify(blockData, result.nonce, 4) ? 'VÁLIDO' : 'INVÁLIDO'}`);
}

if (require.main === module) {
    demonstrateHashing();
}

export {
    SecureHashing,
    SecurePBKDF2,
    SecureScrypt,
    DataIntegrityChecker,
    ProofOfWork
};
