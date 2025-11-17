# OCP (Open/Closed Principle) · Ejercicio

**Objetivo:** permitir extensiones sin modificar el código existente.

## Escenario
Tu aplicación calcula costos de envío según el país. Cada vez que se agrega un país, alguien toca un `switch` y rompe otro cálculo.

## Instrucciones
1. Crea una función inicial `shippingCost(country: string, weight: number)` implementada con `switch`.
2. Refactoriza a una estrategia con interfaz `ShippingRule` y clases concretas (`ColombiaRule`, `MexicoRule`, etc.).
3. Implementa un `ShippingCostCalculator` que reciba las reglas disponibles y seleccione la apropiada.
4. Agrega una regla nueva (`ChileRule`) sin alterar `ShippingCostCalculator`.

```typescript
// Paso 1: enfoque cerrado
function shippingCost(country: string, weight: number) {
  switch (country) {
    case "CO":
      return weight * 4000;
    case "MX":
      return weight * 80;
    default:
      throw new Error("País no soportado");
  }
}

// Paso 2: versión abierta a extensión
interface ShippingRule {
  supports(country: string): boolean;
  cost(weight: number): number;
}

class ColombiaRule implements ShippingRule {
  supports(country: string) {
    return country === "CO";
  }

  cost(weight: number) {
    return weight * 4000;
  }
}

class MexicoRule implements ShippingRule {
  supports(country: string) {
    return country === "MX";
  }

  cost(weight: number) {
    return weight * 80;
  }
}

class ChileRule implements ShippingRule {
  supports(country: string) {
    return country === "CL";
  }

  cost(weight: number) {
    return weight * 3500 + 1200; // costo fijo + variable
  }
}

class ShippingCostCalculator {
  constructor(private rules: ShippingRule[]) {}

  calculate(country: string, weight: number) {
    const rule = this.rules.find((r) => r.supports(country));
    if (!rule) throw new Error("País no soportado");
    return rule.cost(weight);
  }
}

const calculator = new ShippingCostCalculator([
  new ColombiaRule(),
  new MexicoRule(),
  new ChileRule(),
]);

console.log(calculator.calculate("CL", 2));
```

## Resultado esperado
- `ShippingCostCalculator` no se modifica al añadir reglas.
- Cada país se encapsula en su propia clase, manteniendo cierre frente a modificaciones.
- El catálogo de reglas puede crecer sin tocar la infraestructura existente.
