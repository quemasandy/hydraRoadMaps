/**
 * ==========================================
 * PROTOTYPE PATTERN
 * (Patrón Creacional)
 * ==========================================
 *
 * 🔑 CONCEPTO FUNDAMENTAL:
 *
 * Prototype permite COPIAR objetos existentes sin hacer el código
 * dependiente de sus clases concretas.
 *
 * En lugar de crear objetos con `new`, clonas un prototipo.
 *
 * Características clave:
 * 1. **Clonación**: Crear copia de objeto existente
 * 2. **Shallow vs Deep copy**: Copiar referencias vs copiar valores
 * 3. **Prototype registry**: Almacenar prototipos pre-configurados
 * 4. **Independencia**: Copia es independiente del original
 *
 * 📚 CUÁNDO USAR PROTOTYPE:
 *
 * ✅ CASOS APROPIADOS:
 * - Crear objeto es costoso (DB query, cálculos complejos)
 * - Objetos con muchas configuraciones similares
 * - Evitar jerarquías complejas de factories
 * - Crear variaciones de objetos existentes
 * - Undo/Redo functionality
 *
 * 🏢 USO EN BIG TECH:
 *
 * **JavaScript/TypeScript:**
 * - Object.assign(), spread operator (...), structuredClone()
 * - Prototypal inheritance nativa del lenguaje
 *
 * **Stripe:**
 * - Cloning payment intents para retry logic
 * - Templates de facturas que se clonan y modifican
 * - Configuraciones de productos que se duplican
 *
 * **Gaming (Unity, Unreal):**
 * - Spawning enemigos clonando prototipos
 * - Evita recalcular physics, AI, etc.
 *
 * **Document Editors (Google Docs, Figma):**
 * - Duplicar elementos (copy/paste)
 * - Templates de documentos
 *
 * **E-commerce:**
 * - Duplicar productos con variantes
 * - Templates de promociones
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - **Performance**: Clonar puede ser más rápido que crear desde cero
 * - **Flexibilidad**: Crear variaciones fácilmente
 * - **Desacoplamiento**: No depende de clases concretas
 * - **Inmutabilidad**: Operaciones no destructivas
 */

// ==========================================
// SECCIÓN 1: PROBLEMA SIN PROTOTYPE
// Crear objetos desde cero es costoso
// ==========================================

/**
 * ⚠️ PROBLEMA: Crear objeto complejo repetidamente
 */

class ExpensiveObject_Bad {
  private data: any[];

  constructor() {
    // ⚠️ Operación costosa
    console.log('Performing expensive initialization...');
    this.data = this.loadFromDatabase(); // Simula query costoso
    this.processData(); // Simula cálculo complejo
  }

  private loadFromDatabase(): any[] {
    // Simular operación costosa
    return Array.from({ length: 1000 }, (_, i) => ({ id: i }));
  }

  private processData(): void {
    // Simular procesamiento costoso
    this.data.forEach(item => {
      // Cálculos complejos...
    });
  }
}

// ⚠️ Si necesitas 100 objetos similares...
function badUsage() {
  const objects: ExpensiveObject_Bad[] = [];

  for (let i = 0; i < 100; i++) {
    // ❌ Cada vez ejecuta operación costosa
    objects.push(new ExpensiveObject_Bad());
  }

  // ⚠️ PROBLEMA: 100 queries a DB, 100 procesam

ientos complejos
}

// ==========================================
// SECCIÓN 2: PROTOTYPE PATTERN - IMPLEMENTACIÓN BÁSICA
// Clonar en lugar de crear
// ==========================================

/**
 * ✅ SOLUCIÓN: Prototype Pattern
 */

// Interface para objetos clonables
interface Cloneable<T> {
  clone(): T;
}

class ExpensiveObject_Good implements Cloneable<ExpensiveObject_Good> {
  private data: any[];

  constructor() {
    console.log('Performing expensive initialization...');
    this.data = this.loadFromDatabase();
    this.processData();
  }

  private loadFromDatabase(): any[] {
    return Array.from({ length: 1000 }, (_, i) => ({ id: i }));
  }

  private processData(): void {
    this.data.forEach(item => {
      // Cálculos...
    });
  }

  // ✅ Método clone
  clone(): ExpensiveObject_Good {
    console.log('Cloning object (fast!)');

    // Crear nueva instancia sin constructor costoso
    const cloned = Object.create(Object.getPrototypeOf(this));

    // Shallow copy de data
    cloned.data = [...this.data];

    return cloned;
  }
}

// ✅ Uso eficiente
function goodUsage() {
  // Crear prototipo UNA vez (costoso)
  const prototype = new ExpensiveObject_Good();

  const objects: ExpensiveObject_Good[] = [];

  for (let i = 0; i < 100; i++) {
    // ✅ Clonar es rápido
    objects.push(prototype.clone());
  }

  // ✅ BENEFICIO: 1 query a DB, 1 procesamiento, 100 clones rápidos
}

// ==========================================
// SECCIÓN 3: SHALLOW VS DEEP COPY
// Diferencia crítica en clonación
// ==========================================

/**
 * SHALLOW COPY: Copia referencias
 * DEEP COPY: Copia valores recursivamente
 */

class Address {
  constructor(
    public street: string,
    public city: string,
    public zipCode: string
  ) {}
}

class Customer {
  constructor(
    public id: string,
    public name: string,
    public address: Address
  ) {}

  // ⚠️ Shallow copy
  shallowClone(): Customer {
    const cloned = new Customer(this.id, this.name, this.address);
    // ⚠️ address es la MISMA referencia
    return cloned;
  }

  // ✅ Deep copy
  deepClone(): Customer {
    // Clonar address también
    const addressCopy = new Address(
      this.address.street,
      this.address.city,
      this.address.zipCode
    );

    return new Customer(this.id, this.name, addressCopy);
  }
}

function demoShallowVsDeep() {
  const original = new Customer(
    'cus_123',
    'John Doe',
    new Address('123 Main St', 'New York', '10001')
  );

  // Shallow copy
  const shallow = original.shallowClone();
  shallow.address.city = 'Los Angeles'; // ❌ Modifica ORIGINAL también!

  console.log('Original city:', original.address.city); // Los Angeles ❌

  // Deep copy
  const deep = original.deepClone();
  deep.address.city = 'Chicago'; // ✅ NO afecta original

  console.log('Original city:', original.address.city); // Los Angeles
  console.log('Deep copy city:', deep.address.city); // Chicago
}

// ==========================================
// SECCIÓN 4: PROTOTYPE REGISTRY
// Almacenar prototipos pre-configurados
// ==========================================

/**
 * 💰 CASO REAL: Prototype Registry para productos
 *
 * Almacenar productos template que se clonan y customiz an
 */

interface Product extends Cloneable<Product> {
  id: string;
  name: string;
  price: number;
  features: string[];
}

class SoftwareProduct implements Product {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public features: string[]
  ) {}

  clone(): SoftwareProduct {
    // Deep clone de features array
    return new SoftwareProduct(
      this.id,
      this.name,
      this.price,
      [...this.features]
    );
  }
}

// Registry de prototipos
class ProductRegistry {
  private prototypes: Map<string, Product> = new Map();

  registerPrototype(key: string, prototype: Product): void {
    this.prototypes.set(key, prototype);
  }

  getPrototype(key: string): Product | undefined {
    const prototype = this.prototypes.get(key);
    return prototype ? prototype.clone() : undefined;
  }

  listPrototypes(): string[] {
    return Array.from(this.prototypes.keys());
  }
}

// Uso del registry
function useRegistry() {
  const registry = new ProductRegistry();

  // Registrar prototipos
  registry.registerPrototype(
    'basic',
    new SoftwareProduct(
      'prod_basic',
      'Basic Plan',
      9.99,
      ['Feature A', 'Feature B']
    )
  );

  registry.registerPrototype(
    'pro',
    new SoftwareProduct(
      'prod_pro',
      'Pro Plan',
      29.99,
      ['Feature A', 'Feature B', 'Feature C', 'Feature D']
    )
  );

  // Crear productos clonando prototipos
  const customerProduct1 = registry.getPrototype('basic');
  if (customerProduct1) {
    customerProduct1.id = 'prod_cus_001'; // Customizar
    console.log('Customer 1 product:', customerProduct1);
  }

  const customerProduct2 = registry.getPrototype('pro');
  if (customerProduct2) {
    customerProduct2.id = 'prod_cus_002';
    customerProduct2.features.push('Custom Feature'); // Modificar copia
    console.log('Customer 2 product:', customerProduct2);
  }

  // ✅ Prototipos originales no se modifican
}

// ==========================================
// SECCIÓN 5: PROTOTYPE PARA INVOICE TEMPLATES
// Caso de uso real en billing
// ==========================================

/**
 * 💰 CASO REAL: Templates de facturas que se clonan
 */

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

class InvoiceTemplate implements Cloneable<InvoiceTemplate> {
  public items: InvoiceItem[] = [];
  public taxRate: number = 0;
  public notes?: string;
  public terms?: string;

  constructor(
    public templateName: string,
    public companyInfo: { name: string; address: string }
  ) {}

  addItem(description: string, quantity: number, unitPrice: number): this {
    this.items.push({ description, quantity, unitPrice });
    return this;
  }

  setTaxRate(rate: number): this {
    this.taxRate = rate;
    return this;
  }

  setNotes(notes: string): this {
    this.notes = notes;
    return this;
  }

  setTerms(terms: string): this {
    this.terms = terms;
    return this;
  }

  clone(): InvoiceTemplate {
    const cloned = new InvoiceTemplate(
      this.templateName,
      { ...this.companyInfo } // Deep copy
    );

    // Deep copy de items
    cloned.items = this.items.map(item => ({ ...item }));
    cloned.taxRate = this.taxRate;
    cloned.notes = this.notes;
    cloned.terms = this.terms;

    return cloned;
  }

  calculateTotal(): number {
    const subtotal = this.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    return subtotal * (1 + this.taxRate);
  }
}

// Uso de templates
function useInvoiceTemplates() {
  // Crear template base
  const monthlyServiceTemplate = new InvoiceTemplate(
    'Monthly Service',
    { name: 'Acme Corp', address: '123 Business St' }
  )
    .addItem('Pro Plan Subscription', 1, 99.99)
    .setTaxRate(0.08)
    .setTerms('Payment due within 30 days')
    .setNotes('Thank you for your business!');

  // Clonar para diferentes clientes
  const customerAInvoice = monthlyServiceTemplate.clone();
  // Customizar para customer A
  customerAInvoice.addItem('Extra User Seats', 5, 10.00);

  const customerBInvoice = monthlyServiceTemplate.clone();
  // Customizar para customer B
  customerBInvoice.addItem('Premium Support', 1, 50.00);

  console.log('Customer A total:', customerAInvoice.calculateTotal());
  console.log('Customer B total:', customerBInvoice.calculateTotal());
  console.log('Template total:', monthlyServiceTemplate.calculateTotal());

  // ✅ Template original no se modificó
}

// ==========================================
// SECCIÓN 6: PROTOTYPE CON TYPESCRIPT UTILITIES
// Usando características modernas de TypeScript/JS
// ==========================================

/**
 * ✅ JavaScript moderno tiene herramientas para cloning
 */

// 1. Object.assign() - Shallow copy
function useObjectAssign() {
  const original = {
    id: '123',
    name: 'Product',
    price: 99.99,
    metadata: { sku: 'ABC123' }
  };

  const copy = Object.assign({}, original);

  // ⚠️ Shallow copy
  copy.metadata.sku = 'XYZ789';
  console.log(original.metadata.sku); // XYZ789 - modificó original!
}

// 2. Spread operator - Shallow copy
function useSpread() {
  const original = {
    id: '123',
    price: 99.99,
    features: ['A', 'B']
  };

  const copy = { ...original };

  // ⚠️ Shallow copy de array
  copy.features.push('C');
  console.log(original.features); // ['A', 'B', 'C'] - modificó original!
}

// 3. structuredClone() - Deep copy (moderno, Node 17+)
function useStructuredClone() {
  const original = {
    id: '123',
    nested: {
      value: 42,
      array: [1, 2, 3]
    }
  };

  // ✅ Deep copy automático
  const copy = structuredClone(original);

  copy.nested.value = 100;
  copy.nested.array.push(4);

  console.log(original.nested.value); // 42 - NO modificó
  console.log(original.nested.array); // [1, 2, 3] - NO modificó
}

// 4. Custom deep clone function
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any;
  }

  if (obj instanceof Object) {
    const cloned: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
}

// ==========================================
// SECCIÓN 7: PROTOTYPE PARA UNDO/REDO
// Caso de uso avanzado
// ==========================================

/**
 * ✅ Prototype para implementar Undo/Redo
 */

class DocumentState implements Cloneable<DocumentState> {
  constructor(
    public content: string,
    public cursorPosition: number
  ) {}

  clone(): DocumentState {
    return new DocumentState(this.content, this.cursorPosition);
  }
}

class TextEditor {
  private currentState: DocumentState;
  private history: DocumentState[] = [];
  private historyIndex: number = -1;

  constructor() {
    this.currentState = new DocumentState('', 0);
    this.saveState();
  }

  // Guardar estado actual en history
  private saveState(): void {
    // Remover estados "future" si estamos en el medio
    this.history = this.history.slice(0, this.historyIndex + 1);

    // Guardar clon del estado actual
    this.history.push(this.currentState.clone());
    this.historyIndex = this.history.length - 1;
  }

  insertText(text: string): void {
    const before = this.currentState.content.substring(
      0,
      this.currentState.cursorPosition
    );
    const after = this.currentState.content.substring(
      this.currentState.cursorPosition
    );

    this.currentState.content = before + text + after;
    this.currentState.cursorPosition += text.length;

    this.saveState();
  }

  undo(): boolean {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      // ✅ Clonar estado del history
      this.currentState = this.history[this.historyIndex].clone();
      return true;
    }
    return false;
  }

  redo(): boolean {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      // ✅ Clonar estado del history
      this.currentState = this.history[this.historyIndex].clone();
      return true;
    }
    return false;
  }

  getContent(): string {
    return this.currentState.content;
  }
}

// Uso de undo/redo
function useUndoRedo() {
  const editor = new TextEditor();

  editor.insertText('Hello ');
  console.log('After Hello:', editor.getContent());

  editor.insertText('World');
  console.log('After World:', editor.getContent());

  editor.undo();
  console.log('After Undo:', editor.getContent()); // "Hello "

  editor.undo();
  console.log('After Undo:', editor.getContent()); // ""

  editor.redo();
  console.log('After Redo:', editor.getContent()); // "Hello "
}

// ==========================================
// SECCIÓN 8: MEJORES PRÁCTICAS
// ==========================================

/**
 * ✅ MEJORES PRÁCTICAS:
 *
 * 1. **Implementa Cloneable interface:**
 *    - Hace explícito que objeto es clonable
 *
 * 2. **Deep copy cuando necesario:**
 *    - Objetos anidados deben clonarse recursivamente
 *
 * 3. **Prototype Registry:**
 *    - Para almacenar prototipos pre-configurados
 *
 * 4. **Usa herramientas modernas:**
 *    - structuredClone() para deep copy automático
 *    - Spread operator para shallow copy simple
 *
 * 5. **Documenta qué tipo de copy:**
 *    - Shallow o deep, debe estar claro
 */

/**
 * ⚠️ ERRORES COMUNES:
 *
 * 1. **Shallow copy cuando necesitas deep:**
 *    - Modificar copia afecta original
 *
 * 2. **Clonar métodos:**
 *    - Métodos no se copian con Object.assign
 *    - Usa Object.create() correctamente
 *
 * 3. **Referencias circulares:**
 *    - Cuidado con objetos que se referencian a sí mismos
 *
 * 4. **Performance:**
 *    - Deep clone puede ser costoso
 *    - Considera si realmente necesitas deep copy
 */

// ==========================================
// MAIN - DEMOSTRACIÓN
// ==========================================

console.log('='.repeat(50));
console.log('PROTOTYPE PATTERN - DEMOSTRACIÓN');
console.log('='.repeat(50));

console.log('\n1. Efficient Object Creation:');
goodUsage();

console.log('\n2. Shallow vs Deep Copy:');
demoShallowVsDeep();

console.log('\n3. Prototype Registry:');
useRegistry();

console.log('\n4. Invoice Templates:');
useInvoiceTemplates();

console.log('\n5. Undo/Redo:');
useUndoRedo();

console.log('\n✅ Beneficios del Prototype:');
console.log('   - Performance: Clonar es más rápido que crear');
console.log('   - Flexibilidad: Crear variaciones fácilmente');
console.log('   - Desacoplamiento: No depende de constructores');

// ==========================================
// PREGUNTAS PARA REFLEXIONAR
// ==========================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuál es la diferencia entre shallow copy y deep copy?
 *    Pista: Shallow copia referencias, deep copia valores
 *
 * 2. ¿Cuándo usarías Prototype sobre new Constructor()?
 *    Pista: Cuando crear objeto es costoso o tienes configuraciones similares
 *
 * 3. ¿Qué es un Prototype Registry y cuándo usarlo?
 *    Pista: Almacenar prototipos pre-configurados para clonar
 *
 * 4. ¿Cómo se relaciona Prototype con prototypal inheritance de JS?
 *    Pista: JavaScript usa prototypes nativamente
 *
 * 5. ¿Stripe cómo podría usar Prototype para invoices?
 *    Pista: Templates de facturas que se clonan y customiz an
 *
 * 6. ¿Prototype ayuda con inmutabilidad?
 *    Pista: Sí, clonas en lugar de modificar original
 *
 * 7. ¿Cuál es el trade-off de deep copy?
 *    Pista: Seguridad vs performance (deep copy puede ser lento)
 *
 * 8. ¿Cómo implementarías Undo/Redo con Prototype?
 *    Pista: Guardar clones de estados en history stack
 */

// ==========================================
// EJERCICIOS PRÁCTICOS
// ==========================================

/**
 * 📝 EJERCICIO 1 (BÁSICO): Configuration Cloner
 *
 * Implementa sistema de configuración clonable:
 * - AppConfig con múltiples settings
 * - Método clone() que hace deep copy
 * - Registry de configs pre-definidas (dev, staging, prod)
 *
 * Debe permitir:
 * ```typescript
 * const devConfig = ConfigRegistry.get('dev');
 * devConfig.apiUrl = 'http://localhost';
 * // Original 'dev' config no se modifica
 * ```
 */

/**
 * 📝 EJERCICIO 2 (INTERMEDIO): Product Variants
 *
 * Implementa sistema para e-commerce con variants:
 * - Product base con propiedades comunes
 * - Crear variants clonando y modificando (color, size, price)
 * - Deep clone de arrays/objects anidados
 * - Prototype registry para product templates
 *
 * Ejemplo:
 * ```typescript
 * const baseShirt = new Product('T-Shirt', 19.99, ['S', 'M', 'L']);
 * const redShirt = baseShirt.clone();
 * redShirt.color = 'red';
 * redShirt.sku = 'SHIRT-RED';
 * ```
 */

/**
 * 📝 EJERCICIO 3 (AVANZADO): Form State Manager con Undo/Redo
 *
 * Implementa manager para forms con history:
 * - FormState clonable (todos los fields)
 * - Stack de history para undo/redo
 * - Límite de history (ej: últimos 50 estados)
 * - Detectar cambios (dirty state)
 * - Resetear a estado original
 *
 * Features:
 * ```typescript
 * const form = new FormManager();
 * form.setField('email', 'user@example.com');
 * form.setField('name', 'John');
 * form.undo(); // Vuelve a solo email
 * form.canRedo(); // true
 * form.isDirty(); // true (comparado con original)
 * ```
 */

/**
 * 📝 EJERCICIO 4 (EXPERTO): Payment Flow State Machine con Snapshots
 *
 * Diseña state machine para payment flow con snapshots:
 *
 * Estados:
 * - Pending, Authorized, Captured, Failed, Refunded
 * - Cada estado tiene su propio data y transitions
 *
 * Features:
 * - Snapshot del estado actual en cada transición
 * - Replay: Volver a cualquier snapshot
 * - Audit trail: Historia completa de transiciones
 * - Fork: Crear payment alternativo desde snapshot
 * - Merge: Combinar estados de múltiples payments
 *
 * Usar Prototype para:
 * - Clonar estados eficientemente
 * - Almacenar snapshots sin consumir mucha memoria
 * - Implementar time-travel debugging
 *
 * Inspiración: Redux DevTools, Temporal.io workflow history
 */

// ==========================================
// EXPORTS
// ==========================================

export {
  // Interfaces
  Cloneable,
  Product,

  // Implementations
  ExpensiveObject_Good,
  Customer,
  Address,
  SoftwareProduct,
  ProductRegistry,
  InvoiceTemplate,
  TextEditor,
  DocumentState,

  // Utilities
  deepClone
};
