import { InsufficientFundsError, InvalidAmountError } from "./DomainErrors";

/**
 * DOMAIN ENTITY (Entidad de Dominio): BankAccount
 * 
 * Esta clase es el CORAZÓN del sistema. Es la representación en código
 * del concepto de "Cuenta Bancaria" y su comportamiento.
 * 
 * CARACTERÍSTICAS CLAVE:
 * 1. POSEE ESTADO: Tiene datos (id, balance, email).
 * 2. PROTEGE SU ESTADO: Nadie puede modificar `_balance` directamente desde fuera.
 * 3. POSEE COMPORTAMIENTO: Tiene métodos (`debit`, `credit`) que hacen cosas con esos datos.
 * 4. IGNORANTE DE LA INFRAESTRUCTURA: No sabe guardar en BD, no sabe enviar emails, no sabe de HTTP.
 */
export class BankAccount {
  
  /**
   * CONSTRUCTOR
   * Inicializa la cuenta en un estado válido.
   * 
   * @param id Identificador único de la cuenta (UUID o similar).
   * @param _balance Estado interno del dinero. Es privado para que nadie haga "cuenta.balance = 1000000".
   * @param ownerEmail Email del dueño (dato necesario para reglas de negocio o notificaciones futuras).
   */
  constructor(
    public readonly id: string,      // readonly: No se puede cambiar el ID una vez creada
    private _balance: number,        // private: Solo esta clase puede tocarlo directament
    public readonly ownerEmail: string
  ) {}

  /**
   * GETTER PÚBLICO
   * Permite que otros LEAN el saldo, pero no que lo MODIFIQUEN.
   * Esto mantiene la encapsulación.
   */
  get balance(): number {
    return this._balance;
  }

  /**
   * MÉTODO DE DOMINIO: Debitar (Restar dinero)
   * 
   * Aquí vive la LÓGICA DE NEGOCIO PURA.
   * Regla de Negocio 1: No se puede debitar montos negativos o cero.
   * Regla de Negocio 2: No se puede quedar con saldo negativo (Invariant).
   * 
   * Fíjate que si algo sale mal, LANZA UN ERROR (throw). 
   * No retorna false, ni strings, ni null. Lanza una excepción fuerte.
   * 
   * @param amount Cantidad a restar.
   */
  debit(amount: number): void {
    // 1. Validación de entrada de dominio
    if (amount <= 0) {
      throw new InvalidAmountError(); // "No puedo procesar 0 o negativos"
    }
    
    // 2. Validación de regla de negocio (Invariante)
    if (amount > this._balance) {
      // Si permitimos esto, el saldo seria negativo, violando la regla del banco.
      // Por eso lanzamos un error y DETENEMOS la ejecución aqui.
      throw new InsufficientFundsError(); 
    }

    // 3. Mutación del estado (Solo si pasamos las validaciones anteriores)
    this._balance -= amount;
  }

  /**
   * MÉTODO DE DOMINIO: Acreditar (Sumar dinero)
   * 
   * Regla de Negocio: Solo aceptamos montos positivos.
   * No hay límite máximo de saldo en este banco simple.
   * 
   * @param amount Cantidad a sumar.
   */
  credit(amount: number): void {
    // 1. Validación
    if (amount <= 0) {
      throw new InvalidAmountError();
    }
    // 2. Mutación
    this._balance += amount;
  }
}
