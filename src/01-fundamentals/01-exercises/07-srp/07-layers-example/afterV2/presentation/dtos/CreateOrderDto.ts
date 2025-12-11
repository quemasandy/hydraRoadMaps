/**
 * Archivo: CreateOrderDto.ts
 * UBICACIÓN: Capa de Presentación / DTOs
 *
 * Estructura de datos para crear una orden.
 */

export interface CreateOrderDto {
  userId: string;
  items: Array<{
    productId: string;
    price: number;
    quantity: number;
  }>;
  paymentSource: string; // Token de tarjeta, ID de cuenta, etc.
}
