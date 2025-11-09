interface Payment {
  process(): void;
  refund(): void;
  tokenize(): void;
}

interface Context {
  gateway: string;
}

interface createPayemntFactory {
  (context: Context): Payment | undefined;
}

const createPayU: () => Payment = () => {
  return {
    process: () => {
      console.log('Processing PayU payment...');
    },
    refund: () => {
      console.log('Refunding PayU payment...');
    },
    tokenize: () => {
      console.log('Tokenizing PayU payment...');
    },
  };
};

const createCyberSource: () => Payment = () => {
  return {
    process: () => {
      console.log('Processing CyberSource payment...');
    },
    refund: () => {
      console.log('Refunding CyberSource payment...');
    },
    tokenize: () => {
      console.log('Tokenizing CyberSource payment...');
    },
  };
};

const createLyra: () => Payment = () => {
  return {
    process: () => {
      console.log('Processing Lyra payment...');
    },
    refund: () => {
      console.log('Refunding Lyra payment...');
    },
    tokenize: () => {
      console.log('Tokenizing Lyra payment...');
    },

  };
};

const createWorldPay: () => Payment = () => {
  return {
    process: () => {
      console.log('Processing Worldpay payment...');
    },
    refund: () => {
      console.log('Refunding Worldpay payment...');
    },
    tokenize: () => {
      console.log('Tokenizing Worldpay payment...');
    },
  };
};

export async function makePaymentOrchestrator(payment: Payment) {
  payment.process();
  payment.refund();
  payment.tokenize();
}

const createPayemntFactory: createPayemntFactory = (context) => {
  if (context.gateway === 'payu') {
    return createPayU();
  }

  if (context.gateway === 'cybersource') {
    return createCyberSource();
  }

  if (context.gateway === 'lyra') {
    return createLyra();
  }

  if (context.gateway === 'worldpay') {
    return createWorldPay();
  }
};

// Ejecuta el ejemplo solo cuando este archivo es el punto de entrada.
// Evita efectos secundarios al importarlo desde tests.
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  const context = { gateway: 'payu' };

  const payment = createPayemntFactory(context);
  if (!payment) {
    throw new Error('no payment for this gateway !!');
  }
  void makePaymentOrchestrator(payment);
}
