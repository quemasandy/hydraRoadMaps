/**
 * Archivo: IUserRepository.ts
 * UBICACIÓN: Capa de Dominio / Interfaces (Puertos)
 *
 * ¿QUÉ ES UN PUERTO (PORT)?
 * - Es un contrato que define QUÉ necesita el dominio para funcionar.
 * - NO dice CÓMO se hace (eso es problema de la infraestructura).
 * - Permite desacoplar el dominio de la base de datos.
 */

import { User } from '../entities/User';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
