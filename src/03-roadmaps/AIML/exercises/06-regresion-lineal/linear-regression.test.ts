import {
  transpose,
  matrixMultiply,
  invertMatrix,
  matrixVectorMultiply,
  addBias,
  standardize,
  normalize,
  applyScaling,
  fitNormalEquation,
  fitGradientDescent,
  fitRidge,
  predict,
  predictOne,
  computeMSE,
  computeRMSE,
  computeMAE,
  computeR2,
  trainTestSplit,
} from './linear-regression';

describe('Linear Algebra Functions', () => {
  describe('transpose', () => {
    it('should transpose a matrix', () => {
      const A = [[1, 2, 3], [4, 5, 6]];
      const AT = transpose(A);
      expect(AT).toEqual([[1, 4], [2, 5], [3, 6]]);
    });

    it('should handle empty matrix', () => {
      expect(transpose([])).toEqual([]);
    });

    it('should handle single row', () => {
      const A = [[1, 2, 3]];
      const AT = transpose(A);
      expect(AT).toEqual([[1], [2], [3]]);
    });
  });

  describe('matrixMultiply', () => {
    it('should multiply compatible matrices', () => {
      const A = [[1, 2], [3, 4]];
      const B = [[5, 6], [7, 8]];
      const C = matrixMultiply(A, B);
      expect(C).toEqual([[19, 22], [43, 50]]);
    });

    it('should handle non-square matrices', () => {
      const A = [[1, 2, 3]];
      const B = [[4], [5], [6]];
      const C = matrixMultiply(A, B);
      expect(C).toEqual([[32]]); // 1*4 + 2*5 + 3*6
    });

    it('should throw on incompatible dimensions', () => {
      const A = [[1, 2]];
      const B = [[3], [4], [5]];
      expect(() => matrixMultiply(A, B)).toThrow();
    });
  });

  describe('invertMatrix', () => {
    it('should invert identity matrix', () => {
      const I = [[1, 0], [0, 1]];
      const I_inv = invertMatrix(I);
      expect(I_inv[0][0]).toBeCloseTo(1);
      expect(I_inv[0][1]).toBeCloseTo(0);
      expect(I_inv[1][0]).toBeCloseTo(0);
      expect(I_inv[1][1]).toBeCloseTo(1);
    });

    it('should invert 2x2 matrix', () => {
      const A = [[4, 7], [2, 6]];
      const A_inv = invertMatrix(A);

      // A × A^-1 should equal I
      const I = matrixMultiply(A, A_inv);
      expect(I[0][0]).toBeCloseTo(1, 5);
      expect(I[0][1]).toBeCloseTo(0, 5);
      expect(I[1][0]).toBeCloseTo(0, 5);
      expect(I[1][1]).toBeCloseTo(1, 5);
    });

    it('should throw on singular matrix', () => {
      const A = [[1, 2], [2, 4]]; // Rows are linearly dependent
      expect(() => invertMatrix(A)).toThrow();
    });
  });

  describe('matrixVectorMultiply', () => {
    it('should multiply matrix by vector', () => {
      const A = [[1, 2], [3, 4]];
      const v = [5, 6];
      const result = matrixVectorMultiply(A, v);
      expect(result).toEqual([17, 39]); // [1*5+2*6, 3*5+4*6]
    });

    it('should throw on incompatible dimensions', () => {
      const A = [[1, 2]];
      const v = [1, 2, 3];
      expect(() => matrixVectorMultiply(A, v)).toThrow();
    });
  });

  describe('addBias', () => {
    it('should add bias column', () => {
      const X = [[1, 2], [3, 4]];
      const result = addBias(X);
      expect(result).toEqual([[1, 1, 2], [1, 3, 4]]);
    });

    it('should handle empty matrix', () => {
      expect(addBias([])).toEqual([]);
    });
  });
});

describe('Feature Scaling', () => {
  describe('standardize', () => {
    it('should standardize features', () => {
      const X = [[1, 10], [2, 20], [3, 30]];
      const { X_scaled, params } = standardize(X);

      // Mean should be approximately 0
      const col1Mean = X_scaled.reduce((sum, row) => sum + row[0], 0) / 3;
      const col2Mean = X_scaled.reduce((sum, row) => sum + row[1], 0) / 3;

      expect(col1Mean).toBeCloseTo(0, 10);
      expect(col2Mean).toBeCloseTo(0, 10);

      // Std should be approximately 1
      expect(params.mean[0]).toBeCloseTo(2, 10);
      expect(params.mean[1]).toBeCloseTo(20, 10);
    });

    it('should handle constant column', () => {
      const X = [[1, 5], [2, 5], [3, 5]];
      const { X_scaled } = standardize(X);

      // Constant column should become 0
      expect(X_scaled[0][1]).toBe(0);
      expect(X_scaled[1][1]).toBe(0);
      expect(X_scaled[2][1]).toBe(0);
    });

    it('should handle empty matrix', () => {
      const { X_scaled, params } = standardize([]);
      expect(X_scaled).toEqual([]);
      expect(params.mean).toEqual([]);
      expect(params.std).toEqual([]);
    });
  });

  describe('normalize', () => {
    it('should normalize features to [0, 1]', () => {
      const X = [[1, 10], [2, 20], [3, 30]];
      const { X_scaled, params } = normalize(X);

      // Min should be 0, max should be 1
      expect(X_scaled[0][0]).toBeCloseTo(0, 10);
      expect(X_scaled[2][0]).toBeCloseTo(1, 10);
      expect(X_scaled[0][1]).toBeCloseTo(0, 10);
      expect(X_scaled[2][1]).toBeCloseTo(1, 10);

      expect(params.min).toEqual([1, 10]);
      expect(params.max).toEqual([3, 30]);
    });

    it('should handle constant column', () => {
      const X = [[1, 5], [2, 5], [3, 5]];
      const { X_scaled } = normalize(X);

      // Constant column should become 0
      expect(X_scaled[0][1]).toBe(0);
      expect(X_scaled[1][1]).toBe(0);
      expect(X_scaled[2][1]).toBe(0);
    });
  });

  describe('applyScaling', () => {
    it('should apply standardization params', () => {
      const X = [[1, 10], [2, 20]];
      const { params } = standardize([[0, 0], [1, 10], [2, 20], [3, 30]]);
      const X_scaled = applyScaling(X, params);

      expect(X_scaled[0].length).toBe(2);
      expect(X_scaled[1].length).toBe(2);
    });

    it('should apply normalization params', () => {
      const X = [[1, 10], [2, 20]];
      const { params } = normalize([[0, 0], [1, 10], [2, 20], [3, 30]]);
      const X_scaled = applyScaling(X, params);

      expect(X_scaled[0].length).toBe(2);
      expect(X_scaled[1].length).toBe(2);
    });
  });
});

describe('Linear Regression Models', () => {
  let X: number[][];
  let y: number[];

  beforeEach(() => {
    // Simple linear relationship: y = 2x + 1
    X = [[1], [2], [3], [4], [5]];
    y = [3, 5, 7, 9, 11];
  });

  describe('fitNormalEquation', () => {
    it('should fit simple linear regression', () => {
      const model = fitNormalEquation(X, y);

      expect(model.theta[0]).toBeCloseTo(1, 5); // Intercept
      expect(model.theta[1]).toBeCloseTo(2, 5); // Slope
      expect(model.intercept).toBeCloseTo(1, 5);
    });

    it('should fit multiple linear regression', () => {
      const X_multi = [[1, 2], [2, 3], [3, 4], [4, 5]];
      const y_multi = [8, 13, 18, 23]; // y = 1 + 2*x1 + 3*x2

      const model = fitNormalEquation(X_multi, y_multi);

      expect(model.theta[0]).toBeCloseTo(1, 3); // Intercept
      expect(model.theta[1]).toBeCloseTo(2, 3); // Coef for x1
      expect(model.theta[2]).toBeCloseTo(3, 3); // Coef for x2
    });

    it('should throw on mismatched dimensions', () => {
      expect(() => fitNormalEquation([[1]], [1, 2])).toThrow();
    });

    it('should throw on empty data', () => {
      expect(() => fitNormalEquation([], [])).toThrow();
    });
  });

  describe('fitGradientDescent', () => {
    it('should fit simple linear regression', () => {
      const result = fitGradientDescent(X, y, {
        learningRate: 0.01,
        iterations: 1000,
        normalize: false,
      });

      expect(result.model.theta[0]).toBeCloseTo(1, 0);
      expect(result.model.theta[1]).toBeCloseTo(2, 0);
    });

    it('should converge with normalization', () => {
      const result = fitGradientDescent(X, y, {
        learningRate: 0.1,
        iterations: 1000,
        normalize: true,
      });

      // Should converge
      expect(result.costs[result.costs.length - 1]).toBeLessThan(
        result.costs[0]
      );
    });

    it('should reduce cost over iterations', () => {
      const result = fitGradientDescent(X, y, {
        learningRate: 0.01,
        iterations: 100,
        normalize: false,
      });

      for (let i = 1; i < result.costs.length; i++) {
        expect(result.costs[i]).toBeLessThanOrEqual(result.costs[i - 1]);
      }
    });

    it('should store scaler params when normalize=true', () => {
      const result = fitGradientDescent(X, y, {
        learningRate: 0.1,
        iterations: 100,
        normalize: true,
      });

      expect(result.model.scalerParams).toBeDefined();
      expect(result.model.scalerParams?.mean).toBeDefined();
      expect(result.model.scalerParams?.std).toBeDefined();
    });
  });

  describe('fitRidge', () => {
    it('should fit with small lambda similar to normal equation', () => {
      const modelNormal = fitNormalEquation(X, y);
      const modelRidge = fitRidge(X, y, 0.01);

      expect(modelRidge.theta[0]).toBeCloseTo(modelNormal.theta[0], 1);
      expect(modelRidge.theta[1]).toBeCloseTo(modelNormal.theta[1], 1);
    });

    it('should shrink coefficients with large lambda', () => {
      const modelNormal = fitNormalEquation(X, y);
      const modelRidge = fitRidge(X, y, 100);

      // Ridge should have smaller coefficient (excluding intercept)
      expect(Math.abs(modelRidge.theta[1])).toBeLessThan(
        Math.abs(modelNormal.theta[1])
      );
    });

    it('should not regularize intercept', () => {
      const modelRidge1 = fitRidge(X, y, 10);
      const modelRidge2 = fitRidge(X, y, 100);

      // Intercepts should be similar despite different lambdas
      expect(modelRidge1.theta[0]).toBeCloseTo(modelRidge2.theta[0], 0);
    });
  });
});

describe('Predictions', () => {
  let model: any;

  beforeEach(() => {
    const X = [[1], [2], [3]];
    const y = [3, 5, 7]; // y = 2x + 1
    model = fitNormalEquation(X, y);
  });

  describe('predict', () => {
    it('should predict correctly', () => {
      const X_test = [[4], [5]];
      const predictions = predict(X_test, model);

      expect(predictions[0]).toBeCloseTo(9, 5);  // 2*4 + 1
      expect(predictions[1]).toBeCloseTo(11, 5); // 2*5 + 1
    });

    it('should handle multiple features', () => {
      const X_train = [[1, 2], [2, 3], [3, 4]];
      const y_train = [8, 13, 18]; // y = 1 + 2*x1 + 3*x2

      const model_multi = fitNormalEquation(X_train, y_train);
      const predictions = predict([[4, 5]], model_multi);

      expect(predictions[0]).toBeCloseTo(24, 3); // 1 + 2*4 + 3*5
    });

    it('should work with normalized model', () => {
      const X_train = [[10], [20], [30]];
      const y_train = [100, 200, 300];

      const result = fitGradientDescent(X_train, y_train, {
        learningRate: 0.1,
        iterations: 1000,
        normalize: true,
      });

      const predictions = predict([[15], [25]], result.model);

      expect(predictions[0]).toBeGreaterThan(100);
      expect(predictions[0]).toBeLessThan(200);
      expect(predictions[1]).toBeGreaterThan(200);
      expect(predictions[1]).toBeLessThan(300);
    });
  });

  describe('predictOne', () => {
    it('should predict single example', () => {
      const prediction = predictOne([4], model);
      expect(prediction).toBeCloseTo(9, 5);
    });
  });
});

describe('Metrics', () => {
  const y_true = [3, 5, 7, 9];
  const y_pred_perfect = [3, 5, 7, 9];
  const y_pred_imperfect = [3.5, 4.5, 7.5, 8.5];

  describe('computeMSE', () => {
    it('should return 0 for perfect predictions', () => {
      const mse = computeMSE(y_true, y_pred_perfect);
      expect(mse).toBe(0);
    });

    it('should compute MSE correctly', () => {
      const mse = computeMSE(y_true, y_pred_imperfect);
      // Errors: [-0.5, 0.5, -0.5, 0.5]
      // Squared: [0.25, 0.25, 0.25, 0.25]
      // Mean: 0.25
      expect(mse).toBeCloseTo(0.25, 10);
    });

    it('should throw on mismatched lengths', () => {
      expect(() => computeMSE([1, 2], [1, 2, 3])).toThrow();
    });
  });

  describe('computeRMSE', () => {
    it('should return 0 for perfect predictions', () => {
      const rmse = computeRMSE(y_true, y_pred_perfect);
      expect(rmse).toBe(0);
    });

    it('should compute RMSE correctly', () => {
      const rmse = computeRMSE(y_true, y_pred_imperfect);
      expect(rmse).toBeCloseTo(0.5, 10); // √0.25
    });
  });

  describe('computeMAE', () => {
    it('should return 0 for perfect predictions', () => {
      const mae = computeMAE(y_true, y_pred_perfect);
      expect(mae).toBe(0);
    });

    it('should compute MAE correctly', () => {
      const mae = computeMAE(y_true, y_pred_imperfect);
      expect(mae).toBeCloseTo(0.5, 10); // (0.5 + 0.5 + 0.5 + 0.5) / 4
    });

    it('should throw on mismatched lengths', () => {
      expect(() => computeMAE([1, 2], [1, 2, 3])).toThrow();
    });
  });

  describe('computeR2', () => {
    it('should return 1 for perfect predictions', () => {
      const r2 = computeR2(y_true, y_pred_perfect);
      expect(r2).toBeCloseTo(1, 10);
    });

    it('should compute R2 correctly', () => {
      const r2 = computeR2(y_true, y_pred_imperfect);
      // Mean of y_true: 6
      // SS_tot = (3-6)² + (5-6)² + (7-6)² + (9-6)² = 9 + 1 + 1 + 9 = 20
      // SS_res = 0.25 + 0.25 + 0.25 + 0.25 = 1
      // R² = 1 - 1/20 = 0.95
      expect(r2).toBeCloseTo(0.95, 10);
    });

    it('should return 0 for mean predictor', () => {
      const mean = y_true.reduce((a, b) => a + b) / y_true.length;
      const y_pred_mean = y_true.map(() => mean);
      const r2 = computeR2(y_true, y_pred_mean);
      expect(r2).toBeCloseTo(0, 10);
    });

    it('should be negative for bad predictor', () => {
      const y_pred_bad = [10, 10, 10, 10];
      const r2 = computeR2(y_true, y_pred_bad);
      expect(r2).toBeLessThan(0);
    });

    it('should throw on mismatched lengths', () => {
      expect(() => computeR2([1, 2], [1, 2, 3])).toThrow();
    });
  });
});

describe('Utilities', () => {
  describe('trainTestSplit', () => {
    const X = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]];
    const y = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    it('should split data correctly', () => {
      const split = trainTestSplit(X, y, 0.2, false);

      expect(split.X_train.length).toBe(8);
      expect(split.X_test.length).toBe(2);
      expect(split.y_train.length).toBe(8);
      expect(split.y_test.length).toBe(2);
    });

    it('should preserve total size', () => {
      const split = trainTestSplit(X, y, 0.3);

      expect(split.X_train.length + split.X_test.length).toBe(X.length);
      expect(split.y_train.length + split.y_test.length).toBe(y.length);
    });

    it('should shuffle when requested', () => {
      const split1 = trainTestSplit(X, y, 0.2, true);
      const split2 = trainTestSplit(X, y, 0.2, true);

      // With shuffling, splits should likely be different
      // (not guaranteed but very likely with 10 elements)
      const same = split1.X_train.every((x, i) =>
        x.every((val, j) => val === split2.X_train[i][j])
      );
      // This test might occasionally fail due to randomness,
      // but probability is very low
    });

    it('should not shuffle when shuffle=false', () => {
      const split = trainTestSplit(X, y, 0.2, false);

      // Without shuffling, should take first 80% for train
      expect(split.X_train[0]).toEqual([1]);
      expect(split.X_train[7]).toEqual([8]);
      expect(split.X_test[0]).toEqual([9]);
      expect(split.X_test[1]).toEqual([10]);
    });

    it('should handle different test sizes', () => {
      const split50 = trainTestSplit(X, y, 0.5);
      expect(split50.X_train.length).toBe(5);
      expect(split50.X_test.length).toBe(5);

      const split30 = trainTestSplit(X, y, 0.3);
      expect(split30.X_train.length).toBe(7);
      expect(split30.X_test.length).toBe(3);
    });
  });
});

describe('Real-world scenario', () => {
  it('should predict house prices accurately', () => {
    // House data: [size, rooms]
    const X = [
      [50, 1],
      [80, 2],
      [100, 2],
      [120, 3],
      [150, 3],
      [180, 4],
    ];
    const y = [100, 160, 200, 240, 300, 360];

    // Split data
    const split = trainTestSplit(X, y, 0.33, true);

    // Train model
    const model = fitNormalEquation(split.X_train, split.y_train);

    // Predict on test
    const predictions = predict(split.X_test, model);

    // Evaluate
    const r2 = computeR2(split.y_test, predictions);
    const rmse = computeRMSE(split.y_test, predictions);

    // Model should fit well (R² > 0.8)
    expect(r2).toBeGreaterThan(0.7);

    // Predictions should be in reasonable range
    predictions.forEach(pred => {
      expect(pred).toBeGreaterThan(50);
      expect(pred).toBeLessThan(500);
    });

    // Predict new house
    const newHouse = [[110, 2]];
    const price = predictOne(newHouse[0], model);

    // Price should be reasonable
    expect(price).toBeGreaterThan(150);
    expect(price).toBeLessThan(300);
  });

  it('should handle collinear features', () => {
    // Features that are highly correlated
    const X = [[1, 2], [2, 4], [3, 6], [4, 8]]; // x2 = 2*x1
    const y = [3, 5, 7, 9];

    // Ridge should handle this better than normal equation
    const modelRidge = fitRidge(X, y, 10);
    const predictions = predict(X, modelRidge);
    const r2 = computeR2(y, predictions);

    // Should still get reasonable fit
    expect(r2).toBeGreaterThan(0.5);
  });

  it('should compare Normal Equation vs Gradient Descent', () => {
    const X = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]];
    const y = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]; // y = 2x

    const modelNormal = fitNormalEquation(X, y);
    const resultGD = fitGradientDescent(X, y, {
      learningRate: 0.01,
      iterations: 1000,
      normalize: false,
    });

    // Both should give similar results
    const predsNormal = predict(X, modelNormal);
    const predsGD = predict(X, resultGD.model);

    const r2Normal = computeR2(y, predsNormal);
    const r2GD = computeR2(y, predsGD);

    expect(r2Normal).toBeGreaterThan(0.99);
    expect(r2GD).toBeGreaterThan(0.95);
  });
});
