# ISP (Interface Segregation Principle) · Ejercicio

**Objetivo:** evitar interfaces gordas que obligan a implementar métodos innecesarios.

## Escenario
Un contrato `MultiFunctionDevice` obliga a las impresoras a escanear, faxear y copiar. Los dispositivos baratos solo imprimen y quedan con métodos inútiles.

## Instrucciones
1. Declara una interfaz `MultiFunctionDevice` con métodos `print`, `scan`, `fax`.
2. Implementa `BasicPrinter` y muestra por qué se ven obligados a lanzar errores.
3. Refactoriza segregando la interfaz en contratos pequeños (`Printer`, `Scanner`, `Fax`).
4. Implementa `SmartMachine` que compone las capacidades necesarias.

```typescript
interface MultiFunctionDevice {
  print(document: string): void;
  scan(): string;
  fax(document: string): void;
}

class BasicPrinter implements MultiFunctionDevice {
  print(document: string) {
    console.log("Imprimiendo", document);
  }

  scan() {
    throw new Error("Este dispositivo no escanea");
  }

  fax(document: string) {
    throw new Error("Este dispositivo no envía fax");
  }
}

// Refactor con ISP
interface Printer {
  print(document: string): void;
}

interface Scanner {
  scan(): string;
}

interface Fax {
  fax(document: string): void;
}

class LaserPrinter implements Printer {
  print(document: string) {
    console.log("Imprimiendo", document);
  }
}

class SmartMachine implements Printer, Scanner, Fax {
  constructor(
    private printer: Printer,
    private scanner: Scanner,
    private faxDevice: Fax
  ) {}

  print(document: string) {
    this.printer.print(document);
  }

  scan() {
    return this.scanner.scan();
  }

  fax(document: string) {
    this.faxDevice.fax(document);
  }
}
```

## Resultado esperado
- Las clases simples implementan solo lo que necesitan.
- Construyes capacidades avanzadas sumando interfaces pequeñas.
- Los clientes dependen de contratos mínimos, reduciendo acoplamiento innecesario.
