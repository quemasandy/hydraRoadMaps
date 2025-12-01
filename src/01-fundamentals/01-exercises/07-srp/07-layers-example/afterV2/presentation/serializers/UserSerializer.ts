/**
 * Archivo: UserSerializer.ts
 * UBICACIÓN: Capa de Presentación / Serializers
 *
 * ¿QUÉ HACE UN SERIALIZER?
 * - Transforma objetos de dominio en respuestas para el cliente.
 * - Oculta datos sensibles (como passwordHash).
 * - Formatea fechas, monedas, etc.
 */

import { User } from '../../domain/entities/User';

export class UserSerializer {
  static serialize(user: User): any {
    return {
      id: user.id,
      email: user.email,
      status: user.isActive ? 'Active' : 'Inactive',
      // NO devolvemos passwordHash
    };
  }
}
