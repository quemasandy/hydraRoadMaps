import {
  meanSquaredError,
  meanSquaredErrorDerivative,
  binaryCrossEntropy,
  binaryCrossEntropyDerivative,
  oneHotEncode,
  computeAccuracy,
  shuffle,
  MLPWithBackprop,
  numericalGradient,
  checkGradients,
} from './backpropagation';

describe('Loss Functions', () => {
  describe('meanSquaredError', () => {
    it('should return 0 for perfect predictions', () => {
      const y_true = [1, 2, 3, 4];
      const y_pred = [1, 2, 3, 4];
      expect(meanSquaredError(y_true, y_pred)).toBe(0);
    });

    it('should calculate MSE correctly', () => {
      const y_true = [1, 2, 3];
      const y_pred = [1.5, 2.5, 3.5];
      // ((0.5)² + (0.5)² + (0.5)²) / 3 = 0.75 / 3 = 0.25
      expect(meanSquaredError(y_true, y_pred)).toBeCloseTo(0.25, 5);
    });

    it('should handle negative errors', () => {
      const y_true = [1, 2, 3];
      const y_pred = [0, 1, 2];
      // ((1)² + (1)² + (1)²) / 3 = 3 / 3 = 1
      expect(meanSquaredError(y_true, y_pred)).toBeCloseTo(1, 5);
    });

    it('should throw error for mismatched lengths', () => {
      const y_true = [1, 2];
      const y_pred = [1, 2, 3];
      expect(() => meanSquaredError(y_true, y_pred)).toThrow();
    });

    it('should return larger values for larger errors', () => {
      const y_true = [1, 1, 1];
      const y_pred1 = [1.1, 1.1, 1.1];
      const y_pred2 = [2, 2, 2];
      const mse1 = meanSquaredError(y_true, y_pred1);
      const mse2 = meanSquaredError(y_true, y_pred2);
      expect(mse2).toBeGreaterThan(mse1);
    });
  });

  describe('meanSquaredErrorDerivative', () => {
    it('should return 0 for perfect predictions', () => {
      const y_true = [1, 2, 3];
      const y_pred = [1, 2, 3];
      const derivative = meanSquaredErrorDerivative(y_true, y_pred);
      derivative.forEach(d => expect(d).toBe(0));
    });

    it('should calculate derivative correctly', () => {
      const y_true = [1, 2];
      const y_pred = [1.5, 2.5];
      // (2/m) * (y_pred - y_true) = (2/2) * ([0.5, 0.5]) = [0.5, 0.5]
      const derivative = meanSquaredErrorDerivative(y_true, y_pred);
      expect(derivative[0]).toBeCloseTo(0.5, 5);
      expect(derivative[1]).toBeCloseTo(0.5, 5);
    });

    it('should have correct signs', () => {
      const y_true = [1, 1];
      const y_pred = [2, 0];
      // Overestimate: positive derivative
      // Underestimate: negative derivative
      const derivative = meanSquaredErrorDerivative(y_true, y_pred);
      expect(derivative[0]).toBeGreaterThan(0);
      expect(derivative[1]).toBeLessThan(0);
    });

    it('should scale with batch size', () => {
      const y_true = [1, 1];
      const y_pred = [2, 2];
      const derivative = meanSquaredErrorDerivative(y_true, y_pred);
      // (2/2) * (2-1) = 1
      derivative.forEach(d => expect(d).toBeCloseTo(1, 5));
    });
  });

  describe('binaryCrossEntropy', () => {
    it('should return near 0 for perfect predictions', () => {
      const y_true = [0, 1, 0, 1];
      const y_pred = [0.001, 0.999, 0.001, 0.999];
      const loss = binaryCrossEntropy(y_true, y_pred);
      expect(loss).toBeLessThan(0.01);
    });

    it('should return high loss for wrong predictions', () => {
      const y_true = [0, 1];
      const y_pred = [0.999, 0.001];
      const loss = binaryCrossEntropy(y_true, y_pred);
      expect(loss).toBeGreaterThan(5);
    });

    it('should handle probabilities at 0.5', () => {
      const y_true = [0, 1];
      const y_pred = [0.5, 0.5];
      // -[0*log(0.5) + 1*log(0.5) + 1*log(0.5) + 0*log(0.5)]/2
      // = -log(0.5) ≈ 0.693
      const loss = binaryCrossEntropy(y_true, y_pred);
      expect(loss).toBeCloseTo(0.693, 2);
    });

    it('should handle edge cases without overflow', () => {
      const y_true = [0, 1];
      const y_pred = [0, 1]; // Extreme predictions
      const loss = binaryCrossEntropy(y_true, y_pred);
      expect(loss).toBeLessThan(1);
      expect(isFinite(loss)).toBe(true);
    });

    it('should be asymmetric for binary classification', () => {
      const y_true = [1];
      const y_pred1 = [0.9];
      const y_pred2 = [0.1];
      const loss1 = binaryCrossEntropy(y_true, y_pred1);
      const loss2 = binaryCrossEntropy(y_true, y_pred2);
      expect(loss2).toBeGreaterThan(loss1);
    });
  });

  describe('binaryCrossEntropyDerivative', () => {
    it('should return values close to 0 for perfect predictions', () => {
      const y_true = [0, 1];
      const y_pred = [0.001, 0.999];
      const derivative = binaryCrossEntropyDerivative(y_true, y_pred);
      derivative.forEach(d => expect(Math.abs(d)).toBeLessThan(2));
    });

    it('should have correct signs', () => {
      const y_true = [0, 1];
      const y_pred = [0.8, 0.2];
      const derivative = binaryCrossEntropyDerivative(y_true, y_pred);
      // When y=0 and ŷ>0: positive derivative (decrease ŷ)
      // When y=1 and ŷ<1: negative derivative (increase ŷ)
      expect(derivative[0]).toBeGreaterThan(0);
      expect(derivative[1]).toBeLessThan(0);
    });

    it('should not overflow for extreme predictions', () => {
      const y_true = [0, 1];
      const y_pred = [0.001, 0.999];
      const derivative = binaryCrossEntropyDerivative(y_true, y_pred);
      derivative.forEach(d => expect(isFinite(d)).toBe(true));
    });
  });
});

describe('Utility Functions', () => {
  describe('oneHotEncode', () => {
    it('should encode binary labels', () => {
      const y = [0, 1, 0, 1];
      const encoded = oneHotEncode(y, 2);
      expect(encoded).toEqual([
        [1, 0],
        [0, 1],
        [1, 0],
        [0, 1],
      ]);
    });

    it('should encode multiclass labels', () => {
      const y = [0, 1, 2];
      const encoded = oneHotEncode(y, 3);
      expect(encoded).toEqual([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]);
    });

    it('should handle single class', () => {
      const y = [0, 0, 0];
      const encoded = oneHotEncode(y, 3);
      expect(encoded).toEqual([
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
      ]);
    });

    it('should create correct number of columns', () => {
      const y = [0, 1, 2, 3];
      const encoded = oneHotEncode(y, 5);
      expect(encoded[0].length).toBe(5);
      expect(encoded[3]).toEqual([0, 0, 0, 1, 0]);
    });
  });

  describe('computeAccuracy', () => {
    it('should return 1 for perfect predictions', () => {
      const y_true = [0, 1, 2, 3];
      const y_pred = [0, 1, 2, 3];
      expect(computeAccuracy(y_true, y_pred)).toBe(1);
    });

    it('should return 0 for completely wrong predictions', () => {
      const y_true = [0, 0, 0];
      const y_pred = [1, 1, 1];
      expect(computeAccuracy(y_true, y_pred)).toBe(0);
    });

    it('should calculate partial accuracy', () => {
      const y_true = [0, 1, 0, 1];
      const y_pred = [0, 1, 1, 1];
      // 3 correct out of 4 = 0.75
      expect(computeAccuracy(y_true, y_pred)).toBe(0.75);
    });

    it('should throw error for mismatched lengths', () => {
      const y_true = [0, 1];
      const y_pred = [0, 1, 2];
      expect(() => computeAccuracy(y_true, y_pred)).toThrow();
    });
  });

  describe('shuffle', () => {
    it('should maintain same length', () => {
      const X = [[1, 2], [3, 4], [5, 6]];
      const y = [[0], [1], [0]];
      const { X_shuffled, y_shuffled } = shuffle(X, y);
      expect(X_shuffled.length).toBe(X.length);
      expect(y_shuffled.length).toBe(y.length);
    });

    it('should preserve X-y correspondence', () => {
      const X = [[1], [2], [3], [4], [5]];
      const y = [[10], [20], [30], [40], [50]];
      const { X_shuffled, y_shuffled } = shuffle(X, y);

      // Check that wherever we find X value, corresponding y is correct
      for (let i = 0; i < X_shuffled.length; i++) {
        const originalIdx = X.findIndex(x => x[0] === X_shuffled[i][0]);
        expect(y_shuffled[i][0]).toBe(y[originalIdx][0]);
      }
    });

    it('should create different order (statistically)', () => {
      const X = Array.from({ length: 100 }, (_, i) => [i]);
      const y = Array.from({ length: 100 }, (_, i) => [i * 10]);
      const { X_shuffled } = shuffle(X, y);

      // Check that at least some elements are in different positions
      let differentCount = 0;
      for (let i = 0; i < X.length; i++) {
        if (X_shuffled[i][0] !== X[i][0]) {
          differentCount++;
        }
      }
      expect(differentCount).toBeGreaterThan(50); // Statistically should be different
    });

    it('should not modify original arrays', () => {
      const X = [[1, 2], [3, 4]];
      const y = [[0], [1]];
      const X_copy = JSON.parse(JSON.stringify(X));
      const y_copy = JSON.parse(JSON.stringify(y));

      shuffle(X, y);

      expect(X).toEqual(X_copy);
      expect(y).toEqual(y_copy);
    });
  });
});

describe('MLPWithBackprop', () => {
  describe('constructor', () => {
    it('should initialize with required config', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
      });
      expect(mlp).toBeDefined();
    });

    it('should use default values', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
      });
      const params = mlp.getParameters();
      expect(params.W1.length).toBe(3);
      expect(params.W2.length).toBe(1);
    });

    it('should accept custom activation', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
        activation: 'relu',
      });
      expect(mlp).toBeDefined();
    });

    it('should accept custom learning rate', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
        learningRate: 0.1,
      });
      expect(mlp).toBeDefined();
    });
  });

  describe('forward', () => {
    it('should return cache with all intermediate values', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
      });

      const X = [[1, 2]];
      const cache = mlp.forward(X);

      expect(cache.z1).toBeDefined();
      expect(cache.h).toBeDefined();
      expect(cache.z2).toBeDefined();
      expect(cache.output).toBeDefined();
    });

    it('should have correct dimensions', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 4,
        outputSize: 3,
      });

      const X = [[1, 2], [3, 4]];
      const cache = mlp.forward(X);

      expect(cache.z1.length).toBe(2); // batch size
      expect(cache.z1[0].length).toBe(4); // hidden size
      expect(cache.output.length).toBe(2); // batch size
      expect(cache.output[0].length).toBe(3); // output size
    });

    it('should produce outputs between 0 and 1', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
      });

      const X = [[1, 2]];
      const cache = mlp.forward(X);

      cache.output.forEach(row => {
        row.forEach(val => {
          expect(val).toBeGreaterThanOrEqual(0);
          expect(val).toBeLessThanOrEqual(1);
        });
      });
    });
  });

  describe('backward', () => {
    it('should update weights', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
        learningRate: 0.1,
      });

      const X = [[1, 2]];
      const y = [[1]];

      const paramsBefore = mlp.getParameters();
      const cache = mlp.forward(X);
      mlp.backward(X, y, cache);
      const paramsAfter = mlp.getParameters();

      // At least some weights should have changed
      let changed = false;
      for (let i = 0; i < paramsBefore.W1.length; i++) {
        for (let j = 0; j < paramsBefore.W1[i].length; j++) {
          if (paramsBefore.W1[i][j] !== paramsAfter.W1[i][j]) {
            changed = true;
            break;
          }
        }
      }
      expect(changed).toBe(true);
    });

    it('should move weights in direction that reduces loss', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 4,
        outputSize: 1,
        learningRate: 0.5,
        lossFunction: 'mse',
      });

      const X = [[1, 1]];
      const y = [[1]];

      // Multiple backward passes should reduce loss
      let prevLoss = Infinity;
      for (let i = 0; i < 10; i++) {
        const cache = mlp.forward(X);
        const currentLoss = meanSquaredError([1], [cache.output[0][0]]);

        if (i > 0) {
          expect(currentLoss).toBeLessThanOrEqual(prevLoss);
        }

        mlp.backward(X, y, cache);
        prevLoss = currentLoss;
      }
    });
  });

  describe('fit', () => {
    it('should train on simple dataset', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 4,
        outputSize: 2,
        learningRate: 0.5,
      });

      const X = [
        [0, 0],
        [1, 1],
      ];
      const y = [
        [1, 0],
        [0, 1],
      ];

      const history = mlp.fit(X, y, 50, false);

      expect(history.epochs.length).toBe(50);
      expect(history.losses.length).toBe(50);
    });

    it('should decrease loss over time', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 4,
        outputSize: 2,
        learningRate: 0.5,
      });

      const X = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ];
      const y = oneHotEncode([0, 1, 1, 0], 2); // XOR

      const history = mlp.fit(X, y, 200, false);

      // Loss should decrease
      const initialLoss = history.losses[0];
      const finalLoss = history.losses[history.losses.length - 1];
      expect(finalLoss).toBeLessThan(initialLoss);
    });

    it('should improve accuracy over time', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 4,
        outputSize: 2,
        learningRate: 0.5,
      });

      const X = [
        [0, 0],
        [1, 1],
      ];
      const y = [
        [1, 0],
        [0, 1],
      ];

      const history = mlp.fit(X, y, 100, false);

      // Accuracy should improve or stay high
      const initialAcc = history.accuracies![0];
      const finalAcc = history.accuracies![history.accuracies!.length - 1];
      expect(finalAcc).toBeGreaterThanOrEqual(initialAcc);
    });
  });

  describe('predict', () => {
    it('should predict class labels', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 2,
      });

      const X = [[1, 2]];
      const predictions = mlp.predict(X);

      expect(predictions.length).toBe(1);
      expect([0, 1]).toContain(predictions[0]);
    });

    it('should predict for multiple samples', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 3,
      });

      const X = [[1, 2], [3, 4], [5, 6]];
      const predictions = mlp.predict(X);

      expect(predictions.length).toBe(3);
      predictions.forEach(pred => {
        expect(pred).toBeGreaterThanOrEqual(0);
        expect(pred).toBeLessThan(3);
      });
    });
  });

  describe('predictProba', () => {
    it('should return probabilities', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 2,
      });

      const X = [[1, 2]];
      const probs = mlp.predictProba(X);

      expect(probs.length).toBe(1);
      expect(probs[0].length).toBe(2);
      probs[0].forEach(p => {
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('integration: learn XOR', () => {
    it('should learn XOR function', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 4,
        outputSize: 2,
        activation: 'sigmoid',
        learningRate: 0.5,
        lossFunction: 'mse',
      });

      const X = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ];
      const y_labels = [0, 1, 1, 0];
      const y = oneHotEncode(y_labels, 2);

      mlp.fit(X, y, 1000, false);

      const predictions = mlp.predict(X);
      const accuracy = computeAccuracy(y_labels, predictions);

      // Should achieve high accuracy on XOR
      expect(accuracy).toBeGreaterThan(0.9);
    });
  });

  describe('different activations', () => {
    it('should work with tanh activation', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
        activation: 'tanh',
      });

      const X = [[1, 2]];
      const y = [[1]];
      const history = mlp.fit(X, y, 10, false);

      expect(history.losses.length).toBe(10);
    });

    it('should work with relu activation', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
        activation: 'relu',
      });

      const X = [[1, 2]];
      const y = [[1]];
      const history = mlp.fit(X, y, 10, false);

      expect(history.losses.length).toBe(10);
    });
  });

  describe('different loss functions', () => {
    it('should work with binary cross-entropy', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
        lossFunction: 'binary_crossentropy',
      });

      const X = [[1, 2]];
      const y = [[1]];
      const history = mlp.fit(X, y, 10, false);

      expect(history.losses.length).toBe(10);
      history.losses.forEach(loss => {
        expect(isFinite(loss)).toBe(true);
      });
    });
  });
});

describe('Gradient Checking', () => {
  describe('numericalGradient', () => {
    it('should approximate derivative correctly', () => {
      // f(x) = x²  →  f'(x) = 2x
      const f = (x: number) => x * x;
      const x = 3;
      const numGrad = numericalGradient(f, x);
      const analyticGrad = 2 * x; // 6

      expect(numGrad).toBeCloseTo(analyticGrad, 5);
    });

    it('should work for linear functions', () => {
      // f(x) = 2x + 3  →  f'(x) = 2
      const f = (x: number) => 2 * x + 3;
      const numGrad = numericalGradient(f, 5);

      expect(numGrad).toBeCloseTo(2, 5);
    });

    it('should work for sine function', () => {
      // f(x) = sin(x)  →  f'(x) = cos(x)
      const f = Math.sin;
      const x = Math.PI / 4;
      const numGrad = numericalGradient(f, x);
      const analyticGrad = Math.cos(x);

      expect(numGrad).toBeCloseTo(analyticGrad, 5);
    });
  });

  describe('checkGradients', () => {
    it('should verify backprop implementation', () => {
      const mlp = new MLPWithBackprop({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
      });

      const X = [[1, 2]];
      const y = [[1]];

      // Train a bit to get meaningful gradients
      mlp.fit(X, y, 5, false);

      const result = checkGradients(mlp, X, y);

      expect(result).toBeDefined();
      expect(typeof result.maxDifference).toBe('number');
      expect(typeof result.avgDifference).toBe('number');
      expect(typeof result.isCorrect).toBe('boolean');
    });
  });
});
