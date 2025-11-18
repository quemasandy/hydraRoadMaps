import {
  predict,
  computeCost,
  computeGradient,
  shuffle,
  addBias,
  gradientDescent,
  stochasticGradientDescent,
  miniBatchGradientDescent,
  gradientDescentWithMomentum,
  adam,
  rmsprop,
} from './gradient-descent';

describe('Utility Functions', () => {
  describe('predict', () => {
    it('should predict correctly', () => {
      const X = [[1, 1], [1, 2], [1, 3]];
      const theta = [0, 2];
      const predictions = predict(X, theta);
      expect(predictions).toEqual([2, 4, 6]);
    });

    it('should handle multiple features', () => {
      const X = [[1, 2, 3], [1, 4, 5]];
      const theta = [1, 2, 3];
      const predictions = predict(X, theta);
      expect(predictions[0]).toBe(1 * 1 + 2 * 2 + 3 * 3); // 14
      expect(predictions[1]).toBe(1 * 1 + 4 * 2 + 5 * 3); // 24
    });
  });

  describe('computeCost', () => {
    it('should compute cost correctly', () => {
      const X = [[1, 1], [1, 2], [1, 3]];
      const y = [2, 4, 6];
      const theta = [0, 2];
      const cost = computeCost(X, y, theta);
      expect(cost).toBe(0); // Perfect fit
    });

    it('should compute non-zero cost', () => {
      const X = [[1, 1], [1, 2]];
      const y = [2, 4];
      const theta = [0, 1]; // Incorrect slope
      const cost = computeCost(X, y, theta);
      expect(cost).toBeGreaterThan(0);
      expect(cost).toBeCloseTo(1.25, 10); // (1² + 2²) / (2*2) = 1.25
    });
  });

  describe('computeGradient', () => {
    it('should compute gradient correctly', () => {
      const X = [[1, 1], [1, 2], [1, 3]];
      const y = [2, 4, 6];
      const theta = [0, 2];
      const gradient = computeGradient(X, y, theta);
      expect(gradient[0]).toBeCloseTo(0, 10);
      expect(gradient[1]).toBeCloseTo(0, 10);
    });

    it('should compute non-zero gradient', () => {
      const X = [[1, 1], [1, 2]];
      const y = [3, 5];
      const theta = [0, 0]; // Starting point
      const gradient = computeGradient(X, y, theta);
      expect(gradient[0]).toBeCloseTo(-4, 10); // -(3+5)/2
      expect(gradient[1]).toBeCloseTo(-6.5, 10); // -(3*1+5*2)/2
    });
  });

  describe('shuffle', () => {
    it('should shuffle array', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffle(arr);
      expect(shuffled.length).toBe(arr.length);
      expect(shuffled.sort()).toEqual(arr.sort());
    });

    it('should not modify original array', () => {
      const arr = [1, 2, 3];
      const original = [...arr];
      shuffle(arr);
      expect(arr).toEqual(original);
    });
  });

  describe('addBias', () => {
    it('should add bias column', () => {
      const X = [[1, 2], [3, 4]];
      const result = addBias(X);
      expect(result).toEqual([[1, 1, 2], [1, 3, 4]]);
    });

    it('should handle empty matrix', () => {
      const X: number[][] = [];
      const result = addBias(X);
      expect(result).toEqual([]);
    });
  });
});

describe('Gradient Descent Algorithms', () => {
  let X: number[][];
  let y: number[];

  beforeEach(() => {
    // Simple linear relationship: y = 2x + 1
    X = [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5]];
    y = [3, 5, 7, 9, 11];
  });

  describe('gradientDescent', () => {
    it('should converge to correct parameters', () => {
      const result = gradientDescent(X, y, {
        learningRate: 0.01,
        iterations: 1000,
      });

      expect(result.theta[0]).toBeCloseTo(1, 0);
      expect(result.theta[1]).toBeCloseTo(2, 0);
    });

    it('should reduce cost over iterations', () => {
      const result = gradientDescent(X, y, {
        learningRate: 0.01,
        iterations: 100,
      });

      for (let i = 1; i < result.costs.length; i++) {
        expect(result.costs[i]).toBeLessThanOrEqual(result.costs[i - 1]);
      }
    });

    it('should stop early with tolerance', () => {
      const result = gradientDescent(X, y, {
        learningRate: 0.01,
        iterations: 10000,
        tolerance: 1e-6,
      });

      expect(result.iterations).toBeLessThan(10000);
    });

    it('should throw on mismatched dimensions', () => {
      expect(() =>
        gradientDescent([[1, 2]], [1, 2], {
          learningRate: 0.01,
          iterations: 10,
        })
      ).toThrow();
    });

    it('should throw on empty data', () => {
      expect(() =>
        gradientDescent([], [], {
          learningRate: 0.01,
          iterations: 10,
        })
      ).toThrow();
    });

    it('should handle different learning rates', () => {
      const result1 = gradientDescent(X, y, {
        learningRate: 0.001,
        iterations: 100,
      });

      const result2 = gradientDescent(X, y, {
        learningRate: 0.1,
        iterations: 100,
      });

      // Higher learning rate should converge faster
      expect(result2.costs[99]).toBeLessThan(result1.costs[99]);
    });
  });

  describe('stochasticGradientDescent', () => {
    it('should converge to reasonable parameters', () => {
      const result = stochasticGradientDescent(X, y, {
        learningRate: 0.01,
        iterations: 100,
        epochs: 100,
      });

      expect(result.theta[0]).toBeCloseTo(1, 0);
      expect(result.theta[1]).toBeCloseTo(2, 0);
    });

    it('should generally reduce cost', () => {
      const result = stochasticGradientDescent(X, y, {
        learningRate: 0.01,
        iterations: 100,
        epochs: 50,
      });

      // Final cost should be lower than initial
      expect(result.costs[result.costs.length - 1]).toBeLessThan(
        result.costs[0]
      );
    });

    it('should run for specified epochs', () => {
      const epochs = 10;
      const result = stochasticGradientDescent(X, y, {
        learningRate: 0.01,
        iterations: 100,
        epochs,
      });

      expect(result.costs.length).toBeLessThanOrEqual(epochs);
    });
  });

  describe('miniBatchGradientDescent', () => {
    it('should converge to correct parameters', () => {
      const result = miniBatchGradientDescent(X, y, {
        learningRate: 0.01,
        iterations: 100,
        batchSize: 2,
      });

      expect(result.theta[0]).toBeCloseTo(1, 0);
      expect(result.theta[1]).toBeCloseTo(2, 0);
    });

    it('should handle different batch sizes', () => {
      const result1 = miniBatchGradientDescent(X, y, {
        learningRate: 0.01,
        iterations: 100,
        batchSize: 1,
      });

      const result2 = miniBatchGradientDescent(X, y, {
        learningRate: 0.01,
        iterations: 100,
        batchSize: 5,
      });

      // Both should converge
      expect(result1.costs[result1.costs.length - 1]).toBeLessThan(
        result1.costs[0]
      );
      expect(result2.costs[result2.costs.length - 1]).toBeLessThan(
        result2.costs[0]
      );
    });
  });

  describe('gradientDescentWithMomentum', () => {
    it('should converge to correct parameters', () => {
      const result = gradientDescentWithMomentum(X, y, {
        learningRate: 0.01,
        iterations: 1000,
        momentum: 0.9,
      });

      expect(result.theta[0]).toBeCloseTo(1, 0);
      expect(result.theta[1]).toBeCloseTo(2, 0);
    });

    it('should converge faster than vanilla GD', () => {
      const resultVanilla = gradientDescent(X, y, {
        learningRate: 0.01,
        iterations: 100,
      });

      const resultMomentum = gradientDescentWithMomentum(X, y, {
        learningRate: 0.01,
        iterations: 100,
        momentum: 0.9,
      });

      // Momentum should reach lower cost in same iterations
      expect(
        resultMomentum.costs[resultMomentum.costs.length - 1]
      ).toBeLessThanOrEqual(
        resultVanilla.costs[resultVanilla.costs.length - 1]
      );
    });

    it('should generally reduce cost', () => {
      const result = gradientDescentWithMomentum(X, y, {
        learningRate: 0.01,
        iterations: 100,
        momentum: 0.9,
      });

      // Final cost should be lower than initial (may not be strictly monotonic)
      expect(result.costs[result.costs.length - 1]).toBeLessThan(
        result.costs[0]
      );
    });
  });

  describe('adam', () => {
    it('should converge to correct parameters', () => {
      const result = adam(X, y, {
        learningRate: 0.1,
        iterations: 1000,
      });

      expect(result.theta[0]).toBeCloseTo(1, 0);
      expect(result.theta[1]).toBeCloseTo(2, 0);
    });

    it('should converge very fast', () => {
      const result = adam(X, y, {
        learningRate: 0.1,
        iterations: 100,
      });

      // Should reach very low cost quickly
      expect(result.costs[result.costs.length - 1]).toBeLessThan(0.1);
    });

    it('should handle custom beta parameters', () => {
      const result = adam(X, y, {
        learningRate: 0.1,
        iterations: 100,
        beta1: 0.95,
        beta2: 0.999,
      });

      expect(result.theta.length).toBe(2);
      expect(result.costs.length).toBe(100);
    });

    it('should be more stable than vanilla GD', () => {
      // Adam should work well even with higher learning rate
      const result = adam(X, y, {
        learningRate: 0.5,
        iterations: 100,
      });

      expect(result.theta[0]).toBeCloseTo(1, 0);
      expect(result.theta[1]).toBeCloseTo(2, 0);
    });
  });

  describe('rmsprop', () => {
    it('should converge to correct parameters', () => {
      const result = rmsprop(X, y, {
        learningRate: 0.1,
        iterations: 1000,
      });

      expect(result.theta[0]).toBeCloseTo(1, 0);
      expect(result.theta[1]).toBeCloseTo(2, 0);
    });

    it('should reduce cost monotonically', () => {
      const result = rmsprop(X, y, {
        learningRate: 0.01,
        iterations: 100,
      });

      for (let i = 1; i < result.costs.length; i++) {
        expect(result.costs[i]).toBeLessThanOrEqual(result.costs[i - 1]);
      }
    });

    it('should converge to low cost', () => {
      const resultRMSprop = rmsprop(X, y, {
        learningRate: 0.1,
        iterations: 200,
      });

      // Should reach very low cost
      expect(
        resultRMSprop.costs[resultRMSprop.costs.length - 1]
      ).toBeLessThan(0.1);
    });
  });
});

describe('Optimizer Comparison', () => {
  const X = [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5]];
  const y = [3, 5, 7, 9, 11];

  it('all optimizers should converge to similar solutions', () => {
    const resultGD = gradientDescent(X, y, {
      learningRate: 0.01,
      iterations: 1000,
    });

    const resultMomentum = gradientDescentWithMomentum(X, y, {
      learningRate: 0.01,
      iterations: 1000,
      momentum: 0.9,
    });

    const resultAdam = adam(X, y, {
      learningRate: 0.1,
      iterations: 1000,
    });

    const resultRMSprop = rmsprop(X, y, {
      learningRate: 0.1,
      iterations: 1000,
    });

    // All should converge to approximately [1, 2]
    expect(resultGD.theta[0]).toBeCloseTo(1, 0);
    expect(resultMomentum.theta[0]).toBeCloseTo(1, 0);
    expect(resultAdam.theta[0]).toBeCloseTo(1, 0);
    expect(resultRMSprop.theta[0]).toBeCloseTo(1, 0);

    expect(resultGD.theta[1]).toBeCloseTo(2, 0);
    expect(resultMomentum.theta[1]).toBeCloseTo(2, 0);
    expect(resultAdam.theta[1]).toBeCloseTo(2, 0);
    expect(resultRMSprop.theta[1]).toBeCloseTo(2, 0);
  });

  it('Adam should converge to very low cost', () => {
    const resultAdam = adam(X, y, {
      learningRate: 0.1,
      iterations: 200,
    });

    // Adam should reach very low cost
    expect(resultAdam.costs[resultAdam.costs.length - 1]).toBeLessThan(0.01);
  });
});

describe('Real-world scenario', () => {
  it('should fit house price prediction model', () => {
    // House sizes and prices
    const sizes = [50, 80, 100, 120, 150];
    const prices = [100, 160, 200, 240, 300];

    const X = sizes.map(size => [1, size]);

    const result = adam(X, prices, {
      learningRate: 0.01,
      iterations: 1000,
    });

    // Should learn positive slope (bigger house = higher price)
    expect(result.theta[1]).toBeGreaterThan(0);

    // Make predictions
    const testX = [[1, 90], [1, 110]];
    const predictions = predict(testX, result.theta);

    // Predictions should be reasonable
    expect(predictions[0]).toBeGreaterThan(150);
    expect(predictions[0]).toBeLessThan(200);
    expect(predictions[1]).toBeGreaterThan(200);
    expect(predictions[1]).toBeLessThan(250);

    // Bigger house should cost more
    expect(predictions[1]).toBeGreaterThan(predictions[0]);
  });
});
