export const processPayUPayment = () => {
  console.log('Processing PayU payment...');
}

export const refundPayUPayment = () => {
  console.log('Refunding PayU payment...');
}

export const processCyberSourcePayment = () => {
  console.log('Processing CyberSource payment...');
}

export const refundCyberSourcePayment = () => {
  console.log('Refunding CyberSource payment...');
}

export async function makePaymentOrchestrator(context: { gateway: string }) {
  if (context.gateway === 'payu') {
    processPayUPayment();
    refundPayUPayment();
  }

  if(context.gateway === 'cybersource') {
    processCyberSourcePayment();
    refundCyberSourcePayment();
  }
}

// Ejecuta el ejemplo solo cuando este archivo es el punto de entrada.
// Evita efectos secundarios al importarlo desde tests.
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  const context = {
    gateway: 'cybersource'
  };
  void makePaymentOrchestrator(context);
}
