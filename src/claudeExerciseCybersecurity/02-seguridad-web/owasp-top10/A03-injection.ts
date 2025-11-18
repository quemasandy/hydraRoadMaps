/**
 * OWASP A03:2021 - Injection
 *
 * Datos no confiables son enviados a un intérprete como parte de un comando o query.
 * Incluye: SQL, NoSQL, OS command, LDAP, Expression Language injection.
 */

// VULNERABLE: SQL Injection
class InsecureSQLQuery {
    query(username: string): string {
        // VULNERABLE: Interpolación directa de strings
        return `SELECT * FROM users WHERE username = '${username}'`;
    }
}

// SEGURO: Prepared statements / Parameterized queries
class SecureSQLQuery {
    query(username: string): { sql: string; params: any[] } {
        // Usar placeholders parametrizados
        return {
            sql: 'SELECT * FROM users WHERE username = ?',
            params: [username]
        };
    }
}

// VULNERABLE: Command Injection
class InsecureCommandExec {
    ping(host: string): void {
        const { execSync } = require('child_process');
        // VULNERABLE: Ejecuta input del usuario directamente
        execSync(`ping -c 1 ${host}`);
    }
}

// SEGURO: Validar y sanitizar input
class SecureCommandExec {
    ping(host: string): void {
        // Validar formato de IP/hostname
        if (!/^[a-zA-Z0-9.-]+$/.test(host)) {
            throw new Error('Invalid host format');
        }

        const { execFileSync } = require('child_process');
        // Usar execFile con argumentos separados
        execFileSync('ping', ['-c', '1', host]);
    }
}

function demonstrateInjection(): void {
    console.log('=== OWASP A03: Injection ===\n');

    const insecure = new InsecureSQLQuery();
    const malicious = "admin' OR '1'='1";

    console.log('SQL Injection Attack:');
    console.log(insecure.query(malicious));
    console.log('^ Esta query retorna todos los usuarios!\n');

    const secure = new SecureSQLQuery();
    console.log('Secure Query:');
    console.log(secure.query(malicious));
    console.log('^ El input es tratado como string literal\n');

    console.log('Mitigaciones:');
    console.log('✓ Usar prepared statements/parametrizedqueries');
    console.log('✓ ORMs que manejan escape automático');
    console.log('✓ Validar input con whitelist');
    console.log('✓ Principio de mínimo privilegio en DB');
}

if (require.main === module) demonstrateInjection();

export { SecureSQLQuery, SecureCommandExec };
