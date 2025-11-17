import * as P from './abstractionProcedural';

describe('abstraction (procedural): full coverage', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  // Unitarios de cada función
  it('PayU functions log expected messages', () => {
    P.processPayUPayment();
    P.refundPayUPayment();
    P.tokenizePayUPayment();
    expect(logSpy).toHaveBeenNthCalledWith(1, 'Processing PayU payment...');
    expect(logSpy).toHaveBeenNthCalledWith(2, 'Refunding PayU payment...');
    expect(logSpy).toHaveBeenNthCalledWith(3, 'Tokenizing PayU payment...');
  });

  it('CyberSource functions log expected messages', () => {
    P.processCyberSourcePayment();
    P.refundCyberSourcePayment();
    P.tokenizeCyberSourcePayment();
    expect(logSpy).toHaveBeenNthCalledWith(1, 'Processing CyberSource payment...');
    expect(logSpy).toHaveBeenNthCalledWith(2, 'Refunding CyberSource payment...');
    expect(logSpy).toHaveBeenNthCalledWith(3, 'Tokenizing CyberSource payment...');
  });

  it('Lyra functions log expected messages', () => {
    P.processLyraPayment();
    P.refundLyraPayment();
    P.tokenizeLyraPayment();
    expect(logSpy).toHaveBeenNthCalledWith(1, 'Processing Lyra payment...');
    expect(logSpy).toHaveBeenNthCalledWith(2, 'Refunding Lyra payment...');
    expect(logSpy).toHaveBeenNthCalledWith(3, 'Tokenizing Lyra payment...');
  });

  it('Worldpay functions log expected messages', () => {
    P.processWorldpayPayment();
    P.refundWorldpayPayment();
    P.tokenizeWorldpayPayment();
    expect(logSpy).toHaveBeenNthCalledWith(1, 'Processing Worldpay payment...');
    expect(logSpy).toHaveBeenNthCalledWith(2, 'Refunding Worldpay payment...');
    expect(logSpy).toHaveBeenNthCalledWith(3, 'Tokenizing Worldpay payment...');
  });

  // Orquestador por gateway
  it('orchestrator triggers PayU trio', async () => {
    const s1 = jest.spyOn(P, 'processPayUPayment');
    const s2 = jest.spyOn(P, 'refundPayUPayment');
    const s3 = jest.spyOn(P, 'tokenizePayUPayment');
    await P.makePaymentOrchestrator({ gateway: 'payu' });
    expect(s1).toHaveBeenCalledTimes(1);
    expect(s2).toHaveBeenCalledTimes(1);
    expect(s3).toHaveBeenCalledTimes(1);
  });

  it('orchestrator triggers CyberSource trio', async () => {
    const s1 = jest.spyOn(P, 'processCyberSourcePayment');
    const s2 = jest.spyOn(P, 'refundCyberSourcePayment');
    const s3 = jest.spyOn(P, 'tokenizeCyberSourcePayment');
    await P.makePaymentOrchestrator({ gateway: 'cybersource' });
    expect(s1).toHaveBeenCalledTimes(1);
    expect(s2).toHaveBeenCalledTimes(1);
    expect(s3).toHaveBeenCalledTimes(1);
  });

  it('orchestrator triggers Lyra trio', async () => {
    const s1 = jest.spyOn(P, 'processLyraPayment');
    const s2 = jest.spyOn(P, 'refundLyraPayment');
    const s3 = jest.spyOn(P, 'tokenizeLyraPayment');
    await P.makePaymentOrchestrator({ gateway: 'lyra' });
    expect(s1).toHaveBeenCalledTimes(1);
    expect(s2).toHaveBeenCalledTimes(1);
    expect(s3).toHaveBeenCalledTimes(1);
  });

  it('orchestrator triggers Worldpay trio', async () => {
    const s1 = jest.spyOn(P, 'processWorldpayPayment');
    const s2 = jest.spyOn(P, 'refundWorldpayPayment');
    const s3 = jest.spyOn(P, 'tokenizeWorldpayPayment');
    await P.makePaymentOrchestrator({ gateway: 'worldpay' });
    expect(s1).toHaveBeenCalledTimes(1);
    expect(s2).toHaveBeenCalledTimes(1);
    expect(s3).toHaveBeenCalledTimes(1);
  });

  it('unknown gateway: orchestrator no llama funciones', async () => {
    const spies = [
      jest.spyOn(P, 'processPayUPayment'),
      jest.spyOn(P, 'refundPayUPayment'),
      jest.spyOn(P, 'tokenizePayUPayment'),
      jest.spyOn(P, 'processCyberSourcePayment'),
      jest.spyOn(P, 'refundCyberSourcePayment'),
      jest.spyOn(P, 'tokenizeCyberSourcePayment'),
      jest.spyOn(P, 'processLyraPayment'),
      jest.spyOn(P, 'refundLyraPayment'),
      jest.spyOn(P, 'tokenizeLyraPayment'),
      jest.spyOn(P, 'processWorldpayPayment'),
      jest.spyOn(P, 'refundWorldpayPayment'),
      jest.spyOn(P, 'tokenizeWorldpayPayment'),
    ];
    await P.makePaymentOrchestrator({ gateway: 'unknown' as any });
    spies.forEach(s => expect(s).not.toHaveBeenCalled());
  });
});

