/**
 * Archivo: Order.ts
 * UBICACIÓN: Capa de Dominio / Entidades
 *
 * Representa una orden de compra en el sistema.
 */

export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly amount: number,
    public readonly status: 'PENDING' | 'PAID' | 'FAILED' = 'PENDING',
    public readonly createdAt: Date = new Date()
  ) {}

  /**
   * REGLA DE NEGOCIO:
   * Marcar la orden como pagada.
   */
  markAsPaid(): Order {
    if (this.status === 'PAID') {
      throw new Error("La orden ya está pagada.");
    }
    return new Order(this.id, this.userId, this.amount, 'PAID', this.createdAt);
  }

  /**
   * REGLA DE NEGOCIO:
   * Marcar la orden como fallida.
   */
  markAsFailed(): Order {
    return new Order(this.id, this.userId, this.amount, 'FAILED', this.createdAt);
  }
}
