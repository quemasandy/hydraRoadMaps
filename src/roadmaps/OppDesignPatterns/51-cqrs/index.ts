/**
 * CQRS (Command Query Responsibility Segregation)
 * Separa operaciones de lectura (Query) de escritura (Command)
 *
 * Big Tech: High-traffic systems, reporting, event-driven architectures
 */

// Commands (write operations)
interface Command {
  execute(): void;
}

class CreateOrderCommand implements Command {
  constructor(private orderId: string, private amount: number, private writeModel: OrderWriteModel) {}

  execute(): void {
    console.log(`[Command] Creating order ${this.orderId}...`);
    this.writeModel.createOrder(this.orderId, this.amount);
  }
}

// Write Model (optimized for writes)
class OrderWriteModel {
  private orders: Map<string, { id: string; amount: number; createdAt: Date }> = new Map();

  createOrder(id: string, amount: number): void {
    const order = { id, amount, createdAt: new Date() };
    this.orders.set(id, order);
    console.log(`  [WriteModel] Order ${id} saved`);

    // Publish event to sync read model
    this.publishEvent({ type: 'OrderCreated', data: order });
  }

  private publishEvent(event: any): void {
    console.log(`  [Event] ${event.type} published`);
  }
}

// Read Model (optimized for queries, denormalized)
class OrderReadModel {
  private orderSummaries: Array<{ id: string; amount: number; status: string }> = [];

  // Receives events and updates denormalized views
  onOrderCreated(orderId: string, amount: number): void {
    this.orderSummaries.push({ id: orderId, amount, status: 'created' });
    console.log(`  [ReadModel] Order summary updated`);
  }

  getAllOrders() {
    return this.orderSummaries;
  }

  getTotalRevenue(): number {
    return this.orderSummaries.reduce((sum, o) => sum + o.amount, 0);
  }
}

// Queries (read operations)
class GetAllOrdersQuery {
  constructor(private readModel: OrderReadModel) {}

  execute() {
    console.log(`[Query] Fetching all orders...`);
    return this.readModel.getAllOrders();
  }
}

class GetTotalRevenueQuery {
  constructor(private readModel: OrderReadModel) {}

  execute(): number {
    console.log(`[Query] Calculating total revenue...`);
    return this.readModel.getTotalRevenue();
  }
}

// Demo
console.log('='.repeat(60));
console.log('CQRS - Order Management');
console.log('='.repeat(60));

const writeModel = new OrderWriteModel();
const readModel = new OrderReadModel();

// Execute commands
new CreateOrderCommand('ord_1', 100, writeModel).execute();
readModel.onOrderCreated('ord_1', 100);

new CreateOrderCommand('ord_2', 200, writeModel).execute();
readModel.onOrderCreated('ord_2', 200);

// Execute queries
console.log('\n--- Queries ---');
const orders = new GetAllOrdersQuery(readModel).execute();
console.log(`  Orders:`, orders);

const revenue = new GetTotalRevenueQuery(readModel).execute();
console.log(`  Total Revenue: $${revenue}`);

/**
 * PREGUNTAS:
 * 1. ¿CQRS vs traditional architecture?
 * 2. ¿CQRS + Event Sourcing?
 * 3. ¿Eventual consistency challenges?
 * 4. ¿When to use CQRS?
 * 5. ¿Read model synchronization?
 * 6. ¿Multiple read models?
 * 7. ¿CQRS in microservices?
 * 8. ¿CQRS complexity tradeoffs?
 */

export { CreateOrderCommand, OrderReadModel };
