/**
 * CLASE ERROR BASE DE DOMINIO
 * 
 * ¿Por qué creamos una clase base?
 * Para poder distinguir errores que vienen de nuestras reglas de negocio (Dominio)
 * de errores inesperados (como que se caiga la base de datos o un error de sintaxis).
 * 
 * Si capturamos un "DomainError", sabemos que el usuario intento hacer algo no permitido.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message); // Llama al constructor de la clase Error de JS
    this.name = "DomainError"; // Asigna un nombre para identificarlo en logs
  }
}

/**
 * ERROR ESPECÍFICO: FONDOS INSUFICIENTES
 * 
 * Representa la violación de la regla de negocio: "No puedes gastar más de lo que tienes".
 * Al ser una clase propia, nuestro código puede hacer:
 * if (error instanceof InsufficientFundsError) ...
 */
export class InsufficientFundsError extends DomainError {
  constructor() {
    // El mensaje esta hardcodeado porque es una regla fija del negocio
    super("Fondos insuficientes para realizar la operación");
  }
}

/**
 * ERROR ESPECÍFICO: MONTO INVÁLIDO
 * 
 * Representa la violación de validaciones básicas de entrada de dominio.
 * Ejemplo: transferir -100 pesos o 0 pesos.
 */
export class InvalidAmountError extends DomainError {
  constructor() {
    super("El monto debe ser mayor a cero");
  }
}
