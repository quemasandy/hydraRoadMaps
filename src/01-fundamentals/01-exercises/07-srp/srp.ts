// Paso 1: clase con demasiadas responsabilidades
class InvoiceService {
  calculate(items: { price: number; quantity: number }[]) {
    const total = items.reduce((total, item) => total + item.price * item.quantity, 0);
    console.log("[InvoiceService] [calculate]", total);
    return total;
  }

  renderPdf(total: number) {
    const pdf = `PDF: total ${total}`
    console.log("[InvoiceService] [renderPdf]", pdf);
    return `PDF: total ${total}`;
  }

  sendEmail(pdf: string) {
    console.log("[InvoiceService] [sendEmail]", pdf);
  }
}

const invoiceService = new InvoiceService();
const total = invoiceService.calculate([{ price: 11, quantity: 2 }]);
const pdf = invoiceService.renderPdf(total);
invoiceService.sendEmail(pdf);

// Paso 2: refactor hacia SRP
class InvoiceCalculator {
  total(items: { price: number; quantity: number }[]) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log("[InvoiceCalculator] [total]", total);
    return total;
  }
}

class InvoicePdf {
  render(total: number) {
    const pdf = `PDF: total ${total}`;
    console.log("[InvoicePdf] [render]", pdf);
    return pdf;
  }
}

class InvoiceMailer {
  send(pdf: string) {
    console.log("[InvoiceMailer] [send]", pdf);
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

const invoiceProcessor = new InvoiceProcessor(
  new InvoiceCalculator(),
  new InvoicePdf(),
  new InvoiceMailer()
);

invoiceProcessor.process([{ price: 11, quantity: 2 }]);
