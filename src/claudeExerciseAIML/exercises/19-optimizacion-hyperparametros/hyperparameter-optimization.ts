/**
 * Ejercicio 19: Optimización de Hiperparámetros
 *
 * Implementación de Grid Search, Random Search y Cross-Validation
 * para optimizar hiperparámetros de modelos de ML.
 */

// ============================================
// TIPOS E INTERFACES
// ============================================

export interface Model {
  fit(X: number[][], y: number[]): void;
  predict(X: number[][]): number[];
  setParams(params: Record<string, any>): void;
  getParams(): Record<string, any>;
}

export interface GridSearchResult {
  bestParams: Record<string, any>;
  bestScore: number;
  allScores: Array<{ params: Record<string, any>; score: number }>;
  cvResults: any[];
}

export interface RandomSearchResult extends GridSearchResult {
  sampledParams: Record<string, any>[];
}

export interface CrossValidationResult {
  scores: number[];
  meanScore: number;
  stdScore: number;
}

export type Distribution = {
  type: 'uniform' | 'randint' | 'choice';
  min?: number;
  max?: number;
  choices?: any[];
};

// ============================================
// UTILIDADES
// ============================================

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function sampleFromDistribution(dist: Distribution): any {
  switch (dist.type) {
    case 'uniform':
      return Math.random() * (dist.max! - dist.min!) + dist.min!;
    case 'randint':
      return Math.floor(Math.random() * (dist.max! - dist.min!)) + dist.min!;
    case 'choice':
      return dist.choices![Math.floor(Math.random() * dist.choices!.length)];
    default:
      throw new Error(`Unknown distribution type: ${(dist as any).type}`);
  }
}

// ============================================
// K-FOLD CROSS-VALIDATION
// ============================================

export function kFoldSplit(
  X: number[][],
  y: number[],
  k: number,
  stratify: boolean = false
): Array<{ train: number[]; test: number[] }> {
  const n = X.length;
  const folds: Array<{ train: number[]; test: number[] }> = [];

  if (stratify) {
    // Agrupar por clase
    const classeIndices = new Map<number, number[]>();
    y.forEach((label, idx) => {
      if (!classeIndices.has(label)) {
        classeIndices.set(label, []);
      }
      classeIndices.get(label)!.push(idx);
    });

    // Dividir cada clase en k folds
    const classFolds = new Map<number, number[][]>();
    classeIndices.forEach((indices, label) => {
      const shuffled = shuffleArray(indices);
      const foldSize = Math.floor(shuffled.length / k);
      const foldIndices: number[][] = [];

      for (let i = 0; i < k; i++) {
        const start = i * foldSize;
        const end = i === k - 1 ? shuffled.length : (i + 1) * foldSize;
        foldIndices.push(shuffled.slice(start, end));
      }

      classFolds.set(label, foldIndices);
    });

    // Combinar folds de todas las clases
    for (let i = 0; i < k; i++) {
      const testIndices: number[] = [];
      classFolds.forEach(foldIndices => {
        testIndices.push(...foldIndices[i]);
      });

      const trainIndices: number[] = [];
      for (let idx = 0; idx < n; idx++) {
        if (!testIndices.includes(idx)) {
          trainIndices.push(idx);
        }
      }

      folds.push({ train: trainIndices, test: testIndices });
    }
  } else {
    // K-Fold normal
    const indices = shuffleArray([...Array(n).keys()]);
    const foldSize = Math.floor(n / k);

    for (let i = 0; i < k; i++) {
      const start = i * foldSize;
      const end = i === k - 1 ? n : (i + 1) * foldSize;

      const testIndices = indices.slice(start, end);
      const trainIndices = [...indices.slice(0, start), ...indices.slice(end)];

      folds.push({ train: trainIndices, test: testIndices });
    }
  }

  return folds;
}

export function crossValidate(
  model: Model,
  X: number[][],
  y: number[],
  cv: number = 5,
  scorer: (yTrue: number[], yPred: number[]) => number,
  stratify: boolean = false
): CrossValidationResult {
  const folds = kFoldSplit(X, y, cv, stratify);
  const scores: number[] = [];

  for (const { train, test } of folds) {
    const XTrain = train.map(i => X[i]);
    const yTrain = train.map(i => y[i]);
    const XTest = test.map(i => X[i]);
    const yTest = test.map(i => y[i]);

    model.fit(XTrain, yTrain);
    const yPred = model.predict(XTest);
    const score = scorer(yTest, yPred);

    scores.push(score);
  }

  const meanScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance =
    scores.reduce((sum, score) => sum + (score - meanScore) ** 2, 0) /
    scores.length;
  const stdScore = Math.sqrt(variance);

  return { scores, meanScore, stdScore };
}

// ============================================
// GRID SEARCH
// ============================================

export class GridSearch {
  private paramGrid: Record<string, any[]>;
  private model: Model;
  private scorer: (yTrue: number[], yPred: number[]) => number;
  private cv: number;
  private bestParams: Record<string, any> | null = null;
  private bestScore: number = -Infinity;
  private allResults: Array<{ params: Record<string, any>; score: number }> = [];

  constructor(
    paramGrid: Record<string, any[]>,
    model: Model,
    scorer: (yTrue: number[], yPred: number[]) => number,
    cv: number = 5
  ) {
    this.paramGrid = paramGrid;
    this.model = model;
    this.scorer = scorer;
    this.cv = cv;
  }

  private generateParamCombinations(): Record<string, any>[] {
    const keys = Object.keys(this.paramGrid);
    const values = keys.map(key => this.paramGrid[key]);

    function cartesianProduct(arrays: any[][]): any[][] {
      if (arrays.length === 0) return [[]];
      const [first, ...rest] = arrays;
      const subProduct = cartesianProduct(rest);
      return first.flatMap(item => subProduct.map(sub => [item, ...sub]));
    }

    const combinations = cartesianProduct(values);
    return combinations.map(combo => {
      const params: Record<string, any> = {};
      keys.forEach((key, idx) => {
        params[key] = combo[idx];
      });
      return params;
    });
  }

  fit(X: number[][], y: number[], stratify: boolean = false): GridSearchResult {
    const paramCombinations = this.generateParamCombinations();

    console.log(`Grid Search: ${paramCombinations.length} configurations`);

    for (const params of paramCombinations) {
      this.model.setParams(params);

      const cvResult = crossValidate(
        this.model,
        X,
        y,
        this.cv,
        this.scorer,
        stratify
      );

      this.allResults.push({
        params: { ...params },
        score: cvResult.meanScore,
      });

      if (cvResult.meanScore > this.bestScore) {
        this.bestScore = cvResult.meanScore;
        this.bestParams = { ...params };
      }
    }

    return {
      bestParams: this.bestParams!,
      bestScore: this.bestScore,
      allScores: this.allResults,
      cvResults: [],
    };
  }

  getBestParams(): Record<string, any> {
    if (!this.bestParams) {
      throw new Error('Must call fit() first');
    }
    return this.bestParams;
  }

  getBestScore(): number {
    return this.bestScore;
  }

  getAllResults(): Array<{ params: Record<string, any>; score: number }> {
    return this.allResults;
  }
}

// ============================================
// RANDOM SEARCH
// ============================================

export class RandomSearch {
  private paramDistributions: Record<string, Distribution>;
  private model: Model;
  private scorer: (yTrue: number[], yPred: number[]) => number;
  private nIter: number;
  private cv: number;
  private bestParams: Record<string, any> | null = null;
  private bestScore: number = -Infinity;
  private allResults: Array<{ params: Record<string, any>; score: number }> = [];
  private sampledParams: Record<string, any>[] = [];

  constructor(
    paramDistributions: Record<string, Distribution>,
    model: Model,
    scorer: (yTrue: number[], yPred: number[]) => number,
    nIter: number = 10,
    cv: number = 5
  ) {
    this.paramDistributions = paramDistributions;
    this.model = model;
    this.scorer = scorer;
    this.nIter = nIter;
    this.cv = cv;
  }

  private sampleParams(): Record<string, any> {
    const params: Record<string, any> = {};
    Object.entries(this.paramDistributions).forEach(([key, dist]) => {
      params[key] = sampleFromDistribution(dist);
    });
    return params;
  }

  fit(X: number[][], y: number[], stratify: boolean = false): RandomSearchResult {
    console.log(`Random Search: ${this.nIter} iterations`);

    for (let i = 0; i < this.nIter; i++) {
      const params = this.sampleParams();
      this.sampledParams.push({ ...params });

      this.model.setParams(params);

      const cvResult = crossValidate(
        this.model,
        X,
        y,
        this.cv,
        this.scorer,
        stratify
      );

      this.allResults.push({
        params: { ...params },
        score: cvResult.meanScore,
      });

      if (cvResult.meanScore > this.bestScore) {
        this.bestScore = cvResult.meanScore;
        this.bestParams = { ...params };
      }
    }

    return {
      bestParams: this.bestParams!,
      bestScore: this.bestScore,
      allScores: this.allResults,
      cvResults: [],
      sampledParams: this.sampledParams,
    };
  }

  getBestParams(): Record<string, any> {
    if (!this.bestParams) {
      throw new Error('Must call fit() first');
    }
    return this.bestParams;
  }

  getBestScore(): number {
    return this.bestScore;
  }

  getAllResults(): Array<{ params: Record<string, any}; score: number }> {
    return this.allResults;
  }
}

// ============================================
// MODELO DE EJEMPLO
// ============================================

export class SimpleLinearModel implements Model {
  private slope: number = 1;
  private intercept: number = 0;
  private learningRate: number = 0.01;
  private epochs: number = 100;

  fit(X: number[][], y: number[]): void {
    // Regresión lineal simple con gradient descent
    for (let epoch = 0; epoch < this.epochs; epoch++) {
      for (let i = 0; i < X.length; i++) {
        const x = X[i][0];
        const yTrue = y[i];
        const yPred = this.slope * x + this.intercept;
        const error = yPred - yTrue;

        this.slope -= this.learningRate * error * x;
        this.intercept -= this.learningRate * error;
      }
    }
  }

  predict(X: number[][]): number[] {
    return X.map(row => this.slope * row[0] + this.intercept);
  }

  setParams(params: Record<string, any>): void {
    if ('learningRate' in params) this.learningRate = params.learningRate;
    if ('epochs' in params) this.epochs = params.epochs;
  }

  getParams(): Record<string, any> {
    return {
      learningRate: this.learningRate,
      epochs: this.epochs,
    };
  }
}

// ============================================
// SCORERS
// ============================================

export function meanSquaredError(yTrue: number[], yPred: number[]): number {
  const mse =
    yTrue.reduce((sum, y, i) => sum + (y - yPred[i]) ** 2, 0) / yTrue.length;
  return -mse; // Negativo porque queremos maximizar
}

export function accuracy(yTrue: number[], yPred: number[]): number {
  const correct = yTrue.filter((y, i) => y === Math.round(yPred[i])).length;
  return correct / yTrue.length;
}

// ============================================
// EJEMPLO DE USO
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 19: Optimización de Hiperparámetros ===\n');

  // Dataset sintético
  const X: number[][] = [];
  const y: number[] = [];

  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 10;
    const noise = (Math.random() - 0.5) * 2;
    X.push([x]);
    y.push(2 * x + 3 + noise); // y = 2x + 3 + noise
  }

  // Ejemplo 1: Cross-Validation
  console.log('1. Cross-Validation');
  console.log('-------------------');

  const model = new SimpleLinearModel();
  const cvResult = crossValidate(model, X, y, 5, meanSquaredError);

  console.log(`CV Scores: ${cvResult.scores.map(s => s.toFixed(4)).join(', ')}`);
  console.log(`Mean Score: ${cvResult.meanScore.toFixed(4)}`);
  console.log(`Std Score: ${cvResult.stdScore.toFixed(4)}`);

  // Ejemplo 2: Grid Search
  console.log('\n\n2. Grid Search');
  console.log('--------------');

  const paramGrid = {
    learningRate: [0.001, 0.01, 0.1],
    epochs: [50, 100, 200],
  };

  const gridSearch = new GridSearch(
    paramGrid,
    new SimpleLinearModel(),
    meanSquaredError,
    3
  );

  const gridResult = gridSearch.fit(X, y);

  console.log(`\nBest Parameters:`, gridResult.bestParams);
  console.log(`Best Score: ${gridResult.bestScore.toFixed(4)}`);
  console.log(`\nAll Configurations:`);
  gridResult.allScores.forEach(({ params, score }, idx) => {
    console.log(
      `  ${idx + 1}. LR=${params.learningRate}, Epochs=${params.epochs} → Score=${score.toFixed(4)}`
    );
  });

  // Ejemplo 3: Random Search
  console.log('\n\n3. Random Search');
  console.log('----------------');

  const paramDist = {
    learningRate: { type: 'uniform' as const, min: 0.001, max: 0.1 },
    epochs: { type: 'randint' as const, min: 50, max: 200 },
  };

  const randomSearch = new RandomSearch(
    paramDist,
    new SimpleLinearModel(),
    meanSquaredError,
    15,
    3
  );

  const randomResult = randomSearch.fit(X, y);

  console.log(`\nBest Parameters:`, randomResult.bestParams);
  console.log(`Best Score: ${randomResult.bestScore.toFixed(4)}`);
  console.log(`\nTop 5 Configurations:`);
  randomResult.allScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .forEach(({ params, score }, idx) => {
      console.log(
        `  ${idx + 1}. LR=${params.learningRate.toFixed(4)}, Epochs=${params.epochs} → Score=${score.toFixed(4)}`
      );
    });

  console.log('\n=== Fin del ejemplo ===');
}
