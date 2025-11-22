import {
  PayUPayment,
  CyberSourcePayment,
  LyraPayment,
  PaymentFactory,
  makePaymentOrchestrator,
  initPayment,
} from './abstraction';

describe('abstraction (OO + Factory): full coverage', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  // Procesadores concretos: PayU
  it('PayUPayment.process() loguea el mensaje esperado', () => {
    const p = new PayUPayment();
    p.process();
    expect(logSpy).toHaveBeenCalledWith('Processing PayU payment...');
  });

  it('PayUPayment.refund() loguea el mensaje esperado', () => {
    const p = new PayUPayment();
    p.refund();
    expect(logSpy).toHaveBeenCalledWith('Refunding PayU payment...');
  });

  it('PayUPayment.tokenize() loguea el mensaje esperado', () => {
    const p = new PayUPayment();
    p.tokenize();
    expect(logSpy).toHaveBeenCalledWith('Tokenizing PayU payment...');
  });

  // Procesadores concretos: CyberSource
  it('CyberSourcePayment.process() loguea el mensaje esperado', () => {
    const p = new CyberSourcePayment();
    p.process();
    expect(logSpy).toHaveBeenCalledWith('Processing CyberSource payment...');
  });

  it('CyberSourcePayment.refund() loguea el mensaje esperado', () => {
    const p = new CyberSourcePayment();
    p.refund();
    expect(logSpy).toHaveBeenCalledWith('Refunding CyberSource payment...');
  });

  it('CyberSourcePayment.tokenize() loguea el mensaje esperado', () => {
    const p = new CyberSourcePayment();
    p.tokenize();
    expect(logSpy).toHaveBeenCalledWith('Tokenizing CyberSource payment...');
  });

  // Procesadores concretos: Lyra
  it('LyraPayment.process()/refund()/tokenize() loguean lo esperado', () => {
    const p = new LyraPayment();
    p.process();
    p.refund();
    p.tokenize();
    expect(logSpy).toHaveBeenNthCalledWith(1, 'Processing Lyra payment...');
    expect(logSpy).toHaveBeenNthCalledWith(2, 'Refunding Lyra payment...');
    expect(logSpy).toHaveBeenNthCalledWith(3, 'Tokenizing Lyra payment...');
  });

  // Fábrica
  it('PaymentFactory retorna PayUPayment para "payu"', () => {
    const p = PaymentFactory.createPaymentProcessor('payu');
    expect(p).toBeInstanceOf(PayUPayment);
  });

  it('PaymentFactory retorna CyberSourcePayment para "cybersource"', () => {
    const p = PaymentFactory.createPaymentProcessor('cybersource');
    expect(p).toBeInstanceOf(CyberSourcePayment);
  });

  it('PaymentFactory retorna LyraPayment para "lyra"', () => {
    const p = PaymentFactory.createPaymentProcessor('lyra');
    expect(p).toBeInstanceOf(LyraPayment);
  });

  it('PaymentFactory retorna un procesador válido para "worldpay"', () => {
    const p = PaymentFactory.createPaymentProcessor('worldpay');
    expect(p).not.toBeNull();
    // No podemos verificar la clase (no exportada), pero sí que implementa la interfaz
    expect(typeof (p as any)?.process).toBe('function');
    expect(typeof (p as any)?.refund).toBe('function');
    expect(typeof (p as any)?.tokenize).toBe('function');
  });

  it('PaymentFactory retorna null para gateway desconocido', () => {
    const p = PaymentFactory.createPaymentProcessor('unknown');
    expect(p).toBeNull();
  });

  // Orquestador
  it('makePaymentOrchestrator llama a process/refund/tokenize', async () => {
    const payment = { process: jest.fn(), refund: jest.fn(), tokenize: jest.fn() };
    await makePaymentOrchestrator(payment as any);
    expect(payment.process).toHaveBeenCalledTimes(1);
    expect(payment.refund).toHaveBeenCalledTimes(1);
    expect(payment.tokenize).toHaveBeenCalledTimes(1);
  });

  // initPayment (sin efectos colaterales ni exit en Jest)
  it('initPayment por defecto procesa CyberSource (process/refund/tokenize)', () => {
    initPayment();
    expect(logSpy).toHaveBeenNthCalledWith(1, 'Processing CyberSource payment...');
    expect(logSpy).toHaveBeenNthCalledWith(2, 'Refunding CyberSource payment...');
    expect(logSpy).toHaveBeenNthCalledWith(3, 'Tokenizing CyberSource payment...');
  });

  it('initPayment("payu") procesa PayU (process/refund/tokenize)', () => {
    initPayment('payu');
    expect(logSpy).toHaveBeenNthCalledWith(1, 'Processing PayU payment...');
    expect(logSpy).toHaveBeenNthCalledWith(2, 'Refunding PayU payment...');
    expect(logSpy).toHaveBeenNthCalledWith(3, 'Tokenizing PayU payment...');
  });

  it('initPayment("lyra") procesa Lyra (process/refund/tokenize)', () => {
    initPayment('lyra');
    expect(logSpy).toHaveBeenNthCalledWith(1, 'Processing Lyra payment...');
    expect(logSpy).toHaveBeenNthCalledWith(2, 'Refunding Lyra payment...');
    expect(logSpy).toHaveBeenNthCalledWith(3, 'Tokenizing Lyra payment...');
  });

  it('initPayment("worldpay") procesa Worldpay (process/refund/tokenize)', () => {
    initPayment('worldpay');
    expect(logSpy).toHaveBeenNthCalledWith(1, 'Processing Worldpay payment...');
    expect(logSpy).toHaveBeenNthCalledWith(2, 'Refunding Worldpay payment...');
    expect(logSpy).toHaveBeenNthCalledWith(3, 'Tokenizing Worldpay payment...');
  });

  it('initPayment("unknown") no llama process() y no hace exit en tests', () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => undefined) as any);
    initPayment('unknown');
    expect(logSpy).toHaveBeenCalledWith('Unknown payment gateway. No action taken.');
    expect(exitSpy).not.toHaveBeenCalled();
    exitSpy.mockRestore();
  });
});
