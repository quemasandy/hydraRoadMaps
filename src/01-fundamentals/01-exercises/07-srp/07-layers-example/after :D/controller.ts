/**
 * Archivo: 3-controller.ts
 * UBICACIÓN: Capa de Presentación (Controller / API / UI)
 *
 * ¿QUÉ HACE ESTA CAPA?
 * - Es la "cara" al mundo exterior (HTTP, CLI, GUI).
 * - Recibe los datos "crudos" del usuario.
 * - Valida que los datos tengan el formato correcto (email válido, string no vacío).
 * - Llama al Servicio para que haga el trabajo real.
 * - Devuelve la respuesta adecuada al usuario (JSON, HTML, código 200/400).
 *
 * SU ÚNICA RESPONSABILIDAD: Hablar el idioma del usuario (HTTP) y traducir al idioma del negocio.
 */

import { UserService } from './service';
import { InvalidEmailError, InvalidPasswordError, HttpErrorResponse } from './errors';

// Tipos simulados de HTTP
type HttpRequest = { body: any };
type HttpResponse = { status: number, body: any };

export class UserController {
  
  constructor(private userService: UserService) {}

  handleRegister(req: HttpRequest): HttpResponse | HttpErrorResponse {
    console.log("--- [Capa de Presentación] Recibiendo solicitud HTTP ---");

    try {
      // 1. VALIDACIÓN DE ENTRADA (Input Validation)
      // Solo verificamos forma, no fondo.
      const { email, password } = req.body;
      
      if (!email || !email.includes('@')) {
        throw new InvalidEmailError();
        // return { status: 400, body: { error: "Bad Request: Email inválido" } };
      }
      if (!password || password.length < 6) {
        throw new InvalidPasswordError();
        // return { status: 400, body: { error: "Bad Request: Password inválido" } };
      }

      // 2. DELEGACIÓN AL NEGOCIO
      // El controlador no sabe registrar usuarios, solo sabe a quién pedirle que lo haga.
      const user = this.userService.registerUser(email, password);
      // if (user instanceof Error) {
      //   return { status: 403, body: { error: user.message } };
      // }

      // 3. RESPUESTA EXITOSA
      return {
        status: 201,
        body: {
          success: true,
          data: { id: user.id, email: user.email } // No devolvemos el hash por seguridad
        }
      };

    } catch (error: any) {
      console.log('...', error);
      // 4. MANEJO DE ERRORES DE NEGOCIO
      // Si el servicio se queja (ej. dominio prohibido), traducimos eso a HTTP.
      console.log(`[Capa de Presentación] Error capturado: ${error.message}`);
      // return {
      //   status: this.statusCode,
      //   body: {
      //     success: false,
      //     data: { error: this.message }
      //   }
      // };
      return error.toHttpError();
    }
  }
}
