
// ✅ AFTER: Orchestration (The "Manager" Pattern)
// This class does ONE thing: It coordinates the process.
// It delegates the "How" to specialized classes.
// Complexity is low because you can read the high-level flow like a story.

import { InventorySystem } from './services/InventorySystem';
import { PaymentGateway } from './services/PaymentGateway';
import { LogisticsService } from './services/LogisticsService';
import { NotificationCenter } from './services/NotificationCenter';

export class OrderProcessor {
  constructor(
    private inventory: InventorySystem,
    private payment: PaymentGateway,
    private logistics: LogisticsService,
    private notifications: NotificationCenter
  ) {}

  async process(order: Order): Promise<void> {
    // 1. Validation is delegated
    this.validateOrder(order);

    // 2. Inventory check is a semantic method call
    await this.inventory.reserveStock(order.items);

    // 3. Payment is abstract (could be Stripe, PayPal, etc.)
    await this.payment.charge(order.total, order.paymentToken);

    // 4. Shipping logic is encapsulated
    const tracking = await this.logistics.ship(order.address, order.items);

    // 5. Notifications are fire-and-forget
    await this.notifications.sendConfirmation(order.userEmail, tracking);
  }

  private validateOrder(order: Order) {
    if (!order.items.length) throw new Error('Empty order');
  }
}

// Interfaces define the "Shape" of dependencies (Dependency Inversion)
interface Order { items: any[]; total: number; paymentToken: string; address: any; userEmail: string; }

// Sub-components (usually in separate files)
// Notice how simple each one is to read and maintain?
class InventorySystem {
  async reserveStock(items: any[]) { /* SQL logic lives here ONLY */ }
}

class PaymentGateway {
  async charge(amount: number, token: string) { /* Stripe logic lives here ONLY */ }
}

class LogisticsService {
  async ship(address: any, items: any[]) { return 'TRACK-123'; }
}

class NotificationCenter {
  async sendConfirmation(email: string, tracking: string) { /* HTML templates live here ONLY */ }
}
