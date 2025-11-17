/**
 * ==========================================
 * SOLID: SINGLE RESPONSIBILITY PRINCIPLE (SRP)
 * ==========================================
 *
 * "Una clase debe tener una sola razón para cambiar"
 * - Robert C. Martin (Uncle Bob)
 *
 * 📚 CONCEPTO CLAVE:
 * Cada clase/módulo debe tener una única responsabilidad
 * y esa responsabilidad debe estar completamente encapsulada.
 *
 * 🏢 USO EN BIG TECH:
 * Stripe separa responsabilidades claramente:
 * - PaymentIntent (gestiona intención de pago)
 * - PaymentMethod (gestiona método de pago)
 * - Customer (gestiona cliente)
 * - Invoice (gestiona facturación)
 * Cada uno tiene UNA responsabilidad, no todas mezcladas.
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - Mantenibilidad: Cambios localizados
 * - Testabilidad: Tests enfocados
 * - Reusabilidad: Componentes independientes
 * - Comprensibilidad: Código más claro
 *
 * ❌ SÍNTOMAS DE VIOLACIÓN:
 * - Clase con palabra "And" o "Manager"
 * - Muchos imports
 * - Tests difíciles de escribir
 * - Cambios en cascada
 */

// ============================================
// ❌ VIOLACIÓN DE SRP
// ============================================

/**
 * EJEMPLO MALO: Payment class que hace TODO
 *
 * Responsabilidades mezcladas:
 * 1. Modelo de datos
 * 2. Validación
 * 3. Persistencia (DB)
 * 4. Notificaciones
 * 5. Logging
 * 6. Reportes
 *
 * 💥 PROBLEMA: Si cambia cómo enviamos emails, ¿por qué modificar Payment?
 */
class PaymentBad {
  constructor(
    public id: string,
    public amount: number,
    public currency: string,
    public customerId: string,
    public status: "pending" | "succeeded" | "failed"
  ) {}

  // ❌ Responsabilidad 1: Validación
  validate(): boolean {
    if (this.amount <= 0) {
      console.error("Invalid amount");
      return false;
    }
    if (!this.currency) {
      console.error("Invalid currency");
      return false;
    }
    return true;
  }

  // ❌ Responsabilidad 2: Persistencia
  save(): void {
    // Lógica de base de datos mezclada con modelo
    console.log(`Saving payment ${this.id} to database...`);
    // Imagine conexión a DB aquí
  }

  // ❌ Responsabilidad 3: Enviar notificaciones
  sendEmailNotification(): void {
    console.log(`Sending email for payment ${this.id}...`);
    // Lógica de email aquí
  }

  sendSMSNotification(): void {
    console.log(`Sending SMS for payment ${this.id}...`);
    // Lógica de SMS aquí
  }

  // ❌ Responsabilidad 4: Procesamiento de pago
  process(): void {
    if (!this.validate()) {
      return;
    }

    console.log(`Processing payment ${this.id}...`);
    this.status = "succeeded";

    this.save();
    this.sendEmailNotification();
    this.sendSMSNotification();
    this.logActivity("Payment processed");
  }

  // ❌ Responsabilidad 5: Logging
  logActivity(message: string): void {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  // ❌ Responsabilidad 6: Reportes
  generateReport(): string {
    return `Payment Report
    ID: ${this.id}
    Amount: ${this.amount}
    Status: ${this.status}`;
  }
}

/**
 * 💥 PROBLEMAS:
 * - Si cambia formato de email → modificar Payment
 * - Si cambia DB → modificar Payment
 * - Si cambia logging → modificar Payment
 * - Si cambia validación → modificar Payment
 * - Tests requieren mock de DB, email, SMS, etc.
 * - Difícil de reutilizar partes individuales
 */

// ============================================
// ✅ CUMPLIMIENTO DE SRP
// ============================================

/**
 * SOLUCIÓN: Separar responsabilidades en clases dedicadas
 *
 * Cada clase tiene UNA razón para cambiar
 */

/**
 * 1. Modelo de datos (SOLO datos)
 *
 * Responsabilidad: Representar un pago
 * Razón para cambiar: Estructura de datos de pago cambia
 */
interface Payment {
  readonly id: string;
  amount: number;
  currency: string;
  customerId: string;
  status: "pending" | "succeeded" | "failed";
  createdAt: number;
}

/**
 * 2. Validador (SOLO validación)
 *
 * Responsabilidad: Validar reglas de negocio de pagos
 * Razón para cambiar: Reglas de validación cambian
 *
 * 🏢 BIG TECH: Stripe tiene validators separados
 */
class PaymentValidator {
  validate(payment: Payment): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (payment.amount <= 0) {
      errors.push("Amount must be positive");
    }

    if (payment.amount > 999999999) {
      errors.push("Amount exceeds maximum");
    }

    if (!payment.currency || payment.currency.length !== 3) {
      errors.push("Invalid currency code");
    }

    if (!payment.customerId) {
      errors.push("Customer ID is required");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Validaciones específicas en métodos separados
  validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 999999999;
  }

  validateCurrency(currency: string): boolean {
    const validCurrencies = ["USD", "EUR", "GBP", "MXN"];
    return validCurrencies.includes(currency);
  }
}

/**
 * 3. Repository (SOLO persistencia)
 *
 * Responsabilidad: Persistir y recuperar pagos
 * Razón para cambiar: Tecnología de BD cambia
 *
 * 🏢 BIG TECH: Repository pattern (DDD)
 */
class PaymentRepository {
  private payments = new Map<string, Payment>();

  save(payment: Payment): void {
    console.log(`[Repository] Saving payment ${payment.id}`);
    this.payments.set(payment.id, payment);
  }

  findById(id: string): Payment | undefined {
    return this.payments.get(id);
  }

  findAll(): Payment[] {
    return Array.from(this.payments.values());
  }

  update(payment: Payment): void {
    console.log(`[Repository] Updating payment ${payment.id}`);
    this.payments.set(payment.id, payment);
  }

  delete(id: string): boolean {
    return this.payments.delete(id);
  }
}

/**
 * 4. Notificador (SOLO notificaciones)
 *
 * Responsabilidad: Enviar notificaciones
 * Razón para cambiar: Canales de notificación cambian
 *
 * 🏢 BIG TECH: Amazon SNS, SendGrid
 */
interface NotificationChannel {
  send(recipient: string, message: string): void;
}

class EmailNotifier implements NotificationChannel {
  send(recipient: string, message: string): void {
    console.log(`[Email] To: ${recipient}`);
    console.log(`[Email] Message: ${message}`);
  }
}

class SMSNotifier implements NotificationChannel {
  send(recipient: string, message: string): void {
    console.log(`[SMS] To: ${recipient}`);
    console.log(`[SMS] Message: ${message}`);
  }
}

class NotificationService {
  constructor(private channels: NotificationChannel[]) {}

  notify(recipient: string, message: string): void {
    this.channels.forEach((channel) => {
      channel.send(recipient, message);
    });
  }
}

/**
 * 5. Logger (SOLO logging)
 *
 * Responsabilidad: Registrar eventos
 * Razón para cambiar: Formato de logs cambia
 *
 * 🏢 BIG TECH: Winston, Bunyan, DataDog
 */
class Logger {
  log(level: "info" | "error" | "warn", message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
  }

  info(message: string): void {
    this.log("info", message);
  }

  error(message: string): void {
    this.log("error", message);
  }

  warn(message: string): void {
    this.log("warn", message);
  }
}

/**
 * 6. Report Generator (SOLO reportes)
 *
 * Responsabilidad: Generar reportes
 * Razón para cambiar: Formato de reportes cambia
 */
class PaymentReportGenerator {
  generate(payment: Payment): string {
    return `
=== PAYMENT REPORT ===
ID:       ${payment.id}
Amount:   $${(payment.amount / 100).toFixed(2)}
Currency: ${payment.currency}
Customer: ${payment.customerId}
Status:   ${payment.status}
Date:     ${new Date(payment.createdAt).toLocaleString()}
=====================
`.trim();
  }

  generateSummary(payments: Payment[]): string {
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    const succeeded = payments.filter((p) => p.status === "succeeded").length;

    return `
=== PAYMENTS SUMMARY ===
Total Payments:     ${payments.length}
Successful:         ${succeeded}
Total Amount:       $${(total / 100).toFixed(2)}
========================
`.trim();
  }
}

/**
 * 7. Payment Processor (SOLO lógica de procesamiento)
 *
 * Responsabilidad: Orquestar el procesamiento de pago
 * Razón para cambiar: Flujo de procesamiento cambia
 *
 * 🏢 BIG TECH: Este es el "service layer"
 *
 * 💡 NOTA: Coordina otros componentes, pero NO hace todo él mismo
 */
class PaymentProcessor {
  constructor(
    private validator: PaymentValidator,
    private repository: PaymentRepository,
    private notificationService: NotificationService,
    private logger: Logger
  ) {}

  async process(payment: Payment): Promise<void> {
    this.logger.info(`Processing payment ${payment.id}`);

    // Delegar validación
    const validation = this.validator.validate(payment);
    if (!validation.valid) {
      this.logger.error(`Validation failed: ${validation.errors.join(", ")}`);
      throw new Error(`Invalid payment: ${validation.errors.join(", ")}`);
    }

    // Simular procesamiento
    await this.simulatePaymentGateway(payment);

    // Actualizar estado
    payment.status = "succeeded";

    // Delegar persistencia
    this.repository.save(payment);

    // Delegar notificaciones
    this.notificationService.notify(
      payment.customerId,
      `Payment ${payment.id} processed successfully`
    );

    this.logger.info(`Payment ${payment.id} processed successfully`);
  }

  private async simulatePaymentGateway(payment: Payment): Promise<void> {
    // Simular llamada a gateway (Stripe, PayPal, etc.)
    return new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// ============================================
// DEMOSTRACIÓN: Comparación
// ============================================

console.log("=".repeat(60));
console.log("🎯 DEMOSTRACIÓN: Single Responsibility Principle");
console.log("=".repeat(60));

console.log("\n❌ VIOLACIÓN DE SRP:");
console.log("Clase PaymentBad hace TODO (6 responsabilidades)");
const badPayment = new PaymentBad("pay_bad", 5000, "USD", "cus_123", "pending");
badPayment.process();
console.log(badPayment.generateReport());

console.log("\n✅ CUMPLIMIENTO DE SRP:");
console.log("Cada clase tiene UNA responsabilidad");

// Crear componentes separados
const validator = new PaymentValidator();
const repository = new PaymentRepository();
const emailNotifier = new EmailNotifier();
const smsNotifier = new SMSNotifier();
const notificationService = new NotificationService([emailNotifier, smsNotifier]);
const logger = new Logger();
const processor = new PaymentProcessor(validator, repository, notificationService, logger);

// Crear pago
const goodPayment: Payment = {
  id: "pay_good",
  amount: 5000,
  currency: "USD",
  customerId: "cus_456",
  status: "pending",
  createdAt: Date.now(),
};

// Procesar con responsabilidades separadas
processor.process(goodPayment);

// Generar reporte (responsabilidad separada)
const reportGenerator = new PaymentReportGenerator();
console.log("\n" + reportGenerator.generate(goodPayment));

// ============================================
// MÁS EJEMPLOS DE SRP
// ============================================

/**
 * EJEMPLO: User Management
 *
 * ❌ MAL: class UserManager
 * class UserManager {
 *   validateUser()
 *   saveUser()
 *   sendWelcomeEmail()
 *   hashPassword()
 *   generateReport()
 * }
 *
 * ✅ BIEN: Separar responsabilidades
 */

// User Model (solo datos)
interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

// User Validator (solo validación)
class UserValidator {
  validateEmail(email: string): boolean {
    return email.includes("@");
  }

  validatePassword(password: string): boolean {
    return password.length >= 8;
  }
}

// Password Hasher (solo hashing)
class PasswordHasher {
  hash(password: string): string {
    // En real: bcrypt
    return `hashed_${password}`;
  }

  compare(password: string, hash: string): boolean {
    return this.hash(password) === hash;
  }
}

// User Repository (solo persistencia)
class UserRepository {
  private users = new Map<string, User>();

  save(user: User): void {
    this.users.set(user.id, user);
  }

  findByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }
}

// User Service (orquestación)
class UserService {
  constructor(
    private validator: UserValidator,
    private hasher: PasswordHasher,
    private repository: UserRepository,
    private notifier: EmailNotifier
  ) {}

  register(email: string, password: string): User {
    // Delegar validación
    if (!this.validator.validateEmail(email)) {
      throw new Error("Invalid email");
    }
    if (!this.validator.validatePassword(password)) {
      throw new Error("Invalid password");
    }

    // Delegar hashing
    const passwordHash = this.hasher.hash(password);

    // Crear usuario
    const user: User = {
      id: `usr_${Date.now()}`,
      email,
      passwordHash,
      createdAt: Date.now(),
    };

    // Delegar persistencia
    this.repository.save(user);

    // Delegar notificación
    this.notifier.send(email, "Welcome!");

    return user;
  }
}

// ============================================
// CASOS DE USO EN BILLING & PAYMENTS
// ============================================

/**
 * 💰 APLICACIONES EN SISTEMAS DE BILLING:
 *
 * 1. SEPARAR VALIDACIÓN:
 *    - PaymentValidator (reglas de negocio)
 *    - CreditCardValidator (Luhn algorithm)
 *    - InvoiceValidator (fechas, montos)
 *
 * 2. SEPARAR PERSISTENCIA:
 *    - PaymentRepository
 *    - CustomerRepository
 *    - InvoiceRepository
 *
 * 3. SEPARAR NOTIFICACIONES:
 *    - EmailNotifier
 *    - SMSNotifier
 *    - WebhookNotifier
 *
 * 4. SEPARAR REPORTES:
 *    - PaymentReportGenerator
 *    - RevenueReportGenerator
 *    - TaxReportGenerator
 *
 * 5. SEPARAR PROCESAMIENTO:
 *    - StripeGateway
 *    - PayPalGateway
 *    - Cada uno solo habla con su API
 *
 * 6. SEPARAR LOGGING:
 *    - AuditLogger (compliance)
 *    - ErrorLogger (debugging)
 *    - MetricsLogger (analytics)
 *
 * 🏢 EJEMPLO REAL - STRIPE:
 * Stripe.js library separation:
 * - stripe-js (client SDK)
 * - stripe (server SDK)
 * - stripe-terminal (hardware)
 * - stripe-react-native (mobile)
 * Cada librería tiene UNA responsabilidad
 */

console.log("\n" + "=".repeat(60));
console.log("💡 BENEFICIOS DE SRP");
console.log("=".repeat(60));

/**
 * ✅ VENTAJAS:
 *
 * 1. MANTENIBILIDAD:
 *    - Cambios localizados
 *    - Menor riesgo de bugs
 *    - Código más fácil de entender
 *
 * 2. TESTABILIDAD:
 *    - Tests unitarios enfocados
 *    - Fácil de mockear dependencias
 *    - Tests más rápidos
 *
 * 3. REUSABILIDAD:
 *    - Componentes independientes
 *    - Fácil de compartir entre proyectos
 *    - Composición flexible
 *
 * 4. PARALELIZACIÓN:
 *    - Equipos pueden trabajar en componentes separados
 *    - Menos conflictos de merge
 *
 * 5. ESCALABILIDAD:
 *    - Cada componente puede escalar independientemente
 *    - Microservicios alignment
 *
 * ⚠️ SEÑALES DE VIOLACIÓN:
 *
 * 1. NOMBRES CON "AND":
 *    ❌ UserAndPaymentManager
 *    ❌ ValidateAndSave
 *    Indica múltiples responsabilidades
 *
 * 2. NOMBRES CON "Manager" O "Handler":
 *    ⚠️ PaymentManager (¿qué gestiona exactamente?)
 *    ✅ PaymentProcessor (específico)
 *
 * 3. MUCHOS IMPORTS:
 *    Si una clase importa 10+ cosas, probablemente hace demasiado
 *
 * 4. TESTS COMPLEJOS:
 *    Si necesitas 10+ mocks, la clase tiene muchas dependencias
 *
 * 5. CAMBIOS FRECUENTES:
 *    Si cambias una clase por múltiples razones, viola SRP
 */

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cómo defines "una responsabilidad"?
 *    Pista: Una razón para cambiar
 *
 * 2. ¿Puede ser SRP demasiado granular?
 *    Pista: Sí, balance entre cohesión y complejidad
 *
 * 3. ¿Cómo SRP se relaciona con microservicios?
 *    Pista: Cada servicio = una responsabilidad
 *
 * 4. ¿Qué es cohesión y cómo se relaciona con SRP?
 *    Pista: Alta cohesión = métodos relacionados juntos
 *
 * 5. ¿Service layer viola SRP si coordina múltiples cosas?
 *    Pista: No, orquestación ES su responsabilidad
 *
 * 6. ¿Cómo aplicar SRP a funciones?
 *    Pista: Cada función debe hacer una cosa
 *
 * 7. ¿SRP aplica a módulos/packages?
 *    Pista: Sí, cada módulo debe tener un propósito claro
 *
 * 8. ¿Cómo refactorizar código que viola SRP?
 *    Pista: Extract class, extract method, dependency injection
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Identifica violaciones de SRP en este código:
 *    class OrderProcessor {
 *      validateOrder()
 *      calculateTotal()
 *      applyDiscount()
 *      chargeCard()
 *      sendEmail()
 *      updateInventory()
 *      generateInvoice()
 *    }
 *    Refactoriza en clases con responsabilidad única
 *
 * 2. INTERMEDIO:
 *    Diseña un sistema de facturación siguiendo SRP:
 *    - Invoice (modelo)
 *    - InvoiceValidator
 *    - InvoiceRepository
 *    - InvoiceGenerator (crear PDFs)
 *    - InvoiceService (orquestación)
 *
 * 3. AVANZADO:
 *    Implementa un sistema de subscripciones:
 *    - Separar billing, notifications, analytics
 *    - Cada componente con SRP
 *    - Integración vía service layer
 *
 * 4. EXPERTO:
 *    Refactoriza un sistema legacy que viola SRP:
 *    - Identificar responsabilidades mezcladas
 *    - Extraer clases siguiendo SRP
 *    - Mantener backward compatibility
 *    - Tests antes y después
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Una clase, una responsabilidad!");
console.log("=".repeat(60));

export {
  Payment,
  PaymentValidator,
  PaymentRepository,
  NotificationChannel,
  EmailNotifier,
  SMSNotifier,
  NotificationService,
  Logger,
  PaymentReportGenerator,
  PaymentProcessor,
  User,
  UserValidator,
  PasswordHasher,
  UserRepository,
  UserService,
};
