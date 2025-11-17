/**
 * CIA Triad - Confidencialidad, Integridad y Disponibilidad
 *
 * El modelo CIA es el fundamento de la seguridad de la información:
 * - Confidencialidad: Solo personas autorizadas pueden acceder a la información
 * - Integridad: La información no debe ser alterada sin autorización
 * - Disponibilidad: La información debe estar accesible cuando se necesite
 */

import * as crypto from 'crypto';

// ============================================================================
// CONFIDENCIALIDAD (Confidentiality)
// ============================================================================

/**
 * VULNERABLE: Almacenamiento de datos sensibles sin cifrado
 * Problema: Los datos están expuestos en texto plano
 */
class InsecureDataStorage {
    private data: Map<string, string> = new Map();

    store(key: string, sensitiveData: string): void {
        // VULNERABLE: Datos almacenados en texto plano
        this.data.set(key, sensitiveData);
        console.log(`[INSEGURO] Datos almacenados: ${sensitiveData}`);
    }

    retrieve(key: string): string | undefined {
        return this.data.get(key);
    }
}

/**
 * SEGURO: Almacenamiento con cifrado para garantizar confidencialidad
 */
class SecureDataStorage {
    private data: Map<string, Buffer> = new Map();
    private encryptionKey: Buffer;

    constructor() {
        // Generar una clave de cifrado segura
        this.encryptionKey = crypto.randomBytes(32);
    }

    store(key: string, sensitiveData: string): void {
        // Generar un vector de inicialización único
        const iv = crypto.randomBytes(16);

        // Cifrar los datos usando AES-256-GCM
        const cipher = crypto.createCipheriv(
            'aes-256-gcm',
            this.encryptionKey,
            iv
        );

        let encrypted = cipher.update(sensitiveData, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Obtener el tag de autenticación
        const authTag = cipher.getAuthTag();

        // Almacenar IV + authTag + datos cifrados
        const combined = Buffer.concat([
            iv,
            authTag,
            Buffer.from(encrypted, 'hex')
        ]);

        this.data.set(key, combined);
        console.log('[SEGURO] Datos cifrados y almacenados');
    }

    retrieve(key: string): string | undefined {
        const combined = this.data.get(key);
        if (!combined) return undefined;

        // Extraer IV, authTag y datos cifrados
        const iv = combined.slice(0, 16);
        const authTag = combined.slice(16, 32);
        const encrypted = combined.slice(32);

        // Descifrar
        const decipher = crypto.createDecipheriv(
            'aes-256-gcm',
            this.encryptionKey,
            iv
        );
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}

// ============================================================================
// INTEGRIDAD (Integrity)
// ============================================================================

/**
 * VULNERABLE: Sin verificación de integridad
 * Problema: No podemos detectar si los datos fueron modificados
 */
class InsecureMessageTransmission {
    sendMessage(message: string): string {
        // VULNERABLE: Sin verificación de integridad
        return message;
    }

    receiveMessage(message: string): boolean {
        // No hay forma de verificar si el mensaje fue alterado
        console.log(`[INSEGURO] Mensaje recibido: ${message}`);
        return true;
    }
}

/**
 * SEGURO: Uso de HMAC para garantizar integridad
 */
class SecureMessageTransmission {
    private secretKey: Buffer;

    constructor() {
        this.secretKey = crypto.randomBytes(32);
    }

    sendMessage(message: string): { message: string; hmac: string } {
        // Generar HMAC para verificar integridad
        const hmac = crypto
            .createHmac('sha256', this.secretKey)
            .update(message)
            .digest('hex');

        return { message, hmac };
    }

    receiveMessage(data: { message: string; hmac: string }): boolean {
        // Verificar integridad del mensaje
        const expectedHmac = crypto
            .createHmac('sha256', this.secretKey)
            .update(data.message)
            .digest('hex');

        const isValid = crypto.timingSafeEqual(
            Buffer.from(data.hmac, 'hex'),
            Buffer.from(expectedHmac, 'hex')
        );

        if (isValid) {
            console.log('[SEGURO] Mensaje íntegro verificado');
        } else {
            console.log('[ALERTA] Mensaje ha sido alterado!');
        }

        return isValid;
    }
}

// ============================================================================
// DISPONIBILIDAD (Availability)
// ============================================================================

/**
 * VULNERABLE: Sin protección contra denegación de servicio
 * Problema: Un atacante puede agotar recursos fácilmente
 */
class InsecureService {
    private requestCount = 0;

    processRequest(userId: string): void {
        this.requestCount++;
        // VULNERABLE: Sin límite de tasa, vulnerable a DoS
        console.log(`[INSEGURO] Procesando solicitud ${this.requestCount} de ${userId}`);

        // Simular procesamiento intensivo
        this.heavyComputation();
    }

    private heavyComputation(): void {
        // Operación costosa sin límites
        for (let i = 0; i < 1000000; i++) {
            Math.sqrt(i);
        }
    }
}

/**
 * SEGURO: Rate limiting para garantizar disponibilidad
 */
interface RateLimitEntry {
    count: number;
    resetTime: number;
}

class SecureService {
    private rateLimits: Map<string, RateLimitEntry> = new Map();
    private readonly MAX_REQUESTS = 10;
    private readonly WINDOW_MS = 60000; // 1 minuto

    processRequest(userId: string): { success: boolean; message: string } {
        const now = Date.now();
        const userLimit = this.rateLimits.get(userId);

        // Verificar rate limit
        if (userLimit) {
            if (now < userLimit.resetTime) {
                if (userLimit.count >= this.MAX_REQUESTS) {
                    return {
                        success: false,
                        message: '[SEGURO] Rate limit excedido. Intente más tarde.'
                    };
                }
                userLimit.count++;
            } else {
                // Reiniciar ventana
                this.rateLimits.set(userId, {
                    count: 1,
                    resetTime: now + this.WINDOW_MS
                });
            }
        } else {
            // Primer request del usuario
            this.rateLimits.set(userId, {
                count: 1,
                resetTime: now + this.WINDOW_MS
            });
        }

        console.log('[SEGURO] Solicitud procesada dentro de límites');
        return { success: true, message: 'Solicitud procesada correctamente' };
    }
}

// ============================================================================
// DEMOSTRACIÓN
// ============================================================================

function demonstrateCIATriad(): void {
    console.log('\n=== DEMOSTRACIÓN DEL CIA TRIAD ===\n');

    // 1. CONFIDENCIALIDAD
    console.log('--- 1. CONFIDENCIALIDAD ---');

    console.log('\nVulnerable:');
    const insecureStorage = new InsecureDataStorage();
    insecureStorage.store('user1', 'contraseña123');
    console.log('Datos recuperados:', insecureStorage.retrieve('user1'));

    console.log('\nSeguro:');
    const secureStorage = new SecureDataStorage();
    secureStorage.store('user1', 'contraseña123');
    console.log('Datos recuperados:', secureStorage.retrieve('user1'));

    // 2. INTEGRIDAD
    console.log('\n--- 2. INTEGRIDAD ---');

    console.log('\nVulnerable:');
    const insecureTransmission = new InsecureMessageTransmission();
    let message = insecureTransmission.sendMessage('Transferir $100');
    // Atacante modifica el mensaje
    message = 'Transferir $10000';
    insecureTransmission.receiveMessage(message);

    console.log('\nSeguro:');
    const secureTransmission = new SecureMessageTransmission();
    const secureMessage = secureTransmission.sendMessage('Transferir $100');

    // Mensaje legítimo
    console.log('\nMensaje original:');
    secureTransmission.receiveMessage(secureMessage);

    // Intento de modificación
    console.log('\nMensaje modificado:');
    const tamperedMessage = {
        message: 'Transferir $10000',
        hmac: secureMessage.hmac
    };
    secureTransmission.receiveMessage(tamperedMessage);

    // 3. DISPONIBILIDAD
    console.log('\n--- 3. DISPONIBILIDAD ---');

    console.log('\nVulnerable (simulando ataque DoS):');
    const insecureService = new InsecureService();
    console.log('Atacante enviando múltiples requests...');
    for (let i = 0; i < 3; i++) {
        insecureService.processRequest('attacker');
    }

    console.log('\nSeguro (con rate limiting):');
    const secureService = new SecureService();
    console.log('Enviando requests dentro del límite:');
    for (let i = 0; i < 12; i++) {
        const result = secureService.processRequest('user1');
        if (!result.success) {
            console.log(`Request ${i + 1}: ${result.message}`);
        }
    }
}

// Ejecutar demostración
if (require.main === module) {
    demonstrateCIATriad();
}

export {
    InsecureDataStorage,
    SecureDataStorage,
    InsecureMessageTransmission,
    SecureMessageTransmission,
    InsecureService,
    SecureService
};
