abstract class PaymentProcessor {
  start(): void {
    console.log('Iniciando pago...');
  }

  abstract process(): void;
  
  refund(): void {
    console.log('Reembolso por defecto (sin acción)');
  }
}

class PayUPayment extends PaymentProcessor {
  process(): void {
    console.log('PayU: procesando...');
  }
  refund(): void {
    console.log('PayU: reembolso...');
  }
}

class LyraPayment extends PaymentProcessor {
  process(): void {
    console.log('Lyra: procesando...');
  }
}

class PayPal extends PaymentProcessor {
  process(): void {
    console.log("process PayPayl")
  }
}

function collect(payment: PaymentProcessor): void {
  payment.start();
  payment.process();
  payment.refund();
}

export function runDemo(): void {
  collect(new PayPal());
}

declare const require: any | undefined;
declare const module: any | undefined;
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  runDemo();
}
