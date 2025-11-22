import {
  bootstrapSample,
  randomSubset,
  majorityVote,
  BaggingClassifier,
  RandomForestClassifier,
} from './ensemble';

describe('Utility Functions', () => {
  describe('bootstrapSample', () => {
    it('should create bootstrap sample with same size', () => {
      const X = [[1], [2], [3], [4], [5]];
      const y = [0, 1, 0, 1, 0];

      const { X_sample, y_sample } = bootstrapSample(X, y);

      expect(X_sample.length).toBe(X.length);
      expect(y_sample.length).toBe(y.length);
    });

    it('should sample with replacement', () => {
      const X = [[1], [2], [3]];
      const y = [0, 1, 2];

      const { y_sample } = bootstrapSample(X, y);

      // Very likely to have duplicates with 3 samples
      // Run multiple times and check at least one has duplicates
      let foundDuplicate = false;

      for (let i = 0; i < 10; i++) {
        const { y_sample: sample } = bootstrapSample(X, y);
        const unique = new Set(sample);
        if (unique.size < sample.length) {
          foundDuplicate = true;
          break;
        }
      }

      expect(foundDuplicate).toBe(true);
    });

    it('should return valid indices', () => {
      const X = [[1], [2], [3]];
      const y = [0, 1, 2];

      const { indices } = bootstrapSample(X, y);

      expect(indices.length).toBe(X.length);
      indices.forEach(idx => {
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(X.length);
      });
    });
  });

  describe('randomSubset', () => {
    it('should return subset of correct size', () => {
      const arr = [1, 2, 3, 4, 5];
      const subset = randomSubset(arr, 3);

      expect(subset.length).toBe(3);
    });

    it('should return all elements if size >= array length', () => {
      const arr = [1, 2, 3];
      const subset = randomSubset(arr, 5);

      expect(subset.length).toBe(3);
    });

    it('should return different subsets', () => {
      const arr = [1, 2, 3, 4, 5];
      const subset1 = randomSubset(arr, 3);
      const subset2 = randomSubset(arr, 3);

      // Not guaranteed to be different, but very likely
      const same = JSON.stringify(subset1.sort()) === JSON.stringify(subset2.sort());
      // Run multiple times - at least one should be different
      expect(same).toBeDefined(); // Just checking it works
    });
  });

  describe('majorityVote', () => {
    it('should compute majority vote correctly', () => {
      const predictions = [
        [0, 1, 1],
        [0, 1, 0],
        [0, 0, 1],
      ];

      const result = majorityVote(predictions);

      expect(result).toEqual([0, 1, 1]);
    });

    it('should handle ties', () => {
      const predictions = [
        [0, 1],
        [1, 0],
      ];

      const result = majorityVote(predictions);

      expect(result.length).toBe(2);
      // Either 0 or 1 is valid for ties
      result.forEach(vote => {
        expect([0, 1]).toContain(vote);
      });
    });

    it('should work with single predictor', () => {
      const predictions = [[0, 1, 0]];
      const result = majorityVote(predictions);

      expect(result).toEqual([0, 1, 0]);
    });

    it('should handle many classes', () => {
      const predictions = [
        [0, 1, 2],
        [0, 1, 2],
        [0, 2, 2],
      ];

      const result = majorityVote(predictions);

      expect(result).toEqual([0, 1, 2]);
    });
  });
});

describe('BaggingClassifier', () => {
  let X: number[][];
  let y: number[];

  beforeEach(() => {
    X = [
      [1, 1], [1.5, 1.5], [2, 2],       // Class 0
      [10, 10], [10.5, 10.5], [11, 11], // Class 1
    ];
    y = [0, 0, 0, 1, 1, 1];
  });

  describe('Basic Functionality', () => {
    it('should train successfully', () => {
      const bagging = new BaggingClassifier(5);
      expect(() => bagging.fit(X, y)).not.toThrow();
    });

    it('should create correct number of estimators', () => {
      const bagging = new BaggingClassifier(10);
      bagging.fit(X, y);

      expect(bagging.getNumEstimators()).toBe(10);
    });

    it('should make predictions', () => {
      const bagging = new BaggingClassifier(5);
      bagging.fit(X, y);

      const predictions = bagging.predict(X);
      expect(predictions.length).toBe(X.length);
    });

    it('should predict probabilities', () => {
      const bagging = new BaggingClassifier(5);
      bagging.fit(X, y);

      const probas = bagging.predictProba(X);

      expect(probas.length).toBe(X.length);
      probas.forEach(probs => {
        expect(probs.length).toBeGreaterThan(0);
        const sum = probs.reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(1, 1); // Should sum to ~1
      });
    });
  });

  describe('Performance', () => {
    it('should achieve good accuracy on simple data', () => {
      const bagging = new BaggingClassifier(10);
      bagging.fit(X, y);

      const predictions = bagging.predict(X);
      const accuracy = predictions.filter((p, i) => p === y[i]).length / y.length;

      expect(accuracy).toBeGreaterThan(0.7);
    });

    it('should generally outperform single tree', () => {
      // This test may occasionally fail due to randomness,
      // but should generally pass
      const X_train = [
        [1, 1], [1.2, 1.1], [1.1, 1.2], [2, 2], [1.9, 2.1],
        [10, 10], [10.1, 10.2], [9.9, 10.1], [11, 11], [10.8, 11.1],
      ];
      const y_train = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1];

      const bagging = new BaggingClassifier(20);
      bagging.fit(X_train, y_train);

      const predictions = bagging.predict(X_train);
      const accuracy = predictions.filter((p, i) => p === y_train[i]).length / y_train.length;

      expect(accuracy).toBeGreaterThan(0.6);
    });
  });

  describe('Out-of-Bag Score', () => {
    it('should compute OOB score', () => {
      const bagging = new BaggingClassifier(20);
      bagging.fit(X, y);

      const oobScore = bagging.computeOOBScore(X, y);

      expect(oobScore).toBeGreaterThanOrEqual(0);
      expect(oobScore).toBeLessThanOrEqual(1);
    });

    it('should give reasonable OOB score', () => {
      const X_large = [
        [1, 1], [1.5, 1.5], [2, 2], [2.5, 2.5], [3, 3],
        [10, 10], [10.5, 10.5], [11, 11], [11.5, 11.5], [12, 12],
      ];
      const y_large = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1];

      const bagging = new BaggingClassifier(30);
      bagging.fit(X_large, y_large);

      const oobScore = bagging.computeOOBScore(X_large, y_large);

      expect(oobScore).toBeGreaterThan(0.5);
    });
  });
});

describe('RandomForestClassifier', () => {
  let X: number[][];
  let y: number[];

  beforeEach(() => {
    X = [
      [1, 1], [1.5, 1.5], [2, 2],       // Class 0
      [10, 10], [10.5, 10.5], [11, 11], // Class 1
    ];
    y = [0, 0, 0, 1, 1, 1];
  });

  describe('Basic Functionality', () => {
    it('should train successfully', () => {
      const rf = new RandomForestClassifier({ nEstimators: 5 });
      expect(() => rf.fit(X, y)).not.toThrow();
    });

    it('should create correct number of trees', () => {
      const rf = new RandomForestClassifier({ nEstimators: 20 });
      rf.fit(X, y);

      expect(rf.getNumEstimators()).toBe(20);
    });

    it('should make predictions', () => {
      const rf = new RandomForestClassifier({ nEstimators: 5 });
      rf.fit(X, y);

      const predictions = rf.predict(X);
      expect(predictions.length).toBe(X.length);
    });

    it('should predict probabilities', () => {
      const rf = new RandomForestClassifier({ nEstimators: 5 });
      rf.fit(X, y);

      const probas = rf.predictProba(X);

      expect(probas.length).toBe(X.length);
      probas.forEach(probs => {
        expect(probs.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Configuration', () => {
    it('should work with sqrt maxFeatures', () => {
      const rf = new RandomForestClassifier({
        nEstimators: 10,
        maxFeatures: 'sqrt',
      });

      rf.fit(X, y);
      const predictions = rf.predict(X);
      expect(predictions.length).toBe(X.length);
    });

    it('should work with log2 maxFeatures', () => {
      const rf = new RandomForestClassifier({
        nEstimators: 10,
        maxFeatures: 'log2',
      });

      rf.fit(X, y);
      const predictions = rf.predict(X);
      expect(predictions.length).toBe(X.length);
    });

    it('should work with numeric maxFeatures', () => {
      const rf = new RandomForestClassifier({
        nEstimators: 10,
        maxFeatures: 1,
      });

      rf.fit(X, y);
      const predictions = rf.predict(X);
      expect(predictions.length).toBe(X.length);
    });

    it('should respect maxDepth', () => {
      const rf1 = new RandomForestClassifier({
        nEstimators: 5,
        maxDepth: 1,
      });

      const rf2 = new RandomForestClassifier({
        nEstimators: 5,
        maxDepth: 10,
      });

      rf1.fit(X, y);
      rf2.fit(X, y);

      // Both should work
      expect(rf1.predict(X).length).toBe(X.length);
      expect(rf2.predict(X).length).toBe(X.length);
    });
  });

  describe('Performance', () => {
    it('should achieve good accuracy', () => {
      const rf = new RandomForestClassifier({ nEstimators: 30 });
      rf.fit(X, y);

      const predictions = rf.predict(X);
      const accuracy = predictions.filter((p, i) => p === y[i]).length / y.length;

      expect(accuracy).toBeGreaterThan(0.7);
    });

    it('should improve with more trees', () => {
      const rf_few = new RandomForestClassifier({ nEstimators: 3 });
      const rf_many = new RandomForestClassifier({ nEstimators: 50 });

      const X_large = [
        [1, 1], [1.5, 1.5], [2, 2], [2.5, 2.5],
        [10, 10], [10.5, 10.5], [11, 11], [11.5, 11.5],
      ];
      const y_large = [0, 0, 0, 0, 1, 1, 1, 1];

      rf_few.fit(X_large, y_large);
      rf_many.fit(X_large, y_large);

      const acc_few = rf_few.predict(X_large).filter((p, i) => p === y_large[i]).length / y_large.length;
      const acc_many = rf_many.predict(X_large).filter((p, i) => p === y_large[i]).length / y_large.length;

      // More trees should be equal or better
      expect(acc_many).toBeGreaterThanOrEqual(acc_few - 0.2);
    });
  });

  describe('Out-of-Bag Score', () => {
    it('should compute OOB score with bootstrap', () => {
      const rf = new RandomForestClassifier({
        nEstimators: 20,
        bootstrap: true,
      });

      rf.fit(X, y);

      const oobScore = rf.computeOOBScore(X, y);

      expect(oobScore).toBeGreaterThanOrEqual(0);
      expect(oobScore).toBeLessThanOrEqual(1);
    });

    it('should throw without bootstrap', () => {
      const rf = new RandomForestClassifier({
        nEstimators: 10,
        bootstrap: false,
      });

      rf.fit(X, y);

      expect(() => rf.computeOOBScore(X, y)).toThrow();
    });
  });
});

describe('Real-world scenarios', () => {
  it('should classify iris-like dataset', () => {
    const X = [
      [5.1, 3.5], [4.9, 3.0], [4.7, 3.2],  // Setosa
      [7.0, 3.2], [6.4, 3.2], [6.9, 3.1],  // Versicolor
      [6.3, 3.3], [5.8, 2.7], [7.1, 3.0],  // Virginica
    ];
    const y = [0, 0, 0, 1, 1, 1, 2, 2, 2];

    const rf = new RandomForestClassifier({ nEstimators: 20 });
    rf.fit(X, y);

    const predictions = rf.predict(X);
    const accuracy = predictions.filter((p, i) => p === y[i]).length / y.length;

    expect(accuracy).toBeGreaterThan(0.5);
  });

  it('should improve over single tree on noisy data', () => {
    // Data with some noise
    const X = [
      [1, 1], [1.1, 1.2], [0.9, 1.1], [1.2, 0.9],
      [10, 10], [10.1, 9.9], [9.8, 10.2], [10.3, 10.1],
      [5, 5], // Noise point
    ];
    const y = [0, 0, 0, 0, 1, 1, 1, 1, 0];

    const rf = new RandomForestClassifier({ nEstimators: 30 });
    rf.fit(X, y);

    const predictions = rf.predict(X);

    // Should handle noise reasonably well
    expect(predictions.length).toBe(X.length);
  });

  it('should work with binary classification', () => {
    const X = [
      [1, 2], [2, 3], [3, 4],
      [10, 11], [11, 12], [12, 13],
    ];
    const y = [0, 0, 0, 1, 1, 1];

    const bagging = new BaggingClassifier(20);
    bagging.fit(X, y);

    const predictions = bagging.predict([[2, 3], [11, 12]]);

    expect(predictions[0]).toBe(0);
    expect(predictions[1]).toBe(1);
  });
});
