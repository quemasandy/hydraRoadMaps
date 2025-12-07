/**
 * DOMAIN SERVICE INTERFACE / PORT (Puerto de Salida)
 * 
 * Al igual que el repositorio, esto es un contrato que define una CAPACIDAD
 * que el dominio necesita del mundo exterior: Enviar notificaciones.
 * 
 * Al Dominio NO le importa:
 * - Si usamos SendGrid, AWS SES, Nodemailer o Gmail.
 * - Si el correo tiene HTML bonito o texto plano.
 * - Si se envía síncrona o asíncronamente.
 * 
 * Solo le importa que existe un metodo `sendReceipt` que recibe destinatario, monto e ID.
 */
export interface IEmailService {
  /**
   * Envía un recibo o comprobante de transferencia.
   * @param to Email del destinatario
   * @param amount Monto transferido
   * @param transactionId ID de la transacción para referencia
   */
  sendReceipt(to: string, amount: number, transactionId: string): Promise<void>;
}
