# 🎓 Ejercicios de TypeScript y Patrones de Diseño

Este directorio contiene ejercicios prácticos basados en el roadmap de aprendizaje (`README.md`).

## 📋 Estructura

Cada ejercicio sigue un formato consistente y didáctico:

### ✨ Características de cada ejercicio:

1. **Código TypeScript** con explicaciones línea por línea
2. **Conceptos fundamentales** explicados desde primeros principios
3. **Uso en Big Tech** (FAANG) - cómo y por qué usan estos conceptos
4. **Casos de uso reales** especialmente en billing y pagos
5. **Mejores prácticas** y errores comunes
6. **Preguntas para reflexionar** que inspiran aprendizaje profundo
7. **Ejercicios prácticos** de diferentes niveles (básico → experto)
8. **Ejemplos ejecutables** - puedes correr cada archivo con ts-node

## 📚 Ejercicios Completados (19 en total)

### Nivel 1.1: Conceptos Básicos de TypeScript (7/7) ✅

#### ✅ 01 - Tipos Primitivos
**Carpeta:** `01-tipos-primitivos/`
**Conceptos:** string, number, boolean
**Aplicación:** Sistema de procesamiento de pagos
- Validación de tipos en tiempo de compilación
- Por qué Big Tech usa centavos vs decimales
- Prevención de errores financieros

**Ejecutar:** `ts-node src/claudeExcercise/01-tipos-primitivos/index.ts`

#### ✅ 02 - Arrays y Tuplas
**Carpeta:** `02-arrays-tuplas/`
**Conceptos:** Arrays homogéneos, tuplas heterogéneas
**Aplicación:** Listas de transacciones, datos de time-series
- Arrays para colecciones variables
- Tuplas para datos estructurados [timestamp, amount]
- Respuestas de APIs [success, data, error]

**Ejecutar:** `ts-node src/claudeExcercise/02-arrays-tuplas/index.ts`

#### ✅ 03 - Enums
**Carpeta:** `03-enums/`
**Conceptos:** Numeric enums, string enums, const enums
**Aplicación:** Estados de pago, métodos de pago, códigos de error
- Enums numéricos vs string enums
- Por qué Stripe usa string enums en su API
- Const enums para optimización

**Ejecutar:** `ts-node src/claudeExcercise/03-enums/index.ts`

#### ✅ 04 - Any, Unknown, Never
**Carpeta:** `04-any-unknown-never/`
**Conceptos:** Tipos especiales para casos edge
**Aplicación:** Validación de webhooks, manejo de errores
- any: cuándo (casi nunca) y por qué
- unknown: validación type-safe de datos externos
- never: exhaustive checking, funciones que no retornan

**Ejecutar:** `ts-node src/claudeExcercise/04-any-unknown-never/index.ts`

#### ✅ 05 - Type Assertions
**Carpeta:** `05-type-assertions/`
**Conceptos:** as, !, as const, double assertion
**Aplicación:** Parsear JSON de APIs, DOM manipulation
- Cuándo es seguro hacer assertions
- Validar antes de assert
- const assertions para inmutabilidad

**Ejecutar:** `ts-node src/claudeExcercise/05-type-assertions/index.ts`

#### ✅ 06 - Interfaces
**Carpeta:** `06-interfaces/`
**Conceptos:** Declaración, optional, readonly, extending
**Aplicación:** Modelos de datos (Payment, Customer, Invoice)
- Contratos type-safe
- readonly para inmutabilidad
- Extending para reutilización

**Ejecutar:** `ts-node src/claudeExcercise/06-interfaces/index.ts`

#### ✅ 07 - Type Aliases, Unions, Intersections
**Carpeta:** `07-type-aliases-unions-intersections/`
**Conceptos:** type, union (|), intersection (&), discriminated unions
**Aplicación:** Métodos de pago variantes, composición de entidades
- Literal types para estados
- Discriminated unions (Stripe event types)
- Intersections para mixins

**Ejecutar:** `ts-node src/claudeExcercise/07-type-aliases-unions-intersections/index.ts`

### Nivel 1.1: Clases y Genéricos (2/2) ✅

#### ✅ 08 - Clases en TypeScript
**Carpeta:** `08-clases-typescript/`
**Conceptos:** Propiedades, métodos, constructores, modificadores
**Aplicación:** Payment classes, Error hierarchies
- Modificadores de acceso (public, private, protected)
- Getters y Setters con validación
- Clases abstractas y Template Method
- Herencia y polimorfismo

**Ejecutar:** `ts-node src/claudeExcercise/08-clases-typescript/index.ts`

#### ✅ 09 - Genéricos
**Carpeta:** `09-genericos/`
**Conceptos:** Funciones y clases genéricas, constraints
**Aplicación:** Repository pattern, Result type, API responses
- Type inference
- Constraints (extends, keyof)
- Interfaces genéricas
- Utility types

**Ejecutar:** `ts-node src/claudeExcercise/09-genericos/index.ts`

### Nivel 1.2: Principios SOLID (5/5) ✅

#### ✅ 10 - Single Responsibility Principle (SRP)
**Carpeta:** `10-solid-srp/`
**Concepto:** Una clase, una razón para cambiar
**Aplicación:** Separación de validación, persistencia, notificaciones
- Payment class refactoring
- Service layer separation

**Ejecutar:** `ts-node src/claudeExcercise/10-solid-srp/index.ts`

#### ✅ 11 - Open/Closed Principle (OCP)
**Carpeta:** `11-solid-ocp/`
**Concepto:** Abierto para extensión, cerrado para modificación
**Aplicación:** Payment methods extensibles, Plugin architecture
- Strategy pattern
- Abstract classes

**Ejecutar:** `ts-node src/claudeExcercise/11-solid-ocp/index.ts`

#### ✅ 12 - Liskov Substitution Principle (LSP)
**Carpeta:** `12-solid-lsp/`
**Concepto:** Subtipos deben ser sustituibles por tipos base
**Aplicación:** Payment processors intercambiables
- Precondiciones y postcondiciones
- Contract compliance

**Ejecutar:** `ts-node src/claudeExcercise/12-solid-lsp/index.ts`

#### ✅ 13 - Interface Segregation Principle (ISP)
**Carpeta:** `13-solid-isp/`
**Concepto:** Interfaces pequeñas y cohesivas
**Aplicación:** Payment capabilities (Refundable, Recurring, etc.)
- Segregated interfaces
- Composition of capabilities

**Ejecutar:** `ts-node src/claudeExcercise/13-solid-isp/index.ts`

#### ✅ 14 - Dependency Inversion Principle (DIP)
**Carpeta:** `14-solid-dip/`
**Concepto:** Depender de abstracciones, no de concreciones
**Aplicación:** Payment gateway abstraction, Dependency injection
- Interface-based design
- DI containers

**Ejecutar:** `ts-node src/claudeExcercise/14-solid-dip/index.ts`

### Nivel 1.3: Conceptos Fundamentales (5/5) ✅

#### ✅ 15 - Composición vs Herencia
**Carpeta:** `15-composicion-vs-herencia/`
**Concepto:** Favor composition over inheritance
**Aplicación:** Employee roles, Payment with composed behaviors
- IS-A vs HAS-A relationships
- Mixins pattern

**Ejecutar:** `ts-node src/claudeExcercise/15-composicion-vs-herencia/index.ts`

#### ✅ 16 - Acoplamiento y Cohesión
**Carpeta:** `16-acoplamiento-cohesion/`
**Conceptos:** Coupling vs Cohesion, métricas (Ca, Ce, LCOM)
**Aplicación:** Microservicios desacoplados, módulos cohesivos
- Tipos de acoplamiento (Content, Common, Stamp, Data)
- Tipos de cohesión (Functional, Communicational, etc.)
- Event-driven architecture para bajo acoplamiento
- Dependency Injection

**Ejecutar:** `ts-node src/claudeExcercise/16-acoplamiento-cohesion/index.ts`

#### ✅ 17 - Encapsulación
**Carpeta:** `17-encapsulacion/`
**Conceptos:** Information hiding, public/private interfaces
**Aplicación:** Stripe PaymentIntent, encapsulación de complejidad
- Modificadores de acceso (public, private, protected, readonly)
- Getters/Setters con validación
- "Tell, Don't Ask" principle
- Encapsulación de colecciones

**Ejecutar:** `ts-node src/claudeExcercise/17-encapsulacion/index.ts`

#### ✅ 18 - Abstracción
**Carpeta:** `18-abstraccion/`
**Conceptos:** Abstract classes, interfaces, niveles de abstracción
**Aplicación:** Payment gateway abstraction, Facade pattern
- Ocultar complejidad de implementación
- Niveles de abstracción (HTTP → API → Service → Business Logic)
- Evitar "leaky abstractions"
- Template Method pattern

**Ejecutar:** `ts-node src/claudeExcercise/18-abstraccion/index.ts`

#### ✅ 19 - Polimorfismo
**Carpeta:** `19-polimorfismo/`
**Conceptos:** Subtype, Ad-hoc, Parametric polymorphism
**Aplicación:** Payment methods polimórficos, Strategy pattern
- Subtype polymorphism (interfaces, herencia)
- Ad-hoc polymorphism (function overloading)
- Parametric polymorphism (genéricos)
- Eliminar switch statements con polimorfismo

**Ejecutar:** `ts-node src/claudeExcercise/19-polimorfismo/index.ts`

---

## 📊 Estadísticas

- **Total de ejercicios:** 19 completados
- **Líneas de código:** ~20,000+
- **Conceptos cubiertos:** TypeScript completo + SOLID + Conceptos Fundamentales OOP
- **Ejemplos ejecutables:** 100%
- **Enfoque billing/payments:** Todos los ejercicios
- **Preguntas reflexivas:** 152+ (8 por ejercicio)
- **Ejercicios prácticos:** 76+ desafíos (4 niveles × 19 ejercicios)

## 🚀 Ejercicios Pendientes

Ver `PROGRESS.md` para lista completa de ejercicios pendientes, que incluye:

### Nivel 2 - Patrones Creacionales (5 patrones)
- [ ] Singleton, Factory Method, Abstract Factory
- [ ] Builder, Prototype

### Nivel 3 - Patrones Estructurales (7 patrones)
- [ ] Adapter, Facade, Composite, Decorator
- [ ] Proxy, Bridge, Flyweight

### Nivel 4 - Patrones de Comportamiento (11 patrones)
- [ ] Observer, Mediator, Chain of Responsibility
- [ ] Strategy, Template Method, Command
- [ ] State, Iterator, Visitor
- [ ] Memento, Interpreter

### Niveles 5-6 - Patrones Arquitectónicos y Avanzados (20+ patrones)
- [ ] MVC, MVP, MVVM, Repository, DDD
- [ ] Event Sourcing, CQRS, API Gateway
- [ ] Monads, Functors, Async Patterns
- [ ] Performance Patterns

**Total estimado:** ~41+ ejercicios adicionales

## 🎯 Cómo usar estos ejercicios

### 1. **Leer el código**
Cada archivo está densamente comentado. Lee los comentarios para entender:
- **🔑 CONCEPTO:** Explicaciones de conceptos
- **🏢 BIG TECH:** Cómo lo usan en la industria
- **💰 BILLING:** Aplicaciones en sistemas de pago
- **💡 PRÁCTICA:** Mejores prácticas

### 2. **Ejecutar los ejemplos**
```bash
# Ejecutar un ejercicio específico
ts-node src/claudeExcercise/01-tipos-primitivos/index.ts
ts-node src/claudeExcercise/10-solid-srp/index.ts

# Ver la salida y entender el flujo
```

### 3. **Modificar y experimentar**
- Cambia valores y observa errores de compilación
- Intenta romper el type safety para entender límites
- Agrega tus propios ejemplos

### 4. **Hacer los desafíos**
Al final de cada ejercicio hay 4 niveles de desafíos:
- **Básico:** Conceptos fundamentales
- **Intermedio:** Combinación de conceptos
- **Avanzado:** Problemas del mundo real
- **Experto:** Diseño de sistemas complejos

### 5. **Responder las preguntas**
Cada ejercicio incluye 8 preguntas para profundizar.
Investiga las respuestas para solidificar tu comprensión.

## 💡 Patrón para crear nuevos ejercicios

Usa los ejercicios existentes como plantilla. Cada uno debe incluir:

```typescript
/**
 * ==========================================
 * TÍTULO DEL CONCEPTO
 * ==========================================
 *
 * Descripción breve del concepto
 *
 * 📚 CONCEPTOS CLAVE:
 * - Lista de conceptos cubiertos
 *
 * 🏢 USO EN BIG TECH:
 * Cómo Stripe, PayPal, Amazon, etc. usan esto
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * Beneficios y razones para aprender
 */

// Secciones del ejercicio:
// 1. Conceptos básicos con ejemplos
// 2. Violación del principio/patrón (qué NO hacer)
// 3. Implementación correcta (qué SÍ hacer)
// 4. Casos de uso en billing & payments
// 5. Mejores prácticas y errores comunes
// 6. Preguntas para reflexionar (8 mínimo)
// 7. Ejercicios prácticos (4 niveles)
// 8. Exports para reutilización
```

## 📖 Recursos adicionales

- **TypeScript Handbook:** https://www.typescriptlang.org/docs/handbook/
- **Stripe API Docs:** https://stripe.com/docs/api (para ejemplos reales)
- **Refactoring.Guru:** https://refactoring.guru/design-patterns/typescript
- **PROGRESS.md:** Tracking completo de ejercicios completados y pendientes

## 🤝 Contribuir

Si creas ejercicios adicionales:
1. Sigue el formato establecido
2. Incluye ejemplos ejecutables
3. Enfócate en aplicaciones de billing/payments cuando sea posible
4. Documenta exhaustivamente con comentarios
5. Incluye preguntas y desafíos
6. Actualiza PROGRESS.md

## 📝 Notas

- Los ejercicios están diseñados para máximo aprendizaje, no brevedad
- Los comentarios son extensos intencionalmente
- Cada concepto se explica desde primeros principios
- Los ejemplos son realistas basados en sistemas de Big Tech
- El enfoque en billing/payments provee contexto concreto

---

**¡Feliz aprendizaje!** 🚀

*Recuerda: El objetivo no es solo escribir código que funcione, sino entender profundamente los conceptos y saber cuándo y por qué aplicarlos.*
