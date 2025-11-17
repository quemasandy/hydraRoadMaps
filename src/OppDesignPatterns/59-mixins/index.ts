/**
 * MIXIN PATTERN
 * Compose functionality from multiple sources
 *
 * Big Tech: Code reuse, cross-cutting concerns, trait-like behavior
 */

// Mixin function
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt = new Date();

    getTimestamp() {
      return this.createdAt.toISOString();
    }
  };
}

function Auditable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private changes: string[] = [];

    logChange(description: string) {
      this.changes.push(`${new Date().toISOString()}: ${description}`);
    }

    getAuditLog() {
      return this.changes;
    }
  };
}

// Base class
class Invoice {
  constructor(public id: string, public amount: number) {}
}

// Compose mixins
const AuditedInvoice = Auditable(Timestamped(Invoice));

// Demo
console.log('='.repeat(60));
console.log('MIXIN PATTERN - Invoice with Mixins');
console.log('='.repeat(60));

const invoice = new AuditedInvoice('inv_1', 1000);
invoice.logChange('Created');
invoice.logChange('Amount updated');

console.log('Created at:', invoice.getTimestamp());
console.log('Audit log:', invoice.getAuditLog());

/**
 * PREGUNTAS:
 * 1. ¿Mixins vs inheritance?
 * 2. ¿Mixins vs composition?
 * 3. ¿Diamond problem with mixins?
 * 4. ¿Type safety with mixins?
 * 5. ¿Mixin order matters?
 * 6. ¿Mixins in other languages (Ruby, Python)?
 * 7. ¿Decorators vs mixins?
 * 8. ¿Testing mixed-in behavior?
 */

export { Timestamped, Auditable };
