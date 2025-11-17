# 📑 Índice - Programación Funcional con TypeScript

## 🎯 Progresión del Curso

### Nivel 1: Fundamentos (Semanas 1-4)
#### 01 - Funciones Puras ✅
- `01-pure-functions/index.ts`
- Conceptos: Determinismo, sin side effects, testabilidad
- Ejercicios: Sistema de descuentos, memoización

#### 02 - Inmutabilidad
- `02-immutability/index.ts`
- Conceptos: const, readonly, Object.freeze, estructuras persistentes
- Ejercicios: State updates, data structures inmutables

#### 03 - Higher-Order Functions ✅
- `03-higher-order-functions/index.ts`
- Conceptos: Functions as values, HOF, composition
- Ejercicios: Validators, middleware, retry logic

#### 04 - Composición de Funciones
- `04-function-composition/index.ts`
- Conceptos: compose, pipe, point-free style
- Ejercicios: Data transformation pipelines

#### 05 - Currying
- `05-currying/index.ts`
- Conceptos: Currying, partial application, placeholders
- Ejercicios: Configuration builders, validators

#### 06 - Recursión
- `06-recursion/index.ts`
- Conceptos: Recursión básica, tail call optimization, trampoline
- Ejercicios: Tree traversal, factorial, fibonacci

---

### Nivel 2: Conceptos Core (Semanas 5-8)
#### 07 - Map, Filter, Reduce
- `07-map-filter-reduce/index.ts`
- Conceptos: Transformations, filtering, aggregation
- Ejercicios: Data processing pipelines

#### 08 - Lazy Evaluation
- `08-lazy-evaluation/index.ts`
- Conceptos: Generators, infinite sequences, performance
- Ejercicios: Stream processing, infinite lists

#### 09 - Pattern Matching
- `09-pattern-matching/index.ts`
- Conceptos: Discriminated unions, exhaustiveness checking
- Ejercicios: State machines, parsers

---

### Nivel 3: Estructuras Algebraicas (Semanas 9-14)
#### 10 - Semigroup y Monoid
- `10-semigroup-monoid/index.ts`
- Conceptos: Binary operations, identity element, laws
- Ejercicios: Combining configurations, aggregations

#### 11 - Functors
- `11-functors/index.ts`
- Conceptos: map operation, functor laws
- Ejercicios: Custom functors, transformations

#### 12 - Applicatives
- `12-applicatives/index.ts`
- Conceptos: ap operation, lifting, validation
- Ejercicios: Form validation, parallel operations

#### 13 - Monads - Maybe/Option
- `13-monad-maybe/index.ts`
- Conceptos: Handling null/undefined, chaining operations
- Ejercicios: Safe navigation, optional data

#### 14 - Monads - Either
- `14-monad-either/index.ts`
- Conceptos: Error handling, left/right values
- Ejercicios: Validation pipelines, error accumulation

#### 15 - Monads - IO
- `15-monad-io/index.ts`
- Conceptos: Encapsulating side effects, lazy evaluation
- Ejercicios: File operations, console I/O

#### 16 - Monads - Task
- `16-monad-task/index.ts`
- Conceptos: Async operations, lazy promises
- Ejercicios: API calls, async pipelines

#### 17 - Monads - Reader
- `17-monad-reader/index.ts`
- Conceptos: Dependency injection, configuration
- Ejercicios: App configuration, environment

#### 18 - Monads - State
- `18-monad-state/index.ts`
- Conceptos: Stateful computations, get/put/modify
- Ejercicios: Game state, counters

---

### Nivel 4: Patrones Avanzados (Semanas 15-20)
#### 19 - Monad Transformers
- `19-monad-transformers/index.ts`
- Conceptos: Stacking monads, lift operation
- Ejercicios: OptionT, EitherT, complex stacks

#### 20 - Free Monads
- `20-free-monads/index.ts`
- Conceptos: Separation of description and interpretation
- Ejercicios: DSL creation, interpreters

#### 21 - Lenses
- `21-lenses/index.ts`
- Conceptos: Functional getters/setters, composition
- Ejercicios: Nested updates, focus on data

#### 22 - Prisms y Optics
- `22-prisms-optics/index.ts`
- Conceptos: Optics for sum types, traversals
- Ejercicios: Pattern matching, data access

#### 23 - Recursion Schemes
- `23-recursion-schemes/index.ts`
- Conceptos: Catamorphisms, anamorphisms, fixed points
- Ejercicios: Expression evaluation, AST traversal

---

### Nivel 5: FP en la Práctica (Semanas 21-26)
#### 24 - Error Handling
- `24-error-handling/index.ts`
- Conceptos: Railway oriented programming, validation
- Ejercicios: Robust pipelines, error recovery

#### 25 - State Management
- `25-state-management/index.ts`
- Conceptos: Immutable updates, state machines
- Ejercicios: Redux-like patterns, FSM

#### 26 - Async Patterns
- `26-async-patterns/index.ts`
- Conceptos: Task, parallel computation, sequences
- Ejercicios: API orchestration, concurrent ops

#### 27 - Validation y Parsing
- `27-validation-parsing/index.ts`
- Conceptos: Combinators, parser combinators
- Ejercicios: Form validation, JSON parser

#### 28 - Testing Funcional
- `28-testing/index.ts`
- Conceptos: Property-based testing, generators
- Ejercicios: Test suites with fast-check

---

### Nivel 6: Tópicos Expertos (Semanas 27-36)
#### 29 - Type-Level Programming
- `29-type-level/index.ts`
- Conceptos: Advanced types, phantom types, HKT simulation
- Ejercicios: Type-safe builders, state machines

#### 30 - Effect Systems
- `30-effect-systems/index.ts`
- Conceptos: Algebraic effects, effect-ts
- Ejercicios: Effect-based applications

#### 31 - Tagless Final
- `31-tagless-final/index.ts`
- Conceptos: Type classes, interpreters, MTL style
- Ejercicios: Modular interpreters

#### 32 - Category Theory
- `32-category-theory/index.ts`
- Conceptos: Categories, functors, natural transformations
- Ejercicios: Category laws, implementations

#### 33 - Performance Optimization
- `33-performance/index.ts`
- Conceptos: Memoization, fusion, laziness
- Ejercicios: Benchmarking, optimization

---

## 📊 Progreso Sugerido

### Semana 1-2: Fundamentos
✅ Pure functions
✅ Immutability
✅ Higher-order functions

### Semana 3-4: Composición
✅ Function composition
✅ Currying
✅ Recursion

### Semana 5-8: Core Concepts
✅ Array operations
✅ Lazy evaluation
✅ Pattern matching

### Semana 9-14: Algebraic Structures
✅ Semigroup/Monoid
✅ Functors
✅ Applicatives
✅ All major monads

### Semana 15-20: Advanced Patterns
✅ Transformers
✅ Free monads
✅ Optics (Lenses, Prisms)

### Semana 21-26: Practical FP
✅ Error handling patterns
✅ State management
✅ Async patterns

### Semana 27-36: Expert Topics
✅ Type-level programming
✅ Effect systems
✅ Category theory

---

## 🎓 Certificación de Nivel

### Nivel 1 - Fundamentals
- [ ] Todas las funciones son puras por defecto
- [ ] Nunca mutas datos
- [ ] Usas HOF naturalmente
- [ ] Compones funciones regularmente

### Nivel 2 - Core Concepts
- [ ] Dominas map/filter/reduce
- [ ] Entiendes lazy evaluation
- [ ] Usas pattern matching
- [ ] Compones transformaciones complejas

### Nivel 3 - Algebraic Structures
- [ ] Implementas functors desde cero
- [ ] Usas monads apropiadamente
- [ ] Entiendes monad laws
- [ ] Combinas applicatives para validation

### Nivel 4 - Advanced
- [ ] Stacks monad transformers
- [ ] Creas DSLs con free monads
- [ ] Usas lenses para updates
- [ ] Implementas recursion schemes

### Nivel 5 - Practical
- [ ] Railway oriented programming
- [ ] Effect management
- [ ] Property-based testing
- [ ] Production-ready FP code

### Nivel 6 - Expert
- [ ] Type-level programming
- [ ] Effect systems
- [ ] Category theory aplicada
- [ ] Arquitecturas FP completas

---

## 📚 Recursos por Nivel

### Nivel 1-2: Fundamentos
- Professor Frisby's Guide
- JavaScript Allongé
- Functional-Light JavaScript

### Nivel 3-4: Algebraic Structures
- fp-ts documentation
- Haskell Programming from First Principles
- Fantasy Land specification

### Nivel 5-6: Advanced & Expert
- Category Theory for Programmers
- Functional Programming in Scala (Red Book)
- Effect-ts documentation
- Academic papers

---

## 🚀 Proyecto Final

Al completar todos los niveles, desarrollarás:

**E-commerce Funcional Completo**
- Pure domain logic
- Effect system for I/O
- Algebraic data types
- Monad transformers
- Optics for state
- Property-based tests
- Type-safe throughout
- Zero runtime errors
- Composable architecture

---

## 💡 Tips de Estudio

1. **Practica diariamente** - Consistencia sobre intensidad
2. **Implementa desde cero** - No solo uses bibliotecas
3. **Lee código funcional** - Estudia fp-ts, Ramda
4. **Aprende Haskell** - El mejor teacher de FP
5. **Resuelve katas** - CodeWars, Exercism
6. **Enseña conceptos** - Blog, talks, mentoring
7. **Une teoría y práctica** - Papers + código
8. **Sé paciente** - FP requiere cambiar tu forma de pensar

---

**¡Buena suerte en tu viaje funcional!** 🎯
