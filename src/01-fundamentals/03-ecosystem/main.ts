
// Importamos todas las piezas del sistema.
import { SqlUserRepository } from "./users/infrastructure/persistence/SqlUserRepository";
import { MongoUserRepository } from "./users/infrastructure/persistence/MongoUserRepository";
import { MailgunEmailProvider } from "./users/infrastructure/email/MailgunEmailProvider";
import { CreateUserUseCase } from "./users/application/CreateUser.usecase";
import { CreateUserController } from "./users/infrastructure/http/CreateUser.controller";
import { ensureAuthenticated } from "./users/infrastructure/http/Auth.middleware";

// --- Composition Root (Raíz de Composición) ---
// Este es el punto de entrada de la aplicación.
// Aquí es donde "Big Tech" maneja la complejidad: Conectando las dependencias manualmente
// (o usando un contenedor DI) para mantener la lógica central desacoplada de la infraestructura.

// 1. Elegimos la Estrategia de Base de Datos.
// ¡Cambia esta variable a false y todo el sistema usará Mongo sin tocar una sola línea de lógica de negocio!
const useSql = true; 
// Instanciamos el repositorio correcto según la configuración.
const userRepo = useSql ? new SqlUserRepository() : new MongoUserRepository();

// 2. Elegimos el Proveedor de Email.
// Podríamos cambiar esto por SendGridEmailProvider fácilmente.
const emailProvider = new MailgunEmailProvider();

// 3. Inyectamos las dependencias en el Caso de Uso (Service).
// El Caso de Uso NO sabe qué DB o Email Provider está usando, solo conoce las interfaces.
const createUserUseCase = new CreateUserUseCase(userRepo, emailProvider);

// 4. Inyectamos el Caso de Uso en el Controller.
// El Controller delega la lógica al Caso de Uso.
const createUserController = new CreateUserController(createUserUseCase);

// --- Simulación del Flujo de Petición (Request Flow) ---

console.log("--- Big Tech Ecosystem Simulation ---");

// Mock (Simulación) de los objetos Request y Response (como lo haría Express).
const req = {
  body: {
    email: "andy@example.com",
    password: "securePassword123"
  },
  headers: {
    authorization: "valid_token" // Token válido para pasar el middleware.
  }
};

// Mock de la respuesta para ver los logs en consola.
const res = {
  status: (code: number) => {
    console.log(`[HTTP Response]: Status ${code}`);
    return res; // Fluent interface (chaining).
  },
  json: (data: any) => {
    console.log(`[HTTP Response]: JSON Body:`, data);
  },
  send: (data: any) => {
    console.log(`[HTTP Response]: Body:`, data);
  }
};

// Ejecutamos el Flujo:
console.log("\n1. Request hits Middleware:");
// Llamamos al middleware manualmente.
ensureAuthenticated(req, res, () => {
  // Este callback es el 'next()'. Si se ejecuta, significa que pasó la auth.
  console.log("\n2. Middleware passes. Request hits Controller:");
  // Llamamos al controller.
  createUserController.execute(req as any, res as any);
});
