/**
 * Archivo: OrderController.ts
 * UBICACIÓN: Capa de Presentación / Controladores
 *
 * Controlador para gestionar órdenes.
 */

import { OrderService } from '../../domain/services/OrderService';
import { CreateOrderDto } from '../dtos/CreateOrderDto';
import { ConsoleView } from '../views/ConsoleView';

export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly view: ConsoleView
  ) {}

  async createOrder(request: CreateOrderDto): Promise<void> {
    console.log("\n--- [Controller] Recibiendo solicitud de orden ---");

    try {
      // 1. Validación
      if (request.amount <= 0) {
        throw new Error("Bad Request: El monto debe ser positivo");
      }

      // 2. Delegación
      const order = await this.orderService.createOrder(
        request.userId, 
        request.amount, 
        request.paymentSource
      );

      // 3. Respuesta
      this.view.renderSuccess(order);

    } catch (error: any) {
      this.view.renderError(error.message);
    }
  }
}
