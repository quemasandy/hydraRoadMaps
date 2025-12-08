/**
 * Archivo: MongoUserMapper.ts
 * UBICACIÓN: Capa de Infraestructura / Mappers
 *
 * Mapeo específico para MongoDB.
 * Maneja la idiosincrasia de Mongo (como el _id).
 */

import { User } from '../../domain/entities/User';
import { UserDocument } from '../dtos/UserDocument';

export class MongoUserMapper {
  
  /**
   * BSON Document -> Domain Entity
   */
  static toDomain(doc: UserDocument): User {
    return new User(
      doc._id,           // Mapeamos _id -> id
      doc.email,
      doc.password_hash,
      doc.is_active
    );
  }

  /**
   * Domain Entity -> BSON Document
   */
  static toPersistence(user: User): UserDocument {
    return {
      _id: user.id,      // Mapeamos id -> _id
      email: user.email,
      password_hash: user.passwordHash,
      is_active: user.isActive,
      created_at: new Date() // Ojo: En un sistema real, mantendrías la fecha de creación original if exists
    };
  }
}
