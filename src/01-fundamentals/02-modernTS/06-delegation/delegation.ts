/**
 * MODERN TS: Delegation
 *
 * En OOP: Un objeto llama a un método de otro objeto.
 * En Modern TS: Higher-Order Functions (Funciones de orden superior).
 *
 * Pasamos el comportamiento deseado como argumento.
 */

type Logger = (msg: string) => void;

// Delegamos el "cómo loguear" al caller
const processPayment = (amount: number, logStrategy: Logger) => {
  logStrategy(`Processing payment of $${amount}`);
  // logic...
};

// Estrategias (Delegados)
const consoleLogger: Logger = (msg) => console.log(`[CMD] ${msg}`);
const fileLogger: Logger = (msg) => console.log(`[FILE] Writing: ${msg}`);
const silentLogger: Logger = () => {};

processPayment(100, consoleLogger);
processPayment(200, fileLogger);
