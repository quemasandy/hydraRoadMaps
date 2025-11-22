
// Exportamos la clase Result, que usa un Genérico <T> para saber qué tipo de valor devuelve si es exitoso.
export class Result<T> {
  // Propiedad pública para saber rápidamente si la operación fue exitosa.
  public isSuccess: boolean;
  // Propiedad pública para saber si falló (es la negación de isSuccess).
  public isFailure: boolean;
  // Puede contener el error (si falló) o un string de error.
  public error: T | string;
  // Guardamos el valor real de forma privada para controlar cómo se accede a él.
  private _value: T;

  // El constructor es privado para obligar a usar los métodos estáticos 'ok' y 'fail'.
  private constructor(isSuccess: boolean, error?: T | string, value?: T) {
    // Validación defensiva: No puede ser exitoso y tener error a la vez.
    if (isSuccess && error) {
      // Lanzamos excepción si el programador usa mal la clase (error de desarrollo).
      throw new Error("InvalidOperation: A result cannot be successful and contain an error");
    }
    // Validación defensiva: Si falló, DEBE tener un error.
    if (!isSuccess && !error) {
      // Lanzamos excepción para asegurar consistencia.
      throw new Error("InvalidOperation: A failing result needs to contain an error message");
    }

    // Asignamos las propiedades basándonos en los argumentos.
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error as T | string;
    this._value = value as T;

    // Congelamos el objeto para que sea inmutable (nadie pueda cambiarlo después de crearlo).
    Object.freeze(this);
  }

  // Método para obtener el valor de forma segura.
  public getValue(): T {
    // Si intentamos obtener el valor de un resultado fallido, lanzamos error.
    if (!this.isSuccess) {
      console.log(this.error);
      throw new Error("Can't get the value of an error result. Use 'errorValue' instead.");
    }
    // Si todo está bien, devolvemos el valor guardado.
    return this._value;
  }

  // Método para obtener el error de forma tipada.
  public errorValue(): T {
    return this.error as T;
  }

  // Método estático (Factory) para crear un resultado Exitoso.
  public static ok<U>(value?: U): Result<U> {
    // Retorna una nueva instancia con isSuccess=true y el valor.
    return new Result<U>(true, undefined, value);
  }

  // Método estático (Factory) para crear un resultado Fallido.
  public static fail<U>(error: any): Result<U> {
    // Retorna una nueva instancia con isSuccess=false y el error.
    return new Result<U>(false, error);
  }

  // Método útil para combinar múltiples resultados y ver si alguno falló.
  public static combine(results: Result<any>[]): Result<any> {
    // Iteramos sobre la lista de resultados.
    for (let result of results) {
      // Si encontramos uno que falló, retornamos ese error inmediatamente.
      if (result.isFailure) return result;
    }
    // Si ninguno falló, retornamos OK.
    return Result.ok();
  }
}
