/**
 * Archivo: IPaymentGateway.ts
 * UBICACIÓN: Capa de Dominio / Interfaces (Puertos)
 *
 * Contrato para procesar pagos.
 * El dominio no sabe si se usa Stripe, PayPal, Cybersource o Lyra.
 */

export interface IPaymentGateway {
  processPayment(amount: number, currency: string, source: string): Promise<boolean>;
}
