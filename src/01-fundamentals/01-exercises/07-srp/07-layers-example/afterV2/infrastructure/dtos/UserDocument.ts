/**
 * Archivo: UserDocument.ts
 * UBICACIÓN: Capa de Infraestructura / DTOs
 *
 * ¿QUÉ ES UN DOCUMENTO DE MONGO?
 * - Representa la estructura de los documentos en la colección 'users'.
 * - MongoDB usa '_id' en lugar de 'id'.
 * - Es flexible, pero en Typescript definimos una interfaz para seguridad.
 */

export interface UserDocument {
  _id: string;           // Mongo SIEMPRE usa _id
  email: string;
  password_hash: string;
  is_active: boolean;    // BSON soporta booleanos nativos
  created_at: Date;      // BSON soporta Date nativos
}
