/**
 * ==========================================
 * BUILDER PATTERN
 * (Patrón Creacional)
 * ==========================================
 *
 * 🔑 CONCEPTO FUNDAMENTAL:
 *
 * Builder separa la CONSTRUCCIÓN de un objeto complejo
 * de su REPRESENTACIÓN, permitiendo crear diferentes representaciones
 * usando el mismo proceso de construcción.
 *
 * Características clave:
 * 1. **Construcción paso a paso**: Objeto se construye incrementalmente
 * 2. **Fluent interface**: Métodos retornan this para encadenar
 * 3. **Inmutabilidad**: Producto final es típicamente inmutable
 * 4. **Validación**: Validar antes de build()
 *
 * 📚 CUÁNDO USAR BUILDER:
 *
 * ✅ CASOS APROPIADOS:
 * - Objeto tiene muchos parámetros (>4)
 * - Muchos parámetros opcionales
 * - Construcción compleja con pasos específicos
 * - Quieres inmutabilidad en producto final
 * - Necesitas diferentes representaciones del mismo objeto
 *
 * 🏢 USO EN BIG TECH:
 *
 * **Stripe:**
 * - PaymentIntent.Builder: Construir payment intents con múltiples opciones
 * - Charge.Builder: Construir cargos con metadata, customer, etc.
 * - Subscription.Builder: Planes, add-ons, trials, etc.
 *
 * **AWS SDK:**
 * - Request builders: Construir requests S3, DynamoDB, etc.
 * - Fluent interface: .withBucket().withKey().build()
 *
 * **Hibernate/JPA:**
 * - CriteriaBuilder: Construir queries complejas
 * - QueryBuilder: Construir SQL queries programáticamente
 *
 * **HTTP Libraries:**
 * - Axios, Fetch: Request builders
 * - HttpClient.get().headers().params().send()
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - **Legibilidad**: Código auto-documentado
 * - **Flexibilidad**: Fácil agregar parámetros opcionales
 * - **Inmutabilidad**: Producto final no se puede modificar
 * - **Validación**: Validar en build() antes de crear
 */

// ==========================================
// SECCIÓN 1: PROBLEMA SIN BUILDER
// Constructor con muchos parámetros
// ==========================================

/**
 * ⚠️ PROBLEMA: Constructor telescópico
 */

class Payment_Bad {
  constructor(
    public amount: number,
    public currency: string,
    public customer?: string,
    public description?: string,
    public metadata?: Record<string, string>,
    public capture?: boolean,
    public statementDescriptor?: string,
    public receiptEmail?: string
  ) {}
}

// ⚠️ Uso confuso
function badUsage() {
  // ❌ ¿Qué significa cada parámetro?
  const payment1 = new Payment_Bad(
    5000,
    'USD',
    'cus_123',
    'Payment for invoice',
    { orderId: '123' },
    true,
    'ACME CORP',
    'user@example.com'
  );

  // ❌ Para omitir parámetros necesitas pasar undefined
  const payment2 = new Payment_Bad(
    5000,
    'USD',
    undefined,
    undefined,
    undefined,
    undefined,
    'ACME CORP' // Solo quiero statement descriptor
  );

  // ⚠️ PROBLEMAS:
  // - Difícil de leer
  // - Propenso a errores
  // - Difícil agregar nuevos parámetros
}

// ==========================================
// SECCIÓN 2: BUILDER PATTERN - IMPLEMENTACIÓN BÁSICA
// Construcción fluida y clara
// ==========================================

/**
 * ✅ SOLUCIÓN: Builder Pattern con Fluent Interface
 */

// Producto final (inmutable)
class Payment {
  // Campos readonly
  public readonly amount: number;
  public readonly currency: string;
  public readonly customer?: string;
  public readonly description?: string;
  public readonly metadata?: Record<string, string>;
  public readonly capture: boolean;
  public readonly statementDescriptor?: string;
  public readonly receiptEmail?: string;

  // Constructor privado (solo Builder puede crear)
  private constructor(builder: PaymentBuilder) {
    this.amount = builder.amount!;
    this.currency = builder.currency!;
    this.customer = builder.customer;
    this.description = builder.description;
    this.metadata = builder.metadata;
    this.capture = builder.capture ?? true;
    this.statementDescriptor = builder.statementDescriptor;
    this.receiptEmail = builder.receiptEmail;
  }

  // Método estático para obtener builder
  public static builder(): PaymentBuilder {
    return new PaymentBuilder();
  }
}

// Builder
class PaymentBuilder {
  public amount?: number;
  public currency?: string;
  public customer?: string;
  public description?: string;
  public metadata?: Record<string, string>;
  public capture?: boolean;
  public statementDescriptor?: string;
  public receiptEmail?: string;

  // ✅ Métodos fluidos (retornan this)
  setAmount(amount: number): this {
    this.amount = amount;
    return this;
  }

  setCurrency(currency: string): this {
    this.currency = currency;
    return this;
  }

  setCustomer(customer: string): this {
    this.customer = customer;
    return this;
  }

  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  setMetadata(metadata: Record<string, string>): this {
    this.metadata = metadata;
    return this;
  }

  setCapture(capture: boolean): this {
    this.capture = capture;
    return this;
  }

  setStatementDescriptor(descriptor: string): this {
    this.statementDescriptor = descriptor;
    return this;
  }

  setReceiptEmail(email: string): this {
    this.receiptEmail = email;
    return this;
  }

  // ✅ Validación antes de build
  build(): Payment {
    // Validar campos requeridos
    if (!this.amount || this.amount <= 0) {
      throw new Error('Amount is required and must be positive');
    }

    if (!this.currency) {
      throw new Error('Currency is required');
    }

    // Crear producto inmutable
    return new Payment(this);
  }
}

// ✅ Uso claro y legible
function goodUsage() {
  // ✅ Claro y auto-documentado
  const payment1 = Payment.builder()
    .setAmount(5000)
    .setCurrency('USD')
    .setCustomer('cus_123')
    .setDescription('Payment for invoice')
    .setMetadata({ orderId: '123' })
    .setCapture(true)
    .setStatementDescriptor('ACME CORP')
    .setReceiptEmail('user@example.com')
    .build();

  // ✅ Solo especificar lo necesario
  const payment2 = Payment.builder()
    .setAmount(5000)
    .setCurrency('USD')
    .setStatementDescriptor('ACME CORP')
    .build();

  console.log('Payment 1:', payment1);
  console.log('Payment 2:', payment2);
}

// ==========================================
// SECCIÓN 3: BUILDER PARA INVOICE
// Caso de uso real con validaciones complejas
// ==========================================

/**
 * 💰 CASO REAL: Invoice Builder
 * Construir facturas complejas paso a paso
 */

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

class Invoice {
  public readonly invoiceNumber: string;
  public readonly customer: string;
  public readonly items: ReadonlyArray<InvoiceItem>;
  public readonly taxRate: number;
  public readonly discount: number;
  public readonly dueDate: Date;
  public readonly notes?: string;

  private constructor(builder: InvoiceBuilder) {
    this.invoiceNumber = builder.invoiceNumber!;
    this.customer = builder.customer!;
    this.items = [...builder.items];
    this.taxRate = builder.taxRate ?? 0;
    this.discount = builder.discount ?? 0;
    this.dueDate = builder.dueDate!;
    this.notes = builder.notes;
  }

  // Métodos calculados
  public getSubtotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
  }

  public getTax(): number {
    return this.getSubtotal() * this.taxRate;
  }

  public getTotal(): number {
    return this.getSubtotal() + this.getTax() - this.discount;
  }

  public static builder(): InvoiceBuilder {
    return new InvoiceBuilder();
  }
}

class InvoiceBuilder {
  public invoiceNumber?: string;
  public customer?: string;
  public items: InvoiceItem[] = [];
  public taxRate?: number;
  public discount?: number;
  public dueDate?: Date;
  public notes?: string;

  setInvoiceNumber(number: string): this {
    this.invoiceNumber = number;
    return this;
  }

  setCustomer(customer: string): this {
    this.customer = customer;
    return this;
  }

  addItem(item: InvoiceItem): this {
    this.items.push(item);
    return this;
  }

  // ✅ Helper method para agregar items más fácilmente
  addItemSimple(
    description: string,
    quantity: number,
    unitPrice: number,
    taxRate: number = 0
  ): this {
    return this.addItem({ description, quantity, unitPrice, taxRate });
  }

  setTaxRate(rate: number): this {
    this.taxRate = rate;
    return this;
  }

  setDiscount(discount: number): this {
    this.discount = discount;
    return this;
  }

  setDueDate(date: Date): this {
    this.dueDate = date;
    return this;
  }

  // ✅ Helper: due date in days from now
  setDueDays(days: number): this {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);
    this.dueDate = dueDate;
    return this;
  }

  setNotes(notes: string): this {
    this.notes = notes;
    return this;
  }

  build(): Invoice {
    // Validaciones
    if (!this.invoiceNumber) {
      throw new Error('Invoice number is required');
    }

    if (!this.customer) {
      throw new Error('Customer is required');
    }

    if (this.items.length === 0) {
      throw new Error('Invoice must have at least one item');
    }

    if (!this.dueDate) {
      throw new Error('Due date is required');
    }

    if (this.dueDate < new Date()) {
      throw new Error('Due date cannot be in the past');
    }

    return new Invoice(this);
  }
}

// Uso
function buildInvoice() {
  const invoice = Invoice.builder()
    .setInvoiceNumber('INV-001')
    .setCustomer('Acme Corporation')
    .addItemSimple('Pro Plan Subscription', 1, 99.99)
    .addItemSimple('Extra User Seats', 5, 10.00)
    .setTaxRate(0.08)
    .setDiscount(10)
    .setDueDays(30)
    .setNotes('Thank you for your business!')
    .build();

  console.log('Invoice:', invoice);
  console.log('Subtotal:', invoice.getSubtotal());
  console.log('Tax:', invoice.getTax());
  console.log('Total:', invoice.getTotal());
}

// ==========================================
// SECCIÓN 4: BUILDER CON DIRECTOR
// Director orquesta la construcción
// ==========================================

/**
 * ✅ Director: Encapsula proceso de construcción común
 */

interface QueryFilter {
  field: string;
  operator: string;
  value: any;
}

class DatabaseQuery {
  public readonly table: string;
  public readonly filters: QueryFilter[];
  public readonly orderBy?: string;
  public readonly limit?: number;
  public readonly offset?: number;

  private constructor(builder: QueryBuilder) {
    this.table = builder.table!;
    this.filters = [...builder.filters];
    this.orderBy = builder.orderBy;
    this.limit = builder.limit;
    this.offset = builder.offset;
  }

  public static builder(): QueryBuilder {
    return new QueryBuilder();
  }

  public toString(): string {
    let sql = `SELECT * FROM ${this.table}`;

    if (this.filters.length > 0) {
      const conditions = this.filters
        .map(f => `${f.field} ${f.operator} '${f.value}'`)
        .join(' AND ');
      sql += ` WHERE ${conditions}`;
    }

    if (this.orderBy) {
      sql += ` ORDER BY ${this.orderBy}`;
    }

    if (this.limit) {
      sql += ` LIMIT ${this.limit}`;
    }

    if (this.offset) {
      sql += ` OFFSET ${this.offset}`;
    }

    return sql;
  }
}

class QueryBuilder {
  public table?: string;
  public filters: QueryFilter[] = [];
  public orderBy?: string;
  public limit?: number;
  public offset?: number;

  setTable(table: string): this {
    this.table = table;
    return this;
  }

  addFilter(field: string, operator: string, value: any): this {
    this.filters.push({ field, operator, value });
    return this;
  }

  // Helper methods
  where(field: string, value: any): this {
    return this.addFilter(field, '=', value);
  }

  greaterThan(field: string, value: number): this {
    return this.addFilter(field, '>', value);
  }

  setOrderBy(field: string): this {
    this.orderBy = field;
    return this;
  }

  setLimit(limit: number): this {
    this.limit = limit;
    return this;
  }

  setOffset(offset: number): this {
    this.offset = offset;
    return this;
  }

  build(): DatabaseQuery {
    if (!this.table) {
      throw new Error('Table is required');
    }

    return new DatabaseQuery(this);
  }
}

// ✅ Director: Encapsula construcciones comunes
class QueryDirector {
  // Construir query para pagos recientes
  static buildRecentPayments(days: number): DatabaseQuery {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return DatabaseQuery.builder()
      .setTable('payments')
      .greaterThan('created_at', cutoffDate.getTime())
      .where('status', 'succeeded')
      .setOrderBy('created_at DESC')
      .setLimit(100)
      .build();
  }

  // Construir query para customer lookup
  static buildCustomerLookup(email: string): DatabaseQuery {
    return DatabaseQuery.builder()
      .setTable('customers')
      .where('email', email)
      .setLimit(1)
      .build();
  }

  // Construir query paginado
  static buildPaginatedQuery(
    table: string,
    page: number,
    pageSize: number
  ): DatabaseQuery {
    return DatabaseQuery.builder()
      .setTable(table)
      .setLimit(pageSize)
      .setOffset((page - 1) * pageSize)
      .build();
  }
}

// Uso con Director
function useDirector() {
  const recentPayments = QueryDirector.buildRecentPayments(7);
  console.log('Recent payments query:', recentPayments.toString());

  const customerLookup = QueryDirector.buildCustomerLookup('user@example.com');
  console.log('Customer lookup query:', customerLookup.toString());

  const paginated = QueryDirector.buildPaginatedQuery('subscriptions', 2, 50);
  console.log('Paginated query:', paginated.toString());
}

// ==========================================
// SECCIÓN 5: BUILDER CON METHOD CHAINING CONDICIONAL
// Construcción dinámica basada en condiciones
// ==========================================

/**
 * ✅ Builder con lógica condicional
 */

class HttpRequest {
  public readonly method: string;
  public readonly url: string;
  public readonly headers: Record<string, string>;
  public readonly body?: any;
  public readonly timeout?: number;

  private constructor(builder: HttpRequestBuilder) {
    this.method = builder.method!;
    this.url = builder.url!;
    this.headers = { ...builder.headers };
    this.body = builder.body;
    this.timeout = builder.timeout;
  }

  public static builder(): HttpRequestBuilder {
    return new HttpRequestBuilder();
  }
}

class HttpRequestBuilder {
  public method?: string;
  public url?: string;
  public headers: Record<string, string> = {};
  public body?: any;
  public timeout?: number;

  setMethod(method: string): this {
    this.method = method;
    return this;
  }

  setUrl(url: string): this {
    this.url = url;
    return this;
  }

  addHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  setBody(body: any): this {
    this.body = body;
    return this;
  }

  setTimeout(timeout: number): this {
    this.timeout = timeout;
    return this;
  }

  // ✅ Helper methods
  get(url: string): this {
    return this.setMethod('GET').setUrl(url);
  }

  post(url: string): this {
    return this.setMethod('POST').setUrl(url);
  }

  withAuth(token: string): this {
    return this.addHeader('Authorization', `Bearer ${token}`);
  }

  withJson(): this {
    return this.addHeader('Content-Type', 'application/json');
  }

  // ✅ Construcción condicional
  conditionally(
    condition: boolean,
    builderFn: (builder: this) => this
  ): this {
    return condition ? builderFn(this) : this;
  }

  build(): HttpRequest {
    if (!this.method) {
      throw new Error('Method is required');
    }

    if (!this.url) {
      throw new Error('URL is required');
    }

    return new HttpRequest(this);
  }
}

// Uso con construcción condicional
function buildHttpRequest(includeAuth: boolean) {
  const request = HttpRequest.builder()
    .post('https://api.stripe.com/v1/charges')
    .withJson()
    .conditionally(includeAuth, b => b.withAuth('sk_test_123'))
    .setBody({ amount: 5000, currency: 'usd' })
    .build();

  console.log('Request:', request);
}

// ==========================================
// SECCIÓN 6: MEJORES PRÁCTICAS
// ==========================================

/**
 * ✅ MEJORES PRÁCTICAS:
 *
 * 1. **Producto inmutable:**
 *    - Usar readonly en campos
 *    - Constructor privado
 *
 * 2. **Validación en build():**
 *    - Validar campos requeridos
 *    - Validar reglas de negocio
 *
 * 3. **Fluent interface:**
 *    - Métodos retornan this
 *    - Permite encadenar
 *
 * 4. **Helper methods:**
 *    - Métodos de conveniencia (.get(), .post())
 *    - Simplifica casos comunes
 *
 * 5. **Director cuando apropiado:**
 *    - Encapsula construcciones comunes
 *    - Evita duplicación
 */

/**
 * ⚠️ ERRORES COMUNES:
 *
 * 1. **Producto mutable:**
 *    - ❌ No usar readonly
 *    - Permite modificación después de build()
 *
 * 2. **No validar en build():**
 *    - Builder debe validar antes de crear producto
 *
 * 3. **Builder mutable después de build():**
 *    - Builder debe poder reusarse o lanzar error
 *
 * 4. **Demasiado complejo:**
 *    - Builder no debe tener lógica de negocio compleja
 *    - Solo construcción
 */

// ==========================================
// MAIN - DEMOSTRACIÓN
// ==========================================

console.log('='.repeat(50));
console.log('BUILDER PATTERN - DEMOSTRACIÓN');
console.log('='.repeat(50));

console.log('\n1. Payment Builder:');
goodUsage();

console.log('\n2. Invoice Builder:');
buildInvoice();

console.log('\n3. Query Director:');
useDirector();

console.log('\n4. HTTP Request Builder:');
buildHttpRequest(true);

console.log('\n✅ Beneficios del Builder:');
console.log('   - Código legible y auto-documentado');
console.log('   - Fácil agregar parámetros opcionales');
console.log('   - Validación antes de crear');
console.log('   - Producto inmutable');

// ==========================================
// PREGUNTAS PARA REFLEXIONAR
// ==========================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuándo preferirías Builder sobre constructor simple?
 *    Pista: Muchos parámetros (>4), muchos opcionales
 *
 * 2. ¿Por qué el producto final debe ser inmutable?
 *    Pista: Thread safety, predictibilidad
 *
 * 3. ¿Cuál es el rol del Director en Builder?
 *    Pista: Encapsula construcciones comunes
 *
 * 4. ¿Cómo se relaciona Builder con Fluent Interface?
 *    Pista: Builder usa fluent interface (return this)
 *
 * 5. ¿Stripe cómo usa Builder para PaymentIntent?
 *    Pista: Múltiples opciones, metadata, customer, etc.
 *
 * 6. ¿Builder siempre debe validar en build()?
 *    Pista: Sí, para asegurar objeto válido
 *
 * 7. ¿Cuál es el trade-off de usar Builder?
 *    Pista: Verbosidad vs claridad
 *
 * 8. ¿Cómo combinarías Builder con Factory?
 *    Pista: Factory retorna builder pre-configurado
 */

// ==========================================
// EJERCICIOS PRÁCTICOS
// ==========================================

/**
 * 📝 EJERCICIO 1 (BÁSICO): Email Builder
 *
 * Implementa builder para emails:
 * - from (requerido)
 * - to (requerido, puede ser array)
 * - cc, bcc (opcional, arrays)
 * - subject (requerido)
 * - body (requerido)
 * - attachments (opcional)
 * - priority (opcional: high, normal, low)
 *
 * Validar en build():
 * - Emails válidos
 * - Subject y body no vacíos
 * - Al menos un destinatario
 */

/**
 * 📝 EJERCICIO 2 (INTERMEDIO): Subscription Builder
 *
 * Implementa builder para suscripciones con:
 * - customer (requerido)
 * - plan (requerido)
 * - quantity (default: 1)
 * - trial_end (opcional)
 * - metadata (opcional)
 * - add-ons (array opcional)
 * - discount (opcional)
 * - payment_method (requerido)
 *
 * Features:
 * - Helper: withTrial(days)
 * - Helper: addAddon(name, price)
 * - Validar: plan existe, quantity > 0
 * - Calcular total con add-ons y descuento
 */

/**
 * 📝 EJERCICIO 3 (AVANZADO): SQL Query Builder
 *
 * Implementa builder completo para SQL:
 * - SELECT with multiple columns
 * - FROM with JOINs (INNER, LEFT, RIGHT)
 * - WHERE with AND/OR
 * - ORDER BY con ASC/DESC
 * - LIMIT y OFFSET
 * - GROUP BY y HAVING
 *
 * Debe generar SQL válido:
 * ```typescript
 * const query = QueryBuilder
 *   .select('orders.id', 'customers.name')
 *   .from('orders')
 *   .innerJoin('customers', 'orders.customer_id = customers.id')
 *   .where('orders.status', '=', 'paid')
 *   .orderBy('orders.created_at', 'DESC')
 *   .limit(10)
 *   .build()
 *   .toString();
 * ```
 */

/**
 * 📝 EJERCICIO 4 (EXPERTO): Payment Flow Builder
 *
 * Diseña builder para flujo de pago completo:
 *
 * Componentes:
 * - Payment method selection
 * - Billing information
 * - Shipping information (opcional)
 * - Items con quantity, price, tax
 * - Discount codes
 * - Gift cards
 * - Payment processing options (capture, 3DS, etc.)
 *
 * Features:
 * - Validación compleja (billing matches payment, shipping required, etc.)
 * - Cálculo de totales (subtotal, tax, shipping, discounts)
 * - Director para flujos comunes (one-time, subscription, invoice)
 * - Soporte para partial payments
 * - Webhooks y notifications configuration
 *
 * Inspiración: Stripe Checkout, Shopify checkout flow
 */

// ==========================================
// EXPORTS
// ==========================================

export {
  // Products
  Payment,
  Invoice,
  DatabaseQuery,
  HttpRequest,

  // Builders
  PaymentBuilder,
  InvoiceBuilder,
  QueryBuilder,
  HttpRequestBuilder,

  // Director
  QueryDirector
};
