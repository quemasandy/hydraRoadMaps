/**
 * XSS Prevention - Técnicas Avanzadas de Prevención
 *
 * Conceptos clave:
 * - Content Security Policy (CSP)
 * - Sanitización contextual
 * - Codificación según contexto
 * - Validación de entrada
 * - Escape de salida
 *
 * Contextos de codificación:
 * - HTML body
 * - HTML attributes
 * - JavaScript
 * - CSS
 * - URLs
 */

import { createHash, randomBytes } from 'crypto';

// ============================================================================
// Content Security Policy (CSP)
// ============================================================================

/**
 * Generador de políticas CSP
 */
export class CSPBuilder {
    private directives: Map<string, string[]> = new Map();

    /**
     * Define fuentes permitidas para scripts
     */
    scriptSrc(...sources: string[]): this {
        this.directives.set('script-src', sources);
        return this;
    }

    /**
     * Define fuentes permitidas para estilos
     */
    styleSrc(...sources: string[]): this {
        this.directives.set('style-src', sources);
        return this;
    }

    /**
     * Define fuentes permitidas para imágenes
     */
    imgSrc(...sources: string[]): this {
        this.directives.set('img-src', sources);
        return this;
    }

    /**
     * Define fuentes permitidas por defecto
     */
    defaultSrc(...sources: string[]): this {
        this.directives.set('default-src', sources);
        return this;
    }

    /**
     * Define destinos permitidos para conectar
     */
    connectSrc(...sources: string[]): this {
        this.directives.set('connect-src', sources);
        return this;
    }

    /**
     * Define fuentes permitidas para fonts
     */
    fontSrc(...sources: string[]): this {
        this.directives.set('font-src', sources);
        return this;
    }

    /**
     * Define ancestros permitidos en iframes
     */
    frameAncestors(...sources: string[]): this {
        this.directives.set('frame-ancestors', sources);
        return this;
    }

    /**
     * Habilita modo report-only para testing
     */
    reportOnly(reportUri: string): this {
        this.directives.set('report-uri', [reportUri]);
        return this;
    }

    /**
     * Construye el header CSP
     */
    build(): string {
        const parts: string[] = [];

        this.directives.forEach((sources, directive) => {
            parts.push(`${directive} ${sources.join(' ')}`);
        });

        return parts.join('; ');
    }
}

/**
 * CSP preconfigurados para diferentes niveles de seguridad
 */
export class CSPPolicies {
    /**
     * Política estricta - máxima seguridad
     */
    static strict(): string {
        return new CSPBuilder()
            .defaultSrc("'self'")
            .scriptSrc("'self'", "'strict-dynamic'")
            .styleSrc("'self'")
            .imgSrc("'self'", 'data:', 'https:')
            .fontSrc("'self'")
            .connectSrc("'self'")
            .frameAncestors("'none'")
            .build();
    }

    /**
     * Política moderada - balance seguridad/funcionalidad
     */
    static moderate(): string {
        return new CSPBuilder()
            .defaultSrc("'self'")
            .scriptSrc("'self'", "'unsafe-inline'", 'https://cdn.example.com')
            .styleSrc("'self'", "'unsafe-inline'")
            .imgSrc("'self'", 'data:', 'https:')
            .fontSrc("'self'", 'https://fonts.gstatic.com')
            .connectSrc("'self'", 'https://api.example.com')
            .build();
    }

    /**
     * Política con nonces para scripts inline
     */
    static withNonce(nonce: string): string {
        return new CSPBuilder()
            .defaultSrc("'self'")
            .scriptSrc("'self'", `'nonce-${nonce}'`)
            .styleSrc("'self'", `'nonce-${nonce}'`)
            .build();
    }
}

/**
 * Generador de nonces para CSP
 */
export class NonceGenerator {
    static generate(): string {
        return randomBytes(16).toString('base64');
    }

    static generateHash(content: string, algorithm: 'sha256' | 'sha384' | 'sha512' = 'sha256'): string {
        const hash = createHash(algorithm).update(content).digest('base64');
        return `${algorithm}-${hash}`;
    }
}

// ============================================================================
// Codificación Contextual
// ============================================================================

/**
 * Codificador contextual - codifica según el contexto HTML
 */
export class ContextualEncoder {
    /**
     * Codifica para contexto HTML body
     */
    static forHTML(text: string): string {
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
     * Codifica para atributos HTML
     */
    static forHTMLAttribute(text: string): string {
        // Para atributos, codificar más caracteres
        return text.replace(/[&<>"'`=]/g, char => {
            return '&#x' + char.charCodeAt(0).toString(16) + ';';
        });
    }

    /**
     * Codifica para strings JavaScript
     */
    static forJavaScript(text: string): string {
        // Escapar caracteres especiales para JS strings
        const jsEscapes: { [key: string]: string } = {
            '\\': '\\\\',
            '"': '\\"',
            "'": "\\'",
            '\n': '\\n',
            '\r': '\\r',
            '\t': '\\t',
            '\b': '\\b',
            '\f': '\\f',
        };

        let encoded = text.replace(/[\\"'\n\r\t\b\f]/g, char => jsEscapes[char] || char);

        // Codificar caracteres de control y Unicode problemáticos
        encoded = encoded.replace(/[\u0000-\u001f\u007f-\u009f]/g, char => {
            return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
        });

        return encoded;
    }

    /**
     * Codifica para contexto CSS
     */
    static forCSS(text: string): string {
        // Escapar caracteres especiales para CSS
        return text.replace(/[^a-zA-Z0-9]/g, char => {
            return '\\' + char.charCodeAt(0).toString(16) + ' ';
        });
    }

    /**
     * Codifica para URLs
     */
    static forURL(text: string): string {
        return encodeURIComponent(text);
    }

    /**
     * Codifica para parámetros de URL
     */
    static forURLParameter(text: string): string {
        return encodeURIComponent(text)
            .replace(/[!'()*]/g, char => {
                return '%' + char.charCodeAt(0).toString(16).toUpperCase();
            });
    }
}

// ============================================================================
// Sanitizador Avanzado
// ============================================================================

/**
 * Configuración de sanitización
 */
interface SanitizerConfig {
    allowedTags?: string[];
    allowedAttributes?: { [tag: string]: string[] };
    allowedProtocols?: string[];
}

/**
 * Sanitizador HTML avanzado
 */
export class HTMLSanitizer {
    private config: SanitizerConfig;

    constructor(config: SanitizerConfig = {}) {
        this.config = {
            allowedTags: config.allowedTags || ['b', 'i', 'em', 'strong', 'p', 'br'],
            allowedAttributes: config.allowedAttributes || {},
            allowedProtocols: config.allowedProtocols || ['http', 'https', 'mailto'],
        };
    }

    /**
     * Sanitiza HTML permitiendo solo tags y atributos seguros
     */
    sanitize(html: string): string {
        // Remover todos los tags excepto los permitidos
        let sanitized = this.removeDisallowedTags(html);

        // Remover atributos no permitidos
        sanitized = this.removeDisallowedAttributes(sanitized);

        // Validar URLs en atributos
        sanitized = this.sanitizeURLs(sanitized);

        return sanitized;
    }

    private removeDisallowedTags(html: string): string {
        const allowedTags = this.config.allowedTags || [];
        const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

        return html.replace(tagPattern, (match, tagName) => {
            if (allowedTags.includes(tagName.toLowerCase())) {
                return match;
            }
            return ''; // Remover tag no permitido
        });
    }

    private removeDisallowedAttributes(html: string): string {
        // Simplificado: remover todos los atributos on* (onclick, onerror, etc.)
        return html.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
    }

    private sanitizeURLs(html: string): string {
        const allowedProtocols = this.config.allowedProtocols || [];
        const urlPattern = /(href|src)\s*=\s*["']([^"']*)["']/gi;

        return html.replace(urlPattern, (match, attr, url) => {
            const protocol = url.split(':')[0].toLowerCase();

            if (allowedProtocols.includes(protocol) || url.startsWith('/') || url.startsWith('#')) {
                return match;
            }

            return ''; // Remover atributo con URL no permitida
        });
    }
}

// ============================================================================
// Validadores de Entrada
// ============================================================================

/**
 * Validadores de entrada para diferentes tipos de datos
 */
export class InputValidators {
    /**
     * Valida email
     */
    static email(input: string): boolean {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(input) && input.length <= 254;
    }

    /**
     * Valida username (solo alfanuméricos y guiones)
     */
    static username(input: string): boolean {
        const usernamePattern = /^[a-zA-Z0-9_-]{3,20}$/;
        return usernamePattern.test(input);
    }

    /**
     * Valida URL
     */
    static url(input: string): boolean {
        try {
            const url = new URL(input);
            return ['http:', 'https:'].includes(url.protocol);
        } catch {
            return false;
        }
    }

    /**
     * Valida número de teléfono
     */
    static phone(input: string): boolean {
        const phonePattern = /^\+?[1-9]\d{1,14}$/;
        return phonePattern.test(input.replace(/[\s-()]/g, ''));
    }

    /**
     * Valida que solo contenga caracteres seguros
     */
    static safePlainText(input: string): boolean {
        // Solo letras, números, espacios y puntuación básica
        const safePattern = /^[a-zA-Z0-9\s.,!?'-]+$/;
        return safePattern.test(input);
    }
}

// ============================================================================
// Demostración Completa
// ============================================================================

/**
 * Demostración de CSP
 */
export function demonstrateCSP(): void {
    console.log('\n=== Content Security Policy ===\n');

    console.log('1. CSP Estricta:');
    console.log(`   ${CSPPolicies.strict()}\n`);

    console.log('2. CSP Moderada:');
    console.log(`   ${CSPPolicies.moderate()}\n`);

    const nonce = NonceGenerator.generate();
    console.log('3. CSP con Nonce:');
    console.log(`   Nonce: ${nonce}`);
    console.log(`   ${CSPPolicies.withNonce(nonce)}\n`);

    console.log('4. Hash de script inline:');
    const scriptContent = 'console.log("Hello, World!");';
    const scriptHash = NonceGenerator.generateHash(scriptContent);
    console.log(`   Script: ${scriptContent}`);
    console.log(`   Hash: ${scriptHash}`);
}

/**
 * Demostración de codificación contextual
 */
export function demonstrateContextualEncoding(): void {
    console.log('\n=== Codificación Contextual ===\n');

    const maliciousInput = '<script>alert("XSS")</script>';

    console.log(`Input original: ${maliciousInput}\n`);

    console.log('1. Para HTML body:');
    console.log(`   ${ContextualEncoder.forHTML(maliciousInput)}\n`);

    console.log('2. Para atributo HTML:');
    console.log(`   ${ContextualEncoder.forHTMLAttribute(maliciousInput)}\n`);

    console.log('3. Para JavaScript string:');
    console.log(`   ${ContextualEncoder.forJavaScript(maliciousInput)}\n`);

    console.log('4. Para CSS:');
    console.log(`   ${ContextualEncoder.forCSS(maliciousInput)}\n`);

    console.log('5. Para URL:');
    console.log(`   ${ContextualEncoder.forURL(maliciousInput)}\n`);
}

/**
 * Demostración de sanitización
 */
export function demonstrateSanitization(): void {
    console.log('\n=== Sanitización HTML ===\n');

    const inputs = [
        '<p>Normal paragraph</p>',
        '<script>alert("XSS")</script>',
        '<b>Bold text</b> with <script>evil</script>',
        '<a href="javascript:alert(1)">Click</a>',
        '<img src=x onerror=alert(1)>',
    ];

    const sanitizer = new HTMLSanitizer({
        allowedTags: ['b', 'i', 'p', 'a'],
        allowedAttributes: { a: ['href'] },
        allowedProtocols: ['http', 'https'],
    });

    inputs.forEach((input, index) => {
        console.log(`${index + 1}. Input: ${input}`);
        console.log(`   Sanitized: ${sanitizer.sanitize(input)}\n`);
    });
}

/**
 * Demostración de validación
 */
export function demonstrateValidation(): void {
    console.log('\n=== Validación de Entrada ===\n');

    const testCases = [
        { type: 'email', value: 'user@example.com' },
        { type: 'email', value: 'invalid-email' },
        { type: 'username', value: 'user_123' },
        { type: 'username', value: 'user@invalid!' },
        { type: 'url', value: 'https://example.com' },
        { type: 'url', value: 'javascript:alert(1)' },
    ];

    testCases.forEach(({ type, value }) => {
        let valid = false;

        switch (type) {
            case 'email':
                valid = InputValidators.email(value);
                break;
            case 'username':
                valid = InputValidators.username(value);
                break;
            case 'url':
                valid = InputValidators.url(value);
                break;
        }

        const status = valid ? '✅' : '❌';
        console.log(`${status} ${type}: ${value}`);
    });
}

/**
 * Mejores prácticas
 */
export function printBestPractices(): void {
    console.log('\n=== Mejores Prácticas para Prevención de XSS ===\n');

    console.log('🛡️  DEFENSA EN CAPAS:');
    console.log('   1. Validación de entrada (whitelist)');
    console.log('   2. Codificación de salida (contextual)');
    console.log('   3. Content Security Policy');
    console.log('   4. HttpOnly cookies');
    console.log('   5. X-XSS-Protection header');

    console.log('\n📝 CODIFICACIÓN:');
    console.log('   - HTML body: htmlEncode()');
    console.log('   - HTML attributes: attributeEncode()');
    console.log('   - JavaScript: jsEncode()');
    console.log('   - CSS: cssEncode()');
    console.log('   - URL: urlEncode()');

    console.log('\n🔐 CONTENT SECURITY POLICY:');
    console.log('   - Bloquear inline scripts por defecto');
    console.log('   - Usar nonces o hashes para scripts legítimos');
    console.log('   - Definir fuentes permitidas');
    console.log('   - Modo report-only para testing');

    console.log('\n✅ FRAMEWORKS SEGUROS:');
    console.log('   - React (auto-escape por defecto)');
    console.log('   - Angular (sanitización integrada)');
    console.log('   - Vue.js (v-text para texto plano)');
    console.log('   - Evitar dangerouslySetInnerHTML / v-html');

    console.log('\n🚫 NUNCA:');
    console.log('   - Confiar en input del usuario');
    console.log('   - Usar eval() o equivalentes');
    console.log('   - innerHTML con datos no sanitizados');
    console.log('   - document.write() con datos externos');
}

// ============================================================================
// Ejecución
// ============================================================================

if (require.main === module) {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║        XSS PREVENTION - Técnicas Avanzadas            ║');
    console.log('╚════════════════════════════════════════════════════════╝');

    demonstrateCSP();
    demonstrateContextualEncoding();
    demonstrateSanitization();
    demonstrateValidation();
    printBestPractices();

    console.log('\n✅ Demostración completada\n');
}
