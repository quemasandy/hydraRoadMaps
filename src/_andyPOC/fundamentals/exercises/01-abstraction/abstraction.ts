
export interface Payment { 
  process: () => void;
  refund: () => void;
  tokenize: () => void;
}

export class PayUPayment implements Payment {
  process() {
    console.log('Processing PayU payment...');
  }

  refund() {
    console.log('Refunding PayU payment...');
  }

  tokenize() {
    console.log('Tokenizing PayU payment...');
  }
}

export class CyberSourcePayment implements Payment {
  process() {
    console.log('Processing CyberSource payment...');
  }

  refund() {
    console.log('Refunding CyberSource payment...');
  }

  tokenize() {
    console.log('Tokenizing CyberSource payment...');
  }
}

export class PaymentFactory {
  static createPaymentProcessor(gateway: string): Payment | null {
    if (gateway === 'payu') {
      return new PayUPayment();
    }
    if (gateway === 'cybersource') {
      return new CyberSourcePayment();
    }
    return null;
  }
}

export async function makePaymentOrchestrator(paymentProcessor: Payment) {
  paymentProcessor.process();
  paymentProcessor.refund();
}

export const initPayment = (gateway: string = 'cybersource') => { 
  const paymentProcessor: Payment | null = PaymentFactory.createPaymentProcessor(gateway);
  if (!paymentProcessor) {
    console.log('Unknown payment gateway. No action taken.');
    // Solo salimos del proceso si este archivo es el entrypoint.
    if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
      process.exit(0);
    }
    return;
  } 

  void makePaymentOrchestrator(paymentProcessor);
}

// Ejecuta el ejemplo solo cuando este archivo es el punto de entrada.
// Evita efectos secundarios al importarlo desde tests.
// Declaraciones defensivas para TS si faltaran los tipos de Node.
declare const require: any | undefined;
declare const module: any | undefined;
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  initPayment();
}
