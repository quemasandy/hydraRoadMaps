
// Definimos una interfaz genérica para todos los Casos de Uso (Servicios de Aplicación).
// IRequest: El tipo de datos de entrada (DTO).
// IResponse: El tipo de datos de salida (usualmente una Promesa de Result).
export interface UseCase<IRequest, IResponse> {
  // Método único 'execute' que fuerza a que cada clase haga UNA sola cosa (SRP).
  execute(request?: IRequest): Promise<IResponse> | IResponse;
}
