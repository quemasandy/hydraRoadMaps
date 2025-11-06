import {
  PayUPayment,
  CyberSourcePayment,
  PaymentFactory,
  makePaymentOrchestrator,
  initPayment,
} from './abstraction';

describe('abstraction exercise: full coverage', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  // Procesadores concretos
  it('PayUPayment.process() loguea el mensaje esperado', () => {
    const p = new PayUPayment();
    p.process();
    expect(logSpy).toHaveBeenCalledWith('Processing PayU payment...');
  });

  it('CyberSourcePayment.process() loguea el mensaje esperado', () => {
    const p = new CyberSourcePayment();
    p.process();
    expect(logSpy).toHaveBeenCalledWith('Processing CyberSource payment...');
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

  it('PaymentFactory retorna null para gateway desconocido', () => {
    const p = PaymentFactory.createPaymentProcessor('unknown');
    expect(p).toBeNull();
  });

  // Orquestador
  it('makePaymentOrchestrator llama a process() del pago recibido', async () => {
    const payment = { process: jest.fn() };
    await makePaymentOrchestrator(payment as any);
    expect(payment.process).toHaveBeenCalledTimes(1);
  });

  // initPayment (sin efectos colaterales ni exit en Jest)
  it('initPayment por defecto procesa CyberSource', () => {
    initPayment();
    expect(logSpy).toHaveBeenCalledWith('Processing CyberSource payment...');
  });

  it('initPayment("payu") procesa PayU', () => {
    initPayment('payu');
    expect(logSpy).toHaveBeenCalledWith('Processing PayU payment...');
  });

  it('initPayment("unknown") no llama process() y no hace exit en tests', () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => undefined) as any);
    initPayment('unknown');
    expect(logSpy).toHaveBeenCalledWith('Unknown payment gateway. No action taken.');
    expect(exitSpy).not.toHaveBeenCalled();
    exitSpy.mockRestore();
  });
});
