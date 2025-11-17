/**
 * LAZY LOADING PATTERN
 * Defer initialization until needed
 *
 * Big Tech: Module loading, code splitting, performance optimization
 */

class LazyInvoiceRepository {
  private _connection: any = null;

  private get connection() {
    if (!this._connection) {
      console.log('[Lazy] Initializing database connection...');
      this._connection = { connected: true };
    }
    return this._connection;
  }

  findById(id: string) {
    console.log(`[Repo] Using connection:`, this.connection);
    return { id, amount: 1000 };
  }
}

// Lazy module loading
async function loadPaymentModule() {
  console.log('[Lazy] Loading payment module...');
  // Simulate dynamic import
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    processPayment: (amount: number) => `Processed $${amount}`
  };
}

// Demo
console.log('='.repeat(60));
console.log('LAZY LOADING');
console.log('='.repeat(60));

(async () => {
  const repo = new LazyInvoiceRepository();
  console.log('Repository created (connection not initialized yet)');

  console.log('\nAccessing repository...');
  repo.findById('inv_1');

  console.log('\n--- Dynamic Import ---');
  const paymentModule = await loadPaymentModule();
  console.log(paymentModule.processPayment(100));
})();

/**
 * PREGUNTAS:
 * 1. ¿Lazy loading vs eager loading?
 * 2. ¿Dynamic imports in TypeScript?
 * 3. ¿Code splitting strategies?
 * 4. ¿Lazy loading with React.lazy()?
 * 5. ¿Performance benefits?
 * 6. ¿Lazy loading in Angular/Vue?
 * 7. ¿Thread safety with lazy init?
 * 8. ¿Lazy loading images/assets?
 */

export { LazyInvoiceRepository };
