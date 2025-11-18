/**
 * CSRF Protection (Protección contra Cross-Site Request Forgery)
 *
 * Técnicas de protección:
 * - CSRF Tokens (Synchronizer Token Pattern)
 * - SameSite Cookies
 * - Double Submit Cookies
 * - Custom Request Headers
 * - Referer/Origin Validation
 *
 * Mejores prácticas:
 * - Usar POST/PUT/DELETE para acciones que modifican estado
 * - Implementar múltiples capas de defensa
 * - Validar tokens en cada solicitud sensible
 */

import { createHash, randomBytes } from 'crypto';

// ============================================================================
// CSRF Token Manager
// ============================================================================

/**
 * Gestor de CSRF Tokens
 */
export class CSRFTokenManager {
    private tokens: Map<string, { token: string; expiry: Date }> = new Map();
    private readonly TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hora

    /**
     * Genera un token CSRF para una sesión
     */
    generateToken(sessionId: string): string {
        const token = randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + this.TOKEN_EXPIRY_MS);

        this.tokens.set(sessionId, { token, expiry });

        return token;
    }

    /**
     * Valida un token CSRF
     */
    validateToken(sessionId: string, providedToken: string): boolean {
        const stored = this.tokens.get(sessionId);

        if (!stored) {
            console.log('❌ No hay token almacenado para esta sesión');
            return false;
        }

        if (new Date() > stored.expiry) {
            console.log('❌ Token expirado');
            this.tokens.delete(sessionId);
            return false;
        }

        if (stored.token !== providedToken) {
            console.log('❌ Token inválido');
            return false;
        }

        return true;
    }

    /**
     * Refresca un token (rotar después de uso)
     */
    refreshToken(sessionId: string): string {
        return this.generateToken(sessionId);
    }

    /**
     * Elimina token de sesión
     */
    revokeToken(sessionId: string): void {
        this.tokens.delete(sessionId);
    }

    /**
     * Limpia tokens expirados
     */
    cleanExpiredTokens(): void {
        const now = new Date();
        for (const [sessionId, data] of this.tokens.entries()) {
            if (now > data.expiry) {
                this.tokens.delete(sessionId);
            }
        }
    }
}

// ============================================================================
// Double Submit Cookie Pattern
// ============================================================================

/**
 * Implementación de Double Submit Cookie
 */
export class DoubleSubmitCookieManager {
    /**
     * Genera un token aleatorio
     */
    generateToken(): string {
        return randomBytes(32).toString('hex');
    }

    /**
     * Valida que el token de cookie coincida con el del formulario
     */
    validateDoubleSubmit(cookieToken: string, requestToken: string): boolean {
        if (!cookieToken || !requestToken) {
            return false;
        }

        // Comparación constant-time para prevenir timing attacks
        return this.constantTimeCompare(cookieToken, requestToken);
    }

    /**
     * Comparación constant-time
     */
    private constantTimeCompare(a: string, b: string): boolean {
        if (a.length !== b.length) {
            return false;
        }

        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }

        return result === 0;
    }
}

// ============================================================================
// SameSite Cookie Configuration
// ============================================================================

/**
 * Configuración de cookies con SameSite
 */
export interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'Strict' | 'Lax' | 'None';
    maxAge?: number;
    path?: string;
    domain?: string;
}

export class SecureCookieManager {
    /**
     * Genera configuración de cookie segura
     */
    static generateSecureCookie(
        name: string,
        value: string,
        options: Partial<CookieOptions> = {}
    ): string {
        const defaults: CookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: '/',
        };

        const config = { ...defaults, ...options };

        let cookie = `${name}=${value}`;

        if (config.httpOnly) cookie += '; HttpOnly';
        if (config.secure) cookie += '; Secure';
        if (config.sameSite) cookie += `; SameSite=${config.sameSite}`;
        if (config.maxAge) cookie += `; Max-Age=${config.maxAge}`;
        if (config.path) cookie += `; Path=${config.path}`;
        if (config.domain) cookie += `; Domain=${config.domain}`;

        return cookie;
    }

    /**
     * Explicación de SameSite values
     */
    static explainSameSite(): void {
        console.log('\n=== SameSite Cookie Attribute ===\n');

        console.log('1. SameSite=Strict:');
        console.log('   - Cookie SOLO se envía en solicitudes del mismo sitio');
        console.log('   - Máxima protección contra CSRF');
        console.log('   - Puede afectar UX (no funciona en links externos)\n');

        console.log('2. SameSite=Lax (predeterminado):');
        console.log('   - Cookie se envía en navegación top-level');
        console.log('   - NO se envía en: iframes, AJAX, imágenes');
        console.log('   - Balance entre seguridad y usabilidad\n');

        console.log('3. SameSite=None:');
        console.log('   - Cookie se envía en todas las solicitudes');
        console.log('   - REQUIERE Secure (solo HTTPS)');
        console.log('   - Necesario para embeds/iframes legítimos\n');
    }
}

// ============================================================================
// ✅ SECURE: Endpoints con protección CSRF
// ============================================================================

interface User {
    id: number;
    username: string;
    email: string;
    balance: number;
}

const csrfManager = new CSRFTokenManager();
const doubleSubmitManager = new DoubleSubmitCookieManager();

/**
 * ✅ SECURE: Transferencia con CSRF token
 */
export function secureTransferMoney(
    sessionId: string,
    csrfToken: string,
    toUsername: string,
    amount: number
): { success: boolean; message: string } {
    // Validar CSRF token
    if (!csrfManager.validateToken(sessionId, csrfToken)) {
        return { success: false, message: 'Token CSRF inválido o expirado' };
    }

    // Validar sesión y ejecutar transferencia
    // (lógica de negocio aquí)

    // Rotar token después de uso
    csrfManager.refreshToken(sessionId);

    return {
        success: true,
        message: `Transferencia de $${amount} completada`,
    };
}

/**
 * ✅ SECURE: Cambio de email con protección CSRF
 */
export function secureChangeEmail(
    sessionId: string,
    csrfToken: string,
    newEmail: string,
    currentPassword: string
): { success: boolean; message: string } {
    // 1. Validar CSRF token
    if (!csrfManager.validateToken(sessionId, csrfToken)) {
        return { success: false, message: 'Token CSRF inválido' };
    }

    // 2. Validar contraseña actual (confirmación adicional)
    // (lógica de validación aquí)

    // 3. Ejecutar cambio de email
    // (lógica de negocio aquí)

    return {
        success: true,
        message: `Email cambiado a ${newEmail}`,
    };
}

/**
 * ✅ SECURE: Acción destructiva con confirmación múltiple
 */
export function secureDeleteAccount(
    sessionId: string,
    csrfToken: string,
    password: string,
    confirmationCode: string
): { success: boolean; message: string } {
    // 1. Validar CSRF token
    if (!csrfManager.validateToken(sessionId, csrfToken)) {
        return { success: false, message: 'Token CSRF inválido' };
    }

    // 2. Validar contraseña
    // (lógica de validación aquí)

    // 3. Validar código de confirmación (enviado por email)
    // (lógica de validación aquí)

    // 4. Ejecutar eliminación
    // (lógica de negocio aquí)

    return {
        success: true,
        message: 'Cuenta eliminada exitosamente',
    };
}

// ============================================================================
// Generación de formularios seguros
// ============================================================================

/**
 * ✅ SECURE: Formulario con CSRF token
 */
export function secureTransferForm(sessionId: string): string {
    const csrfToken = csrfManager.generateToken(sessionId);

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Transferir Dinero</title>
        </head>
        <body>
            <h1>Transferir Dinero</h1>
            <form action="/transfer" method="POST">
                <!-- ✅ CSRF Token oculto -->
                <input type="hidden" name="csrf_token" value="${csrfToken}">

                <label>Destinatario:</label>
                <input type="text" name="to" required>
                <br>
                <label>Cantidad:</label>
                <input type="number" name="amount" required>
                <br>
                <button type="submit">Transferir</button>
            </form>
        </body>
        </html>
    `;
}

/**
 * ✅ SECURE: AJAX con custom header
 */
export function secureAjaxExample(): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>AJAX Seguro</title>
        </head>
        <body>
            <button id="transfer-btn">Transferir</button>

            <script>
                document.getElementById('transfer-btn').addEventListener('click', async () => {
                    // ✅ Custom header para verificar origen
                    const response = await fetch('/api/transfer', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',  // Anti-CSRF header
                            'X-CSRF-Token': getCsrfToken()  // Token de meta tag o cookie
                        },
                        credentials: 'same-origin',  // ✅ same-origin en lugar de include
                        body: JSON.stringify({
                            to: 'bob',
                            amount: 100
                        })
                    });

                    const result = await response.json();
                    console.log(result);
                });

                function getCsrfToken() {
                    // Leer token de meta tag
                    const meta = document.querySelector('meta[name="csrf-token"]');
                    return meta ? meta.getAttribute('content') : '';
                }
            </script>

            <!-- ✅ CSRF token en meta tag -->
            <meta name="csrf-token" content="token-aqui">
        </body>
        </html>
    `;
}

// ============================================================================
// Validación de Origin y Referer
// ============================================================================

/**
 * Validador de Origin/Referer headers
 */
export class RequestOriginValidator {
    private allowedOrigins: Set<string>;

    constructor(allowedOrigins: string[]) {
        this.allowedOrigins = new Set(allowedOrigins);
    }

    /**
     * Valida el header Origin
     */
    validateOrigin(origin: string | undefined): boolean {
        if (!origin) {
            return false;
        }

        return this.allowedOrigins.has(origin);
    }

    /**
     * Valida el header Referer
     */
    validateReferer(referer: string | undefined): boolean {
        if (!referer) {
            return false;
        }

        try {
            const refererUrl = new URL(referer);
            const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;

            return this.allowedOrigins.has(refererOrigin);
        } catch {
            return false;
        }
    }

    /**
     * Validación combinada
     */
    validateRequest(origin?: string, referer?: string): boolean {
        // Preferir Origin sobre Referer
        if (origin) {
            return this.validateOrigin(origin);
        }

        if (referer) {
            return this.validateReferer(referer);
        }

        return false;
    }
}

// ============================================================================
// Demostración de protección CSRF
// ============================================================================

/**
 * Demostración de CSRF tokens
 */
export function demonstrateCSRFTokens(): void {
    console.log('\n=== Demostración de CSRF Tokens ===\n');

    const sessionId = 'user-session-123';

    // Generar token
    console.log('1. Generar token CSRF:');
    const token = csrfManager.generateToken(sessionId);
    console.log(`   Token: ${token.substring(0, 16)}...\n`);

    // Validar token correcto
    console.log('2. Validar token correcto:');
    const valid = csrfManager.validateToken(sessionId, token);
    console.log(`   ${valid ? '✅' : '❌'} Válido: ${valid}\n`);

    // Validar token incorrecto
    console.log('3. Validar token incorrecto:');
    const invalidValid = csrfManager.validateToken(sessionId, 'wrong-token');
    console.log(`   ${invalidValid ? '✅' : '❌'} Válido: ${invalidValid}\n`);

    // Rotar token
    console.log('4. Rotar token:');
    const newToken = csrfManager.refreshToken(sessionId);
    console.log(`   Nuevo token: ${newToken.substring(0, 16)}...\n`);

    // Token anterior ya no válido
    console.log('5. Token anterior ya no es válido:');
    const oldValid = csrfManager.validateToken(sessionId, token);
    console.log(`   ${oldValid ? '✅' : '❌'} Válido: ${oldValid}`);
}

/**
 * Demostración de Double Submit Cookies
 */
export function demonstrateDoubleSubmit(): void {
    console.log('\n=== Demostración de Double Submit Cookies ===\n');

    const token = doubleSubmitManager.generateToken();

    console.log('1. Token generado:');
    console.log(`   ${token.substring(0, 16)}...\n`);

    console.log('2. Cookie establecida:');
    const cookie = SecureCookieManager.generateSecureCookie(
        'csrf-token',
        token,
        { sameSite: 'Strict' }
    );
    console.log(`   ${cookie}\n`);

    console.log('3. Validar tokens coincidentes:');
    const valid = doubleSubmitManager.validateDoubleSubmit(token, token);
    console.log(`   ${valid ? '✅' : '❌'} Válido: ${valid}\n`);

    console.log('4. Validar tokens diferentes:');
    const invalid = doubleSubmitManager.validateDoubleSubmit(token, 'different-token');
    console.log(`   ${invalid ? '✅' : '❌'} Válido: ${invalid}`);
}

/**
 * Demostración de validación de Origin
 */
export function demonstrateOriginValidation(): void {
    console.log('\n=== Demostración de Validación de Origin ===\n');

    const validator = new RequestOriginValidator([
        'https://example.com',
        'https://app.example.com',
    ]);

    const testCases = [
        { origin: 'https://example.com', referer: undefined },
        { origin: 'https://evil.com', referer: undefined },
        { origin: undefined, referer: 'https://example.com/page' },
        { origin: undefined, referer: 'https://evil.com/page' },
    ];

    testCases.forEach((test, index) => {
        const valid = validator.validateRequest(test.origin, test.referer);
        const status = valid ? '✅' : '❌';

        console.log(`${index + 1}. Origin: ${test.origin || 'N/A'}`);
        console.log(`   Referer: ${test.referer || 'N/A'}`);
        console.log(`   ${status} Válido: ${valid}\n`);
    });
}

/**
 * Mejores prácticas
 */
export function printCSRFBestPractices(): void {
    console.log('\n=== Mejores Prácticas CSRF ===\n');

    console.log('🛡️  DEFENSAS PRIMARIAS:');
    console.log('   1. CSRF Tokens (Synchronizer Token Pattern)');
    console.log('   2. SameSite Cookies (Strict o Lax)');
    console.log('   3. Double Submit Cookies');

    console.log('\n🔒 DEFENSAS SECUNDARIAS:');
    console.log('   1. Validación de Origin/Referer headers');
    console.log('   2. Custom Request Headers (X-Requested-With)');
    console.log('   3. Re-autenticación para acciones críticas');

    console.log('\n✅ IMPLEMENTACIÓN:');
    console.log('   - Usar POST/PUT/DELETE para cambios de estado');
    console.log('   - Nunca usar GET para acciones que modifican');
    console.log('   - Tokens únicos por sesión o por solicitud');
    console.log('   - Rotar tokens después de uso');
    console.log('   - Expiración de tokens');

    console.log('\n🍪 COOKIES SEGURAS:');
    console.log('   - HttpOnly: previene acceso desde JavaScript');
    console.log('   - Secure: solo HTTPS');
    console.log('   - SameSite=Strict: máxima protección');
    console.log('   - SameSite=Lax: balance usabilidad/seguridad');

    console.log('\n⚠️  ACCIONES CRÍTICAS:');
    console.log('   - Confirmación de contraseña');
    console.log('   - Código de confirmación por email/SMS');
    console.log('   - CAPTCHA para operaciones sensibles');
}

// ============================================================================
// Ejecución
// ============================================================================

if (require.main === module) {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║         CSRF PROTECTION - Técnicas Seguras            ║');
    console.log('╚════════════════════════════════════════════════════════╝');

    demonstrateCSRFTokens();
    demonstrateDoubleSubmit();
    SecureCookieManager.explainSameSite();
    demonstrateOriginValidation();
    printCSRFBestPractices();

    console.log('\n✅ Demostración completada\n');
}
