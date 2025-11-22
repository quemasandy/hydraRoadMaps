
// Importamos la interfaz del repositorio y la entidad.
import { UserRepository } from "../../domain/UserRepository";
import { User } from "../../domain/User";
import { UserMapper } from "../../application/UserMapper";

// Implementación concreta para SQL.
// Esta clase "sabe" cómo hablar con una base de datos SQL, pero cumple el contrato de UserRepository.
export class SqlUserRepository implements UserRepository {
  // Simulamos una conexión a DB (en realidad sería un Pool de Postgres/MySQL).
  private db: any[] = [];

  // Implementación del método exists.
  async exists(email: string): Promise<boolean> {
    console.log("[SqlUserRepository]: Checking if user exists via SELECT * FROM users WHERE email = ?");
    // Simulamos la query SQL.
    const user = this.db.find(u => u.email === email);
    // Devolvemos true si se encontró, false si no.
    return !!user;
  }

  // Implementación del método save.
  async save(user: User): Promise<void> {
    console.log("[SqlUserRepository]: Saving user via INSERT INTO users ...");
    // Usamos el Mapper para convertir la Entidad a formato de persistencia (snake_case, etc).
    const rawUser = UserMapper.toPersistence(user);
    // Simulamos el insert.
    this.db.push(rawUser);
    console.log("[SqlUserRepository]: User saved successfully.");
  }
}
