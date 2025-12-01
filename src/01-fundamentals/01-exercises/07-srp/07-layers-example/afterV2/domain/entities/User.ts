/**
 * Archivo: User.ts
 * UBICACIÓN: Capa de Dominio / Entidades
 *
 * ¿QUÉ ES UNA ENTIDAD?
 * - Es un objeto de negocio con identidad única (ID).
 * - Contiene datos y comportamiento puro del negocio.
 * - NO depende de base de datos, frameworks ni UI.
 */

export class User {
  // Propiedades privadas para encapsulamiento
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly isActive: boolean = true
  ) {}

  /**
   * REGLA DE NEGOCIO:
   * Un usuario puede desactivarse, pero solo si está activo.
   */
  deactivate(): User {
    if (!this.isActive) {
      throw new Error("El usuario ya está inactivo.");
    }
    // Retornamos una nueva instancia para inmutabilidad (opcional pero recomendado)
    return new User(this.id, this.email, this.passwordHash, false);
  }

  /**
   * REGLA DE NEGOCIO:
   * Validación de dominio simple.
   */
  hasValidEmail(): boolean {
    return this.email.includes('@');
  }
}
