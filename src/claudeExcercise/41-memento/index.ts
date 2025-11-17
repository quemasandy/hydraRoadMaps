/**
 * MEMENTO PATTERN
 * Captura y externaliza el estado interno de un objeto sin violar encapsulación,
 * permitiendo restaurar el objeto a ese estado más tarde.
 *
 * Big Tech: Undo/Redo, Auto-save (Google Docs), Database transactions, Version control
 */

// Memento: Immutable snapshot of state
class InvoiceMemento {
  constructor(
    private readonly state: {
      items: Array<{ description: string; amount: number }>;
      customerId: string;
      taxRate: number;
      notes: string;
      timestamp: Date;
    }
  ) {}

  getState() {
    return { ...this.state }; // Return copy
  }

  getTimestamp(): Date {
    return this.state.timestamp;
  }
}

// Originator: Creates and restores from mementos
class Invoice {
  private items: Array<{ description: string; amount: number }> = [];
  private customerId: string = '';
  private taxRate: number = 0.10;
  private notes: string = '';

  setCustomer(id: string): void {
    this.customerId = id;
    console.log(`[Invoice] Customer set: ${id}`);
  }

  addItem(description: string, amount: number): void {
    this.items.push({ description, amount });
    console.log(`[Invoice] Item added: ${description} ($${amount})`);
  }

  removeLastItem(): void {
    const removed = this.items.pop();
    if (removed) {
      console.log(`[Invoice] Removed: ${removed.description}`);
    }
  }

  setTaxRate(rate: number): void {
    this.taxRate = rate;
    console.log(`[Invoice] Tax rate set: ${rate * 100}%`);
  }

  setNotes(notes: string): void {
    this.notes = notes;
    console.log(`[Invoice] Notes updated`);
  }

  // Create memento (snapshot)
  save(): InvoiceMemento {
    console.log(`[Invoice] 💾 Saving state...`);
    return new InvoiceMemento({
      items: [...this.items], // Deep copy
      customerId: this.customerId,
      taxRate: this.taxRate,
      notes: this.notes,
      timestamp: new Date()
    });
  }

  // Restore from memento
  restore(memento: InvoiceMemento): void {
    const state = memento.getState();
    this.items = [...state.items];
    this.customerId = state.customerId;
    this.taxRate = state.taxRate;
    this.notes = state.notes;

    console.log(`[Invoice] ⏪ Restored to state from ${memento.getTimestamp().toISOString()}`);
  }

  getTotal(): number {
    const subtotal = this.items.reduce((sum, item) => sum + item.amount, 0);
    return subtotal * (1 + this.taxRate);
  }

  print(): void {
    console.log('\n--- Invoice ---');
    console.log(`Customer: ${this.customerId || '(not set)'}`);
    console.log('Items:');
    this.items.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.description}: $${item.amount}`);
    });
    console.log(`Tax Rate: ${this.taxRate * 100}%`);
    console.log(`Total: $${this.getTotal().toFixed(2)}`);
    console.log(`Notes: ${this.notes || '(none)'}`);
    console.log('---\n');
  }
}

// Caretaker: Manages mementos (history)
class InvoiceHistory {
  private history: InvoiceMemento[] = [];
  private currentIndex = -1;

  save(memento: InvoiceMemento): void {
    // Remove any states after current index (for redo)
    this.history = this.history.slice(0, this.currentIndex + 1);

    this.history.push(memento);
    this.currentIndex++;

    console.log(`[History] State saved (${this.history.length} total)`);
  }

  undo(): InvoiceMemento | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      console.log(`[History] Undo (position ${this.currentIndex + 1}/${this.history.length})`);
      return this.history[this.currentIndex];
    }

    console.log(`[History] Nothing to undo`);
    return null;
  }

  redo(): InvoiceMemento | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      console.log(`[History] Redo (position ${this.currentIndex + 1}/${this.history.length})`);
      return this.history[this.currentIndex];
    }

    console.log(`[History] Nothing to redo`);
    return null;
  }

  showHistory(): void {
    console.log('\n--- History ---');
    this.history.forEach((memento, i) => {
      const marker = i === this.currentIndex ? '→' : ' ';
      console.log(`${marker} ${i + 1}. ${memento.getTimestamp().toLocaleTimeString()}`);
    });
    console.log();
  }
}

// Demo
console.log('='.repeat(60));
console.log('MEMENTO PATTERN - Invoice Draft with Undo/Redo');
console.log('='.repeat(60));

const invoice = new Invoice();
const history = new InvoiceHistory();

// Initial state
console.log('\n--- Step 1: Set Customer ---');
invoice.setCustomer('CUS-001');
history.save(invoice.save());

// Add items
console.log('\n--- Step 2: Add Items ---');
invoice.addItem('Web Development', 2000);
history.save(invoice.save());

invoice.addItem('Hosting', 100);
history.save(invoice.save());

invoice.addItem('Support', 500);
history.save(invoice.save());

invoice.print();

// Undo last item
console.log('--- Undo Last Action ---');
const previousState = history.undo();
if (previousState) {
  invoice.restore(previousState);
}
invoice.print();

// Undo again
console.log('--- Undo Again ---');
const state2 = history.undo();
if (state2) {
  invoice.restore(state2);
}
invoice.print();

// Redo
console.log('--- Redo ---');
const redoState = history.redo();
if (redoState) {
  invoice.restore(redoState);
}
invoice.print();

// Show history
history.showHistory();

/**
 * Real-world: Shopping Cart Auto-Save
 */
console.log('\n' + '='.repeat(60));
console.log('REAL-WORLD: Shopping Cart Auto-Save (Amazon-like)');
console.log('='.repeat(60));

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

class CartMemento {
  constructor(private readonly items: CartItem[], private readonly timestamp: Date) {}

  getItems(): CartItem[] {
    return [...this.items];
  }

  getTimestamp(): Date {
    return this.timestamp;
  }
}

class ShoppingCart {
  private items: CartItem[] = [];

  addItem(productId: string, quantity: number, price: number): void {
    const existing = this.items.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
      console.log(`[Cart] Updated ${productId}: ${existing.quantity} items`);
    } else {
      this.items.push({ productId, quantity, price });
      console.log(`[Cart] Added ${productId}: ${quantity} items`);
    }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.productId !== productId);
    console.log(`[Cart] Removed ${productId}`);
  }

  save(): CartMemento {
    console.log(`[Cart] 💾 Auto-saving...`);
    return new CartMemento([...this.items], new Date());
  }

  restore(memento: CartMemento): void {
    this.items = memento.getItems();
    console.log(`[Cart] Restored cart from ${memento.getTimestamp().toLocaleTimeString()}`);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  print(): void {
    console.log('\n--- Shopping Cart ---');
    if (this.isEmpty()) {
      console.log('(empty)');
    } else {
      this.items.forEach(item => {
        console.log(`${item.productId} x${item.quantity} = $${item.price * item.quantity}`);
      });
      console.log(`Total: $${this.getTotal()}`);
    }
    console.log();
  }
}

// Auto-save mechanism
class CartAutoSave {
  private savedState: CartMemento | null = null;

  autoSave(cart: ShoppingCart): void {
    this.savedState = cart.save();
  }

  restoreLastSession(cart: ShoppingCart): boolean {
    if (this.savedState) {
      console.log('[AutoSave] Found saved cart from previous session');
      cart.restore(this.savedState);
      return true;
    }
    console.log('[AutoSave] No saved cart found');
    return false;
  }
}

// Simulate user session
console.log('\n--- Session 1: User adds items ---');
const cart = new ShoppingCart();
const autoSave = new CartAutoSave();

cart.addItem('laptop', 1, 1200);
autoSave.autoSave(cart);

cart.addItem('mouse', 2, 25);
autoSave.autoSave(cart);

cart.print();

console.log('--- Session 1 ends (user closes browser) ---');

// New session - restore cart
console.log('\n--- Session 2: User returns ---');
const newCart = new ShoppingCart();
autoSave.restoreLastSession(newCart);
newCart.print();

/**
 * PREGUNTAS:
 * 1. ¿Memento vs Serialization?
 * 2. ¿Cómo implementar memento con large objects?
 * 3. ¿Memento + Command pattern para undo?
 * 4. ¿Shallow vs deep copy en mementos?
 * 5. ¿Memory management con muchos mementos?
 * 6. ¿Memento pattern en Redux/Vuex time-travel?
 * 7. ¿Incremental snapshots vs full snapshots?
 * 8. ¿Cómo Google Docs implementa version history?
 */

export { Invoice, InvoiceMemento, InvoiceHistory };
