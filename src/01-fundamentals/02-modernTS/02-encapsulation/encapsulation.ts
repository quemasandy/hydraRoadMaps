/**
 * MODERN TS: Encapsulation
 *
 * En OOP: Usamos `private`, `protected` dentro de clases.
 * En Modern TS: Usamos "Closures" y el sistema de módulos (export/import).
 *
 * Lo que no se exporta, es privado por defecto.
 */

// "Private" variables (scope del módulo)
const API_KEY = 'secret_key_123';

// "Private" helper function
const logAccess = (resource: string) => {
  console.log(`Accessing ${resource} with ${API_KEY}`);
};

// Public Interface (lo que exportamos)
export const createApiClient = (endpoint: string) => {
  // Closure: 'endpoint' es accesible aquí pero no desde fuera
  return {
    get: () => {
      logAccess(endpoint);
      return `Data from ${endpoint}`;
    },
  };
};

// Uso
const client = createApiClient('/users');
console.log(client.get());
// console.log(API_KEY); // Error: no accesible
