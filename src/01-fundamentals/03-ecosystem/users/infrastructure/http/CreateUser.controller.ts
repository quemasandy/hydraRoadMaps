
// Importamos el Caso de Uso y el DTO.
import { CreateUserUseCase } from "../../application/CreateUser.usecase";
import { CreateUserDTO } from "../../application/CreateUserDTO";

// Simulamos los tipos Request y Response de Express para este ejemplo "Vanilla".
interface Request {
  body: any;
  user?: any; // Propiedad inyectada por el middleware de autenticación.
}

interface Response {
  status(code: number): Response;
  json(data: any): void;
  send(data: any): void;
}

// Controller: Recibe la petición HTTP, la "traduce" y llama al Caso de Uso.
export class CreateUserController {
  // Dependencia: El Caso de Uso.
  private useCase: CreateUserUseCase;

  // Inyección de Dependencias: Recibimos el caso de uso ya instanciado.
  constructor(useCase: CreateUserUseCase) {
    this.useCase = useCase;
  }

  // Método que maneja la petición (el handler de la ruta).
  public async execute(req: Request, res: Response): Promise<void> {
    // Extraemos y casteamos el body al DTO esperado.
    const dto: CreateUserDTO = req.body as CreateUserDTO;

    try {
      // Ejecutamos el caso de uso.
      const result = await this.useCase.execute(dto);

      // Verificamos si falló usando el patrón Result.
      if (result.isFailure) {
        // Si falló, devolvemos 400 Bad Request con el mensaje de error.
        res.status(400).json({ message: result.errorValue() });
      } else {
        // Si fue exitoso, devolvemos 201 Created.
        res.status(201).send(null);
      }
    } catch (err) {
      // Capturamos errores no controlados (bugs).
      // En una app real, esto lo manejaría un middleware de errores global.
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
