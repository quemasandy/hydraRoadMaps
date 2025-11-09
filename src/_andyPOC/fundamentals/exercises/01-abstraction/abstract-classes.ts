/*
Ejercicio: Clases abstractas (lo mínimo y didáctico)

Qué aprenderás:
- No se pueden instanciar clases abstractas.
- Obligan a las subclases a implementar ciertos métodos (contrato).
- Pueden incluir comportamiento compartido listo para reusar.

Tareas sugeridas:
1) Implementa process() en un tercer proveedor SandboxPayment.
2) Sobrescribe refund() en LyraPayment para personalizar el comportamiento.
3) Llama a collect() con cada implementación y observa el orden de llamadas.
*/

// 1) Definimos una clase abstracta con:
//    - un método concreto reutilizable (start)
//    - un método abstracto obligatorio (process)
//    - un método con implementación por defecto (refund)
abstract class PaymentProcessor {
  // Método concreto compartido entre todos los pagos
  start(): void {
    console.log('Iniciando pago...');
  }

  // Método abstracto: cada proveedor DEBE implementarlo
  abstract process(): void;

  // Hook opcional con comportamiento por defecto
  refund(): void {
    console.log('Reembolso por defecto (sin acción)');
  }
}

// 2) Implementaciones concretas que cumplen el contrato de PaymentProcessor
class PayUPayment extends PaymentProcessor {
  process(): void {
    console.log('PayU: procesando...');
  }

  // Sobrescribimos para demostrar polimorfismo
  refund(): void {
    console.log('PayU: reembolso...');
  }
}

class LyraPayment extends PaymentProcessor {
  process(): void {
    console.log('Lyra: procesando...');
  }
  // Usa el refund() por defecto de la clase base
}

// 3) Una función que trabaja contra la ABSTRACCIÓN, no contra concreciones
function collect(payment: PaymentProcessor): void {
  payment.start();   // comportamiento común
  payment.process(); // obligación de la subclase
  payment.refund();  // comportamiento específico o por defecto
}

// 4) Pequeña demo (descomenta la línea marcada para ver el error de compilación)
export function runDemo(): void {
  // const p = new PaymentProcessor();
  // Error intencional: "Cannot create an instance of an abstract class."

  collect(new PayUPayment());
  collect(new LyraPayment());
}

// Ejecuta el ejemplo solo cuando este archivo es el punto de entrada.
declare const require: any | undefined;
declare const module: any | undefined;
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  runDemo();
}

