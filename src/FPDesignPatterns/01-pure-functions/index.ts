/**
 * ==========================================
 * FUNCIONES PURAS (PURE FUNCTIONS)
 * ==========================================
 *
 * Una función pura es la piedra angular de la programación funcional.
 * Este ejercicio demuestra qué son y por qué son fundamentales.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Determinismo: misma entrada = misma salida (siempre)
 * - Sin efectos secundarios: no modifica estado externo
 * - Transparencia referencial: se puede reemplazar por su valor
 * - Testeable: fácil de probar y razonar sobre ellas
 *
 * 🏢 USO EN BIG TECH:
 * Facebook (React), Netflix, Amazon usan funciones puras para:
 * - Rendering predecible en UIs
 * - Caching seguro y memoización
 * - Testing sin mocks
 * - Refactoring confiable
 * - Debugging más simple
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * Las funciones impuras causan:
 * - Bugs difíciles de reproducir
 * - Tests complejos con mocks
 * - Código difícil de razonar
 * - Race conditions en concurrencia
 * - Dificultad para refactorizar
 */

// ============================================
// EJEMPLO 1: Función PURA vs IMPURA
// ============================================

// ❌ IMPURA: Depende de estado externo
let globalDiscount = 0.1;

function calculatePriceImpure(price: number): number {
  // Problema: El resultado depende de globalDiscount
  // Si globalDiscount cambia, la función da resultados diferentes
  return price * (1 - globalDiscount);
}

// ✅ PURA: Solo depende de sus argumentos
function calculatePricePure(price: number, discount: number): number {
  // Siempre da el mismo resultado para los mismos argumentos
  // No depende de nada externo
  return price * (1 - discount);
}

console.log("=".repeat(50));
console.log("🎯 EJEMPLO 1: Pura vs Impura");
console.log("=".repeat(50));

const price = 100;

console.log("\n❌ Función IMPURA:");
console.log(`calculatePriceImpure(${price}) = ${calculatePriceImpure(price)}`);
globalDiscount = 0.2; // Cambio externo
console.log(`Después de cambiar globalDiscount a 0.2:`);
console.log(`calculatePriceImpure(${price}) = ${calculatePriceImpure(price)}`);
console.log("⚠️ Misma entrada, diferente salida!");

console.log("\n✅ Función PURA:");
console.log(`calculatePricePure(${price}, 0.1) = ${calculatePricePure(price, 0.1)}`);
console.log(`calculatePricePure(${price}, 0.1) = ${calculatePricePure(price, 0.1)}`);
console.log("✨ Misma entrada, misma salida - ¡Siempre!");

// ============================================
// EJEMPLO 2: Side Effects - Modificar Estado
// ============================================

interface ShoppingCart {
  items: string[];
  total: number;
}

// ❌ IMPURA: Modifica el objeto original
function addItemImpure(cart: ShoppingCart, item: string, price: number): void {
  // Side effect: mutación del argumento
  cart.items.push(item);
  cart.total += price;
  // Retorna void - indicador de side effect
}

// ✅ PURA: Retorna un nuevo objeto sin mutar el original
function addItemPure(
  cart: ShoppingCart,
  item: string,
  price: number,
): ShoppingCart {
  // No mutamos cart, creamos uno nuevo
  return {
    items: [...cart.items, item], // Spread operator para inmutabilidad
    total: cart.total + price,
  };
}

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 2: Mutación vs Inmutabilidad");
console.log("=".repeat(50));

const originalCart: ShoppingCart = {
  items: ["Laptop"],
  total: 1000,
};

console.log("\n❌ Función IMPURA (mutación):");
const cartRef = originalCart;
addItemImpure(cartRef, "Mouse", 50);
console.log("Cart después de addItemImpure:", cartRef);
console.log("originalCart también cambió:", originalCart);
console.log("⚠️ Efecto secundario - mutación!");

const cart2: ShoppingCart = {
  items: ["Laptop"],
  total: 1000,
};

console.log("\n✅ Función PURA (inmutabilidad):");
const newCart = addItemPure(cart2, "Mouse", 50);
console.log("cart2 original:", cart2);
console.log("newCart:", newCart);
console.log("✨ cart2 no fue modificado!");

// ============================================
// EJEMPLO 3: I/O Side Effects
// ============================================

// ❌ IMPURA: Tiene side effects de I/O
function logPriceImpure(price: number): number {
  console.log(`Price is: $${price}`); // Side effect: I/O
  return price;
}

// ✅ PURA: Solo calcula, no hace I/O
function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

// Separar cálculo (puro) de side effects (impuro)
function displayPrice(price: number): void {
  // Side effect aislado
  const formatted = formatPrice(price); // Función pura
  console.log(`Price is: ${formatted}`); // Side effect controlado
}

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 3: I/O Side Effects");
console.log("=".repeat(50));

console.log("\n✅ Mejor práctica: Separar lógica pura de side effects");
displayPrice(99.99);

// ============================================
// EJEMPLO 4: Funciones Puras en Sistema Real
// ============================================

/**
 * Sistema de descuentos para e-commerce
 * Usando solo funciones puras
 */

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface DiscountRule {
  category: string;
  discount: number;
}

// ✅ PURA: Calcula descuento basado en categoría
function calculateDiscount(
  product: Product,
  rules: DiscountRule[],
): number {
  const rule = rules.find((r) => r.category === product.category);
  return rule ? rule.discount : 0;
}

// ✅ PURA: Aplica descuento a producto
function applyDiscount(product: Product, discount: number): Product {
  return {
    ...product,
    price: product.price * (1 - discount),
  };
}

// ✅ PURA: Calcula total del carrito
function calculateCartTotal(products: Product[]): number {
  return products.reduce((sum, product) => sum + product.price, 0);
}

// ✅ PURA: Aplica descuentos a múltiples productos
function applyDiscountsToCart(
  products: Product[],
  rules: DiscountRule[],
): Product[] {
  return products.map((product) => {
    const discount = calculateDiscount(product, rules);
    return applyDiscount(product, discount);
  });
}

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 4: Sistema de Descuentos (Todo Puro)");
console.log("=".repeat(50));

const products: Product[] = [
  { id: "1", name: "Laptop", price: 1000, category: "electronics" },
  { id: "2", name: "Book", price: 20, category: "books" },
  { id: "3", name: "Headphones", price: 200, category: "electronics" },
];

const discountRules: DiscountRule[] = [
  { category: "electronics", discount: 0.1 },
  { category: "books", discount: 0.05 },
];

console.log("\nProductos originales:");
products.forEach((p) => console.log(`  ${p.name}: $${p.price}`));

const discountedProducts = applyDiscountsToCart(products, discountRules);

console.log("\nProductos con descuento:");
discountedProducts.forEach((p) => console.log(`  ${p.name}: $${p.price.toFixed(2)}`));

const originalTotal = calculateCartTotal(products);
const discountedTotal = calculateCartTotal(discountedProducts);

console.log(`\nTotal original: $${originalTotal}`);
console.log(`Total con descuentos: $${discountedTotal.toFixed(2)}`);
console.log(`Ahorro: $${(originalTotal - discountedTotal).toFixed(2)}`);

// ============================================
// EJEMPLO 5: Beneficios de Funciones Puras
// ============================================

/**
 * 🎯 BENEFICIO 1: MEMOIZACIÓN
 * Las funciones puras se pueden cachear de forma segura
 */

// Helper para memoizar funciones puras
function memoize<T, R>(fn: (arg: T) => R): (arg: T) => R {
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

// Función pura costosa
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("\n" + "=".repeat(50));
console.log("🎯 BENEFICIO: Memoización");
console.log("=".repeat(50));

const memoizedFib = memoize(fibonacci);

console.log("\nPrimera llamada:");
console.log(`fibonacci(10) = ${memoizedFib(10)}`);

console.log("\nSegunda llamada (desde cache):");
console.log(`fibonacci(10) = ${memoizedFib(10)}`);

/**
 * 🎯 BENEFICIO 2: TESTING
 * Las funciones puras son triviales de testear
 */

console.log("\n" + "=".repeat(50));
console.log("🎯 BENEFICIO: Testing Simple");
console.log("=".repeat(50));

// No necesitamos mocks, setup, ni teardown
function testCalculatePricePure() {
  const tests = [
    { price: 100, discount: 0.1, expected: 90 },
    { price: 50, discount: 0.2, expected: 40 },
    { price: 200, discount: 0, expected: 200 },
  ];

  console.log("\nEjecutando tests:");
  tests.forEach(({ price, discount, expected }) => {
    const result = calculatePricePure(price, discount);
    const passed = result === expected;
    console.log(
      `  ${passed ? "✅" : "❌"} calculatePricePure(${price}, ${discount}) = ${result} ${passed ? "==" : "!="} ${expected}`,
    );
  });
}

testCalculatePricePure();

/**
 * 🎯 BENEFICIO 3: COMPOSICIÓN
 * Las funciones puras se componen naturalmente
 */

console.log("\n" + "=".repeat(50));
console.log("🎯 BENEFICIO: Composición");
console.log("=".repeat(50));

// Funciones puras pequeñas
const addTax = (price: number) => price * 1.1;
const addShipping = (price: number) => price + 10;
const roundPrice = (price: number) => Math.round(price * 100) / 100;

// Componer funciones
function composeFunctions<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduce((result, fn) => fn(result), arg);
}

const calculateFinalPrice = composeFunctions(
  addTax,
  addShipping,
  roundPrice,
);

console.log("\nComposición de funciones puras:");
const basePrice = 100;
console.log(`Precio base: $${basePrice}`);
console.log(`Precio final: $${calculateFinalPrice(basePrice)}`);

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Date.now() es una función pura?
 *    Pista: ¿Retorna el mismo valor cada vez?
 *
 * 2. ¿Math.random() es una función pura?
 *    Pista: ¿Es determinista?
 *
 * 3. ¿Cómo manejarías API calls de forma "pura"?
 *    Pista: Separar descripción de ejecución
 *
 * 4. ¿Una función que lee un archivo es pura?
 *    Pista: ¿El contenido del archivo puede cambiar?
 *
 * 5. ¿Cómo testearías una función impura?
 *    Pista: Mocks, stubs, dependency injection
 *
 * 6. ¿Todas las funciones deben ser puras?
 *    Pista: Los side effects son necesarios, pero aíslables
 *
 * 7. ¿Cómo harías logging en funciones puras?
 *    Pista: Separar el cálculo del logging
 *
 * 8. ¿Una función pura puede llamar otra función pura?
 *    Pista: Sí, y el resultado sigue siendo puro
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Identifica cuáles de estas funciones son puras:
 *    a) function add(a: number, b: number): number { return a + b; }
 *    b) function printSum(a: number, b: number): void { console.log(a + b); }
 *    c) function getCurrentUser(): User { return globalUser; }
 *    d) function formatDate(date: Date): string { return date.toISOString(); }
 *
 * 2. INTERMEDIO:
 *    Refactoriza esta función impura a pura:
 *    ```
 *    let items = [];
 *    function addItem(item) {
 *      items.push(item);
 *      return items.length;
 *    }
 *    ```
 *
 * 3. AVANZADO:
 *    Crea un sistema de validación de forms que use solo funciones puras:
 *    - validateEmail(email: string): boolean
 *    - validatePassword(password: string): boolean
 *    - validateForm(form: FormData): ValidationResult
 *    El resultado debe ser completamente determinista y testeable
 *
 * 4. EXPERTO:
 *    Implementa un sistema de reducers estilo Redux:
 *    - Todos los reducers deben ser funciones puras
 *    - Estado inmutable
 *    - Actions como objetos planos
 *    - Time-travel debugging posible por pureza
 */

console.log("\n" + "=".repeat(50));
console.log("💡 TIPS PRÁCTICOS");
console.log("=".repeat(50));

/**
 * ✅ CÓMO ESCRIBIR FUNCIONES PURAS:
 *
 * 1. Solo usar argumentos de entrada
 * 2. No modificar argumentos
 * 3. No acceder a variables externas
 * 4. No hacer I/O (console.log, fetch, etc.)
 * 5. No usar Date.now(), Math.random(), etc.
 * 6. Siempre retornar un valor
 * 7. Usar const para inmutabilidad
 * 8. Usar spread operator para copiar
 *
 * ⚠️ SEÑALES DE FUNCIONES IMPURAS:
 *
 * 1. Retorna void
 * 2. Modifica argumentos
 * 3. Usa variables globales
 * 4. Hace console.log
 * 5. Hace API calls
 * 6. Lee/escribe archivos
 * 7. Usa Date.now() o Math.random()
 * 8. Modifica DOM
 */

console.log("\n" + "=".repeat(50));
console.log("✨ Fin del ejercicio - ¡Practica escribiendo funciones puras!");
console.log("=".repeat(50));

export {
  calculatePricePure,
  addItemPure,
  formatPrice,
  calculateDiscount,
  applyDiscount,
  calculateCartTotal,
  applyDiscountsToCart,
};
