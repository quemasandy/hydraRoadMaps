# SRP (Single Responsibility Principle) · Ejercicio

**Objetivo:** garantizar que una clase solo tenga una razón para cambiar.

## Escenario
Actualmente, una clase `InvoiceService` calcula totales, renderiza PDFs y envía emails. Cada cambio rompe algo distinto.

## Instrucciones
1. Escribe la clase monolítica `InvoiceService` que mezcle: cálculo, render y envío.
2. Refactoriza separando responsabilidades en tres clases: `InvoiceCalculator`, `InvoicePdf`, `InvoiceMailer`.
3. Crea un orquestador mínimo `InvoiceProcessor` que coordine a las tres.
4. Ilustra cómo un cambio en el formato de correo no afecta los cálculos.

```typescript
// Paso 1: clase con demasiadas responsabilidades
class InvoiceService {
  calculate(items: { price: number; quantity: number }[]) {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  renderPdf(total: number) {
    return `PDF: total ${total}`;
  }

  sendEmail(pdf: string) {
    console.log("Enviando factura con adjunto", pdf);
  }
}

// Paso 2: refactor hacia SRP
class InvoiceCalculator {
  total(items: { price: number; quantity: number }[]) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

class InvoicePdf {
  render(total: number) {
    return `PDF: total ${total}`;
  }
}

class InvoiceMailer {
  send(pdf: string) {
    console.log("Enviando factura con adjunto", pdf);
  }
}

class InvoiceProcessor {
  constructor(
    private calculator: InvoiceCalculator,
    private pdf: InvoicePdf,
    private mailer: InvoiceMailer
  ) {}

  process(items: { price: number; quantity: number }[]) {
    const total = this.calculator.total(items);
    const pdf = this.pdf.render(total);
    this.mailer.send(pdf);
  }
}
```

## Resultado esperado
- Cada clase tiene una única razón de cambio: cálculos, presentación o entrega.
- El orquestador está libre de lógica de negocio compleja.
- Se vuelve natural cubrir cada pieza con pruebas unitarias aisladas.
