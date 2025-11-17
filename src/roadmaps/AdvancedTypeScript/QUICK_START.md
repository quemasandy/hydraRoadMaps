# 🚀 Quick Start - Advanced TypeScript

## ⚡ Empieza en 5 Minutos

### 1. Navega al directorio
```bash
cd src/roadmaps/AdvancedTypeScript
```

### 2. Ejecuta tu primer ejercicio
```bash
ts-node 01-literal-types/index.ts
```

### 3. Experimenta en TypeScript Playground
Abre https://www.typescriptlang.org/play y prueba los ejemplos

---

## 📦 Setup Inicial

### Crear proyecto con strict mode

```bash
# Inicializar proyecto
npm init -y
npm install --save-dev typescript @types/node

# Crear tsconfig.json estricto
npx tsc --init --strict
```

### tsconfig.json recomendado

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",

    /* Strict Type-Checking Options */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    /* Additional Checks */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    /* Module Resolution */
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## 🎯 Tu Primer Tipo Avanzado

### 1. Literal Types

```typescript
// ❌ Antes: Tipos primitivos genéricos
function setTheme(theme: string) {
  // Cualquier string es válido, incluso "invalid"
}

// ✅ Después: Literal types específicos
type Theme = 'light' | 'dark' | 'auto';
function setTheme(theme: Theme) {
  // Solo acepta valores válidos
}

// Uso
setTheme('light');  // ✅ OK
setTheme('blue');   // ❌ Error: Type '"blue"' is not assignable
```

### 2. Const Assertions

```typescript
// ❌ Sin const assertion
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 3000
};
// Tipo inferido: { apiUrl: string; timeout: number }

// ✅ Con const assertion
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 3000
} as const;
// Tipo inferido: {
//   readonly apiUrl: "https://api.example.com";
//   readonly timeout: 3000
// }

// Uso con literal types
const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact'
} as const;

type Route = typeof ROUTES[keyof typeof ROUTES];
// Route = "/" | "/about" | "/contact"
```

---

## 🔥 Tu Primera Discriminated Union

```typescript
// Representa resultado de operación con tipos específicos
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

// Función que retorna Result
function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return {
      success: false,
      error: new Error('Division by zero')
    };
  }
  return {
    success: true,
    value: a / b
  };
}

// Uso con exhaustive checking
const result = divide(10, 2);

if (result.success) {
  console.log('Result:', result.value);  // TypeScript sabe que existe 'value'
} else {
  console.error('Error:', result.error.message);  // Y que existe 'error'
}

// Switch con exhaustiveness checking
function handleResult<T>(result: Result<T>): T | null {
  switch (result.success) {
    case true:
      return result.value;
    case false:
      console.error(result.error);
      return null;
    // Si agregamos un nuevo caso, TypeScript nos avisará
  }

  // Esta línea asegura que cubrimos todos los casos
  const _exhaustive: never = result;
  return _exhaustive;
}
```

---

## 🎨 Tu Primer Custom Type Guard

```typescript
// Interface para User
interface User {
  id: number;
  name: string;
  email: string;
}

// Type guard con type predicate
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof (value as User).id === 'number' &&
    'name' in value &&
    typeof (value as User).name === 'string' &&
    'email' in value &&
    typeof (value as User).email === 'string'
  );
}

// Uso
function processApiResponse(data: unknown) {
  if (isUser(data)) {
    // TypeScript sabe que 'data' es User aquí
    console.log(`User: ${data.name} (${data.email})`);
  } else {
    console.error('Invalid user data');
  }
}

// Ejemplo más práctico: validar array
function areUsers(value: unknown): value is User[] {
  return Array.isArray(value) && value.every(isUser);
}
```

---

## 🧪 Tu Primer Branded Type

```typescript
// Crear branded type para IDs
type Brand<K, T> = K & { __brand: T };

type UserId = Brand<number, 'UserId'>;
type ProductId = Brand<number, 'ProductId'>;

// Smart constructors
function createUserId(id: number): UserId {
  if (id <= 0) {
    throw new Error('Invalid user ID');
  }
  return id as UserId;
}

function createProductId(id: number): ProductId {
  if (id <= 0) {
    throw new Error('Invalid product ID');
  }
  return id as ProductId;
}

// Funciones type-safe
function getUser(userId: UserId) {
  console.log(`Fetching user ${userId}`);
}

function getProduct(productId: ProductId) {
  console.log(`Fetching product ${productId}`);
}

// Uso
const userId = createUserId(123);
const productId = createProductId(456);

getUser(userId);           // ✅ OK
getProduct(productId);     // ✅ OK

// getUser(productId);     // ❌ Error: ProductId no es UserId
// getUser(123);           // ❌ Error: number no es UserId
```

---

## 🏗️ Tu Primer Builder Type-Safe

```typescript
// State tracking con phantom types
type HasName = { _hasName: true };
type HasEmail = { _hasEmail: true };
type HasPassword = { _hasPassword: true };

class UserBuilder<State = {}> {
  private user: Partial<{
    name: string;
    email: string;
    password: string;
  }> = {};

  name(name: string): UserBuilder<State & HasName> {
    this.user.name = name;
    return this as any;
  }

  email(email: string): UserBuilder<State & HasEmail> {
    this.user.email = email;
    return this as any;
  }

  password(password: string): UserBuilder<State & HasPassword> {
    this.user.password = password;
    return this as any;
  }

  // Build solo disponible cuando todos los campos requeridos están presentes
  build(
    this: UserBuilder<HasName & HasEmail & HasPassword>
  ): Required<typeof this.user> {
    return this.user as Required<typeof this.user>;
  }
}

// Uso
const user = new UserBuilder()
  .name('John')
  .email('john@example.com')
  .password('secret123')
  .build();  // ✅ OK

// Esto no compila porque falta password
// const incomplete = new UserBuilder()
//   .name('John')
//   .email('john@example.com')
//   .build();  // ❌ Error
```

---

## 💡 Utility Types Esenciales

### Implementaciones desde cero

```typescript
// 1. Pick - Seleccionar propiedades
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = MyPick<User, 'id' | 'name' | 'email'>;
// { id: number; name: string; email: string }

// 2. Omit - Excluir propiedades
type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>;

type UserWithoutPassword = MyOmit<User, 'password'>;
// { id: number; name: string; email: string }

// 3. Readonly profundo
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

interface Config {
  database: {
    host: string;
    port: number;
  };
}

type ReadonlyConfig = DeepReadonly<Config>;
// {
//   readonly database: {
//     readonly host: string;
//     readonly port: number;
//   }
// }

// 4. NonNullable - Remover null y undefined
type MyNonNullable<T> = T extends null | undefined ? never : T;

type MaybeString = string | null | undefined;
type DefiniteString = MyNonNullable<MaybeString>;  // string

// 5. ReturnType - Extraer tipo de retorno
type MyReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never;

function getUser() {
  return { id: 1, name: 'John' };
}

type User2 = MyReturnType<typeof getUser>;
// { id: number; name: string }
```

---

## 🎓 Ejercicios Rápidos

### Ejercicio 1: API Endpoints Type-Safe

```typescript
// Define endpoints como literal types
const API_ENDPOINTS = {
  users: '/api/users',
  posts: '/api/posts',
  comments: '/api/comments'
} as const;

type Endpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];

// Función type-safe
function fetchData(endpoint: Endpoint) {
  return fetch(endpoint);
}

// Uso
fetchData(API_ENDPOINTS.users);    // ✅ OK
fetchData('/api/invalid');         // ❌ Error
```

### Ejercicio 2: State Machine

```typescript
// Estados de una orden
type OrderState =
  | { status: 'pending'; createdAt: Date }
  | { status: 'processing'; startedAt: Date }
  | { status: 'shipped'; trackingNumber: string }
  | { status: 'delivered'; deliveredAt: Date }
  | { status: 'cancelled'; reason: string };

// Función que maneja estado
function getOrderInfo(order: OrderState): string {
  switch (order.status) {
    case 'pending':
      return `Order created at ${order.createdAt}`;
    case 'processing':
      return `Processing since ${order.startedAt}`;
    case 'shipped':
      return `Tracking: ${order.trackingNumber}`;
    case 'delivered':
      return `Delivered at ${order.deliveredAt}`;
    case 'cancelled':
      return `Cancelled: ${order.reason}`;
    default:
      // Exhaustiveness check
      const _exhaustive: never = order;
      return _exhaustive;
  }
}
```

### Ejercicio 3: Query Builder

```typescript
class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = [];

  where<K extends keyof T>(
    field: K,
    value: T[K]
  ): this {
    this.filters.push(item => item[field] === value);
    return this;
  }

  execute(data: T[]): T[] {
    return data.filter(item =>
      this.filters.every(filter => filter(item))
    );
  }
}

// Uso
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const products: Product[] = [
  { id: 1, name: 'Laptop', price: 1000, category: 'electronics' },
  { id: 2, name: 'Phone', price: 500, category: 'electronics' },
  { id: 3, name: 'Desk', price: 300, category: 'furniture' }
];

const result = new QueryBuilder<Product>()
  .where('category', 'electronics')
  .where('price', 500)
  .execute(products);

console.log(result);  // [{ id: 2, name: 'Phone', ... }]
```

---

## 📚 Recursos para Empezar

### Lectura Inmediata
1. **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/
2. **TypeScript Deep Dive**: https://basarat.gitbook.io/typescript/
3. **Matt Pocock's Blog**: https://www.mattpocock.com/

### Práctica Inmediata
1. **TypeScript Playground**: https://www.typescriptlang.org/play
2. **Type Challenges**: https://github.com/type-challenges/type-challenges
3. **Exercism TypeScript Track**: https://exercism.org/tracks/typescript

### Tools
1. **type-fest**: Collection de utility types
2. **ts-toolbelt**: Advanced type utilities
3. **zod**: Schema validation con type inference

---

## 🚨 Errores Comunes a Evitar

### ❌ Error 1: Usar `any`

```typescript
// Mal
function processData(data: any) {
  return data.value;  // Sin type safety
}

// Bien
function processData(data: unknown) {
  if (isValidData(data)) {
    return data.value;  // Type-safe con type guard
  }
  throw new Error('Invalid data');
}
```

### ❌ Error 2: No usar exhaustiveness checking

```typescript
type Status = 'active' | 'inactive' | 'pending';

// Mal
function getColor(status: Status): string {
  if (status === 'active') return 'green';
  if (status === 'inactive') return 'red';
  return 'yellow';  // ¿Qué pasa si agregamos nuevo status?
}

// Bien
function getColor(status: Status): string {
  switch (status) {
    case 'active':
      return 'green';
    case 'inactive':
      return 'red';
    case 'pending':
      return 'yellow';
    default:
      const _exhaustive: never = status;
      return _exhaustive;  // Error si falta algún caso
  }
}
```

### ❌ Error 3: Type assertions innecesarios

```typescript
// Mal
const user = getData() as User;  // Peligroso si getData() no retorna User

// Bien
const data = getData();
if (isUser(data)) {
  const user = data;  // Type narrowing seguro
}
```

---

## 🎯 Próximos Pasos

1. ✅ Habilita strict mode en tsconfig.json
2. ✅ Practica con TypeScript Playground
3. ✅ Completa ejercicios 01-literal-types
4. ✅ Lee el README.md completo
5. ✅ Revisa INDICE.md para ver roadmap
6. ✅ Resuelve 5 Type Challenges (easy)
7. ✅ Únete a TypeScript Discord
8. ✅ Sigue a @mattpocockuk en Twitter
9. ✅ Lee "Effective TypeScript" libro
10. ✅ Practica diariamente (15-30 min)

---

## 💬 Comunidad

- **Discord**: TypeScript Community Discord
- **Reddit**: r/typescript
- **Twitter**: #TypeScript
- **Stack Overflow**: Tag `typescript`
- **GitHub Discussions**: TypeScript repo

---

## ❓ FAQs

**Q: ¿Debo habilitar strict mode desde el inicio?**
A: ¡Sí! Es más fácil aprender con strict mode que migrar después.

**Q: ¿Cuándo usar `unknown` vs `any`?**
A: Siempre prefiere `unknown`. Solo usa `any` cuando realmente no hay alternativa (muy raro).

**Q: ¿Cómo aprendo type-level programming?**
A: Resuelve Type Challenges, lee type-fest source code, experimenta en Playground.

**Q: ¿Cuándo usar type vs interface?**
A: Interface para objetos y clases. Type para unions, intersections, utilities.

**Q: ¿Los tipos afectan performance?**
A: No. Solo afectan compile time. El JavaScript generado es igual.

**Q: ¿Vale la pena aprender tipos avanzados?**
A: Absolutamente. Previenen innumerables bugs y mejoran DX dramáticamente.

---

**¡Bienvenido a Advanced TypeScript!** 🎉

*Recuerda: TypeScript no es solo "JavaScript con tipos". Es una herramienta poderosa para diseñar APIs imposibles de usar incorrectamente, prevenir bugs antes de runtime, y escribir código autodocumentado. Los tipos avanzados son tu superpoder - úsalos sabiamente.*

**Pro tip**: No intentes aprender todo de una vez. Empieza con literal types y discriminated unions. Practica mucho en el Playground. Lee código de bibliotecas populares. Aplica inmediatamente en proyectos reales. La consistencia vence a la intensidad.

**Bonus tip**: Configura tu IDE (VS Code) correctamente. Instala las extensiones TypeScript oficiales. Habilita todos los hints y warnings. El feedback inmediato del IDE es tu mejor maestro.
