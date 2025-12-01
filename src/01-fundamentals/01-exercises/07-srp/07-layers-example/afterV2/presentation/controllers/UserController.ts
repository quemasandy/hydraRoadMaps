/**
 * Archivo: UserController.ts
 * UBICACIÓN: Capa de Presentación / Controladores
 *
 * ¿QUÉ HACE UN CONTROLADOR?
 * - Recibe la petición (Request).
 * - Valida el formato de entrada (DTOs).
 * - Llama al Servicio de Dominio adecuado.
 * - Formatea la respuesta (Serializer).
 * - Retorna la respuesta (Response).
 */

import { UserService } from '../../domain/services/UserService';
import { RegisterUserDto } from '../dtos/RegisterUserDto';
import { UserSerializer } from '../serializers/UserSerializer';
import { ConsoleView } from '../views/ConsoleView';

export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly view: ConsoleView
  ) {}

  async register(request: RegisterUserDto): Promise<void> {
    console.log("\n--- [Controller] Recibiendo solicitud de registro ---");

    try {
      // 1. Validación básica de entrada (Input Validation)
      if (!request.email || !request.email.includes('@')) {
        throw new Error("Bad Request: Email inválido");
      }
      if (!request.password || request.password.length < 6) {
        throw new Error("Bad Request: Password muy corto");
      }

      // 2. Delegación al Servicio de Dominio
      const user = await this.userService.registerUser(request.email, request.password);

      // 3. Serialización y Respuesta
      const response = UserSerializer.serialize(user);
      this.view.renderSuccess(response);

    } catch (error: any) {
      // 4. Manejo de Errores
      this.view.renderError(error.message);
    }
  }
}
