/**
 * DOM-Based XSS (Cross-Site Scripting basado en DOM)
 *
 * Conceptos clave:
 * - El ataque ocurre completamente en el lado del cliente
 * - El payload nunca llega al servidor
 * - Explota manipulación insegura del DOM con JavaScript
 * - Común con: innerHTML, document.write(), eval()
 *
 * Fuentes (Sources):
 * - location.hash, location.search
 * - document.referrer, document.cookie
 * - localStorage, sessionStorage
 *
 * Sumideros (Sinks):
 * - innerHTML, outerHTML
 * - document.write()
 * - eval(), setTimeout(), setInterval() con strings
 */

// ============================================================================
// ❌ VULNERABLE: DOM-Based XSS
// ============================================================================

/**
 * VULNERABLE: Uso inseguro de location.hash con innerHTML
 *
 * Problema: El fragmento de URL se inserta directamente en el DOM
 * sin sanitización
 *
 * URL maliciosa: http://example.com/#<img src=x onerror=alert('XSS')>
 */
export function vulnerableHashHandler(): string {
    // Simulación de location.hash del navegador
    const simulatedHash = '#<img src=x onerror=alert("XSS")>';

    // ❌ NO HACER: Insertar hash directamente en DOM
    const content = simulatedHash.substring(1); // Quita el #

    return `
        <script>
        // Código vulnerable ejecutándose en el navegador
        const hash = window.location.hash.substring(1);
        document.getElementById('content').innerHTML = hash;
        </script>
        <div id="content"></div>
    `;
}

/**
 * VULNERABLE: Búsqueda dinámica con parámetros de URL
 */
export function vulnerableSearchWithDOM(): string {
    return `
        <script>
        // ❌ NO HACER: Leer parámetros y usar innerHTML
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');

        if (query) {
            document.getElementById('results').innerHTML =
                '<h2>Resultados para: ' + query + '</h2>';
        }
        </script>
        <div id="results"></div>
    `;
}

/**
 * VULNERABLE: Uso de eval() con datos del usuario
 */
export function vulnerableEvalUsage(userInput: string): void {
    // ❌ NO HACER: eval() con input del usuario
    try {
        // Esto permite ejecución de código arbitrario
        eval(userInput);
    } catch (error) {
        console.error('Error en eval:', error);
    }
}

/**
 * VULNERABLE: document.write() con datos no confiables
 */
export function vulnerableDocumentWrite(): string {
    return `
        <script>
        // ❌ NO HACER: document.write con datos de URL
        const name = new URLSearchParams(window.location.search).get('name');
        document.write('<h1>Bienvenido ' + name + '</h1>');
        </script>
    `;
}

/**
 * VULNERABLE: setTimeout/setInterval con strings
 */
export function vulnerableTimerFunctions(code: string): void {
    // ❌ NO HACER: setTimeout con string (actúa como eval)
    setTimeout(code, 1000);

    // ❌ NO HACER: setInterval con string
    setInterval(code, 1000);
}

/**
 * Demostración de ataques DOM-based XSS
 */
export function demonstrateDOMXSSAttack(): void {
    console.log('\n=== Demostración de Ataques DOM-Based XSS ===\n');

    // Ataque vía hash
    console.log('1. Ataque vía location.hash:');
    console.log('   URL: http://example.com/#<img src=x onerror=alert("XSS")>');
    console.log('   El payload se ejecuta sin tocar el servidor!');

    // Ataque vía parámetros de búsqueda
    console.log('\n2. Ataque vía URL parameters:');
    console.log('   URL: http://example.com/?q=<script>alert("XSS")</script>');

    // Ataque vía eval
    console.log('\n3. Ataque vía eval():');
    const maliciousCode = 'alert("XSS ejecutado via eval!")';
    console.log(`   Input: ${maliciousCode}`);
    console.log('   ⚠️  eval() ejecutaría código arbitrario!');

    // Ataque vía localStorage
    console.log('\n4. Ataque vía localStorage:');
    console.log('   Si un atacante puede controlar localStorage:');
    console.log('   localStorage.setItem("prefs", "<img src=x onerror=alert(1)>")');
    console.log('   Y la aplicación usa: element.innerHTML = localStorage.getItem("prefs")');
}

// ============================================================================
// ✅ SECURE: Protección contra DOM-Based XSS
// ============================================================================

/**
 * Sanitizador para manipulación segura del DOM
 */
export class DOMSanitizer {
    /**
     * Codifica HTML para prevenir XSS
     */
    static encodeHTML(text: string): string {
        const div = { textContent: text }; // Simulación de textContent
        // En un navegador real: div.textContent = text; return div.innerHTML;

        const htmlEntities: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
        };

        return text.replace(/[&<>"'\/]/g, char => htmlEntities[char] || char);
    }

    /**
     * Crea elemento de texto seguro
     */
    static createTextNode(text: string): string {
        // En navegador real: document.createTextNode(text)
        return this.encodeHTML(text);
    }

    /**
     * Sanitiza atributos HTML
     */
    static sanitizeAttribute(value: string): string {
        // Remover comillas y caracteres peligrosos
        return value.replace(/["'<>&]/g, '');
    }

    /**
     * Valida URLs para prevenir javascript:
     */
    static sanitizeURL(url: string): string {
        const urlLower = url.toLowerCase().trim();

        // Bloquear javascript:, data:, vbscript:
        const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];

        if (dangerousProtocols.some(protocol => urlLower.startsWith(protocol))) {
            return 'about:blank';
        }

        return url;
    }
}

/**
 * ✅ SECURE: Manejo seguro de location.hash
 */
export function secureHashHandler(): string {
    return `
        <script>
        // ✅ Usar textContent en lugar de innerHTML
        function displayHash() {
            const hash = window.location.hash.substring(1);
            const element = document.getElementById('content');

            // Opción 1: Usar textContent (no interpreta HTML)
            element.textContent = hash;

            // Opción 2: Sanitizar y validar
            const sanitized = sanitizeHTML(hash);
            element.innerHTML = sanitized;
        }

        function sanitizeHTML(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        displayHash();
        </script>
        <div id="content"></div>
    `;
}

/**
 * ✅ SECURE: Búsqueda segura con DOM
 */
export function secureSearchWithDOM(): string {
    return `
        <script>
        function displaySearchResults() {
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('q');

            if (query) {
                const resultsDiv = document.getElementById('results');

                // ✅ Crear elementos de forma segura
                const heading = document.createElement('h2');
                heading.textContent = 'Resultados para: ' + query;

                resultsDiv.appendChild(heading);

                // Alternativa: Usar textContent
                // resultsDiv.textContent = 'Resultados para: ' + query;
            }
        }

        displaySearchResults();
        </script>
        <div id="results"></div>
    `;
}

/**
 * ✅ SECURE: Alternativa segura a eval()
 */
export function secureCalculation(expression: string): number | null {
    // En lugar de eval(), usar un parser seguro
    // Solo permitir operaciones matemáticas básicas

    // Validar que solo contiene números y operadores
    const safePattern = /^[0-9+\-*/().\s]+$/;

    if (!safePattern.test(expression)) {
        console.warn('⚠️  Expresión contiene caracteres no permitidos');
        return null;
    }

    try {
        // Usar Function constructor (más seguro que eval, pero aún con cuidado)
        // O mejor: usar una librería de parsing como math.js
        const fn = new Function('return ' + expression);
        return fn();
    } catch (error) {
        console.error('Error en cálculo:', error);
        return null;
    }
}

/**
 * ✅ SECURE: Uso seguro de timers
 */
export function secureTimerFunctions(callback: () => void, delay: number): number {
    // ✅ HACER: Pasar funciones, no strings
    const timerId = setTimeout(callback, delay);
    return timerId;
}

/**
 * Clase para manejo seguro de elementos del DOM
 */
export class SafeDOMManipulator {
    /**
     * Actualiza contenido de forma segura
     */
    static setContent(elementId: string, content: string, allowHTML = false): void {
        console.log(`\nActualizando elemento: ${elementId}`);

        if (allowHTML) {
            // Si se permite HTML, sanitizar primero
            const sanitized = DOMSanitizer.encodeHTML(content);
            console.log(`HTML sanitizado: ${sanitized}`);
        } else {
            // Usar textContent (no interpreta HTML)
            console.log(`Texto plano: ${content}`);
        }
    }

    /**
     * Crea enlace de forma segura
     */
    static createLink(text: string, url: string): string {
        const safeText = DOMSanitizer.encodeHTML(text);
        const safeURL = DOMSanitizer.sanitizeURL(url);

        return `<a href="${safeURL}" rel="noopener noreferrer">${safeText}</a>`;
    }

    /**
     * Crea lista de elementos de forma segura
     */
    static createList(items: string[]): string {
        const safeItems = items
            .map(item => DOMSanitizer.encodeHTML(item))
            .map(item => `<li>${item}</li>`)
            .join('');

        return `<ul>${safeItems}</ul>`;
    }
}

/**
 * Demostración de protección contra DOM-based XSS
 */
export function demonstrateDOMXSSProtection(): void {
    console.log('\n=== Demostración de Protección contra DOM-based XSS ===\n');

    const maliciousInputs = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert(1)>',
        'javascript:alert("XSS")',
        'normal text',
    ];

    console.log('1. Sanitización de contenido HTML:');
    maliciousInputs.forEach(input => {
        const sanitized = DOMSanitizer.encodeHTML(input);
        console.log(`   Input: ${input}`);
        console.log(`   Sanitized: ${sanitized}`);
        console.log('');
    });

    console.log('2. Sanitización de URLs:');
    const urls = [
        'https://example.com',
        'javascript:alert("XSS")',
        'data:text/html,<script>alert("XSS")</script>',
    ];

    urls.forEach(url => {
        const sanitized = DOMSanitizer.sanitizeURL(url);
        console.log(`   URL: ${url}`);
        console.log(`   Safe: ${sanitized}`);
        console.log('');
    });

    console.log('3. Cálculos seguros (sin eval):');
    const expressions = [
        '2 + 2',
        '10 * 5',
        'alert("XSS")',
        '1 + 1; alert("XSS")',
    ];

    expressions.forEach(expr => {
        const result = secureCalculation(expr);
        console.log(`   Expression: ${expr}`);
        console.log(`   Result: ${result !== null ? result : 'RECHAZADO'}`);
        console.log('');
    });
}

/**
 * Comparación de enfoques
 */
export function printDOMXSSComparison(): void {
    console.log('\n=== DOM-Based XSS: Vulnerable vs Seguro ===\n');

    console.log('❌ VULNERABLE:');
    console.log('   - Uso de innerHTML con datos no confiables');
    console.log('   - eval() con input del usuario');
    console.log('   - document.write() con datos externos');
    console.log('   - setTimeout/setInterval con strings');
    console.log('   - No validación de URLs (javascript:, data:)');

    console.log('\n✅ SEGURO:');
    console.log('   - Uso de textContent en lugar de innerHTML');
    console.log('   - createElement + appendChild para DOM');
    console.log('   - Evitar eval() completamente');
    console.log('   - Funciones para timers, no strings');
    console.log('   - Validación estricta de URLs');
    console.log('   - Sanitización de todo contenido dinámico');

    console.log('\n📚 MEJORES PRÁCTICAS:');
    console.log('   1. NUNCA usar innerHTML con datos no confiables');
    console.log('   2. Preferir textContent sobre innerHTML');
    console.log('   3. Usar createElement/createTextNode para DOM');
    console.log('   4. NUNCA usar eval() o equivalentes (Function, setTimeout con string)');
    console.log('   5. Validar y sanitizar datos de: URL, localStorage, cookies');
    console.log('   6. Implementar Content Security Policy');
    console.log('   7. Usar frameworks modernos con auto-escape (React, Vue, Angular)');

    console.log('\n🔍 FUENTES (Sources) PELIGROSAS:');
    console.log('   - location.hash, location.search');
    console.log('   - document.referrer');
    console.log('   - localStorage, sessionStorage');
    console.log('   - document.cookie');
    console.log('   - postMessage events');

    console.log('\n🎯 SUMIDEROS (Sinks) PELIGROSOS:');
    console.log('   - innerHTML, outerHTML');
    console.log('   - document.write(), document.writeln()');
    console.log('   - eval(), Function()');
    console.log('   - setTimeout(), setInterval() (con strings)');
    console.log('   - location = , location.href =');
}

// ============================================================================
// Ejecución de Demostraciones
// ============================================================================

if (require.main === module) {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║       DOM-Based XSS - Vulnerable vs Seguro            ║');
    console.log('╚════════════════════════════════════════════════════════╝');

    demonstrateDOMXSSAttack();
    demonstrateDOMXSSProtection();
    printDOMXSSComparison();

    console.log('\n✅ Demostración completada\n');
}
