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

## 📚 Ejercicios Completados

### Nivel 1.1: Conceptos Básicos de TypeScript

#### ✅ 01 - Tipos Primitivos
**Carpeta:** `01-tipos-primitivos/`
**Conceptos:** string, number, boolean
**Aplicación:** Sistema de procesamiento de pagos
- Validación de tipos en tiempo de compilación
- Por qué Big Tech usa centavos vs decimales
- Prevención de errores financieros

**Ejecutar:**
```bash
ts-node src/claudeExcercise/01-tipos-primitivos/index.ts
```

#### ✅ 02 - Arrays y Tuplas
**Carpeta:** `02-arrays-tuplas/`
**Conceptos:** Arrays homogéneos, tuplas heterogéneas
**Aplicación:** Listas de transacciones, datos de time-series
- Arrays para colecciones variables
- Tuplas para datos estructurados [timestamp, amount]
- Respuestas de APIs [success, data, error]

**Ejecutar:**
```bash
ts-node src/claudeExcercise/02-arrays-tuplas/index.ts
```

#### ✅ 03 - Enums
**Carpeta:** `03-enums/`
**Conceptos:** Numeric enums, string enums, const enums
**Aplicación:** Estados de pago, métodos de pago, códigos de error
- Enums numéricos vs string enums
- Por qué Stripe usa string enums en su API
- Const enums para optimización

**Ejecutar:**
```bash
ts-node src/claudeExcercise/03-enums/index.ts
```

#### ✅ 04 - Any, Unknown, Never
**Carpeta:** `04-any-unknown-never/`
**Conceptos:** Tipos especiales para casos edge
**Aplicación:** Validación de webhooks, manejo de errores
- any: cuándo (casi nunca) y por qué
- unknown: validación type-safe de datos externos
- never: exhaustive checking, funciones que no retornan

**Ejecutar:**
```bash
ts-node src/claudeExcercise/04-any-unknown-never/index.ts
```

#### ✅ 05 - Type Assertions
**Carpeta:** `05-type-assertions/`
**Conceptos:** as, !, as const, double assertion
**Aplicación:** Parsear JSON de APIs, DOM manipulation
- Cuándo es seguro hacer assertions
- Validar antes de assert
- const assertions para inmutabilidad

**Ejecutar:**
```bash
ts-node src/claudeExcercise/05-type-assertions/index.ts
```

### Nivel 1.1: Interfaces y Types

#### ✅ 06 - Interfaces
**Carpeta:** `06-interfaces/`
**Conceptos:** Declaración, optional, readonly, extending
**Aplicación:** Modelos de datos (Payment, Customer, Invoice)
- Contratos type-safe
- readonly para inmutabilidad
- Extending para reutilización

**Ejecutar:**
```bash
ts-node src/claudeExcercise/06-interfaces/index.ts
```

#### ✅ 07 - Type Aliases, Unions, Intersections
**Carpeta:** `07-type-aliases-unions-intersections/`
**Conceptos:** type, union (|), intersection (&), discriminated unions
**Aplicación:** Métodos de pago variantes, composición de entidades
- Literal types para estados
- Discriminated unions (Stripe event types)
- Intersections para mixins

**Ejecutar:**
```bash
ts-node src/claudeExcercise/07-type-aliases-unions-intersections/index.ts
```

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
Cada ejercicio incluye preguntas para profundizar.
Investiga las respuestas para solidificar tu comprensión.

## 🚀 Próximos pasos

### Ejercicios pendientes (según roadmap):

#### Nivel 1.1 - Conceptos Básicos de TypeScript
- [ ] Clases en TypeScript (6 sub-ejercicios)
  - Propiedades y métodos
  - Constructores
  - Modificadores de acceso
  - Getters y Setters
  - Clases abstractas
  - Herencia y polimorfismo
- [ ] Genéricos (4 sub-ejercicios)
  - Funciones genéricas
  - Clases genéricas
  - Constraints en genéricos
  - Genéricos en interfaces

#### Nivel 1.2 - Principios SOLID
- [ ] Single Responsibility Principle (SRP)
- [ ] Open/Closed Principle (OCP)
- [ ] Liskov Substitution Principle (LSP)
- [ ] Interface Segregation Principle (ISP)
- [ ] Dependency Inversion Principle (DIP)

#### Nivel 1.3 - Conceptos Fundamentales
- [ ] Composición vs Herencia
- [ ] Acoplamiento y Cohesión
- [ ] Encapsulación
- [ ] Abstracción
- [ ] Polimorfismo

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
// 2. Casos de uso prácticos
// 3. Demostración ejecutable
// 4. Casos de uso en billing & payments
// 5. Mejores prácticas
// 6. Preguntas para reflexionar
// 7. Ejercicios prácticos (4 niveles)
```

## 📖 Recursos adicionales

- **TypeScript Handbook:** https://www.typescriptlang.org/docs/handbook/
- **Stripe API Docs:** https://stripe.com/docs/api (para ejemplos reales)
- **Refactoring.Guru:** https://refactoring.guru/design-patterns/typescript

## 🤝 Contribuir

Si creas ejercicios adicionales:
1. Sigue el formato establecido
2. Incluye ejemplos ejecutables
3. Enfócate en aplicaciones de billing/payments cuando sea posible
4. Documenta exhaustivamente con comentarios
5. Incluye preguntas y desafíos

## 📝 Notas

- Los ejercicios están diseñados para máximo aprendizaje, no brevedad
- Los comentarios son extensos intencionalmente
- Cada concepto se explica desde primeros principios
- Los ejemplos son realistas basados en sistemas de Big Tech
- El enfoque en billing/payments provee contexto concreto

---

**¡Feliz aprendizaje!** 🚀

*Recuerda: El objetivo no es solo escribir código que funcione, sino entender profundamente los conceptos y saber cuándo y por qué aplicarlos.*
