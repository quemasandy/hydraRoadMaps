/**
 * Archivo: Email.ts
 * UBICACIÓN: Capa de Dominio / Value Objects
 *
 * ¿QUÉ ES UN VALUE OBJECT?
 * - Se define por su valor, no por su identidad.
 * - Es inmutable.
 * - Se valida a sí mismo al nacer.
 */
export class Email {
  private readonly value: string;

  constructor(value: string) {
    if (!value) {
      throw new Error("El email no puede estar vacío.");
    }
    if (!value.includes('@')) {
      throw new Error("El email debe contener un '@'.");
    }
    // Más validaciones aquí (regex, etc.)
    this.value = value.trim().toLowerCase();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
