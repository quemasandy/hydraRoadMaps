/**
 * Archivo: SqlUserRepository.ts
 * UBICACIÓN: Capa de Infraestructura / Repositorios
 *
 * Implementación concreta usando SQL.
 * Esta clase SÍ sabe de SQL, tablas y conexiones.
 */

import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User';

export class SqlUserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    console.log(`[Infra - SQL] INSERT INTO users (id, email, password) VALUES ('${user.id}', '${user.email}', '***')`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log(`[Infra - SQL] SELECT * FROM users WHERE email = '${email}'`);
    // Simulamos que no existe para permitir registro
    return null; 
  }

  async findById(id: string): Promise<User | null> {
    console.log(`[Infra - SQL] SELECT * FROM users WHERE id = '${id}'`);
    return new User(id, "found@sql.com", "hash");
  }
}
