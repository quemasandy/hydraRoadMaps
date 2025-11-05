# DIP (Dependency Inversion Principle) · Ejercicio

**Objetivo:** depender de abstracciones en lugar de detalles concretos.

## Escenario
`OrderService` crea directamente una instancia de `StripeGateway`. Cuando el negocio pide integrar PayU para ciertos países, debes tocar la clase central y rompes pruebas.

## Instrucciones
1. Escribe la versión acoplada donde `OrderService` usa `new StripeGateway()`.
2. Define una interfaz `PaymentGateway` con `charge(amount: number): Promise<void>`.
3. Implementa `StripeGateway` y `PayUGateway` cumpliendo la interfaz.
4. Hace que `OrderService` reciba el gateway por constructor (inyección de dependencias).
5. Muestra cómo cambiar de proveedor no requiere modificar `OrderService`.

```typescript
// Versión acoplada
class StripeGateway {
  async charge(amount: number) {
    console.log(`Stripe cobra ${amount}`);
  }
}

class OrderServiceV1 {
  async checkout(total: number) {
    const gateway = new StripeGateway();
    await gateway.charge(total);
  }
}

// Versión invertida
interface PaymentGateway {
  charge(amount: number): Promise<void>;
}

class StripeGatewayV2 implements PaymentGateway {
  async charge(amount: number) {
    console.log(`Stripe cobra ${amount}`);
  }
}

class PayUGateway implements PaymentGateway {
  async charge(amount: number) {
    console.log(`PayU cobra ${amount}`);
  }
}

class OrderService {
  constructor(private gateway: PaymentGateway) {}

  checkout(total: number) {
    return this.gateway.charge(total);
  }
}

const orderWithStripe = new OrderService(new StripeGatewayV2());
const orderWithPayU = new OrderService(new PayUGateway());

orderWithStripe.checkout(100);
orderWithPayU.checkout(100);
```

## Resultado esperado
- `OrderService` ya no depende de clases concretas sino de la abstracción.
- Elegir un gateway distinto se resuelve desde el ensamblado (inyección).
- El código queda preparado para satisfacer patrones como Strategy o Abstract Factory.
