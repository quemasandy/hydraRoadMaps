
// Importamos la interfaz UseCase base.
import { UseCase } from "../../shared/core/UseCase";
// Importamos el DTO de entrada.
import { CreateUserDTO } from "./CreateUserDTO";
// Importamos Result y AppError para manejo de flujo y errores.
import { Result } from "../../shared/core/Result";
import { AppError } from "../../shared/core/AppError";
// Importamos las interfaces (contratos) que necesitamos, NO las implementaciones concretas.
import { UserRepository } from "../domain/UserRepository";
import { EmailService } from "../domain/EmailService";
// Importamos la Entidad User.
import { User } from "../domain/User";

// Definimos el tipo de respuesta: Un Result que puede ser void (éxito) o any (error).
type Response = Result<void | any>;

// Implementamos el Caso de Uso. Es una clase que contiene la lógica de aplicación específica.
export class CreateUserUseCase implements UseCase<CreateUserDTO, Promise<Response>> {
  // Dependencias: Repositorio y Servicio de Email.
  private userRepo: UserRepository;
  private emailService: EmailService;

  // Inyección de Dependencias: Recibimos las implementaciones en el constructor.
  // Esto permite testear fácilmente pasando mocks.
  constructor(userRepo: UserRepository, emailService: EmailService) {
    this.userRepo = userRepo;
    this.emailService = emailService;
  }

  // Método principal que ejecuta la lógica.
  public async execute(request: CreateUserDTO): Promise<Response> {
    // Extraemos datos del DTO.
    const { email, password } = request;

    try {
      // 1. Verificamos si el usuario ya existe usando el repositorio.
      const userAlreadyExists = await this.userRepo.exists(email);

      // Si existe, retornamos un fallo controlado (no una excepción).
      if (userAlreadyExists) {
        return Result.fail("User already exists");
      }

      // 2. Simulamos el hasheo de contraseña (en realidad usaríamos bcrypt).
      const passwordHash = password.split('').reverse().join(''); 

      // 3. Creamos la Entidad User. Aquí se ejecutan las validaciones de dominio (ej. email válido).
      const userOrError = User.create({
        email,
        passwordHash,
      });

      // Si la creación de la entidad falló (ej. email inválido), retornamos el error.
      if (userOrError.isFailure) {
        return Result.fail(userOrError.errorValue());
      }

      // Obtenemos la instancia de User válida.
      const user = userOrError.getValue();

      // 4. Guardamos el usuario en la base de datos usando el repositorio.
      await this.userRepo.save(user);
      
      // 5. Enviamos el email de bienvenida (efecto secundario).
      await this.emailService.sendWelcomeEmail(user.email);

      // Retornamos éxito.
      return Result.ok();

    } catch (err) {
      // Si ocurre algo inesperado (ej. base de datos caída), retornamos un Error de Aplicación.
      return AppError.UnexpectedError.create(err);
    }
  }
}
