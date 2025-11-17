/**
 * EVENT SOURCING
 * Almacena cambios como eventos, reconstruye estado desde eventos
 *
 * Big Tech: Banking systems, Audit trails, CQRS
 */

// Domain events
interface Event {
  type: string;
  timestamp: Date;
  aggregateId: string;
}

class AccountCreatedEvent implements Event {
  type = 'AccountCreated';
  timestamp = new Date();
  constructor(public aggregateId: string, public initialBalance: number) {}
}

class MoneyDepositedEvent implements Event {
  type = 'MoneyDeposited';
  timestamp = new Date();
  constructor(public aggregateId: string, public amount: number) {}
}

class MoneyWithdrawnEvent implements Event {
  type = 'MoneyWithdrawn';
  timestamp = new Date();
  constructor(public aggregateId: string, public amount: number) {}
}

// Event Store
class EventStore {
  private events: Event[] = [];

  append(event: Event): void {
    this.events.push(event);
    console.log(`[EventStore] Stored: ${event.type} - ${JSON.stringify(event)}`);
  }

  getEvents(aggregateId: string): Event[] {
    return this.events.filter(e => e.aggregateId === aggregateId);
  }
}

// Aggregate (reconstructed from events)
class BankAccount {
  private balance = 0;

  constructor(private id: string, private eventStore: EventStore) {}

  // Commands (generate events)
  create(initialBalance: number): void {
    const event = new AccountCreatedEvent(this.id, initialBalance);
    this.eventStore.append(event);
    this.apply(event);
  }

  deposit(amount: number): void {
    const event = new MoneyDepositedEvent(this.id, amount);
    this.eventStore.append(event);
    this.apply(event);
  }

  withdraw(amount: number): void {
    if (this.balance < amount) {
      throw new Error('Insufficient funds');
    }
    const event = new MoneyWithdrawnEvent(this.id, amount);
    this.eventStore.append(event);
    this.apply(event);
  }

  // Apply events to update state
  private apply(event: Event): void {
    if (event.type === 'AccountCreated') {
      this.balance = (event as AccountCreatedEvent).initialBalance;
    } else if (event.type === 'MoneyDeposited') {
      this.balance += (event as MoneyDepositedEvent).amount;
    } else if (event.type === 'MoneyWithdrawn') {
      this.balance -= (event as MoneyWithdrawnEvent).amount;
    }
  }

  // Rebuild state from events
  rehydrate(): void {
    console.log(`\n[Account] Rehydrating ${this.id}...`);
    const events = this.eventStore.getEvents(this.id);
    events.forEach(event => this.apply(event));
    console.log(`[Account] Balance after rehydration: $${this.balance}`);
  }

  getBalance(): number {
    return this.balance;
  }
}

// Demo
console.log('='.repeat(60));
console.log('EVENT SOURCING - Bank Account');
console.log('='.repeat(60));

const eventStore = new EventStore();
const account = new BankAccount('acc_001', eventStore);

account.create(1000);
account.deposit(500);
account.withdraw(200);

console.log(`\nCurrent balance: $${account.getBalance()}`);

// Recreate account from events
const account2 = new BankAccount('acc_001', eventStore);
account2.rehydrate();

/**
 * PREGUNTAS:
 * 1. ¿Event Sourcing vs traditional CRUD?
 * 2. ¿Snapshots for performance?
 * 3. ¿Event versioning?
 * 4. ¿Eventual consistency?
 * 5. ¿Event Sourcing + CQRS?
 * 6. ¿Event replay for testing?
 * 7. ¿Event Store databases (EventStore, Kafka)?
 * 8. ¿Event Sourcing drawbacks?
 */

export { EventStore, BankAccount };
