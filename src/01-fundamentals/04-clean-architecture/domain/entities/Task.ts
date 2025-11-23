
/**
 * CAPA: DOMAIN (Amarillo)
 * TIPO: Entity (Entidad)
 * 
 * Las Entidades encapsulan las Reglas de Negocio Empresariales.
 * Son los objetos más importantes y estables del sistema.
 * 
 * REGLA DE ORO:
 * Esta clase NO debe saber nada de bases de datos, frameworks, HTTP, ni siquiera de los Casos de Uso.
 * Es TypeScript puro. Si cambias la base de datos de Mongo a SQL, este archivo NO se toca.
 */
export class Task {
    /**
     * @param id Identificador único de la tarea (UUID, string, etc.)
     * @param title Título o descripción de la tarea
     * @param completed Estado de la tarea (por defecto false)
     */
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly completed: boolean = false
    ) {
        // VALIDACIÓN DE REGLA DE NEGOCIO:
        // Una tarea no puede existir si no cumple con las normas de la empresa.
        // En este caso, la norma es que el título debe tener al menos 3 caracteres.
        // Esto protege la integridad de los datos desde el núcleo.
        if (title.length < 3) {
            throw new Error("Business Rule Violation: Task title must be at least 3 characters long.");
        }
    }
}
