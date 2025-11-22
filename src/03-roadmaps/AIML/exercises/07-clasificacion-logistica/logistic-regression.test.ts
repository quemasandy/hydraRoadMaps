import {
  sigmoid,
  addBias,
  computeCrossEntropy,
  computeCrossEntropyWithRegularization,
  fitLogisticRegression,
  predictProba,
  predictBinary,
  computeConfusionMatrix,
  computeAccuracy,
  computePrecision,
  computeRecall,
  computeF1Score,
  computeMetrics,
  fitOneVsRest,
  predictMulticlass,
  predictMulticlassProba,
  getDecisionBoundary,
} from './logistic-regression';

describe('Sigmoid Function', () => {
  describe('sigmoid', () => {
    it('should return 0.5 for input 0', () => {
      expect(sigmoid(0)).toBe(0.5);
    });

    it('should approach 1 for large positive values', () => {
      expect(sigmoid(10)).toBeGreaterThan(0.999);
      expect(sigmoid(100)).toBeCloseTo(1, 5);
    });

    it('should approach 0 for large negative values', () => {
      expect(sigmoid(-10)).toBeLessThan(0.001);
      expect(sigmoid(-100)).toBeCloseTo(0, 5);
    });

    it('should handle array input', () => {
      const result = sigmoid([0, 1, -1]) as number[];
      expect(result[0]).toBe(0.5);
      expect(result[1]).toBeGreaterThan(0.7);
      expect(result[2]).toBeLessThan(0.3);
    });

    it('should be monotonically increasing', () => {
      expect(sigmoid(-1)).toBeLessThan(sigmoid(0));
      expect(sigmoid(0)).toBeLessThan(sigmoid(1));
    });

    it('should handle extreme values without overflow', () => {
      expect(sigmoid(1000)).toBe(1);
      expect(sigmoid(-1000)).toBe(0);
    });
  });
});

describe('Utility Functions', () => {
  describe('addBias', () => {
    it('should add bias column of 1s', () => {
      const X = [[1, 2], [3, 4]];
      const result = addBias(X);
      expect(result).toEqual([[1, 1, 2], [1, 3, 4]]);
    });

    it('should handle empty matrix', () => {
      expect(addBias([])).toEqual([]);
    });
  });
});

describe('Cost Functions', () => {
  describe('computeCrossEntropy', () => {
    it('should return 0 for perfect predictions', () => {
      const y_true = [0, 1, 0, 1];
      const y_pred = [0.001, 0.999, 0.001, 0.999];
      const cost = computeCrossEntropy(y_true, y_pred);
      expect(cost).toBeLessThan(0.01);
    });

    it('should return high cost for wrong predictions', () => {
      const y_true = [0, 1, 0, 1];
      const y_pred = [0.9, 0.1, 0.9, 0.1];
      const cost = computeCrossEntropy(y_true, y_pred);
      expect(cost).toBeGreaterThan(1);
    });

    it('should handle mixed predictions', () => {
      const y_true = [0, 1];
      const y_pred = [0.5, 0.5];
      const cost = computeCrossEntropy(y_true, y_pred);
      expect(cost).toBeCloseTo(0.693, 2); // -log(0.5) ≈ 0.693
    });

    it('should not return NaN or Infinity', () => {
      const y_true = [0, 1];
      const y_pred = [0, 1];
      const cost = computeCrossEntropy(y_true, y_pred);
      expect(cost).toBeDefined();
      expect(isFinite(cost)).toBe(true);
    });
  });

  describe('computeCrossEntropyWithRegularization', () => {
    it('should add regularization term', () => {
      const y_true = [0, 1, 0, 1];
      const y_pred = [0.1, 0.9, 0.1, 0.9];
      const theta = [0, 1, 2];

      const cost = computeCrossEntropy(y_true, y_pred);
      const costReg = computeCrossEntropyWithRegularization(
        y_true,
        y_pred,
        theta,
        1
      );

      expect(costReg).toBeGreaterThan(cost);
    });

    it('should not regularize bias term', () => {
      const y_true = [0, 1];
      const y_pred = [0.1, 0.9];
      const theta1 = [10, 0, 0]; // Large bias
      const theta2 = [0, 10, 0]; // Large weight

      const cost1 = computeCrossEntropyWithRegularization(
        y_true,
        y_pred,
        theta1,
        1
      );
      const cost2 = computeCrossEntropyWithRegularization(
        y_true,
        y_pred,
        theta2,
        1
      );

      // cost2 should be larger because weight is regularized
      expect(cost2).toBeGreaterThan(cost1);
    });
  });
});

describe('Binary Classification', () => {
  let X: number[][];
  let y: number[];

  beforeEach(() => {
    // Linearly separable data
    X = [
      [1, 1],
      [2, 2],
      [2, 1],
      [6, 5],
      [7, 7],
      [8, 6],
    ];
    y = [0, 0, 0, 1, 1, 1];
  });

  describe('fitLogisticRegression', () => {
    it('should train successfully', () => {
      const result = fitLogisticRegression(X, y, {
        learningRate: 0.1,
        iterations: 100,
        normalize: true,
      });

      expect(result.model.theta).toBeDefined();
      expect(result.costs.length).toBeGreaterThan(0);
      expect(result.iterations).toBeGreaterThan(0);
    });

    it('should reduce cost over iterations', () => {
      const result = fitLogisticRegression(X, y, {
        learningRate: 0.1,
        iterations: 100,
        normalize: true,
      });

      // Cost should generally decrease
      expect(result.costs[result.costs.length - 1]).toBeLessThan(
        result.costs[0]
      );
    });

    it('should converge with tolerance', () => {
      const result = fitLogisticRegression(X, y, {
        learningRate: 0.1,
        iterations: 10000,
        tolerance: 1e-6,
        normalize: true,
      });

      expect(result.iterations).toBeLessThan(10000);
    });

    it('should throw on non-binary labels', () => {
      const y_invalid = [0, 1, 2];
      const X_invalid = [[1], [2], [3]];

      expect(() =>
        fitLogisticRegression(X_invalid, y_invalid, {
          learningRate: 0.1,
          iterations: 100,
        })
      ).toThrow();
    });

    it('should work without normalization', () => {
      const result = fitLogisticRegression(X, y, {
        learningRate: 0.001,
        iterations: 1000,
        normalize: false,
      });

      expect(result.model.scalerParams).toBeUndefined();
    });

    it('should store scaler params when normalize=true', () => {
      const result = fitLogisticRegression(X, y, {
        learningRate: 0.1,
        iterations: 100,
        normalize: true,
      });

      expect(result.model.scalerParams).toBeDefined();
    });

    it('should handle regularization', () => {
      const result1 = fitLogisticRegression(X, y, {
        learningRate: 0.1,
        iterations: 100,
        normalize: true,
        lambda: 0,
      });

      const result2 = fitLogisticRegression(X, y, {
        learningRate: 0.1,
        iterations: 100,
        normalize: true,
        lambda: 10,
      });

      // Regularized model should have smaller weights (excluding bias)
      const weights1 = result1.model.theta.slice(1);
      const weights2 = result2.model.theta.slice(1);

      const norm1 = Math.sqrt(weights1.reduce((sum, w) => sum + w ** 2, 0));
      const norm2 = Math.sqrt(weights2.reduce((sum, w) => sum + w ** 2, 0));

      expect(norm2).toBeLessThanOrEqual(norm1);
    });
  });

  describe('predictProba', () => {
    it('should predict probabilities', () => {
      const result = fitLogisticRegression(X, y, {
        learningRate: 0.1,
        iterations: 1000,
        normalize: true,
      });

      const probas = predictProba(X, result.model);

      expect(probas.length).toBe(X.length);
      probas.forEach(p => {
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThanOrEqual(1);
      });
    });

    it('should give higher probabilities for class 1 examples', () => {
      const result = fitLogisticRegression(X, y, {
        learningRate: 0.1,
        iterations: 1000,
        normalize: true,
      });

      const probas = predictProba(X, result.model);

      // Class 0 examples should have low probability
      expect(probas[0]).toBeLessThan(0.5);
      expect(probas[1]).toBeLessThan(0.5);

      // Class 1 examples should have high probability
      expect(probas[3]).toBeGreaterThan(0.5);
      expect(probas[4]).toBeGreaterThan(0.5);
    });
  });

  describe('predictBinary', () => {
    it('should predict classes', () => {
      const result = fitLogisticRegression(X, y, {
        learningRate: 0.1,
        iterations: 1000,
        normalize: true,
      });

      const predictions = predictBinary(X, result.model);

      expect(predictions.length).toBe(X.length);
      predictions.forEach(p => {
        expect(p === 0 || p === 1).toBe(true);
      });
    });

    it('should use custom threshold', () => {
      const result = fitLogisticRegression(X, y, {
        learningRate: 0.1,
        iterations: 1000,
        normalize: true,
      });

      const preds1 = predictBinary(X, result.model, 0.3);
      const preds2 = predictBinary(X, result.model, 0.7);

      // Lower threshold should predict more 1s
      const count1 = preds1.filter(p => p === 1).length;
      const count2 = preds2.filter(p => p === 1).length;

      expect(count1).toBeGreaterThanOrEqual(count2);
    });

    it('should achieve high accuracy on linearly separable data', () => {
      const result = fitLogisticRegression(X, y, {
        learningRate: 0.1,
        iterations: 1000,
        normalize: true,
      });

      const predictions = predictBinary(X, result.model);
      const accuracy = computeAccuracy(y, predictions);

      expect(accuracy).toBeGreaterThan(0.8);
    });
  });
});

describe('Classification Metrics', () => {
  describe('computeConfusionMatrix', () => {
    it('should compute confusion matrix correctly', () => {
      const y_true = [0, 0, 1, 1];
      const y_pred = [0, 1, 1, 1];

      const cm = computeConfusionMatrix(y_true, y_pred);

      // [[TN, FP], [FN, TP]]
      expect(cm[0][0]).toBe(1); // TN
      expect(cm[0][1]).toBe(1); // FP
      expect(cm[1][0]).toBe(0); // FN
      expect(cm[1][1]).toBe(2); // TP
    });

    it('should handle all correct predictions', () => {
      const y_true = [0, 0, 1, 1];
      const y_pred = [0, 0, 1, 1];

      const cm = computeConfusionMatrix(y_true, y_pred);

      expect(cm[0][0]).toBe(2); // TN
      expect(cm[0][1]).toBe(0); // FP
      expect(cm[1][0]).toBe(0); // FN
      expect(cm[1][1]).toBe(2); // TP
    });

    it('should handle all wrong predictions', () => {
      const y_true = [0, 0, 1, 1];
      const y_pred = [1, 1, 0, 0];

      const cm = computeConfusionMatrix(y_true, y_pred);

      expect(cm[0][0]).toBe(0); // TN
      expect(cm[0][1]).toBe(2); // FP
      expect(cm[1][0]).toBe(2); // FN
      expect(cm[1][1]).toBe(0); // TP
    });
  });

  describe('computeAccuracy', () => {
    it('should return 1 for perfect predictions', () => {
      const y_true = [0, 1, 0, 1];
      const y_pred = [0, 1, 0, 1];
      expect(computeAccuracy(y_true, y_pred)).toBe(1);
    });

    it('should return 0 for completely wrong predictions', () => {
      const y_true = [0, 0, 1, 1];
      const y_pred = [1, 1, 0, 0];
      expect(computeAccuracy(y_true, y_pred)).toBe(0);
    });

    it('should compute partial accuracy', () => {
      const y_true = [0, 0, 1, 1];
      const y_pred = [0, 1, 1, 1];
      expect(computeAccuracy(y_true, y_pred)).toBe(0.75);
    });
  });

  describe('computePrecision', () => {
    it('should compute precision correctly', () => {
      const y_true = [0, 0, 1, 1];
      const y_pred = [0, 1, 1, 1];
      // TP=2, FP=1 → Precision = 2/3
      expect(computePrecision(y_true, y_pred)).toBeCloseTo(2 / 3, 5);
    });

    it('should return 0 when no positive predictions', () => {
      const y_true = [0, 1, 1];
      const y_pred = [0, 0, 0];
      expect(computePrecision(y_true, y_pred)).toBe(0);
    });

    it('should return 1 for perfect precision', () => {
      const y_true = [0, 0, 1, 1];
      const y_pred = [0, 0, 1, 1];
      expect(computePrecision(y_true, y_pred)).toBe(1);
    });
  });

  describe('computeRecall', () => {
    it('should compute recall correctly', () => {
      const y_true = [0, 0, 1, 1];
      const y_pred = [0, 0, 1, 0];
      // TP=1, FN=1 → Recall = 1/2
      expect(computeRecall(y_true, y_pred)).toBe(0.5);
    });

    it('should return 0 when no true positives detected', () => {
      const y_true = [1, 1, 1];
      const y_pred = [0, 0, 0];
      expect(computeRecall(y_true, y_pred)).toBe(0);
    });

    it('should return 1 for perfect recall', () => {
      const y_true = [0, 1, 1];
      const y_pred = [1, 1, 1];
      expect(computeRecall(y_true, y_pred)).toBe(1);
    });
  });

  describe('computeF1Score', () => {
    it('should compute F1 score correctly', () => {
      const y_true = [0, 0, 1, 1];
      const y_pred = [0, 1, 1, 1];
      // Precision = 2/3, Recall = 1
      // F1 = 2 * (2/3 * 1) / (2/3 + 1) = 4/5
      expect(computeF1Score(y_true, y_pred)).toBeCloseTo(0.8, 5);
    });

    it('should return 0 when precision and recall are 0', () => {
      const y_true = [1, 1];
      const y_pred = [0, 0];
      expect(computeF1Score(y_true, y_pred)).toBe(0);
    });

    it('should return 1 for perfect predictions', () => {
      const y_true = [0, 1, 0, 1];
      const y_pred = [0, 1, 0, 1];
      expect(computeF1Score(y_true, y_pred)).toBe(1);
    });
  });

  describe('computeMetrics', () => {
    it('should compute all metrics', () => {
      const y_true = [0, 0, 1, 1];
      const y_pred = [0, 1, 1, 1];

      const metrics = computeMetrics(y_true, y_pred);

      expect(metrics.accuracy).toBeDefined();
      expect(metrics.precision).toBeDefined();
      expect(metrics.recall).toBeDefined();
      expect(metrics.f1Score).toBeDefined();
      expect(metrics.confusionMatrix).toBeDefined();
      expect(metrics.confusionMatrix.length).toBe(2);
      expect(metrics.confusionMatrix[0].length).toBe(2);
    });
  });
});

describe('Multiclass Classification', () => {
  let X: number[][];
  let y: number[];

  beforeEach(() => {
    // 3 classes, clearly separated
    X = [
      [1, 1], [1, 2], [2, 1],        // Class 0
      [5, 5], [5, 6], [6, 5],        // Class 1
      [9, 9], [9, 10], [10, 9],      // Class 2
    ];
    y = [0, 0, 0, 1, 1, 1, 2, 2, 2];
  });

  describe('fitOneVsRest', () => {
    it('should train models for all classes', () => {
      const model = fitOneVsRest(X, y, {
        learningRate: 0.1,
        iterations: 500,
        normalize: true,
      });

      expect(model.models.length).toBe(3);
      expect(model.classes).toEqual([0, 1, 2]);
    });

    it('should handle different class labels', () => {
      const y_custom = [5, 5, 5, 10, 10, 10, 15, 15, 15];

      const model = fitOneVsRest(X, y_custom, {
        learningRate: 0.1,
        iterations: 500,
        normalize: true,
      });

      expect(model.classes).toEqual([5, 10, 15]);
    });
  });

  describe('predictMulticlass', () => {
    it('should predict correct classes', () => {
      const model = fitOneVsRest(X, y, {
        learningRate: 0.1,
        iterations: 1000,
        normalize: true,
      });

      const predictions = predictMulticlass(X, model);

      expect(predictions.length).toBe(X.length);

      // Should achieve high accuracy on training data
      const accuracy = computeAccuracy(y, predictions);
      expect(accuracy).toBeGreaterThan(0.7);
    });

    it('should predict for new examples', () => {
      const model = fitOneVsRest(X, y, {
        learningRate: 0.1,
        iterations: 1000,
        normalize: true,
      });

      const X_new = [[1.5, 1.5], [5.5, 5.5], [9.5, 9.5]];
      const predictions = predictMulticlass(X_new, model);

      // Should predict class 0, 1, 2 respectively
      expect(predictions[0]).toBe(0);
      expect(predictions[1]).toBe(1);
      expect(predictions[2]).toBe(2);
    });
  });

  describe('predictMulticlassProba', () => {
    it('should return probability matrix', () => {
      const model = fitOneVsRest(X, y, {
        learningRate: 0.1,
        iterations: 500,
        normalize: true,
      });

      const probas = predictMulticlassProba(X, model);

      expect(probas.length).toBe(X.length);
      expect(probas[0].length).toBe(3); // 3 classes

      // Each probability should be between 0 and 1
      probas.forEach(row => {
        row.forEach(p => {
          expect(p).toBeGreaterThanOrEqual(0);
          expect(p).toBeLessThanOrEqual(1);
        });
      });
    });

    it('should give highest probability to correct class', () => {
      const model = fitOneVsRest(X, y, {
        learningRate: 0.1,
        iterations: 1000,
        normalize: true,
      });

      const probas = predictMulticlassProba(X, model);

      // For first example (class 0), probability of class 0 should be highest
      expect(probas[0][0]).toBeGreaterThan(probas[0][1]);
      expect(probas[0][0]).toBeGreaterThan(probas[0][2]);

      // For middle example (class 1), probability of class 1 should be highest
      expect(probas[4][1]).toBeGreaterThan(probas[4][0]);
      expect(probas[4][1]).toBeGreaterThan(probas[4][2]);
    });
  });
});

describe('Decision Boundary', () => {
  describe('getDecisionBoundary', () => {
    it('should compute decision boundary points', () => {
      // Simple model: x2 = -x1 + 5
      const model = {
        theta: [5, -1, 1],
        intercept: 5,
      };

      const points = getDecisionBoundary(model, [0, 10], 11);

      expect(points.length).toBe(11);
      expect(points[0].length).toBe(2);

      // Check first point: x1=0, x2=-(5-0)/1 = -5
      expect(points[0][0]).toBe(0);
      expect(points[0][1]).toBeCloseTo(-5, 5);

      // Check last point: x1=10, x2=-(5-10)/1 = 5
      expect(points[10][0]).toBe(10);
      expect(points[10][1]).toBeCloseTo(5, 5);
    });

    it('should throw for models with != 2 features', () => {
      const model = {
        theta: [1, 2, 3, 4],
        intercept: 1,
      };

      expect(() => getDecisionBoundary(model, [0, 10])).toThrow();
    });

    it('should throw when theta2 is 0', () => {
      const model = {
        theta: [1, 1, 0],
        intercept: 1,
      };

      expect(() => getDecisionBoundary(model, [0, 10])).toThrow();
    });
  });
});

describe('Real-world scenarios', () => {
  it('should classify spam vs not spam', () => {
    // Features: [word_count, exclamation_marks]
    const X = [
      [10, 0], [15, 0], [8, 0],     // Not spam
      [50, 5], [45, 4], [60, 6],    // Spam
    ];
    const y = [0, 0, 0, 1, 1, 1];

    const result = fitLogisticRegression(X, y, {
      learningRate: 0.1,
      iterations: 1000,
      normalize: true,
    });

    const predictions = predictBinary(X, result.model);
    const accuracy = computeAccuracy(y, predictions);

    expect(accuracy).toBeGreaterThan(0.7);
  });

  it('should handle imbalanced classes', () => {
    // 80% class 0, 20% class 1
    const X = [
      [1], [1.5], [2], [2.5],         // Class 0 (4 examples)
      [8],                             // Class 1 (1 example)
    ];
    const y = [0, 0, 0, 0, 1];

    const result = fitLogisticRegression(X, y, {
      learningRate: 0.1,
      iterations: 1000,
      normalize: true,
    });

    const predictions = predictBinary(X, result.model);

    // Should still learn to classify
    expect(predictions[4]).toBe(1); // Should predict class 1 for last example
  });

  it('should classify multiple categories', () => {
    // Simple iris-like dataset: setosa, versicolor, virginica
    const X = [
      [5.1, 3.5], [4.9, 3.0], [4.7, 3.2],  // Setosa
      [7.0, 3.2], [6.4, 3.2], [6.9, 3.1],  // Versicolor
      [6.3, 3.3], [5.8, 2.7], [7.1, 3.0],  // Virginica
    ];
    const y = [0, 0, 0, 1, 1, 1, 2, 2, 2];

    const model = fitOneVsRest(X, y, {
      learningRate: 0.1,
      iterations: 1000,
      normalize: true,
    });

    const predictions = predictMulticlass(X, model);
    const accuracy = computeAccuracy(y, predictions);

    expect(accuracy).toBeGreaterThan(0.5);
  });

  it('should provide interpretable probabilities', () => {
    const X = [[1], [2], [3], [8], [9], [10]];
    const y = [0, 0, 0, 1, 1, 1];

    const result = fitLogisticRegression(X, y, {
      learningRate: 0.1,
      iterations: 1000,
      normalize: true,
    });

    const probas = predictProba([[5]], result.model);

    // Middle value should have probability around 0.5
    expect(probas[0]).toBeGreaterThan(0.2);
    expect(probas[0]).toBeLessThan(0.8);
  });
});
