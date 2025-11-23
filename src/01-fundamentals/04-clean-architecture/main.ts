import { CreateTask } from "./application/use-cases/CreateTask";
import { InMemoryTaskRepository } from "./infrastructure/repositories/InMemoryTaskRepository";
import { FileTaskRepository } from "./infrastructure/repositories/FileTaskRepository";

/**
 * CAPA: MAIN / FRAMEWORKS & DRIVERS (Azul)
 * TIPO: Composition Root (Punto de Entrada)
 * 
 * Este es el punto "sucio" de la aplicación.
 * Aquí es donde decidimos qué implementaciones concretas usar.
 * Es el ÚNICO lugar que conoce todas las piezas y las ensambla.
 */
async function main() {
    console.log("--- INICIANDO APLICACIÓN CLEAN ARCHITECTURE ---");

    // 1. PREPARAR DEPENDENCIAS (Infrastructure)
    // Aquí decidimos qué base de datos usar.
    
    // OPCIÓN A: Memoria (Volátil)
    const inMemoryRepo = new InMemoryTaskRepository();
    
    // OPCIÓN B: Archivo de Texto (Persistente)
    // const fileRepo = new FileTaskRepository();

    // EL CAMBIO MÁGICO:
    // Para cambiar de base de datos, solo cambiamos la variable que pasamos al constructor.
    // ¡Intenta descomentar la OPCIÓN B y comentar la A!
    const repositoryToUse = inMemoryRepo; 
    // const repositoryToUse = new FileTaskRepository();

    // 2. PREPARAR CASOS DE USO (Application)
    // Inyectamos el repositorio en el caso de uso.
    const createTask = new CreateTask(repositoryToUse);

    // 3. EJECUTAR (Presentation / Controller)
    // Simulamos que un usuario envía datos desde una API o Consola.
    try {
        console.log("Ejecutando Caso de Uso: Crear Tarea...");
        
        const newTask = await createTask.execute("1", "Aprender Clean Architecture");
        
        console.log("¡Tarea creada con éxito!");
        console.log(newTask);

        // Intento de crear tarea inválida (para probar reglas de negocio)
        // await createTask.execute("2", "No"); // Esto debería fallar

    } catch (error) {
        console.error("Error:", error);
    }
}

main();
