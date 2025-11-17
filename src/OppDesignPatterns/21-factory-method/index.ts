/**
 * ==========================================
 * FACTORY METHOD PATTERN
 * (Patrón Creacional)
 * ==========================================
 *
 * 🔑 CONCEPTO FUNDAMENTAL:
 *
 * Factory Method define una INTERFACE para crear objetos,
 * pero deja que las SUBCLASES decidan qué clase instanciar.
 *
 * También conocido como: Virtual Constructor
 *
 * Características clave:
 * 1. **Abstracción de creación**: Cliente no conoce clase concreta
 * 2. **Subclases deciden**: Cada subclase crea su tipo específico
 * 3. **Desacopla código**: Cliente depende de interface, no implementación
 * 4. **Extensible**: Agregar nuevos tipos no modifica código existente (Open/Closed)
 *
 * 📚 ESTRUCTURA:
 *
 * - **Creator**: Clase abstracta con factory method abstracto
 * - **ConcreteCreator**: Implementa factory method, retorna producto concreto
 * - **Product**: Interface del objeto a crear
 * - **ConcreteProduct**: Implementación concreta del producto
 *
 * 🏢 USO EN BIG TECH:
 *
 * **Stripe:**
 * - PaymentMethod factory: Crea Card, BankAccount, Wallet según tipo
 * - Event factory: Crea diferentes tipos de eventos según webhook
 * - Dispute factory: Crea dispute objects basados en razón
 *
 * **AWS SDK:**
 * - Service clients: Diferentes factories para S3, DynamoDB, Lambda, etc.
 * - Request builders: Factory method para construir requests según servicio
 *
 * **Spring Framework:**
 * - BeanFactory: Core del dependency injection container
 * - FactoryBean: Interface para objetos que son factories
 *
 * **PayPal:**
 * - Payment processor factory: Crea processor según país/región
 * - Tax calculator factory: Diferentes calculators según jurisdicción
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - **Flexibilidad**: Fácil agregar nuevos tipos sin modificar existentes
 * - **Desacoplamiento**: Cliente no depende de clases concretas
 * - **Single Responsibility**: Creación separada de lógica de negocio
 * - **Open/Closed**: Extender sin modificar
 */

// ==========================================
// SECCIÓN 1: PROBLEMA SIN FACTORY METHOD
// Creación directa acoplada
// ==========================================

/**
 * ⚠️ PROBLEMA: Creación directa crea acoplamiento fuerte
 */

class CreditCardPayment_Bad {
  process(amount: number): void {
    console.log(`Processing ${amount} via Credit Card`);
  }
}

class BankTransferPayment_Bad {
  process(amount: number): void {
    console.log(`Processing ${amount} via Bank Transfer`);
  }
}

// ⚠️ Cliente acoplado a clases concretas
function processPayment_Bad(type: string, amount: number) {
  if (type === 'credit_card') {
    // ⚠️ Dependencia directa de CreditCardPayment_Bad
    const payment = new CreditCardPayment_Bad();
    payment.process(amount);
  } else if (type === 'bank_transfer') {
    // ⚠️ Dependencia directa de BankTransferPayment_Bad
    const payment = new BankTransferPayment_Bad();
    payment.process(amount);
  }

  // ⚠️ PROBLEMA:
  // - Para agregar nuevo tipo (ej: PayPal), debemos modificar esta función
  // - Viola Open/Closed Principle
  // - Alto acoplamiento
}

// ==========================================
// SECCIÓN 2: FACTORY METHOD - IMPLEMENTACIÓN BÁSICA
// ==========================================

/**
 * ✅ SOLUCIÓN: Factory Method Pattern
 */

// Producto: Interface común
interface Payment {
  process(amount: number): Promise<boolean>;
  validate(): boolean;
}

// Creator abstracto: Define factory method
abstract class PaymentProcessor {
  // ✅ Factory Method: subclases implementan
  protected abstract createPayment(): Payment;

  // Template method que usa factory method
  public async processPayment(amount: number): Promise<boolean> {
    // Crear payment usando factory method
    const payment = this.createPayment();

    // Lógica común para todos los pagos
    console.log('Validating payment...');
    if (!payment.validate()) {
      console.log('Validation failed');
      return false;
    }

    console.log('Processing payment...');
    const result = await payment.process(amount);

    if (result) {
      console.log('Payment processed successfully');
    }

    return result;
  }
}

// Productos concretos
class CreditCardPayment implements Payment {
  async process(amount: number): Promise<boolean> {
    console.log(`Processing ${amount} via Credit Card`);
    // Lógica específica de credit card
    return true;
  }

  validate(): boolean {
    console.log('Validating credit card');
    return true;
  }
}

class BankTransferPayment implements Payment {
  async process(amount: number): Promise<boolean> {
    console.log(`Processing ${amount} via Bank Transfer`);
    // Lógica específica de bank transfer
    return true;
  }

  validate(): boolean {
    console.log('Validating bank account');
    return true;
  }
}

class PayPalPayment implements Payment {
  async process(amount: number): Promise<boolean> {
    console.log(`Processing ${amount} via PayPal`);
    // Lógica específica de PayPal
    return true;
  }

  validate(): boolean {
    console.log('Validating PayPal account');
    return true;
  }
}

// Creators concretos: Implementan factory method
class CreditCardProcessor extends PaymentProcessor {
  protected createPayment(): Payment {
    return new CreditCardPayment();
  }
}

class BankTransferProcessor extends PaymentProcessor {
  protected createPayment(): Payment {
    return new BankTransferPayment();
  }
}

class PayPalProcessor extends PaymentProcessor {
  protected createPayment(): Payment {
    return new PayPalPayment();
  }
}

// ✅ Cliente desacoplado
async function demoFactoryMethod() {
  // Cliente trabaja con abstracción
  const processors: PaymentProcessor[] = [
    new CreditCardProcessor(),
    new BankTransferProcessor(),
    new PayPalProcessor()
  ];

  for (const processor of processors) {
    await processor.processPayment(5000);
    console.log('---');
  }

  // ✅ Para agregar nuevo payment method:
  // 1. Crear nueva clase que implemente Payment
  // 2. Crear nueva clase que extienda PaymentProcessor
  // 3. NO modificar código existente (Open/Closed)
}

// ==========================================
// SECCIÓN 3: FACTORY METHOD EN NOTIFICATION SYSTEM
// Caso de uso real
// ==========================================

/**
 * 💰 CASO REAL: Notification System
 * Diferentes canales (Email, SMS, Push) según preferencia de usuario
 */

// Product interface
interface Notification {
  send(recipient: string, message: string): Promise<boolean>;
  validateRecipient(recipient: string): boolean;
}

// Concrete products
class EmailNotification implements Notification {
  async send(recipient: string, message: string): Promise<boolean> {
    console.log(`Sending email to ${recipient}: ${message}`);
    // Integración con SendGrid, Mailgun, etc.
    return true;
  }

  validateRecipient(recipient: string): boolean {
    return recipient.includes('@');
  }
}

class SMSNotification implements Notification {
  async send(recipient: string, message: string): Promise<boolean> {
    console.log(`Sending SMS to ${recipient}: ${message}`);
    // Integración con Twilio
    return true;
  }

  validateRecipient(recipient: string): boolean {
    return /^\+?\d{10,}$/.test(recipient);
  }
}

class PushNotification implements Notification {
  async send(recipient: string, message: string): Promise<boolean> {
    console.log(`Sending push to device ${recipient}: ${message}`);
    // Integración con FCM, APNs
    return true;
  }

  validateRecipient(recipient: string): boolean {
    return recipient.length > 0;
  }
}

// Creator abstract
abstract class NotificationSender {
  protected abstract createNotification(): Notification;

  public async sendNotification(
    recipient: string,
    message: string
  ): Promise<boolean> {
    const notification = this.createNotification();

    if (!notification.validateRecipient(recipient)) {
      console.log('Invalid recipient');
      return false;
    }

    return await notification.send(recipient, message);
  }
}

// Concrete creators
class EmailSender extends NotificationSender {
  protected createNotification(): Notification {
    return new EmailNotification();
  }
}

class SMSSender extends NotificationSender {
  protected createNotification(): Notification {
    return new SMSNotification();
  }
}

class PushSender extends NotificationSender {
  protected createNotification(): Notification {
    return new PushNotification();
  }
}

// Uso en billing system
async function notifyPaymentSuccess(
  userPreference: 'email' | 'sms' | 'push',
  recipient: string
) {
  let sender: NotificationSender;

  // ✅ Factory decide qué sender crear
  switch (userPreference) {
    case 'email':
      sender = new EmailSender();
      break;
    case 'sms':
      sender = new SMSSender();
      break;
    case 'push':
      sender = new PushSender();
      break;
  }

  await sender.sendNotification(
    recipient,
    'Your payment was processed successfully'
  );
}

// ==========================================
// SECCIÓN 4: FACTORY METHOD CON PARÁMETROS
// Factory method que recibe configuración
// ==========================================

/**
 * ✅ Factory method puede recibir parámetros para configurar producto
 */

interface TaxCalculator {
  calculate(amount: number): number;
  getJurisdiction(): string;
}

class USTaxCalculator implements TaxCalculator {
  constructor(private state: string) {}

  calculate(amount: number): number {
    const rates: Record<string, number> = {
      'CA': 0.0725,
      'NY': 0.04,
      'TX': 0.0625
    };
    const rate = rates[this.state] || 0;
    return amount * rate;
  }

  getJurisdiction(): string {
    return `US-${this.state}`;
  }
}

class EUTaxCalculator implements TaxCalculator {
  constructor(private country: string) {}

  calculate(amount: number): number {
    const rates: Record<string, number> = {
      'UK': 0.20,
      'DE': 0.19,
      'FR': 0.20
    };
    const rate = rates[this.country] || 0.20;
    return amount * rate;
  }

  getJurisdiction(): string {
    return `EU-${this.country}`;
  }
}

// Creator con parámetro
abstract class TaxService {
  protected abstract createCalculator(location: string): TaxCalculator;

  public calculateTax(amount: number, location: string): number {
    const calculator = this.createCalculator(location);
    const tax = calculator.calculate(amount);

    console.log(
      `Tax for ${calculator.getJurisdiction()}: ${tax}`
    );

    return tax;
  }
}

class USTaxService extends TaxService {
  protected createCalculator(state: string): TaxCalculator {
    return new USTaxCalculator(state);
  }
}

class EUTaxService extends TaxService {
  protected createCalculator(country: string): TaxCalculator {
    return new EUTaxCalculator(country);
  }
}

// ==========================================
// SECCIÓN 5: FACTORY METHOD VS SIMPLE FACTORY
// Diferencias importantes
// ==========================================

/**
 * SIMPLE FACTORY (no es un patrón GoF, pero es común)
 * Una sola clase con método estático que decide qué crear
 */

class PaymentFactory_Simple {
  // ⚠️ Simple factory: no es extensible sin modificar
  public static createPayment(type: string): Payment {
    switch (type) {
      case 'credit_card':
        return new CreditCardPayment();
      case 'bank_transfer':
        return new BankTransferPayment();
      case 'paypal':
        return new PayPalPayment();
      default:
        throw new Error(`Unknown payment type: ${type}`);
    }
  }
}

// Uso
function useSimpleFactory() {
  const payment = PaymentFactory_Simple.createPayment('credit_card');
  payment.process(100);

  // ⚠️ PROBLEMA: Para agregar nuevo tipo, debemos modificar PaymentFactory_Simple
  // Viola Open/Closed Principle
}

/**
 * FACTORY METHOD (patrón GoF)
 * Jerarquía de clases, cada una crea su tipo
 */

// Ya implementado arriba con PaymentProcessor
// ✅ BENEFICIO: Para agregar nuevo tipo, solo crear nuevas clases
// NO modificar existentes (Open/Closed)

// ==========================================
// SECCIÓN 6: FACTORY METHOD EN DOCUMENT GENERATORS
// Caso de uso de facturación
// ==========================================

/**
 * 💰 CASO REAL: Generar diferentes formatos de factura
 */

interface Invoice {
  generate(data: InvoiceData): string;
  getFormat(): string;
}

interface InvoiceData {
  invoiceNumber: string;
  customer: string;
  amount: number;
  items: Array<{ description: string; amount: number }>;
}

class PDFInvoice implements Invoice {
  generate(data: InvoiceData): string {
    // Generación de PDF (usando biblioteca como pdfmake)
    return `[PDF] Invoice ${data.invoiceNumber} for ${data.customer}`;
  }

  getFormat(): string {
    return 'PDF';
  }
}

class HTMLInvoice implements Invoice {
  generate(data: InvoiceData): string {
    // Generación de HTML
    const html = `
      <html>
        <body>
          <h1>Invoice ${data.invoiceNumber}</h1>
          <p>Customer: ${data.customer}</p>
          <p>Total: $${data.amount}</p>
        </body>
      </html>
    `;
    return html;
  }

  getFormat(): string {
    return 'HTML';
  }
}

class JSONInvoice implements Invoice {
  generate(data: InvoiceData): string {
    return JSON.stringify(data, null, 2);
  }

  getFormat(): string {
    return 'JSON';
  }
}

// Creator
abstract class InvoiceGenerator {
  protected abstract createInvoice(): Invoice;

  public generateInvoice(data: InvoiceData): string {
    const invoice = this.createInvoice();

    console.log(`Generating ${invoice.getFormat()} invoice...`);

    return invoice.generate(data);
  }
}

// Concrete creators
class PDFInvoiceGenerator extends InvoiceGenerator {
  protected createInvoice(): Invoice {
    return new PDFInvoice();
  }
}

class HTMLInvoiceGenerator extends InvoiceGenerator {
  protected createInvoice(): Invoice {
    return new HTMLInvoice();
  }
}

class JSONInvoiceGenerator extends InvoiceGenerator {
  protected createInvoice(): Invoice {
    return new JSONInvoice();
  }
}

// Uso
function generateInvoices() {
  const invoiceData: InvoiceData = {
    invoiceNumber: 'INV-001',
    customer: 'Acme Corp',
    amount: 5000,
    items: [
      { description: 'Subscription - Pro Plan', amount: 5000 }
    ]
  };

  const generators: InvoiceGenerator[] = [
    new PDFInvoiceGenerator(),
    new HTMLInvoiceGenerator(),
    new JSONInvoiceGenerator()
  ];

  generators.forEach(generator => {
    const result = generator.generateInvoice(invoiceData);
    console.log(result);
    console.log('---');
  });
}

// ==========================================
// SECCIÓN 7: MEJORES PRÁCTICAS
// ==========================================

/**
 * ✅ MEJORES PRÁCTICAS:
 *
 * 1. **Usa Factory Method cuando:**
 *    - No sabes de antemano los tipos exactos a crear
 *    - Quieres delegar creación a subclases
 *    - Necesitas extensibilidad sin modificar código
 *
 * 2. **Combina con otros patrones:**
 *    - Template Method (como en PaymentProcessor)
 *    - Strategy (factory crea diferentes estrategias)
 *    - Prototype (factory clona prototipos)
 *
 * 3. **Nombres claros:**
 *    - Factory method: createX(), makeX(), buildX()
 *    - No usar nombres genéricos como create() si no es claro
 *
 * 4. **Return types:**
 *    - Factory method retorna interface, no clase concreta
 *    - Permite polimorfismo
 *
 * 5. **Simple Factory vs Factory Method:**
 *    - Simple Factory: OK para casos simples, no extensibles
 *    - Factory Method: Cuando necesitas extensibilidad
 */

/**
 * ⚠️ ERRORES COMUNES:
 *
 * 1. **Confundir con Abstract Factory**
 *    - Factory Method: Un método que crea UN producto
 *    - Abstract Factory: Familia de productos relacionados
 *
 * 2. **Complejidad innecesaria**
 *    - No uses Factory Method si solo tienes 1-2 tipos
 *    - Simple factory o creación directa puede ser suficiente
 *
 * 3. **Factory method retorna clase concreta**
 *    - ⚠️ MALO: protected createPayment(): CreditCardPayment
 *    - ✅ BUENO: protected createPayment(): Payment
 *
 * 4. **No aprovechar template method**
 *    - Factory method brilla cuando se usa en template method
 *    - Lógica común en clase base, variación en factory method
 */

// ==========================================
// MAIN - DEMOSTRACIÓN
// ==========================================

console.log('='.repeat(50));
console.log('FACTORY METHOD PATTERN - DEMOSTRACIÓN');
console.log('='.repeat(50));

console.log('\n1. Payment Processors:');
demoFactoryMethod();

console.log('\n2. Notification System:');
notifyPaymentSuccess('email', 'user@example.com');

console.log('\n3. Invoice Generators:');
generateInvoices();

console.log('\n✅ Beneficios del Factory Method:');
console.log('   - Extensible sin modificar código existente');
console.log('   - Desacopla creación de uso');
console.log('   - Open/Closed Principle');

// ==========================================
// PREGUNTAS PARA REFLEXIONAR
// ==========================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuál es la diferencia entre Factory Method y Simple Factory?
 *    Pista: Factory Method usa herencia, Simple Factory usa condicionales
 *
 * 2. ¿Por qué Factory Method cumple Open/Closed Principle?
 *    Pista: Agregar nuevos tipos no requiere modificar existentes
 *
 * 3. ¿Cómo se relaciona Factory Method con Template Method?
 *    Pista: Factory method es paso en template method
 *
 * 4. ¿Cuándo usarías Factory Method vs new directo?
 *    Pista: Cuando necesitas extensibilidad y desacoplamiento
 *
 * 5. ¿Cómo Stripe usa Factory Method para payment methods?
 *    Pista: Diferentes factories crean Card, BankAccount, etc.
 *
 * 6. ¿Factory Method siempre debe ser abstracto?
 *    Pista: No, puede tener implementación default
 *
 * 7. ¿Cuál es el trade-off de usar Factory Method?
 *    Pista: Complejidad (más clases) vs flexibilidad
 *
 * 8. ¿Cómo testarías código que usa Factory Method?
 *    Pista: Inyecta mock creator que retorna mock products
 */

// ==========================================
// EJERCICIOS PRÁCTICOS
// ==========================================

/**
 * 📝 EJERCICIO 1 (BÁSICO): Logger Factory
 *
 * Implementa factory method para diferentes loggers:
 * - ConsoleLogger: Loggea a console
 * - FileLogger: Loggea a archivo
 * - RemoteLogger: Envía a servicio remoto (Datadog, Sentry)
 *
 * Creator abstracto: LoggerFactory con método createLogger()
 * Método público: log(level, message) que usa createLogger()
 *
 * Ejemplo:
 * ```typescript
 * const logger = new ConsoleLoggerFactory();
 * logger.log('INFO', 'Payment processed');
 * ```
 */

/**
 * 📝 EJERCICIO 2 (INTERMEDIO): Payment Method Factory con validación
 *
 * Extiende el ejemplo de Payment:
 * - Agregar validación específica por método (Luhn para tarjetas, IBAN para bank)
 * - Agregar fees diferentes por método
 * - Agregar límites de monto por método
 * - Factory method crea payment con todas estas configuraciones
 *
 * Debe manejar:
 * - CreditCard: Validar Luhn, fee 2.9% + $0.30, límite $10,000
 * - BankTransfer: Validar IBAN, fee $0, límite $100,000
 * - Crypto: Validar wallet address, fee 1%, sin límite
 */

/**
 * 📝 EJERCICIO 3 (AVANZADO): Discount Strategy Factory
 *
 * Implementa factory method para estrategias de descuento:
 * - PercentageDiscount
 * - FixedAmountDiscount
 * - TieredDiscount (descuento por volumen)
 * - ReferralDiscount (descuento por referido)
 *
 * Creator: DiscountFactory
 * - Debe leer configuración de descuentos desde "database"
 * - Factory method crea estrategia apropiada según tipo
 * - Template method aplica validación común (fechas, elegibilidad)
 *
 * Inspiración: Cómo Stripe maneja coupons y promotions
 */

/**
 * 📝 EJERCICIO 4 (EXPERTO): Multi-Region Payment Processor Factory
 *
 * Diseña sistema de pagos multi-región con Factory Method:
 *
 * Requisitos:
 * 1. Diferentes procesadores por región:
 *    - US: Stripe
 *    - EU: Adyen
 *    - APAC: PayPal
 *    - LATAM: MercadoPago
 *
 * 2. Cada region tiene:
 *    - Diferentes payment methods soportados
 *    - Diferentes validaciones (regulatory compliance)
 *    - Diferentes fees
 *    - Diferentes currencies
 *
 * 3. Factory Method debe:
 *    - Detectar región del customer
 *    - Crear processor apropiado
 *    - Configurar con payment methods válidos para esa región
 *    - Aplicar validaciones específicas de región
 *
 * 4. Template Method común para:
 *    - Fraud detection
 *    - Logging
 *    - Retry logic
 *    - Webhook notifications
 *
 * Inspiración: Arquitectura real de Stripe para procesamiento global
 */

// ==========================================
// EXPORTS
// ==========================================

export {
  // Interfaces
  Payment,
  Notification,
  TaxCalculator,
  Invoice,

  // Abstract creators
  PaymentProcessor,
  NotificationSender,
  TaxService,
  InvoiceGenerator,

  // Concrete creators
  CreditCardProcessor,
  BankTransferProcessor,
  PayPalProcessor,
  EmailSender,
  SMSSender
};
