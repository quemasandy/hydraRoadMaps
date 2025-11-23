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

// const invoiceService = new InvoiceService();
// const total = invoiceService.calculate([{ price: 11, quantity: 2 }]);
// const pdf = invoiceService.renderPdf(total);
// invoiceService.sendEmail(pdf);

// Paso 2: refactor hacia SRP
interface InvoiceCalculator {
  total(items: { price: number; quantity: number }[], taxes?: number): number;
}

class InvoiceCalculator implements InvoiceCalculator {
  total(items: { price: number; quantity: number }[]) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log("[InvoiceCalculator] [total]", total);
    return total;
  }
}

class InvoiceCalculatorV2 implements InvoiceCalculator {
  total(items: { price: number; quantity: number }[], taxes?: number) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log("[InvoiceCalculator] [total]", total);
    return total * (taxes || 1);
  }
}

interface InvoiceRender {
  render(total: number): string;
}

class InvoicePdf implements InvoiceRender {
  render(total: number) {
    const pdf = `PDF: total ${total}`;
    console.log("[InvoicePdf] [render]", pdf);
    return pdf;
  }
}

class InvoiceWord implements InvoiceRender {
  render(total: number) {
    const word = `Word: total ${total}`;
    console.log("[InvoiceWord] [render]", word);
    return word;
  }
}

interface InvoiceNotification {
  send(pdf: string): void;
}

class InvoiceNotification implements InvoiceNotification {
  send(pdf: string) {
    console.log("[InvoiceNotificationEmail] [send]", pdf);
  }
}

class InvoiceNotificationSms implements InvoiceNotification {
  send(pdf: string) {
    console.log("[InvoiceNotificationSms] [send]", pdf);
  }
}

class InvoiceNotificationAll implements InvoiceNotification {
  send(pdf: string) {
    console.log("[InvoiceNotificationEmail] [send]", pdf);
    console.log("[InvoiceNotificationSms] [send]", pdf);
  }
}

class InvoiceProcessor {
  constructor(
    private calculator: InvoiceCalculator,
    private pdf: InvoiceRender,
    private notification: InvoiceNotification
  ) {}

  process(items: { price: number; quantity: number }[]) {
    const total = this.calculator.total(items);
    const file = this.pdf.render(total);
    this.notification.send(file);
  }
}

const renderMode = "pdf";
const strategies = {
  pdf: InvoicePdf,
  word: InvoiceWord,
};

const invoiceRenderEngine = strategies[renderMode as keyof typeof strategies] || strategies.pdf;

const notificationMode = "all";
const notificationStrategies = {
  email: InvoiceNotification,
  sms: InvoiceNotificationSms,
  all: InvoiceNotificationAll,
};

const invoiceNotificationEngine = notificationStrategies[notificationMode as keyof typeof notificationStrategies] || notificationStrategies.email;

const invoiceProcessor = new InvoiceProcessor(
  new InvoiceCalculator(),
  new invoiceRenderEngine(),
  new invoiceNotificationEngine()
);

invoiceProcessor.process([{ price: 11, quantity: 2 }]);
