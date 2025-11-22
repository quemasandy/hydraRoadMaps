/**
 * MODERN TS: Abstraction
 *
 * En OOP: Usamos clases abstractas o interfaces para ocultar detalles.
 * En Modern TS: Usamos `type` para definir la "forma" de los datos (Data Shape).
 *
 * Separamos totalmente los DATOS del COMPORTAMIENTO.
 */

// 1. Definimos la forma de los datos (Data)
export type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: 'admin' | 'user';
};

// 2. Definimos funciones que operan sobre esos datos (Behavior)
// Nota: Las funciones son puras, reciben datos y retornan datos.
export const createUser = (name: string, role: User['role']): User => ({
  id: crypto.randomUUID(),
  name,
  email: `${name.toLowerCase()}@example.com`,
  role,
});

export const isAdmin = (user: User): boolean => user.role === 'admin';

// Uso
const user = createUser('Andy', 'admin');
console.log(isAdmin(user)); // true
