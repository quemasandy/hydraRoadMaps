import {
  kFoldSplit,
  crossValidate,
  GridSearch,
  RandomSearch,
  SimpleLinearModel,
  meanSquaredError,
  accuracy,
} from './hyperparameter-optimization';

describe('K-Fold Cross-Validation', () => {
  it('should split data into k folds', () => {
    const X = Array(100).fill(0).map(() => [Math.random()]);
    const y = Array(100).fill(0).map(() => Math.random());

    const folds = kFoldSplit(X, y, 5);

    expect(folds).toHaveLength(5);
    folds.forEach(fold => {
      expect(fold.train.length + fold.test.length).toBeLessThanOrEqual(X.length);
    });
  });

  it('should create stratified folds', () => {
    const X = Array(100).fill(0).map((_, i) => [i]);
    const y = Array(100).fill(0).map((_, i) => (i < 50 ? 0 : 1));

    const folds = kFoldSplit(X, y, 5, true);

    expect(folds).toHaveLength(5);
  });

  it('should perform cross-validation', () => {
    const X = Array(50).fill(0).map(() => [Math.random() * 10]);
    const y = X.map(row => 2 * row[0] + 3);

    const model = new SimpleLinearModel();
    const result = crossValidate(model, X, y, 3, meanSquaredError);

    expect(result.scores).toHaveLength(3);
    expect(result.meanScore).toBeDefined();
    expect(result.stdScore).toBeGreaterThanOrEqual(0);
  });
});

describe('GridSearch', () => {
  it('should search all parameter combinations', () => {
    const X = Array(30).fill(0).map(() => [Math.random() * 10]);
    const y = X.map(row => 2 * row[0] + 3);

    const paramGrid = {
      learningRate: [0.01, 0.1],
      epochs: [50, 100],
    };

    const gridSearch = new GridSearch(
      paramGrid,
      new SimpleLinearModel(),
      meanSquaredError,
      2
    );

    const result = gridSearch.fit(X, y);

    expect(result.bestParams).toBeDefined();
    expect(result.bestScore).toBeDefined();
    expect(result.allScores.length).toBe(4); // 2x2 combinations
  });

  it('should find best parameters', () => {
    const X = Array(30).fill(0).map(() => [Math.random() * 10]);
    const y = X.map(row => 2 * row[0] + 3);

    const gridSearch = new GridSearch(
      { learningRate: [0.001, 0.01, 0.1], epochs: [100] },
      new SimpleLinearModel(),
      meanSquaredError,
      2
    );

    gridSearch.fit(X, y);
    const bestParams = gridSearch.getBestParams();

    expect(bestParams.learningRate).toBeDefined();
    expect(bestParams.epochs).toBe(100);
  });
});

describe('RandomSearch', () => {
  it('should sample random parameters', () => {
    const X = Array(30).fill(0).map(() => [Math.random() * 10]);
    const y = X.map(row => 2 * row[0] + 3);

    const paramDist = {
      learningRate: { type: 'uniform' as const, min: 0.001, max: 0.1 },
      epochs: { type: 'randint' as const, min: 50, max: 200 },
    };

    const randomSearch = new RandomSearch(
      paramDist,
      new SimpleLinearModel(),
      meanSquaredError,
      10,
      2
    );

    const result = randomSearch.fit(X, y);

    expect(result.bestParams).toBeDefined();
    expect(result.allScores).toHaveLength(10);
    expect(result.sampledParams).toHaveLength(10);
  });

  it('should sample different values', () => {
    const X = Array(20).fill(0).map(() => [Math.random() * 10]);
    const y = X.map(row => 2 * row[0] + 3);

    const randomSearch = new RandomSearch(
      {
        learningRate: { type: 'uniform' as const, min: 0.01, max: 0.1 },
        epochs: { type: 'randint' as const, min: 50, max: 150 },
      },
      new SimpleLinearModel(),
      meanSquaredError,
      5,
      2
    );

    const result = randomSearch.fit(X, y);

    const uniqueLRs = new Set(result.sampledParams.map(p => p.learningRate));
    expect(uniqueLRs.size).toBeGreaterThan(1);
  });
});

describe('Scorers', () => {
  it('should calculate MSE correctly', () => {
    const yTrue = [1, 2, 3, 4, 5];
    const yPred = [1, 2, 3, 4, 5];

    const score = meanSquaredError(yTrue, yPred);
    expect(score).toBe(0);
  });

  it('should calculate accuracy correctly', () => {
    const yTrue = [0, 1, 1, 0, 1];
    const yPred = [0, 1, 1, 0, 1];

    const score = accuracy(yTrue, yPred);
    expect(score).toBe(1.0);
  });
});
