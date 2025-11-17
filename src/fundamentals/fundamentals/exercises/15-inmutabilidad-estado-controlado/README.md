# Inmutabilidad y Estado Controlado · Ejercicio

**Objetivo:** manipular el estado de forma explícita, creando nuevas instancias en lugar de mutaciones invisibles.

## Escenario
Un contador compartido en un dashboard cambia de valor sin que los componentes lo noten porque la referencia se mantiene. Necesitas evitar efectos sorpresa.

## Instrucciones
1. Implementa un contador mutable con métodos `increment()` y `getValue()` y demuestra cómo múltiples consumidores comparten referencias peligrosas.
2. Refactoriza a una versión inmutable que retorne un nuevo contador en cada operación (`Counter.next()`).
3. Usa una pequeña simulación para mostrar que cada cambio requiere reasignar intencionalmente el estado.
4. Explica por qué esto facilita depuración y patrones como State o Memento.

```typescript
// Versión mutable
class MutableCounter {
  constructor(private value = 0) {}

  increment() {
    this.value += 1;
  }

  getValue() {
    return this.value;
  }
}

const shared = new MutableCounter();
shared.increment();
const alias = shared; // misma referencia
alias.increment();
console.log(shared.getValue()); // 2, aunque solo un consumidor incrementó

// Versión inmutable
class Counter {
  constructor(private readonly value = 0) {}

  next() {
    return new Counter(this.value + 1);
  }

  getValue() {
    return this.value;
  }
}

let counter = new Counter();
counter = counter.next(); // usuario A
const snapshot = counter;
counter = counter.next(); // usuario B
console.log(snapshot.getValue()); // 1
console.log(counter.getValue());  // 2
```

## Resultado esperado
- Los consumidores solo ven cambios cuando reemplazan explícitamente la referencia.
- Se vuelve sencillo guardar snapshots y revertir estados.
- Entiendes por qué el control explícito del estado reduce efectos secundarios y sincroniza mejor con arquitecturas reactivas.
