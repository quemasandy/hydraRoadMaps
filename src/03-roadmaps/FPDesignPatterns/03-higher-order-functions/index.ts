/**
 * ==========================================
 * HIGHER-ORDER FUNCTIONS (HOF)
 * ==========================================
 *
 * Las funciones de orden superior son funciones que operan sobre otras funciones,
 * ya sea recibiéndolas como argumentos o retornándolas.
 * Son fundamentales en programación funcional.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Functions as first-class citizens (funciones como valores)
 * - Functions que reciben functions como parámetros
 * - Functions que retornan functions
 * - Abstracción de patrones comunes
 * - Composición y reusabilidad
 *
 * 🏢 USO EN BIG TECH:
 * Array.map, Array.filter, Array.reduce (HOF nativos de JS)
 * React hooks (useState, useEffect - HOF)
 * Express middleware (HOF)
 * RxJS operators (HOF sobre observables)
 * Lodash/Ramda (bibliotecas completas de HOF)
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * Las HOF permiten:
 * - Abstracción de patrones repetitivos
 * - Código más declarativo y legible
 * - Reutilización extrema
 * - Composición de comportamiento
 * - Testing más simple
 */

// ============================================
// EJEMPLO 1: HOF que recibe función
// ============================================

/**
 * HOF que ejecuta una función dos veces
 */
function twice<T>(fn: (x: T) => T, value: T): T {
  return fn(fn(value));
}

const addOne = (x: number) => x + 1;
const multiplyByTwo = (x: number) => x * 2;

console.log("=".repeat(50));
console.log("🎯 EJEMPLO 1: HOF que recibe función");
console.log("=".repeat(50));

console.log("\ntwice(addOne, 5):", twice(addOne, 5)); // (5 + 1) + 1 = 7
console.log("twice(multiplyByTwo, 3):", twice(multiplyByTwo, 3)); // (3 * 2) * 2 = 12

// ============================================
// EJEMPLO 2: HOF que retorna función
// ============================================

/**
 * HOF que crea multiplicadores personalizados
 */
function createMultiplier(factor: number): (x: number) => number {
  return (x: number) => x * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const times10 = createMultiplier(10);

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 2: HOF que retorna función");
console.log("=".repeat(50));

console.log("\ndouble(5):", double(5)); // 10
console.log("triple(5):", triple(5)); // 15
console.log("times10(5):", times10(5)); // 50

// ============================================
// EJEMPLO 3: Array HOF Nativos
// ============================================

interface User {
  id: number;
  name: string;
  age: number;
  isActive: boolean;
}

const users: User[] = [
  { id: 1, name: "Alice", age: 25, isActive: true },
  { id: 2, name: "Bob", age: 30, isActive: false },
  { id: 3, name: "Charlie", age: 35, isActive: true },
  { id: 4, name: "Diana", age: 28, isActive: true },
];

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 3: Array HOF (map, filter, reduce)");
console.log("=".repeat(50));

// map: Transformar cada elemento
const names = users.map((user) => user.name);
console.log("\nNombres (map):", names);

// filter: Filtrar elementos
const activeUsers = users.filter((user) => user.isActive);
console.log("\nUsuarios activos (filter):", activeUsers.map((u) => u.name));

// reduce: Reducir a un valor
const totalAge = users.reduce((sum, user) => sum + user.age, 0);
console.log("\nSuma de edades (reduce):", totalAge);

// Combinar HOF
const activeUsersAges = users
  .filter((user) => user.isActive)
  .map((user) => user.age)
  .reduce((sum, age) => sum + age, 0);

console.log("\nSuma de edades de usuarios activos:", activeUsersAges);

// ============================================
// EJEMPLO 4: Crear HOF Personalizadas
// ============================================

/**
 * HOF para logging automático
 */
function withLogging<T extends any[], R>(
  fn: (...args: T) => R,
  fnName: string,
): (...args: T) => R {
  return (...args: T) => {
    console.log(`[LOG] Calling ${fnName} with args:`, args);
    const result = fn(...args);
    console.log(`[LOG] ${fnName} returned:`, result);
    return result;
  };
}

const add = (a: number, b: number) => a + b;
const loggedAdd = withLogging(add, "add");

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 4: HOF Personalizada - Logging");
console.log("=".repeat(50));

console.log("\nResultado:", loggedAdd(5, 3));

/**
 * HOF para memoización
 */
function memoize<T extends string | number, R>(
  fn: (arg: T) => R,
): (arg: T) => R {
  const cache = new Map<T, R>();

  return (arg: T): R => {
    if (cache.has(arg)) {
      console.log(`  📦 Cache hit for: ${arg}`);
      return cache.get(arg)!;
    }

    console.log(`  🔄 Computing for: ${arg}`);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

const expensiveOperation = (n: number): number => {
  // Simular operación costosa
  let result = 0;
  for (let i = 0; i < n * 1000000; i++) {
    result += i;
  }
  return result;
};

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 5: HOF Personalizada - Memoización");
console.log("=".repeat(50));

const memoizedExpensive = memoize(expensiveOperation);

console.log("\nPrimera llamada (calcula):");
memoizedExpensive(10);

console.log("\nSegunda llamada (cache):");
memoizedExpensive(10);

// ============================================
// EJEMPLO 6: HOF para Validación
// ============================================

type Validator<T> = (value: T) => boolean;

/**
 * HOF que combina múltiples validadores
 */
function combineValidators<T>(
  ...validators: Validator<T>[]
): Validator<T> {
  return (value: T) => validators.every((validator) => validator(value));
}

// Validadores individuales
const isNotEmpty = (str: string) => str.trim().length > 0;
const isLongEnough = (str: string) => str.length >= 8;
const hasUpperCase = (str: string) => /[A-Z]/.test(str);
const hasNumber = (str: string) => /[0-9]/.test(str);

// Combinar validadores usando HOF
const isValidPassword = combineValidators(
  isNotEmpty,
  isLongEnough,
  hasUpperCase,
  hasNumber,
);

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 6: HOF para Validación");
console.log("=".repeat(50));

const passwords = ["weak", "StrongPass", "Strong123", "strong123"];

console.log("\nValidando passwords:");
passwords.forEach((pwd) => {
  const isValid = isValidPassword(pwd);
  console.log(`  ${isValid ? "✅" : "❌"} "${pwd}"`);
});

// ============================================
// EJEMPLO 7: HOF para Retry Logic
// ============================================

/**
 * HOF que añade reintentos a una función asíncrona
 */
function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000,
): () => Promise<T> {
  return async () => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`  🔄 Attempt ${attempt}/${maxAttempts}`);
        return await fn();
      } catch (error) {
        if (attempt === maxAttempts) {
          console.log(`  ❌ All attempts failed`);
          throw error;
        }
        console.log(`  ⚠️ Attempt ${attempt} failed, retrying...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error("Unreachable");
  };
}

// Simular API call que puede fallar
let attemptCount = 0;
const unreliableAPICall = async (): Promise<string> => {
  attemptCount++;
  if (attemptCount < 3) {
    throw new Error("Network error");
  }
  return "Success!";
};

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 7: HOF para Retry Logic");
console.log("=".repeat(50));

const reliableAPICall = withRetry(unreliableAPICall, 3, 100);

console.log("\nLlamando API con retry:");
reliableAPICall()
  .then((result) => console.log("  ✅ Result:", result))
  .catch((error) => console.log("  ❌ Error:", error.message));

// ============================================
// EJEMPLO 8: HOF para Throttling y Debouncing
// ============================================

/**
 * HOF para throttling (limitar frecuencia de ejecución)
 */
function throttle<T extends any[]>(
  fn: (...args: T) => void,
  delay: number,
): (...args: T) => void {
  let lastCall = 0;

  return (...args: T) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * HOF para debouncing (esperar a que dejen de llamar)
 */
function debounce<T extends any[]>(
  fn: (...args: T) => void,
  delay: number,
): (...args: T) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 8: HOF para Throttling y Debouncing");
console.log("=".repeat(50));

const logMessage = (msg: string) => console.log(`  📝 ${msg}`);

const throttledLog = throttle(logMessage, 1000);
const debouncedLog = debounce(logMessage, 1000);

console.log("\nThrottled (solo permite cada 1s):");
for (let i = 0; i < 5; i++) {
  throttledLog(`Throttled message ${i}`);
}

// ============================================
// EJEMPLO 9: Composición con HOF
// ============================================

/**
 * HOF para componer funciones
 */
function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduceRight((result, fn) => fn(result), arg);
}

function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduce((result, fn) => fn(result), arg);
}

const trim = (str: string) => str.trim();
const uppercase = (str: string) => str.toUpperCase();
const exclaim = (str: string) => `${str}!`;

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 9: Composición con HOF");
console.log("=".repeat(50));

// compose: derecha a izquierda
const formatCompose = compose(exclaim, uppercase, trim);
console.log("\nCompose:", formatCompose("  hello  "));

// pipe: izquierda a derecha (más intuitivo)
const formatPipe = pipe(trim, uppercase, exclaim);
console.log("Pipe:", formatPipe("  hello  "));

// ============================================
// EJEMPLO 10: HOF en el Mundo Real
// ============================================

/**
 * Sistema de middleware estilo Express
 */

type Middleware<T> = (data: T, next: () => void) => void;

function createMiddlewareChain<T>(
  ...middlewares: Middleware<T>[]
): (data: T) => void {
  return (data: T) => {
    let index = 0;

    const next = () => {
      if (index < middlewares.length) {
        const middleware = middlewares[index++];
        middleware(data, next);
      }
    };

    next();
  };
}

interface Request {
  url: string;
  authenticated: boolean;
  validated: boolean;
  logged: boolean;
}

const authMiddleware: Middleware<Request> = (req, next) => {
  console.log("  🔐 Auth middleware");
  req.authenticated = true;
  next();
};

const validationMiddleware: Middleware<Request> = (req, next) => {
  console.log("  ✅ Validation middleware");
  req.validated = true;
  next();
};

const loggingMiddleware: Middleware<Request> = (req, next) => {
  console.log("  📝 Logging middleware");
  req.logged = true;
  next();
};

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 10: Middleware Chain (Express-style)");
console.log("=".repeat(50));

const handler = createMiddlewareChain(
  loggingMiddleware,
  authMiddleware,
  validationMiddleware,
);

const request: Request = {
  url: "/api/users",
  authenticated: false,
  validated: false,
  logged: false,
};

console.log("\nEjecutando middleware chain:");
handler(request);
console.log("\nRequest después de middleware:", request);

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuál es la diferencia entre map y forEach?
 *    Pista: ¿Qué retornan? ¿Cuál es pura?
 *
 * 2. ¿Por qué compose ejecuta de derecha a izquierda?
 *    Pista: Composición matemática f(g(x))
 *
 * 3. ¿Cuándo usar throttle vs debounce?
 *    Pista: Frecuencia vs esperar a que termine
 *
 * 4. ¿Qué es "point-free style"?
 *    Pista: No mencionar los argumentos
 *
 * 5. ¿Cómo implementarías un HOF para caching con TTL?
 *    Pista: Memoize + timestamp
 *
 * 6. ¿Son las HOF siempre puras?
 *    Pista: Depende de lo que hagan
 *
 * 7. ¿Cómo tipificarías una HOF genérica en TypeScript?
 *    Pista: Generics y conditional types
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Implementa una HOF `repeat` que ejecute una función N veces:
 *    repeat(3, () => console.log("Hello")) // imprime "Hello" 3 veces
 *
 * 2. INTERMEDIO:
 *    Implementa una HOF `once` que garantice que una función solo se ejecute una vez:
 *    const init = once(() => console.log("Initialized"));
 *    init(); // "Initialized"
 *    init(); // nada
 *    init(); // nada
 *
 * 3. AVANZADO:
 *    Implementa una HOF `rateLimit` para limitar requests por segundo:
 *    const limitedAPI = rateLimit(apiCall, 5); // máximo 5 calls/segundo
 *
 * 4. EXPERTO:
 *    Implementa un sistema de HOF composables para data validation:
 *    - required, minLength, maxLength, pattern, custom
 *    - Debe acumular todos los errores
 *    - Debe ser completamente componible
 */

console.log("\n" + "=".repeat(50));
console.log("💡 TIPS PRÁCTICOS");
console.log("=".repeat(50));

/**
 * ✅ CUÁNDO USAR HOF:
 *
 * 1. Abstracción de patrones repetitivos
 * 2. Añadir comportamiento a funciones existentes
 * 3. Composición de funcionalidad
 * 4. Configuración de comportamiento
 * 5. Middleware y pipelines
 * 6. Event handling
 * 7. Async operations
 *
 * ⚠️ CUIDADOS:
 *
 * 1. No abusar - complejidad innecesaria
 * 2. Mantener tipado fuerte
 * 3. Documentar bien el propósito
 * 4. Performance en loops grandes
 * 5. Closures capturan scope (memory)
 * 6. Debugging puede ser más difícil
 */

console.log("\n" + "=".repeat(50));
console.log("✨ Fin del ejercicio - ¡Practica creando HOF!");
console.log("=".repeat(50));

export {
  twice,
  createMultiplier,
  withLogging,
  memoize,
  combineValidators,
  withRetry,
  throttle,
  debounce,
  compose,
  pipe,
  createMiddlewareChain,
};
