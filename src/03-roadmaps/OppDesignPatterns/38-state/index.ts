/**
 * STATE PATTERN
 * Permite que un objeto altere su comportamiento cuando su estado interno cambia.
 * El objeto parecerá cambiar su clase.
 *
 * Big Tech: Order workflows, Subscription lifecycles, Connection state machines
 */

// State interface
interface SubscriptionState {
  activate(context: Subscription): void;
  pause(context: Subscription): void;
  cancel(context: Subscription): void;
  renew(context: Subscription): void;
  processPayment(context: Subscription): boolean;
  getStateName(): string;
}

// Context: Subscription
class Subscription {
  private state: SubscriptionState;
  private customerId: string;
  private plan: string;
  private price: number;

  constructor(customerId: string, plan: string, price: number) {
    this.customerId = customerId;
    this.plan = plan;
    this.price = price;
    this.state = new DraftState(); // Initial state
  }

  setState(state: SubscriptionState): void {
    console.log(`  [Subscription] State changed: ${this.state.getStateName()} → ${state.getStateName()}`);
    this.state = state;
  }

  getState(): SubscriptionState {
    return this.state;
  }

  // Delegate to current state
  activate(): void {
    this.state.activate(this);
  }

  pause(): void {
    this.state.pause(this);
  }

  cancel(): void {
    this.state.cancel(this);
  }

  renew(): void {
    this.state.renew(this);
  }

  processPayment(): boolean {
    return this.state.processPayment(this);
  }

  getInfo(): string {
    return `${this.customerId} | ${this.plan} ($${this.price}/mo) | State: ${this.state.getStateName()}`;
  }
}

// Concrete States

// 1. Draft State (initial)
class DraftState implements SubscriptionState {
  activate(context: Subscription): void {
    console.log(`[Draft] Activating subscription...`);
    context.setState(new ActiveState());
  }

  pause(context: Subscription): void {
    console.log(`[Draft] Cannot pause - subscription not active yet`);
  }

  cancel(context: Subscription): void {
    console.log(`[Draft] Cancelling draft subscription...`);
    context.setState(new CancelledState());
  }

  renew(context: Subscription): void {
    console.log(`[Draft] Cannot renew - subscription not active`);
  }

  processPayment(context: Subscription): boolean {
    console.log(`[Draft] No payment processing in draft state`);
    return false;
  }

  getStateName(): string {
    return 'Draft';
  }
}

// 2. Active State
class ActiveState implements SubscriptionState {
  activate(context: Subscription): void {
    console.log(`[Active] Already active`);
  }

  pause(context: Subscription): void {
    console.log(`[Active] Pausing subscription...`);
    context.setState(new PausedState());
  }

  cancel(context: Subscription): void {
    console.log(`[Active] Cancelling active subscription...`);
    context.setState(new CancelledState());
  }

  renew(context: Subscription): void {
    console.log(`[Active] Renewing subscription...`);
    // Process payment for renewal
    const success = this.processPayment(context);
    if (!success) {
      console.log(`[Active] Payment failed - moving to past due`);
      context.setState(new PastDueState());
    }
  }

  processPayment(context: Subscription): boolean {
    console.log(`[Active] Processing monthly payment...`);
    const success = Math.random() > 0.1; // 90% success rate

    if (success) {
      console.log(`  ✓ Payment successful`);
      return true;
    } else {
      console.log(`  ❌ Payment failed`);
      return false;
    }
  }

  getStateName(): string {
    return 'Active';
  }
}

// 3. Paused State
class PausedState implements SubscriptionState {
  activate(context: Subscription): void {
    console.log(`[Paused] Resuming subscription...`);
    context.setState(new ActiveState());
  }

  pause(context: Subscription): void {
    console.log(`[Paused] Already paused`);
  }

  cancel(context: Subscription): void {
    console.log(`[Paused] Cancelling paused subscription...`);
    context.setState(new CancelledState());
  }

  renew(context: Subscription): void {
    console.log(`[Paused] Cannot renew while paused - activate first`);
  }

  processPayment(context: Subscription): boolean {
    console.log(`[Paused] No payment processing while paused`);
    return false;
  }

  getStateName(): string {
    return 'Paused';
  }
}

// 4. Past Due State
class PastDueState implements SubscriptionState {
  private retries = 0;
  private maxRetries = 3;

  activate(context: Subscription): void {
    console.log(`[PastDue] Cannot activate - payment required`);
  }

  pause(context: Subscription): void {
    console.log(`[PastDue] Cannot pause - payment required`);
  }

  cancel(context: Subscription): void {
    console.log(`[PastDue] Cancelling past due subscription...`);
    context.setState(new CancelledState());
  }

  renew(context: Subscription): void {
    console.log(`[PastDue] Attempting payment retry ${this.retries + 1}/${this.maxRetries}...`);

    const success = this.processPayment(context);

    if (success) {
      console.log(`[PastDue] Payment successful - reactivating`);
      context.setState(new ActiveState());
    } else {
      this.retries++;
      if (this.retries >= this.maxRetries) {
        console.log(`[PastDue] Max retries reached - cancelling subscription`);
        context.setState(new CancelledState());
      }
    }
  }

  processPayment(context: Subscription): boolean {
    console.log(`[PastDue] Retrying payment...`);
    return Math.random() > 0.5; // 50% success rate
  }

  getStateName(): string {
    return 'Past Due';
  }
}

// 5. Cancelled State (terminal)
class CancelledState implements SubscriptionState {
  activate(context: Subscription): void {
    console.log(`[Cancelled] Cannot activate - subscription was cancelled`);
  }

  pause(context: Subscription): void {
    console.log(`[Cancelled] Cannot pause - already cancelled`);
  }

  cancel(context: Subscription): void {
    console.log(`[Cancelled] Already cancelled`);
  }

  renew(context: Subscription): void {
    console.log(`[Cancelled] Cannot renew - create new subscription`);
  }

  processPayment(context: Subscription): boolean {
    console.log(`[Cancelled] No payment processing for cancelled subscription`);
    return false;
  }

  getStateName(): string {
    return 'Cancelled';
  }
}

// Demo
console.log('='.repeat(60));
console.log('STATE PATTERN - Subscription Lifecycle');
console.log('='.repeat(60));

const sub = new Subscription('cus_123', 'Pro Plan', 29.99);

console.log(`\nInitial: ${sub.getInfo()}`);

// Activate
console.log('\n--- Activate ---');
sub.activate();
console.log(sub.getInfo());

// Process payment
console.log('\n--- Process Payment ---');
sub.processPayment();

// Pause
console.log('\n--- Pause ---');
sub.pause();
console.log(sub.getInfo());

// Try to process payment while paused
console.log('\n--- Try Payment While Paused ---');
sub.processPayment();

// Resume
console.log('\n--- Resume ---');
sub.activate();
console.log(sub.getInfo());

// Simulate payment failure
console.log('\n--- Renewal (may fail) ---');
sub.renew();
console.log(sub.getInfo());

/**
 * Real-world: Order State Machine
 */
console.log('\n\n' + '='.repeat(60));
console.log('REAL-WORLD: Order State Machine');
console.log('='.repeat(60));

type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderState {
  pay(order: Order): void;
  ship(order: Order): void;
  deliver(order: Order): void;
  cancel(order: Order): void;
}

class Order {
  constructor(private orderId: string, private state: OrderState) {}

  setState(state: OrderState): void {
    this.state = state;
  }

  pay(): void { this.state.pay(this); }
  ship(): void { this.state.ship(this); }
  deliver(): void { this.state.deliver(this); }
  cancel(): void { this.state.cancel(this); }

  getId(): string { return this.orderId; }
}

class PendingOrderState implements OrderState {
  pay(order: Order): void {
    console.log(`[Order ${order.getId()}] Payment received`);
    order.setState(new PaidOrderState());
  }

  ship(order: Order): void {
    console.log(`[Order ${order.getId()}] Cannot ship - payment required`);
  }

  deliver(order: Order): void {
    console.log(`[Order ${order.getId()}] Cannot deliver - not shipped`);
  }

  cancel(order: Order): void {
    console.log(`[Order ${order.getId()}] Order cancelled`);
    order.setState(new CancelledOrderState());
  }
}

class PaidOrderState implements OrderState {
  pay(order: Order): void {
    console.log(`[Order ${order.getId()}] Already paid`);
  }

  ship(order: Order): void {
    console.log(`[Order ${order.getId()}] Order shipped`);
    order.setState(new ShippedOrderState());
  }

  deliver(order: Order): void {
    console.log(`[Order ${order.getId()}] Cannot deliver - not shipped yet`);
  }

  cancel(order: Order): void {
    console.log(`[Order ${order.getId()}] Refunding and cancelling...`);
    order.setState(new CancelledOrderState());
  }
}

class ShippedOrderState implements OrderState {
  pay(order: Order): void {
    console.log(`[Order ${order.getId()}] Already paid`);
  }

  ship(order: Order): void {
    console.log(`[Order ${order.getId()}] Already shipped`);
  }

  deliver(order: Order): void {
    console.log(`[Order ${order.getId()}] Order delivered`);
    order.setState(new DeliveredOrderState());
  }

  cancel(order: Order): void {
    console.log(`[Order ${order.getId()}] Cannot cancel - already shipped`);
  }
}

class DeliveredOrderState implements OrderState {
  pay(order: Order): void {}
  ship(order: Order): void {}
  deliver(order: Order): void {
    console.log(`[Order ${order.getId()}] Already delivered`);
  }
  cancel(order: Order): void {
    console.log(`[Order ${order.getId()}] Contact support for returns`);
  }
}

class CancelledOrderState implements OrderState {
  pay(order: Order): void {}
  ship(order: Order): void {}
  deliver(order: Order): void {}
  cancel(order: Order): void {
    console.log(`[Order ${order.getId()}] Already cancelled`);
  }
}

const order = new Order('ORD-001', new PendingOrderState());
order.pay();
order.ship();
order.deliver();

/**
 * PREGUNTAS:
 * 1. ¿State vs Strategy pattern?
 * 2. ¿Cuándo usar State pattern vs if-else?
 * 3. ¿State explosion problem?
 * 4. ¿State pattern con TypeScript discriminated unions?
 * 5. ¿Testing state transitions?
 * 6. ¿State machine vs State pattern?
 * 7. ¿Cómo modelar complex workflows (AWS Step Functions)?
 * 8. ¿Shared state data entre states?
 */

export { Subscription, SubscriptionState, ActiveState, PausedState };
