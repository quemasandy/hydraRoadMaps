/**
 * SQL Injection Prevention
 *
 * Técnicas de prevención:
 * - Prepared Statements (Parameterized Queries)
 * - ORM (Object-Relational Mapping)
 * - Stored Procedures (con cuidado)
 * - Input Validation y Whitelist
 * - Principle of Least Privilege
 * - WAF (Web Application Firewall)
 */

import { createHash } from 'crypto';

// ============================================================================
// Simulación de Prepared Statements
// ============================================================================

/**
 * ✅ SECURE: Prepared Statement Simulator
 */
export class PreparedStatement {
    private query: string;
    private params: Map<string, any> = new Map();

    constructor(query: string) {
        this.query = query;
    }

    setString(param: string, value: string): void {
        // Escapar automáticamente caracteres especiales
        const escaped = this.escape(value);
        this.params.set(param, escaped);
    }

    setInt(param: string, value: number): void {
        this.params.set(param, value);
    }

    private escape(value: string): string {
        // Escapar caracteres peligrosos
        return value
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\x00/g, '\\0');
    }

    execute(): string {
        let finalQuery = this.query;

        this.params.forEach((value, param) => {
            const placeholder = `:${param}`;
            const safeValue = typeof value === 'string' ? `'${value}'` : value;
            finalQuery = finalQuery.replace(placeholder, String(safeValue));
        });

        return finalQuery;
    }
}

// ============================================================================
// ✅ SECURE: Login con Prepared Statements
// ============================================================================

interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    role: string;
}

const users: User[] = [
    {
        id: 1,
        username: 'admin',
        password: createHash('sha256').update('admin123').digest('hex'),
        email: 'admin@example.com',
        role: 'admin',
    },
    {
        id: 2,
        username: 'alice',
        password: createHash('sha256').update('alice123').digest('hex'),
        email: 'alice@example.com',
        role: 'user',
    },
];

/**
 * ✅ SECURE: Login usando prepared statements
 */
export function secureLogin(username: string, password: string): User | null {
    // Construir query con placeholders
    const stmt = new PreparedStatement(
        'SELECT * FROM users WHERE username = :username AND password = :password'
    );

    // Binding de parámetros (automáticamente escapados)
    stmt.setString('username', username);
    stmt.setString('password', createHash('sha256').update(password).digest('hex'));

    const query = stmt.execute();
    console.log(`[SECURE] Query ejecutada: ${query}`);

    // Los caracteres maliciosos están escapados
    const user = users.find(
        u => u.username === username &&
            u.password === createHash('sha256').update(password).digest('hex')
    );

    return user || null;
}

/**
 * ✅ SECURE: Búsqueda con prepared statement
 */
export function secureSearchUsers(searchTerm: string): User[] {
    const stmt = new PreparedStatement(
        'SELECT * FROM users WHERE username LIKE :search'
    );

    stmt.setString('search', `%${searchTerm}%`);

    const query = stmt.execute();
    console.log(`[SECURE] Query ejecutada: ${query}`);

    // Búsqueda segura
    return users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

/**
 * ✅ SECURE: Actualizar con prepared statement
 */
export function secureUpdateEmail(userId: number, newEmail: string): boolean {
    const stmt = new PreparedStatement(
        'UPDATE users SET email = :email WHERE id = :userId'
    );

    stmt.setString('email', newEmail);
    stmt.setInt('userId', userId);

    const query = stmt.execute();
    console.log(`[SECURE] Query ejecutada: ${query}`);

    const user = users.find(u => u.id === userId);
    if (user) {
        user.email = newEmail;
        return true;
    }

    return false;
}

// ============================================================================
// ORM Pattern (Simplified)
// ============================================================================

/**
 * ✅ SECURE: Clase ORM simplificada
 */
export class UserModel {
    static async findByUsername(username: string): Promise<User | null> {
        // ORM abstrae las queries SQL
        // Internamente usa prepared statements
        console.log(`[ORM] Finding user: ${username}`);

        return users.find(u => u.username === username) || null;
    }

    static async findById(id: number): Promise<User | null> {
        console.log(`[ORM] Finding user by ID: ${id}`);

        return users.find(u => u.id === id) || null;
    }

    static async findWhere(conditions: Partial<User>): Promise<User[]> {
        console.log(`[ORM] Finding users with conditions:`, conditions);

        return users.filter(user => {
            return Object.entries(conditions).every(
                ([key, value]) => user[key as keyof User] === value
            );
        });
    }

    static async create(userData: Omit<User, 'id'>): Promise<User> {
        const newUser: User = {
            id: users.length + 1,
            ...userData,
        };

        users.push(newUser);
        console.log(`[ORM] User created: ${newUser.username}`);

        return newUser;
    }

    static async update(
        id: number,
        updates: Partial<Omit<User, 'id'>>
    ): Promise<boolean> {
        const user = users.find(u => u.id === id);

        if (!user) {
            return false;
        }

        Object.assign(user, updates);
        console.log(`[ORM] User updated: ${user.username}`);

        return true;
    }
}

// ============================================================================
// Input Validation
// ============================================================================

/**
 * Validadores de entrada
 */
export class InputValidator {
    /**
     * Valida ID numérico
     */
    static validateId(id: string): number | null {
        const numId = parseInt(id, 10);

        if (isNaN(numId) || numId < 1) {
            console.warn('⚠️  ID inválido');
            return null;
        }

        return numId;
    }

    /**
     * Valida username (whitelist)
     */
    static validateUsername(username: string): string | null {
        // Solo alfanuméricos, guiones y guiones bajos
        const pattern = /^[a-zA-Z0-9_-]{3,20}$/;

        if (!pattern.test(username)) {
            console.warn('⚠️  Username contiene caracteres inválidos');
            return null;
        }

        return username;
    }

    /**
     * Valida email
     */
    static validateEmail(email: string): string | null {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!pattern.test(email) || email.length > 254) {
            console.warn('⚠️  Email inválido');
            return null;
        }

        return email;
    }

    /**
     * Detecta patrones SQL sospechosos
     */
    static detectSQLiAttempt(input: string): boolean {
        const sqlPatterns = [
            /(\bUNION\b.*\bSELECT\b)/i,
            /(\bSELECT\b.*\bFROM\b)/i,
            /(\bINSERT\b.*\bINTO\b)/i,
            /(\bUPDATE\b.*\bSET\b)/i,
            /(\bDELETE\b.*\bFROM\b)/i,
            /(\bDROP\b.*\bTABLE\b)/i,
            /(--|\#|\/\*|\*\/)/,
            /(\bOR\b.*=.*)/i,
            /(\bAND\b.*=.*)/i,
            /(\bSLEEP\(|WAITFOR\b|BENCHMARK\()/i,
        ];

        return sqlPatterns.some(pattern => pattern.test(input));
    }

    /**
     * Sanitiza input (último recurso, NO reemplaza prepared statements)
     */
    static sanitize(input: string): string {
        return input
            .replace(/['"\\;]/g, '')  // Remover caracteres peligrosos
            .trim();
    }
}

/**
 * ✅ SECURE: Login con validación completa
 */
export function secureLoginWithValidation(
    username: string,
    password: string
): { success: boolean; user?: User; error?: string } {
    // 1. Validar username
    const validUsername = InputValidator.validateUsername(username);

    if (!validUsername) {
        return { success: false, error: 'Username inválido' };
    }

    // 2. Detectar intentos de SQLi
    if (InputValidator.detectSQLiAttempt(username) ||
        InputValidator.detectSQLiAttempt(password)) {
        console.warn('⚠️  Intento de SQL Injection detectado!');
        return { success: false, error: 'Input sospechoso detectado' };
    }

    // 3. Usar prepared statement
    const user = secureLogin(validUsername, password);

    if (!user) {
        return { success: false, error: 'Credenciales inválidas' };
    }

    return { success: true, user };
}

// ============================================================================
// Demostración de Protección
// ============================================================================

/**
 * Demostración de Prepared Statements
 */
export function demonstratePreparedStatements(): void {
    console.log('\n=== Prepared Statements ===\n');

    console.log('1. Intento legítimo:');
    const legitResult = secureLogin('admin', 'admin123');
    console.log(`   Resultado: ${legitResult ? '✅ Autenticado' : '❌ Fallido'}\n`);

    console.log('2. Intento de SQLi:');
    const maliciousUsername = "admin' OR '1'='1";
    const sqliResult = secureLogin(maliciousUsername, 'anypassword');
    console.log(`   Username: ${maliciousUsername}`);
    console.log(`   Resultado: ${sqliResult ? '✅ Autenticado' : '❌ Bloqueado'}`);
    console.log('   ✅ El payload está escapado, NO se ejecuta como SQL!\n');

    console.log('3. Query generada con prepared statement:');
    const stmt = new PreparedStatement(
        'SELECT * FROM users WHERE username = :username'
    );
    stmt.setString('username', "admin' OR '1'='1");
    console.log(`   ${stmt.execute()}`);
    console.log('   Nota: Las comillas están escapadas');
}

/**
 * Demostración de ORM
 */
export function demonstrateORM(): void {
    console.log('\n=== ORM (Object-Relational Mapping) ===\n');

    console.log('1. Búsqueda simple:');
    UserModel.findByUsername('admin').then(user => {
        console.log(`   Usuario encontrado: ${user?.username}\n`);
    });

    console.log('2. Búsqueda con condiciones:');
    UserModel.findWhere({ role: 'admin' }).then(users => {
        console.log(`   Administradores encontrados: ${users.length}\n`);
    });

    console.log('3. Intento de SQLi (bloqueado por ORM):');
    const malicious = "admin' OR '1'='1";
    UserModel.findByUsername(malicious).then(user => {
        console.log(`   Búsqueda: ${malicious}`);
        console.log(`   Resultado: ${user ? 'Encontrado' : 'No encontrado'}`);
        console.log('   ✅ ORM trata el input como dato, no como SQL');
    });
}

/**
 * Demostración de validación
 */
export function demonstrateValidation(): void {
    console.log('\n=== Validación de Entrada ===\n');

    const testInputs = [
        { username: 'admin', password: 'admin123' },
        { username: "admin' OR '1'='1", password: 'test' },
        { username: 'user123', password: "' OR 1=1--" },
        { username: 'invalid@user!', password: 'test' },
    ];

    testInputs.forEach((input, index) => {
        console.log(`${index + 1}. Username: ${input.username}`);
        const result = secureLoginWithValidation(input.username, input.password);
        console.log(`   ${result.success ? '✅' : '❌'} ${result.error || 'Autenticado'}\n`);
    });
}

/**
 * Mejores prácticas
 */
export function printSQLiBestPractices(): void {
    console.log('\n=== Mejores Prácticas para Prevenir SQLi ===\n');

    console.log('🛡️  DEFENSA PRIMARIA:');
    console.log('   1. Prepared Statements / Parameterized Queries');
    console.log('   2. ORM frameworks (TypeORM, Prisma, Sequelize)');
    console.log('   3. NUNCA concatenar strings para queries\n');

    console.log('✅ VALIDACIÓN:');
    console.log('   1. Whitelist de caracteres permitidos');
    console.log('   2. Validar tipo de datos (int, email, etc.)');
    console.log('   3. Validar longitud máxima');
    console.log('   4. Detectar patrones SQL sospechosos\n');

    console.log('🔒 CONFIGURACIÓN DE DB:');
    console.log('   1. Principle of Least Privilege');
    console.log('   2. Usuario de app sin permisos DROP/CREATE');
    console.log('   3. Separar lectura y escritura');
    console.log('   4. Deshabilitar comandos del sistema\n');

    console.log('🚫 MANEJO DE ERRORES:');
    console.log('   1. NO mostrar errores SQL al usuario');
    console.log('   2. Logging de errores server-side');
    console.log('   3. Mensajes genéricos al usuario\n');

    console.log('🔍 MONITOREO:');
    console.log('   1. WAF (Web Application Firewall)');
    console.log('   2. IDS/IPS para detectar SQLi');
    console.log('   3. Logging de queries sospechosas');
    console.log('   4. Alertas en tiempo real\n');

    console.log('📝 FRAMEWORKS SEGUROS:');
    console.log('   - TypeORM: @Query con parámetros');
    console.log('   - Prisma: Query builder type-safe');
    console.log('   - Sequelize: Prepared statements por defecto');
    console.log('   - Knex.js: Query builder');
}

/**
 * Ejemplo de código vulnerable vs seguro
 */
export function printCodeComparison(): void {
    console.log('\n=== Comparación: Vulnerable vs Seguro ===\n');

    console.log('❌ VULNERABLE:');
    console.log(`
const query = \`SELECT * FROM users
    WHERE username = '\${username}'
    AND password = '\${password}'\`;

db.execute(query);
    `);

    console.log('✅ SEGURO (Prepared Statement):');
    console.log(`
const query = \`SELECT * FROM users
    WHERE username = ?
    AND password = ?\`;

db.execute(query, [username, password]);
    `);

    console.log('✅ SEGURO (Named Parameters):');
    console.log(`
const query = \`SELECT * FROM users
    WHERE username = :username
    AND password = :password\`;

db.execute(query, { username, password });
    `);

    console.log('✅ SEGURO (ORM):');
    console.log(`
await User.findOne({
    where: {
        username: username,
        password: password
    }
});
    `);
}

// ============================================================================
// Ejecución
// ============================================================================

if (require.main === module) {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║       SQL INJECTION PREVENTION                        ║');
    console.log('╚════════════════════════════════════════════════════════╝');

    demonstratePreparedStatements();
    demonstrateORM();
    demonstrateValidation();
    printSQLiBestPractices();
    printCodeComparison();

    console.log('\n✅ Demostración completada\n');
}
