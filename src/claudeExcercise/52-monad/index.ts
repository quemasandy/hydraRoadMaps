/**
 * MONAD PATTERN (Maybe/Option, Either)
 * Encapsula valores con contexto, permite composición funcional segura
 *
 * Big Tech: Functional programming, Error handling (Rust Result, Haskell Maybe)
 */

// Maybe Monad (handles null/undefined)
class Maybe<T> {
  private constructor(private value: T | null) {}

  static of<T>(value: T | null): Maybe<T> {
    return new Maybe(value);
  }

  static none<T>(): Maybe<T> {
    return new Maybe<T>(null);
  }

  map<U>(fn: (value: T) => U): Maybe<U> {
    if (this.value === null) {
      return Maybe.none();
    }
    return Maybe.of(fn(this.value));
  }

  flatMap<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
    if (this.value === null) {
      return Maybe.none();
    }
    return fn(this.value);
  }

  getOrElse(defaultValue: T): T {
    return this.value !== null ? this.value : defaultValue;
  }

  isPresent(): boolean {
    return this.value !== null;
  }
}

// Either Monad (handles errors)
class Either<L, R> {
  private constructor(private left: L | null, private right: R | null) {}

  static left<L, R>(value: L): Either<L, R> {
    return new Either<L, R>(value, null);
  }

  static right<L, R>(value: R): Either<L, R> {
    return new Either<L, R>(null, value);
  }

  map<U>(fn: (value: R) => U): Either<L, U> {
    return this.isRight() ? Either.right(fn(this.right!)) : Either.left(this.left!);
  }

  flatMap<U>(fn: (value: R) => Either<L, U>): Either<L, U> {
    return this.isRight() ? fn(this.right!) : Either.left(this.left!);
  }

  isRight(): boolean {
    return this.right !== null;
  }

  isLeft(): boolean {
    return this.left !== null;
  }

  getOrElse(defaultValue: R): R {
    return this.isRight() ? this.right! : defaultValue;
  }
}

// Demo - Maybe Monad
console.log('='.repeat(60));
console.log('MONAD PATTERN - Safe Value Handling');
console.log('='.repeat(60));

function getCustomer(id: string): Maybe<{ id: string; name: string }> {
  return id === 'cus_123' ? Maybe.of({ id, name: 'Alice' }) : Maybe.none();
}

const customer = getCustomer('cus_123')
  .map(c => c.name.toUpperCase())
  .map(name => `Customer: ${name}`);

console.log(customer.getOrElse('No customer found'));

// Demo - Either Monad
function processPayment(amount: number): Either<string, string> {
  if (amount <= 0) return Either.left('Invalid amount');
  if (amount > 10000) return Either.left('Amount too large');
  return Either.right(`txn_${Date.now()}`);
}

const result = processPayment(500);
console.log(result.isRight() ? `Success: ${result.getOrElse('')}` : `Error`);

/**
 * PREGUNTAS:
 * 1. ¿Monad laws (left identity, right identity, associativity)?
 * 2. ¿Maybe vs null checking?
 * 3. ¿Either vs exceptions?
 * 4. ¿Monad composition?
 * 5. ¿Monad transformers?
 * 6. ¿Promise as monad?
 * 7. ¿Monad in TypeScript limitations?
 * 8. ¿Practical monad usage?
 */

export { Maybe, Either };
