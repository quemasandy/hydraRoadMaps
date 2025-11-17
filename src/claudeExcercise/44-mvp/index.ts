/**
 * MVP PATTERN (Model-View-Presenter)
 * View es pasiva, Presenter maneja toda la lógica de presentación.
 * Mejor testabilidad que MVC.
 *
 * Big Tech: Android development (legacy), Windows Forms
 */

// MODEL
class PaymentModel {
  constructor(public amount: number, public cardNumber: string, public status: 'pending' | 'processing' | 'success' | 'failed' = 'pending') {}

  async processPayment(): Promise<boolean> {
    this.status = 'processing';
    await new Promise(resolve => setTimeout(resolve, 1000));
    const success = Math.random() > 0.2;
    this.status = success ? 'success' : 'failed';
    return success;
  }
}

// VIEW INTERFACE (contract)
interface PaymentView {
  showLoading(): void;
  hideLoading(): void;
  showSuccess(message: string): void;
  showError(message: string): void;
  displayPaymentInfo(amount: number, cardLast4: string): void;
  getAmount(): number;
  getCardNumber(): string;
}

// PRESENTER (mediates between View and Model)
class PaymentPresenter {
  constructor(private view: PaymentView, private model: PaymentModel | null = null) {}

  onSubmitPayment(): void {
    const amount = this.view.getAmount();
    const cardNumber = this.view.getCardNumber();

    if (!this.validateInput(amount, cardNumber)) {
      return;
    }

    this.model = new PaymentModel(amount, cardNumber);
    this.processPayment();
  }

  private validateInput(amount: number, cardNumber: string): boolean {
    if (amount <= 0) {
      this.view.showError('Amount must be greater than 0');
      return false;
    }

    if (cardNumber.length !== 16) {
      this.view.showError('Invalid card number');
      return false;
    }

    return true;
  }

  private async processPayment(): Promise<void> {
    if (!this.model) return;

    this.view.showLoading();
    this.view.displayPaymentInfo(this.model.amount, this.model.cardNumber.slice(-4));

    const success = await this.model.processPayment();

    this.view.hideLoading();

    if (success) {
      this.view.showSuccess(`Payment of $${this.model.amount} processed successfully`);
    } else {
      this.view.showError('Payment failed. Please try again.');
    }
  }
}

// CONCRETE VIEW (passive)
class ConsolePaymentView implements PaymentView {
  private amount: number = 0;
  private cardNumber: string = '';

  // Simulated user input
  setInput(amount: number, cardNumber: string): void {
    this.amount = amount;
    this.cardNumber = cardNumber;
  }

  getAmount(): number {
    return this.amount;
  }

  getCardNumber(): string {
    return this.cardNumber;
  }

  showLoading(): void {
    console.log('⏳ Processing payment...');
  }

  hideLoading(): void {
    console.log('✓ Processing complete');
  }

  showSuccess(message: string): void {
    console.log(`✅ ${message}`);
  }

  showError(message: string): void {
    console.log(`❌ ${message}`);
  }

  displayPaymentInfo(amount: number, cardLast4: string): void {
    console.log(`\n--- Payment Details ---`);
    console.log(`Amount: $${amount}`);
    console.log(`Card: **** **** **** ${cardLast4}`);
    console.log('---\n');
  }
}

// Demo
console.log('='.repeat(60));
console.log('MVP PATTERN - Payment Processing');
console.log('='.repeat(60));

(async () => {
  const view = new ConsolePaymentView();
  const presenter = new PaymentPresenter(view);

  // Scenario 1: Valid payment
  console.log('\n--- Scenario 1: Valid Payment ---');
  view.setInput(99.99, '4111111111111111');
  presenter.onSubmitPayment();
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Scenario 2: Invalid amount
  console.log('\n--- Scenario 2: Invalid Amount ---');
  view.setInput(-50, '4111111111111111');
  presenter.onSubmitPayment();

  // Scenario 3: Invalid card
  console.log('\n--- Scenario 3: Invalid Card ---');
  view.setInput(150, '1234');
  presenter.onSubmitPayment();
})();

/**
 * PREGUNTAS:
 * 1. ¿MVP vs MVC: diferencias clave?
 * 2. ¿Por qué MVP mejora testabilidad?
 * 3. ¿Passive View vs Supervising Controller?
 * 4. ¿MVP en Android vs modern architectures (MVVM)?
 * 5. ¿Testing de Presenter sin View?
 * 6. ¿MVP con dependency injection?
 * 7. ¿Cuándo preferir MVP sobre MVC?
 * 8. ¿MVP + Repository pattern?
 */

export { PaymentPresenter, PaymentView, PaymentModel };
