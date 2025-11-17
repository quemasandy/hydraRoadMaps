/**
 * FUNCTOR & APPLICATIVE PATTERNS
 * Functor: map over values. Applicative: apply functions in context
 *
 * Big Tech: Functional programming, data transformation pipelines
 */

// Functor (has map)
class Box<T> {
  constructor(private value: T) {}

  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this.value));
  }

  getValue(): T {
    return this.value;
  }
}

// Applicative (can apply wrapped functions)
class App<T> {
  constructor(private value: T) {}

  static of<T>(value: T): App<T> {
    return new App(value);
  }

  map<U>(fn: (value: T) => U): App<U> {
    return new App(fn(this.value));
  }

  ap<U>(wrappedFn: App<(value: T) => U>): App<U> {
    return new App(wrappedFn.value(this.value));
  }
}

// Demo
console.log('='.repeat(60));
console.log('FUNCTOR & APPLICATIVE');
console.log('='.repeat(60));

const box = new Box(100)
  .map(x => x * 1.1) // Add tax
  .map(x => x.toFixed(2));

console.log(`Result: $${box.getValue()}`);

/**
 * PREGUNTAS:
 * 1. ¿Functor laws?
 * 2. ¿Applicative vs Monad?
 * 3. ¿Applicative composition?
 * 4. ¿Array as Functor?
 * 5. ¿Promise as Functor?
 * 6. ¿Practical use cases?
 * 7. ¿Functor in fp-ts library?
 * 8. ¿Category theory relevance?
 */

export { Box, App };
