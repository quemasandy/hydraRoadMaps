# 🚀 Quick Start - Programación Funcional con TypeScript

## ⚡ Empieza en 5 Minutos

### 1. Navega al directorio
```bash
cd src/FPDesignPatterns
```

### 2. Ejecuta tu primer ejercicio
```bash
ts-node 01-pure-functions/index.ts
```

### 3. Explora otros ejercicios
```bash
ts-node 03-higher-order-functions/index.ts
```

---

## 📦 Setup de Proyecto FP

### Instalar dependencias FP (opcional pero recomendado)

```bash
npm install fp-ts io-ts monocle-ts
npm install --save-dev fast-check
```

### Bibliotecas principales:
- **fp-ts**: Programación funcional completa para TypeScript
- **io-ts**: Runtime type validation
- **monocle-ts**: Optics (Lenses, Prisms)
- **fast-check**: Property-based testing

---

## 🎯 Tu Primera Función Pura

```typescript
// ❌ Impura - depende de estado externo
let discount = 0.1;
function applyDiscount(price: number): number {
  return price * (1 - discount);
}

// ✅ Pura - solo depende de argumentos
function applyDiscountPure(price: number, discount: number): number {
  return price * (1 - discount);
}

// Uso
console.log(applyDiscountPure(100, 0.1)); // 90
console.log(applyDiscountPure(100, 0.2)); // 80
```

---

## 🔥 Tu Primera Higher-Order Function

```typescript
// HOF que crea funciones especializadas
function createMultiplier(factor: number): (x: number) => number {
  return (x: number) => x * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

---

## 🎨 Tu Primera Composición

```typescript
// Funciones pequeñas
const trim = (str: string) => str.trim();
const uppercase = (str: string) => str.toUpperCase();
const exclaim = (str: string) => `${str}!`;

// Composer (de izquierda a derecha)
function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduce((result, fn) => fn(result), arg);
}

// Componer
const format = pipe(trim, uppercase, exclaim);

console.log(format("  hello  ")); // "HELLO!"
```

---

## 🧪 Tu Primer Test Funcional

```typescript
// Función pura para testear
function add(a: number, b: number): number {
  return a + b;
}

// Test simple (no mocks necesarios!)
function test() {
  const result = add(2, 3);
  const expected = 5;

  if (result === expected) {
    console.log("✅ Test passed");
  } else {
    console.log(`❌ Test failed: expected ${expected}, got ${result}`);
  }
}

test();
```

---

## 📚 Conceptos Esenciales

### ✅ Función Pura
```typescript
// Misma entrada = Misma salida
// Sin side effects
function multiply(a: number, b: number): number {
  return a * b;
}
```

### ✅ Inmutabilidad
```typescript
// ❌ Mutación
const arr = [1, 2, 3];
arr.push(4); // modifica arr

// ✅ Inmutable
const arr2 = [1, 2, 3];
const newArr = [...arr2, 4]; // nuevo array
```

### ✅ Higher-Order Function
```typescript
// Función que recibe/retorna función
function map<T, R>(arr: T[], fn: (x: T) => R): R[] {
  return arr.map(fn);
}

const doubled = map([1, 2, 3], x => x * 2);
```

### ✅ Composición
```typescript
// f(g(x))
const compose = <T>(f: (x: T) => T, g: (x: T) => T) =>
  (x: T) => f(g(x));

const addOne = (x: number) => x + 1;
const double = (x: number) => x * 2;

const addOneThenDouble = compose(double, addOne);
console.log(addOneThenDouble(5)); // 12
```

---

## 🎓 Ruta de Aprendizaje Rápida

### Semana 1: Fundamentos
```bash
ts-node 01-pure-functions/index.ts
ts-node 02-immutability/index.ts
ts-node 03-higher-order-functions/index.ts
```

**Practica:**
- Escribe solo funciones puras
- Nunca mutes datos
- Usa HOF nativos: map, filter, reduce

### Semana 2: Composición
```bash
ts-node 04-function-composition/index.ts
ts-node 05-currying/index.ts
```

**Practica:**
- Compón funciones pequeñas
- Usa pipe para pipelines
- Currying para configuración

### Semana 3: Estructuras
```bash
ts-node 07-functors/index.ts
ts-node 08-monads-maybe/index.ts
```

**Practica:**
- Implementa functor desde cero
- Usa Maybe para null safety
- Entiende map y chain

---

## 💡 Comandos Útiles

### Ejecutar ejercicio específico
```bash
ts-node 01-pure-functions/index.ts
```

### Ejecutar con watch mode
```bash
npx ts-node-dev 01-pure-functions/index.ts
```

### Ejecutar múltiples ejercicios
```bash
for dir in 0{1..5}-*/; do
  echo "Running $dir"
  ts-node "$dir/index.ts"
done
```

---

## 🔍 Verificar tu Progreso

### Checklist Nivel 1
- [ ] Puedo explicar qué es una función pura
- [ ] Evito mutar datos automáticamente
- [ ] Uso map/filter/reduce en vez de loops
- [ ] Entiendo closures
- [ ] Puedo crear HOF simples

### Checklist Nivel 2
- [ ] Compongo funciones regularmente
- [ ] Uso currying cuando apropiado
- [ ] Entiendo recursión
- [ ] Puedo explicar functors
- [ ] Escribo código point-free

### Checklist Nivel 3
- [ ] Uso monads apropiadamente
- [ ] Entiendo monad laws
- [ ] Manejo errores con Either
- [ ] Encapsulo side effects con IO
- [ ] Valido con Applicatives

---

## 🚨 Errores Comunes

### ❌ Mutación Accidental
```typescript
// Mal
const addItem = (arr: number[], item: number) => {
  arr.push(item); // ¡Mutación!
  return arr;
};

// Bien
const addItem = (arr: number[], item: number) => {
  return [...arr, item]; // Nuevo array
};
```

### ❌ Side Effects Ocultos
```typescript
// Mal
function calculate(x: number): number {
  console.log(x); // Side effect
  return x * 2;
}

// Bien
function calculate(x: number): number {
  return x * 2; // Solo cálculo
}

// Side effect separado
function logAndCalculate(x: number): number {
  const result = calculate(x);
  console.log(result); // Side effect aislado
  return result;
}
```

### ❌ Usar map() sin usar el resultado
```typescript
// Mal - usa map pero no usas el array resultante
users.map(user => console.log(user.name));

// Bien - usa forEach para side effects
users.forEach(user => console.log(user.name));

// Mejor - transforma y usa el resultado
const names = users.map(user => user.name);
console.log(names);
```

---

## 📖 Recursos Recomendados

### Para Empezar
1. **Professor Frisby's Guide**: https://mostly-adequate.gitbook.io/
2. **fp-ts Getting Started**: https://gcanti.github.io/fp-ts/
3. **Functional Programming Jargon**: https://github.com/hemanth/functional-programming-jargon

### Videos
1. **Fun Fun Function** - FP in JavaScript
2. **Anjana Vakil** - Learning Functional Programming with JavaScript
3. **Brian Lonsdorf** - Oh Composable World!

### Libros (Gratuitos Online)
1. **JavaScript Allongé**
2. **Learn You a Haskell for Great Good**
3. **Functional-Light JavaScript**

---

## 💬 Comunidad

- **Reddit**: r/functionalprogramming
- **Discord**: Functional Programming
- **Stack Overflow**: Tag `functional-programming`
- **Twitter**: #FunctionalProgramming

---

## 🎯 Próximos Pasos

1. ✅ Completa ejercicios 01-03
2. ✅ Lee el README.md completo
3. ✅ Revisa INDICE.md para ver roadmap
4. ✅ Instala fp-ts y explora
5. ✅ Une a comunidad FP
6. ✅ Practica diariamente (15-30 min)

---

## ❓ FAQs

**Q: ¿Necesito saber matemáticas?**
A: No para empezar. Ayuda después pero no es requisito.

**Q: ¿Debo aprender Haskell?**
A: Recomendado pero no obligatorio. Te ayuda a pensar funcionalmente.

**Q: ¿FP es práctico?**
A: ¡Sí! Usado en producción por Facebook, Twitter, Jane Street, etc.

**Q: ¿FP es lento?**
A: No necesariamente. Con optimizaciones correctas es competitivo.

**Q: ¿Cuánto tiempo toma dominar FP?**
A: 3-6 meses para intermediate, 12+ meses para advanced.

---

**¡Bienvenido al mundo funcional!** 🎉

*Recuerda: FP es un journey, no un destination. Sé paciente contigo mismo y disfruta el proceso de cambiar tu forma de pensar sobre código.*
