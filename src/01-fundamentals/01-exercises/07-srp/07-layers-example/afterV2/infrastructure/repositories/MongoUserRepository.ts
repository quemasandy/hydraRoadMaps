/**
 * Archivo: MongoUserRepository.ts
 * UBICACIÓN: Capa de Infraestructura / Repositories
 *
 * - Para quién trabaja: Dominio (IUserRepository).
 * - Intención: Persistir usuarios en MongoDB.
 * - Misión: Mapear entidades a BSON y ejecutar operaciones en la colección 'users'.
 */
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserDocument } from '../dtos/UserDocument';
import { MongoUserMapper } from '../mappers/MongoUserMapper';

export class MongoUserRepository implements IUserRepository {
  
  // Simulamos el Driver de MongoDB (como si fuera 'mongoose' o 'mongodb native driver')
  private db = {
    collection: (name: string) => ({
      insertOne: async (doc: any): Promise<any> => {
        console.log(`[Mongo Driver] db.${name}.insertOne(${JSON.stringify(doc)})`);
        return { acknowledged: true, insertedId: doc._id };
      },
      findOne: async (query: any): Promise<any> => {
        console.log(`[Mongo Driver] db.${name}.findOne(${JSON.stringify(query)})`);
        
        // SIMULACIÓN: Si buscamos por ID 123, devolvemos algo, si no null
        if (query._id === 'user_123' || query['$or']) { // Hack simple para simulacion
           return null; // Simulamos no encontrado por defecto para el ejemplo
        }
        
        if (query.email === 'andyexist@gmail.com') {
          return {
            _id: 'user_123',
            email: 'andyExist@gmail.com',
            password_hash: 'secret_hash',
            is_active: true,
            created_at: '2025-12-13T18:14:09.000Z'
          };
        } 

        return null;
      }
    })
  };

  async save(user: User): Promise<User> {
    // 1. Dominio -> Documento BSON (DTO)
    const userDoc = MongoUserMapper.toPersistence(user);

    // 2. Persistencia (Infraestructura Pura)
    // Mongo usa upsert o insertOne/updateOne. Aquí simulamos insert.
    await this.db.collection('users').insertOne(userDoc);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    // 1. Consulta BSON
    const doc = await this.db.collection('users').findOne({ email: email });

    // 2. Si no hay documento, retornamos null
    if (!doc) return null;

    // 3. Reconstitución (BSON -> User Entity)
    return MongoUserMapper.toDomain(doc as UserDocument);
  }

  async findById(id: string): Promise<User | null> {
    // 1. Consulta BSON por _id
    // Nota: en la vida real user._id puede ser ObjectId, aquí usamos string
    console.log(`[Mongo Driver] db.users.findOne({ _id: '${id}' })`);

    // SIMULACIÓN DE RETORNO DE DRIVER
    const mockDoc: UserDocument = {
      _id: id,
      email: "found@mongo.com",
      password_hash: "secret_hash_mongo",
      is_active: true, // Boolean nativo
      created_at: new Date()
    };

    // 2. Transformación
    return MongoUserMapper.toDomain(mockDoc);
  }
}
