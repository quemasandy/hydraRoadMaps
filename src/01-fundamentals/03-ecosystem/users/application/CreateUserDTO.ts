
// DTO (Data Transfer Object): Objeto simple para transportar datos entre capas.
// Aquí definimos qué datos esperamos recibir desde fuera (Controller/API).
export interface CreateUserDTO {
  email: string;
  password: string;
}
