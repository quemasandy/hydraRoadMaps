
// Importamos la Entidad de Dominio.
import { User } from "../domain/User";

// Clase Mapper: Se encarga de traducir entre formatos.
// Evita que la Entidad de Dominio se "ensucie" con detalles de la base de datos o la API.
export class UserMapper {
  // Convierte la Entidad a un objeto plano (DTO) para devolverlo al cliente.
  public static toDTO(user: User): any {
    return {
      id: user.id,
      email: user.email,
      isEmailVerified: user.isEmailVerified
    };
  }

  // Convierte la Entidad a el formato exacto que espera la Base de Datos (Persistencia).
  // Nota cómo aquí usamos 'password_hash' (snake_case) típico de SQL, mientras en dominio es camelCase.
  public static toPersistence(user: User): any {
    return {
      id: user.id,
      email: user.email,
      password_hash: user.passwordHash,
      is_email_verified: user.isEmailVerified
    };
  }
}
