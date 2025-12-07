import { BankAccount } from "./BankAccount";

/**
 * REPOSITORY INTERFACE (Contrato del Repositorio)
 * 
 * Este archivo pertenece a la capa de DOMINIO, aunque hable de persistencia.
 * ¿Por qué? Porque define las NECESIDADES del dominio ("Necesito poder buscar y guardar cuentas").
 * 
 * PRINCIPIO DE INVERSIÓN DE DEPENDENCIAS (DIP):
 * - Las capas de alto nivel (Dominio) no dependen de las de bajo nivel (Infraestructura/BD).
 * - Ambas dependen de abstracciones (Esta Interface).
 * 
 * Aquí NO hay SQL, ni Mongo, ni JSON. Es agnóstico a la tecnología.
 */
export interface IAccountRepository {
  
  /**
   * Busca una cuenta por su ID.
   * Retorna una Promesa porque ir a buscar datos (a disco, red, etc) es asíncrono.
   * Retorna `BankAccount | null` porque es posible que el ID no exista.
   */
  findById(id: string): Promise<BankAccount | null>;

  /**
   * Guarda (o actualiza) el estado de una cuenta.
   * Recibe la entidad COMPLETA. El repositorio decidirá cómo extraer los datos para guardarlos.
   */
  save(account: BankAccount): Promise<void>;
}
