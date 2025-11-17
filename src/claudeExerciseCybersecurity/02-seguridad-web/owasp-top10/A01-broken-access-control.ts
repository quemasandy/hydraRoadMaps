/**
 * OWASP A01:2021 - Broken Access Control
 *
 * Control de acceso roto permite a usuarios actuar fuera de sus permisos.
 * Subió de #5 en 2017 a #1 en 2021.
 *
 * Vulnerabilidades comunes:
 * - IDOR (Insecure Direct Object References)
 * - Path traversal
 * - Elevation of privilege
 * - Missing function level access control
 * - Metadata manipulation (JWT, cookies)
 */

import * as crypto from 'crypto';

// VULNERABLE: IDOR - Acceso directo a objetos sin verificación
class InsecureUserAPI {
    private users = new Map([
        ['1', { id: '1', name: 'Alice', email: 'alice@example.com', salary: 100000 }],
        ['2', { id: '2', name: 'Bob', email: 'bob@example.com', salary: 80000 }]
    ]);

    getUser(userId: string, requesterId: string): any {
        // VULNERABLE: No verifica que requesterId tenga permiso
        console.log(`[VULNERABLE] User ${requesterId} accessing user ${userId}`);
        return this.users.get(userId);
    }
}

// SEGURO: Verificación de autorización
enum Role { USER = 'user', ADMIN = 'admin' }

interface SecureUser {
    id: string;
    name: string;
    email: string;
    salary: number;
    role: Role;
}

class SecureUserAPI {
    private users = new Map<string, SecureUser>([
        ['1', { id: '1', name: 'Alice', email: 'alice@example.com', salary: 100000, role: Role.USER }],
        ['2', { id: '2', name: 'Bob', email: 'bob@example.com', salary: 80000, role: Role.ADMIN }]
    ]);

    getUser(userId: string, requesterId: string): SecureUser | null {
        const requester = this.users.get(requesterId);
        const target = this.users.get(userId);

        if (!requester || !target) return null;

        // Solo puede ver sus propios datos o ser admin
        if (requesterId !== userId && requester.role !== Role.ADMIN) {
            console.log(`[SECURE] Access denied: ${requesterId} cannot access user ${userId}`);
            return null;
        }

        console.log(`[SECURE] Access granted: ${requesterId} can access user ${userId}`);
        return target;
    }
}

// VULNERABLE: Path Traversal
class InsecureFileServer {
    readFile(filename: string): string {
        const fs = require('fs');
        // VULNERABLE: Sin sanitización
        return fs.readFileSync(`/app/public/${filename}`, 'utf8');
    }
}

// SEGURO: Validación de rutas
class SecureFileServer {
    private readonly basePath = '/app/public';
    private readonly allowedExtensions = ['.txt', '.pdf', '.jpg'];

    readFile(filename: string): string | null {
        const path = require('path');
        const fs = require('fs');

        // Resolver ruta completa y verificar que esté dentro de basePath
        const fullPath = path.resolve(this.basePath, filename);

        if (!fullPath.startsWith(this.basePath)) {
            console.log(`[SECURE] Path traversal attempt blocked: ${filename}`);
            return null;
        }

        // Verificar extensión permitida
        const ext = path.extname(filename);
        if (!this.allowedExtensions.includes(ext)) {
            console.log(`[SECURE] Invalid file extension: ${ext}`);
            return null;
        }

        try {
            return fs.readFileSync(fullPath, 'utf8');
        } catch {
            return null;
        }
    }
}

function demonstrateA01(): void {
    console.log('\n=== OWASP A01: Broken Access Control ===\n');

    console.log('1. IDOR Vulnerability:');
    const insecureAPI = new InsecureUserAPI();
    console.log(insecureAPI.getUser('1', '2')); // Bob accede a datos de Alice

    console.log('\n2. IDOR Fixed:');
    const secureAPI = new SecureUserAPI();
    console.log(secureAPI.getUser('1', '2')); // Null - acceso denegado
    console.log(secureAPI.getUser('1', '1')); // OK - propios datos

    console.log('\nMitigaciones:');
    console.log('✓ Verificar autorización en el servidor (nunca confiar en cliente)');
    console.log('✓ Usar identificadores indirectos o aleatorios');
    console.log('✓ Denegar por defecto (deny by default)');
    console.log('✓ Logging de intentos de acceso no autorizados');
}

if (require.main === module) demonstrateA01();

export { SecureUserAPI, SecureFileServer };
