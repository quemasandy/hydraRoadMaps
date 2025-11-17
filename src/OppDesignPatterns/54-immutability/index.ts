/**
 * IMMUTABILITY PATTERNS
 * Readonly deep, Immer-style updates
 *
 * Big Tech: Redux, React state management, functional programming
 */

// Deep readonly type
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

interface Invoice {
  id: string;
  amount: number;
  items: Array<{ id: string; quantity: number }>;
}

// Immutable update helpers
class ImmutableHelper {
  static updateInvoiceAmount(invoice: Invoice, newAmount: number): Invoice {
    return { ...invoice, amount: newAmount };
  }

  static addItem(invoice: Invoice, item: { id: string; quantity: number }): Invoice {
    return { ...invoice, items: [...invoice.items, item] };
  }

  static updateItemQuantity(invoice: Invoice, itemId: string, quantity: number): Invoice {
    return {
      ...invoice,
      items: invoice.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    };
  }
}

// Demo
console.log('='.repeat(60));
console.log('IMMUTABILITY PATTERNS');
console.log('='.repeat(60));

const original: Invoice = {
  id: 'inv_1',
  amount: 100,
  items: [{ id: 'item_1', quantity: 2 }]
};

const updated = ImmutableHelper.addItem(original, { id: 'item_2', quantity: 1 });

console.log('Original:', original);
console.log('Updated:', updated);
console.log('Same reference?', original === updated);

/**
 * PREGUNTAS:
 * 1. ¿Immutability benefits?
 * 2. ¿Performance with large objects?
 * 3. ¿Structural sharing?
 * 4. ¿Immer library?
 * 5. ¿Readonly vs const?
 * 6. ¿Immutability in React?
 * 7. ¿Deep freeze?
 * 8. ¿Immutable.js vs native?
 */

export { ImmutableHelper };
