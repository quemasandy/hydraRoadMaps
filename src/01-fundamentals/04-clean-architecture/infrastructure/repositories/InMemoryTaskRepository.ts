import { Task } from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/repositories/TaskRepository";

/**
 * CAPA: INFRASTRUCTURE / INTERFACE ADAPTERS (Verde)
 * TIPO: Repository Implementation (Adaptador)
 * 
 * Esta clase implementa el contrato definido en el Dominio (TaskRepository).
 * Es un "Adaptador" porque adapta la interfaz que necesita el caso de uso
 * a una implementación concreta (en este caso, memoria RAM).
 * 
 * Esta implementación es perfecta para tests o prototipos rápidos.
 */
export class InMemoryTaskRepository implements TaskRepository {
    // Simulamos una base de datos con un array privado
    private readonly database: Task[] = [];

    /**
     * Implementación concreta del método save.
     * Guarda la tarea en el array en memoria.
     */
    async save(task: Task): Promise<void> {
        this.database.push(task);
        console.log(`[InMemoryDB] Tarea guardada: ${task.title} (Total: ${this.database.length})`);
    }
}
