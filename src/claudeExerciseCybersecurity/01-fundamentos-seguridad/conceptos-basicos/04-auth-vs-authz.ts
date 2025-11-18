/**
 * Autenticación vs Autorización (Authentication vs Authorization)
 *
 * AUTENTICACIÓN (AuthN): Verificar QUIÉN eres
 * - "¿Eres realmente quien dices ser?"
 * - Ejemplos: contraseña, biométricos, tokens, certificados
 *
 * AUTORIZACIÓN (AuthZ): Verificar QUÉ puedes hacer
 * - "¿Tienes permiso para hacer esta acción?"
 * - Ejemplos: RBAC, ABAC, ACL, permisos de archivos
 *
 * Orden: SIEMPRE autenticar primero, luego autorizar
 */

import * as crypto from 'crypto';

// ============================================================================
// VULNERABLE: Confusión entre AuthN y AuthZ
// ============================================================================

/**
 * VULNERABLE: Autorización sin autenticación adecuada
 * Problema: Confía en datos del cliente que pueden ser manipulados
 */
class InsecureAPIServer {
    private documents: Map<string, { content: string; owner: string }> = new Map();

    constructor() {
        this.documents.set('doc1', {
            content: 'Documento público',
            owner: 'alice'
        });
        this.documents.set('doc2', {
            content: 'Documento privado de Alice',
            owner: 'alice'
        });
        this.documents.set('doc3', {
            content: 'Documento privado de Bob',
            owner: 'bob'
        });
    }

    // VULNERABLE: Confía en el parámetro userId sin autenticación
    getDocument(userId: string, docId: string): string | undefined {
        const doc = this.documents.get(docId);

        if (!doc) {
            console.log('[INSEGURO] Documento no encontrado');
            return undefined;
        }

        // VULNERABLE: Solo verifica autorización, asume que userId es legítimo
        if (doc.owner === userId) {
            console.log(`[INSEGURO] ${userId} accedió a ${docId}`);
            return doc.content;
        }

        console.log(`[INSEGURO] Acceso denegado`);
        return undefined;
    }
}

// ============================================================================
// SEGURO: Autenticación y Autorización separadas pero integradas
// ============================================================================

/**
 * PASO 1: AUTENTICACIÓN
 * Verificar la identidad del usuario
 */

interface Credentials {
    username: string;
    password: string;
}

interface AuthenticationToken {
    userId: string;
    username: string;
    issuedAt: number;
    expiresAt: number;
    signature: string;
}

class AuthenticationService {
    private users: Map<string, { passwordHash: string; userId: string }> = new Map();
    private tokenSecret: Buffer;

    constructor() {
        this.tokenSecret = crypto.randomBytes(32);

        // Registrar usuarios de prueba
        this.registerUser('alice', 'AliceSecure123!');
        this.registerUser('bob', 'BobSecure456!');
    }

    registerUser(username: string, password: string): void {
        const userId = crypto.randomUUID();
        const salt = crypto.randomBytes(16).toString('hex');
        const passwordHash = crypto
            .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
            .toString('hex');

        this.users.set(username, {
            passwordHash: `${salt}:${passwordHash}`,
            userId
        });
    }

    // AUTENTICACIÓN: Verificar credenciales y emitir token
    authenticate(credentials: Credentials): {
        success: boolean;
        token?: AuthenticationToken;
        message: string;
    } {
        const user = this.users.get(credentials.username);

        if (!user) {
            console.log(`[AUTH] Autenticación fallida: usuario no existe`);
            return { success: false, message: 'Credenciales inválidas' };
        }

        // Verificar contraseña
        const [salt, hash] = user.passwordHash.split(':');
        const verifyHash = crypto
            .pbkdf2Sync(credentials.password, salt, 100000, 64, 'sha512')
            .toString('hex');

        if (!crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash))) {
            console.log(`[AUTH] Autenticación fallida: contraseña incorrecta`);
            return { success: false, message: 'Credenciales inválidas' };
        }

        // Generar token de autenticación
        const issuedAt = Date.now();
        const expiresAt = issuedAt + 3600000; // 1 hora

        const tokenData = {
            userId: user.userId,
            username: credentials.username,
            issuedAt,
            expiresAt,
            signature: ''
        };

        // Firmar el token
        const signature = this.signToken(tokenData);
        tokenData.signature = signature;

        console.log(`[AUTH] ✓ Autenticación exitosa para ${credentials.username}`);

        return {
            success: true,
            token: tokenData,
            message: 'Autenticación exitosa'
        };
    }

    // Verificar que el token es válido y no ha expirado
    verifyToken(token: AuthenticationToken): {
        valid: boolean;
        userId?: string;
        message: string;
    } {
        // Verificar expiración
        if (Date.now() > token.expiresAt) {
            return { valid: false, message: 'Token expirado' };
        }

        // Verificar firma
        const expectedSignature = this.signToken({
            userId: token.userId,
            username: token.username,
            issuedAt: token.issuedAt,
            expiresAt: token.expiresAt,
            signature: ''
        });

        if (
            !crypto.timingSafeEqual(
                Buffer.from(token.signature),
                Buffer.from(expectedSignature)
            )
        ) {
            console.log('[AUTH] Token inválido: firma no coincide');
            return { valid: false, message: 'Token inválido' };
        }

        return {
            valid: true,
            userId: token.userId,
            message: 'Token válido'
        };
    }

    private signToken(token: Omit<AuthenticationToken, 'signature'>): string {
        const data = `${token.userId}:${token.username}:${token.issuedAt}:${token.expiresAt}`;
        return crypto.createHmac('sha256', this.tokenSecret).update(data).digest('hex');
    }
}

/**
 * PASO 2: AUTORIZACIÓN
 * Verificar permisos del usuario autenticado
 */

enum ResourceType {
    DOCUMENT = 'document',
    PROJECT = 'project',
    SETTINGS = 'settings'
}

enum Action {
    READ = 'read',
    WRITE = 'write',
    DELETE = 'delete',
    SHARE = 'share'
}

interface Resource {
    id: string;
    type: ResourceType;
    owner: string;
    content: string;
}

interface Permission {
    userId: string;
    resourceId: string;
    actions: Set<Action>;
}

class AuthorizationService {
    private resources: Map<string, Resource> = new Map();
    private permissions: Permission[] = [];

    constructor() {
        // Crear recursos de ejemplo
        this.resources.set('doc1', {
            id: 'doc1',
            type: ResourceType.DOCUMENT,
            owner: 'alice-uuid',
            content: 'Documento público'
        });

        this.resources.set('doc2', {
            id: 'doc2',
            type: ResourceType.DOCUMENT,
            owner: 'alice-uuid',
            content: 'Documento privado de Alice'
        });

        this.resources.set('doc3', {
            id: 'doc3',
            type: ResourceType.DOCUMENT,
            owner: 'bob-uuid',
            content: 'Documento privado de Bob'
        });

        // Permisos: Alice comparte doc2 con Bob (solo lectura)
        this.permissions.push({
            userId: 'bob-uuid',
            resourceId: 'doc2',
            actions: new Set([Action.READ])
        });
    }

    // AUTORIZACIÓN: Verificar si el usuario tiene permiso
    authorize(
        userId: string,
        resourceId: string,
        action: Action
    ): { authorized: boolean; message: string } {
        const resource = this.resources.get(resourceId);

        if (!resource) {
            return { authorized: false, message: 'Recurso no encontrado' };
        }

        // El propietario tiene todos los permisos
        if (resource.owner === userId) {
            console.log(`[AUTHZ] ✓ Autorizado: ${userId} es propietario de ${resourceId}`);
            return { authorized: true, message: 'Acceso autorizado (propietario)' };
        }

        // Verificar permisos explícitos
        const permission = this.permissions.find(
            p => p.userId === userId && p.resourceId === resourceId
        );

        if (permission && permission.actions.has(action)) {
            console.log(`[AUTHZ] ✓ Autorizado: ${userId} tiene permiso ${action} en ${resourceId}`);
            return { authorized: true, message: 'Acceso autorizado (permiso explícito)' };
        }

        console.log(`[AUTHZ] ✗ Denegado: ${userId} no tiene permiso ${action} en ${resourceId}`);
        return { authorized: false, message: 'Acceso denegado: permisos insuficientes' };
    }

    getResource(resourceId: string): Resource | undefined {
        return this.resources.get(resourceId);
    }

    grantPermission(
        ownerId: string,
        userId: string,
        resourceId: string,
        actions: Action[]
    ): { success: boolean; message: string } {
        const resource = this.resources.get(resourceId);

        if (!resource) {
            return { success: false, message: 'Recurso no encontrado' };
        }

        if (resource.owner !== ownerId) {
            return {
                success: false,
                message: 'Solo el propietario puede otorgar permisos'
            };
        }

        this.permissions.push({
            userId,
            resourceId,
            actions: new Set(actions)
        });

        console.log(`[AUTHZ] Permisos otorgados: ${userId} puede ${actions.join(', ')} en ${resourceId}`);

        return { success: true, message: 'Permisos otorgados' };
    }
}

/**
 * INTEGRACIÓN: Sistema completo con AuthN + AuthZ
 */
class SecureAPIServer {
    private authService: AuthenticationService;
    private authzService: AuthorizationService;

    constructor() {
        this.authService = new AuthenticationService();
        this.authzService = new AuthorizationService();
    }

    // Login: Solo autenticación
    login(username: string, password: string): {
        success: boolean;
        token?: AuthenticationToken;
        message: string;
    } {
        return this.authService.authenticate({ username, password });
    }

    // Acceso a recurso: Requiere autenticación Y autorización
    getDocument(token: AuthenticationToken, docId: string): {
        success: boolean;
        content?: string;
        message: string;
    } {
        // PASO 1: AUTENTICACIÓN - Verificar token
        const authResult = this.authService.verifyToken(token);

        if (!authResult.valid) {
            return { success: false, message: `Autenticación falló: ${authResult.message}` };
        }

        console.log(`[API] Usuario autenticado: ${token.username}`);

        // PASO 2: AUTORIZACIÓN - Verificar permisos
        const authzResult = this.authzService.authorize(
            authResult.userId!,
            docId,
            Action.READ
        );

        if (!authzResult.authorized) {
            return {
                success: false,
                message: `Autorización falló: ${authzResult.message}`
            };
        }

        // Ambas verificaciones pasaron, retornar recurso
        const resource = this.authzService.getResource(docId);

        return {
            success: true,
            content: resource?.content,
            message: 'Acceso concedido'
        };
    }

    writeDocument(
        token: AuthenticationToken,
        docId: string,
        content: string
    ): { success: boolean; message: string } {
        // Autenticación
        const authResult = this.authService.verifyToken(token);
        if (!authResult.valid) {
            return { success: false, message: `Autenticación falló: ${authResult.message}` };
        }

        // Autorización
        const authzResult = this.authzService.authorize(
            authResult.userId!,
            docId,
            Action.WRITE
        );

        if (!authzResult.authorized) {
            return {
                success: false,
                message: `Autorización falló: ${authzResult.message}`
            };
        }

        console.log(`[API] Documento ${docId} actualizado por ${token.username}`);

        return { success: true, message: 'Documento actualizado' };
    }
}

// ============================================================================
// DEMOSTRACIÓN
// ============================================================================

function demonstrateAuthNvsAuthZ(): void {
    console.log('\n=== AUTENTICACIÓN vs AUTORIZACIÓN ===\n');

    // 1. Sistema inseguro
    console.log('--- 1. SISTEMA INSEGURO (sin autenticación adecuada) ---\n');

    const insecureAPI = new InsecureAPIServer();

    console.log('Atacante afirma ser "alice":');
    const result1 = insecureAPI.getDocument('alice', 'doc2');
    console.log(`Contenido: ${result1}\n`);

    console.log('Problema: El sistema confía en el userId del cliente');
    console.log('Un atacante puede simplemente cambiar el parámetro\n');

    // 2. Sistema seguro
    console.log('--- 2. SISTEMA SEGURO (AuthN + AuthZ separados) ---\n');

    const secureAPI = new SecureAPIServer();

    // Escenario 1: Login exitoso
    console.log('Escenario 1: Alice hace login');
    const aliceLogin = secureAPI.login('alice', 'AliceSecure123!');
    console.log(`Resultado: ${aliceLogin.message}\n`);

    if (!aliceLogin.token) {
        return;
    }

    // Escenario 2: Acceso autorizado
    console.log('Escenario 2: Alice accede a su propio documento');
    const accessOwn = secureAPI.getDocument(aliceLogin.token, 'doc2');
    console.log(`Contenido: ${accessOwn.content}\n`);

    // Escenario 3: Acceso no autorizado
    console.log('Escenario 3: Alice intenta acceder al documento de Bob');
    const accessOther = secureAPI.getDocument(aliceLogin.token, 'doc3');
    console.log(`Resultado: ${accessOther.message}\n`);

    // Escenario 4: Bob con permisos compartidos
    console.log('Escenario 4: Bob hace login y accede a documento compartido');
    const bobLogin = secureAPI.login('bob', 'BobSecure456!');

    if (bobLogin.token) {
        const sharedAccess = secureAPI.getDocument(bobLogin.token, 'doc2');
        console.log(`Resultado: ${sharedAccess.message}`);
        console.log(`Contenido: ${sharedAccess.content}\n`);
    }

    // Escenario 5: Bob intenta escribir (sin permiso)
    console.log('Escenario 5: Bob intenta modificar documento de Alice');
    if (bobLogin.token) {
        const writeResult = secureAPI.writeDocument(
            bobLogin.token,
            'doc2',
            'contenido modificado'
        );
        console.log(`Resultado: ${writeResult.message}\n`);
    }

    // Escenario 6: Token inválido/expirado
    console.log('Escenario 6: Intento con token manipulado');
    const fakeToken: AuthenticationToken = {
        userId: 'fake-uuid',
        username: 'hacker',
        issuedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        signature: 'invalid-signature'
    };

    const hackerAccess = secureAPI.getDocument(fakeToken, 'doc2');
    console.log(`Resultado: ${hackerAccess.message}`);
}

// Ejecutar demostración
if (require.main === module) {
    demonstrateAuthNvsAuthZ();
}

export {
    AuthenticationService,
    AuthenticationToken,
    AuthorizationService,
    ResourceType,
    Action,
    SecureAPIServer
};
