/**
 * Archivo: RegisterUserDto.ts
 * UBICACIÓN: Capa de Presentación / DTOs
 *
 * ¿QUÉ ES UN DTO (Data Transfer Object)?
 * - Es un objeto simple para transportar datos entre procesos.
 * - Define QUÉ datos esperamos recibir del cliente (frontend/API).
 * - NO tiene lógica de negocio.
 */

export interface RegisterUserDto {
  email: string;
  password: string;
}
