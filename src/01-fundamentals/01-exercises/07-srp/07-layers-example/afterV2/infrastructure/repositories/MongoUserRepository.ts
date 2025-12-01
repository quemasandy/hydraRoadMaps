/**
 * Archivo: MongoUserRepository.ts
 * UBICACIÓN: Capa de Infraestructura / Repositorios
 *
 * Implementación concreta usando MongoDB.
 * Esta clase SÍ sabe de colecciones, documentos y BSON.
 */

import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User';

export class MongoUserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    console.log(`[Infra - Mongo] db.users.insertOne({ _id: '${user.id}', email: '${user.email}', ... })`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log(`[Infra - Mongo] db.users.findOne({ email: '${email}' })`);
    return null;
  }

  async findById(id: string): Promise<User | null> {
    console.log(`[Infra - Mongo] db.users.findOne({ _id: '${id}' })`);
    return new User(id, "found@mongo.com", "hash");
  }
}
