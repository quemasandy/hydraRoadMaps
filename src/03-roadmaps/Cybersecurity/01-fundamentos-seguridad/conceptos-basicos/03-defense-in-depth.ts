/**
 * Defensa en Profundidad (Defense in Depth)
 *
 * Estrategia de seguridad multicapa que usa múltiples controles de seguridad
 * para proteger recursos. Si una capa falla, otras capas siguen protegiendo.
 *
 * Capas típicas:
 * 1. Perímetro (Firewall, IDS/IPS)
 * 2. Red (Segmentación, VPN)
 * 3. Host (Antivirus, Hardening)
 * 4. Aplicación (Input validation, autenticación)
 * 5. Datos (Cifrado, backup)
 */

import * as crypto from 'crypto';

// ============================================================================
// VULNERABLE: Seguridad de una sola capa
// ============================================================================

/**
 * VULNERABLE: Solo una capa de protección (contraseña simple)
 * Si la contraseña se compromete, el sistema está completamente expuesto
 */
class SingleLayerSecurity {
    private users: Map<string, string> = new Map();

    register(username: string, password: string): void {
        // VULNERABLE: Sin validación, sin cifrado, sin MFA
        this.users.set(username, password);
        console.log(`[INSEGURO] Usuario ${username} registrado`);
    }

    login(username: string, password: string): boolean {
        const storedPassword = this.users.get(username);

        if (storedPassword === password) {
            console.log(`[INSEGURO] Login exitoso para ${username}`);
            return true;
        }

        console.log(`[INSEGURO] Login fallido para ${username}`);
        return false;
    }
}

// ============================================================================
// SEGURO: Defensa en profundidad multicapa
// ============================================================================

/**
 * Capa 1: Validación de entrada
 */
class InputValidator {
    static validateUsername(username: string): { valid: boolean; error?: string } {
        // Validar longitud
        if (username.length < 3 || username.length > 20) {
            return {
                valid: false,
                error: 'Username debe tener entre 3 y 20 caracteres'
            };
        }

        // Validar caracteres permitidos
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return {
                valid: false,
                error: 'Username solo puede contener letras, números y _'
            };
        }

        return { valid: true };
    }

    static validatePassword(password: string): { valid: boolean; error?: string } {
        // Validar longitud
        if (password.length < 12) {
            return {
                valid: false,
                error: 'Contraseña debe tener al menos 12 caracteres'
            };
        }

        // Validar complejidad
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars)) {
            return {
                valid: false,
                error: 'Contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales'
            };
        }

        return { valid: true };
    }

    static sanitizeInput(input: string): string {
        // Eliminar caracteres peligrosos para prevenir inyección
        return input.replace(/[<>\"\'%;()&+]/g, '');
    }
}

/**
 * Capa 2: Cifrado y hashing
 */
class CryptoLayer {
    static hashPassword(password: string): string {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto
            .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
            .toString('hex');

        return `${salt}:${hash}`;
    }

    static verifyPassword(password: string, storedHash: string): boolean {
        const [salt, hash] = storedHash.split(':');
        const verifyHash = crypto
            .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
            .toString('hex');

        return crypto.timingSafeEqual(
            Buffer.from(hash),
            Buffer.from(verifyHash)
        );
    }

    static encryptData(data: string, key: Buffer): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    }

    static decryptData(encryptedData: string, key: Buffer): string {
        const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');

        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}

/**
 * Capa 3: Rate limiting y protección contra brute force
 */
class RateLimiter {
    private attempts: Map<string, { count: number; resetTime: number }> = new Map();
    private readonly MAX_ATTEMPTS = 5;
    private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos
    private readonly RESET_WINDOW = 5 * 60 * 1000; // 5 minutos

    checkRateLimit(identifier: string): { allowed: boolean; message?: string } {
        const now = Date.now();
        const userAttempts = this.attempts.get(identifier);

        if (!userAttempts) {
            // Primer intento
            this.attempts.set(identifier, {
                count: 1,
                resetTime: now + this.RESET_WINDOW
            });
            return { allowed: true };
        }

        // Verificar si está bloqueado
        if (userAttempts.count >= this.MAX_ATTEMPTS) {
            const timeRemaining = Math.ceil(
                (userAttempts.resetTime - now) / 1000
            );

            if (now < userAttempts.resetTime) {
                return {
                    allowed: false,
                    message: `Cuenta bloqueada. Intente en ${timeRemaining} segundos`
                };
            }

            // Reiniciar después del bloqueo
            this.attempts.set(identifier, {
                count: 1,
                resetTime: now + this.RESET_WINDOW
            });
            return { allowed: true };
        }

        // Incrementar contador
        userAttempts.count++;

        if (userAttempts.count >= this.MAX_ATTEMPTS) {
            userAttempts.resetTime = now + this.LOCKOUT_DURATION;
            return {
                allowed: false,
                message: `Demasiados intentos. Cuenta bloqueada por 15 minutos`
            };
        }

        return { allowed: true };
    }

    recordSuccess(identifier: string): void {
        // Limpiar intentos después de login exitoso
        this.attempts.delete(identifier);
    }
}

/**
 * Capa 4: Autenticación multifactor (MFA)
 */
class MFAProvider {
    private mfaSecrets: Map<string, string> = new Map();

    generateMFASecret(username: string): string {
        const secret = crypto.randomBytes(20).toString('hex');
        this.mfaSecrets.set(username, secret);
        return secret;
    }

    generateTOTP(username: string): string {
        const secret = this.mfaSecrets.get(username);
        if (!secret) {
            throw new Error('MFA no configurado para este usuario');
        }

        // Simulación simplificada de TOTP (Time-based OTP)
        const timestamp = Math.floor(Date.now() / 30000);
        const hash = crypto
            .createHmac('sha1', secret)
            .update(timestamp.toString())
            .digest('hex');

        // Tomar los últimos 6 dígitos
        const code = parseInt(hash.slice(-6), 16) % 1000000;
        return code.toString().padStart(6, '0');
    }

    verifyTOTP(username: string, code: string): boolean {
        try {
            const expectedCode = this.generateTOTP(username);
            return crypto.timingSafeEqual(
                Buffer.from(code),
                Buffer.from(expectedCode)
            );
        } catch {
            return false;
        }
    }
}

/**
 * Capa 5: Auditoría y logging
 */
interface AuditLog {
    timestamp: Date;
    username: string;
    action: string;
    success: boolean;
    ipAddress?: string;
    details?: string;
}

class AuditLogger {
    private logs: AuditLog[] = [];

    log(entry: Omit<AuditLog, 'timestamp'>): void {
        const logEntry: AuditLog = {
            timestamp: new Date(),
            ...entry
        };

        this.logs.push(logEntry);

        console.log(
            `[AUDIT] ${logEntry.timestamp.toISOString()} - ` +
            `${logEntry.username} - ${logEntry.action} - ` +
            `${logEntry.success ? 'SUCCESS' : 'FAILURE'}` +
            (logEntry.details ? ` - ${logEntry.details}` : '')
        );
    }

    getRecentFailures(username: string, minutes: number = 60): AuditLog[] {
        const since = new Date(Date.now() - minutes * 60 * 1000);

        return this.logs.filter(
            log =>
                log.username === username &&
                !log.success &&
                log.timestamp >= since
        );
    }

    getLogs(): AuditLog[] {
        return [...this.logs];
    }
}

/**
 * Sistema completo con defensa en profundidad
 */
interface SecureUserData {
    username: string;
    passwordHash: string;
    mfaEnabled: boolean;
    encryptedData: string;
}

class DefenseInDepthSystem {
    private users: Map<string, SecureUserData> = new Map();
    private rateLimiter = new RateLimiter();
    private mfaProvider = new MFAProvider();
    private auditLogger = new AuditLogger();
    private encryptionKey: Buffer;

    constructor() {
        this.encryptionKey = crypto.randomBytes(32);
    }

    // Registrar usuario con todas las capas de seguridad
    register(
        username: string,
        password: string,
        enableMFA: boolean = true
    ): { success: boolean; message: string; mfaSecret?: string } {
        // Capa 1: Validación
        const usernameValidation = InputValidator.validateUsername(username);
        if (!usernameValidation.valid) {
            return { success: false, message: usernameValidation.error! };
        }

        const passwordValidation = InputValidator.validatePassword(password);
        if (!passwordValidation.valid) {
            return { success: false, message: passwordValidation.error! };
        }

        // Verificar si el usuario ya existe
        if (this.users.has(username)) {
            return { success: false, message: 'Usuario ya existe' };
        }

        // Capa 2: Cifrado
        const passwordHash = CryptoLayer.hashPassword(password);
        const encryptedData = CryptoLayer.encryptData(
            JSON.stringify({ email: `${username}@example.com` }),
            this.encryptionKey
        );

        // Capa 4: MFA
        let mfaSecret: string | undefined;
        if (enableMFA) {
            mfaSecret = this.mfaProvider.generateMFASecret(username);
        }

        // Guardar usuario
        this.users.set(username, {
            username,
            passwordHash,
            mfaEnabled: enableMFA,
            encryptedData
        });

        // Capa 5: Auditoría
        this.auditLogger.log({
            username,
            action: 'REGISTER',
            success: true,
            details: `MFA: ${enableMFA}`
        });

        console.log(`[SEGURO] Usuario ${username} registrado con todas las capas de seguridad`);

        return {
            success: true,
            message: 'Usuario registrado exitosamente',
            mfaSecret
        };
    }

    // Login con múltiples capas de verificación
    login(
        username: string,
        password: string,
        mfaCode?: string,
        ipAddress?: string
    ): { success: boolean; message: string } {
        // Capa 3: Rate limiting
        const rateLimitCheck = this.rateLimiter.checkRateLimit(username);
        if (!rateLimitCheck.allowed) {
            this.auditLogger.log({
                username,
                action: 'LOGIN',
                success: false,
                ipAddress,
                details: 'Rate limit exceeded'
            });

            return { success: false, message: rateLimitCheck.message! };
        }

        // Verificar usuario existe
        const user = this.users.get(username);
        if (!user) {
            this.auditLogger.log({
                username,
                action: 'LOGIN',
                success: false,
                ipAddress,
                details: 'User not found'
            });

            return { success: false, message: 'Credenciales inválidas' };
        }

        // Capa 2: Verificar contraseña hasheada
        if (!CryptoLayer.verifyPassword(password, user.passwordHash)) {
            this.auditLogger.log({
                username,
                action: 'LOGIN',
                success: false,
                ipAddress,
                details: 'Invalid password'
            });

            return { success: false, message: 'Credenciales inválidas' };
        }

        // Capa 4: Verificar MFA si está habilitado
        if (user.mfaEnabled) {
            if (!mfaCode) {
                return { success: false, message: 'Código MFA requerido' };
            }

            if (!this.mfaProvider.verifyTOTP(username, mfaCode)) {
                this.auditLogger.log({
                    username,
                    action: 'LOGIN',
                    success: false,
                    ipAddress,
                    details: 'Invalid MFA code'
                });

                return { success: false, message: 'Código MFA inválido' };
            }
        }

        // Login exitoso
        this.rateLimiter.recordSuccess(username);

        this.auditLogger.log({
            username,
            action: 'LOGIN',
            success: true,
            ipAddress
        });

        console.log(`[SEGURO] Login exitoso para ${username} (todas las capas verificadas)`);

        return { success: true, message: 'Login exitoso' };
    }

    getAuditLogs(): AuditLog[] {
        return this.auditLogger.getLogs();
    }
}

// ============================================================================
// DEMOSTRACIÓN
// ============================================================================

function demonstrateDefenseInDepth(): void {
    console.log('\n=== DEFENSA EN PROFUNDIDAD ===\n');

    // 1. Sistema de una sola capa (INSEGURO)
    console.log('--- 1. SISTEMA DE UNA SOLA CAPA (INSEGURO) ---\n');

    const singleLayer = new SingleLayerSecurity();
    singleLayer.register('alice', 'weak');
    singleLayer.login('alice', 'weak');

    console.log('\nProblema: Si la contraseña se compromete, no hay otras defensas');

    // 2. Sistema con defensa en profundidad (SEGURO)
    console.log('\n--- 2. SISTEMA CON DEFENSA EN PROFUNDIDAD (SEGURO) ---\n');

    const multiLayer = new DefenseInDepthSystem();

    console.log('Paso 1: Intento de registro con contraseña débil (CAPA 1: VALIDACIÓN)');
    console.log(multiLayer.register('bob', 'weak123'));

    console.log('\nPaso 2: Registro exitoso con contraseña fuerte');
    const registerResult = multiLayer.register(
        'bob',
        'SecureP@ssw0rd2024!',
        true
    );
    console.log(registerResult);

    if (registerResult.mfaSecret) {
        console.log(`Código MFA actual: ${multiLayer['mfaProvider'].generateTOTP('bob')}`);
    }

    console.log('\nPaso 3: Intento de login sin MFA (CAPA 4: MFA)');
    console.log(multiLayer.login('bob', 'SecureP@ssw0rd2024!'));

    console.log('\nPaso 4: Login con contraseña correcta y MFA');
    const mfaCode = multiLayer['mfaProvider'].generateTOTP('bob');
    console.log(multiLayer.login('bob', 'SecureP@ssw0rd2024!', mfaCode, '192.168.1.100'));

    console.log('\nPaso 5: Múltiples intentos fallidos (CAPA 3: RATE LIMITING)');
    for (let i = 0; i < 6; i++) {
        const result = multiLayer.login('bob', 'wrongpassword');
        console.log(`Intento ${i + 1}: ${result.message}`);
    }

    console.log('\nPaso 6: Auditoría de eventos (CAPA 5: LOGGING)');
    const logs = multiLayer.getAuditLogs();
    console.log(`\nTotal de eventos registrados: ${logs.length}`);
    console.log('Últimos 3 eventos:');
    logs.slice(-3).forEach(log => {
        console.log(`  - ${log.action}: ${log.success ? 'ÉXITO' : 'FALLO'} - ${log.details || ''}`);
    });
}

// Ejecutar demostración
if (require.main === module) {
    demonstrateDefenseInDepth();
}

export {
    InputValidator,
    CryptoLayer,
    RateLimiter,
    MFAProvider,
    AuditLogger,
    DefenseInDepthSystem
};
