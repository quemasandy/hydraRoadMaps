/**
 * ==========================================
 * SINGLETON PATTERN
 * (Patrón Creacional)
 * ==========================================
 *
 * 🔑 CONCEPTO FUNDAMENTAL:
 *
 * El patrón Singleton asegura que una clase tenga SOLO UNA INSTANCIA
 * y provee un punto de acceso GLOBAL a esa instancia.
 *
 * Características clave:
 * 1. **Una sola instancia**: Constructor privado previene instanciación externa
 * 2. **Acceso global**: Método estático getInstance() provee acceso
 * 3. **Lazy initialization**: Instancia se crea solo cuando se necesita
 * 4. **Thread-safe**: En ambientes concurrentes, debe manejar race conditions
 *
 * 📚 CUÁNDO USAR SINGLETON:
 *
 * ✅ CASOS APROPIADOS:
 * - Configuration manager (una sola fuente de config)
 * - Logger (centralizar logging)
 * - Connection pool (compartir conexiones)
 * - Cache manager (un solo cache)
 * - Event bus (un solo bus de eventos)
 *
 * ⚠️ EVITAR SINGLETON CUANDO:
 * - Necesitas múltiples instancias con diferentes configs
 * - Dificulta testing (estado global)
 * - Crea acoplamiento global
 * - Viola Single Responsibility (gestiona su creación + su función)
 *
 * 🏢 USO EN BIG TECH:
 *
 * **Stripe:**
 * - ConfigurationManager: Una sola instancia de configuración global
 * - Logger: Logging centralizado para toda la aplicación
 * - RateLimiter: Un solo rate limiter compartido
 * - Nota: Stripe prefiere Dependency Injection sobre Singletons
 *
 * **Google:**
 * - gflags: System-wide configuration flags
 * - Thread pools: Singleton para pool de workers
 * - Metric collectors: Un solo collector por proceso
 *
 * **Netflix:**
 * - Hystrix Config: Circuit breaker configuration
 * - ApplicationContext: Estado de aplicación
 *
 * **Amazon:**
 * - AWS SDK clients a menudo son singletons dentro de una app
 * - Connection pools para DynamoDB, S3, etc.
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - **Control de recursos**: Evita múltiples instancias costosas
 * - **Consistencia de estado**: Un solo punto de verdad
 * - **Acceso global**: Disponible en toda la aplicación
 * - **Lazy initialization**: Solo se crea cuando se necesita
 *
 * ⚠️ CONTROVERSIA:
 * - Considerado "anti-pattern" por muchos
 * - Dificulta testing (estado global compartido)
 * - Crea acoplamiento oculto
 * - Alternativas modernas: Dependency Injection
 */

// ==========================================
// SECCIÓN 1: IMPLEMENTACIÓN BÁSICA DE SINGLETON
// ==========================================

/**
 * ✅ Singleton clásico en TypeScript
 */

class BasicSingleton {
  // ✅ 1. Instancia privada estática
  private static instance: BasicSingleton;

  // ✅ 2. Constructor PRIVADO (no se puede hacer `new BasicSingleton()`)
  private constructor() {
    console.log('BasicSingleton instance created');
  }

  // ✅ 3. Método estático público para acceder a la instancia
  public static getInstance(): BasicSingleton {
    if (!BasicSingleton.instance) {
      BasicSingleton.instance = new BasicSingleton();
    }
    return BasicSingleton.instance;
  }

  // Métodos públicos de la instancia
  public doSomething(): void {
    console.log('BasicSingleton doing something');
  }
}

// Uso
function demoBasicSingleton() {
  // ❌ Esto no funciona (constructor es privado)
  // const instance1 = new BasicSingleton(); // Error!

  // ✅ Forma correcta: usar getInstance()
  const instance1 = BasicSingleton.getInstance();
  const instance2 = BasicSingleton.getInstance();

  console.log(instance1 === instance2); // true - MISMA instancia

  instance1.doSomething();
}

// ==========================================
// SECCIÓN 2: SINGLETON PARA CONFIGURATION MANAGER
// Caso de uso real en billing systems
// ==========================================

/**
 * 💰 CASO REAL: Configuration Manager para sistema de pagos
 *
 * Una sola fuente de configuración compartida en toda la aplicación
 */

interface PaymentConfig {
  stripeApiKey: string;
  stripePublishableKey: string;
  environment: 'test' | 'production';
  webhookSecret: string;
  maxRetries: number;
  timeoutMs: number;
  supportedCurrencies: string[];
}

class ConfigurationManager {
  private static instance: ConfigurationManager;
  private config: PaymentConfig;

  private constructor() {
    // ✅ Cargar configuración (solo UNA VEZ)
    this.config = this.loadConfiguration();
    console.log('Configuration loaded');
  }

  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  private loadConfiguration(): PaymentConfig {
    // En real: cargaría de environment variables, archivo, etc.
    return {
      stripeApiKey: process.env.STRIPE_API_KEY || 'sk_test_123',
      stripePublishableKey: process.env.STRIPE_PK || 'pk_test_123',
      environment: 'test',
      webhookSecret: 'whsec_test_secret',
      maxRetries: 3,
      timeoutMs: 5000,
      supportedCurrencies: ['USD', 'EUR', 'GBP']
    };
  }

  // ✅ Getters para acceder a configuración
  public getStripeApiKey(): string {
    return this.config.stripeApiKey;
  }

  public getEnvironment(): 'test' | 'production' {
    return this.config.environment;
  }

  public getMaxRetries(): number {
    return this.config.maxRetries;
  }

  public getSupportedCurrencies(): string[] {
    return [...this.config.supportedCurrencies]; // Retornar copia
  }

  public isProduction(): boolean {
    return this.config.environment === 'production';
  }

  // ✅ Método para actualizar config (usado en tests)
  public updateConfig(partial: Partial<PaymentConfig>): void {
    this.config = { ...this.config, ...partial };
  }
}

// Uso en diferentes partes de la aplicación
function useConfiguration() {
  // Servicio de pagos usa config
  class PaymentService {
    processPayment() {
      const config = ConfigurationManager.getInstance();
      const apiKey = config.getStripeApiKey();
      console.log(`Processing payment with API key: ${apiKey}`);
    }
  }

  // Controller usa config
  class PaymentController {
    handleWebhook() {
      const config = ConfigurationManager.getInstance();
      if (config.isProduction()) {
        console.log('Production webhook');
      }
    }
  }

  // ✅ Ambos usan LA MISMA instancia de configuración
  const service = new PaymentService();
  const controller = new PaymentController();

  service.processPayment();
  controller.handleWebhook();
}

// ==========================================
// SECCIÓN 3: SINGLETON PARA LOGGER
// Logging centralizado
// ==========================================

/**
 * ✅ Logger singleton - común en aplicaciones de producción
 */

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: Array<{ level: LogLevel; message: string; timestamp: number }> = [];

  private constructor() {
    console.log('Logger initialized');
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public debug(message: string): void {
    this.log(LogLevel.DEBUG, message);
  }

  public info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  public warn(message: string): void {
    this.log(LogLevel.WARN, message);
  }

  public error(message: string): void {
    this.log(LogLevel.ERROR, message);
  }

  private log(level: LogLevel, message: string): void {
    if (level >= this.logLevel) {
      const timestamp = Date.now();
      const levelName = LogLevel[level];

      console.log(`[${levelName}] ${message}`);

      // Almacenar log
      this.logs.push({ level, message, timestamp });

      // En producción: enviar a servicio de logging (Datadog, Sentry, etc.)
    }
  }

  public getLogs(): typeof this.logs {
    return [...this.logs]; // Retornar copia
  }

  public clearLogs(): void {
    this.logs = [];
  }
}

// Uso del Logger en sistema de pagos
function useLogger() {
  class PaymentProcessor {
    process(amount: number) {
      const logger = Logger.getInstance();

      logger.info(`Processing payment of ${amount}`);

      if (amount <= 0) {
        logger.error('Invalid amount: must be positive');
        return false;
      }

      logger.debug(`Payment validated, proceeding...`);
      return true;
    }
  }

  class RefundService {
    refund(paymentId: string, amount: number) {
      const logger = Logger.getInstance();

      logger.info(`Refunding ${amount} for payment ${paymentId}`);
      logger.warn('Refunds are irreversible');
    }
  }

  // ✅ Ambos servicios loggean al MISMO logger
  const processor = new PaymentProcessor();
  const refunder = new RefundService();

  processor.process(100);
  refunder.refund('pay_123', 50);

  // Ver todos los logs
  const logger = Logger.getInstance();
  console.log('\nAll logs:', logger.getLogs());
}

// ==========================================
// SECCIÓN 4: SINGLETON PARA CONNECTION POOL
// Compartir conexiones a recursos externos
// ==========================================

/**
 * 💰 CASO REAL: Database Connection Pool
 *
 * Mantener un pool de conexiones compartidas en toda la app
 */

interface DBConnection {
  id: string;
  isActive: boolean;
  query(sql: string): Promise<any>;
}

class DatabaseConnectionPool {
  private static instance: DatabaseConnectionPool;
  private connections: DBConnection[] = [];
  private maxConnections: number = 10;
  private activeConnections: Set<string> = new Set();

  private constructor() {
    console.log('Initializing connection pool');
    this.initializePool();
  }

  public static getInstance(): DatabaseConnectionPool {
    if (!DatabaseConnectionPool.instance) {
      DatabaseConnectionPool.instance = new DatabaseConnectionPool();
    }
    return DatabaseConnectionPool.instance;
  }

  private initializePool(): void {
    // Crear pool inicial de conexiones
    for (let i = 0; i < this.maxConnections; i++) {
      this.connections.push(this.createConnection(i));
    }
  }

  private createConnection(id: number): DBConnection {
    return {
      id: `conn_${id}`,
      isActive: false,
      query: async (sql: string) => {
        console.log(`Executing: ${sql}`);
        return { rows: [] };
      }
    };
  }

  public async getConnection(): Promise<DBConnection> {
    // Buscar conexión disponible
    const available = this.connections.find(conn => !conn.isActive);

    if (!available) {
      throw new Error('No available connections in pool');
    }

    available.isActive = true;
    this.activeConnections.add(available.id);

    return available;
  }

  public releaseConnection(connection: DBConnection): void {
    connection.isActive = false;
    this.activeConnections.delete(connection.id);
  }

  public getStats(): { total: number; active: number; available: number } {
    return {
      total: this.connections.length,
      active: this.activeConnections.size,
      available: this.connections.filter(c => !c.isActive).length
    };
  }
}

// Uso en servicios de billing
async function useConnectionPool() {
  class PaymentRepository {
    async savePayment(paymentId: string, amount: number): Promise<void> {
      const pool = DatabaseConnectionPool.getInstance();
      const conn = await pool.getConnection();

      try {
        await conn.query(
          `INSERT INTO payments VALUES ('${paymentId}', ${amount})`
        );
      } finally {
        pool.releaseConnection(conn);
      }
    }
  }

  class SubscriptionRepository {
    async saveSubscription(subId: string): Promise<void> {
      const pool = DatabaseConnectionPool.getInstance();
      const conn = await pool.getConnection();

      try {
        await conn.query(
          `INSERT INTO subscriptions VALUES ('${subId}')`
        );
      } finally {
        pool.releaseConnection(conn);
      }
    }
  }

  // ✅ Ambos repositorios usan EL MISMO pool de conexiones
  const paymentRepo = new PaymentRepository();
  const subRepo = new SubscriptionRepository();

  await paymentRepo.savePayment('pay_1', 5000);
  await subRepo.saveSubscription('sub_1');

  const pool = DatabaseConnectionPool.getInstance();
  console.log('Pool stats:', pool.getStats());
}

// ==========================================
// SECCIÓN 5: SINGLETON CON LAZY INITIALIZATION
// No crear instancia hasta que se necesite
// ==========================================

/**
 * ✅ Cache Manager con lazy initialization
 */

class CacheManager {
  private static instance: CacheManager | null = null;
  private cache: Map<string, { value: any; expiry: number }> = new Map();

  private constructor() {
    console.log('CacheManager created (expensive operation)');
    // Simular operación costosa
  }

  public static getInstance(): CacheManager {
    // ✅ Lazy: solo crear cuando se llama por primera vez
    if (CacheManager.instance === null) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public set(key: string, value: any, ttlSeconds: number = 3600): void {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiry });
  }

  public get(key: string): any | null {
    const item = this.cache.get(key);

    if (!item) return null;

    // Verificar si expiró
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  public clear(): void {
    this.cache.clear();
  }

  public getSize(): number {
    return this.cache.size;
  }
}

// ==========================================
// SECCIÓN 6: PROBLEMAS CON SINGLETON Y TESTING
// ==========================================

/**
 * ⚠️ PROBLEMA: Singletons dificultan testing
 *
 * El estado global compartido entre tests causa problemas
 */

class ProblematicSingleton {
  private static instance: ProblematicSingleton;
  private counter: number = 0;

  private constructor() {}

  public static getInstance(): ProblematicSingleton {
    if (!ProblematicSingleton.instance) {
      ProblematicSingleton.instance = new ProblematicSingleton();
    }
    return ProblematicSingleton.instance;
  }

  public increment(): void {
    this.counter++;
  }

  public getCount(): number {
    return this.counter;
  }
}

// Tests problemáticos
function problematicTests() {
  // Test 1
  function test1() {
    const instance = ProblematicSingleton.getInstance();
    instance.increment();
    console.assert(instance.getCount() === 1);
  }

  // Test 2 (falla porque comparte estado con test1)
  function test2() {
    const instance = ProblematicSingleton.getInstance();
    console.assert(instance.getCount() === 0); // ❌ Falla! Count es 1
  }

  test1();
  test2();
}

/**
 * ✅ SOLUCIÓN: Singleton con reset para testing
 */

class TestableSingleton {
  private static instance: TestableSingleton | null = null;
  private counter: number = 0;

  private constructor() {}

  public static getInstance(): TestableSingleton {
    if (!TestableSingleton.instance) {
      TestableSingleton.instance = new TestableSingleton();
    }
    return TestableSingleton.instance;
  }

  // ✅ Método para resetear (solo para tests)
  public static resetInstance(): void {
    TestableSingleton.instance = null;
  }

  public increment(): void {
    this.counter++;
  }

  public getCount(): number {
    return this.counter;
  }
}

// Tests con reset
function betterTests() {
  function test1() {
    TestableSingleton.resetInstance(); // Reset before test
    const instance = TestableSingleton.getInstance();
    instance.increment();
    console.assert(instance.getCount() === 1);
  }

  function test2() {
    TestableSingleton.resetInstance(); // Reset before test
    const instance = TestableSingleton.getInstance();
    console.assert(instance.getCount() === 0); // ✅ Pasa!
  }

  test1();
  test2();
}

// ==========================================
// SECCIÓN 7: ALTERNATIVA MODERNA - DEPENDENCY INJECTION
// Preferida sobre Singleton
// ==========================================

/**
 * ✅ MEJOR OPCIÓN: Dependency Injection en lugar de Singleton
 *
 * Beneficios:
 * - Fácil de testear (inyectas mocks)
 * - No acoplamiento global
 * - Más flexible (puedes tener múltiples instancias si es necesario)
 */

// En lugar de Singleton:
class PaymentService_Bad {
  processPayment() {
    // ⚠️ Acoplado al ConfigurationManager singleton
    const config = ConfigurationManager.getInstance();
    const apiKey = config.getStripeApiKey();
  }
}

// ✅ Mejor: Dependency Injection
interface IConfigurationManager {
  getStripeApiKey(): string;
  getMaxRetries(): number;
}

class PaymentService_Good {
  // ✅ Depende de abstracción, inyectada vía constructor
  constructor(private config: IConfigurationManager) {}

  processPayment() {
    const apiKey = this.config.getStripeApiKey();
    // Usar apiKey...
  }
}

// Uso con DI
function useDependencyInjection() {
  // En producción: inyectar configuración real
  const config = ConfigurationManager.getInstance();
  const paymentService = new PaymentService_Good(config);

  // En tests: inyectar mock
  const mockConfig: IConfigurationManager = {
    getStripeApiKey: () => 'mock_key',
    getMaxRetries: () => 1
  };
  const testPaymentService = new PaymentService_Good(mockConfig);

  // ✅ Fácil de testear, sin acoplamiento global
}

// ==========================================
// SECCIÓN 8: SINGLETON EN MÓDULOS (Module Pattern)
// Alternativa usando módulos ES6
// ==========================================

/**
 * ✅ Singleton "natural" usando módulos ES6
 *
 * En TypeScript/JavaScript, los módulos ya son singletons
 */

// config.ts (archivo separado en app real)
class ConfigModule {
  private apiKey: string = 'sk_test_123';

  getApiKey(): string {
    return this.apiKey;
  }

  setApiKey(key: string): void {
    this.apiKey = key;
  }
}

// ✅ Exportar UNA instancia (singleton)
const configModule = new ConfigModule();
// export default configModule;

// Uso:
// import config from './config';
// config.getApiKey();

// ==========================================
// MAIN - DEMOSTRACIÓN
// ==========================================

console.log('='.repeat(50));
console.log('SINGLETON PATTERN - DEMOSTRACIÓN');
console.log('='.repeat(50));

console.log('\n1. Basic Singleton:');
demoBasicSingleton();

console.log('\n2. Configuration Manager:');
useConfiguration();

console.log('\n3. Logger Singleton:');
useLogger();

console.log('\n4. Connection Pool:');
useConnectionPool();

console.log('\n5. Testing Issues:');
betterTests();

console.log('\n✅ Cuándo usar Singleton:');
console.log('   - Configuration manager');
console.log('   - Logger centralizado');
console.log('   - Connection pool');
console.log('   - Cache manager');

console.log('\n⚠️ Problemas del Singleton:');
console.log('   - Estado global (dificulta testing)');
console.log('   - Acoplamiento oculto');
console.log('   - Viola Single Responsibility');

console.log('\n✅ Alternativa moderna: Dependency Injection');

// ==========================================
// PREGUNTAS PARA REFLEXIONAR
// ==========================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Por qué Singleton es considerado un "anti-pattern" por muchos?
 *    Pista: Estado global, dificulta testing, acoplamiento
 *
 * 2. ¿Cómo garantizarías thread-safety en un Singleton?
 *    Pista: Double-checked locking, mutex/locks
 *
 * 3. ¿Cuál es la diferencia entre Singleton y un módulo ES6?
 *    Pista: Los módulos ya son singletons por naturaleza
 *
 * 4. ¿Por qué un connection pool es un buen caso de uso para Singleton?
 *    Pista: Recursos limitados, compartir entre toda la app
 *
 * 5. ¿Cómo testarías una clase que depende de un Singleton?
 *    Pista: Método reset(), o mejor usar Dependency Injection
 *
 * 6. ¿Qué es "lazy initialization" y cuál es su beneficio?
 *    Pista: Crear instancia solo cuando se necesita, ahorra recursos
 *
 * 7. ¿Cuándo preferirías Dependency Injection sobre Singleton?
 *    Pista: Casi siempre en aplicaciones modernas
 *
 * 8. ¿Cómo Stripe maneja configuración global sin Singleton?
 *    Pista: Dependency Injection, configuration objects inyectados
 */

// ==========================================
// EJERCICIOS PRÁCTICOS
// ==========================================

/**
 * 📝 EJERCICIO 1 (BÁSICO): Rate Limiter Singleton
 *
 * Implementa un RateLimiter singleton que:
 * - Limita requests por usuario (ej: 100 req/hora)
 * - Método: allowRequest(userId: string): boolean
 * - Resetea contadores cada hora
 * - Provee método getUsage(userId: string): number
 *
 * Ejemplo de uso:
 * ```typescript
 * const limiter = RateLimiter.getInstance();
 * if (limiter.allowRequest('user_123')) {
 *   // Process request
 * }
 * ```
 */

/**
 * 📝 EJERCICIO 2 (INTERMEDIO): Metrics Collector Singleton
 *
 * Implementa un MetricsCollector que:
 * - Recolecta métricas de pagos (success rate, avg amount, etc.)
 * - Métodos:
 *   - recordPayment(amount: number, success: boolean)
 *   - getSuccessRate(): number
 *   - getAverageAmount(): number
 *   - getTotalVolume(): number
 * - Exporta métricas cada 60 segundos (simular con console.log)
 * - Provee método reset() para testing
 *
 * Debe ser singleton porque queremos métricas centralizadas
 */

/**
 * 📝 EJERCICIO 3 (AVANZADO): Event Bus Singleton vs DI
 *
 * Implementa AMBAS versiones de un EventBus:
 *
 * Versión 1: Singleton
 * ```typescript
 * const bus = EventBus.getInstance();
 * bus.subscribe('payment.succeeded', handler);
 * bus.publish('payment.succeeded', data);
 * ```
 *
 * Versión 2: Dependency Injection
 * ```typescript
 * class PaymentService {
 *   constructor(private eventBus: IEventBus) {}
 * }
 * ```
 *
 * Compara:
 * - Facilidad de testing
 * - Acoplamiento
 * - Flexibilidad
 *
 * ¿Cuál preferirías en una app de producción? ¿Por qué?
 */

/**
 * 📝 EJERCICIO 4 (EXPERTO): Redis Cache Singleton con TTL
 *
 * Implementa un CacheManager singleton que simule Redis:
 *
 * Features:
 * - get/set con TTL (time-to-live)
 * - Namespaces (ej: 'payments:', 'customers:')
 * - LRU eviction cuando alcanza max size
 * - Stats: hit rate, miss rate, memory usage
 * - Serialización de objetos complejos
 * - Pattern matching: keys('payment:*')
 *
 * Métodos:
 * ```typescript
 * cache.set('payment:123', data, { ttl: 3600 });
 * cache.get('payment:123');
 * cache.keys('payment:*');
 * cache.getStats(); // { hits, misses, hitRate }
 * ```
 *
 * Desafío extra: Hacer thread-safe (simular concurrent access)
 */

// ==========================================
// EXPORTS
// ==========================================

export {
  // Singletons
  BasicSingleton,
  ConfigurationManager,
  Logger,
  LogLevel,
  DatabaseConnectionPool,
  CacheManager,

  // Good patterns
  PaymentService_Good,
  IConfigurationManager
};
