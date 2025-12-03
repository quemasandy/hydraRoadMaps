/**
 * Archivo: main.ts
 * UBICACIÓN: Raíz de la Aplicación (Composition Root)
 *
 * Aquí es donde "conectamos los cables".
 * Creamos las instancias de cada capa y las pasamos a quien las necesite.
 * Esto se suele hacer automáticamente con frameworks de Inyección de Dependencias (como en NestJS o Angular),
 * pero aquí lo hacemos manual para que veas cómo encajan las piezas.
 */

import { UserRepository } from './repository';
import { UserService } from './service';
import { UserController } from './controller';

// 1. Crear la capa de DATOS (no depende de nadie)
// Agrupar código que tiene la misma responsabilidad
const userRepository = new UserRepository();

// 2. Crear la capa de NEGOCIO (necesita datos)
// Agrupar código que tiene la misma responsabilidad
const userService = new UserService(userRepository);

// 3. Crear la capa de PRESENTACIÓN (necesita negocio)
// Agrupar código que tiene la misma responsabilidad
const userController = new UserController(userService);

// --- SIMULACIÓN DE USO ---

console.log("\n=== PRUEBA 1: Registro Exitoso ===");
const requestGood = { 
  body: { email: "andy@gmail.com", password: "securePassword123" } 
};
const responseGood = userController.handleRegister(requestGood);
console.log("Respuesta HTTP:", responseGood);


console.log("\n=== PRUEBA 2: Registro Fallido (Regla de Negocio) ===");
const requestBad = { 
  body: { email: "hacker@evil.com", password: "securePassword123" } 
};
const responseBad = userController.handleRegister(requestBad);
console.log("Respuesta HTTP:", responseBad);
