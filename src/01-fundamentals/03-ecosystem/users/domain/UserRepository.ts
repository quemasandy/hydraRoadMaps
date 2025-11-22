
// Importamos la Entidad User porque el repositorio trabaja con Entidades, no con datos crudos.
import { User } from "./User";

// Definimos la Interfaz del Repositorio (Port).
// Esto es un contrato: "Quien quiera ser un repositorio de usuarios debe cumplir esto".
export interface UserRepository {
  // Método para verificar si existe un email. Devuelve una Promesa booleana.
  exists(email: string): Promise<boolean>;
  // Método para guardar un usuario. Recibe la Entidad completa.
  save(user: User): Promise<void>;
}
