/**
 * Archivo: OrderService.ts
 * UBICACIÓN: Capa de Dominio / Servicios
 *
 * Servicio para gestionar órdenes de compra.
 * Orquesta pagos, colas y notificaciones.
 */

import { Order } from '../entities/Order';
import { IPaymentGateway } from '../interfaces/IPaymentGateway';
import { IQueueService } from '../interfaces/IQueueService';
import { IEmailService } from '../interfaces/IEmailService';

export class OrderService {
  constructor(
    private readonly paymentGateway: IPaymentGateway,
    private readonly queueService: IQueueService,
    private readonly emailService: IEmailService
  ) {}

  async createOrder(userId: string, amount: number, paymentSource: string): Promise<Order> {
    console.log(`[Dominio] Creando orden para usuario ${userId} por $${amount}...`);

    // 1. Crear la orden en estado PENDING
    let order = new Order(Date.now().toString(), userId, amount);

    try {
      // 2. Procesar pago (usando el puerto de pago)
      const paymentSuccess = await this.paymentGateway.processPayment(amount, 'USD', paymentSource);

      if (paymentSuccess) {
        // 3. Si el pago es exitoso, marcar como pagada
        order = order.markAsPaid();
        
        // 4. Publicar evento en la cola (para logística, analítica, etc.)
        await this.queueService.publishMessage('orders_queue', {
          orderId: order.id,
          status: 'PAID',
          amount: amount
        });

        // 5. Enviar confirmación por email
        await this.emailService.sendOrderConfirmation("user@example.com", order.id); // Email hardcodeado para el ejemplo
        
        console.log(`[Dominio] Orden ${order.id} procesada exitosamente.`);
      } else {
        // Pago rechazado
        order = order.markAsFailed();
        console.warn(`[Dominio] Pago rechazado para orden ${order.id}.`);
      }

    } catch (error) {
      console.error(`[Dominio] Error procesando orden: ${error}`);
      order = order.markAsFailed();
    }

    return order;
  }
}
