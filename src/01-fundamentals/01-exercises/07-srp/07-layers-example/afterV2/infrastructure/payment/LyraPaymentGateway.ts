/**
 * Archivo: LyraPaymentGateway.ts
 * UBICACIÓN: Capa de Infraestructura / Payment
 *
 * Implementación concreta para Lyra.
 */

import { IPaymentGateway } from '../../domain/interfaces/IPaymentGateway';

export class LyraPaymentGateway implements IPaymentGateway {
  async processPayment(amount: number, currency: string, source: string): Promise<boolean> {
    console.log(`[Infra - Lyra] Redirigiendo a pasarela de pago segura...`);
    console.log(`[Infra - Lyra] Procesando pago de ${amount} ${currency}`);
    return true; // Simula éxito
  }
}
