/**
 * ==========================================
 * ADAPTER PATTERN
 * (Patrón Estructural)
 * ==========================================
 *
 * 🔑 CONCEPTO FUNDAMENTAL:
 *
 * Adapter permite que interfaces INCOMPATIBLES trabajen juntas.
 * Convierte la interface de una clase en otra interface que el cliente espera.
 *
 * También conocido como: Wrapper
 *
 * Características clave:
 * 1. **Adaptación**: Convierte una interface a otra
 * 2. **Reutilización**: Permite usar clases existentes sin modificarlas
 * 3. **Desacoplamiento**: Cliente no depende de clase concreta
 * 4. **Dos tipos**: Class Adapter (herencia) y Object Adapter (composición)
 *
 * 🏢 USO EN BIG TECH:
 *
 * **Stripe:**
 * - Adapters para diferentes payment gateways (PayPal, Square, Braintree)
 * - Stripe presenta interface unificada, internamente adapta cada gateway
 * - Webhook adapters para diferentes formatos de eventos
 *
 * **AWS SDK:**
 * - Adapters para diferentes versiones de APIs
 * - DynamoDB adapter para MongoDB-like interface
 * - S3 adapter para diferentes storage backends
 *
 * **Sistemas de Pagos:**
 * - Adapter para legacy payment systems
 * - Convertir XML responses a JSON
 * - Adaptar diferentes currency formats
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - Integrar código legacy sin modificarlo
 * - Trabajar con librerías de terceros incompatibles
 * - Migración gradual de sistemas
 * - Desacoplar cliente de implementación específica
 */

// ==========================================
// SECCIÓN 1: PROBLEMA SIN ADAPTER
// Incompatibilidad entre interfaces
// ==========================================

/**
 * ⚠️ PROBLEMA: Cliente espera una interface, servicio provee otra
 */

// Interface que el cliente espera
interface PaymentProcessor {
  processPayment(amount: number, currency: string): Promise<boolean>;
}

// Servicio externo con interface diferente (ej: legacy PayPal)
class LegacyPayPalService {
  // ⚠️ Interface incompatible
  public makePayment(amountInCents: number, currencyCode: string): { success: boolean; transactionId: string } {
    console.log(`Legacy PayPal: Processing ${amountInCents} cents in ${currencyCode}`);
    return { success: true, transactionId: 'PP_' + Date.now() };
  }
}

// ⚠️ Cliente no puede usar LegacyPayPalService directamente
function badClientCode() {
  const paypalService = new LegacyPayPalService();

  // ❌ No implementa PaymentProcessor interface
  // const processor: PaymentProcessor = paypalService; // Error!

  // ⚠️ Cliente debe conocer detalles de implementación
  const result = paypalService.makePayment(5000, 'USD');
  console.log(result.success);
}

// ==========================================
// SECCIÓN 2: ADAPTER PATTERN - OBJECT ADAPTER
// Adaptación por composición (preferida)
// ==========================================

/**
 * ✅ SOLUCIÓN: Adapter que convierte interface
 */

class PayPalAdapter implements PaymentProcessor {
  constructor(private paypalService: LegacyPayPalService) {
    // ✅ Composición: tiene una instancia del servicio
  }

  async processPayment(amount: number, currency: string): Promise<boolean> {
    // ✅ Adaptar: convertir de dólares a centavos
    const amountInCents = Math.round(amount * 100);

    // ✅ Llamar al servicio legacy con su interface
    const result = this.paypalService.makePayment(amountInCents, currency);

    // ✅ Adaptar: convertir response al formato esperado
    return result.success;
  }
}

// ✅ Cliente usa interface uniforme
async function goodClientCode() {
  const legacyPayPal = new LegacyPayPalService();
  const adapter: PaymentProcessor = new PayPalAdapter(legacyPayPal);

  // ✅ Cliente usa interface estándar
  const success = await adapter.processPayment(50.00, 'USD');
  console.log('Payment success:', success);

  // ✅ Cliente no conoce detalles de PayPal legacy
}

// ==========================================
// SECCIÓN 3: MÚLTIPLES ADAPTERS
// Diferentes servicios, misma interface
// ==========================================

/**
 * 💰 CASO REAL: Múltiples payment gateways adaptados
 */

// Servicio externo 1: Stripe (interface moderna)
class StripeService {
  charge(params: { amount: number; currency: string; source: string }): Promise<{ id: string; status: string }> {
    console.log(`Stripe: Charging ${params.amount} ${params.currency}`);
    return Promise.resolve({ id: 'ch_' + Date.now(), status: 'succeeded' });
  }
}

// Servicio externo 2: Square (interface diferente)
class SquareService {
  createPayment(moneyAmount: { amount: number; currency: string }): { payment: { id: string; status: string } } {
    console.log(`Square: Creating payment ${moneyAmount.amount} ${moneyAmount.currency}`);
    return {
      payment: { id: 'sq_' + Date.now(), status: 'COMPLETED' }
    };
  }
}

// Adapter para Stripe
class StripeAdapter implements PaymentProcessor {
  constructor(private stripeService: StripeService) {}

  async processPayment(amount: number, currency: string): Promise<boolean> {
    const result = await this.stripeService.charge({
      amount: amount,
      currency: currency,
      source: 'tok_visa' // Simplificado
    });

    return result.status === 'succeeded';
  }
}

// Adapter para Square
class SquareAdapter implements PaymentProcessor {
  constructor(private squareService: SquareService) {}

  async processPayment(amount: number, currency: string): Promise<boolean> {
    const result = this.squareService.createPayment({
      amount: amount,
      currency: currency
    });

    return result.payment.status === 'COMPLETED';
  }
}

// ✅ Cliente unificado para todos los gateways
async function useMultipleGateways() {
  const processors: PaymentProcessor[] = [
    new StripeAdapter(new StripeService()),
    new SquareAdapter(new SquareService()),
    new PayPalAdapter(new LegacyPayPalService())
  ];

  for (const processor of processors) {
    // ✅ Misma interface para todos
    await processor.processPayment(100.00, 'USD');
  }
}

// ==========================================
// SECCIÓN 4: ADAPTER BIDIRECCIONAL
// Convertir en ambas direcciones
// ==========================================

/**
 * ✅ Adapter que funciona en ambas direcciones
 */

// Sistema moderno
interface ModernInvoice {
  id: string;
  customerEmail: string;
  totalAmount: number;
  items: Array<{ description: string; price: number }>;
}

// Sistema legacy
interface LegacyInvoiceData {
  invoice_number: string;
  customer_email_address: string;
  total_in_cents: number;
  line_items: Array<{ desc: string; amount_cents: number }>;
}

class InvoiceAdapter {
  // Moderno → Legacy
  static toLegacy(modern: ModernInvoice): LegacyInvoiceData {
    return {
      invoice_number: modern.id,
      customer_email_address: modern.customerEmail,
      total_in_cents: Math.round(modern.totalAmount * 100),
      line_items: modern.items.map(item => ({
        desc: item.description,
        amount_cents: Math.round(item.price * 100)
      }))
    };
  }

  // Legacy → Moderno
  static toModern(legacy: LegacyInvoiceData): ModernInvoice {
    return {
      id: legacy.invoice_number,
      customerEmail: legacy.customer_email_address,
      totalAmount: legacy.total_in_cents / 100,
      items: legacy.line_items.map(item => ({
        description: item.desc,
        price: item.amount_cents / 100
      }))
    };
  }
}

// Uso bidireccional
function useBidirectionalAdapter() {
  const modernInvoice: ModernInvoice = {
    id: 'INV-001',
    customerEmail: 'customer@example.com',
    totalAmount: 150.50,
    items: [
      { description: 'Product A', price: 100.00 },
      { description: 'Product B', price: 50.50 }
    ]
  };

  // Convertir a legacy para enviar a sistema antiguo
  const legacy = InvoiceAdapter.toLegacy(modernInvoice);
  console.log('Legacy format:', legacy);

  // Recibir de legacy y convertir a moderno
  const backToModern = InvoiceAdapter.toModern(legacy);
  console.log('Back to modern:', backToModern);
}

// ==========================================
// SECCIÓN 5: ADAPTER PARA API EXTERNA
// Caso de uso real: Integración de APIs
// ==========================================

/**
 * 💰 CASO REAL: Adapter para API de currency conversion
 */

// API externa (ej: exchangerate-api.com)
interface ExternalCurrencyAPI {
  getRates(baseCurrency: string): Promise<{
    base: string;
    rates: Record<string, number>;
    timestamp: number;
  }>;
}

// Interface que nuestro sistema espera
interface CurrencyConverter {
  convert(amount: number, from: string, to: string): Promise<number>;
  getRate(from: string, to: string): Promise<number>;
}

class CurrencyAPIAdapter implements CurrencyConverter {
  constructor(private externalAPI: ExternalCurrencyAPI) {}

  async convert(amount: number, from: string, to: string): Promise<number> {
    const rate = await this.getRate(from, to);
    return amount * rate;
  }

  async getRate(from: string, to: string): Promise<number> {
    // ✅ Adaptar: obtener rates de API externa
    const response = await this.externalAPI.getRates(from);

    if (!response.rates[to]) {
      throw new Error(`Rate not found for ${to}`);
    }

    return response.rates[to];
  }
}

// Mock de API externa
class MockExternalCurrencyAPI implements ExternalCurrencyAPI {
  async getRates(baseCurrency: string): Promise<{ base: string; rates: Record<string, number>; timestamp: number }> {
    return {
      base: baseCurrency,
      rates: {
        'USD': 1.0,
        'EUR': 0.85,
        'GBP': 0.73,
        'JPY': 110.0
      },
      timestamp: Date.now()
    };
  }
}

// Uso del adapter
async function useCurrencyAdapter() {
  const externalAPI = new MockExternalCurrencyAPI();
  const converter: CurrencyConverter = new CurrencyAPIAdapter(externalAPI);

  const amountInEur = await converter.convert(100, 'USD', 'EUR');
  console.log('100 USD =', amountInEur, 'EUR');
}

// ==========================================
// SECCIÓN 6: CLASS ADAPTER (Herencia múltiple)
// En TypeScript: usar interfaces
// ==========================================

/**
 * ⚠️ Class Adapter (menos común en TS)
 *
 * TypeScript no tiene herencia múltiple,
 * pero podemos simular con interfaces
 */

// Servicio existente
class XMLProcessor {
  parseXML(xml: string): object {
    console.log('Parsing XML:', xml);
    return { parsed: true };
  }
}

// Interface objetivo
interface JSONProcessor {
  parseJSON(json: string): object;
}

// Class Adapter: extiende XMLProcessor e implementa JSONProcessor
class XMLToJSONAdapter extends XMLProcessor implements JSONProcessor {
  parseJSON(json: string): object {
    // Convertir JSON a XML
    const xml = this.jsonToXML(json);

    // Usar método heredado de XMLProcessor
    return this.parseXML(xml);
  }

  private jsonToXML(json: string): string {
    // Conversión simplificada
    return `<root>${json}</root>`;
  }
}

// ==========================================
// SECCIÓN 7: ADAPTER CON CACHE
// Optimización con caching
// ==========================================

/**
 * ✅ Adapter que agrega funcionalidad (caching)
 */

class CachedCurrencyAdapter implements CurrencyConverter {
  private cache: Map<string, { rate: number; timestamp: number }> = new Map();
  private cacheDuration: number = 60000; // 1 minuto

  constructor(private externalAPI: ExternalCurrencyAPI) {}

  async convert(amount: number, from: string, to: string): Promise<number> {
    const rate = await this.getRate(from, to);
    return amount * rate;
  }

  async getRate(from: string, to: string): Promise<number> {
    const cacheKey = `${from}-${to}`;
    const cached = this.cache.get(cacheKey);

    // ✅ Retornar de cache si válido
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      console.log('Using cached rate');
      return cached.rate;
    }

    // Obtener de API
    console.log('Fetching fresh rate from API');
    const response = await this.externalAPI.getRates(from);
    const rate = response.rates[to];

    // Guardar en cache
    this.cache.set(cacheKey, { rate, timestamp: Date.now() });

    return rate;
  }
}

// ==========================================
// MAIN - DEMOSTRACIÓN
// ==========================================

console.log('='.repeat(50));
console.log('ADAPTER PATTERN - DEMOSTRACIÓN');
console.log('='.repeat(50));

console.log('\n1. PayPal Adapter:');
goodClientCode();

console.log('\n2. Múltiples Gateways:');
useMultipleGateways();

console.log('\n3. Adapter Bidireccional:');
useBidirectionalAdapter();

console.log('\n4. Currency Converter:');
useCurrencyAdapter();

console.log('\n✅ Beneficios del Adapter:');
console.log('   - Reutilizar código existente sin modificarlo');
console.log('   - Integrar servicios con interfaces incompatibles');
console.log('   - Desacoplar cliente de implementaciones específicas');

// ==========================================
// PREGUNTAS PARA REFLEXIONAR
// ==========================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuál es la diferencia entre Adapter y Facade?
 *    Pista: Adapter convierte interface, Facade simplifica
 *
 * 2. ¿Cuándo usar Object Adapter vs Class Adapter?
 *    Pista: Object Adapter (composición) es más flexible
 *
 * 3. ¿Cómo Stripe usa Adapter para payment gateways?
 *    Pista: Interface unificada, adapta PayPal, Square, etc.
 *
 * 4. ¿Adapter viola Open/Closed Principle?
 *    Pista: No, extiendes sin modificar código existente
 *
 * 5. ¿Cuándo es apropiado agregar funcionalidad en Adapter (ej: cache)?
 *    Pista: Cuando mejora sin cambiar semántica básica
 *
 * 6. ¿Adapter bidireccional es buena práctica?
 *    Pista: Útil para migración, pero puede indicar mal diseño
 *
 * 7. ¿Cómo testarías un Adapter?
 *    Pista: Mock del servicio adaptado, verificar conversión
 *
 * 8. ¿Adapter puede adaptarse a múltiples interfaces?
 *    Pista: Sí, implementar múltiples interfaces objetivo
 */

// ==========================================
// EJERCICIOS PRÁCTICOS
// ==========================================

/**
 * 📝 EJERCICIO 1 (BÁSICO): Logger Adapter
 *
 * Crea adapters para diferentes logging libraries:
 * - Winston logger (interface compleja)
 * - Console.log (interface simple)
 * - Tu interface: SimpleLogger con log(), error(), warn()
 *
 * Debe permitir cambiar de logger sin modificar código cliente.
 */

/**
 * 📝 EJERCICIO 2 (INTERMEDIO): Storage Adapter
 *
 * Adapta diferentes storage backends:
 * - localStorage (browser)
 * - AsyncStorage (React Native)
 * - Redis (Node.js)
 *
 * Interface común:
 * - get(key: string): Promise<string | null>
 * - set(key: string, value: string): Promise<void>
 * - delete(key: string): Promise<void>
 *
 * Cada adapter debe manejar serialización/deserialización.
 */

/**
 * 📝 EJERCICIO 3 (AVANZADO): Multi-Gateway Payment Adapter
 *
 * Implementa adapters para 3 payment gateways reales:
 * - Stripe
 * - PayPal
 * - Square
 *
 * Features:
 * - Interface común con todos los métodos
 * - Manejo de errores específicos de cada gateway
 * - Webhook adapters (cada gateway tiene formato diferente)
 * - Idempotency keys
 * - Retry logic
 *
 * Debe poder cambiar gateway sin modificar lógica de negocio.
 */

/**
 * 📝 EJERCICIO 4 (EXPERTO): Legacy System Migration Adapter
 *
 * Diseña sistema de migración gradual:
 *
 * Escenario:
 * - Sistema legacy (SOAP XML) debe migrar a REST JSON
 * - No se puede hacer big bang migration
 * - Necesitas soportar ambos durante transición
 *
 * Requisitos:
 * - Adapter bidireccional (XML ↔ JSON)
 * - Feature flags para decidir qué sistema usar
 * - Logging de qué sistema se usó (métricas de migración)
 * - Fallback si nuevo sistema falla
 * - Comparación de responses (verificar consistencia)
 *
 * Inspiración: Cómo Stripe migró de monolito a microservicios
 */

// ==========================================
// EXPORTS
// ==========================================

export {
  // Interfaces
  PaymentProcessor,
  CurrencyConverter,
  ModernInvoice,
  LegacyInvoiceData,

  // Adapters
  PayPalAdapter,
  StripeAdapter,
  SquareAdapter,
  InvoiceAdapter,
  CurrencyAPIAdapter,
  CachedCurrencyAdapter
};
