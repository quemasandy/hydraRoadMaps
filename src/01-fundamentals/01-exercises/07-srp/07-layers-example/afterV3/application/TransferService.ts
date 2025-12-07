import { IAccountRepository } from "../domain/IAccountRepository";
import { IEmailService } from "../domain/IEmailService";
import { DomainError } from "../domain/DomainErrors";

/**
 * APPLICATION SERVICE: TransferService
 * 
 * Esta clase representa un CASO DE USO DEL SISTEMA.
 * Su nombre suele ser un verbo o representar una acción: "Realizar Transferencia".
 * 
 * RESPONSABILIDAD:
 * Orquestar el flujo de datos. Conecta las piezas:
 * 1. Pide datos al Repositorio.
 * 2. Pide al Dominio que ejecute lógica.
 * 3. Guarda resultados con el Repositorio.
 * 4. Pide al Servicio de Email que notifique.
 * 
 * NO CONTIENE LÓGICA DE NEGOCIO:
 * NO verás aquí un `if (saldo < monto)`. Eso es responsabilidad de `BankAccount`.
 * Este servicio solo coordina.
 */
export class TransferService {

  /**
   * INYECCIÓN DE DEPENDENCIAS
   * Recibimos las implementaciones concretas a través de interfaces.
   * Esto permite testear este servicio fácilmente usando "Mocks" o "Fakes"
   * sin necesitar una base de datos real o enviar emails reales.
   */
  constructor(
    private accountRepository: IAccountRepository, // Para leer/guardar datos
    private emailService: IEmailService            // Para enviar correos
  ) {}

  /**
   * Ejecuta el caso de uso "Transferencia".
   * 
   * @param fromId ID de la cuenta origen
   * @param toId ID de la cuenta destino
   * @param amount Monto a transferir
   */
  async execute(fromId: string, toId: string, amount: number): Promise<void> {
    console.log(`[Service] 🚀 Iniciando caso de uso: Transferencia de ${amount} ($) de ${fromId} a ${toId}`);

    // =================================================================
    // PASO 1: OBTENCIÓN DE DATOS (Interacción con Infraestructura)
    // =================================================================
    // El servicio pide al repositorio buscar las cuentas involucradas.
    const sourceAccount = await this.accountRepository.findById(fromId);
    const destinationAccount = await this.accountRepository.findById(toId);

    // Validación de existencia (Esto es lógica de aplicación, no de dominio profundo)
    if (!sourceAccount || !destinationAccount) {
      // Si no encontramos alguna cuenta, fallamos.
      throw new Error("Error: Una de las cuentas especificadas no existe.");
    }

    // =================================================================
    // PASO 2: EJECUCIÓN DE LÓGICA DE NEGOCIO (Interacción con Dominio)
    // =================================================================
    // AQUI OCURRE LA MAGIA.
    // Invocamos los métodos del modelo de dominio.
    // El servicio NO toca los saldos directamente (sourceAccount.balance -= x).
    // Delega esa responsabilidad a los objetos que saben reglas de negocio.
    try {
      
      // Intentamos debitar al origen.
      // Si no tiene fondos, sourceAccount lanzará una excepción 'InsufficientFundsError'.
      sourceAccount.debit(amount); 
      
      // Si el débito pasó, intentamos acreditar al destino.
      destinationAccount.credit(amount);

    } catch (error) {
      // =================================================================
      // MANEJO DE ERRORES DE DOMINIO
      // =================================================================
      // Si el dominio se queja (ej: fondos insuficientes), capturamos el error.
      if (error instanceof DomainError) {
        console.error(`[Service] 🛑 Regla de Negocio Bloqueante: ${error.message}`);
        // Re-lanzamos el error para que quien llamó al servicio sepa que falló.
        throw error;
      }
      // Si es otro tipo de error (inesperado), también lo lanzamos.
      throw error;
    }

    // =================================================================
    // PASO 3: PERSISTENCIA (Interacción con Infraestructura)
    // =================================================================
    // Si llegamos aquí, la lógica de negocio fue exitosa en memoria.
    // Ahora debemos hacer esos cambios permanentes en la base de datos.
    
    // Guardamos la cuenta origen (con su nuevo saldo menor)
    await this.accountRepository.save(sourceAccount);
    
    // Guardamos la cuenta destino (con su nuevo saldo mayor)
    await this.accountRepository.save(destinationAccount);
    
    console.log("[Service] ✅ Cambios persistidos en base de datos correctamente.");

    // =================================================================
    // PASO 4: EFECTOS SECUNDARIOS / NOTIFICACIONES (Interacción con Infraestructura)
    // =================================================================
    // Esta es la respuesta a tu pregunta.
    // El envío de correo va AQUI, después de que todo lo crítico (plata) pasó.
    
    try {
      // Generamos un ID de transacción falso para el recibo
      const receiptId = Date.now().toString();
      
      // Usamos el servicio de email (interface) para notificar.
      await this.emailService.sendReceipt(sourceAccount.ownerEmail, amount, receiptId);
      
    } catch (emailError) {
      // IMPORTANTE: Si falla el envío de email... ¿Deberíamos cancelar la transferencia?
      // Generalmente NO. La plata ya se movió.
      // Solo logueamos que falló el aviso, pero la transacción bancaria es válida.
      console.warn("[Service] ⚠️ La transferencia fue exitosa pero falló el envío del email de confirmación.");
    }
  }
}
