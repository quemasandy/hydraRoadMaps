# 🎯 Roadmap de Aprendizaje: Programación Funcional con TypeScript

## 📚 Tabla de Contenidos
- [Nivel 1: Fundamentos](#nivel-1-fundamentos)
- [Nivel 2: Conceptos Core de FP](#nivel-2-conceptos-core-de-fp)
- [Nivel 3: Estructuras Algebraicas](#nivel-3-estructuras-algebraicas)
- [Nivel 4: Patrones Avanzados de FP](#nivel-4-patrones-avanzados-de-fp)
- [Nivel 5: FP en la Práctica](#nivel-5-fp-en-la-práctica)
- [Nivel 6: Tópicos Expertos](#nivel-6-tópicos-expertos)
- [Recursos y Práctica](#recursos-y-práctica)

---

## Nivel 1: Fundamentos

### 1.1 Introducción a la Programación Funcional
**Tiempo estimado: 1-2 semanas**

- [ ] **¿Qué es la Programación Funcional?**
  - Paradigma funcional vs imperativo vs OOP
  - Historia y filosofía
  - Ventajas y casos de uso
  - FP en el mundo real (Haskell, Scala, F#, Clojure)
  - FP en JavaScript/TypeScript

- [ ] **Funciones Puras**
  - Definición y características
  - Ausencia de efectos secundarios
  - Determinismo (misma entrada = misma salida)
  - Testabilidad
  - Ejercicio práctico: Identificar y refactorizar funciones impuras

- [ ] **Inmutabilidad**
  - Por qué la inmutabilidad es importante
  - const vs readonly vs Readonly<T>
  - Object.freeze y deep freeze
  - Técnicas de actualización inmutable
  - Immer y bibliotecas de inmutabilidad
  - Ejercicio práctico: Estructuras de datos inmutables

- [ ] **Transparencia Referencial**
  - Concepto y beneficios
  - Memoización y caching seguro
  - Optimizaciones del compilador
  - Ejercicio práctico: Funciones referencialmente transparentes

### 1.2 Funciones como Ciudadanos de Primera Clase
**Tiempo estimado: 1-2 semanas**

- [ ] **First-Class Functions**
  - Funciones como valores
  - Asignar funciones a variables
  - Pasar funciones como argumentos
  - Retornar funciones
  - Ejercicio práctico: Callbacks y event handlers funcionales

- [ ] **Higher-Order Functions (HOF)**
  - Definición y ejemplos
  - Funciones que reciben funciones
  - Funciones que retornan funciones
  - HOF en Array: map, filter, reduce
  - Crear HOF personalizadas
  - Ejercicio práctico: Pipeline de transformaciones

- [ ] **Closures y Scope**
  - Cómo funcionan los closures
  - Capturing de variables
  - Factory functions
  - Private state con closures
  - Ejercicio práctico: Contadores y state encapsulado

- [ ] **Arrow Functions y This**
  - Sintaxis y características
  - Lexical this binding
  - Cuándo usar arrow vs function
  - Ejercicio práctico: Refactorizar a arrow functions

### 1.3 Declarativo vs Imperativo
**Tiempo estimado: 1 semana**

- [ ] **Estilo Declarativo**
  - Qué hacer vs cómo hacerlo
  - Beneficios de la legibilidad
  - Ejercicio: Transformar código imperativo a declarativo

- [ ] **Expresiones vs Statements**
  - Todo es una expresión en FP
  - Ternarios y expresiones condicionales
  - Ejercicio práctico: Eliminar statements

- [ ] **Evitar Side Effects**
  - Identificar efectos secundarios
  - Aislar efectos secundarios
  - Ejercicio práctico: Refactorizar código con side effects

---

## Nivel 2: Conceptos Core de FP

### 2.1 Composición de Funciones
**Tiempo estimado: 2-3 semanas**

- [ ] **Function Composition**
  - Concepto matemático
  - compose y pipe
  - Composición de izquierda a derecha vs derecha a izquierda
  - Point-free style
  - Ejercicio práctico: Pipeline de validaciones

- [ ] **Piping y Chaining**
  - Diferencia entre compose y pipe
  - Implementar pipe desde cero
  - Pipelines legibles
  - Ejercicio práctico: Data transformation pipeline

- [ ] **Point-Free Style**
  - Ventajas y desventajas
  - Cuándo usar y cuándo evitar
  - Tacit programming
  - Ejercicio práctico: Refactorizar a point-free

### 2.2 Currying y Aplicación Parcial
**Tiempo estimado: 2-3 semanas**

- [ ] **Currying**
  - Concepto y definición
  - Transformar funciones multi-argumento
  - Implementar curry desde cero
  - Curry automático
  - Ejercicio práctico: Curry en validaciones

- [ ] **Partial Application**
  - Diferencia con currying
  - bind y aplicación parcial
  - Crear funciones especializadas
  - Ejercicio práctico: Configuración con partial application

- [ ] **Placeholders y Reordering**
  - Argumentos en diferentes posiciones
  - Ramda-style placeholders
  - Ejercicio práctico: Funciones flexibles con placeholders

### 2.3 Recursión
**Tiempo estimado: 2 semanas**

- [ ] **Recursión Básica**
  - Concepto y caso base
  - Recursión vs iteración
  - Stack overflow y límites
  - Ejercicio práctico: Factorial, Fibonacci recursivo

- [ ] **Tail Call Optimization (TCO)**
  - Qué es TCO
  - Recursión de cola
  - Trampoline pattern
  - Soporte en JavaScript/TypeScript
  - Ejercicio práctico: Implementar trampoline

- [ ] **Recursión con Estructuras de Datos**
  - Árboles y listas recursivas
  - Traverse recursivo
  - Ejercicio práctico: File system tree traversal

### 2.4 Operaciones sobre Colecciones
**Tiempo estimado: 2 semanas**

- [ ] **Map, Filter, Reduce**
  - Implementar desde cero
  - Composición de operaciones
  - Performance considerations
  - Ejercicio práctico: Data processing pipeline

- [ ] **Operaciones Avanzadas**
  - flatMap / chain
  - zip, unzip
  - partition
  - groupBy
  - Ejercicio práctico: Análisis de datos complejo

- [ ] **Lazy Evaluation**
  - Concepto de evaluación perezosa
  - Generators en TypeScript
  - Streams infinitos
  - Ejercicio práctico: Secuencias infinitas con generators

---

## Nivel 3: Estructuras Algebraicas

### 3.1 Type Classes Básicas
**Tiempo estimado: 2-3 semanas**

- [ ] **Semigroup**
  - Concepto: operación binaria asociativa
  - concat operation
  - Ejemplos: strings, arrays, números
  - Ejercicio práctico: Custom semigroups

- [ ] **Monoid**
  - Semigroup + elemento identidad
  - empty/mempty
  - fold y reduce con monoids
  - Ejercicio práctico: Combinar configuraciones

- [ ] **Foldable**
  - Estructuras que pueden ser plegadas
  - foldLeft, foldRight
  - Ejercicio práctico: Custom foldable structures

### 3.2 Functors
**Tiempo estimado: 2-3 semanas**

- [ ] **Concepto de Functor**
  - Definición matemática
  - Leyes de functors (identity, composition)
  - map operation
  - Ejemplos: Array, Promise, Option
  - Ejercicio práctico: Implementar functors personalizados

- [ ] **Bifunctor**
  - Functors con dos type parameters
  - bimap operation
  - Either como bifunctor
  - Ejercicio práctico: Error handling con Either

- [ ] **Contravariant Functor**
  - contramap operation
  - Predicates y comparators
  - Ejercicio práctico: Custom contravariant functors

### 3.3 Applicatives
**Tiempo estimado: 2-3 semanas**

- [ ] **Concepto de Applicative**
  - Apply y Applicative
  - ap operation
  - Leyes de applicatives
  - Ejercicio práctico: Validación con applicatives

- [ ] **Lifting Functions**
  - liftA2, liftA3, liftAN
  - Combinar contextos
  - Ejercicio práctico: Form validation

- [ ] **Applicative vs Monad**
  - Cuándo usar cada uno
  - Independencia vs dependencia
  - Ejercicio práctico: Comparación práctica

### 3.4 Monads
**Tiempo estimado: 3-4 semanas**

- [ ] **Concepto de Monad**
  - Definición y leyes (left identity, right identity, associativity)
  - flatMap / chain / bind
  - of / pure / return
  - Ejercicio práctico: Implementar monad desde cero

- [ ] **Maybe/Option Monad**
  - Manejo de valores opcionales
  - Some y None
  - Evitar null/undefined checks
  - Ejercicio práctico: Cadenas de operaciones seguras

- [ ] **Either Monad**
  - Error handling funcional
  - Left y Right
  - Accumulating errors
  - Ejercicio práctico: Pipeline con error handling

- [ ] **IO Monad**
  - Encapsular efectos secundarios
  - Lazy execution
  - Composición de efectos
  - Ejercicio práctico: File operations con IO

- [ ] **Task/Future Monad**
  - Operaciones asíncronas
  - Diferencia con Promise
  - Lazy async computation
  - Ejercicio práctico: API calls con Task

- [ ] **Reader Monad**
  - Dependency injection funcional
  - Configuración compartida
  - Ejercicio práctico: App configuration con Reader

- [ ] **Writer Monad**
  - Logging funcional
  - Acumular output
  - Ejercicio práctico: Computation tracing

- [ ] **State Monad**
  - State management funcional
  - get, put, modify
  - Ejercicio práctico: Stateful computations

---

## Nivel 4: Patrones Avanzados de FP

### 4.1 Monad Transformers
**Tiempo estimado: 3-4 semanas**

- [ ] **Concepto de Transformers**
  - Combinar múltiples monads
  - Stacking monads
  - lift operation
  - Ejercicio práctico: OptionT, EitherT

- [ ] **Common Transformers**
  - ReaderT
  - StateT
  - ExceptT (EitherT)
  - Ejercicio práctico: Real-world app con transformers

- [ ] **Monad Transformer Stacks**
  - Diseñar stacks efectivos
  - Performance considerations
  - Ejercicio práctico: Complex transformer stack

### 4.2 Free Monads
**Tiempo estimado: 2-3 semanas**

- [ ] **Concepto de Free Monad**
  - Interpreters
  - Separar descripción de ejecución
  - DSLs con free monads
  - Ejercicio práctico: DSL para operaciones

- [ ] **Free Applicative**
  - Optimización y análisis estático
  - Ejercicio práctico: Validation DSL

### 4.3 Lenses y Optics
**Tiempo estimado: 2-3 semanas**

- [ ] **Lenses**
  - Getter y Setter funcionales
  - Lens laws
  - Composición de lenses
  - Ejercicio práctico: Nested immutable updates

- [ ] **Prisms**
  - Optics para sum types
  - Pattern matching con prisms
  - Ejercicio práctico: Error handling con prisms

- [ ] **Traversals e Isos**
  - Otras categorías de optics
  - Monocle-ts library
  - Ejercicio práctico: Complex data manipulation

### 4.4 Algebras y Recursion Schemes
**Tiempo estimado: 2-3 semanas**

- [ ] **F-Algebras**
  - Catamorphisms (fold generalizado)
  - Fixed points
  - Ejercicio práctico: Expression evaluator

- [ ] **F-Coalgebras**
  - Anamorphisms (unfold)
  - Generación de estructuras
  - Ejercicio práctico: Stream generation

- [ ] **Recursion Schemes**
  - Hylomorphisms
  - Paramorphisms
  - Ejercicio práctico: AST transformations

---

## Nivel 5: FP en la Práctica

### 5.1 Error Handling
**Tiempo estimado: 2-3 semanas**

- [ ] **Railway Oriented Programming**
  - Success and failure tracks
  - Composición de funciones con errores
  - Ejercicio práctico: Validation pipeline

- [ ] **Validated Applicative**
  - Acumular todos los errores
  - vs Either que falla rápido
  - Ejercicio práctico: Form validation completa

- [ ] **Error Handling Patterns**
  - try/catch funcional
  - Error recovery
  - Ejercicio práctico: Resilient API client

### 5.2 State Management
**Tiempo estimado: 2-3 semanas**

- [ ] **Immutable State Updates**
  - Lenses para state updates
  - Redux-like patterns
  - Ejercicio práctico: State management library

- [ ] **State Machines Funcionales**
  - FSM con tipos algebraicos
  - Ejercicio práctico: Workflow engine

- [ ] **Event Sourcing Funcional**
  - Eventos inmutables
  - Fold left sobre eventos
  - Ejercicio práctico: Event-sourced aggregate

### 5.3 Async y Concurrencia
**Tiempo estimado: 2-3 semanas**

- [ ] **Task y Future**
  - Lazy async computations
  - Composición de tasks
  - Ejercicio práctico: Async pipeline

- [ ] **Observable Patterns**
  - RxJS desde perspectiva FP
  - Operators como HOF
  - Ejercicio práctico: Real-time data stream

- [ ] **Parallel Computation**
  - traverse vs sequence
  - Parallel vs sequential
  - Ejercicio práctico: Parallel API calls

### 5.4 Validación y Parsing
**Tiempo estimado: 2 semanas**

- [ ] **Validation Combinators**
  - Composición de validadores
  - Accumulating errors
  - Ejercicio práctico: Complex form validation

- [ ] **Parser Combinators**
  - Parsers funcionales
  - Composición de parsers
  - Ejercicio práctico: JSON/CSV parser

### 5.5 Testing Funcional
**Tiempo estimado: 1-2 semanas**

- [ ] **Property-Based Testing**
  - fast-check library
  - Generadores
  - Ejercicio práctico: Test cases generativos

- [ ] **Testing Pure Functions**
  - Estrategias de testing
  - Mocking en FP
  - Ejercicio práctico: Test suite funcional

---

## Nivel 6: Tópicos Expertos

### 6.1 Type-Level Programming
**Tiempo estimado: 3-4 semanas**

- [ ] **Advanced TypeScript Types**
  - Conditional types avanzados
  - Mapped types recursivos
  - Template literal types
  - Ejercicio práctico: Type-safe builders

- [ ] **Phantom Types**
  - Tipos que no existen en runtime
  - Type-level state machines
  - Ejercicio práctico: Type-safe DSL

- [ ] **Higher-Kinded Types (HKT)**
  - Simulación en TypeScript
  - fp-ts approach
  - Ejercicio práctico: Generic abstractions

### 6.2 Effect Systems
**Tiempo estimado: 3-4 semanas**

- [ ] **Algebraic Effects**
  - Concepto y beneficios
  - Effect handlers
  - Ejercicio práctico: Custom effect system

- [ ] **ZIO-style Effects**
  - Environment, Error, Result
  - Dependency injection
  - Ejercicio práctico: App con effect system

- [ ] **Effect-TS Library**
  - Effect, Layer, Context
  - Real-world usage
  - Ejercicio práctico: Production-ready app

### 6.3 Tagless Final
**Tiempo estimado: 2-3 semanas**

- [ ] **Concepto de Tagless Final**
  - Encoding vs interpretation
  - Type classes en TypeScript
  - Ejercicio práctico: Interpreter pattern

- [ ] **MTL Style**
  - Monad type classes
  - Capability-based design
  - Ejercicio práctico: Modular program

### 6.4 Category Theory
**Tiempo estimado: 3-4 semanas**

- [ ] **Fundamentos de Teoría de Categorías**
  - Categorías, objetos, morfismos
  - Composición y identidad
  - Ejercicio práctico: Category laws verification

- [ ] **Functors y Natural Transformations**
  - Perspectiva categórica
  - Natural transformations
  - Ejercicio práctico: Implementar transformations

- [ ] **Adjunctions y Monads**
  - Adjoint functors
  - Monads desde categorías
  - Kleisli categories
  - Ejercicio práctico: Explorar relaciones

### 6.5 Performance y Optimización
**Tiempo estimado: 2-3 semanas**

- [ ] **FP Performance**
  - Memoization strategies
  - Fusion optimization
  - Laziness vs strictness
  - Ejercicio práctico: Optimizar pipeline

- [ ] **Memory Management**
  - Garbage collection considerations
  - Persistent data structures
  - Ejercicio práctico: Efficient immutable structures

- [ ] **Benchmarking**
  - Medir performance de código FP
  - Trade-offs
  - Ejercicio práctico: Benchmark suite

### 6.6 Proyecto Final Integrador
**Tiempo estimado: 6-8 semanas**

- [ ] **Sistema de E-commerce Funcional Completo**

**Arquitectura funcional:**
  - Effect system para dependency injection
  - State management inmutable
  - Algebraic data types para domain modeling
  - Monad transformers para composition
  - Optics para state updates
  - Property-based testing

**Funcionalidades:**
  - Product catalog (Reader + Option)
  - Shopping cart (State + Validation)
  - Checkout process (Either + Task)
  - Payment processing (IO + Effect)
  - Order management (Event Sourcing)
  - Notifications (Observable)
  - User authentication (Reader + Either)
  - Inventory management (State Machine)

**Requisitos técnicos:**
  - Pure functions everywhere
  - No side effects sin IO/Effect
  - Tipos algebraicos para domain
  - Lenses para updates
  - Property tests
  - Effect system completo
  - Zero runtime errors

---

## 📖 Recursos y Práctica

### Libros Recomendados
1. **"Functional Programming in Scala"** - Paul Chiusano, Rúnar Bjarnason
2. **"Haskell Programming from First Principles"** - Christopher Allen, Julie Moronuki
3. **"Domain Modeling Made Functional"** - Scott Wlaschin
4. **"Category Theory for Programmers"** - Bartosz Milewski
5. **"Grokking Simplicity"** - Eric Normand
6. **"Functional Design and Architecture"** - Alexander Granin

### Recursos Online
- [fp-ts Documentation](https://gcanti.github.io/fp-ts/) - FP library para TypeScript
- [effect-ts](https://www.effect.website/) - Effect system moderno
- [Learn You a Haskell](http://learnyouahaskell.com/) - Introducción a Haskell
- [Fantasy Land Specification](https://github.com/fantasyland/fantasy-land) - Especificación de algebraic structures
- [Professor Frisby's Mostly Adequate Guide](https://mostly-adequate.gitbook.io/) - FP en JavaScript
- [Functional Programming Jargon](https://github.com/hemanth/functional-programming-jargon) - Glosario

### Bibliotecas TypeScript
- **fp-ts**: Programación funcional en TypeScript
- **effect**: Effect system moderno y poderoso
- **io-ts**: Runtime type validation
- **monocle-ts**: Optics (lenses, prisms)
- **fast-check**: Property-based testing
- **purify-ts**: FP utilities
- **Ramda**: Utility functions funcionales

### Práctica Recomendada

#### Ejercicios Diarios (15-30 min)
- Refactorizar código imperativo a funcional
- Resolver katas con FP
- Implementar estructuras algebraicas simples
- Leer código funcional de proyectos open source

#### Ejercicios Semanales (2-4 horas)
- Implementar una estructura algebraica completa
- Crear mini-proyecto con fp-ts
- Resolver problemas de Advent of Code con FP
- Code review de implementaciones funcionales

#### Proyectos Mensuales (8-16 horas)
- Proyectos integradores al final de cada nivel
- Contribuir a proyectos FP open source
- Crear biblioteca FP personalizada
- Blog posts explicando conceptos

### Sistema de Evaluación

#### Por cada concepto:
- [ ] Entender la teoría matemática subyacente
- [ ] Conocer las leyes y propiedades
- [ ] Implementar desde cero sin bibliotecas
- [ ] Identificar cuándo usar y cuándo NO usar
- [ ] Aplicar en problemas reales
- [ ] Hacer al menos 3-5 ejercicios prácticos

#### Criterios de Dominio:
- **Básico**: Puedes usar bibliotecas FP con documentación
- **Intermedio**: Puedes implementar estructuras desde cero
- **Avanzado**: Puedes diseñar APIs funcionales
- **Experto**: Puedes enseñar y crear abstracciones nuevas

---

## 🎯 Plan de Estudio Sugerido

### Opción Intensiva (4-6 meses)
- 20-30 horas/semana
- Enfoque full-time en aprendizaje
- Completar todos los niveles secuencialmente
- Aprender Haskell en paralelo (recomendado)

### Opción Moderada (8-12 meses)
- 10-15 horas/semana
- Balance con trabajo
- Profundizar en cada concepto
- Práctica constante con proyectos reales

### Opción Pausada (12-18 meses)
- 5-10 horas/semana
- Aprendizaje sostenible
- Máxima retención y comprensión profunda
- Consolidación con lecturas teóricas

---

## 🚀 Consejos para el Éxito

1. **Aprende Haskell en paralelo** - La mejor forma de entender FP puro
2. **Practica con fp-ts desde el inicio** - No esperes a entender todo
3. **Lee código funcional** - Estudia proyectos como Redux, RxJS
4. **No te frustres con Category Theory** - Es gradual y requiere tiempo
5. **Escribe código funcional todos los días** - La consistencia es clave
6. **Enseña lo que aprendes** - Blog posts, talks, mentoring
7. **Une teoría y práctica** - Balance entre matemáticas y código
8. **Resuelve puzzles y katas** - CodeWars, Exercism, Advent of Code
9. **Participa en comunidades FP** - Slack, Discord, Reddit
10. **No abuses de abstracciones** - Usa el nivel apropiado de abstracción
11. **Prueba diferentes lenguajes FP** - Haskell, Scala, F#, Elm, PureScript
12. **Lee papers académicos** - Expanden tu comprensión profunda
13. **Implementa papers en TypeScript** - La mejor forma de entender
14. **Refactoriza código viejo a FP** - Práctica con código real
15. **Sé paciente** - FP es un viaje largo pero gratificante

---

## 📝 Tracking de Progreso

### Formato de Registro

Para cada concepto completado, registra:
```
Concepto: [Nombre]
Fecha: [DD/MM/YYYY]
Tiempo invertido: [X horas]
Nivel de comprensión: [Básico/Intermedio/Avanzado/Experto]
Ejercicios completados: [X/Y]
Implementación: [GitHub URL]
Notas: [Insights, dificultades, aplicaciones, papers leídos]
```

### Milestones

- [ ] **Mes 1**: Fundamentos - Pure functions, immutability, HOF
- [ ] **Mes 2**: Core concepts - Composition, currying, recursion
- [ ] **Mes 3**: Functors y estructuras básicas
- [ ] **Mes 4**: Monads y applicatives dominados
- [ ] **Mes 5**: Transformers y free monads
- [ ] **Mes 6**: Lenses y optics
- [ ] **Mes 7-8**: Effect systems y tagless final
- [ ] **Mes 9-10**: Category theory y optimización
- [ ] **Mes 11-12**: Proyecto final y consolidación

---

## 🎓 Próximos Pasos

1. Evalúa tu nivel actual de TypeScript y JavaScript
2. Si es necesario, refuerza fundamentos de TypeScript
3. Instala fp-ts y familiarízate con la documentación
4. Elige tu plan de estudio (Intensivo/Moderado/Pausado)
5. Comienza con Nivel 1: Pure functions e immutability
6. Mantén un diario de aprendizaje (blog o notebook)
7. Únete a comunidades FP (FP Slack, Reddit r/functionalprogramming)
8. Considera aprender Haskell en paralelo
9. Configura un proyecto TypeScript con fp-ts
10. Comienza a refactorizar código existente a FP

---

## 💡 Preguntas Frecuentes

### ¿Necesito saber matemáticas avanzadas?
No para empezar. Las matemáticas ayudan con Category Theory pero no son prerequisito.

### ¿Debo aprender Haskell?
Altamente recomendado pero no obligatorio. Haskell te fuerza a pensar funcionalmente.

### ¿FP es práctico para producción?
Absolutamente. Usado en Facebook (Reason), Twitter (Scala), Jane Street (OCaml).

### ¿FP es más lento que código imperativo?
No necesariamente. Con optimizaciones correctas puede ser igual o más rápido.

### ¿Puedo mezclar FP con OOP?
Sí, en TypeScript es común. Usa FP para lógica y OOP para estructura.

### ¿Qué biblioteca FP uso?
fp-ts para TypeScript completo, Ramda para utilities, effect para effect system.

---

## 🏆 Habilidades que Obtendrás

Al completar este roadmap dominarás:

✅ Pensamiento funcional y razonamiento sobre código
✅ Composición de funciones y abstracción
✅ Estructuras algebraicas (Functors, Monads, etc.)
✅ Type-level programming avanzado
✅ Effect systems y dependency injection funcional
✅ Error handling robusto sin excepciones
✅ State management inmutable
✅ Testing con property-based testing
✅ Performance optimization en FP
✅ Category theory aplicada a programación
✅ Diseño de APIs funcionales elegantes
✅ Código más testeable, mantenible y seguro

---

## 📚 Glosario Rápido

- **Pure Function**: Función sin side effects y determinista
- **Functor**: Estructura que se puede mapear (implementa map)
- **Monad**: Estructura que se puede encadenar (implementa flatMap/chain)
- **HOF**: Higher-Order Function - función que recibe o retorna funciones
- **Currying**: Transformar f(a, b) en f(a)(b)
- **Partial Application**: Fijar algunos argumentos de una función
- **Composition**: Combinar funciones f ∘ g = f(g(x))
- **Point-Free**: Estilo sin mencionar argumentos explícitamente
- **ADT**: Algebraic Data Type - sum types y product types
- **TCO**: Tail Call Optimization - optimizar recursión de cola

---

**¡Buena suerte en tu viaje hacia la maestría en Programación Funcional con TypeScript!** 🚀

*Recuerda: FP no es solo sobre usar map/filter/reduce. Es sobre razonar matemáticamente sobre tu código, hacer explícitos los efectos, y crear abstracciones componibles que te permitan construir sistemas robustos y mantenibles.*

**Pro tip**: No intentes entender todo de una vez. FP es como aprender un nuevo idioma - requiere práctica constante y exposición repetida. Empieza simple, sé consistente, y disfruta el proceso de transformar tu forma de pensar sobre código.
