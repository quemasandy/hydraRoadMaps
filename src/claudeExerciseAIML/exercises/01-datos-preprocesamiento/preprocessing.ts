/**
 * Ejercicio 01: Datos y Preprocesamiento
 *
 * Este módulo implementa técnicas fundamentales de preprocesamiento de datos
 * para Machine Learning, incluyendo normalización, codificación y división
 * de datasets.
 */

/**
 * Normaliza un array de números usando Min-Max scaling
 * Formula: x_norm = (x - x_min) / (x_max - x_min)
 *
 * @param data - Array de números a normalizar
 * @returns Array normalizado con valores entre 0 y 1
 */
export function normalizeMinMax(data: number[]): number[] {
  if (data.length === 0) return [];
  if (data.length === 1) return [0];

  const min = Math.min(...data);
  const max = Math.max(...data);

  // Si todos los valores son iguales, retornar array de ceros
  if (max === min) return data.map(() => 0);

  return data.map(x => (x - min) / (max - min));
}

/**
 * Normaliza un array usando Z-score (standardization)
 * Formula: x_std = (x - μ) / σ
 * donde μ = media, σ = desviación estándar
 *
 * @param data - Array de números a estandarizar
 * @returns Array estandarizado con media 0 y std 1
 */
export function normalizeZScore(data: number[]): number[] {
  if (data.length === 0) return [];
  if (data.length === 1) return [0];

  // Calcular media
  const mean = data.reduce((sum, x) => sum + x, 0) / data.length;

  // Calcular desviación estándar
  const variance =
    data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);

  // Si stdDev es 0, todos los valores son iguales
  if (stdDev === 0) return data.map(() => 0);

  // Aplicar z-score
  return data.map(x => (x - mean) / stdDev);
}

/**
 * Codifica variables categóricas usando one-hot encoding
 * Ejemplo: ['red', 'blue', 'red'] -> [[1,0], [0,1], [1,0]]
 *
 * @param data - Array de strings (categorías)
 * @returns Matriz de one-hot encoding
 */
export function oneHotEncode(data: string[]): number[][] {
  if (data.length === 0) return [];

  // Obtener categorías únicas y ordenarlas para consistencia
  const uniqueCategories = Array.from(new Set(data)).sort();

  // Crear un mapa para búsqueda rápida de índices
  const categoryIndex = new Map<string, number>();
  uniqueCategories.forEach((cat, idx) => categoryIndex.set(cat, idx));

  // Codificar cada elemento
  return data.map(item => {
    const encoded = new Array(uniqueCategories.length).fill(0);
    const index = categoryIndex.get(item);
    if (index !== undefined) {
      encoded[index] = 1;
    }
    return encoded;
  });
}

/**
 * Divide un array en conjuntos de entrenamiento y prueba
 *
 * @param data - Array de datos a dividir
 * @param trainSize - Proporción del set de entrenamiento (0-1)
 * @param shuffle - Si se debe mezclar antes de dividir
 * @returns Tupla [train, test]
 */
export function trainTestSplit<T>(
  data: T[],
  trainSize: number = 0.8,
  shuffle: boolean = false
): [T[], T[]] {
  if (data.length === 0) return [[], []];
  if (trainSize < 0 || trainSize > 1) {
    throw new Error('trainSize debe estar entre 0 y 1');
  }

  // Crear copia para no modificar el original
  let dataCopy = [...data];

  // Mezclar si se requiere
  if (shuffle) {
    dataCopy = shuffleArray(dataCopy);
  }

  // Calcular índice de división
  const splitIndex = Math.floor(dataCopy.length * trainSize);

  // Dividir
  const train = dataCopy.slice(0, splitIndex);
  const test = dataCopy.slice(splitIndex);

  return [train, test];
}

/**
 * Mezcla un array usando Fisher-Yates shuffle
 * @param array - Array a mezclar
 * @returns Array mezclado
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Rellena valores faltantes (null o undefined) en un array
 *
 * @param data - Array con posibles valores faltantes
 * @param strategy - Estrategia de relleno: 'mean', 'median', 'zero'
 * @returns Array sin valores faltantes
 */
export function fillMissing(
  data: (number | null | undefined)[],
  strategy: 'mean' | 'median' | 'zero' = 'mean'
): number[] {
  if (data.length === 0) return [];

  // Filtrar valores válidos
  const validValues = data.filter(x => x !== null && x !== undefined) as number[];

  // Si no hay valores válidos, retornar array de ceros
  if (validValues.length === 0) {
    return data.map(() => 0);
  }

  // Calcular valor de relleno según estrategia
  let fillValue: number;

  switch (strategy) {
    case 'mean':
      fillValue = validValues.reduce((sum, x) => sum + x, 0) / validValues.length;
      break;

    case 'median':
      const sorted = [...validValues].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      fillValue = sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
      break;

    case 'zero':
      fillValue = 0;
      break;

    default:
      fillValue = 0;
  }

  // Reemplazar valores faltantes
  return data.map(x => (x === null || x === undefined) ? fillValue : x);
}

/**
 * Clase que encapsula todas las transformaciones de preprocesamiento
 * Permite "ajustar" con datos de entrenamiento y "transformar" nuevos datos
 */
export class DataPreprocessor {
  private minValues?: number[];
  private maxValues?: number[];
  private means?: number[];
  private stdDevs?: number[];
  private categories?: Map<number, string[]>;

  /**
   * Ajusta el preprocessor con datos de entrenamiento
   * Guarda parámetros para transformar futuros datos consistentemente
   */
  fit(data: number[][]): this {
    if (data.length === 0 || data[0].length === 0) return this;

    const numFeatures = data[0].length;

    // Calcular min/max por feature
    this.minValues = new Array(numFeatures).fill(Infinity);
    this.maxValues = new Array(numFeatures).fill(-Infinity);

    // Calcular mean/std por feature
    this.means = new Array(numFeatures).fill(0);
    this.stdDevs = new Array(numFeatures).fill(0);

    // Primera pasada: min, max, mean
    data.forEach(row => {
      row.forEach((value, idx) => {
        this.minValues![idx] = Math.min(this.minValues![idx], value);
        this.maxValues![idx] = Math.max(this.maxValues![idx], value);
        this.means![idx] += value;
      });
    });

    // Calcular media
    this.means = this.means.map(sum => sum / data.length);

    // Segunda pasada: desviación estándar
    data.forEach(row => {
      row.forEach((value, idx) => {
        this.stdDevs![idx] += Math.pow(value - this.means![idx], 2);
      });
    });

    this.stdDevs = this.stdDevs.map(sumSq =>
      Math.sqrt(sumSq / data.length)
    );

    return this;
  }

  /**
   * Transforma datos usando normalización Min-Max
   */
  transformMinMax(data: number[][]): number[][] {
    if (!this.minValues || !this.maxValues) {
      throw new Error('Debes llamar fit() antes de transform()');
    }

    return data.map(row =>
      row.map((value, idx) => {
        const min = this.minValues![idx];
        const max = this.maxValues![idx];
        return max === min ? 0 : (value - min) / (max - min);
      })
    );
  }

  /**
   * Transforma datos usando normalización Z-score
   */
  transformZScore(data: number[][]): number[][] {
    if (!this.means || !this.stdDevs) {
      throw new Error('Debes llamar fit() antes de transform()');
    }

    return data.map(row =>
      row.map((value, idx) => {
        const mean = this.means![idx];
        const std = this.stdDevs![idx];
        return std === 0 ? 0 : (value - mean) / std;
      })
    );
  }
}

// ============================================
// Demostración práctica
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 01: Preprocesamiento de Datos ===\n');

  // Ejemplo 1: Normalización Min-Max
  console.log('1. Normalización Min-Max:');
  const prices = [100000, 200000, 300000, 400000, 500000];
  console.log('Original:', prices);
  console.log('Normalizado:', normalizeMinMax(prices));
  console.log();

  // Ejemplo 2: Normalización Z-score
  console.log('2. Normalización Z-score:');
  const areas = [50, 100, 150, 200, 250];
  console.log('Original:', areas);
  console.log('Z-score:', normalizeZScore(areas).map(x => x.toFixed(2)));
  console.log();

  // Ejemplo 3: One-Hot Encoding
  console.log('3. One-Hot Encoding:');
  const types = ['apartment', 'house', 'apartment', 'condo', 'house'];
  console.log('Original:', types);
  console.log('Encoded:', oneHotEncode(types));
  console.log();

  // Ejemplo 4: Train/Test Split
  console.log('4. Train/Test Split:');
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [train, test] = trainTestSplit(data, 0.8);
  console.log('Original:', data);
  console.log('Train (80%):', train);
  console.log('Test (20%):', test);
  console.log();

  // Ejemplo 5: Manejo de valores faltantes
  console.log('5. Manejo de valores faltantes:');
  const incomplete = [1, 2, null, 4, 5, null, 7];
  console.log('Original:', incomplete);
  console.log('Rellenado (mean):', fillMissing(incomplete, 'mean'));
  console.log('Rellenado (median):', fillMissing(incomplete, 'median'));
  console.log('Rellenado (zero):', fillMissing(incomplete, 'zero'));
  console.log();

  // Ejemplo 6: Preprocessor completo
  console.log('6. DataPreprocessor (múltiples features):');
  const dataset = [
    [100000, 50, 2],  // [precio, área, habitaciones]
    [200000, 100, 3],
    [300000, 150, 4],
    [400000, 200, 5],
  ];

  const preprocessor = new DataPreprocessor();
  preprocessor.fit(dataset);

  console.log('Dataset original:');
  console.table(dataset);

  console.log('\nNormalizado (Min-Max):');
  console.table(preprocessor.transformMinMax(dataset));

  console.log('\nNormalizado (Z-score):');
  console.table(preprocessor.transformZScore(dataset));
}
