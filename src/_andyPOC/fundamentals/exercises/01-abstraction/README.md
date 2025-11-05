# Abstracción · Ejercicio

**Objetivo:** modelar un procesamiento de pagos enfocándote en qué hace cada pieza, sin exponer los detalles particulares.

## Escenario
Tienes un agregador de pagos que debe poder trabajar con múltiples proveedores (ej. Lyra, PayU). El equipo quiere agregar proveedores nuevos sin tocar el código que orquesta el cobro.

## Instrucciones
1. Declara una interfaz `Payment` con el método `process(): Promise<void>`.
2. Implementa dos clases concretas (`LyraPayment`, `PayUPayment`) que cumplan la interfaz y simulen una llamada externa.
3. Crea una función `collect(payment: Payment)` que reciba la abstracción y ejecute `process` sin conocer el tipo concreto.
4. Agrega una tercera implementación llamada `SandboxPayment` para pruebas y úsala con `collect` sin modificar la función.

```typescript
interface Payment {
  process(): Promise<void>;
}

class LyraPayment implements Payment {
  async process() {
    console.log("Lyra: pago aprobado");
  }
}

class PayUPayment implements Payment {
  async process() {
    console.log("PayU: pago aprobado");
  }
}

async function collect(payment: Payment) {
  await payment.process();
}

// Intenta reemplazar Lyra por Sandbox sin tocar collect
collect(new LyraPayment());
```

## Resultado esperado
- `collect` permanece intacta al introducir nuevos proveedores.
- El negocio conversa en términos de `Payment`, no de un proveedor específico.
- La abstracción deja claro **qué** se hace (`process`) y encapsula **cómo** se logra en cada clase concreta.
