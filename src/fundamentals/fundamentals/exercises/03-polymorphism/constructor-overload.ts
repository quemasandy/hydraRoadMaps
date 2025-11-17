/**
 * Ejemplo de sobrecarga de constructores en TypeScript
 * Similar a como funciona la clase Date nativa
 */

class MyDate {
  private date: Date;

  // Firmas de sobrecarga del constructor
  constructor();
  constructor(milliseconds: number);
  constructor(dateString: string);
  constructor(year: number, month: number, day: number);
  constructor(
    year: number,
    month: number,
    day: number,
    hours: number,
    minutes: number,
    seconds: number,
  );

  // Implementación del constructor
  constructor(
    arg1?: number | string,
    arg2?: number,
    arg3?: number,
    arg4?: number,
    arg5?: number,
    arg6?: number,
  ) {
    // Caso 1: Sin argumentos - fecha actual
    if (arg1 === undefined) {
      this.date = new Date();
      console.log('Constructor llamado: sin argumentos (fecha actual)');
    }
    // Caso 2: String - parsear fecha desde string
    else if (typeof arg1 === 'string') {
      this.date = new Date(arg1);
      console.log(`Constructor llamado: desde string "${arg1}"`);
    }
    // Caso 3: Solo un número - milisegundos desde epoch
    else if (typeof arg1 === 'number' && arg2 === undefined) {
      this.date = new Date(arg1);
      console.log(`Constructor llamado: desde milisegundos (${arg1})`);
    }
    // Caso 4: Año, mes, día (y opcionalmente horas, minutos, segundos)
    else if (typeof arg1 === 'number' && arg2 !== undefined) {
      if (arg4 !== undefined && arg5 !== undefined && arg6 !== undefined) {
        this.date = new Date(arg1, arg2, arg3!, arg4, arg5, arg6);
        console.log(
          `Constructor llamado: año=${arg1}, mes=${arg2}, día=${arg3}, horas=${arg4}, minutos=${arg5}, segundos=${arg6}`,
        );
      } else {
        this.date = new Date(arg1, arg2, arg3!);
        console.log(
          `Constructor llamado: año=${arg1}, mes=${arg2}, día=${arg3}`,
        );
      }
    } else {
      throw new Error('Argumentos inválidos para el constructor');
    }
  }

  // Métodos de utilidad
  toString(): string {
    return this.date.toISOString();
  }

  toLocalString(): string {
    return this.date.toLocaleString('es-ES');
  }

  getTime(): number {
    return this.date.getTime();
  }

  getYear(): number {
    return this.date.getFullYear();
  }

  getMonth(): number {
    return this.date.getMonth();
  }

  getDay(): number {
    return this.date.getDate();
  }

  format(): string {
    const year = this.date.getFullYear();
    const month = String(this.date.getMonth() + 1).padStart(2, '0');
    const day = String(this.date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

// Ejemplos de uso de las diferentes sobrecargas
console.log('=== Ejemplos de sobrecarga de constructores ===\n');

// 1. Sin argumentos - fecha actual
console.log('1. Fecha actual:');
const date1 = new MyDate();
console.log(`   Resultado: ${date1.toLocalString()}`);
console.log(`   Formato: ${date1.format()}\n`);

// 2. Desde milisegundos
console.log('2. Desde milisegundos (1000000000000):');
const date2 = new MyDate(1000000000000);
console.log(`   Resultado: ${date2.toLocalString()}`);
console.log(`   Formato: ${date2.format()}\n`);

// 3. Desde string ISO
console.log('3. Desde string ISO:');
const date3 = new MyDate('2025-01-15');
console.log(`   Resultado: ${date3.toLocalString()}`);
console.log(`   Formato: ${date3.format()}\n`);

// 4. Desde string con formato completo
console.log('4. Desde string con hora:');
const date4 = new MyDate('2025-12-25T18:30:00');
console.log(`   Resultado: ${date4.toLocalString()}`);
console.log(`   Formato: ${date4.format()}\n`);

// 5. Año, mes, día (nota: mes es 0-indexed)
console.log('5. Año, mes, día (2025, 5, 15 = 15 de Junio 2025):');
const date5 = new MyDate(2025, 5, 15);
console.log(`   Resultado: ${date5.toLocalString()}`);
console.log(`   Formato: ${date5.format()}\n`);

// 6. Año, mes, día, horas, minutos, segundos
console.log('6. Fecha y hora completa:');
const date6 = new MyDate(2025, 11, 31, 23, 59, 59);
console.log(`   Resultado: ${date6.toLocalString()}`);
console.log(`   Formato: ${date6.format()}\n`);

// Comparación de tiempos
console.log('=== Comparación de fechas ===');
console.log(`Date1 (actual): ${date1.getTime()} ms desde epoch`);
console.log(`Date2 (2001): ${date2.getTime()} ms desde epoch`);
console.log(`Date3 (2025-01-15): ${date3.getTime()} ms desde epoch`);
