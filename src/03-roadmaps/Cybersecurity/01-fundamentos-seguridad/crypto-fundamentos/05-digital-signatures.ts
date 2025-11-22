/**
 * Firmas Digitales (Digital Signatures)
 *
 * Proporcionan:
 * - Autenticación: Verifica quién firmó
 * - Integridad: Detecta alteraciones
 * - No-repudio: El firmante no puede negar haber firmado
 *
 * Algoritmos:
 * - RSA-PSS: Basado en RSA
 * - ECDSA: Basado en curvas elípticas (más eficiente)
 * - EdDSA (Ed25519): Moderno, rápido, seguro
 *
 * Flujo:
 * 1. Firmar: hash(mensaje) + cifrar con clave privada = firma
 * 2. Verificar: descifrar firma con clave pública + comparar con hash(mensaje)
 */

import * as crypto from 'crypto';

// ============================================================================
// VULNERABLE: Sin firmas digitales
// ============================================================================

class InsecureDocumentSystem {
    sendDocument(author: string, content: string): { author: string; content: string } {
        // VULNERABLE: Sin prueba criptográfica de autoría
        console.log(`[INSEGURO] Documento enviado por "${author}" (no verificable)`);
        return { author, content };
    }

    verifyDocument(doc: { author: string; content: string }): boolean {
        // No hay forma de verificar que realmente fue autor quien lo creó
        console.log(`[INSEGURO] Aceptando documento de "${doc.author}" sin verificación`);
        return true;
    }
}

// ============================================================================
// SEGURO: RSA Digital Signatures
// ============================================================================

class RSADigitalSignature {
    private publicKey: string;
    private privateKey: string;

    constructor(keySize: number = 2048) {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: keySize,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });

        this.publicKey = publicKey;
        this.privateKey = privateKey;

        console.log(`[SEGURO] RSA-${keySize} key pair generado para firmas`);
    }

    // Firmar mensaje
    sign(message: string, algorithm: string = 'sha256'): string {
        const sign = crypto.createSign(algorithm);
        sign.update(message, 'utf8');
        sign.end();

        const signature = sign.sign(this.privateKey, 'base64');

        console.log('[FIRMA] Mensaje firmado con RSA');

        return signature;
    }

    // Verificar firma
    verify(message: string, signature: string, algorithm: string = 'sha256'): boolean {
        const verify = crypto.createVerify(algorithm);
        verify.update(message, 'utf8');
        verify.end();

        const isValid = verify.verify(this.publicKey, signature, 'base64');

        console.log(`[VERIFICAR] Firma ${isValid ? 'VÁLIDA ✓' : 'INVÁLIDA ✗'}`);

        return isValid;
    }

    getPublicKey(): string {
        return this.publicKey;
    }

    // Verificar con clave pública externa
    static verifyWithPublicKey(
        message: string,
        signature: string,
        publicKey: string,
        algorithm: string = 'sha256'
    ): boolean {
        const verify = crypto.createVerify(algorithm);
        verify.update(message, 'utf8');
        verify.end();

        return verify.verify(publicKey, signature, 'base64');
    }
}

// ============================================================================
// SEGURO: ECDSA (Elliptic Curve Digital Signature Algorithm)
// ============================================================================

class ECDSASignature {
    private publicKey: crypto.KeyObject;
    private privateKey: crypto.KeyObject;

    constructor(curve: string = 'secp256k1') {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
            namedCurve: curve // secp256k1 (Bitcoin), prime256v1 (común)
        });

        this.publicKey = publicKey;
        this.privateKey = privateKey;

        console.log(`[SEGURO] ECDSA con curva ${curve} generado`);
    }

    sign(message: string): string {
        const sign = crypto.createSign('sha256');
        sign.update(message, 'utf8');
        sign.end();

        const signature = sign.sign(this.privateKey, 'base64');

        console.log('[FIRMA] Mensaje firmado con ECDSA');

        return signature;
    }

    verify(message: string, signature: string): boolean {
        const verify = crypto.createVerify('sha256');
        verify.update(message, 'utf8');
        verify.end();

        const isValid = verify.verify(this.publicKey, signature, 'base64');

        console.log(`[VERIFICAR] Firma ECDSA ${isValid ? 'VÁLIDA ✓' : 'INVÁLIDA ✗'}`);

        return isValid;
    }

    exportPublicKey(): string {
        return this.publicKey.export({ type: 'spki', format: 'pem' }).toString();
    }
}

// ============================================================================
// SEGURO: Ed25519 (EdDSA) - Recomendado para nuevos sistemas
// ============================================================================

class Ed25519Signature {
    private publicKey: crypto.KeyObject;
    private privateKey: crypto.KeyObject;

    constructor() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');

        this.publicKey = publicKey;
        this.privateKey = privateKey;

        console.log('[SEGURO] Ed25519 key pair generado (firma moderna y rápida)');
    }

    sign(message: string): string {
        const signature = crypto.sign(null, Buffer.from(message, 'utf8'), this.privateKey);

        console.log('[FIRMA] Mensaje firmado con Ed25519');

        return signature.toString('base64');
    }

    verify(message: string, signature: string): boolean {
        const isValid = crypto.verify(
            null,
            Buffer.from(message, 'utf8'),
            this.publicKey,
            Buffer.from(signature, 'base64')
        );

        console.log(`[VERIFICAR] Firma Ed25519 ${isValid ? 'VÁLIDA ✓' : 'INVÁLIDA ✗'}`);

        return isValid;
    }

    exportPublicKey(): string {
        return this.publicKey.export({ type: 'spki', format: 'pem' }).toString();
    }

    exportPrivateKey(): string {
        console.log('[ADVERTENCIA] Exportando clave privada - proteger adecuadamente');
        return this.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
    }
}

// ============================================================================
// APLICACIÓN: Sistema de firmade documentos legales
// ============================================================================

interface SignedDocument {
    content: string;
    author: string;
    timestamp: number;
    signature: string;
    publicKey: string;
}

class DocumentSigningSystem {
    private userKeys: Map<string, RSADigitalSignature> = new Map();

    registerUser(username: string): RSADigitalSignature {
        const signer = new RSADigitalSignature(2048);
        this.userKeys.set(username, signer);

        console.log(`[REGISTRO] Usuario ${username} registrado con clave RSA`);

        return signer;
    }

    signDocument(username: string, content: string): SignedDocument {
        const signer = this.userKeys.get(username);

        if (!signer) {
            throw new Error(`Usuario ${username} no registrado`);
        }

        const document = {
            content,
            author: username,
            timestamp: Date.now()
        };

        // Firmar contenido + timestamp
        const dataToSign = JSON.stringify(document);
        const signature = signer.sign(dataToSign);

        console.log(`[DOCUMENTO] Firmado por ${username}`);

        return {
            ...document,
            signature,
            publicKey: signer.getPublicKey()
        };
    }

    verifyDocument(doc: SignedDocument): {
        valid: boolean;
        author?: string;
        timestamp?: Date;
        error?: string;
    } {
        // Reconstruir datos que fueron firmados
        const { signature, publicKey, ...documentData } = doc;
        const dataToVerify = JSON.stringify(documentData);

        // Verificar firma con clave pública incluida
        const isValid = RSADigitalSignature.verifyWithPublicKey(
            dataToVerify,
            signature,
            publicKey
        );

        if (!isValid) {
            return {
                valid: false,
                error: 'Firma inválida - documento alterado o falsificado'
            };
        }

        console.log(`[VERIFICACIÓN] ✓ Documento verificado como auténtico`);
        console.log(`  Autor: ${doc.author}`);
        console.log(`  Fecha: ${new Date(doc.timestamp).toISOString()}`);

        return {
            valid: true,
            author: doc.author,
            timestamp: new Date(doc.timestamp)
        };
    }
}

// ============================================================================
// APLICACIÓN: Code Signing (firma de software)
// ============================================================================

interface SignedCode {
    code: string;
    version: string;
    hash: string;
    signature: string;
    publisher: string;
}

class CodeSigningSystem {
    private publisherKey: Ed25519Signature;
    private publisherName: string;

    constructor(publisherName: string) {
        this.publisherName = publisherName;
        this.publisherKey = new Ed25519Signature();

        console.log(`[CODE SIGNING] Publisher "${publisherName}" inicializado`);
    }

    signCode(code: string, version: string): SignedCode {
        // Hash del código
        const hash = crypto.createHash('sha256').update(code, 'utf8').digest('hex');

        // Datos a firmar
        const manifest = {
            hash,
            version,
            publisher: this.publisherName,
            timestamp: Date.now()
        };

        const signature = this.publisherKey.sign(JSON.stringify(manifest));

        console.log(`[CODE SIGN] Código v${version} firmado`);
        console.log(`  Hash: ${hash.substring(0, 16)}...`);

        return {
            code,
            version,
            hash,
            signature,
            publisher: this.publisherName
        };
    }

    verifyCode(signedCode: SignedCode): {
        valid: boolean;
        trusted: boolean;
        hash?: string;
        error?: string;
    } {
        // Verificar hash del código
        const computedHash = crypto
            .createHash('sha256')
            .update(signedCode.code, 'utf8')
            .digest('hex');

        if (computedHash !== signedCode.hash) {
            return {
                valid: false,
                trusted: false,
                error: 'Hash no coincide - código alterado'
            };
        }

        // Verificar firma
        const manifest = {
            hash: signedCode.hash,
            version: signedCode.version,
            publisher: signedCode.publisher,
            timestamp: Date.now() // En producción, extraer del manifest
        };

        const isValid = this.publisherKey.verify(
            JSON.stringify(manifest),
            signedCode.signature
        );

        if (!isValid) {
            return {
                valid: false,
                trusted: false,
                error: 'Firma inválida'
            };
        }

        // Verificar publisher confiable (en producción: lista de CAs confiables)
        const trusted = signedCode.publisher === this.publisherName;

        console.log(`[CODE VERIFY] ✓ Código verificado`);
        console.log(`  Publisher: ${signedCode.publisher}`);
        console.log(`  Trusted: ${trusted ? 'SÍ' : 'NO'}`);

        return {
            valid: true,
            trusted,
            hash: computedHash
        };
    }

    getPublicKey(): string {
        return this.publisherKey.exportPublicKey();
    }
}

// ============================================================================
// DEMOSTRACIÓN
// ============================================================================

function demonstrateDigitalSignatures(): void {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║            DIGITAL SIGNATURES                     ║');
    console.log('╚════════════════════════════════════════════════════╝');

    // 1. Comparación de algoritmos
    console.log('\n=== COMPARACIÓN DE ALGORITMOS ===\n');

    const message = 'Documento importante para firmar';

    console.log('RSA-2048:');
    const rsa = new RSADigitalSignature(2048);
    const rsaSig = rsa.sign(message);
    console.log(`  Signature length: ${rsaSig.length} chars`);
    rsa.verify(message, rsaSig);

    console.log('\nECDSA (secp256k1):');
    const ecdsa = new ECDSASignature('secp256k1');
    const ecdsaSig = ecdsa.sign(message);
    console.log(`  Signature length: ${ecdsaSig.length} chars`);
    ecdsa.verify(message, ecdsaSig);

    console.log('\nEd25519:');
    const ed25519 = new Ed25519Signature();
    const edSig = ed25519.sign(message);
    console.log(`  Signature length: ${edSig.length} chars`);
    ed25519.verify(message, edSig);

    // 2. Sistema de firma de documentos
    console.log('\n=== FIRMA DE DOCUMENTOS LEGALES ===\n');

    const docSystem = new DocumentSigningSystem();

    // Registrar usuarios
    docSystem.registerUser('alice');
    docSystem.registerUser('bob');

    // Alice firma contrato
    const contract = docSystem.signDocument(
        'alice',
        'Contrato de compra-venta: Casa en calle Principal por $500,000'
    );

    console.log(`\nDocumento firmado:`);
    console.log(`  Content: ${contract.content.substring(0, 50)}...`);
    console.log(`  Author: ${contract.author}`);
    console.log(`  Signature: ${contract.signature.substring(0, 40)}...\n`);

    // Verificar documento auténtico
    console.log('Verificación de documento original:');
    docSystem.verifyDocument(contract);

    // Intentar alterar documento
    console.log('\nIntento de alteración:');
    const tamperedContract = {
        ...contract,
        content: contract.content.replace('$500,000', '$100,000')
    };

    const verification = docSystem.verifyDocument(tamperedContract);
    console.log(`  Resultado: ${verification.error}\n`);

    // 3. Code signing
    console.log('=== CODE SIGNING ===\n');

    const publisher = new CodeSigningSystem('TrustedSoftware Inc.');

    const sourceCode = `
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
`;

    const signedCode = publisher.signCode(sourceCode, '1.0.0');

    console.log('Verificación de código firmado:');
    publisher.verifyCode(signedCode);

    console.log('\nIntento de ejecutar código alterado:');
    const tamperedCode = {
        ...signedCode,
        code: signedCode.code.replace('sum + item.price', 'sum + 0') // Backdoor
    };

    const codeVerif = publisher.verifyCode(tamperedCode);
    console.log(`  ${codeVerif.error}`);

    console.log('\n=== VENTAJAS DE FIRMAS DIGITALES ===\n');

    console.log('✓ Autenticación: Prueba quién creó/aprobó el documento');
    console.log('✓ Integridad: Detecta cualquier alteración');
    console.log('✓ No-repudio: El firmante no puede negar haber firmado');
    console.log('✓ Confianza: Basado en matemáticas, no en procesos manuales');
}

if (require.main === module) {
    demonstrateDigitalSignatures();
}

export {
    RSADigitalSignature,
    ECDSASignature,
    Ed25519Signature,
    DocumentSigningSystem,
    CodeSigningSystem
};
