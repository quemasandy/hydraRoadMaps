type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface Service {
  call(): Promise<string>;
}

class UnstableService implements Service {
  async call(): Promise<string> {
    if (Math.random() > 0.7) {
      throw new Error('Service failed!');
    }
    return 'Service success!';
  }
}

class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly failureThreshold = 3;
  private readonly resetTimeout = 3000; // 3 segundos

  constructor(private service: Service) {}

  async callService(): Promise<string> {
    // 1. Verificar si estamos en OPEN
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit is OPEN. Call blocked.');
      }
    }

    // 2. Intentar llamar al servicio
    try {
      const result = await this.service.call();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    // Si tiene éxito en HALF_OPEN, cerramos el circuito (recuperado)
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      this.failureCount = 0;
      console.log('Circuit closed (recovered).');
    }
    // En CLOSED, reseteamos contadores por si acaso
    this.failureCount = 0;
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    console.log(`Failure detected. Count: ${this.failureCount}`);

    if (this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      console.log('Circuit reopened (probe failed).');
    } else if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      console.log('Circuit opened (threshold reached).');
    }
  }
}

// Simulación
async function runSimulation() {
  const service = new UnstableService();
  const breaker = new CircuitBreaker(service);

  for (let i = 0; i < 20; i++) {
    try {
      console.log(`Attempt ${i + 1}:`);
      const res = await breaker.callService();
      console.log(`Success: ${res}`);
    } catch (e) {
      console.log(`Error: ${(e as Error).message}`);
    }
    await new Promise((r) => setTimeout(r, 500)); // Esperar 0.5s entre llamadas
  }
}

runSimulation();

export {};
