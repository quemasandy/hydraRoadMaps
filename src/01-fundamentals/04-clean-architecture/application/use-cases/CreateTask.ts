import { Task } from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/repositories/TaskRepository";

/**
 * CAPA: APPLICATION (Naranja)
 * TIPO: Use Case (Caso de Uso)
 * 
 * Los Casos de Uso contienen las Reglas de Negocio de la Aplicación.
 * Orquestan el flujo de datos hacia y desde las entidades.
 * 
 * Este caso de uso específico se encarga de "Crear una Tarea".
 * Fíjate que NO sabe si los datos vienen de una web, una app móvil o la consola.
 * Solo sabe QUÉ hacer, no CÓMO se muestra ni CÓMO se guarda.
 */
export class CreateTask {
    /**
     * INYECCIÓN DE DEPENDENCIAS:
     * El Caso de Uso pide un repositorio.
     * NO pide "SQLRepository" ni "MongoRepository", pide la INTERFAZ "TaskRepository".
     * Esto permite cambiar la base de datos sin tocar este archivo.
     */
    constructor(private readonly repository: TaskRepository) {}

    /**
     * Ejecuta la acción de crear la tarea.
     * 
     * @param id El ID de la tarea
     * @param title El título de la tarea
     * @returns La tarea creada (promesa)
     */
    async execute(id: string, title: string): Promise<Task> {
        // 1. Crear la Entidad
        // Aquí se aplican las Reglas de Negocio Empresariales (ej: validación de título).
        // Si el título es corto, la clase Task lanzará un error aquí mismo.
        const task = new Task(id, title);

        // 2. Persistir la Entidad
        // Usamos el repositorio inyectado para guardar.
        // No sabemos dónde se guarda, y no nos importa.
        await this.repository.save(task);

        // 3. Retornar el resultado
        return task;
    }
}
