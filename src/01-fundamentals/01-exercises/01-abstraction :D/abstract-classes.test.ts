import { runDemo } from './abstract-classes';

describe('abstract classes demo: minimal behavior', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('runDemo imprime el flujo esperado para PayU y Lyra', () => {
    runDemo();

    expect(logSpy).toHaveBeenNthCalledWith(1, 'Iniciando pago...');
    expect(logSpy).toHaveBeenNthCalledWith(2, 'PayU: procesando...');
    expect(logSpy).toHaveBeenNthCalledWith(3, 'PayU: reembolso...');

    expect(logSpy).toHaveBeenNthCalledWith(4, 'Iniciando pago...');
    expect(logSpy).toHaveBeenNthCalledWith(5, 'Lyra: procesando...');
    expect(logSpy).toHaveBeenNthCalledWith(6, 'Reembolso por defecto (sin acción)');
  });
});

