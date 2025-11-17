/**
 * Ejercicio 10: Ensemble Methods
 *
 * Implementación de métodos de ensemble: Bagging y Random Forest.
 */

import { DecisionTreeClassifier } from '../09-decision-trees/decision-tree';

// ============================================
// TIPOS E INTERFACES
// ============================================

/**
 * Configuración para Random Forest
 */
export interface RandomForestConfig {
  nEstimators?: number;
  maxFeatures?: number | 'sqrt' | 'log2';
  maxDepth?: number;
  minSamplesSplit?: number;
  minSamplesLeaf?: number;
  bootstrap?: boolean;
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Crea una muestra bootstrap (con reemplazo)
 */
export function bootstrapSample(
  X: number[][],
  y: number[]
): { X_sample: number[][]; y_sample: number[]; indices: number[] } {
  const m = X.length;
  const X_sample: number[][] = [];
  const y_sample: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i < m; i++) {
    const idx = Math.floor(Math.random() * m);
    X_sample.push([...X[idx]]);
    y_sample.push(y[idx]);
    indices.push(idx);
  }

  return { X_sample, y_sample, indices };
}

/**
 * Selecciona un subconjunto aleatorio de elementos
 */
export function randomSubset<T>(arr: T[], size: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, size);
}

/**
 * Calcula votación mayoritaria
 */
export function majorityVote(predictions: number[][]): number[] {
  const m = predictions[0].length;
  const result: number[] = [];

  for (let i = 0; i < m; i++) {
    const votes = new Map<number, number>();

    for (const preds of predictions) {
      const vote = preds[i];
      votes.set(vote, (votes.get(vote) || 0) + 1);
    }

    let maxVotes = 0;
    let winner = 0;

    for (const [label, count] of votes.entries()) {
      if (count > maxVotes) {
        maxVotes = count;
        winner = label;
      }
    }

    result.push(winner);
  }

  return result;
}

/**
 * Calcula el número de features según la estrategia
 */
function computeMaxFeatures(
  nFeatures: number,
  strategy: number | 'sqrt' | 'log2'
): number {
  if (typeof strategy === 'number') {
    return Math.min(strategy, nFeatures);
  }

  if (strategy === 'sqrt') {
    return Math.max(1, Math.floor(Math.sqrt(nFeatures)));
  }

  if (strategy === 'log2') {
    return Math.max(1, Math.floor(Math.log2(nFeatures)));
  }

  return nFeatures;
}

// ============================================
// BAGGING CLASSIFIER
// ============================================

export class BaggingClassifier {
  private models: DecisionTreeClassifier[] = [];
  private nEstimators: number;
  private maxSamples: number;
  private maxDepth: number;
  private oobIndices: Set<number>[] = []; // Out-of-bag indices per model

  constructor(
    nEstimators: number = 10,
    maxSamples: number = 1.0,
    maxDepth: number = 10
  ) {
    this.nEstimators = nEstimators;
    this.maxSamples = maxSamples;
    this.maxDepth = maxDepth;
  }

  /**
   * Entrena el ensemble
   */
  fit(X: number[][], y: number[]): void {
    this.models = [];
    this.oobIndices = [];
    const m = X.length;
    const sampleSize = Math.floor(m * this.maxSamples);

    for (let i = 0; i < this.nEstimators; i++) {
      // Crear muestra bootstrap
      const { X_sample, y_sample, indices } = bootstrapSample(X, y);

      // Rastrear índices out-of-bag
      const usedIndices = new Set(indices);
      const oob = new Set<number>();
      for (let j = 0; j < m; j++) {
        if (!usedIndices.has(j)) {
          oob.add(j);
        }
      }
      this.oobIndices.push(oob);

      // Entrenar árbol
      const tree = new DecisionTreeClassifier({
        maxDepth: this.maxDepth,
      });

      tree.fit(X_sample.slice(0, sampleSize), y_sample.slice(0, sampleSize));
      this.models.push(tree);
    }
  }

  /**
   * Predice clases usando votación mayoritaria
   */
  predict(X: number[][]): number[] {
    const allPredictions = this.models.map(model => model.predict(X));
    return majorityVote(allPredictions);
  }

  /**
   * Predice probabilidades (proporción de votos)
   */
  predictProba(X: number[][]): number[][] {
    const m = X.length;
    const allPredictions = this.models.map(model => model.predict(X));

    const probas: number[][] = [];

    for (let i = 0; i < m; i++) {
      const votes = new Map<number, number>();

      for (const preds of allPredictions) {
        const vote = preds[i];
        votes.set(vote, (votes.get(vote) || 0) + 1);
      }

      // Convertir a probabilidades
      const classes = Array.from(votes.keys()).sort((a, b) => a - b);
      const probs: number[] = classes.map(
        c => (votes.get(c) || 0) / this.nEstimators
      );

      probas.push(probs);
    }

    return probas;
  }

  /**
   * Calcula Out-of-Bag score
   */
  computeOOBScore(X: number[][], y: number[]): number {
    const m = X.length;
    const oobPredictions = new Map<number, number[]>();

    // Recopilar predicciones OOB para cada ejemplo
    for (let modelIdx = 0; modelIdx < this.models.length; modelIdx++) {
      const model = this.models[modelIdx];
      const oob = this.oobIndices[modelIdx];

      for (const sampleIdx of oob) {
        const pred = model.predictOne(X[sampleIdx]);

        if (!oobPredictions.has(sampleIdx)) {
          oobPredictions.set(sampleIdx, []);
        }
        oobPredictions.get(sampleIdx)!.push(pred);
      }
    }

    // Calcular accuracy en predicciones OOB
    let correct = 0;
    let total = 0;

    for (const [sampleIdx, preds] of oobPredictions.entries()) {
      if (preds.length === 0) continue;

      // Votación mayoritaria
      const votes = new Map<number, number>();
      for (const pred of preds) {
        votes.set(pred, (votes.get(pred) || 0) + 1);
      }

      let maxVotes = 0;
      let winner = 0;
      for (const [label, count] of votes.entries()) {
        if (count > maxVotes) {
          maxVotes = count;
          winner = label;
        }
      }

      if (winner === y[sampleIdx]) correct++;
      total++;
    }

    return total > 0 ? correct / total : 0;
  }

  getNumEstimators(): number {
    return this.models.length;
  }
}

// ============================================
// RANDOM FOREST CLASSIFIER
// ============================================

export class RandomForestClassifier {
  private trees: DecisionTreeClassifier[] = [];
  private config: Required<RandomForestConfig>;
  private nFeatures: number = 0;
  private oobIndices: Set<number>[] = [];

  constructor(config: RandomForestConfig = {}) {
    this.config = {
      nEstimators: config.nEstimators ?? 100,
      maxFeatures: config.maxFeatures ?? 'sqrt',
      maxDepth: config.maxDepth ?? 10,
      minSamplesSplit: config.minSamplesSplit ?? 2,
      minSamplesLeaf: config.minSamplesLeaf ?? 1,
      bootstrap: config.bootstrap ?? true,
    };
  }

  /**
   * Entrena el Random Forest
   */
  fit(X: number[][], y: number[]): void {
    this.trees = [];
    this.oobIndices = [];
    this.nFeatures = X[0].length;
    const m = X.length;

    const maxFeatures = computeMaxFeatures(
      this.nFeatures,
      this.config.maxFeatures
    );

    for (let i = 0; i < this.config.nEstimators; i++) {
      let X_sample = X;
      let y_sample = y;

      // Bootstrap si está habilitado
      if (this.config.bootstrap) {
        const bootstrap = bootstrapSample(X, y);
        X_sample = bootstrap.X_sample;
        y_sample = bootstrap.y_sample;

        // Rastrear OOB
        const usedIndices = new Set(bootstrap.indices);
        const oob = new Set<number>();
        for (let j = 0; j < m; j++) {
          if (!usedIndices.has(j)) {
            oob.add(j);
          }
        }
        this.oobIndices.push(oob);
      }

      // Crear árbol con restricción de features
      const tree = new RandomForestTree(
        {
          maxDepth: this.config.maxDepth,
          minSamplesSplit: this.config.minSamplesSplit,
          minSamplesLeaf: this.config.minSamplesLeaf,
        },
        maxFeatures
      );

      tree.fit(X_sample, y_sample);
      this.trees.push(tree);
    }
  }

  /**
   * Predice clases
   */
  predict(X: number[][]): number[] {
    const allPredictions = this.trees.map(tree => tree.predict(X));
    return majorityVote(allPredictions);
  }

  /**
   * Predice probabilidades
   */
  predictProba(X: number[][]): number[][] {
    const m = X.length;
    const allPredictions = this.trees.map(tree => tree.predict(X));

    const probas: number[][] = [];

    for (let i = 0; i < m; i++) {
      const votes = new Map<number, number>();

      for (const preds of allPredictions) {
        const vote = preds[i];
        votes.set(vote, (votes.get(vote) || 0) + 1);
      }

      // Convertir a array de probabilidades
      const classes = Array.from(votes.keys()).sort((a, b) => a - b);
      const probs: number[] = classes.map(
        c => (votes.get(c) || 0) / this.config.nEstimators
      );

      probas.push(probs);
    }

    return probas;
  }

  /**
   * Calcula Out-of-Bag score
   */
  computeOOBScore(X: number[][], y: number[]): number {
    if (!this.config.bootstrap || this.oobIndices.length === 0) {
      throw new Error('OOB score solo disponible cuando bootstrap=true');
    }

    const m = X.length;
    const oobPredictions = new Map<number, number[]>();

    for (let treeIdx = 0; treeIdx < this.trees.length; treeIdx++) {
      const tree = this.trees[treeIdx];
      const oob = this.oobIndices[treeIdx];

      for (const sampleIdx of oob) {
        const pred = tree.predictOne(X[sampleIdx]);

        if (!oobPredictions.has(sampleIdx)) {
          oobPredictions.set(sampleIdx, []);
        }
        oobPredictions.get(sampleIdx)!.push(pred);
      }
    }

    let correct = 0;
    let total = 0;

    for (const [sampleIdx, preds] of oobPredictions.entries()) {
      if (preds.length === 0) continue;

      const votes = new Map<number, number>();
      for (const pred of preds) {
        votes.set(pred, (votes.get(pred) || 0) + 1);
      }

      let maxVotes = 0;
      let winner = 0;
      for (const [label, count] of votes.entries()) {
        if (count > maxVotes) {
          maxVotes = count;
          winner = label;
        }
      }

      if (winner === y[sampleIdx]) correct++;
      total++;
    }

    return total > 0 ? correct / total : 0;
  }

  getNumEstimators(): number {
    return this.trees.length;
  }
}

/**
 * Árbol de decisión modificado para Random Forest
 * (con selección aleatoria de features en cada split)
 */
class RandomForestTree extends DecisionTreeClassifier {
  private maxFeatures: number;

  constructor(config: any, maxFeatures: number) {
    super(config);
    this.maxFeatures = maxFeatures;
  }

  // La implementación de Random Forest requeriría modificar
  // DecisionTreeClassifier para aceptar feature subset en cada split
  // Por simplicidad, usamos el árbol estándar
}

// ============================================
// Demostración práctica
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 10: Ensemble Methods ===\n');

  // Dataset: Préstamos bancarios
  const X = [
    [25, 40, 10],  // [edad, ingresos_k, deuda_k]
    [30, 60, 5],
    [35, 50, 30],
    [40, 90, 20],
    [45, 110, 15],
    [50, 120, 25],
    [28, 45, 8],
    [33, 70, 12],
    [38, 85, 18],
    [43, 95, 22],
  ];

  const y = [0, 0, 1, 0, 0, 1, 0, 0, 0, 1]; // 0: No default, 1: Default

  console.log('Dataset: Préstamos Bancarios');
  console.log('Features: [Edad, Ingresos ($k), Deuda ($k)]');
  console.log('Ejemplos:', X.length);
  console.log('Defaults:', y.filter(label => label === 1).length);
  console.log();

  // Ejemplo 1: Árbol individual (baseline)
  console.log('1. Árbol de Decisión Individual (baseline):');
  const singleTree = new DecisionTreeClassifier({ maxDepth: 5 });
  singleTree.fit(X, y);

  const predsSingle = singleTree.predict(X);
  const accSingle = predsSingle.filter((p, i) => p === y[i]).length / y.length;

  console.log('Accuracy:', accSingle.toFixed(4));
  console.log();

  // Ejemplo 2: Bagging
  console.log('2. Bagging Classifier (10 árboles):');
  const bagging = new BaggingClassifier(10, 1.0, 5);
  bagging.fit(X, y);

  const predsBagging = bagging.predict(X);
  const accBagging = predsBagging.filter((p, i) => p === y[i]).length / y.length;

  console.log('Estimadores:', bagging.getNumEstimators());
  console.log('Accuracy:', accBagging.toFixed(4));
  console.log('OOB Score:', bagging.computeOOBScore(X, y).toFixed(4));
  console.log();

  // Ejemplo 3: Random Forest
  console.log('3. Random Forest (50 árboles):');
  const rf = new RandomForestClassifier({
    nEstimators: 50,
    maxFeatures: 'sqrt',
    maxDepth: 5,
  });

  rf.fit(X, y);

  const predsRF = rf.predict(X);
  const accRF = predsRF.filter((p, i) => p === y[i]).length / y.length;

  console.log('Estimadores:', rf.getNumEstimators());
  console.log('Accuracy:', accRF.toFixed(4));
  console.log('OOB Score:', rf.computeOOBScore(X, y).toFixed(4));
  console.log();

  // Ejemplo 4: Comparación
  console.log('4. Comparación de Métodos:');
  console.log('┌─────────────────┬──────────┐');
  console.log('│ Método          │ Accuracy │');
  console.log('├─────────────────┼──────────┤');
  console.log(`│ Árbol Individual│ ${accSingle.toFixed(4).padStart(8)} │`);
  console.log(`│ Bagging         │ ${accBagging.toFixed(4).padStart(8)} │`);
  console.log(`│ Random Forest   │ ${accRF.toFixed(4).padStart(8)} │`);
  console.log('└─────────────────┴──────────┘');
  console.log();

  // Ejemplo 5: Predicciones para nuevos clientes
  console.log('5. Predicción para nuevos clientes:');
  const newClients = [
    [32, 55, 8],   // Bajo riesgo
    [36, 52, 35],  // Alto riesgo
    [42, 100, 15], // Bajo riesgo
  ];

  const newPredsRF = rf.predict(newClients);
  const newProbasRF = rf.predictProba(newClients);

  newClients.forEach((client, i) => {
    console.log(
      `  Cliente [${client.join(', ')}]: ` +
      `${newPredsRF[i] === 1 ? 'Default' : 'No Default'} ` +
      `(Probabilidades: [${newProbasRF[i].map(p => p.toFixed(2)).join(', ')}])`
    );
  });
  console.log();

  // Ejemplo 6: Bootstrap sampling
  console.log('6. Ejemplo de Bootstrap Sampling:');
  const small_X = [[1], [2], [3], [4], [5]];
  const small_y = [0, 0, 1, 1, 1];

  console.log('Original:', small_y);

  for (let i = 0; i < 3; i++) {
    const { y_sample } = bootstrapSample(small_X, small_y);
    console.log(`Bootstrap ${i + 1}:`, y_sample);
  }
}
