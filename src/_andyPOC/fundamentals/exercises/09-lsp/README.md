# LSP (Liskov Substitution Principle) · Ejercicio

**Objetivo:** garantizar que una subclase pueda reemplazar a su superclase sin romper expectativas.

## Escenario
Existe una jerarquía `Vehicle` → `Car`. Al intentar agregar `ElectricScooter`, alguien sobreescribe métodos y rompe a los consumidores que esperan un `Vehicle` tradicional.

## Instrucciones
1. Define una clase base `Vehicle` con métodos `refuel(liters: number)` y `drive(distance: number)`.
2. Implementa `Car` respetando el contrato (sumar gasolina, restar combustible al conducir).
3. Intenta crear `ElectricScooter` heredando de `Vehicle` y demuestra por qué `refuel` no aplica.
4. Refactoriza creando abstracciones compatibles (`FuelVehicle`, `ElectricVehicle`) que implementen una interfaz compartida (`Drivable`).
5. Comprueba que después de la refactorización ambos vehículos funcionan sin romper expectativas.

```typescript
class Vehicle {
  private fuel = 0;

  refuel(liters: number) {
    if (liters <= 0) throw new Error("Cantidad inválida");
    this.fuel += liters;
  }

  drive(distance: number) {
    if (distance > this.fuel * 10) throw new Error("Sin combustible");
    this.fuel -= distance / 10;
  }
}

class Car extends Vehicle {}

class ElectricScooter extends Vehicle {
  refuel(liters: number) {
    throw new Error("Los scooters eléctricos no se cargan con gasolina");
  }
}

// Violación: código que espera un Vehicle se rompe
const trip = (vehicle: Vehicle) => {
  vehicle.refuel(10);
  vehicle.drive(50);
};

// trip(new ElectricScooter()); // lanza excepción

// Refactor compatible con LSP
interface Drivable {
  drive(distance: number): void;
}

class FuelVehicle implements Drivable {
  constructor(private fuelLiters = 0) {}

  refuel(liters: number) {
    if (liters <= 0) throw new Error("Cantidad inválida");
    this.fuelLiters += liters;
  }

  drive(distance: number) {
    if (distance > this.fuelLiters * 10) throw new Error("Sin combustible");
    this.fuelLiters -= distance / 10;
  }
}

class ElectricVehicle implements Drivable {
  constructor(private batteryPercentage = 0) {}

  charge(percentage: number) {
    if (percentage <= 0) throw new Error("Carga inválida");
    this.batteryPercentage = Math.min(100, this.batteryPercentage + percentage);
  }

  drive(distance: number) {
    if (distance > this.batteryPercentage) throw new Error("Batería agotada");
    this.batteryPercentage -= distance;
  }
}

const cityTrip = (vehicle: Drivable) => {
  vehicle.drive(10);
};
```

## Resultado esperado
- Identificas la violación al sustituir `ElectricScooter`.
- Al separar jerarquías incompatibles, el contrato de `Drivable` se mantiene coherente.
- Comprendes que no toda herencia es válida; LSP exige que el contrato permanezca intacto.
