# 📑 Índice - Advanced TypeScript

## 🎯 Progresión del Curso

### Nivel 1: Fundamentos de Tipos Avanzados (Semanas 1-8)

#### 01 - Literal Types y Const Assertions
- `01-literal-types/index.ts`
- Conceptos: String/numeric/boolean literals, const assertions
- Ejercicios: API endpoints type-safe, configuration

#### 02 - Discriminated Unions
- `02-discriminated-unions/index.ts`
- Conceptos: Tagged unions, exhaustiveness checking, never type
- Ejercicios: State machines, Result types, API responses

#### 03 - Type Guards Básicos
- `03-type-guards-basic/index.ts`
- Conceptos: typeof, instanceof, in, truthiness narrowing
- Ejercicios: Safe parsing, runtime validation

#### 04 - Custom Type Guards
- `04-custom-type-guards/index.ts`
- Conceptos: Type predicates (is), assertion functions
- Ejercicios: Validation library, domain object guards

#### 05 - Generics Constraints
- `05-generics-constraints/index.ts`
- Conceptos: extends, keyof, conditional constraints
- Ejercicios: Type-safe query builder, collection operations

#### 06 - Generic Utility Patterns
- `06-generic-utilities/index.ts`
- Conceptos: Factory patterns, builders, repository patterns
- Ejercicios: CRUD operations, data access layer

---

### Nivel 2: Type-Level Programming (Semanas 9-16)

#### 07 - Mapped Types Básicos
- `07-mapped-types-basic/index.ts`
- Conceptos: Property transformations, readonly/optional
- Ejercicios: Configuration transformers, API adapters

#### 08 - Mapped Types Avanzados
- `08-mapped-types-advanced/index.ts`
- Conceptos: Key remapping (as), filtering, template literals
- Ejercicios: Deep transformations, type conversions

#### 09 - Conditional Types
- `09-conditional-types/index.ts`
- Conceptos: T extends U ? X : Y, distributive types
- Ejercicios: Type extraction, conditional transformations

#### 10 - Infer Keyword
- `10-infer-keyword/index.ts`
- Conceptos: Type inference, extracting types from functions/arrays
- Ejercicios: Unwrap utilities, parameter extraction

#### 11 - Template Literal Types
- `11-template-literal-types/index.ts`
- Conceptos: String manipulation, pattern matching, DSLs
- Ejercicios: Route types, SQL query types, CSS-in-JS

#### 12 - Recursive Types
- `12-recursive-types/index.ts`
- Conceptos: Recursive definitions, depth limits, tree structures
- Ejercicios: Deep Readonly, Deep Partial, JSON types

---

### Nivel 3: Patrones Type-Safe (Semanas 17-24)

#### 13 - Branded Types
- `13-branded-types/index.ts`
- Conceptos: Nominal typing, opaque types, smart constructors
- Ejercicios: UserID, Email, URL types

#### 14 - Type-Safe Builder Pattern
- `14-builder-pattern/index.ts`
- Conceptos: Fluent interfaces, step-by-step, phantom types
- Ejercicios: Query builder, HTTP request builder

#### 15 - Option/Maybe Type
- `15-option-type/index.ts`
- Conceptos: Null safety, chaining, pattern matching
- Ejercicios: Safe data access, configuration loading

#### 16 - Result/Either Type
- `16-result-type/index.ts`
- Conceptos: Error handling, railway oriented programming
- Ejercicios: Validation pipeline, API error handling

#### 17 - Type-Safe Event System
- `17-event-system/index.ts`
- Conceptos: Typed event maps, listeners, payload inference
- Ejercicios: Application event bus, pub-sub

#### 18 - Pipe y Compose
- `18-pipe-compose/index.ts`
- Conceptos: Function composition, type inference en pipelines
- Ejercicios: Data transformation, middleware chains

---

### Nivel 4: Código Autodocumentado (Semanas 25-30)

#### 19 - Semantic Types
- `19-semantic-types/index.ts`
- Conceptos: Domain-specific types, meaningful names
- Ejercicios: E-commerce domain, business logic types

#### 20 - Type Aliases Descriptivos
- `20-type-aliases/index.ts`
- Conceptos: UserId, Email, Money, Distance, Duration
- Ejercicios: Payment system types, user management

#### 21 - JSDoc y TSDoc
- `21-jsdoc-tsdoc/index.ts`
- Conceptos: @param, @returns, @example, @typeParam
- Ejercicios: Library documentation, public API

#### 22 - Self-Documenting APIs
- `22-self-documenting-api/index.ts`
- Conceptos: Intentional naming, explicit return types
- Ejercicios: SDK design, REST client

#### 23 - Type-Driven Development
- `23-type-driven-dev/index.ts`
- Conceptos: Design types first, types como specification
- Ejercicios: Feature development, domain modeling

#### 24 - Declaration Files
- `24-declaration-files/index.ts` + `.d.ts`
- Conceptos: Ambient declarations, type augmentation
- Ejercicios: Third-party library types, global types

---

### Nivel 5: Prevención de Bugs (Semanas 31-38)

#### 25 - Strict Mode
- `25-strict-mode/index.ts`
- Conceptos: All strict flags, non-nullable by default
- Ejercicios: Enable strict incrementally, migration

#### 26 - Exhaustiveness Checking
- `26-exhaustiveness/index.ts`
- Conceptos: never type, compile-time guarantees
- Ejercicios: Switch validation, state machine safety

#### 27 - Assert Functions
- `27-assert-functions/index.ts`
- Conceptos: Runtime validation, type narrowing
- Ejercicios: Input validation, invariant checking

#### 28 - Readonly Deep
- `28-readonly-deep/index.ts`
- Conceptos: Immutability, readonly arrays, const assertions
- Ejercicios: Immutable state, configuration objects

#### 29 - Immutable Patterns
- `29-immutable-patterns/index.ts`
- Conceptos: Copy-on-write, structural sharing
- Ejercicios: Redux reducer, state updates

#### 30 - Type-Level Tests
- `30-type-tests/index.ts`
- Conceptos: Assert types, expect errors, type coverage
- Ejercicios: Test utility types, type regression tests

#### 31 - Runtime Validation
- `31-runtime-validation/index.ts`
- Conceptos: Zod, io-ts, schema validation
- Ejercicios: API validation, form validation

---

### Nivel 6: Colaboración y Escalabilidad (Semanas 39-48)

#### 32 - Shared Types Package
- `32-shared-types/index.ts`
- Conceptos: Type packages, versioning, breaking changes
- Ejercicios: Monorepo types library

#### 33 - Project References
- `33-project-references/index.ts` + `tsconfig.json`
- Conceptos: Build optimization, incremental compilation
- Ejercicios: Monorepo configuration

#### 34 - Code Review Guidelines
- `34-code-review/index.ts` + `GUIDELINES.md`
- Conceptos: Type safety checklist, best practices
- Ejercicios: Review checklist, style guide

#### 35 - Safe Refactoring
- `35-safe-refactoring/index.ts`
- Conceptos: Rename, extract, move with confidence
- Ejercicios: Large-scale refactoring

#### 36 - Incremental Adoption
- `36-incremental-adoption/index.ts`
- Conceptos: any to unknown, strict migration, legacy modernization
- Ejercicios: Migration strategy, codemods

#### 37 - Compilation Performance
- `37-compilation-perf/index.ts`
- Conceptos: Type complexity, expensive types, optimization
- Ejercicios: Optimize build time, profiling

#### 38 - Custom Transformers
- `38-custom-transformers/index.ts`
- Conceptos: Compiler API, AST manipulation, code generation
- Ejercicios: Custom transformer plugin

#### 39 - Type-Aware Linting
- `39-type-aware-linting/index.ts` + `.eslintrc.js`
- Conceptos: @typescript-eslint, custom rules
- Ejercicios: Linting configuration, custom rules

---

## 📊 Progreso Sugerido

### Semana 1-4: Fundamentos
✅ Literal types y const assertions
✅ Discriminated unions
✅ Type guards básicos y custom

### Semana 5-8: Generics
✅ Generic constraints
✅ Generic utility patterns

### Semana 9-12: Mapped y Conditional
✅ Mapped types básicos y avanzados
✅ Conditional types
✅ Infer keyword

### Semana 13-16: Template Literals y Recursión
✅ Template literal types
✅ Recursive types

### Semana 17-20: Patrones Type-Safe (Parte 1)
✅ Branded types
✅ Builder pattern
✅ Option/Maybe type
✅ Result/Either type

### Semana 21-24: Patrones Type-Safe (Parte 2)
✅ Event system
✅ Pipe y compose

### Semana 25-28: Autodocumentación
✅ Semantic types
✅ JSDoc/TSDoc
✅ Self-documenting APIs
✅ Type-driven development

### Semana 29-30: Declarations
✅ Declaration files

### Semana 31-34: Strict Mode e Immutability
✅ Strict mode
✅ Exhaustiveness checking
✅ Assert functions
✅ Readonly deep

### Semana 35-38: Testing y Validation
✅ Immutable patterns
✅ Type tests
✅ Runtime validation

### Semana 39-42: Monorepo y Refactoring
✅ Shared types
✅ Project references
✅ Code review
✅ Safe refactoring

### Semana 43-48: Performance y Tooling
✅ Incremental adoption
✅ Compilation performance
✅ Custom transformers
✅ Type-aware linting

---

## 🎓 Certificación de Nivel

### Nivel 1 - Fundamentos
- [ ] Dominas discriminated unions
- [ ] Creas custom type guards naturalmente
- [ ] Usas generic constraints apropiadamente
- [ ] Exhaustiveness checking en todos los switches

### Nivel 2 - Type-Level Programming
- [ ] Implementas mapped types complejos
- [ ] Usas conditional types con infer
- [ ] Creas template literal types para DSLs
- [ ] Implementas utility types recursivos

### Nivel 3 - Patrones Type-Safe
- [ ] Usas branded types para domain modeling
- [ ] Implementas builders completamente type-safe
- [ ] Manejas errores con Result/Either
- [ ] Diseñas event systems type-safe

### Nivel 4 - Autodocumentación
- [ ] Tus tipos son autodocumentados
- [ ] APIs imposibles de usar incorrectamente
- [ ] JSDoc completo en código público
- [ ] Type-driven development como default

### Nivel 5 - Prevención de Bugs
- [ ] Strict mode everywhere
- [ ] Zero runtime type errors
- [ ] Immutability por defecto
- [ ] Type tests para utilities críticos

### Nivel 6 - Colaboración
- [ ] Monorepo con shared types
- [ ] Code review guidelines implementadas
- [ ] Safe refactoring a gran escala
- [ ] Custom tooling para equipo

---

## 📚 Recursos por Nivel

### Nivel 1-2: Fundamentos y Type-Level
- TypeScript Handbook
- TypeScript Deep Dive
- Type Challenges (easy/medium)
- Matt Pocock's tips

### Nivel 3-4: Patrones y Autodocumentación
- Effective TypeScript (libro)
- Total TypeScript tutorials
- type-fest source code
- Real-world library types

### Nivel 5-6: Prevención y Escalabilidad
- TypeScript compiler source
- Large-scale TypeScript projects
- ts-toolbelt implementation
- TypeScript RFC discussions

---

## 🚀 Proyecto Final

Al completar todos los niveles, desarrollarás:

**Sistema de Gestión de Tareas Type-Safe**

**Features implementados:**
- User management (branded IDs, RBAC)
- Task CRUD (type-safe operations)
- State machine (exhaustiveness checking)
- Comments system (nested types)
- File attachments (opaque types)
- Search/filters (query builder)
- Real-time updates (event system)
- Export/Import (parser types)

**Requisitos técnicos:**
- ✅ Strict mode enabled
- ✅ Zero any types
- ✅ 100% type coverage
- ✅ Exhaustiveness checking everywhere
- ✅ Branded types for IDs
- ✅ Result types for error handling
- ✅ Immutable state with readonly
- ✅ Type tests included
- ✅ Full JSDoc documentation
- ✅ Monorepo structure
- ✅ Shared types package
- ✅ Custom transformers
- ✅ Type-aware linting

---

## 💡 Tips de Estudio

1. **Practica en TypeScript Playground** - Iteración rápida
2. **Resuelve Type Challenges** - De easy a extreme
3. **Lee type definitions** - React, Vue, Express
4. **Escribe type tests** - Valida tus assumptions
5. **Habilita strict mode** - Aprende de forma correcta
6. **Refactoriza código real** - Aplicación práctica
7. **Enseña conceptos** - Blog, talks, mentoring
8. **Contribuye a DefinitelyTyped** - Práctica real
9. **Sigue a expertos** - Matt Pocock, Titian-Cernicova-Dragomir
10. **Lee TypeScript issues** - Aprende edge cases

---

## 📈 Tracking de Progreso

### Por cada módulo:
```
Módulo: [01-literal-types]
Fecha inicio: [DD/MM/YYYY]
Fecha fin: [DD/MM/YYYY]
Tiempo invertido: [X horas]
Nivel de comprensión: [1-10]
Ejercicios completados: [X/Y]
Playground URL: [URL]
Proyecto aplicado: [Nombre del proyecto]
Bugs prevenidos: [Descripción]
Notas: [Insights, dificultades, descubrimientos]
Siguiente paso: [Próximo módulo o revisión]
```

### Checklist por módulo:
- [ ] Leí la teoría
- [ ] Entendí el problema que resuelve
- [ ] Implementé ejemplos básicos
- [ ] Completé ejercicios
- [ ] Implementé variaciones
- [ ] Apliqué en proyecto real
- [ ] Escribí type tests
- [ ] Documenté con JSDoc
- [ ] Revisé edge cases
- [ ] Puedo explicar a otros

---

## 🎯 Metas Semanales

### Semana 1
- [ ] 01-literal-types completo
- [ ] 5 Type Challenges (easy) resueltos
- [ ] Leer capítulo 1-2 de Effective TypeScript

### Semana 2
- [ ] 02-discriminated-unions completo
- [ ] Refactorizar 1 proyecto con discriminated unions
- [ ] 5 más Type Challenges

### Semana 3
- [ ] 03-type-guards-basic completo
- [ ] 04-custom-type-guards completo
- [ ] Crear validation library personal

### [... continúa para cada semana]

---

## 🏆 Certificados de Dominio

Al completar cada nivel, puedes auto-certificarte respondiendo:

### Nivel 1 Quiz:
1. ¿Cuándo usarías const assertion vs type annotation?
2. Implementa exhaustiveness checking para discriminated union
3. Crea custom type guard para interface compleja
4. Diseña generic constraint para factory pattern

### Nivel 2 Quiz:
1. Implementa Pick y Omit desde cero
2. Crea conditional type que extraiga return type de función
3. Usa template literal types para crear route types
4. Implementa DeepReadonly recursivo

### Nivel 3 Quiz:
1. Crea branded type para Email con validación
2. Implementa builder pattern con phantom types
3. Diseña Result type con pattern matching
4. Crea event emitter completamente type-safe

[... quizzes para niveles 4-6]

---

**¡Bienvenido al mundo de Advanced TypeScript!** 🎉

*Este índice es tu mapa del tesoro. Cada módulo construye sobre el anterior. No saltes módulos - los fundamentos son críticos. Toma tu tiempo, practica mucho, y disfruta el viaje hacia la maestría en TypeScript.*

**Recordatorio**: TypeScript no es el objetivo final. Es una herramienta para escribir mejor JavaScript, prevenir bugs, y facilitar colaboración. Usa los tipos avanzados con propósito - para hacer tu código más seguro, más claro, y más mantenible.
