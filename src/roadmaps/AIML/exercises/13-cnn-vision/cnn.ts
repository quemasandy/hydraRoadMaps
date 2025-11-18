/**
 * Ejercicio 13: CNN para Visión
 *
 * Implementación de Convolutional Neural Networks desde cero,
 * incluyendo convoluciones, pooling y arquitecturas CNN.
 */

import { relu, sigmoid } from '../11-perceptron-redes-neuronales/neural-network';

// ============================================
// TIPOS E INTERFACES
// ============================================

/**
 * Configuración para capa convolucional
 */
export interface ConvLayerConfig {
  numFilters: number;
  kernelSize: number;
  stride?: number;
  padding?: number;
  activation?: 'relu' | 'sigmoid' | 'none';
}

/**
 * Configuración para CNN simple
 */
export interface SimpleCNNConfig {
  inputSize: number;
  numClasses: number;
}

// ============================================
// OPERACIONES DE CONVOLUCIÓN
// ============================================

/**
 * Añade padding (relleno) a una imagen
 *
 * Padding añade bordes a la imagen, útil para:
 * - Mantener tamaño después de convolución
 * - Prevenir que bordes tengan menos procesamiento
 *
 * @param image - Imagen 2D
 * @param padding - Píxeles de padding en cada lado
 * @param value - Valor del padding (default: 0)
 * @returns Imagen con padding
 */
export function padImage(
  image: number[][],
  padding: number,
  value: number = 0
): number[][] {
  if (padding === 0) return image;

  const height = image.length;
  const width = image[0].length;

  const newHeight = height + 2 * padding;
  const newWidth = width + 2 * padding;

  const padded: number[][] = Array(newHeight)
    .fill(0)
    .map(() => Array(newWidth).fill(value));

  // Copiar imagen original en el centro
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      padded[i + padding][j + padding] = image[i][j];
    }
  }

  return padded;
}

/**
 * Calcula tamaño de salida después de convolución
 *
 * Formula:
 * outputSize = ⌊(inputSize + 2×padding - kernelSize) / stride⌋ + 1
 *
 * Esta fórmula se deriva de contar cuántas posiciones
 * caben al deslizar el kernel sobre la imagen.
 *
 * @param inputSize - Tamaño de entrada
 * @param kernelSize - Tamaño del kernel
 * @param stride - Paso del kernel
 * @param padding - Padding aplicado
 * @returns Tamaño de salida
 */
export function computeOutputSize(
  inputSize: number,
  kernelSize: number,
  stride: number,
  padding: number
): number {
  return Math.floor((inputSize + 2 * padding - kernelSize) / stride) + 1;
}

/**
 * Convolución 2D
 *
 * Operación fundamental de CNN. Desliza kernel sobre imagen
 * calculando producto punto en cada posición.
 *
 * Matemática:
 * Output[i,j] = Σ Σ Input[i×s + m, j×s + n] × Kernel[m,n]
 *              m=0 n=0
 *
 * Nota: Esta es correlación, no convolución matemática pura
 * (que voltearía el kernel). En Deep Learning ambas son equivalentes.
 *
 * @param input - Imagen de entrada
 * @param kernel - Filtro/kernel
 * @param stride - Paso del deslizamiento
 * @param padding - Padding a aplicar
 * @returns Feature map resultado
 */
export function convolve2D(
  input: number[][],
  kernel: number[][],
  stride: number = 1,
  padding: number = 0
): number[][] {
  // Aplicar padding
  const paddedInput = padImage(input, padding);

  const inputHeight = paddedInput.length;
  const inputWidth = paddedInput[0].length;
  const kernelSize = kernel.length;

  // Calcular dimensiones de salida
  const outputHeight = computeOutputSize(
    inputHeight,
    kernelSize,
    stride,
    0 // padding ya aplicado
  );
  const outputWidth = computeOutputSize(
    inputWidth,
    kernelSize,
    stride,
    0
  );

  const output: number[][] = Array(outputHeight)
    .fill(0)
    .map(() => Array(outputWidth).fill(0));

  // Deslizar kernel sobre imagen
  for (let i = 0; i < outputHeight; i++) {
    for (let j = 0; j < outputWidth; j++) {
      let sum = 0;

      // Aplicar kernel en posición actual
      for (let m = 0; m < kernelSize; m++) {
        for (let n = 0; n < kernelSize; n++) {
          const inputRow = i * stride + m;
          const inputCol = j * stride + n;

          // Multiplicar y acumular
          sum += paddedInput[inputRow][inputCol] * kernel[m][n];
        }
      }

      output[i][j] = sum;
    }
  }

  return output;
}

/**
 * Correlación 2D (alias para convolve2D)
 *
 * En procesamiento de señales, correlación y convolución
 * son operaciones distintas (convolución voltea kernel).
 *
 * En Deep Learning, usamos correlación pero la llamamos
 * "convolución" por convención.
 *
 * @param input - Imagen de entrada
 * @param kernel - Filtro
 * @param stride - Paso
 * @param padding - Padding
 * @returns Feature map
 */
export function correlate2D(
  input: number[][],
  kernel: number[][],
  stride: number = 1,
  padding: number = 0
): number[][] {
  return convolve2D(input, kernel, stride, padding);
}

// ============================================
// POOLING OPERATIONS
// ============================================

/**
 * Max Pooling 2D
 *
 * Reduce dimensionalidad tomando el máximo de cada región.
 *
 * Propósito:
 * - Reduce parámetros y cómputo
 * - Hace red invariante a pequeñas traslaciones
 * - Extrae features más prominentes
 *
 * Ejemplo:
 * Input:       Max Pool 2×2:
 * 1  2  3  4
 * 5  6  7  8    →    6  8
 * 9  10 11 12        14 16
 * 13 14 15 16
 *
 * @param input - Feature map de entrada
 * @param poolSize - Tamaño de la ventana de pooling
 * @param stride - Paso (default: poolSize para no solapar)
 * @returns Feature map reducido
 */
export function maxPool2D(
  input: number[][],
  poolSize: number = 2,
  stride?: number
): number[][] {
  const actualStride = stride !== undefined ? stride : poolSize;

  const inputHeight = input.length;
  const inputWidth = input[0].length;

  const outputHeight = Math.floor(
    (inputHeight - poolSize) / actualStride + 1
  );
  const outputWidth = Math.floor((inputWidth - poolSize) / actualStride + 1);

  const output: number[][] = Array(outputHeight)
    .fill(0)
    .map(() => Array(outputWidth).fill(-Infinity));

  // Deslizar ventana de pooling
  for (let i = 0; i < outputHeight; i++) {
    for (let j = 0; j < outputWidth; j++) {
      let maxVal = -Infinity;

      // Encontrar máximo en ventana
      for (let m = 0; m < poolSize; m++) {
        for (let n = 0; n < poolSize; n++) {
          const inputRow = i * actualStride + m;
          const inputCol = j * actualStride + n;

          if (
            inputRow < inputHeight &&
            inputCol < inputWidth &&
            input[inputRow][inputCol] > maxVal
          ) {
            maxVal = input[inputRow][inputCol];
          }
        }
      }

      output[i][j] = maxVal;
    }
  }

  return output;
}

/**
 * Average Pooling 2D
 *
 * Similar a max pooling pero promedia en vez de tomar máximo.
 *
 * Diferencia con Max Pooling:
 * - Max: Detecta si feature está presente (preserva activaciones fuertes)
 * - Avg: Más suave, preserva información de fondo
 *
 * Uso:
 * - Max: Más común en CNNs modernas
 * - Avg: Útil en capa final (Global Average Pooling)
 *
 * @param input - Feature map de entrada
 * @param poolSize - Tamaño de ventana
 * @param stride - Paso
 * @returns Feature map promediado
 */
export function avgPool2D(
  input: number[][],
  poolSize: number = 2,
  stride?: number
): number[][] {
  const actualStride = stride !== undefined ? stride : poolSize;

  const inputHeight = input.length;
  const inputWidth = input[0].length;

  const outputHeight = Math.floor(
    (inputHeight - poolSize) / actualStride + 1
  );
  const outputWidth = Math.floor((inputWidth - poolSize) / actualStride + 1);

  const output: number[][] = Array(outputHeight)
    .fill(0)
    .map(() => Array(outputWidth).fill(0));

  for (let i = 0; i < outputHeight; i++) {
    for (let j = 0; j < outputWidth; j++) {
      let sum = 0;
      let count = 0;

      // Promediar en ventana
      for (let m = 0; m < poolSize; m++) {
        for (let n = 0; n < poolSize; n++) {
          const inputRow = i * actualStride + m;
          const inputCol = j * actualStride + n;

          if (inputRow < inputHeight && inputCol < inputWidth) {
            sum += input[inputRow][inputCol];
            count++;
          }
        }
      }

      output[i][j] = count > 0 ? sum / count : 0;
    }
  }

  return output;
}

/**
 * Global Max Pooling
 *
 * Toma el máximo de toda la feature map.
 * Útil como alternativa a Flatten antes de FC layers.
 *
 * @param input - Feature map 2D
 * @returns Valor máximo único
 */
export function globalMaxPool2D(input: number[][]): number {
  let max = -Infinity;
  for (const row of input) {
    for (const val of row) {
      if (val > max) max = val;
    }
  }
  return max;
}

/**
 * Global Average Pooling
 *
 * Promedia toda la feature map.
 * Reduce drasticamente parámetros vs Flatten.
 *
 * @param input - Feature map 2D
 * @returns Promedio
 */
export function globalAvgPool2D(input: number[][]): number {
  let sum = 0;
  let count = 0;
  for (const row of input) {
    for (const val of row) {
      sum += val;
      count++;
    }
  }
  return count > 0 ? sum / count : 0;
}

// ============================================
// KERNELS PREDEFINIDOS
// ============================================

/**
 * Kernels comunes para procesamiento de imágenes
 */
export const KERNELS = {
  /**
   * Detecta bordes horizontales
   * (diferencia entre arriba y abajo)
   */
  EDGE_HORIZONTAL: [
    [1, 1, 1],
    [0, 0, 0],
    [-1, -1, -1],
  ],

  /**
   * Detecta bordes verticales
   * (diferencia entre izquierda y derecha)
   */
  EDGE_VERTICAL: [
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1],
  ],

  /**
   * Sobel X: Detecta bordes verticales (más robusto)
   */
  SOBEL_X: [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ],

  /**
   * Sobel Y: Detecta bordes horizontales (más robusto)
   */
  SOBEL_Y: [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ],

  /**
   * Sharpen: Acentúa detalles
   */
  SHARPEN: [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ],

  /**
   * Blur: Desenfoque Gaussiano
   */
  BLUR: [
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
  ],

  /**
   * Identity: No hace nada (útil para debugging)
   */
  IDENTITY: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
};

// ============================================
// CAPA CONVOLUCIONAL
// ============================================

/**
 * Capa Convolucional
 *
 * Aplica múltiples filtros aprendibles a la entrada.
 *
 * Dimensiones:
 * - Input:  (H, W, C_in)
 * - Filters: (K, K, C_in, numFilters)
 * - Output: (H', W', numFilters)
 *
 * Cada filtro aprende a detectar un patrón diferente.
 */
export class ConvLayer {
  private filters: number[][][][]; // (numFilters, C_in, K, K)
  private biases: number[];
  private config: Required<ConvLayerConfig>;

  /**
   * @param inputChannels - Número de canales de entrada
   * @param config - Configuración de la capa
   */
  constructor(inputChannels: number, config: ConvLayerConfig) {
    this.config = {
      numFilters: config.numFilters,
      kernelSize: config.kernelSize,
      stride: config.stride || 1,
      padding: config.padding || 0,
      activation: config.activation || 'relu',
    };

    // Inicializar filtros aleatoriamente
    this.filters = this.initializeFilters(inputChannels);
    this.biases = Array(this.config.numFilters).fill(0);
  }

  /**
   * Inicializa filtros con Xavier/He initialization
   */
  private initializeFilters(inputChannels: number): number[][][][] {
    const { numFilters, kernelSize } = this.config;
    const filters: number[][][][] = [];

    // He initialization: std = sqrt(2 / (K × K × C_in))
    const variance = 2 / (kernelSize * kernelSize * inputChannels);
    const stddev = Math.sqrt(variance);

    for (let f = 0; f < numFilters; f++) {
      const filter: number[][][] = [];
      for (let c = 0; c < inputChannels; c++) {
        const channel: number[][] = [];
        for (let i = 0; i < kernelSize; i++) {
          const row: number[] = [];
          for (let j = 0; j < kernelSize; j++) {
            // Random normal con He initialization
            row.push(this.randomNormal(0, stddev));
          }
          channel.push(row);
        }
        filter.push(channel);
      }
      filters.push(filter);
    }

    return filters;
  }

  /**
   * Genera número aleatorio con distribución normal
   */
  private randomNormal(mean: number = 0, stddev: number = 1): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stddev;
  }

  /**
   * Forward pass
   *
   * Para cada filtro:
   * 1. Convolucionar con cada canal de entrada
   * 2. Sumar resultados de todos los canales
   * 3. Añadir bias
   * 4. Aplicar activación
   *
   * @param input - Entrada 3D (H, W, C)
   * @returns Output 3D (H', W', numFilters)
   */
  forward(input: number[][][]): number[][][] {
    const inputHeight = input.length;
    const inputWidth = input[0].length;
    const inputChannels = input[0][0].length;

    const { numFilters, kernelSize, stride, padding } = this.config;

    // Calcular dimensiones de salida
    const outputHeight = computeOutputSize(
      inputHeight,
      kernelSize,
      stride,
      padding
    );
    const outputWidth = computeOutputSize(
      inputWidth,
      kernelSize,
      stride,
      padding
    );

    const output: number[][][] = Array(outputHeight)
      .fill(0)
      .map(() =>
        Array(outputWidth)
          .fill(0)
          .map(() => Array(numFilters).fill(0))
      );

    // Para cada filtro
    for (let f = 0; f < numFilters; f++) {
      // Para cada canal de entrada
      for (let c = 0; c < inputChannels; c++) {
        // Extraer canal 2D
        const channelInput = input.map(row => row.map(pixel => pixel[c]));

        // Convolucionar con este canal del filtro
        const convResult = convolve2D(
          channelInput,
          this.filters[f][c],
          stride,
          padding
        );

        // Acumular en output
        for (let i = 0; i < outputHeight; i++) {
          for (let j = 0; j < outputWidth; j++) {
            output[i][j][f] += convResult[i][j];
          }
        }
      }

      // Añadir bias y aplicar activación
      for (let i = 0; i < outputHeight; i++) {
        for (let j = 0; j < outputWidth; j++) {
          output[i][j][f] += this.biases[f];
          output[i][j][f] = this.activate(output[i][j][f]);
        }
      }
    }

    return output;
  }

  /**
   * Aplica función de activación
   */
  private activate(x: number): number {
    switch (this.config.activation) {
      case 'relu':
        return (relu(x) as number);
      case 'sigmoid':
        return (sigmoid(x) as number);
      default:
        return x;
    }
  }

  /**
   * Obtiene filtros aprendidos
   */
  getFilters(): number[][][][] {
    return this.filters.map(f =>
      f.map(c => c.map(row => [...row]))
    );
  }
}

// ============================================
// CNN SIMPLE
// ============================================

/**
 * CNN Simple para clasificación de imágenes
 *
 * Arquitectura:
 * Input (inputSize × inputSize)
 *   ↓
 * Conv1 (8 filters 3×3) + ReLU
 *   ↓
 * MaxPool (2×2)
 *   ↓
 * Conv2 (16 filters 3×3) + ReLU
 *   ↓
 * MaxPool (2×2)
 *   ↓
 * Global Average Pooling
 *   ↓
 * Output (numClasses)
 */
export class SimpleCNN {
  private conv1: ConvLayer;
  private conv2: ConvLayer;
  private outputWeights: number[];

  constructor(config: SimpleCNNConfig) {
    // Capa convolucional 1: 8 filtros 3×3
    this.conv1 = new ConvLayer(1, {
      numFilters: 8,
      kernelSize: 3,
      padding: 1,
      activation: 'relu',
    });

    // Capa convolucional 2: 16 filtros 3×3
    this.conv2 = new ConvLayer(8, {
      numFilters: 16,
      kernelSize: 3,
      padding: 1,
      activation: 'relu',
    });

    // Pesos para clasificación final (simplificado)
    this.outputWeights = Array(config.numClasses)
      .fill(0)
      .map(() => Math.random() - 0.5);
  }

  /**
   * Forward pass completo
   *
   * @param input - Imagen 2D
   * @returns Scores para cada clase
   */
  forward(input: number[][]): number[] {
    // Convertir a 3D (añadir canal)
    const input3D = input.map(row => row.map(val => [val]));

    // Conv1 + ReLU
    const conv1Out = this.conv1.forward(input3D);

    // MaxPool 2×2
    const pool1Out = this.applyPooling3D(conv1Out, 2);

    // Conv2 + ReLU
    const conv2Out = this.conv2.forward(pool1Out);

    // MaxPool 2×2
    const pool2Out = this.applyPooling3D(conv2Out, 2);

    // Global Average Pooling por canal
    const features: number[] = [];
    const numChannels = pool2Out[0][0].length;

    for (let c = 0; c < numChannels; c++) {
      const channel2D = pool2Out.map(row => row.map(pixel => pixel[c]));
      features.push(globalAvgPool2D(channel2D));
    }

    // Clasificación simple (debería ser fully connected)
    const scores = this.outputWeights.map((w, i) => {
      return features.reduce((sum, f) => sum + f * w, 0);
    });

    return scores;
  }

  /**
   * Aplica pooling a tensor 3D
   */
  private applyPooling3D(
    input: number[][][],
    poolSize: number
  ): number[][][] {
    const numChannels = input[0][0].length;
    const pooledChannels: number[][][] = [];

    // Pooling por canal
    for (let c = 0; c < numChannels; c++) {
      const channel2D = input.map(row => row.map(pixel => pixel[c]));
      const pooled = maxPool2D(channel2D, poolSize);
      pooledChannels.push(pooled);
    }

    // Reorganizar de (C, H, W) a (H, W, C)
    const height = pooledChannels[0].length;
    const width = pooledChannels[0][0].length;

    const output: number[][][] = Array(height)
      .fill(0)
      .map(() =>
        Array(width)
          .fill(0)
          .map(() => Array(numChannels).fill(0))
      );

    for (let c = 0; c < numChannels; c++) {
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          output[i][j][c] = pooledChannels[c][i][j];
        }
      }
    }

    return output;
  }

  /**
   * Predice clase
   */
  predict(input: number[][]): number {
    const scores = this.forward(input);
    let maxIdx = 0;
    let maxScore = scores[0];

    for (let i = 1; i < scores.length; i++) {
      if (scores[i] > maxScore) {
        maxScore = scores[i];
        maxIdx = i;
      }
    }

    return maxIdx;
  }

  /**
   * Predice probabilidades (softmax)
   */
  predictProba(input: number[][]): number[] {
    const scores = this.forward(input);

    // Softmax
    const expScores = scores.map(s => Math.exp(s));
    const sumExp = expScores.reduce((a, b) => a + b, 0);

    return expScores.map(e => e / sumExp);
  }
}

// ============================================
// EJEMPLO DE USO
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 13: CNN para Visión ===\n');

  // Ejemplo 1: Detección de bordes
  console.log('1. Detección de Bordes');
  console.log('----------------------');

  const testImage = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ];

  console.log('Imagen original:');
  testImage.forEach(row => console.log(row.join(' ')));

  const edgesV = convolve2D(testImage, KERNELS.EDGE_VERTICAL);
  console.log('\nBordes verticales:');
  edgesV.forEach(row =>
    console.log(row.map(v => v.toFixed(1).padStart(5)).join(' '))
  );

  // Ejemplo 2: Pooling
  console.log('\n\n2. Max Pooling');
  console.log('--------------');

  const poolInput = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ];

  console.log('Input:');
  poolInput.forEach(row => console.log(row.join('  ')));

  const pooled = maxPool2D(poolInput, 2);
  console.log('\nMax Pool 2×2:');
  pooled.forEach(row => console.log(row.join('  ')));

  // Ejemplo 3: Capa convolucional
  console.log('\n\n3. Capa Convolucional');
  console.log('---------------------');

  const conv = new ConvLayer(1, {
    numFilters: 3,
    kernelSize: 3,
    padding: 1,
    activation: 'relu',
  });

  const input3D = testImage.map(row => row.map(val => [val]));
  const output3D = conv.forward(input3D);

  console.log(`Input shape: ${testImage.length}×${testImage[0].length}×1`);
  console.log(
    `Output shape: ${output3D.length}×${output3D[0].length}×${output3D[0][0].length}`
  );
  console.log('(3 feature maps generados)');

  console.log('\n=== Fin del ejemplo ===');
}
