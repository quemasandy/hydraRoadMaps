import * as fs from 'fs';
import * as path from 'path';
import { Task } from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/repositories/TaskRepository";

/**
 * CAPA: INFRASTRUCTURE / INTERFACE ADAPTERS (Verde)
 * TIPO: Repository Implementation (Adaptador)
 * 
 * Esta es OTRA implementación del mismo contrato (TaskRepository).
 * 
 * EL PODER DE CLEAN ARCHITECTURE:
 * Podemos cambiar de InMemoryTaskRepository a FileTaskRepository
 * en el `main.ts` y el resto de la aplicación (Casos de Uso, Entidades)
 * NO SE ENTERA. No hay que cambiar ni una línea de código en la lógica de negocio.
 */
export class FileTaskRepository implements TaskRepository {
    private readonly filePath = path.join(__dirname, 'db.txt');

    /**
     * Implementación concreta que guarda en un archivo de texto.
     */
    async save(task: Task): Promise<void> {
        // Leemos el archivo actual (si existe) o iniciamos array vacío
        let tasks: Task[] = [];
        if (fs.existsSync(this.filePath)) {
            const fileContent = fs.readFileSync(this.filePath, 'utf-8');
            // Manejo simple de errores de parseo
            try {
                tasks = JSON.parse(fileContent);
            } catch (e) {
                tasks = [];
            }
        }

        // Agregamos la nueva tarea
        tasks.push(task);

        // Escribimos de nuevo al archivo
        fs.writeFileSync(this.filePath, JSON.stringify(tasks, null, 2));
        
        console.log(`[FileDB] Tarea guardada en archivo: ${this.filePath}`);
    }
}
