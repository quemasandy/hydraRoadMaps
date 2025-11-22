
// Importamos las mismas interfaces.
import { UserRepository } from "../../domain/UserRepository";
import { User } from "../../domain/User";
import { UserMapper } from "../../application/UserMapper";

// Implementación concreta para MongoDB.
// Fíjate que implementa la MISMA interfaz que SqlUserRepository.
export class MongoUserRepository implements UserRepository {
  // Simulamos una colección de Mongo.
  private collection: any[] = [];

  // Implementación específica para Mongo.
  async exists(email: string): Promise<boolean> {
    console.log("[MongoUserRepository]: Checking if user exists via db.users.findOne({ email: ... })");
    // Simulamos la búsqueda en documento.
    const user = this.collection.find(u => u.email === email);
    return !!user;
  }

  // Implementación específica para guardar en Mongo.
  async save(user: User): Promise<void> {
    console.log("[MongoUserRepository]: Saving user via db.users.insertOne(...)");
    // Convertimos a persistencia (el Mapper podría tener lógica específica si fuera necesario).
    const rawUser = UserMapper.toPersistence(user);
    // Simulamos el insertOne.
    this.collection.push(rawUser);
    console.log("[MongoUserRepository]: User saved successfully.");
  }
}
