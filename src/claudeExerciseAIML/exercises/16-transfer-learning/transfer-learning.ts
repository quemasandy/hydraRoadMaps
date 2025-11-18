/**
 * Ejercicio 16: Transfer Learning
 *
 * Implementación de técnicas de Transfer Learning incluyendo
 * feature extraction y fine-tuning con modelos pre-entrenados.
 */

// ============================================
// TIPOS E INTERFACES
// ============================================

/**
 * Configuración de entrenamiento
 */
export interface TrainingConfig {
  epochs: number;
  learningRate: number;
  batchSize?: number;
  verbose?: boolean;
}

/**
 * Configuración de fine-tuning
 */
export interface FineTuningConfig extends TrainingConfig {
  layerLearningRates?: Map<string, number>;
  warmupEpochs?: number;
}

/**
 * Historial de entrenamiento
 */
export interface TrainingHistory {
  loss: number[];
  accuracy: number[];
  epochs: number;
  trainTime: number;
}

/**
 * Capa de red neuronal
 */
interface Layer {
  name: string;
  weights: number[][];
  frozen: boolean;
  outputSize: number;
}

// ============================================
// MODELO PRE-ENTRENADO
// ============================================

/**
 * Modelo Pre-entrenado Simulado
 *
 * Simula un modelo pre-entrenado en un dataset grande
 * (como ImageNet). En producción, esto se cargaría desde
 * un archivo con pesos reales.
 *
 * Arquitecturas:
 * - 'simple': 2 capas (rápido)
 * - 'medium': 4 capas (balanceado)
 * - 'deep': 8 capas (más expresivo)
 */
export class PretrainedModel {
  private layers: Layer[];
  private architecture: string;
  private featureSize: number;

  /**
   * @param architecture - Tipo de arquitectura
   * @param inputSize - Dimensión de entrada
   */
  constructor(architecture: string = 'medium', inputSize: number = 784) {
    this.architecture = architecture;
    this.layers = [];

    // Crear capas según arquitectura
    switch (architecture) {
      case 'simple':
        this.layers = this.createSimpleArchitecture(inputSize);
        break;
      case 'medium':
        this.layers = this.createMediumArchitecture(inputSize);
        break;
      case 'deep':
        this.layers = this.createDeepArchitecture(inputSize);
        break;
      default:
        throw new Error(`Unknown architecture: ${architecture}`);
    }

    this.featureSize = this.layers[this.layers.length - 1].outputSize;
  }

  /**
   * Arquitectura simple: 2 capas
   */
  private createSimpleArchitecture(inputSize: number): Layer[] {
    return [
      this.createLayer('layer1', inputSize, 128),
      this.createLayer('layer2', 128, 64),
    ];
  }

  /**
   * Arquitectura media: 4 capas
   */
  private createMediumArchitecture(inputSize: number): Layer[] {
    return [
      this.createLayer('layer1', inputSize, 256),
      this.createLayer('layer2', 256, 128),
      this.createLayer('layer3', 128, 64),
      this.createLayer('layer4', 64, 32),
    ];
  }

  /**
   * Arquitectura profunda: 8 capas
   */
  private createDeepArchitecture(inputSize: number): Layer[] {
    return [
      this.createLayer('layer1', inputSize, 512),
      this.createLayer('layer2', 512, 256),
      this.createLayer('layer3', 256, 256),
      this.createLayer('layer4', 256, 128),
      this.createLayer('layer5', 128, 128),
      this.createLayer('layer6', 128, 64),
      this.createLayer('layer7', 64, 32),
      this.createLayer('layer8', 32, 16),
    ];
  }

  /**
   * Crea capa con pesos "pre-entrenados"
   *
   * En modelo real, estos serían cargados desde archivo.
   * Aquí simulamos con valores que ya han "aprendido" patterns.
   */
  private createLayer(
    name: string,
    inputSize: number,
    outputSize: number
  ): Layer {
    // Inicialización que simula pesos pre-entrenados
    // (en realidad usamos He initialization)
    const variance = 2 / inputSize;
    const stddev = Math.sqrt(variance);

    const weights: number[][] = [];
    for (let i = 0; i < outputSize; i++) {
      const row: number[] = [];
      for (let j = 0; j < inputSize; j++) {
        row.push(this.randomNormal(0, stddev));
      }
      weights.push(row);
    }

    return {
      name,
      weights,
      frozen: false,
      outputSize,
    };
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
   * Extrae features de la entrada
   *
   * Forward pass por todas las capas hasta obtener
   * representación de alto nivel.
   *
   * @param input - Input flattened (1D)
   * @returns Features extraídos
   */
  extractFeatures(input: number[]): number[] {
    let activation = input;

    // Forward pass por cada capa
    for (const layer of this.layers) {
      activation = this.forwardLayer(layer, activation);
    }

    return activation;
  }

  /**
   * Forward pass de una capa
   */
  private forwardLayer(layer: Layer, input: number[]): number[] {
    const output: number[] = [];

    for (let i = 0; i < layer.outputSize; i++) {
      let sum = 0;
      for (let j = 0; j < input.length; j++) {
        sum += layer.weights[i][j] * input[j];
      }
      // ReLU activation
      output.push(Math.max(0, sum));
    }

    return output;
  }

  /**
   * Congela todas las capas
   *
   * Capas congeladas no se actualizan durante entrenamiento.
   * Útil para feature extraction.
   */
  freeze(): void {
    for (const layer of this.layers) {
      layer.frozen = true;
    }
  }

  /**
   * Descongela capas específicas o todas
   *
   * @param layerNames - Nombres de capas a descongelar (opcional)
   */
  unfreeze(layerNames?: string[]): void {
    if (!layerNames) {
      // Descongelar todas
      for (const layer of this.layers) {
        layer.frozen = false;
      }
    } else {
      // Descongelar solo las especificadas
      for (const layer of this.layers) {
        if (layerNames.includes(layer.name)) {
          layer.frozen = false;
        }
      }
    }
  }

  /**
   * Obtiene nombres de todas las capas
   */
  getLayerNames(): string[] {
    return this.layers.map(l => l.name);
  }

  /**
   * Verifica si una capa está congelada
   */
  isFrozen(layerName: string): boolean {
    const layer = this.layers.find(l => l.name === layerName);
    return layer ? layer.frozen : false;
  }

  /**
   * Obtiene tamaño de features de salida
   */
  getFeatureSize(): number {
    return this.featureSize;
  }

  /**
   * Obtiene número total de capas
   */
  getNumLayers(): number {
    return this.layers.length;
  }
}

// ============================================
// FEATURE EXTRACTION
// ============================================

/**
 * Feature Extractor
 *
 * Estrategia: Congelar modelo base completamente,
 * entrenar solo clasificador nuevo.
 *
 * Ventajas:
 * - Muy rápido
 * - Previene overfitting
 * - Funciona con datasets pequeños
 *
 * Cuándo usar:
 * - Dataset pequeño (<1000 ejemplos)
 * - Tarea similar al pre-entrenamiento
 */
export class FeatureExtractor {
  private baseModel: PretrainedModel;
  private classifier: number[][]; // Pesos del clasificador
  private numClasses: number;

  constructor(baseModel: PretrainedModel, numClasses: number) {
    this.baseModel = baseModel;
    this.numClasses = numClasses;

    // Congelar base model
    this.baseModel.freeze();

    // Inicializar clasificador nuevo
    const featureSize = this.baseModel.getFeatureSize();
    this.classifier = this.initializeClassifier(featureSize, numClasses);
  }

  /**
   * Inicializa pesos del clasificador
   */
  private initializeClassifier(
    inputSize: number,
    outputSize: number
  ): number[][] {
    const weights: number[][] = [];
    const stddev = Math.sqrt(2 / inputSize);

    for (let i = 0; i < outputSize; i++) {
      const row: number[] = [];
      for (let j = 0; j < inputSize; j++) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        row.push(z * stddev);
      }
      weights.push(row);
    }

    return weights;
  }

  /**
   * Entrena el clasificador
   *
   * Solo actualiza pesos del clasificador,
   * base model permanece congelado.
   */
  train(
    X: number[][],
    y: number[],
    config: TrainingConfig
  ): TrainingHistory {
    const startTime = Date.now();
    const history: TrainingHistory = {
      loss: [],
      accuracy: [],
      epochs: config.epochs,
      trainTime: 0,
    };

    for (let epoch = 0; epoch < config.epochs; epoch++) {
      let totalLoss = 0;
      let correct = 0;

      // Mini-batch gradient descent
      for (let i = 0; i < X.length; i++) {
        // 1. Extract features (frozen)
        const features = this.baseModel.extractFeatures(X[i]);

        // 2. Forward pass clasificador
        const scores = this.forwardClassifier(features);
        const probas = this.softmax(scores);

        // 3. Calcular loss
        const loss = -Math.log(probas[y[i]] + 1e-10);
        totalLoss += loss;

        // 4. Verificar predicción
        const predicted = this.argmax(probas);
        if (predicted === y[i]) correct++;

        // 5. Backprop solo en clasificador
        this.updateClassifier(features, probas, y[i], config.learningRate);
      }

      const avgLoss = totalLoss / X.length;
      const accuracy = correct / X.length;

      history.loss.push(avgLoss);
      history.accuracy.push(accuracy);

      if (config.verbose && (epoch % 10 === 0 || epoch === config.epochs - 1)) {
        console.log(
          `Epoch ${epoch + 1}/${config.epochs} - ` +
          `Loss: ${avgLoss.toFixed(4)}, Accuracy: ${(accuracy * 100).toFixed(2)}%`
        );
      }
    }

    history.trainTime = Date.now() - startTime;
    return history;
  }

  /**
   * Forward pass del clasificador
   */
  private forwardClassifier(features: number[]): number[] {
    const scores: number[] = [];

    for (let i = 0; i < this.numClasses; i++) {
      let sum = 0;
      for (let j = 0; j < features.length; j++) {
        sum += this.classifier[i][j] * features[j];
      }
      scores.push(sum);
    }

    return scores;
  }

  /**
   * Softmax para convertir scores a probabilidades
   */
  private softmax(scores: number[]): number[] {
    const maxScore = Math.max(...scores);
    const expScores = scores.map(s => Math.exp(s - maxScore));
    const sumExp = expScores.reduce((a, b) => a + b, 0);
    return expScores.map(e => e / sumExp);
  }

  /**
   * Encuentra índice del máximo
   */
  private argmax(arr: number[]): number {
    let maxIdx = 0;
    let maxVal = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > maxVal) {
        maxVal = arr[i];
        maxIdx = i;
      }
    }
    return maxIdx;
  }

  /**
   * Actualiza pesos del clasificador
   */
  private updateClassifier(
    features: number[],
    probas: number[],
    trueLabel: number,
    lr: number
  ): void {
    // Gradient = (proba - 1_true) × features
    for (let i = 0; i < this.numClasses; i++) {
      const error = probas[i] - (i === trueLabel ? 1 : 0);

      for (let j = 0; j < features.length; j++) {
        this.classifier[i][j] -= lr * error * features[j];
      }
    }
  }

  /**
   * Predice clase
   */
  predict(input: number[]): number {
    const features = this.baseModel.extractFeatures(input);
    const scores = this.forwardClassifier(features);
    const probas = this.softmax(scores);
    return this.argmax(probas);
  }

  /**
   * Predice probabilidades
   */
  predictProba(input: number[]): number[] {
    const features = this.baseModel.extractFeatures(input);
    const scores = this.forwardClassifier(features);
    return this.softmax(scores);
  }
}

// ============================================
// FINE-TUNING
// ============================================

/**
 * Fine-Tuner
 *
 * Estrategia: Descongelar algunas capas del modelo base
 * y entrenarlas junto con el clasificador nuevo.
 *
 * Ventajas:
 * - Mejor adaptación a nueva tarea
 * - Mayor accuracy que feature extraction
 *
 * Cuándo usar:
 * - Dataset mediano (1000-10000 ejemplos)
 * - Tarea relacionada pero no idéntica
 */
export class FineTuner {
  private baseModel: PretrainedModel;
  private classifier: number[][];
  private numClasses: number;
  private layerLearningRates: Map<string, number>;

  constructor(
    baseModel: PretrainedModel,
    numClasses: number,
    layersToUnfreeze: string[] = []
  ) {
    this.baseModel = baseModel;
    this.numClasses = numClasses;
    this.layerLearningRates = new Map();

    // Congelar todo primero
    this.baseModel.freeze();

    // Descongelar capas específicas
    if (layersToUnfreeze.length > 0) {
      this.baseModel.unfreeze(layersToUnfreeze);
    }

    // Inicializar clasificador
    const featureSize = this.baseModel.getFeatureSize();
    this.classifier = this.initializeClassifier(featureSize, numClasses);
  }

  private initializeClassifier(
    inputSize: number,
    outputSize: number
  ): number[][] {
    const weights: number[][] = [];
    const stddev = Math.sqrt(2 / inputSize);

    for (let i = 0; i < outputSize; i++) {
      const row: number[] = [];
      for (let j = 0; j < inputSize; j++) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        row.push(z * stddev);
      }
      weights.push(row);
    }

    return weights;
  }

  /**
   * Establece learning rate específico para una capa
   *
   * Permite learning rates diferenciados:
   * - Bajo para early layers (preservar conocimiento)
   * - Alto para new layers (aprender desde cero)
   */
  setLayerLearningRate(layerName: string, lr: number): void {
    this.layerLearningRates.set(layerName, lr);
  }

  /**
   * Entrena con fine-tuning
   *
   * Proceso:
   * 1. Warm-up: Solo clasificador (pocas epochs)
   * 2. Fine-tune: Todas las capas descongeladas
   */
  train(
    X: number[][],
    y: number[],
    config: FineTuningConfig
  ): TrainingHistory {
    const startTime = Date.now();
    const history: TrainingHistory = {
      loss: [],
      accuracy: [],
      epochs: config.epochs,
      trainTime: 0,
    };

    const warmupEpochs = config.warmupEpochs || Math.floor(config.epochs * 0.1);

    for (let epoch = 0; epoch < config.epochs; epoch++) {
      const isWarmup = epoch < warmupEpochs;
      let totalLoss = 0;
      let correct = 0;

      for (let i = 0; i < X.length; i++) {
        const features = this.baseModel.extractFeatures(X[i]);
        const scores = this.forwardClassifier(features);
        const probas = this.softmax(scores);

        const loss = -Math.log(probas[y[i]] + 1e-10);
        totalLoss += loss;

        const predicted = this.argmax(probas);
        if (predicted === y[i]) correct++;

        // Durante warmup, solo actualizar clasificador
        // Después, actualizar todo (simulado)
        const lr = isWarmup ? config.learningRate : config.learningRate * 0.1;
        this.updateClassifier(features, probas, y[i], lr);
      }

      const avgLoss = totalLoss / X.length;
      const accuracy = correct / X.length;

      history.loss.push(avgLoss);
      history.accuracy.push(accuracy);

      if (config.verbose && (epoch % 10 === 0 || epoch === config.epochs - 1)) {
        const phase = isWarmup ? '[Warmup]' : '[Fine-tune]';
        console.log(
          `${phase} Epoch ${epoch + 1}/${config.epochs} - ` +
          `Loss: ${avgLoss.toFixed(4)}, Accuracy: ${(accuracy * 100).toFixed(2)}%`
        );
      }
    }

    history.trainTime = Date.now() - startTime;
    return history;
  }

  private forwardClassifier(features: number[]): number[] {
    const scores: number[] = [];
    for (let i = 0; i < this.numClasses; i++) {
      let sum = 0;
      for (let j = 0; j < features.length; j++) {
        sum += this.classifier[i][j] * features[j];
      }
      scores.push(sum);
    }
    return scores;
  }

  private softmax(scores: number[]): number[] {
    const maxScore = Math.max(...scores);
    const expScores = scores.map(s => Math.exp(s - maxScore));
    const sumExp = expScores.reduce((a, b) => a + b, 0);
    return expScores.map(e => e / sumExp);
  }

  private argmax(arr: number[]): number {
    let maxIdx = 0;
    let maxVal = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > maxVal) {
        maxVal = arr[i];
        maxIdx = i;
      }
    }
    return maxIdx;
  }

  private updateClassifier(
    features: number[],
    probas: number[],
    trueLabel: number,
    lr: number
  ): void {
    for (let i = 0; i < this.numClasses; i++) {
      const error = probas[i] - (i === trueLabel ? 1 : 0);
      for (let j = 0; j < features.length; j++) {
        this.classifier[i][j] -= lr * error * features[j];
      }
    }
  }

  predict(input: number[]): number {
    const features = this.baseModel.extractFeatures(input);
    const scores = this.forwardClassifier(features);
    const probas = this.softmax(scores);
    return this.argmax(probas);
  }

  predictProba(input: number[]): number[] {
    const features = this.baseModel.extractFeatures(input);
    const scores = this.forwardClassifier(features);
    return this.softmax(scores);
  }
}

// ============================================
// TRANSFER LEARNING MANAGER
// ============================================

/**
 * Transfer Learning Manager
 *
 * Ayuda a decidir qué estrategia usar y
 * compara diferentes enfoques.
 */
export class TransferLearningManager {
  /**
   * Recomienda estrategia basada en características del problema
   */
  static recommendStrategy(
    datasetSize: number,
    taskSimilarity: 'low' | 'medium' | 'high'
  ): {
    strategy: 'feature_extraction' | 'fine_tuning' | 'from_scratch';
    layersToFreeze: string[];
    recommendedLR: number;
    reasoning: string;
  } {
    // Dataset pequeño
    if (datasetSize < 1000) {
      if (taskSimilarity === 'high' || taskSimilarity === 'medium') {
        return {
          strategy: 'feature_extraction',
          layersToFreeze: ['layer1', 'layer2', 'layer3', 'layer4'],
          recommendedLR: 0.001,
          reasoning:
            'Dataset pequeño + tarea similar: Feature extraction previene overfitting',
        };
      } else {
        return {
          strategy: 'fine_tuning',
          layersToFreeze: ['layer1', 'layer2'],
          recommendedLR: 0.0001,
          reasoning:
            'Dataset pequeño + tarea diferente: Fine-tune capas altas con cuidado',
        };
      }
    }

    // Dataset mediano
    if (datasetSize < 10000) {
      if (taskSimilarity === 'high') {
        return {
          strategy: 'feature_extraction',
          layersToFreeze: ['layer1', 'layer2', 'layer3'],
          recommendedLR: 0.001,
          reasoning: 'Dataset mediano + tarea similar: Feature extraction suficiente',
        };
      } else {
        return {
          strategy: 'fine_tuning',
          layersToFreeze: ['layer1'],
          recommendedLR: 0.0001,
          reasoning:
            'Dataset mediano + tarea diferente: Fine-tune mayoría de capas',
        };
      }
    }

    // Dataset grande
    if (taskSimilarity === 'low') {
      return {
        strategy: 'from_scratch',
        layersToFreeze: [],
        recommendedLR: 0.001,
        reasoning: 'Dataset grande + tarea muy diferente: Entrenar desde cero',
      };
    } else {
      return {
        strategy: 'fine_tuning',
        layersToFreeze: [],
        recommendedLR: 0.00001,
        reasoning: 'Dataset grande + tarea similar: Fine-tune todo con lr bajo',
      };
    }
  }

  /**
   * Compara estrategias en mismo dataset
   *
   * Nota: Esta es una simulación simplificada.
   * En producción requeriría entrenamiento real.
   */
  static compareStrategies(dataset: {
    X: number[][];
    y: number[];
  }): {
    featureExtraction: { accuracy: number; time: number };
    fineTuning: { accuracy: number; time: number };
    fromScratch: { accuracy: number; time: number };
  } {
    const inputSize = dataset.X[0].length;
    const numClasses = Math.max(...dataset.y) + 1;

    // Simular resultados
    // En realidad deberías entrenar cada estrategia
    return {
      featureExtraction: {
        accuracy: 0.85,
        time: 100, // ms (muy rápido)
      },
      fineTuning: {
        accuracy: 0.92,
        time: 500, // ms (mediano)
      },
      fromScratch: {
        accuracy: 0.88,
        time: 2000, // ms (lento)
      },
    };
  }
}

// ============================================
// EJEMPLO DE USO
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 16: Transfer Learning ===\n');

  // Ejemplo 1: Modelo pre-entrenado
  console.log('1. Modelo Pre-entrenado');
  console.log('----------------------');

  const pretrainedModel = new PretrainedModel('medium', 784);
  console.log(`Arquitectura: ${pretrainedModel.getNumLayers()} capas`);
  console.log(`Capas: ${pretrainedModel.getLayerNames().join(', ')}`);
  console.log(`Feature size: ${pretrainedModel.getFeatureSize()}`);

  // Extraer features
  const testInput = Array(784).fill(0.5);
  const features = pretrainedModel.extractFeatures(testInput);
  console.log(`\nFeatures extraídos: ${features.length} dimensiones`);
  console.log(`Primeros 5: [${features.slice(0, 5).map(f => f.toFixed(3)).join(', ')}]`);

  // Congelar/descongelar
  console.log('\nCongelar capas...');
  pretrainedModel.freeze();
  console.log(`layer1 frozen: ${pretrainedModel.isFrozen('layer1')}`);

  pretrainedModel.unfreeze(['layer3', 'layer4']);
  console.log(`layer3 frozen: ${pretrainedModel.isFrozen('layer3')}`);
  console.log(`layer1 frozen: ${pretrainedModel.isFrozen('layer1')}`);

  // Ejemplo 2: Feature Extraction
  console.log('\n\n2. Feature Extraction');
  console.log('---------------------');

  const baseModel = new PretrainedModel('simple', 10);
  const extractor = new FeatureExtractor(baseModel, 3);

  // Dataset pequeño simulado
  const X_train = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  ];
  const y_train = [0, 1, 2, 0, 1, 2];

  console.log(`Training set: ${X_train.length} ejemplos`);
  const history = extractor.train(X_train, y_train, {
    epochs: 50,
    learningRate: 0.01,
    verbose: false,
  });

  console.log(`\nEntrenamiento completado en ${history.trainTime}ms`);
  console.log(`Accuracy final: ${(history.accuracy[history.accuracy.length - 1] * 100).toFixed(2)}%`);

  // Predicción
  const testSample = [1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0];
  const predicted = extractor.predict(testSample);
  const probas = extractor.predictProba(testSample);
  console.log(`\nPredicción: Clase ${predicted}`);
  console.log(`Probabilidades: [${probas.map(p => p.toFixed(3)).join(', ')}]`);

  // Ejemplo 3: Recomendación de estrategia
  console.log('\n\n3. Recomendación de Estrategia');
  console.log('------------------------------');

  const scenarios = [
    { size: 500, similarity: 'high' as const },
    { size: 5000, similarity: 'medium' as const },
    { size: 50000, similarity: 'low' as const },
  ];

  scenarios.forEach(({ size, similarity }) => {
    const recommendation = TransferLearningManager.recommendStrategy(
      size,
      similarity
    );
    console.log(
      `\nDataset: ${size} ejemplos, Similitud: ${similarity}`
    );
    console.log(`  → Estrategia: ${recommendation.strategy}`);
    console.log(`  → Learning rate: ${recommendation.recommendedLR}`);
    console.log(`  → Razón: ${recommendation.reasoning}`);
  });

  console.log('\n=== Fin del ejemplo ===');
}
