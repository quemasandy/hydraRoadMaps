/**
 * Principio de Mínimo Privilegio (Least Privilege)
 *
 * Este principio establece que cada usuario, programa o proceso debe tener
 * solo los privilegios mínimos necesarios para realizar su trabajo.
 *
 * Beneficios:
 * - Reduce el impacto de errores o código malicioso
 * - Limita el daño de cuentas comprometidas
 * - Mejora la auditoría y el cumplimiento
 */

// ============================================================================
// VULNERABLE: Privilegios excesivos
// ============================================================================

/**
 * VULNERABLE: Todos los usuarios tienen permisos de administrador
 * Problema: Un usuario comprometido puede hacer cualquier cosa
 */
enum InsecureRole {
    ADMIN = 'admin' // Todos son admin
}

interface InsecureUser {
    id: string;
    name: string;
    role: InsecureRole;
}

class InsecureFileSystem {
    private files: Map<string, string> = new Map();

    constructor() {
        this.files.set('public.txt', 'Contenido público');
        this.files.set('private.txt', 'Datos sensibles');
        this.files.set('admin.txt', 'Configuración del sistema');
    }

    // VULNERABLE: Cualquier usuario puede leer cualquier archivo
    readFile(user: InsecureUser, filename: string): string | undefined {
        console.log(`[INSEGURO] ${user.name} (${user.role}) leyendo ${filename}`);
        return this.files.get(filename);
    }

    // VULNERABLE: Cualquier usuario puede escribir cualquier archivo
    writeFile(user: InsecureUser, filename: string, content: string): void {
        console.log(`[INSEGURO] ${user.name} (${user.role}) escribiendo ${filename}`);
        this.files.set(filename, content);
    }

    // VULNERABLE: Cualquier usuario puede eliminar archivos
    deleteFile(user: InsecureUser, filename: string): void {
        console.log(`[INSEGURO] ${user.name} (${user.role}) eliminando ${filename}`);
        this.files.delete(filename);
    }
}

// ============================================================================
// SEGURO: Implementación con mínimo privilegio
// ============================================================================

/**
 * Roles granulares con permisos específicos
 */
enum SecureRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    VIEWER = 'viewer',
    GUEST = 'guest'
}

enum Permission {
    READ_PUBLIC = 'read_public',
    READ_PRIVATE = 'read_private',
    READ_ADMIN = 'read_admin',
    WRITE_PUBLIC = 'write_public',
    WRITE_PRIVATE = 'write_private',
    WRITE_ADMIN = 'write_admin',
    DELETE_FILES = 'delete_files',
    MANAGE_USERS = 'manage_users'
}

interface SecureUser {
    id: string;
    name: string;
    role: SecureRole;
    permissions: Set<Permission>;
}

/**
 * Sistema de permisos basado en roles (RBAC)
 */
class RoleBasedAccessControl {
    private static rolePermissions: Map<SecureRole, Set<Permission>> = new Map([
        [
            SecureRole.ADMIN,
            new Set([
                Permission.READ_PUBLIC,
                Permission.READ_PRIVATE,
                Permission.READ_ADMIN,
                Permission.WRITE_PUBLIC,
                Permission.WRITE_PRIVATE,
                Permission.WRITE_ADMIN,
                Permission.DELETE_FILES,
                Permission.MANAGE_USERS
            ])
        ],
        [
            SecureRole.EDITOR,
            new Set([
                Permission.READ_PUBLIC,
                Permission.READ_PRIVATE,
                Permission.WRITE_PUBLIC,
                Permission.WRITE_PRIVATE
            ])
        ],
        [
            SecureRole.VIEWER,
            new Set([
                Permission.READ_PUBLIC,
                Permission.READ_PRIVATE
            ])
        ],
        [
            SecureRole.GUEST,
            new Set([Permission.READ_PUBLIC])
        ]
    ]);

    static getPermissionsForRole(role: SecureRole): Set<Permission> {
        return this.rolePermissions.get(role) || new Set();
    }

    static createUser(
        id: string,
        name: string,
        role: SecureRole
    ): SecureUser {
        return {
            id,
            name,
            role,
            permissions: this.getPermissionsForRole(role)
        };
    }
}

/**
 * SEGURO: Sistema de archivos con control de acceso
 */
interface FileMetadata {
    content: string;
    accessLevel: 'public' | 'private' | 'admin';
    owner: string;
}

class SecureFileSystem {
    private files: Map<string, FileMetadata> = new Map();

    constructor() {
        this.files.set('public.txt', {
            content: 'Contenido público',
            accessLevel: 'public',
            owner: 'system'
        });
        this.files.set('private.txt', {
            content: 'Datos sensibles',
            accessLevel: 'private',
            owner: 'system'
        });
        this.files.set('admin.txt', {
            content: 'Configuración del sistema',
            accessLevel: 'admin',
            owner: 'system'
        });
    }

    private hasPermission(user: SecureUser, permission: Permission): boolean {
        return user.permissions.has(permission);
    }

    readFile(user: SecureUser, filename: string): string | undefined {
        const file = this.files.get(filename);
        if (!file) {
            console.log(`[SEGURO] Archivo ${filename} no encontrado`);
            return undefined;
        }

        // Verificar permisos según el nivel de acceso del archivo
        const requiredPermission = this.getReadPermission(file.accessLevel);

        if (!this.hasPermission(user, requiredPermission)) {
            console.log(
                `[SEGURO] Acceso DENEGADO: ${user.name} (${user.role}) ` +
                `intentó leer ${filename} (nivel: ${file.accessLevel})`
            );
            throw new Error('Acceso denegado: permisos insuficientes');
        }

        console.log(
            `[SEGURO] Acceso PERMITIDO: ${user.name} (${user.role}) ` +
            `leyó ${filename}`
        );
        return file.content;
    }

    writeFile(
        user: SecureUser,
        filename: string,
        content: string,
        accessLevel: 'public' | 'private' | 'admin' = 'private'
    ): void {
        const requiredPermission = this.getWritePermission(accessLevel);

        if (!this.hasPermission(user, requiredPermission)) {
            console.log(
                `[SEGURO] Escritura DENEGADA: ${user.name} (${user.role}) ` +
                `intentó escribir ${filename} (nivel: ${accessLevel})`
            );
            throw new Error('Acceso denegado: permisos insuficientes');
        }

        this.files.set(filename, {
            content,
            accessLevel,
            owner: user.id
        });

        console.log(
            `[SEGURO] Escritura PERMITIDA: ${user.name} (${user.role}) ` +
            `escribió ${filename}`
        );
    }

    deleteFile(user: SecureUser, filename: string): void {
        if (!this.hasPermission(user, Permission.DELETE_FILES)) {
            console.log(
                `[SEGURO] Eliminación DENEGADA: ${user.name} (${user.role}) ` +
                `intentó eliminar ${filename}`
            );
            throw new Error('Acceso denegado: permisos insuficientes');
        }

        this.files.delete(filename);
        console.log(
            `[SEGURO] Eliminación PERMITIDA: ${user.name} (${user.role}) ` +
            `eliminó ${filename}`
        );
    }

    private getReadPermission(
        accessLevel: 'public' | 'private' | 'admin'
    ): Permission {
        switch (accessLevel) {
            case 'public':
                return Permission.READ_PUBLIC;
            case 'private':
                return Permission.READ_PRIVATE;
            case 'admin':
                return Permission.READ_ADMIN;
        }
    }

    private getWritePermission(
        accessLevel: 'public' | 'private' | 'admin'
    ): Permission {
        switch (accessLevel) {
            case 'public':
                return Permission.WRITE_PUBLIC;
            case 'private':
                return Permission.WRITE_PRIVATE;
            case 'admin':
                return Permission.WRITE_ADMIN;
        }
    }
}

// ============================================================================
// PRINCIPIO DE SEPARACIÓN DE PRIVILEGIOS
// ============================================================================

/**
 * SEGURO: Separación de privilegios para operaciones críticas
 * Requiere múltiples aprobaciones para acciones sensibles
 */
interface ApprovalRequest {
    requestId: string;
    requestedBy: string;
    action: string;
    approvals: string[];
    requiredApprovals: number;
}

class PrivilegedOperationManager {
    private pendingRequests: Map<string, ApprovalRequest> = new Map();

    // Operación que requiere múltiples aprobaciones
    requestCriticalOperation(
        user: SecureUser,
        action: string
    ): string {
        const requestId = `req-${Date.now()}`;

        this.pendingRequests.set(requestId, {
            requestId,
            requestedBy: user.id,
            action,
            approvals: [],
            requiredApprovals: 2 // Requiere 2 aprobaciones
        });

        console.log(
            `[SEGURO] ${user.name} solicitó: "${action}" ` +
            `(requiere 2 aprobaciones)`
        );

        return requestId;
    }

    approveOperation(
        requestId: string,
        approver: SecureUser
    ): { approved: boolean; message: string } {
        const request = this.pendingRequests.get(requestId);

        if (!request) {
            return { approved: false, message: 'Solicitud no encontrada' };
        }

        // Verificar que el aprobador no sea el solicitante
        if (request.requestedBy === approver.id) {
            return {
                approved: false,
                message: 'No puedes aprobar tu propia solicitud'
            };
        }

        // Verificar que tenga permisos de administrador
        if (!approver.permissions.has(Permission.MANAGE_USERS)) {
            return {
                approved: false,
                message: 'Permisos insuficientes para aprobar'
            };
        }

        // Agregar aprobación
        if (!request.approvals.includes(approver.id)) {
            request.approvals.push(approver.id);
        }

        // Verificar si se alcanzó el número requerido
        if (request.approvals.length >= request.requiredApprovals) {
            console.log(
                `[SEGURO] Operación APROBADA: "${request.action}" ` +
                `(${request.approvals.length} aprobaciones)`
            );
            this.pendingRequests.delete(requestId);
            return { approved: true, message: 'Operación ejecutada' };
        }

        console.log(
            `[SEGURO] Aprobación registrada ` +
            `(${request.approvals.length}/${request.requiredApprovals})`
        );

        return {
            approved: false,
            message: `Requiere ${request.requiredApprovals - request.approvals.length} aprobación(es) más`
        };
    }
}

// ============================================================================
// DEMOSTRACIÓN
// ============================================================================

function demonstrateLeastPrivilege(): void {
    console.log('\n=== PRINCIPIO DE MÍNIMO PRIVILEGIO ===\n');

    // 1. Sistema inseguro
    console.log('--- 1. SISTEMA INSEGURO (todos son admin) ---\n');

    const insecureFS = new InsecureFileSystem();
    const maliciousUser: InsecureUser = {
        id: 'user1',
        name: 'Usuario Malicioso',
        role: InsecureRole.ADMIN
    };

    insecureFS.readFile(maliciousUser, 'admin.txt');
    insecureFS.writeFile(maliciousUser, 'admin.txt', 'HACKEADO');
    insecureFS.deleteFile(maliciousUser, 'public.txt');

    // 2. Sistema seguro con RBAC
    console.log('\n--- 2. SISTEMA SEGURO (RBAC) ---\n');

    const secureFS = new SecureFileSystem();

    // Crear usuarios con diferentes roles
    const admin = RoleBasedAccessControl.createUser('u1', 'Admin', SecureRole.ADMIN);
    const editor = RoleBasedAccessControl.createUser('u2', 'Editor', SecureRole.EDITOR);
    const viewer = RoleBasedAccessControl.createUser('u3', 'Viewer', SecureRole.VIEWER);
    const guest = RoleBasedAccessControl.createUser('u4', 'Guest', SecureRole.GUEST);

    console.log('Intento 1: Guest intenta leer archivo privado');
    try {
        secureFS.readFile(guest, 'private.txt');
    } catch (error) {
        console.log(`Error: ${(error as Error).message}\n`);
    }

    console.log('Intento 2: Guest lee archivo público');
    try {
        secureFS.readFile(guest, 'public.txt');
    } catch (error) {
        console.log(`Error: ${(error as Error).message}`);
    }

    console.log('\nIntento 3: Viewer intenta escribir archivo');
    try {
        secureFS.writeFile(viewer, 'test.txt', 'contenido');
    } catch (error) {
        console.log(`Error: ${(error as Error).message}\n`);
    }

    console.log('Intento 4: Editor escribe archivo');
    try {
        secureFS.writeFile(editor, 'test.txt', 'contenido', 'private');
    } catch (error) {
        console.log(`Error: ${(error as Error).message}`);
    }

    console.log('\nIntento 5: Editor intenta eliminar archivo');
    try {
        secureFS.deleteFile(editor, 'test.txt');
    } catch (error) {
        console.log(`Error: ${(error as Error).message}\n`);
    }

    console.log('Intento 6: Admin elimina archivo');
    try {
        secureFS.deleteFile(admin, 'test.txt');
    } catch (error) {
        console.log(`Error: ${(error as Error).message}`);
    }

    // 3. Separación de privilegios
    console.log('\n--- 3. SEPARACIÓN DE PRIVILEGIOS ---\n');

    const privOpsMgr = new PrivilegedOperationManager();
    const admin1 = RoleBasedAccessControl.createUser('a1', 'Admin1', SecureRole.ADMIN);
    const admin2 = RoleBasedAccessControl.createUser('a2', 'Admin2', SecureRole.ADMIN);
    const admin3 = RoleBasedAccessControl.createUser('a3', 'Admin3', SecureRole.ADMIN);
    const regularUser = RoleBasedAccessControl.createUser('u5', 'User5', SecureRole.EDITOR);

    const reqId = privOpsMgr.requestCriticalOperation(
        admin1,
        'Eliminar base de datos de producción'
    );

    console.log('\nIntento 1: El solicitante intenta auto-aprobar');
    console.log(privOpsMgr.approveOperation(reqId, admin1));

    console.log('\nIntento 2: Usuario sin permisos intenta aprobar');
    console.log(privOpsMgr.approveOperation(reqId, regularUser));

    console.log('\nAprobación 1: Admin2 aprueba');
    console.log(privOpsMgr.approveOperation(reqId, admin2));

    console.log('\nAprobación 2: Admin3 aprueba (operación ejecutada)');
    console.log(privOpsMgr.approveOperation(reqId, admin3));
}

// Ejecutar demostración
if (require.main === module) {
    demonstrateLeastPrivilege();
}

export {
    SecureRole,
    Permission,
    SecureUser,
    RoleBasedAccessControl,
    SecureFileSystem,
    PrivilegedOperationManager
};
