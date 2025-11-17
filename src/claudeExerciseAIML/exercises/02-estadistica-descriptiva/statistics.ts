/**
 * Ejercicio 02: Estadística Descriptiva
 *
 * Este módulo implementa funciones fundamentales de estadística descriptiva
 * para analizar y resumir conjuntos de datos en Machine Learning.
 */

/**
 * Calcula la media (promedio aritmético) de un conjunto de datos
 * Formula: μ = (Σ xi) / n
 *
 * @param data - Array de números
 * @returns Media del conjunto de datos
 */
export function mean(data: number[]): number {
  if (data.length === 0) {
    throw new Error('No se puede calcular la media de un array vacío');
  }

  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
}

/**
 * Calcula la mediana (valor central) de un conjunto de datos
 * La mediana es más robusta a outliers que la media
 *
 * @param data - Array de números
 * @returns Mediana del conjunto de datos
 */
export function median(data: number[]): number {
  if (data.length === 0) {
    throw new Error('No se puede calcular la mediana de un array vacío');
  }

  // Crear una copia ordenada para no modificar el original
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  // Si la longitud es impar, retornar el elemento central
  // Si es par, retornar el promedio de los dos elementos centrales
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    return sorted[mid];
  }
}

/**
 * Calcula la moda (valor(es) más frecuente(s)) de un conjunto de datos
 * Puede retornar múltiples valores si hay varios con la misma frecuencia máxima
 *
 * @param data - Array de números
 * @returns Array con el/los valor(es) más frecuente(s)
 */
export function mode(data: number[]): number[] {
  if (data.length === 0) {
    return [];
  }

  // Contar frecuencia de cada valor
  const frequencyMap = new Map<number, number>();
  data.forEach(value => {
    frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1);
  });

  // Encontrar la frecuencia máxima
  let maxFrequency = 0;
  frequencyMap.forEach(frequency => {
    if (frequency > maxFrequency) {
      maxFrequency = frequency;
    }
  });

  // Si todos los valores aparecen una sola vez, no hay moda
  if (maxFrequency === 1) {
    return [];
  }

  // Obtener todos los valores con la frecuencia máxima
  const modes: number[] = [];
  frequencyMap.forEach((frequency, value) => {
    if (frequency === maxFrequency) {
      modes.push(value);
    }
  });

  return modes.sort((a, b) => a - b);
}

/**
 * Calcula la varianza de un conjunto de datos
 * Formula: σ² = Σ(xi - μ)² / n
 *
 * @param data - Array de números
 * @param sample - Si true, usa n-1 (varianza muestral), si false usa n (poblacional)
 * @returns Varianza del conjunto de datos
 */
export function variance(data: number[], sample: boolean = false): number {
  if (data.length === 0) {
    throw new Error('No se puede calcular la varianza de un array vacío');
  }

  if (data.length === 1 && sample) {
    throw new Error(
      'No se puede calcular varianza muestral con un solo elemento'
    );
  }

  const avg = mean(data);
  const squaredDifferences = data.map(x => Math.pow(x - avg, 2));
  const sumSquaredDiff = squaredDifferences.reduce((acc, val) => acc + val, 0);

  // Varianza poblacional (n) o muestral (n-1)
  const denominator = sample ? data.length - 1 : data.length;
  return sumSquaredDiff / denominator;
}

/**
 * Calcula la desviación estándar de un conjunto de datos
 * Formula: σ = √(σ²)
 *
 * @param data - Array de números
 * @param sample - Si true, usa n-1 (desviación muestral), si false usa n (poblacional)
 * @returns Desviación estándar del conjunto de datos
 */
export function standardDeviation(
  data: number[],
  sample: boolean = false
): number {
  return Math.sqrt(variance(data, sample));
}

/**
 * Calcula el rango (diferencia entre máximo y mínimo) de un conjunto de datos
 * Formula: range = max - min
 *
 * @param data - Array de números
 * @returns Rango del conjunto de datos
 */
export function range(data: number[]): number {
  if (data.length === 0) {
    throw new Error('No se puede calcular el rango de un array vacío');
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  return max - min;
}

/**
 * Calcula la covarianza entre dos variables
 * Formula: cov(X,Y) = Σ(xi - μx)(yi - μy) / n
 *
 * @param x - Primera variable
 * @param y - Segunda variable
 * @param sample - Si true, usa n-1, si false usa n
 * @returns Covarianza entre x e y
 */
export function covariance(
  x: number[],
  y: number[],
  sample: boolean = false
): number {
  if (x.length === 0 || y.length === 0) {
    throw new Error('Los arrays no pueden estar vacíos');
  }

  if (x.length !== y.length) {
    throw new Error('Los arrays deben tener la misma longitud');
  }

  if (x.length === 1 && sample) {
    throw new Error(
      'No se puede calcular covarianza muestral con un solo elemento'
    );
  }

  const meanX = mean(x);
  const meanY = mean(y);

  const products = x.map((xi, i) => (xi - meanX) * (y[i] - meanY));
  const sumProducts = products.reduce((acc, val) => acc + val, 0);

  const denominator = sample ? x.length - 1 : x.length;
  return sumProducts / denominator;
}

/**
 * Calcula el coeficiente de correlación de Pearson entre dos variables
 * Formula: r = cov(X,Y) / (σx * σy)
 * Retorna un valor entre -1 y 1
 *
 * @param x - Primera variable
 * @param y - Segunda variable
 * @returns Correlación entre x e y (-1 a 1)
 */
export function correlation(x: number[], y: number[]): number {
  if (x.length === 0 || y.length === 0) {
    throw new Error('Los arrays no pueden estar vacíos');
  }

  if (x.length !== y.length) {
    throw new Error('Los arrays deben tener la misma longitud');
  }

  const cov = covariance(x, y, false);
  const stdX = standardDeviation(x, false);
  const stdY = standardDeviation(y, false);

  // Si alguna desviación estándar es 0, no hay variación
  if (stdX === 0 || stdY === 0) {
    return 0;
  }

  return cov / (stdX * stdY);
}

/**
 * Calcula un percentil específico de un conjunto de datos
 * Usa el método de interpolación lineal
 *
 * @param data - Array de números
 * @param p - Percentil a calcular (0-100)
 * @returns Valor del percentil p
 */
export function percentile(data: number[], p: number): number {
  if (data.length === 0) {
    throw new Error('No se puede calcular percentil de un array vacío');
  }

  if (p < 0 || p > 100) {
    throw new Error('El percentil debe estar entre 0 y 100');
  }

  // Crear copia ordenada
  const sorted = [...data].sort((a, b) => a - b);

  // Caso especial: un solo elemento
  if (sorted.length === 1) {
    return sorted[0];
  }

  // Calcular índice usando interpolación lineal
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  // Si el índice es exacto, retornar ese valor
  if (lower === upper) {
    return sorted[lower];
  }

  // Interpolar entre los dos valores
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Calcula los cuartiles (Q1, Q2, Q3) de un conjunto de datos
 * Q1 = percentil 25, Q2 = mediana, Q3 = percentil 75
 *
 * @param data - Array de números
 * @returns Tupla [Q1, Q2 (mediana), Q3]
 */
export function quartiles(data: number[]): [number, number, number] {
  if (data.length === 0) {
    throw new Error('No se puede calcular cuartiles de un array vacío');
  }

  const q1 = percentile(data, 25);
  const q2 = percentile(data, 50); // Mediana
  const q3 = percentile(data, 75);

  return [q1, q2, q3];
}

/**
 * Calcula el rango intercuartílico (IQR)
 * IQR = Q3 - Q1
 * Útil para detectar outliers
 *
 * @param data - Array de números
 * @returns Rango intercuartílico
 */
export function iqr(data: number[]): number {
  const [q1, , q3] = quartiles(data);
  return q3 - q1;
}

/**
 * Detecta outliers usando el método IQR
 * Outliers son valores fuera del rango [Q1 - 1.5*IQR, Q3 + 1.5*IQR]
 *
 * @param data - Array de números
 * @returns Array de índices de outliers
 */
export function detectOutliers(data: number[]): number[] {
  if (data.length === 0) {
    return [];
  }

  const [q1, , q3] = quartiles(data);
  const interquartileRange = q3 - q1;

  const lowerBound = q1 - 1.5 * interquartileRange;
  const upperBound = q3 + 1.5 * interquartileRange;

  const outlierIndices: number[] = [];
  data.forEach((value, index) => {
    if (value < lowerBound || value > upperBound) {
      outlierIndices.push(index);
    }
  });

  return outlierIndices;
}

/**
 * Clase que encapsula operaciones estadísticas sobre un conjunto de datos
 * Calcula y cachea estadísticos comunes
 */
export class Statistics {
  private _mean?: number;
  private _median?: number;
  private _mode?: number[];
  private _variance?: number;
  private _std?: number;

  constructor(private data: number[]) {
    if (data.length === 0) {
      throw new Error('El conjunto de datos no puede estar vacío');
    }
  }

  /**
   * Calcula o retorna la media cacheada
   */
  mean(): number {
    if (this._mean === undefined) {
      this._mean = mean(this.data);
    }
    return this._mean;
  }

  /**
   * Calcula o retorna la mediana cacheada
   */
  median(): number {
    if (this._median === undefined) {
      this._median = median(this.data);
    }
    return this._median;
  }

  /**
   * Calcula o retorna la moda cacheada
   */
  mode(): number[] {
    if (this._mode === undefined) {
      this._mode = mode(this.data);
    }
    return this._mode;
  }

  /**
   * Calcula o retorna la varianza cacheada
   */
  variance(sample: boolean = false): number {
    if (this._variance === undefined || sample) {
      this._variance = variance(this.data, sample);
    }
    return this._variance;
  }

  /**
   * Calcula o retorna la desviación estándar cacheada
   */
  std(sample: boolean = false): number {
    if (this._std === undefined || sample) {
      this._std = standardDeviation(this.data, sample);
    }
    return this._std;
  }

  /**
   * Calcula el rango
   */
  range(): number {
    return range(this.data);
  }

  /**
   * Calcula cuartiles
   */
  quartiles(): [number, number, number] {
    return quartiles(this.data);
  }

  /**
   * Genera un resumen estadístico completo
   */
  summary(): {
    count: number;
    mean: number;
    median: number;
    mode: number[];
    std: number;
    variance: number;
    min: number;
    max: number;
    range: number;
    q1: number;
    q2: number;
    q3: number;
    iqr: number;
  } {
    const [q1, q2, q3] = this.quartiles();

    return {
      count: this.data.length,
      mean: this.mean(),
      median: this.median(),
      mode: this.mode(),
      std: this.std(),
      variance: this.variance(),
      min: Math.min(...this.data),
      max: Math.max(...this.data),
      range: this.range(),
      q1,
      q2,
      q3,
      iqr: q3 - q1,
    };
  }

  /**
   * Detecta outliers
   */
  outliers(): number[] {
    return detectOutliers(this.data);
  }
}

// ============================================
// Demostración práctica
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 02: Estadística Descriptiva ===\n');

  // Ejemplo 1: Medidas de tendencia central
  console.log('1. Medidas de Tendencia Central:');
  const prices = [250000, 300000, 275000, 450000, 280000, 290000, 320000];
  console.log('Precios de casas:', prices);
  console.log('Media:', mean(prices).toFixed(2));
  console.log('Mediana:', median(prices).toFixed(2));
  console.log('Moda:', mode(prices));
  console.log();

  // Ejemplo 2: Medidas de dispersión
  console.log('2. Medidas de Dispersión:');
  const areas = [100, 120, 110, 180, 115, 125, 140];
  console.log('Áreas (m²):', areas);
  console.log('Varianza:', variance(areas).toFixed(2));
  console.log('Desviación Estándar:', standardDeviation(areas).toFixed(2));
  console.log('Rango:', range(areas));
  console.log();

  // Ejemplo 3: Correlación
  console.log('3. Correlación entre Área y Precio:');
  const areasSimple = [100, 120, 110, 140, 115, 125, 150];
  const pricesSimple = [250, 300, 275, 320, 280, 290, 340];
  console.log('Áreas:', areasSimple);
  console.log('Precios:', pricesSimple);
  console.log('Covarianza:', covariance(areasSimple, pricesSimple).toFixed(2));
  console.log('Correlación:', correlation(areasSimple, pricesSimple).toFixed(3));
  console.log();

  // Ejemplo 4: Percentiles y cuartiles
  console.log('4. Percentiles y Cuartiles:');
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  console.log('Datos:', data);
  console.log('Percentil 25:', percentile(data, 25));
  console.log('Percentil 50 (Mediana):', percentile(data, 50));
  console.log('Percentil 75:', percentile(data, 75));
  console.log('Cuartiles [Q1, Q2, Q3]:', quartiles(data));
  console.log('IQR:', iqr(data));
  console.log();

  // Ejemplo 5: Detección de outliers
  console.log('5. Detección de Outliers:');
  const dataWithOutliers = [10, 12, 13, 12, 11, 13, 14, 100, 12, 11];
  console.log('Datos:', dataWithOutliers);
  const outlierIndices = detectOutliers(dataWithOutliers);
  console.log('Índices de outliers:', outlierIndices);
  console.log(
    'Valores outliers:',
    outlierIndices.map(i => dataWithOutliers[i])
  );
  console.log();

  // Ejemplo 6: Clase Statistics
  console.log('6. Resumen Estadístico Completo:');
  const stats = new Statistics(prices);
  const summary = stats.summary();
  console.log('Resumen de precios de casas:');
  console.table({
    'Cantidad': summary.count,
    'Media': summary.mean.toFixed(2),
    'Mediana': summary.median.toFixed(2),
    'Desv. Std': summary.std.toFixed(2),
    'Mínimo': summary.min,
    'Máximo': summary.max,
    'Q1': summary.q1.toFixed(2),
    'Q3': summary.q3.toFixed(2),
    'IQR': summary.iqr.toFixed(2),
  });
  console.log('\nOutliers detectados en índices:', stats.outliers());
}
