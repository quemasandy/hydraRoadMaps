/**
 * Archivo: SmtpEmailClient.ts
 * UBICACIÓN: Capa de Infraestructura / Email
 *
 * Implementación concreta usando SMTP.
 */

import { IEmailService } from '../../domain/interfaces/IEmailService';

export class SmtpEmailClient implements IEmailService {
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    console.log(`[Infra - Email] Conectando a servidor SMTP... Enviando 'Bienvenida' a ${email}`);
  }

  async sendOrderConfirmation(email: string, orderId: string): Promise<void> {
    console.log(`[Infra - Email] Conectando a servidor SMTP... Enviando 'Confirmación Orden ${orderId}' a ${email}`);
  }
}
