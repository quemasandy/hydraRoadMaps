/**
 * Archivo: 1-repository.ts
 * UBICACIÓN: Capa de Acceso a Datos (Infrastructure / Repository)
 *
 * ¿QUÉ HACE ESTA CAPA?
 * - Sabe CÓMO hablar con la base de datos (SQL, Mongo, API externa).
 * - NO sabe de reglas de negocio (no sabe si el usuario es VIP o no).
 * - NO sabe de HTTP (no sabe si viene de una web o una app móvil).
 *
 * SU ÚNICA RESPONSABILIDAD: Guardar y recuperar datos puros.
 */

// Definimos una interfaz simple para el usuario en la base de datos
export interface UserEntity {
  id: number;
  email: string;
  passwordHash: string;
}

export class UserRepository {
  save(email: string, passwordHash: string): UserEntity {
    console.log(`[Capa de Datos] Ejecutando SQL: INSERT INTO users (email, '${passwordHash}')...`);
    
    // Retorna el dato tal cual quedó en la DB
    return {
      id: Math.floor(Math.random() * 1000),
      email: email,
      passwordHash: passwordHash
    };
  }
}
