/**
 * Ejemplo MÁS SIMPLE de sobrecarga en TypeScript
 *
 * Concepto: Un mismo método que puede recibir diferentes tipos/cantidad de parámetros
 */

class Calculadora {
  // 🔹 Firmas de sobrecarga (lo que TypeScript "ve")
  sumar(a: number, b: number): number;           // 2 números
  sumar(a: string, b: string): string;           // 2 strings
  sumar(a: number, b: number, c: number): number; // 3 números

  // 🔹 Implementación real (lo que JavaScript ejecuta)
  sumar(a: number | string, b: number | string, c?: number): number | string {
    // Caso 1: Si son strings, concatenar
    if (typeof a === 'string' && typeof b === 'string') {
      return a + b;
    }

    // Caso 2: Si son números y hay 3 argumentos
    if (typeof a === 'number' && typeof b === 'number' && c !== undefined) {
      return a + b + c;
    }

    // Caso 3: Si son números y hay 2 argumentos
    if (typeof a === 'number' && typeof b === 'number') {
      return a + b;
    }

    throw new Error('Combinación de argumentos inválida');
  }
}

// 📝 Ejemplos de uso
console.log('=== Ejemplo simple de sobrecarga ===\n');

const calc = new Calculadora();

// Llamada 1: sumar(number, number)
console.log('1. Sumar 2 números:');
const resultado1 = calc.sumar(5, 3);
console.log(`   calc.sumar(5, 3) = ${resultado1}`);
console.log(`   Tipo: ${typeof resultado1}\n`);

// Llamada 2: sumar(string, string)
console.log('2. Concatenar 2 strings:');
const resultado2 = calc.sumar('Hola', 'Mundo');
console.log(`   calc.sumar("Hola", "Mundo") = ${resultado2}`);
console.log(`   Tipo: ${typeof resultado2}\n`);

// Llamada 3: sumar(number, number, number)
console.log('3. Sumar 3 números:');
const resultado3 = calc.sumar(10, 20, 30);
console.log(`   calc.sumar(10, 20, 30) = ${resultado3}`);
console.log(`   Tipo: ${typeof resultado3}\n`);

// 💡 Ventaja: TypeScript sabe qué tipo devuelve cada llamada
console.log('=== TypeScript conoce los tipos de retorno ===');
console.log(`resultado1 es number: ${typeof resultado1 === 'number'}`);
console.log(`resultado2 es string: ${typeof resultado2 === 'string'}`);
console.log(`resultado3 es number: ${typeof resultado3 === 'number'}`);
