/**
 * Archivo: 2-service.ts
 * UBICACIÓN: Capa de Negocio (Service / Domain)
 *
 * ¿QUÉ HACE ESTA CAPA?
 * - Contiene las REGLAS DEL JUEGO de tu aplicación.
 * - Toma decisiones inteligentes.
 * - Orquesta el flujo (valida lógica -> llama a guardar -> envía email).
 * - NO sabe de HTTP (req, res).
 * - NO sabe SQL (usa el Repositorio para eso).
 *
 * SU ÚNICA RESPONSABILIDAD: Cumplir los requisitos del negocio.
 */

import { UserRepository, UserEntity } from './1-repository';

export class UserService {
  
  // Inyectamos el repositorio para no depender de una implementación concreta (idealmente)
  constructor(private userRepository: UserRepository) {}

  registerUser(email: string, passwordPlain: string): UserEntity {
    console.log(`[Capa de Negocio] Iniciando registro para ${email}...`);

    // REGLA DE NEGOCIO 1: Validar dominio prohibido
    // Esto NO es validación de formato (eso va en el controlador), es regla de negocio.
    if (email.endsWith('@evil.com')) {
      throw new Error("Regla de Negocio: No se permiten usuarios de evil.com");
    }

    // REGLA DE NEGOCIO 2: Encriptar contraseña
    const passwordHash = `encrypted_${passwordPlain}`;

    // Delegamos el guardado a la capa lógica de abajo (Datos)
    // El servicio NO escribe SQL, le pide al experto (Repository) que lo haga.
    const newUser = this.userRepository.save(email, passwordHash);

    console.log(`[Capa de Negocio] Usuario registrado exitosamente.`);
    return newUser;
  }
}
