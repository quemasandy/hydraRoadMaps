# Composición · Ejercicio

**Objetivo:** construir comportamiento combinando objetos especializados en lugar de heredar.

## Escenario
Quieres crear un `ReportPrinter` que pueda formatear datos en JSON o en tabla de texto sin cambiar la clase principal.

## Instrucciones
1. Define una interfaz `Formatter` con un método `format(data: any): string`.
2. Implementa `JsonFormatter` y `TableFormatter`.
3. Crea una clase `ReportPrinter` que reciba un `Formatter` en su constructor y delegue `format`.
4. Permite cambiar el formateador en tiempo de ejecución mediante un método `setFormatter`.
5. Muestra que el mismo `ReportPrinter` imprime de dos maneras distintas sin heredar.

```typescript
interface Formatter {
  format(data: any): string;
}

class JsonFormatter implements Formatter {
  format(data: any): string {
    return JSON.stringify(data, null, 2);
  }
}

class TableFormatter implements Formatter {
  format(data: any): string {
    return data.map((item: any) => `${item.name} | ${item.total}`).join("\n");
  }
}

class ReportPrinter {
  constructor(private formatter: Formatter) {}

  setFormatter(formatter: Formatter) {
    this.formatter = formatter;
  }

  print(data: any) {
    console.log(this.formatter.format(data));
  }
}

const sales = [
  { name: "Plan Básico", total: 12 },
  { name: "Plan Pro", total: 7 },
];

const printer = new ReportPrinter(new JsonFormatter());
printer.print(sales);

printer.setFormatter(new TableFormatter());
printer.print(sales);
```

## Resultado esperado
- `ReportPrinter` no necesita saber los detalles de cada formato.
- Reemplazas componentes en caliente sin tocar la clase principal.
- Ilustra la diferencia clave con herencia: combinas objetos, no extiendes jerarquías rígidas.
