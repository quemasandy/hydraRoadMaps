/**
 * MODERN TS: Dependency Inversion Principle (DIP)
 *
 * En OOP: Depender de abstracciones (interfaces), no de concreciones. Inyección de dependencias.
 * En Modern TS: Pasar funciones como argumentos (Higher-Order Functions).
 *
 * El módulo de alto nivel define qué necesita (la firma de la función), el de bajo nivel la implementa.
 */

// Definición de la dependencia (Abstracción)
type SaveUserFn = (user: string) => Promise<void>;

// Alto Nivel (Lógica de negocio)
// No importa si es SQL, Mongo o un archivo. Solo le importa `SaveUserFn`.
const registerUser = async (username: string, save: SaveUserFn) => {
  if (username.length < 3) throw new Error('Too short');
  await save(username);
  console.log('User registered');
};

// Bajo Nivel (Implementación concreta)
const saveToPostgres: SaveUserFn = async (u) => console.log(`INSERT INTO users... ${u}`);
const saveToMock: SaveUserFn = async (u) => console.log(`[MOCK] Saved ${u}`);

// Inyección manual
registerUser('Andy', saveToPostgres);
registerUser('Test', saveToMock);
