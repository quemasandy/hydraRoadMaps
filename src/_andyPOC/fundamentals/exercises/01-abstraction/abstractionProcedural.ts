export const processPayUPayment = () => {
  console.log('Processing PayU payment...');
}

export const refundPayUPayment = () => {
  console.log('Refunding PayU payment...');
}

export const tokenizePayUPayment = () => {
  console.log('Tokenizing PayU payment...');
}

export const processCyberSourcePayment = () => {
  console.log('Processing CyberSource payment...');
}

export const refundCyberSourcePayment = () => {
  console.log('Refunding CyberSource payment...');
}

export const tokenizeCyberSourcePayment = () => {
  console.log('Tokenizing CyberSource payment...');
}

export async function makePaymentOrchestrator(context: { gateway: string }) {
  if (context.gateway === 'payu') {
    processPayUPayment();
    refundPayUPayment();
    tokenizePayUPayment();
  }

  if(context.gateway === 'cybersource') {
    processCyberSourcePayment();
    refundCyberSourcePayment();
    tokenizeCyberSourcePayment();
  }
}

// Ejecuta el ejemplo solo cuando este archivo es el punto de entrada.
// Evita efectos secundarios al importarlo desde tests.
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  const context = {
    gateway: 'payu'
  };
  void makePaymentOrchestrator(context);
}
