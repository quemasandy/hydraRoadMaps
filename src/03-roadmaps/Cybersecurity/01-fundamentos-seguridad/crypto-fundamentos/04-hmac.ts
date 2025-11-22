/**
 * HMAC (Hash-based Message Authentication Code)
 *
 * Combina hash criptográfico con clave secreta para proporcionar:
 * - Autenticación del mensaje (verificar remitente)
 * - Integridad del mensaje (detectar alteraciones)
 *
 * HMAC(key, message) = hash(key ⊕ opad || hash(key ⊕ ipad || message))
 *
 * Usos:
 * - API authentication (HMAC-SHA256 signatures)
 * - Verificación de integridad de datos
 * - JWT signatures
 * - Cookies seguras
 */

import * as crypto from 'crypto';

// ============================================================================
// VULNERABLE: Verificación sin HMAC
// ============================================================================

class InsecureMessageVerification {
    sendMessage(message: string): { message: string; checksum: string } {
        // VULNERABLE: Hash sin clave - puede ser falsificado
        const checksum = crypto.createHash('sha256').update(message).digest('hex');

        console.log('[INSEGURO] Usando hash simple para integridad');

        return { message, checksum };
    }

    verifyMessage(data: { message: string; checksum: string }): boolean {
        const computedChecksum = crypto
            .createHash('sha256')
            .update(data.message)
            .digest('hex');

        return computedChecksum === data.checksum;
    }
}

// ============================================================================
// SEGURO: HMAC para autenticación e integridad
// ============================================================================

class SecureHMAC {
    private key: Buffer;

    constructor(key?: Buffer) {
        this.key = key || crypto.randomBytes(32);
    }

    // Generar HMAC
    sign(message: string, algorithm: string = 'sha256'): string {
        const hmac = crypto.createHmac(algorithm, this.key);
        hmac.update(message, 'utf8');

        return hmac.digest('hex');
    }

    // Verificar HMAC de forma segura (timing-safe)
    verify(message: string, receivedMAC: string, algorithm: string = 'sha256'): boolean {
        const expectedMAC = this.sign(message, algorithm);

        // Usar comparación timing-safe para prevenir timing attacks
        try {
            return crypto.timingSafeEqual(
                Buffer.from(receivedMAC, 'hex'),
                Buffer.from(expectedMAC, 'hex')
            );
        } catch {
            return false; // Longitudes diferentes
        }
    }

    // Firmar múltiples campos
    signFields(fields: Record<string, any>): string {
        // Ordenar campos alfabéticamente para consistencia
        const sorted = Object.keys(fields)
            .sort()
            .map(key => `${key}=${fields[key]}`)
            .join('&');

        return this.sign(sorted);
    }

    getKey(): string {
        return this.key.toString('base64');
    }
}

// ============================================================================
// PATRÓN: API Request Signing
// ============================================================================

interface APIRequest {
    method: string;
    path: string;
    timestamp: number;
    body?: any;
}

class APIRequestSigner {
    private hmac: SecureHMAC;

    constructor(apiSecret: string) {
        // Derivar clave del API secret
        this.hmac = new SecureHMAC(Buffer.from(apiSecret, 'utf8'));
    }

    signRequest(request: APIRequest): {
        request: APIRequest;
        signature: string;
    } {
        // Crear string canónico del request
        const canonical = this.createCanonicalString(request);

        // Firmar con HMAC
        const signature = this.hmac.sign(canonical);

        console.log('[API] Request firmado con HMAC-SHA256');

        return { request, signature };
    }

    verifyRequest(
        request: APIRequest,
        signature: string,
        maxAge: number = 300000 // 5 minutos
    ): { valid: boolean; error?: string } {
        // Verificar timestamp para prevenir replay attacks
        const age = Date.now() - request.timestamp;

        if (age > maxAge) {
            return {
                valid: false,
                error: `Request demasiado antiguo (${age}ms > ${maxAge}ms)`
            };
        }

        if (age < -60000) {
            // Timestamp en el futuro (más de 1 min)
            return {
                valid: false,
                error: 'Timestamp en el futuro'
            };
        }

        // Verificar firma
        const canonical = this.createCanonicalString(request);

        if (!this.hmac.verify(canonical, signature)) {
            return {
                valid: false,
                error: 'Firma HMAC inválida'
            };
        }

        console.log('[API] ✓ Request verificado');

        return { valid: true };
    }

    private createCanonicalString(request: APIRequest): string {
        const parts = [
            request.method.toUpperCase(),
            request.path,
            request.timestamp.toString()
        ];

        if (request.body) {
            parts.push(JSON.stringify(request.body));
        }

        return parts.join('\n');
    }
}

// ============================================================================
// PATRÓN: Secure Cookies
// ============================================================================

interface CookieData {
    userId: string;
    sessionId: string;
    expires: number;
}

class SecureCookieManager {
    private hmac: SecureHMAC;

    constructor(secretKey: string) {
        this.hmac = new SecureHMAC(Buffer.from(secretKey, 'utf8'));
    }

    createCookie(data: CookieData): string {
        // Serializar datos
        const payload = Buffer.from(JSON.stringify(data)).toString('base64');

        // Firmar con HMAC
        const signature = this.hmac.sign(payload);

        // Cookie = payload.signature
        const cookie = `${payload}.${signature}`;

        console.log('[COOKIE] Cookie segura creada con HMAC');

        return cookie;
    }

    verifyCookie(cookie: string): {
        valid: boolean;
        data?: CookieData;
        error?: string;
    } {
        const parts = cookie.split('.');

        if (parts.length !== 2) {
            return { valid: false, error: 'Formato de cookie inválido' };
        }

        const [payload, signature] = parts;

        // Verificar firma
        if (!this.hmac.verify(payload, signature)) {
            console.log('[COOKIE] ✗ Firma inválida - cookie alterada');
            return { valid: false, error: 'Firma inválida' };
        }

        // Decodificar datos
        let data: CookieData;

        try {
            data = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
        } catch {
            return { valid: false, error: 'Datos corruptos' };
        }

        // Verificar expiración
        if (Date.now() > data.expires) {
            return { valid: false, error: 'Cookie expirada' };
        }

        console.log('[COOKIE] ✓ Cookie válida');

        return { valid: true, data };
    }
}

// ============================================================================
// TIMING ATTACK DEMONSTRATION
// ============================================================================

class TimingAttackDemo {
    // VULNERABLE: Comparación no timing-safe
    insecureCompare(a: string, b: string): boolean {
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false; // Sale inmediatamente al encontrar diferencia
            }
        }

        return true;
    }

    // SEGURO: Comparación timing-safe
    secureCompare(a: string, b: string): boolean {
        try {
            return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
        } catch {
            return false;
        }
    }

    demonstrateTimingDifference(): void {
        const correctMAC = '1234567890abcdef';

        console.log('\n=== TIMING ATTACK DEMONSTRATION ===\n');

        // Test insecure compare
        console.log('Comparación insegura (sale temprano):');

        const trials = [
            '0000000000000000', // Falla en primer carácter
            '1000000000000000', // Falla en segundo carácter
            '1230000000000000', // Falla en tercer carácter
            '1234567890abcdef'  // Coincide completo
        ];

        trials.forEach(attempt => {
            const start = process.hrtime.bigint();

            for (let i = 0; i < 10000; i++) {
                this.insecureCompare(correctMAC, attempt);
            }

            const end = process.hrtime.bigint();
            const elapsed = Number(end - start) / 1000000; // convertir a ms

            console.log(`  "${attempt}": ${elapsed.toFixed(2)}ms`);
        });

        console.log('\nProblema: Tiempos diferentes revelan información');
        console.log('Atacante puede adivinar MAC byte por byte\n');

        console.log('Comparación segura (tiempo constante):');

        trials.forEach(attempt => {
            const start = process.hrtime.bigint();

            for (let i = 0; i < 10000; i++) {
                this.secureCompare(correctMAC, attempt);
            }

            const end = process.hrtime.bigint();
            const elapsed = Number(end - start) / 1000000;

            console.log(`  "${attempt}": ${elapsed.toFixed(2)}ms`);
        });

        console.log('\nTodos los tiempos similares - sin fuga de información');
    }
}

// ============================================================================
// DEMOSTRACIÓN
// ============================================================================

function demonstrateHMAC(): void {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║                    HMAC                           ║');
    console.log('╚════════════════════════════════════════════════════╝');

    // 1. HMAC básico
    console.log('\n=== HMAC BÁSICO ===\n');

    const hmac = new SecureHMAC();
    const message = 'Transferir $1000 a cuenta 12345';

    const mac = hmac.sign(message);
    console.log(`Mensaje: ${message}`);
    console.log(`HMAC: ${mac}\n`);

    console.log('Verificación con mensaje original:');
    console.log(`  ${hmac.verify(message, mac) ? '✓ VÁLIDO' : '✗ INVÁLIDO'}\n`);

    console.log('Verificación con mensaje alterado:');
    const tamperedMessage = 'Transferir $9000 a cuenta 12345';
    console.log(`  ${hmac.verify(tamperedMessage, mac) ? '✓ VÁLIDO' : '✗ INVÁLIDO'}`);

    // 2. API Request Signing
    console.log('\n=== API REQUEST SIGNING ===\n');

    const signer = new APIRequestSigner('my-api-secret-key-2024');

    const apiRequest: APIRequest = {
        method: 'POST',
        path: '/api/transactions',
        timestamp: Date.now(),
        body: { amount: 1000, to: 'account-123' }
    };

    const signed = signer.signRequest(apiRequest);
    console.log(`Signature: ${signed.signature.substring(0, 40)}...\n`);

    // Verificar request legítimo
    console.log('Verificación de request legítimo:');
    const verification = signer.verifyRequest(signed.request, signed.signature);
    console.log(`  ${verification.valid ? '✓ VÁLIDO' : '✗ INVÁLIDO'}`);

    // Intentar replay attack con timestamp viejo
    console.log('\nIntento de replay attack (timestamp antiguo):');
    const oldRequest = { ...apiRequest, timestamp: Date.now() - 400000 };
    const oldVerification = signer.verifyRequest(oldRequest, signed.signature);
    console.log(`  ${oldVerification.valid ? '✓ VÁLIDO' : '✗ INVÁLIDO'}`);
    console.log(`  Error: ${oldVerification.error}`);

    // 3. Secure Cookies
    console.log('\n=== SECURE COOKIES ===\n');

    const cookieManager = new SecureCookieManager('cookie-secret-2024');

    const cookieData: CookieData = {
        userId: 'user-123',
        sessionId: 'session-abc',
        expires: Date.now() + 3600000 // 1 hora
    };

    const cookie = cookieManager.createCookie(cookieData);
    console.log(`Cookie: ${cookie.substring(0, 60)}...\n`);

    console.log('Verificación de cookie válida:');
    const cookieVerif = cookieManager.verifyCookie(cookie);
    console.log(`  ${cookieVerif.valid ? '✓ VÁLIDA' : '✗ INVÁLIDA'}`);
    if (cookieVerif.data) {
        console.log(`  User: ${cookieVerif.data.userId}`);
    }

    console.log('\nVerificación de cookie alterada:');
    const tamperedCookie = cookie.replace(/a/g, 'b');
    const tamperedVerif = cookieManager.verifyCookie(tamperedCookie);
    console.log(`  ${tamperedVerif.valid ? '✓ VÁLIDA' : '✗ INVÁLIDA'}`);
    console.log(`  Error: ${tamperedVerif.error}`);

    // 4. Timing Attack
    const timingDemo = new TimingAttackDemo();
    timingDemo.demonstrateTimingDifference();
}

if (require.main === module) {
    demonstrateHMAC();
}

export { SecureHMAC, APIRequestSigner, SecureCookieManager, TimingAttackDemo };
