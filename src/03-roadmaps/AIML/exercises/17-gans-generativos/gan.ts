/**
 * Ejercicio 17: GANs Generativos
 *
 * Implementación de Generative Adversarial Networks desde cero,
 * incluyendo generador, discriminador y entrenamiento adversarial.
 */

// ============================================
// TIPOS E INTERFACES
// ============================================

/**
 * Configuración de GAN
 */
export interface GANConfig {
  noiseSize: number;
  dataSize: number;
  generatorHidden: number[];
  discriminatorHidden: number[];
}

/**
 * Configuración de entrenamiento
 */
export interface TrainingConfig {
  epochs: number;
  batchSize?: number;
  learningRateG: number;
  learningRateD: number;
  kSteps?: number; // Veces a entrenar D por cada G
  verbose?: boolean;
  labelSmoothing?: boolean;
}

/**
 * Historial de entrenamiento
 */
export interface TrainingHistory {
  lossG: number[];
  lossD: number[];
  epochs: number;
  trainTime: number;
}

// ============================================
// FUNCIONES DE ACTIVACIÓN
// ============================================

/**
 * ReLU y su derivada
 */
function relu(x: number): number {
  return Math.max(0, x);
}

function reluDerivative(x: number): number {
  return x > 0 ? 1 : 0;
}

/**
 * Leaky ReLU y su derivada
 * Más común en GANs para evitar dying neurons
 */
function leakyRelu(x: number, alpha: number = 0.2): number {
  return x > 0 ? x : alpha * x;
}

function leakyReluDerivative(x: number, alpha: number = 0.2): number {
  return x > 0 ? 1 : alpha;
}

/**
 * Sigmoid y su derivada
 */
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function sigmoidDerivative(x: number): number {
  const s = sigmoid(x);
  return s * (1 - s);
}

/**
 * Tanh y su derivada
 * Útil en generador para output en [-1, 1]
 */
function tanh(x: number): number {
  return Math.tanh(x);
}

function tanhDerivative(x: number): number {
  const t = tanh(x);
  return 1 - t * t;
}

// ============================================
// GENERADOR
// ============================================

/**
 * Generador
 *
 * Toma vector de ruido z y genera datos falsos.
 *
 * Arquitectura:
 * z (noiseSize) → Hidden → ... → Hidden → output (dataSize)
 *
 * Objetivo: Generar datos que engañen al discriminador
 */
export class Generator {
  private weights: number[][][];
  private biases: number[][];
  private inputSize: number;
  private outputSize: number;
  private hiddenSizes: number[];

  /**
   * @param inputSize - Dimensión del ruido de entrada
   * @param outputSize - Dimensión de los datos generados
   * @param hiddenSizes - Tamaños de capas ocultas
   */
  constructor(
    inputSize: number,
    outputSize: number,
    hiddenSizes: number[] = [128, 256]
  ) {
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    this.hiddenSizes = hiddenSizes;

    // Inicializar pesos y biases
    this.weights = [];
    this.biases = [];

    const layerSizes = [inputSize, ...hiddenSizes, outputSize];

    for (let i = 0; i < layerSizes.length - 1; i++) {
      const inputDim = layerSizes[i];
      const outputDim = layerSizes[i + 1];

      // Xavier initialization
      const limit = Math.sqrt(6 / (inputDim + outputDim));

      const layerWeights: number[][] = [];
      for (let j = 0; j < outputDim; j++) {
        const row: number[] = [];
        for (let k = 0; k < inputDim; k++) {
          row.push(Math.random() * 2 * limit - limit);
        }
        layerWeights.push(row);
      }

      const layerBiases = Array(outputDim).fill(0);

      this.weights.push(layerWeights);
      this.biases.push(layerBiases);
    }
  }

  /**
   * Forward pass
   *
   * @param noise - Vector de ruido
   * @returns Datos generados
   */
  forward(noise: number[]): number[] {
    let activation = noise;

    // Forward a través de capas ocultas
    for (let i = 0; i < this.weights.length - 1; i++) {
      activation = this.forwardLayer(activation, this.weights[i], this.biases[i]);
      // LeakyReLU en capas ocultas
      activation = activation.map(x => leakyRelu(x));
    }

    // Última capa: Tanh para output en [-1, 1]
    const lastIdx = this.weights.length - 1;
    activation = this.forwardLayer(
      activation,
      this.weights[lastIdx],
      this.biases[lastIdx]
    );
    activation = activation.map(x => tanh(x));

    return activation;
  }

  /**
   * Forward de una capa
   */
  private forwardLayer(
    input: number[],
    weights: number[][],
    biases: number[]
  ): number[] {
    const output: number[] = [];

    for (let i = 0; i < weights.length; i++) {
      let sum = biases[i];
      for (let j = 0; j < input.length; j++) {
        sum += weights[i][j] * input[j];
      }
      output.push(sum);
    }

    return output;
  }

  /**
   * Obtiene parámetros
   */
  getParameters(): { weights: number[][][]; biases: number[][] } {
    return {
      weights: this.weights.map(w => w.map(row => [...row])),
      biases: this.biases.map(b => [...b]),
    };
  }

  /**
   * Establece parámetros
   */
  setParameters(params: { weights: number[][][]; biases: number[][] }): void {
    this.weights = params.weights.map(w => w.map(row => [...row]));
    this.biases = params.biases.map(b => [...b]);
  }

  /**
   * Actualiza parámetros con gradientes
   */
  updateParameters(
    gradients: { weights: number[][][]; biases: number[][] },
    learningRate: number
  ): void {
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        for (let k = 0; k < this.weights[i][j].length; k++) {
          this.weights[i][j][k] -= learningRate * gradients.weights[i][j][k];
        }
      }

      for (let j = 0; j < this.biases[i].length; j++) {
        this.biases[i][j] -= learningRate * gradients.biases[i][j];
      }
    }
  }
}

// ============================================
// DISCRIMINADOR
// ============================================

/**
 * Discriminador
 *
 * Clasifica datos como reales o falsos.
 *
 * Arquitectura:
 * x (dataSize) → Hidden → ... → Hidden → output (1)
 *
 * Output: Probabilidad de que input sea real [0, 1]
 */
export class Discriminator {
  private weights: number[][][];
  private biases: number[][];
  private inputSize: number;
  private hiddenSizes: number[];

  constructor(inputSize: number, hiddenSizes: number[] = [256, 128]) {
    this.inputSize = inputSize;
    this.hiddenSizes = hiddenSizes;

    this.weights = [];
    this.biases = [];

    const layerSizes = [inputSize, ...hiddenSizes, 1];

    for (let i = 0; i < layerSizes.length - 1; i++) {
      const inputDim = layerSizes[i];
      const outputDim = layerSizes[i + 1];

      const limit = Math.sqrt(6 / (inputDim + outputDim));

      const layerWeights: number[][] = [];
      for (let j = 0; j < outputDim; j++) {
        const row: number[] = [];
        for (let k = 0; k < inputDim; k++) {
          row.push(Math.random() * 2 * limit - limit);
        }
        layerWeights.push(row);
      }

      const layerBiases = Array(outputDim).fill(0);

      this.weights.push(layerWeights);
      this.biases.push(layerBiases);
    }
  }

  /**
   * Forward pass
   *
   * @param input - Datos a clasificar
   * @returns Probabilidad de ser real [0, 1]
   */
  forward(input: number[]): number {
    let activation = input;

    // Forward a través de capas ocultas
    for (let i = 0; i < this.weights.length - 1; i++) {
      activation = this.forwardLayer(activation, this.weights[i], this.biases[i]);
      // LeakyReLU en capas ocultas
      activation = activation.map(x => leakyRelu(x));
    }

    // Última capa: Sigmoid para probabilidad
    const lastIdx = this.weights.length - 1;
    activation = this.forwardLayer(
      activation,
      this.weights[lastIdx],
      this.biases[lastIdx]
    );

    return sigmoid(activation[0]);
  }

  private forwardLayer(
    input: number[],
    weights: number[][],
    biases: number[]
  ): number[] {
    const output: number[] = [];

    for (let i = 0; i < weights.length; i++) {
      let sum = biases[i];
      for (let j = 0; j < input.length; j++) {
        sum += weights[i][j] * input[j];
      }
      output.push(sum);
    }

    return output;
  }

  getParameters(): { weights: number[][][]; biases: number[][] } {
    return {
      weights: this.weights.map(w => w.map(row => [...row])),
      biases: this.biases.map(b => [...b]),
    };
  }

  setParameters(params: { weights: number[][][]; biases: number[][] }): void {
    this.weights = params.weights.map(w => w.map(row => [...row]));
    this.biases = params.biases.map(b => [...b]);
  }

  updateParameters(
    gradients: { weights: number[][][]; biases: number[][] },
    learningRate: number
  ): void {
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        for (let k = 0; k < this.weights[i][j].length; k++) {
          this.weights[i][j][k] -= learningRate * gradients.weights[i][j][k];
        }
      }

      for (let j = 0; j < this.biases[i].length; j++) {
        this.biases[i][j] -= learningRate * gradients.biases[i][j];
      }
    }
  }
}

// ============================================
// GAN COMPLETA
// ============================================

/**
 * Generative Adversarial Network
 *
 * Combina generador y discriminador en entrenamiento adversarial.
 */
export class GAN {
  private generator: Generator;
  private discriminator: Discriminator;
  private config: GANConfig;

  constructor(config: GANConfig) {
    this.config = config;

    this.generator = new Generator(
      config.noiseSize,
      config.dataSize,
      config.generatorHidden
    );

    this.discriminator = new Discriminator(
      config.dataSize,
      config.discriminatorHidden
    );
  }

  /**
   * Entrena la GAN
   *
   * Alternando entre:
   * 1. Entrenar discriminador (k veces)
   * 2. Entrenar generador (1 vez)
   */
  train(realData: number[][], config: TrainingConfig): TrainingHistory {
    const startTime = Date.now();
    const history: TrainingHistory = {
      lossG: [],
      lossD: [],
      epochs: config.epochs,
      trainTime: 0,
    };

    const batchSize = config.batchSize || 32;
    const kSteps = config.kSteps || 1;

    for (let epoch = 0; epoch < config.epochs; epoch++) {
      let totalLossD = 0;
      let totalLossG = 0;
      let batchCount = 0;

      // Mezclar datos
      const shuffled = this.shuffle(realData);

      for (let i = 0; i < shuffled.length; i += batchSize) {
        const batch = shuffled.slice(i, i + batchSize);

        // Entrenar discriminador k veces
        for (let k = 0; k < kSteps; k++) {
          const lossD = this.trainDiscriminatorStep(
            batch,
            config.learningRateD,
            config.labelSmoothing
          );
          totalLossD += lossD;
        }

        // Entrenar generador 1 vez
        const lossG = this.trainGeneratorStep(batch.length, config.learningRateG);
        totalLossG += lossG;

        batchCount++;
      }

      const avgLossD = totalLossD / (batchCount * kSteps);
      const avgLossG = totalLossG / batchCount;

      history.lossD.push(avgLossD);
      history.lossG.push(avgLossG);

      if (config.verbose && (epoch % 10 === 0 || epoch === config.epochs - 1)) {
        console.log(
          `Epoch ${epoch + 1}/${config.epochs} - ` +
          `D Loss: ${avgLossD.toFixed(4)}, G Loss: ${avgLossG.toFixed(4)}`
        );
      }
    }

    history.trainTime = Date.now() - startTime;
    return history;
  }

  /**
   * Paso de entrenamiento del discriminador
   *
   * Objetivo: Maximizar log(D(x)) + log(1 - D(G(z)))
   */
  private trainDiscriminatorStep(
    realBatch: number[][],
    learningRate: number,
    labelSmoothing: boolean = false
  ): number {
    const batchSize = realBatch.length;
    let totalLoss = 0;

    // Label smoothing: usar 0.9 en vez de 1.0 para reales
    const realLabel = labelSmoothing ? 0.9 : 1.0;

    // Generar datos falsos
    const fakeBatch: number[][] = [];
    for (let i = 0; i < batchSize; i++) {
      const noise = generateNoise(this.config.noiseSize);
      fakeBatch.push(this.generator.forward(noise));
    }

    // Calcular loss y gradientes
    const gradientsW: number[][][] = this.discriminator
      .getParameters()
      .weights.map(w => w.map(row => Array(row.length).fill(0)));
    const gradientsB: number[][] = this.discriminator
      .getParameters()
      .biases.map(b => Array(b.length).fill(0));

    // Loss en datos reales
    for (const real of realBatch) {
      const predReal = this.discriminator.forward(real);
      const lossReal = -Math.log(predReal + 1e-10);
      totalLoss += lossReal;

      // Gradiente simplificado (aproximación)
      const error = predReal - realLabel;
      this.accumulateGradients(gradientsW, gradientsB, real, error);
    }

    // Loss en datos falsos
    for (const fake of fakeBatch) {
      const predFake = this.discriminator.forward(fake);
      const lossFake = -Math.log(1 - predFake + 1e-10);
      totalLoss += lossFake;

      // Gradiente simplificado
      const error = predFake; // target = 0
      this.accumulateGradients(gradientsW, gradientsB, fake, error);
    }

    // Actualizar discriminador
    this.discriminator.updateParameters(
      {
        weights: gradientsW.map(w => w.map(row => row.map(v => v / batchSize))),
        biases: gradientsB.map(b => b.map(v => v / batchSize)),
      },
      learningRate
    );

    return totalLoss / (batchSize * 2);
  }

  /**
   * Paso de entrenamiento del generador
   *
   * Objetivo: Minimizar log(1 - D(G(z)))
   * O equivalentemente: Maximizar log(D(G(z)))
   */
  private trainGeneratorStep(batchSize: number, learningRate: number): number {
    let totalLoss = 0;

    const gradientsW: number[][][] = this.generator
      .getParameters()
      .weights.map(w => w.map(row => Array(row.length).fill(0)));
    const gradientsB: number[][] = this.generator
      .getParameters()
      .biases.map(b => Array(b.length).fill(0));

    for (let i = 0; i < batchSize; i++) {
      const noise = generateNoise(this.config.noiseSize);
      const fakeData = this.generator.forward(noise);
      const predFake = this.discriminator.forward(fakeData);

      // Loss: -log(D(G(z)))
      const loss = -Math.log(predFake + 1e-10);
      totalLoss += loss;

      // Gradiente simplificado
      // En práctica, necesitarías backprop completo a través de D
      const error = predFake - 1; // queremos predFake = 1
      this.accumulateGradients(gradientsW, gradientsB, noise, error * 0.1);
    }

    // Actualizar generador
    this.generator.updateParameters(
      {
        weights: gradientsW.map(w => w.map(row => row.map(v => v / batchSize))),
        biases: gradientsB.map(b => b.map(v => v / batchSize)),
      },
      learningRate
    );

    return totalLoss / batchSize;
  }

  /**
   * Acumula gradientes (simplificado)
   */
  private accumulateGradients(
    gradientsW: number[][][],
    gradientsB: number[][],
    input: number[],
    error: number
  ): void {
    // Versión simplificada: gradiente aproximado
    // En producción, usarías backpropagation completo

    for (let i = 0; i < gradientsW.length; i++) {
      for (let j = 0; j < gradientsW[i].length; j++) {
        gradientsB[i][j] += error;

        const inputIdx = Math.min(j, input.length - 1);
        for (let k = 0; k < gradientsW[i][j].length; k++) {
          gradientsW[i][j][k] += error * input[inputIdx];
        }
      }
    }
  }

  /**
   * Mezcla array aleatoriamente
   */
  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Genera muestras sintéticas
   */
  generate(numSamples: number): number[][] {
    const samples: number[][] = [];

    for (let i = 0; i < numSamples; i++) {
      const noise = generateNoise(this.config.noiseSize);
      const generated = this.generator.forward(noise);
      samples.push(generated);
    }

    return samples;
  }

  /**
   * Evalúa rendimiento del discriminador
   */
  evaluateDiscriminator(
    realData: number[][],
    fakeData: number[][]
  ): {
    accuracyReal: number;
    accuracyFake: number;
    averageConfidence: number;
  } {
    let correctReal = 0;
    let correctFake = 0;
    let totalConfidence = 0;

    // Evaluar en datos reales
    for (const real of realData) {
      const pred = this.discriminator.forward(real);
      if (pred > 0.5) correctReal++;
      totalConfidence += pred;
    }

    // Evaluar en datos falsos
    for (const fake of fakeData) {
      const pred = this.discriminator.forward(fake);
      if (pred <= 0.5) correctFake++;
      totalConfidence += 1 - pred; // confianza en clasificación correcta
    }

    return {
      accuracyReal: correctReal / realData.length,
      accuracyFake: correctFake / fakeData.length,
      averageConfidence: totalConfidence / (realData.length + fakeData.length),
    };
  }

  /**
   * Detecta mode collapse
   *
   * Mode collapse: Generador produce siempre outputs similares
   */
  detectModeCollapse(generatedSamples: number[][]): {
    collapsed: boolean;
    diversity: number;
  } {
    if (generatedSamples.length < 2) {
      return { collapsed: false, diversity: 1.0 };
    }

    // Calcular diversidad promedio (distancia entre muestras)
    let totalDistance = 0;
    let comparisons = 0;

    for (let i = 0; i < generatedSamples.length; i++) {
      for (let j = i + 1; j < Math.min(i + 10, generatedSamples.length); j++) {
        const dist = this.euclideanDistance(
          generatedSamples[i],
          generatedSamples[j]
        );
        totalDistance += dist;
        comparisons++;
      }
    }

    const avgDistance = totalDistance / comparisons;

    // Normalizar diversidad (aproximado)
    const maxPossibleDistance = Math.sqrt(generatedSamples[0].length) * 2;
    const diversity = Math.min(1.0, avgDistance / maxPossibleDistance);

    // Threshold arbitrario: diversidad < 0.1 indica collapse
    const collapsed = diversity < 0.1;

    return { collapsed, diversity };
  }

  /**
   * Distancia euclidiana
   */
  private euclideanDistance(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += (a[i] - b[i]) ** 2;
    }
    return Math.sqrt(sum);
  }
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Genera vector de ruido
 *
 * @param size - Dimensión del vector
 * @param distribution - Distribución ('normal' o 'uniform')
 * @returns Vector de ruido
 */
export function generateNoise(
  size: number,
  distribution: 'normal' | 'uniform' = 'normal'
): number[] {
  const noise: number[] = [];

  if (distribution === 'normal') {
    // Distribución normal N(0, 1)
    for (let i = 0; i < size; i++) {
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      noise.push(z);
    }
  } else {
    // Distribución uniforme [-1, 1]
    for (let i = 0; i < size; i++) {
      noise.push(Math.random() * 2 - 1);
    }
  }

  return noise;
}

/**
 * Interpola entre dos vectores en espacio latente
 *
 * Útil para visualizar transiciones suaves entre generaciones
 */
export function interpolate(
  z1: number[],
  z2: number[],
  steps: number = 10
): number[][] {
  const interpolated: number[][] = [];

  for (let i = 0; i < steps; i++) {
    const alpha = i / (steps - 1);
    const z: number[] = [];

    for (let j = 0; j < z1.length; j++) {
      z.push((1 - alpha) * z1[j] + alpha * z2[j]);
    }

    interpolated.push(z);
  }

  return interpolated;
}

/**
 * Visualiza progreso del entrenamiento (consola)
 */
export function visualizeProgress(history: TrainingHistory): void {
  console.log('\n=== Training Progress ===');
  console.log(`Total epochs: ${history.epochs}`);
  console.log(`Training time: ${history.trainTime}ms`);

  console.log('\nLoss evolution:');
  const step = Math.max(1, Math.floor(history.epochs / 10));

  for (let i = 0; i < history.epochs; i += step) {
    const epoch = i + 1;
    const lossD = history.lossD[i].toFixed(4);
    const lossG = history.lossG[i].toFixed(4);

    console.log(`Epoch ${epoch.toString().padStart(3)}: D=${lossD}, G=${lossG}`);
  }

  // Último epoch
  if (history.epochs > 0) {
    const lastIdx = history.epochs - 1;
    console.log(
      `Epoch ${history.epochs}: ` +
      `D=${history.lossD[lastIdx].toFixed(4)}, ` +
      `G=${history.lossG[lastIdx].toFixed(4)}`
    );
  }
}

// ============================================
// EJEMPLO DE USO
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 17: GANs Generativos ===\n');

  // Ejemplo 1: Generación de ruido
  console.log('1. Generación de Ruido');
  console.log('----------------------');

  const noiseNormal = generateNoise(10, 'normal');
  const noiseUniform = generateNoise(10, 'uniform');

  console.log('Ruido normal (primeros 5):');
  console.log(noiseNormal.slice(0, 5).map(n => n.toFixed(3)).join(', '));
  console.log('\nRuido uniforme (primeros 5):');
  console.log(noiseUniform.slice(0, 5).map(n => n.toFixed(3)).join(', '));

  // Ejemplo 2: Generador simple
  console.log('\n\n2. Generador');
  console.log('------------');

  const generator = new Generator(10, 20, [128]);
  const noise = generateNoise(10);
  const generated = generator.forward(noise);

  console.log(`Input noise: ${noise.length}D`);
  console.log(`Output data: ${generated.length}D`);
  console.log(`Output range: [${Math.min(...generated).toFixed(3)}, ${Math.max(...generated).toFixed(3)}]`);

  // Ejemplo 3: Discriminador
  console.log('\n\n3. Discriminador');
  console.log('----------------');

  const discriminator = new Discriminator(20, [128]);

  const realData = Array(20).fill(0.5);
  const fakeData = generated;

  const probReal = discriminator.forward(realData);
  const probFake = discriminator.forward(fakeData);

  console.log(`P(real | real data): ${probReal.toFixed(3)}`);
  console.log(`P(real | fake data): ${probFake.toFixed(3)}`);

  // Ejemplo 4: GAN completa
  console.log('\n\n4. GAN Completa');
  console.log('---------------');

  // Dataset sintético simple
  const realDataset: number[][] = [];
  for (let i = 0; i < 100; i++) {
    const sample: number[] = [];
    for (let j = 0; j < 10; j++) {
      sample.push(Math.sin(i * 0.1 + j) * 0.5);
    }
    realDataset.push(sample);
  }

  const gan = new GAN({
    noiseSize: 20,
    dataSize: 10,
    generatorHidden: [64, 32],
    discriminatorHidden: [32, 64],
  });

  console.log('Entrenando GAN...');
  const history = gan.train(realDataset, {
    epochs: 50,
    batchSize: 16,
    learningRateG: 0.0002,
    learningRateD: 0.0002,
    kSteps: 1,
    verbose: false,
  });

  console.log(`\nEntrenamiento completado en ${history.trainTime}ms`);
  console.log(`D Loss final: ${history.lossD[history.lossD.length - 1].toFixed(4)}`);
  console.log(`G Loss final: ${history.lossG[history.lossG.length - 1].toFixed(4)}`);

  // Generar muestras
  const samples = gan.generate(10);
  console.log(`\nGeneradas ${samples.length} muestras sintéticas`);

  // Evaluar
  const evaluation = gan.evaluateDiscriminator(
    realDataset.slice(0, 20),
    samples
  );
  console.log(`\nAccuracy en datos reales: ${(evaluation.accuracyReal * 100).toFixed(2)}%`);
  console.log(`Accuracy en datos falsos: ${(evaluation.accuracyFake * 100).toFixed(2)}%`);

  // Detectar mode collapse
  const moreSamples = gan.generate(50);
  const collapseCheck = gan.detectModeCollapse(moreSamples);
  console.log(`\nMode collapse: ${collapseCheck.collapsed ? 'Sí' : 'No'}`);
  console.log(`Diversidad: ${(collapseCheck.diversity * 100).toFixed(2)}%`);

  // Ejemplo 5: Interpolación
  console.log('\n\n5. Interpolación en Espacio Latente');
  console.log('------------------------------------');

  const z1 = generateNoise(20);
  const z2 = generateNoise(20);
  const interpolated = interpolate(z1, z2, 5);

  console.log(`Interpolando entre 2 puntos en ${interpolated.length} pasos`);
  console.log(`Cada punto: ${interpolated[0].length}D`);

  console.log('\n=== Fin del ejemplo ===');
}
