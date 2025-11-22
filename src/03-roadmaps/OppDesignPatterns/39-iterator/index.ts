/**
 * ITERATOR PATTERN
 * Provee una manera de acceder secuencialmente a elementos de una colección
 * sin exponer su representación interna.
 *
 * Big Tech: Database cursors, Pagination, Streaming data (AWS Kinesis)
 */

// Iterator interface
interface Iterator<T> {
  hasNext(): boolean;
  next(): T | null;
  current(): T | null;
}

// Aggregate interface
interface IterableCollection<T> {
  createIterator(): Iterator<T>;
}

// Invoice entity
interface Invoice {
  id: string;
  amount: number;
  customerId: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: Date;
}

// Concrete Iterator: Invoice Iterator
class InvoiceIterator implements Iterator<Invoice> {
  private position = 0;

  constructor(private invoices: Invoice[]) {}

  hasNext(): boolean {
    return this.position < this.invoices.length;
  }

  next(): Invoice | null {
    if (this.hasNext()) {
      return this.invoices[this.position++];
    }
    return null;
  }

  current(): Invoice | null {
    return this.position > 0 ? this.invoices[this.position - 1] : null;
  }

  reset(): void {
    this.position = 0;
  }
}

// Filtering Iterator (decorator)
class FilteredInvoiceIterator implements Iterator<Invoice> {
  private position = 0;
  private filtered: Invoice[] = [];

  constructor(
    invoices: Invoice[],
    private predicate: (invoice: Invoice) => boolean
  ) {
    this.filtered = invoices.filter(predicate);
  }

  hasNext(): boolean {
    return this.position < this.filtered.length;
  }

  next(): Invoice | null {
    if (this.hasNext()) {
      return this.filtered[this.position++];
    }
    return null;
  }

  current(): Invoice | null {
    return this.position > 0 ? this.filtered[this.position - 1] : null;
  }
}

// Concrete Aggregate: Invoice Collection
class InvoiceCollection implements IterableCollection<Invoice> {
  private invoices: Invoice[] = [];

  addInvoice(invoice: Invoice): void {
    this.invoices.push(invoice);
  }

  createIterator(): Iterator<Invoice> {
    return new InvoiceIterator(this.invoices);
  }

  // Specialized iterators
  createOverdueIterator(): Iterator<Invoice> {
    return new FilteredInvoiceIterator(
      this.invoices,
      (inv) => inv.status === 'overdue'
    );
  }

  createPaidIterator(): Iterator<Invoice> {
    return new FilteredInvoiceIterator(
      this.invoices,
      (inv) => inv.status === 'paid'
    );
  }

  createByCustomerIterator(customerId: string): Iterator<Invoice> {
    return new FilteredInvoiceIterator(
      this.invoices,
      (inv) => inv.customerId === customerId
    );
  }

  getCount(): number {
    return this.invoices.length;
  }
}

// Demo
console.log('='.repeat(60));
console.log('ITERATOR PATTERN - Invoice Collection');
console.log('='.repeat(60));

const collection = new InvoiceCollection();

// Add invoices
collection.addInvoice({
  id: 'INV-001',
  amount: 1000,
  customerId: 'CUS-A',
  status: 'paid',
  dueDate: new Date('2025-01-01')
});

collection.addInvoice({
  id: 'INV-002',
  amount: 1500,
  customerId: 'CUS-B',
  status: 'overdue',
  dueDate: new Date('2024-12-01')
});

collection.addInvoice({
  id: 'INV-003',
  amount: 2000,
  customerId: 'CUS-A',
  status: 'sent',
  dueDate: new Date('2025-02-01')
});

collection.addInvoice({
  id: 'INV-004',
  amount: 500,
  customerId: 'CUS-C',
  status: 'overdue',
  dueDate: new Date('2024-11-15')
});

console.log(`\nTotal invoices: ${collection.getCount()}`);

// Iterate all
console.log('\n--- All Invoices ---');
const allIterator = collection.createIterator();
while (allIterator.hasNext()) {
  const inv = allIterator.next()!;
  console.log(`${inv.id}: $${inv.amount} | ${inv.status} | ${inv.customerId}`);
}

// Iterate overdue only
console.log('\n--- Overdue Invoices ---');
const overdueIterator = collection.createOverdueIterator();
let overdueTotal = 0;
while (overdueIterator.hasNext()) {
  const inv = overdueIterator.next()!;
  console.log(`${inv.id}: $${inv.amount} (due: ${inv.dueDate.toDateString()})`);
  overdueTotal += inv.amount;
}
console.log(`Total overdue: $${overdueTotal}`);

// Iterate by customer
console.log('\n--- Customer CUS-A Invoices ---');
const customerIterator = collection.createByCustomerIterator('CUS-A');
while (customerIterator.hasNext()) {
  const inv = customerIterator.next()!;
  console.log(`${inv.id}: $${inv.amount} | ${inv.status}`);
}

/**
 * Real-world: Paginated API Iterator
 */
console.log('\n\n' + '='.repeat(60));
console.log('REAL-WORLD: Paginated Transaction Iterator (Stripe-like)');
console.log('='.repeat(60));

interface Transaction {
  id: string;
  amount: number;
  created: number;
}

// Simulated API
class TransactionAPI {
  private allTransactions: Transaction[] = [];

  constructor() {
    // Generate mock data
    for (let i = 1; i <= 100; i++) {
      this.allTransactions.push({
        id: `txn_${i}`,
        amount: Math.random() * 1000,
        created: Date.now() - i * 1000
      });
    }
  }

  // Paginated API call
  async fetchPage(limit: number, startingAfter?: string): Promise<{
    data: Transaction[];
    hasMore: boolean;
  }> {
    console.log(`  [API] Fetching ${limit} transactions (after: ${startingAfter || 'start'})...`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));

    let startIndex = 0;
    if (startingAfter) {
      startIndex = this.allTransactions.findIndex(t => t.id === startingAfter) + 1;
    }

    const data = this.allTransactions.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < this.allTransactions.length;

    return { data, hasMore };
  }
}

// Paginated Iterator
class PaginatedTransactionIterator implements Iterator<Transaction> {
  private currentPage: Transaction[] = [];
  private currentIndex = 0;
  private hasMorePages = true;
  private lastId: string | undefined;

  constructor(private api: TransactionAPI, private pageSize: number = 10) {}

  async hasNext(): Promise<boolean> {
    // If current page has items, return true
    if (this.currentIndex < this.currentPage.length) {
      return true;
    }

    // If no more pages, return false
    if (!this.hasMorePages) {
      return false;
    }

    // Fetch next page
    const result = await this.api.fetchPage(this.pageSize, this.lastId);
    this.currentPage = result.data;
    this.currentIndex = 0;
    this.hasMorePages = result.hasMore;

    if (this.currentPage.length > 0) {
      this.lastId = this.currentPage[this.currentPage.length - 1].id;
    }

    return this.currentPage.length > 0;
  }

  next(): Transaction | null {
    if (this.currentIndex < this.currentPage.length) {
      return this.currentPage[this.currentIndex++];
    }
    return null;
  }

  current(): Transaction | null {
    return this.currentIndex > 0 ? this.currentPage[this.currentIndex - 1] : null;
  }
}

// Usage
(async () => {
  const api = new TransactionAPI();
  const iterator = new PaginatedTransactionIterator(api, 25);

  console.log('\nIterating through paginated transactions...\n');

  let count = 0;
  let total = 0;

  while (await iterator.hasNext()) {
    const txn = iterator.next()!;
    count++;
    total += txn.amount;

    if (count <= 5 || count > 95) {
      console.log(`${count}. ${txn.id}: $${txn.amount.toFixed(2)}`);
    } else if (count === 6) {
      console.log('... (transactions 6-95 omitted) ...');
    }
  }

  console.log(`\nProcessed ${count} transactions`);
  console.log(`Total amount: $${total.toFixed(2)}`);
})();

/**
 * PREGUNTAS:
 * 1. ¿Iterator pattern vs JavaScript built-in iterators?
 * 2. ¿External vs Internal iterators?
 * 3. ¿Lazy evaluation con iterators?
 * 4. ¿Cómo databases usan cursors (iterators)?
 * 5. ¿Iterator invalidation problem?
 * 6. ¿Async iterators en TypeScript?
 * 7. ¿Generator functions vs Iterator pattern?
 * 8. ¿Performance de iterator wrappers?
 */

export { Iterator, InvoiceCollection, InvoiceIterator };
