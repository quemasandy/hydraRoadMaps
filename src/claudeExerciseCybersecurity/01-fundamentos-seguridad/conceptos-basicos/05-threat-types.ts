/**
 * Tipos de Amenazas de Seguridad (Threat Types)
 *
 * Clasificación de amenazas comunes en ciberseguridad:
 *
 * 1. SPOOFING (Suplantación): Hacerse pasar por otra entidad
 * 2. TAMPERING (Alteración): Modificar datos sin autorización
 * 3. REPUDIATION (Repudio): Negar haber realizado una acción
 * 4. INFORMATION DISCLOSURE (Divulgación): Exponer información confidencial
 * 5. DENIAL OF SERVICE (DoS): Impedir acceso a recursos
 * 6. ELEVATION OF PRIVILEGE (Escalada): Obtener permisos no autorizados
 *
 * Estas 6 categorías forman el modelo STRIDE (Microsoft)
 */

import * as crypto from 'crypto';

// ============================================================================
// 1. SPOOFING (Suplantación de Identidad)
// ============================================================================

/**
 * VULNERABLE: Sin verificación de identidad
 * Problema: Un atacante puede suplantar a otro usuario
 */
class InsecureEmailSystem {
    sendEmail(from: string, to: string, subject: string, body: string): void {
        // VULNERABLE: No verifica que 'from' sea realmente quien dice ser
        console.log(`
[INSEGURO - EMAIL SPOOFING]
From: ${from}
To: ${to}
Subject: ${subject}
Body: ${body}
        `);
    }
}

/**
 * SEGURO: Verificación criptográfica de identidad
 */
class SecureEmailSystem {
    private userKeys: Map<string, { publicKey: string; privateKey: string }> = new Map();

    constructor() {
        // Generar pares de llaves para usuarios
        this.generateKeyPairForUser('alice@example.com');
        this.generateKeyPairForUser('bob@example.com');
    }

    private generateKeyPairForUser(email: string): void {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });

        this.userKeys.set(email, { publicKey, privateKey });
    }

    sendEmail(from: string, to: string, subject: string, body: string): void {
        const keys = this.userKeys.get(from);

        if (!keys) {
            console.log('[SEGURO] Email rechazado: remitente no registrado');
            return;
        }

        // Firmar el mensaje con la clave privada del remitente
        const sign = crypto.createSign('SHA256');
        sign.update(subject + body);
        const signature = sign.sign(keys.privateKey, 'base64');

        console.log(`
[SEGURO - EMAIL FIRMADO]
From: ${from} ✓ (firmado digitalmente)
To: ${to}
Subject: ${subject}
Signature: ${signature.substring(0, 40)}...
        `);
    }

    verifyEmail(from: string, subject: string, body: string, signature: string): boolean {
        const keys = this.userKeys.get(from);

        if (!keys) {
            return false;
        }

        const verify = crypto.createVerify('SHA256');
        verify.update(subject + body);

        return verify.verify(keys.publicKey, signature, 'base64');
    }
}

// ============================================================================
// 2. TAMPERING (Alteración de Datos)
// ============================================================================

/**
 * VULNERABLE: Datos sin protección de integridad
 */
class InsecureDataTransfer {
    transferData(data: string): string {
        // VULNERABLE: Sin verificación de integridad
        console.log(`[INSEGURO - TAMPERING] Datos enviados: ${data}`);
        return data;
    }

    receiveData(data: string): void {
        // No hay forma de saber si los datos fueron alterados
        console.log(`[INSEGURO] Datos recibidos: ${data}`);
    }
}

/**
 * SEGURO: Protección de integridad con HMAC
 */
class SecureDataTransfer {
    private integrityKey: Buffer;

    constructor() {
        this.integrityKey = crypto.randomBytes(32);
    }

    transferData(data: string): { data: string; hmac: string } {
        const hmac = crypto
            .createHmac('sha256', this.integrityKey)
            .update(data)
            .digest('hex');

        console.log(`[SEGURO - ANTI-TAMPERING] Datos enviados con HMAC`);

        return { data, hmac };
    }

    receiveData(payload: { data: string; hmac: string }): {
        valid: boolean;
        data?: string;
    } {
        const expectedHmac = crypto
            .createHmac('sha256', this.integrityKey)
            .update(payload.data)
            .digest('hex');

        if (
            crypto.timingSafeEqual(
                Buffer.from(payload.hmac),
                Buffer.from(expectedHmac)
            )
        ) {
            console.log('[SEGURO] ✓ Datos íntegros, no fueron alterados');
            return { valid: true, data: payload.data };
        }

        console.log('[SEGURO] ✗ ALERTA: Datos fueron alterados!');
        return { valid: false };
    }
}

// ============================================================================
// 3. REPUDIATION (Repudio/No-Repudio)
// ============================================================================

/**
 * VULNERABLE: Sin registro de auditoría
 * Problema: Los usuarios pueden negar haber realizado acciones
 */
class InsecureTransactionSystem {
    processTransaction(userId: string, amount: number): void {
        // VULNERABLE: Sin registro permanente
        console.log(`[INSEGURO - REPUDIATION] Usuario ${userId} transfirió $${amount}`);
    }
}

/**
 * SEGURO: Sistema de auditoría con firma digital
 */
interface AuditEntry {
    timestamp: number;
    userId: string;
    action: string;
    details: string;
    signature: string;
}

class SecureTransactionSystem {
    private auditLog: AuditEntry[] = [];
    private signingKey: Buffer;

    constructor() {
        this.signingKey = crypto.randomBytes(32);
    }

    processTransaction(userId: string, amount: number): void {
        const entry: Omit<AuditEntry, 'signature'> = {
            timestamp: Date.now(),
            userId,
            action: 'TRANSFER',
            details: `Transferred $${amount}`
        };

        // Crear firma criptográfica de la entrada
        const signature = this.signEntry(entry);

        const auditEntry: AuditEntry = { ...entry, signature };
        this.auditLog.push(auditEntry);

        console.log(
            `[SEGURO - NON-REPUDIATION] ` +
            `Transacción registrada y firmada para ${userId}`
        );
    }

    private signEntry(entry: Omit<AuditEntry, 'signature'>): string {
        const data = JSON.stringify(entry);
        return crypto.createHmac('sha256', this.signingKey).update(data).digest('hex');
    }

    verifyAuditLog(): { valid: boolean; tamperedEntries: number[] } {
        const tamperedEntries: number[] = [];

        this.auditLog.forEach((entry, index) => {
            const { signature, ...entryData } = entry;
            const expectedSignature = this.signEntry(entryData);

            if (signature !== expectedSignature) {
                tamperedEntries.push(index);
            }
        });

        return {
            valid: tamperedEntries.length === 0,
            tamperedEntries
        };
    }

    getAuditLog(): AuditEntry[] {
        return [...this.auditLog];
    }
}

// ============================================================================
// 4. INFORMATION DISCLOSURE (Divulgación de Información)
// ============================================================================

/**
 * VULNERABLE: Exposición de información sensible
 */
class InsecureErrorHandler {
    processPayment(cardNumber: string, amount: number): void {
        try {
            if (cardNumber.length !== 16) {
                throw new Error(
                    `Invalid card number: ${cardNumber}. ` +
                    `Must be 16 digits. User attempted payment of $${amount}`
                );
            }
        } catch (error) {
            // VULNERABLE: Expone información sensible en el error
            console.log(`[INSEGURO - INFO DISCLOSURE] Error: ${(error as Error).message}`);
        }
    }
}

/**
 * SEGURO: Manejo de errores sin exponer información sensible
 */
class SecureErrorHandler {
    private logSecure(level: string, details: string): void {
        // Log detallado solo en sistemas internos seguros
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            details: details // Contiene información sensible
        };
        // En producción: enviar a sistema de logging seguro
        // console.log('[INTERNAL LOG]', logEntry);
    }

    processPayment(cardNumber: string, amount: number): {
        success: boolean;
        message: string;
    } {
        try {
            if (cardNumber.length !== 16) {
                // Log interno con detalles
                this.logSecure(
                    'ERROR',
                    `Invalid card number length: ${cardNumber.length} for amount $${amount}`
                );

                // Mensaje genérico al usuario
                return {
                    success: false,
                    message: 'Pago rechazado. Verifique sus datos.'
                };
            }

            console.log('[SEGURO - NO DISCLOSURE] Pago procesado sin exponer datos');

            return { success: true, message: 'Pago exitoso' };
        } catch (error) {
            // Error genérico al usuario
            this.logSecure('ERROR', `Payment error: ${(error as Error).message}`);

            return {
                success: false,
                message: 'Error procesando el pago. Intente más tarde.'
            };
        }
    }
}

// ============================================================================
// 5. DENIAL OF SERVICE (DoS)
// ============================================================================

/**
 * VULNERABLE: Sin protección contra DoS
 */
class InsecureWebServer {
    private requestCount = 0;

    handleRequest(request: string): void {
        this.requestCount++;

        // VULNERABLE: Procesa todas las peticiones sin límite
        const result = this.expensiveOperation(request);

        console.log(`[INSEGURO - DoS] Request ${this.requestCount} processed`);
    }

    private expensiveOperation(data: string): string {
        // Operación costosa
        let result = '';
        for (let i = 0; i < 100000; i++) {
            result += crypto.createHash('sha256').update(data + i).digest('hex');
        }
        return result;
    }
}

/**
 * SEGURO: Protección contra DoS con rate limiting y resource limits
 */
class SecureWebServer {
    private requestsByIP: Map<string, { count: number; resetTime: number }> = new Map();
    private readonly MAX_REQUESTS_PER_MINUTE = 10;
    private readonly REQUEST_TIMEOUT = 5000; // 5 segundos

    handleRequest(ip: string, request: string): {
        success: boolean;
        message: string;
    } {
        // Rate limiting
        if (!this.checkRateLimit(ip)) {
            console.log(`[SEGURO - DoS PROTECTION] Rate limit exceeded for ${ip}`);
            return {
                success: false,
                message: 'Too many requests. Please try again later.'
            };
        }

        // Resource limiting con timeout
        try {
            const result = this.performWithTimeout(
                () => this.expensiveOperation(request),
                this.REQUEST_TIMEOUT
            );

            console.log('[SEGURO] Request processed within limits');

            return { success: true, message: 'Request processed' };
        } catch (error) {
            console.log('[SEGURO] Request timed out - resource protection');

            return {
                success: false,
                message: 'Request timeout. Please try a simpler operation.'
            };
        }
    }

    private checkRateLimit(ip: string): boolean {
        const now = Date.now();
        const ipData = this.requestsByIP.get(ip);

        if (!ipData) {
            this.requestsByIP.set(ip, { count: 1, resetTime: now + 60000 });
            return true;
        }

        if (now > ipData.resetTime) {
            ipData.count = 1;
            ipData.resetTime = now + 60000;
            return true;
        }

        if (ipData.count >= this.MAX_REQUESTS_PER_MINUTE) {
            return false;
        }

        ipData.count++;
        return true;
    }

    private performWithTimeout<T>(operation: () => T, timeout: number): T {
        // Simulación simplificada de timeout
        // En producción, usar Promise.race con setTimeout
        return operation();
    }

    private expensiveOperation(data: string): string {
        // Operación limitada
        const iterations = Math.min(1000, data.length * 10);
        let result = '';

        for (let i = 0; i < iterations; i++) {
            result += crypto.createHash('sha256').update(data + i).digest('hex');
        }

        return result;
    }
}

// ============================================================================
// 6. ELEVATION OF PRIVILEGE (Escalada de Privilegios)
// ============================================================================

/**
 * VULNERABLE: Escalada de privilegios por validación incorrecta
 */
class InsecureAdminPanel {
    performAdminAction(userId: string, isAdmin: boolean): void {
        // VULNERABLE: Confía en el parámetro isAdmin del cliente
        if (isAdmin) {
            console.log(`[INSEGURO - PRIVILEGE ESCALATION] ${userId} ejecutó acción de admin`);
            this.deleteAllUsers();
        }
    }

    private deleteAllUsers(): void {
        console.log('[INSEGURO] ¡Todos los usuarios eliminados!');
    }
}

/**
 * SEGURO: Verificación de privilegios del lado del servidor
 */
enum UserRole {
    GUEST = 0,
    USER = 1,
    MODERATOR = 2,
    ADMIN = 3
}

interface SecureUserData {
    userId: string;
    role: UserRole;
    sessionToken: string;
}

class SecureAdminPanel {
    private users: Map<string, { role: UserRole; sessionToken: string }> = new Map();

    constructor() {
        // Usuarios de prueba
        this.users.set('alice', {
            role: UserRole.ADMIN,
            sessionToken: this.generateToken()
        });
        this.users.set('bob', {
            role: UserRole.USER,
            sessionToken: this.generateToken()
        });
    }

    performAdminAction(userId: string, sessionToken: string): {
        success: boolean;
        message: string;
    } {
        // Verificar sesión válida
        const userData = this.users.get(userId);

        if (!userData) {
            console.log('[SEGURO] Usuario no encontrado');
            return { success: false, message: 'Unauthorized' };
        }

        if (userData.sessionToken !== sessionToken) {
            console.log('[SEGURO] Token de sesión inválido');
            return { success: false, message: 'Invalid session' };
        }

        // Verificar privilegios del lado del servidor
        if (userData.role !== UserRole.ADMIN) {
            console.log(
                `[SEGURO - PRIVILEGE CHECK] ` +
                `${userId} (role: ${UserRole[userData.role]}) ` +
                `intentó acción de admin - DENEGADO`
            );

            return {
                success: false,
                message: 'Insufficient privileges'
            };
        }

        console.log(`[SEGURO] ${userId} ejecutó acción de admin (privilegios verificados)`);
        this.deleteAllUsers();

        return { success: true, message: 'Admin action completed' };
    }

    private deleteAllUsers(): void {
        console.log('[SEGURO] Acción de admin ejecutada correctamente');
    }

    private generateToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }
}

// ============================================================================
// DEMOSTRACIÓN
// ============================================================================

function demonstrateThreatTypes(): void {
    console.log('\n=== TIPOS DE AMENAZAS (STRIDE) ===\n');

    // 1. SPOOFING
    console.log('--- 1. SPOOFING (Suplantación) ---\n');

    const insecureEmail = new InsecureEmailSystem();
    insecureEmail.sendEmail(
        'ceo@company.com',
        'employee@company.com',
        'URGENT: Wire Transfer',
        'Please transfer $100,000 immediately'
    );
    console.log('Problema: Cualquiera puede afirmar ser el CEO\n');

    const secureEmail = new SecureEmailSystem();
    secureEmail.sendEmail(
        'alice@example.com',
        'bob@example.com',
        'Meeting Tomorrow',
        'Lets meet at 3pm'
    );

    // 2. TAMPERING
    console.log('\n--- 2. TAMPERING (Alteración) ---\n');

    const secureTransfer = new SecureDataTransfer();
    const payload = secureTransfer.transferData('Transfer $100 to Bob');

    console.log('\nAtacante intenta alterar los datos:');
    const tamperedPayload = {
        data: 'Transfer $10000 to Attacker',
        hmac: payload.hmac
    };
    secureTransfer.receiveData(tamperedPayload);

    console.log('\nDatos originales:');
    secureTransfer.receiveData(payload);

    // 3. REPUDIATION
    console.log('\n--- 3. REPUDIATION (Repudio) ---\n');

    const secureTx = new SecureTransactionSystem();
    secureTx.processTransaction('alice', 1000);
    secureTx.processTransaction('bob', 500);

    console.log('\nVerificando integridad del log de auditoría:');
    const verification = secureTx.verifyAuditLog();
    console.log(`Auditoría válida: ${verification.valid}`);

    // 4. INFORMATION DISCLOSURE
    console.log('\n--- 4. INFORMATION DISCLOSURE ---\n');

    console.log('Sistema inseguro:');
    new InsecureErrorHandler().processPayment('1234', 100);

    console.log('\nSistema seguro:');
    const secureHandler = new SecureErrorHandler();
    console.log(secureHandler.processPayment('1234', 100));

    // 5. DENIAL OF SERVICE
    console.log('\n--- 5. DENIAL OF SERVICE ---\n');

    const secureServer = new SecureWebServer();

    console.log('Simulando ataque DoS:');
    for (let i = 0; i < 12; i++) {
        const result = secureServer.handleRequest('192.168.1.100', 'request');
        if (!result.success) {
            console.log(`Request ${i + 1}: ${result.message}`);
        }
    }

    // 6. ELEVATION OF PRIVILEGE
    console.log('\n--- 6. ELEVATION OF PRIVILEGE ---\n');

    const secureAdmin = new SecureAdminPanel();
    const bobToken = 'wrong-token';

    console.log('Usuario regular intenta acción de admin:');
    const result = secureAdmin.performAdminAction('bob', bobToken);
    console.log(`Resultado: ${result.message}`);
}

// Ejecutar demostración
if (require.main === module) {
    demonstrateThreatTypes();
}

export {
    SecureEmailSystem,
    SecureDataTransfer,
    SecureTransactionSystem,
    SecureErrorHandler,
    SecureWebServer,
    SecureAdminPanel,
    UserRole
};
