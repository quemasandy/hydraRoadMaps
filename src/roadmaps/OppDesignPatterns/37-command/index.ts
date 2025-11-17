/**
 * COMMAND PATTERN
 * Encapsula un request como un objeto, permitiendo parametrizar clientes con diferentes
 * requests, hacer queue/log de requests, y soportar operaciones undo.
 *
 * Big Tech: Task queues (AWS SQS, Celery), Transaction logs, Undo/Redo systems
 */

// Command interface
interface Command {
  execute(): Promise<void>;
  undo(): Promise<void>;
  getDescription(): string;
}

// Receiver: Account (manages balance)
class Account {
  constructor(private id: string, private balance: number = 0) {}

  deposit(amount: number): void {
    this.balance += amount;
    console.log(`  [Account ${this.id}] Deposited $${amount} | Balance: $${this.balance}`);
  }

  withdraw(amount: number): boolean {
    if (this.balance >= amount) {
      this.balance -= amount;
      console.log(`  [Account ${this.id}] Withdrew $${amount} | Balance: $${this.balance}`);
      return true;
    }
    console.log(`  [Account ${this.id}] Insufficient funds (balance: $${this.balance})`);
    return false;
  }

  getBalance(): number {
    return this.balance;
  }

  getId(): string {
    return this.id;
  }
}

// Concrete Commands

// 1. Deposit Command
class DepositCommand implements Command {
  constructor(private account: Account, private amount: number) {}

  async execute(): Promise<void> {
    console.log(`[DepositCmd] Executing: Deposit $${this.amount} to ${this.account.getId()}`);
    this.account.deposit(this.amount);
  }

  async undo(): Promise<void> {
    console.log(`[DepositCmd] Undoing: Withdraw $${this.amount} from ${this.account.getId()}`);
    this.account.withdraw(this.amount);
  }

  getDescription(): string {
    return `Deposit $${this.amount} to account ${this.account.getId()}`;
  }
}

// 2. Withdraw Command
class WithdrawCommand implements Command {
  private executed = false;

  constructor(private account: Account, private amount: number) {}

  async execute(): Promise<void> {
    console.log(`[WithdrawCmd] Executing: Withdraw $${this.amount} from ${this.account.getId()}`);
    this.executed = this.account.withdraw(this.amount);
  }

  async undo(): Promise<void> {
    if (this.executed) {
      console.log(`[WithdrawCmd] Undoing: Deposit $${this.amount} to ${this.account.getId()}`);
      this.account.deposit(this.amount);
    } else {
      console.log(`[WithdrawCmd] Cannot undo - command never executed successfully`);
    }
  }

  getDescription(): string {
    return `Withdraw $${this.amount} from account ${this.account.getId()}`;
  }
}

// 3. Transfer Command (Composite Command)
class TransferCommand implements Command {
  private withdrawCmd: WithdrawCommand;
  private depositCmd: DepositCommand;

  constructor(from: Account, to: Account, amount: number) {
    this.withdrawCmd = new WithdrawCommand(from, amount);
    this.depositCmd = new DepositCommand(to, amount);
  }

  async execute(): Promise<void> {
    console.log(`[TransferCmd] Executing transfer...`);
    await this.withdrawCmd.execute();
    await this.depositCmd.execute();
  }

  async undo(): Promise<void> {
    console.log(`[TransferCmd] Undoing transfer...`);
    await this.depositCmd.undo();
    await this.withdrawCmd.undo();
  }

  getDescription(): string {
    return `Transfer between accounts`;
  }
}

// Invoker: Transaction Manager (executes and tracks commands)
class TransactionManager {
  private history: Command[] = [];
  private currentIndex = -1;

  async executeCommand(command: Command): Promise<void> {
    console.log(`\n[Manager] Executing: ${command.getDescription()}`);

    await command.execute();

    // Remove any commands after current position (for redo)
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Add to history
    this.history.push(command);
    this.currentIndex++;

    console.log(`[Manager] ✓ Command executed (${this.history.length} in history)`);
  }

  async undo(): Promise<void> {
    if (this.currentIndex < 0) {
      console.log(`\n[Manager] Nothing to undo`);
      return;
    }

    const command = this.history[this.currentIndex];
    console.log(`\n[Manager] Undoing: ${command.getDescription()}`);

    await command.undo();
    this.currentIndex--;

    console.log(`[Manager] ✓ Undo completed`);
  }

  async redo(): Promise<void> {
    if (this.currentIndex >= this.history.length - 1) {
      console.log(`\n[Manager] Nothing to redo`);
      return;
    }

    this.currentIndex++;
    const command = this.history[this.currentIndex];

    console.log(`\n[Manager] Redoing: ${command.getDescription()}`);
    await command.execute();

    console.log(`[Manager] ✓ Redo completed`);
  }

  getHistory(): string[] {
    return this.history.map((cmd, i) => {
      const marker = i === this.currentIndex ? '→' : ' ';
      return `${marker} ${i + 1}. ${cmd.getDescription()}`;
    });
  }
}

// Demo
async function demo() {
  console.log('='.repeat(60));
  console.log('COMMAND PATTERN - Banking Transactions');
  console.log('='.repeat(60));

  const account1 = new Account('ACC001', 1000);
  const account2 = new Account('ACC002', 500);

  const manager = new TransactionManager();

  // Execute commands
  await manager.executeCommand(new DepositCommand(account1, 200));
  await manager.executeCommand(new WithdrawCommand(account1, 150));
  await manager.executeCommand(new TransferCommand(account1, account2, 300));

  console.log(`\n--- Current Balances ---`);
  console.log(`Account 1: $${account1.getBalance()}`);
  console.log(`Account 2: $${account2.getBalance()}`);

  // Undo last command
  await manager.undo();

  console.log(`\n--- After Undo ---`);
  console.log(`Account 1: $${account1.getBalance()}`);
  console.log(`Account 2: $${account2.getBalance()}`);

  // Redo
  await manager.redo();

  console.log(`\n--- After Redo ---`);
  console.log(`Account 1: $${account1.getBalance()}`);
  console.log(`Account 2: $${account2.getBalance()}`);

  // Show history
  console.log(`\n--- Transaction History ---`);
  manager.getHistory().forEach(h => console.log(h));
}

demo();

/**
 * Real-world: Payment Queue System
 */
console.log('\n\n' + '='.repeat(60));
console.log('REAL-WORLD: Batch Payment Queue (AWS SQS-like)');
console.log('='.repeat(60));

interface PaymentCommand {
  execute(): Promise<boolean>;
  getId(): string;
}

class ProcessPaymentCommand implements PaymentCommand {
  constructor(private paymentId: string, private amount: number) {}

  async execute(): Promise<boolean> {
    console.log(`  [Payment] Processing ${this.paymentId} for $${this.amount}...`);
    await new Promise(resolve => setTimeout(resolve, 50));
    return Math.random() > 0.2; // 80% success rate
  }

  getId(): string {
    return this.paymentId;
  }
}

class SendInvoiceCommand implements PaymentCommand {
  constructor(private invoiceId: string, private email: string) {}

  async execute(): Promise<boolean> {
    console.log(`  [Invoice] Sending ${this.invoiceId} to ${this.email}...`);
    await new Promise(resolve => setTimeout(resolve, 30));
    return true;
  }

  getId(): string {
    return this.invoiceId;
  }
}

// Queue system
class PaymentQueue {
  private queue: PaymentCommand[] = [];
  private processing = false;

  enqueue(command: PaymentCommand): void {
    this.queue.push(command);
    console.log(`[Queue] Added ${command.getId()} (${this.queue.length} in queue)`);
  }

  async processQueue(): Promise<void> {
    if (this.processing) {
      console.log(`[Queue] Already processing...`);
      return;
    }

    this.processing = true;
    console.log(`\n[Queue] Processing ${this.queue.length} commands...`);

    while (this.queue.length > 0) {
      const command = this.queue.shift()!;
      const success = await command.execute();

      if (!success) {
        console.log(`  ❌ Command failed: ${command.getId()} - re-queuing`);
        this.queue.push(command); // Retry
      } else {
        console.log(`  ✓ Command completed: ${command.getId()}`);
      }
    }

    console.log(`[Queue] All commands processed\n`);
    this.processing = false;
  }
}

(async () => {
  const queue = new PaymentQueue();

  // Add batch payments
  queue.enqueue(new ProcessPaymentCommand('pay_001', 99.99));
  queue.enqueue(new ProcessPaymentCommand('pay_002', 149.50));
  queue.enqueue(new SendInvoiceCommand('inv_001', 'customer@example.com'));
  queue.enqueue(new ProcessPaymentCommand('pay_003', 299.00));

  await queue.processQueue();
})();

/**
 * PREGUNTAS:
 * 1. ¿Command vs Strategy pattern?
 * 2. ¿Cómo implementar multi-level undo?
 * 3. ¿Command pattern en event sourcing?
 * 4. ¿Macro commands (composite commands)?
 * 5. ¿Command serialization para persistent queue?
 * 6. ¿Command pattern para API request caching?
 * 7. ¿Testing commands independently?
 * 8. ¿Cómo AWS SQS/Celery usan Command pattern?
 */

export { Command, TransactionManager, Account };
