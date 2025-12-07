import { IEmailService } from "../domain/IEmailService";

/**
 * INFRASTRUCTURE: ADAPTADOR DE EMAIL (Consola)
 * 
 * Esta clase implementa la interfaz `IEmailService`.
 * En lugar de enviar un correo real por internet, simplemente
 * imprime el mensaje en la terminal.
 * 
 * Esto es muy útil para:
 * 1. Desarrollo local (no spammear correos reales).
 * 2. Pruebas automatizadas.
 */
export class ConsoleEmailService implements IEmailService {
  
  /**
   * Implementación del método definido en el contrato del Dominio.
   */
  async sendReceipt(to: string, amount: number, transactionId: string): Promise<void> {
    // Simulamos un pequeño delay de red
    // await new Promise(resolve => setTimeout(resolve, 50));

    console.log(`
      ---------------------------------------------------------
      📨 [Email Provider Mock] ENVIANDO CORREO SIMULADO...
      ---------------------------------------------------------
      TO:      ${to}
      SUBJECT: Transferencia Realizada con Éxito
      
      HOLA,
      Te informamos que se debitaron $${amount} de tu cuenta.
      ID de referencia: ${transactionId}
      
      Gracias por confiar en nosotros.
      ---------------------------------------------------------
    `);
  }
}
