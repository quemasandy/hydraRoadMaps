import { Task } from "../entities/Task";

/**
 * CAPA: DOMAIN (Amarillo)
 * TIPO: Repository Interface (Puerto)
 * 
 * Este es un contrato. Define QUÉ necesitamos hacer con los datos,
 * pero NO define CÓMO se hace.
 * 
 * PRINCIPIO DE INVERSIÓN DE DEPENDENCIAS (DIP):
 * Las capas superiores (Domain/Use Cases) definen las interfaces.
 * Las capas inferiores (Infrastructure) implementan estas interfaces.
 * 
 * Así, el Dominio no depende de la Base de Datos. La Base de Datos depende del Dominio.
 */
export interface TaskRepository {
    /**
     * Guarda una tarea.
     * No sabemos si es en un Array, en SQL, en un archivo de texto o en la nube.
     * Al dominio no le importa.
     */
    save(task: Task): Promise<void>;
}
