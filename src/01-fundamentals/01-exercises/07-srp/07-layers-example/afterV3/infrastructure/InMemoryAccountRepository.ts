import { IAccountRepository } from "../domain/IAccountRepository";
import { BankAccount } from "../domain/BankAccount";

/**
 * INFRASTRUCTURE: ADAPTADOR DE REPOSITORIO (In Memory)
 * 
 * Esta clase IMPLEMENTA la interfaz `IAccountRepository` definida en el dominio.
 * Es un detalle técnico de CÓMO se guardan los datos.
 * 
 * En este caso, usamos un `Map` (memoria RAM) para simular una Base de Datos.
 * Si mañana queremos usar MongoDB, crearíamos `MongoAccountRepository` y
 * el resto de la aplicación NO tendría que cambiar ni una línea.
 */
export class InMemoryAccountRepository implements IAccountRepository {
  
  // Nuestra "Base de Datos" simulada
  private accounts: Map<string, BankAccount> = new Map();

  /**
   * Método auxiliar para "sembrar" datos de prueba (Seed).
   * NO es parte de la interfaz IAccountRepository, es exclusivo de esta
   * implementación en memoria para poder testear.
   */
  seed(account: BankAccount) {
    // Clonamos el objeto para simular que viene de una DB y no es la misma referencia en memoria
    // (Esto es un detalle técnico para evitar trampas en tests locales con objetos mutables)
    this.accounts.set(account.id, account);
  }

  /**
   * IMPLEMENTACIÓN: Buscar por ID
   */
  async findById(id: string): Promise<BankAccount | null> {
    console.log(`[Repo-InMem] 🔍 Consultando DB por cuenta: ${id}...`);
    
    // Simulamos latencia de red (opcional, pero realista)
    // await new Promise(resolve => setTimeout(resolve, 100));

    const account = this.accounts.get(id);
    
    if (!account) return null;

    // IMPORTANTE: Al recuperar de la "BD", devolvemos una INSTANCIA DE DOMINIO.
    // En un repo real SQL, aquí convertiríamos filas de tabla -> new BankAccount(...)
    // Como aquí ya guardamos objetos, devolvemos el objeto (simulando una copia fresca)
    return Object.assign(Object.create(Object.getPrototypeOf(account)), account);
  }

  /**
   * IMPLEMENTACIÓN: Guardar
   */
  async save(account: BankAccount): Promise<void> {
    console.log(`[Repo-InMem] 💾 Escribiendo en disco virtual... Cuenta: ${account.id} | Nuevo Saldo: ${account.balance}`);
    
    // Guardamos la entidad en nuestro Map
    this.accounts.set(account.id, account);
  }
}
