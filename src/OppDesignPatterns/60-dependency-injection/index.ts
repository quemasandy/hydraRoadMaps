/**
 * DEPENDENCY INJECTION
 * Invert control, inject dependencies
 *
 * Big Tech: Spring, Angular, NestJS, testability
 */

// Interfaces
interface PaymentGateway {
  charge(amount: number): Promise<boolean>;
}

interface EmailService {
  send(to: string, subject: string): void;
}

// Implementations
class StripeGateway implements PaymentGateway {
  async charge(amount: number): Promise<boolean> {
    console.log(`[Stripe] Charging $${amount}...`);
    return true;
  }
}

class MockEmailService implements EmailService {
  send(to: string, subject: string): void {
    console.log(`[Email] To: ${to}, Subject: ${subject}`);
  }
}

// Service with dependencies injected
class InvoiceService {
  constructor(
    private gateway: PaymentGateway,
    private emailService: EmailService
  ) {}

  async processInvoice(amount: number, customerEmail: string): Promise<void> {
    const success = await this.gateway.charge(amount);
    if (success) {
      this.emailService.send(customerEmail, 'Invoice paid');
    }
  }
}

// DI Container (simple)
class Container {
  private services = new Map<string, any>();

  register<T>(name: string, instance: T): void {
    this.services.set(name, instance);
  }

  resolve<T>(name: string): T {
    return this.services.get(name);
  }
}

// Demo
console.log('='.repeat(60));
console.log('DEPENDENCY INJECTION');
console.log('='.repeat(60));

const container = new Container();
container.register('gateway', new StripeGateway());
container.register('email', new MockEmailService());

const service = new InvoiceService(
  container.resolve('gateway'),
  container.resolve('email')
);

(async () => {
  await service.processInvoice(100, 'customer@example.com');
})();

/**
 * PREGUNTAS:
 * 1. ¿DI vs Service Locator?
 * 2. ¿Constructor vs property injection?
 * 3. ¿DI containers (InversifyJS, tsyringe)?
 * 4. ¿DI with decorators?
 * 5. ¿Testing with DI?
 * 6. ¿DI lifecycle (singleton, transient, scoped)?
 * 7. ¿DI in Angular/NestJS?
 * 8. ¿DI anti-patterns?
 */

export { InvoiceService, Container };
