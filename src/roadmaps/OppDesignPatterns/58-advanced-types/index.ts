/**
 * ADVANCED TYPESCRIPT TYPES
 * Conditional, Mapped, Template Literal types
 *
 * Big Tech: Type-safe APIs, advanced generics, utility types
 */

// Conditional types
type IsString<T> = T extends string ? 'yes' : 'no';
type A = IsString<string>; // 'yes'
type B = IsString<number>; // 'no'

// Mapped types
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Optional<T> = {
  [K in keyof T]?: T[K];
};

// Template literal types
type EventName = 'click' | 'focus' | 'blur';
type EventHandler = `on${Capitalize<EventName>}`; // 'onClick' | 'onFocus' | 'onBlur'

// Utility type example
interface Invoice {
  id: string;
  amount: number;
  customerId: string;
}

type InvoiceUpdate = Partial<Omit<Invoice, 'id'>>;

// Demo
console.log('='.repeat(60));
console.log('ADVANCED TYPESCRIPT TYPES');
console.log('='.repeat(60));

const update: InvoiceUpdate = { amount: 500 };
console.log('Update:', update);

/**
 * PREGUNTAS:
 * 1. ¿Conditional types use cases?
 * 2. ¿Distributive conditional types?
 * 3. ¿infer keyword?
 * 4. ¿Mapped type modifiers (+/- readonly)?
 * 5. ¿Template literal types practical uses?
 * 6. ¿Built-in utility types?
 * 7. ¿Type-level programming?
 * 8. ¿Advanced types performance?
 */

export { };
