/**
 * Brute Force Attacks & Rate Limiting
 *
 * Conceptos clave:
 * - Intentos sistemáticos de adivinar credenciales
 * - Rate limiting: limitar intentos por tiempo
 * - Account lockout: bloqueo temporal de cuenta
 * - CAPTCHA: verificación humana
 */

import { createHash } from 'crypto';

// ============================================================================
// Base de datos simulada
// ============================================================================

interface User {
    username: string;
    password: string;
    locked: boolean;
    failedAttempts: number;
}

const users: User[] = [
    {
        username: 'admin',
        password: createHash('sha256').update('password123').digest('hex'),
        locked: false,
        failedAttempts: 0,
    },
];

// ============================================================================
// ❌ VULNERABLE: Sin protección contra brute force
// ============================================================================

export function vulnerableLogin(username: string, password: string): boolean {
    const user = users.find(u => u.username === username);
    if (!user) return false;

    const hashedPassword = createHash('sha256').update(password).digest('hex');
    return user.password === hashedPassword;
}

// ============================================================================
// Demostración de ataque
// ============================================================================

export function demonstrateBruteForce(): void {
    console.log('\n=== Ataque Brute Force ===\n');

    const commonPasswords = [
        'password', '123456', 'admin', 'letmein', 'qwerty',
        'password123', 'welcome', 'monkey', '1234567890', 'abc123',
    ];

    console.log('Intentando passwords comunes...\n');

    for (let i = 0; i < commonPasswords.length; i++) {
        const password = commonPasswords[i];
        const success = vulnerableLogin('admin', password);

        console.log(`Intento ${i + 1}: ${password} - ${success ? '✅ ÉXITO' : '❌ Fallo'}`);

        if (success) {
            console.log('\n⚠️  ¡Contraseña encontrada por brute force!');
            break;
        }
    }
}

// ============================================================================
// ✅ SECURE: Rate Limiting
// ============================================================================

interface RateLimitEntry {
    attempts: number;
    firstAttempt: Date;
    blocked: boolean;
    blockUntil?: Date;
}

export class RateLimiter {
    private attempts: Map<string, RateLimitEntry> = new Map();
    private readonly maxAttempts = 5;
    private readonly windowMs = 15 * 60 * 1000; // 15 minutos
    private readonly blockDurationMs = 30 * 60 * 1000; // 30 minutos

    checkLimit(identifier: string): { allowed: boolean; reason?: string } {
        const entry = this.attempts.get(identifier);
        const now = new Date();

        if (!entry) {
            this.attempts.set(identifier, {
                attempts: 1,
                firstAttempt: now,
                blocked: false,
            });
            return { allowed: true };
        }

        // Verificar si está bloqueado
        if (entry.blocked && entry.blockUntil) {
            if (now < entry.blockUntil) {
                const minutesLeft = Math.ceil(
                    (entry.blockUntil.getTime() - now.getTime()) / 60000
                );
                return {
                    allowed: false,
                    reason: `Bloqueado. Intenta en ${minutesLeft} minutos`,
                };
            } else {
                // Desbloquear
                entry.blocked = false;
                entry.attempts = 0;
            }
        }

        // Verificar ventana de tiempo
        const windowElapsed =
            now.getTime() - entry.firstAttempt.getTime();

        if (windowElapsed > this.windowMs) {
            // Resetear contador
            entry.attempts = 1;
            entry.firstAttempt = now;
            return { allowed: true };
        }

        // Incrementar intentos
        entry.attempts++;

        if (entry.attempts > this.maxAttempts) {
            entry.blocked = true;
            entry.blockUntil = new Date(now.getTime() + this.blockDurationMs);

            return {
                allowed: false,
                reason: `Demasiados intentos. Bloqueado por 30 minutos`,
            };
        }

        return { allowed: true };
    }

    reset(identifier: string): void {
        this.attempts.delete(identifier);
    }
}

export function secureLoginWithRateLimit(
    username: string,
    password: string,
    rateLimiter: RateLimiter
): { success: boolean; message: string } {
    // Rate limiting por username
    const limitCheck = rateLimiter.checkLimit(username);

    if (!limitCheck.allowed) {
        return { success: false, message: limitCheck.reason! };
    }

    // Verificar credenciales
    const valid = vulnerableLogin(username, password);

    if (valid) {
        rateLimiter.reset(username);
        return { success: true, message: 'Login exitoso' };
    }

    return { success: false, message: 'Credenciales inválidas' };
}

// ============================================================================
// ✅ SECURE: Account Lockout
// ============================================================================

export class AccountLockoutManager {
    private readonly maxAttempts = 3;
    private readonly lockDurationMs = 60 * 60 * 1000; // 1 hora

    attemptLogin(
        username: string,
        password: string
    ): { success: boolean; message: string } {
        const user = users.find(u => u.username === username);

        if (!user) {
            return { success: false, message: 'Usuario no encontrado' };
        }

        if (user.locked) {
            return {
                success: false,
                message: 'Cuenta bloqueada. Contacta al administrador',
            };
        }

        const hashedPassword = createHash('sha256').update(password).digest('hex');

        if (user.password === hashedPassword) {
            user.failedAttempts = 0;
            return { success: true, message: 'Login exitoso' };
        }

        user.failedAttempts++;

        if (user.failedAttempts >= this.maxAttempts) {
            user.locked = true;
            return {
                success: false,
                message: 'Cuenta bloqueada por múltiples intentos fallidos',
            };
        }

        const remaining = this.maxAttempts - user.failedAttempts;
        return {
            success: false,
            message: `Contraseña incorrecta. ${remaining} intentos restantes`,
        };
    }

    unlockAccount(username: string): boolean {
        const user = users.find(u => u.username === username);

        if (user) {
            user.locked = false;
            user.failedAttempts = 0;
            return true;
        }

        return false;
    }
}

// ============================================================================
// Demostraciones
// ============================================================================

export function demonstrateRateLimiting(): void {
    console.log('\n=== Rate Limiting ===\n');

    const rateLimiter = new RateLimiter();

    for (let i = 0; i < 8; i++) {
        const result = secureLoginWithRateLimit(
            'admin',
            'wrongpassword',
            rateLimiter
        );

        console.log(`Intento ${i + 1}: ${result.message}`);

        if (!result.success && result.message.includes('Bloqueado')) {
            console.log('\n✅ Rate limiting funcionando!');
            break;
        }
    }
}

export function demonstrateAccountLockout(): void {
    console.log('\n=== Account Lockout ===\n');

    const lockoutManager = new AccountLockoutManager();

    for (let i = 0; i < 5; i++) {
        const result = lockoutManager.attemptLogin('admin', 'wrongpassword');
        console.log(`Intento ${i + 1}: ${result.message}`);

        if (result.message.includes('bloqueada')) {
            console.log('\n✅ Cuenta bloqueada exitosamente!');
            break;
        }
    }
}

// ============================================================================
// Mejores prácticas
// ============================================================================

export function printBestPractices(): void {
    console.log('\n=== Mejores Prácticas ===\n');
    console.log('✅ Rate Limiting por IP y username');
    console.log('✅ Account lockout progresivo');
    console.log('✅ CAPTCHA después de N intentos');
    console.log('✅ Delays incrementales');
    console.log('✅ Monitoring y alertas');
    console.log('✅ 2FA obligatorio');
    console.log('✅ Logging de intentos fallidos');
}

// ============================================================================
// Ejecución
// ============================================================================

if (require.main === module) {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║         BRUTE FORCE & RATE LIMITING                   ║');
    console.log('╚════════════════════════════════════════════════════════╝');

    demonstrateBruteForce();
    demonstrateRateLimiting();
    demonstrateAccountLockout();
    printBestPractices();

    console.log('\n✅ Demostración completada\n');
}
