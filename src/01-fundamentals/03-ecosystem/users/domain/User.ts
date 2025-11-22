
// Importamos Result para manejar la creación exitosa o fallida de la entidad.
import { Result } from "../../shared/core/Result";

// Definimos la interfaz de las propiedades que necesita un Usuario.
interface UserProps {
  email: string;
  passwordHash: string;
  isEmailVerified?: boolean; // Opcional porque al crear puede no estar verificado.
}

// Clase Entidad de Dominio 'User'. Representa al usuario en el negocio, no en la DB.
export class User {
  // Guardamos las propiedades en un objeto privado para encapsulamiento.
  private props: UserProps;
  // El ID es manejado por la entidad, no por la base de datos.
  private _id: string;

  // Constructor privado: Solo se puede crear usando el método estático 'create'.
  private constructor(props: UserProps, id?: string) {
    this.props = props;
    // Si no hay ID (es nuevo), generamos uno aleatorio. Si viene de la DB, usamos el existente.
    this._id = id ? id : crypto.randomUUID();
    // Inicializamos isEmailVerified en false si no viene definido.
    this.props.isEmailVerified = props.isEmailVerified ? props.isEmailVerified : false;
  }

  // Getter para leer el ID desde fuera.
  get id(): string {
    return this._id;
  }

  // Getter para leer el email.
  get email(): string {
    return this.props.email;
  }

  // Getter para leer el hash del password (nunca el password plano).
  get passwordHash(): string {
    return this.props.passwordHash;
  }

  // Getter para saber si está verificado.
  get isEmailVerified(): boolean {
    // El signo ! asegura a TypeScript que esto no es undefined aquí.
    return this.props.isEmailVerified!;
  }

  // Método estático Factory para crear la entidad. Aquí van las VALIDACIONES DE DOMINIO.
  public static create(props: UserProps, id?: string): Result<User> {
    // Regla de Negocio: El email debe tener un formato válido (simplificado aquí).
    if (!props.email.includes('@')) {
        // Si falla, retornamos un Result fallido con el mensaje.
        return Result.fail<User>("Invalid email address");
    }
    
    // Si todo es válido, retornamos un Result exitoso con la nueva instancia de User.
    return Result.ok<User>(new User(props, id));
  }
}
