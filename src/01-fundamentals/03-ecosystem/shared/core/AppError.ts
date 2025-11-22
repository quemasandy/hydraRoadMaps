
// Importamos la clase Result para basar nuestros errores en ella.
import { Result } from "./Result";

// Usamos un namespace para agrupar tipos de errores de aplicación.
export namespace AppError {
  // Clase específica para errores inesperados (bugs, caídas de servicios, etc).
  export class UnexpectedError extends Result<any> {
    // Constructor que recibe el error original.
    public constructor(err: any) {
      // Llamamos al constructor padre (Result) indicando fallo (false).
      super(false, {
        // Mensaje genérico para el cliente.
        message: `An unexpected error occurred.`,
        // Guardamos el error original para debugging.
        error: err
      } as any);
      // Logueamos en el servidor que pasó algo grave.
      console.log(`[AppError]: An unexpected error occurred`);
      // Imprimimos el stack trace o detalles del error.
      console.error(err);
    }

    // Factory method para crear este error fácilmente.
    public static create(err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }
}
