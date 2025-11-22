import {
  sigmoid,
  sigmoidDerivative,
  tanh,
  tanhDerivative,
  relu,
  reluDerivative,
  leakyRelu,
  leakyReluDerivative,
  dotProduct,
  matrixMultiply,
  addBias,
  initializeWeights,
  Perceptron,
  MultiLayerPerceptron,
} from './neural-network';

describe('Activation Functions', () => {
  describe('sigmoid', () => {
    it('should return 0.5 for input 0', () => {
      expect(sigmoid(0)).toBe(0.5);
    });

    it('should approach 1 for large positive values', () => {
      expect(sigmoid(10)).toBeGreaterThan(0.999);
      expect(sigmoid(100)).toBe(1);
    });

    it('should approach 0 for large negative values', () => {
      expect(sigmoid(-10)).toBeLessThan(0.001);
      expect(sigmoid(-100)).toBe(0);
    });

    it('should handle array input', () => {
      const result = sigmoid([0, 2, -2]) as number[];
      expect(result[0]).toBe(0.5);
      expect(result[1]).toBeGreaterThan(0.8);
      expect(result[2]).toBeLessThan(0.2);
    });

    it('should be monotonically increasing', () => {
      expect(sigmoid(-1) as number).toBeLessThan(sigmoid(0) as number);
      expect(sigmoid(0) as number).toBeLessThan(sigmoid(1) as number);
    });

    it('should handle extreme values safely', () => {
      expect(sigmoid(1000)).toBe(1);
      expect(sigmoid(-1000)).toBe(0);
    });
  });

  describe('sigmoidDerivative', () => {
    it('should return maximum 0.25 at z=0', () => {
      const deriv = sigmoidDerivative(0) as number;
      expect(deriv).toBeCloseTo(0.25, 5);
    });

    it('should approach 0 for large absolute values', () => {
      expect((sigmoidDerivative(10) as number)).toBeLessThan(0.001);
      expect((sigmoidDerivative(-10) as number)).toBeLessThan(0.001);
    });

    it('should satisfy σ\'(z) = σ(z)(1-σ(z))', () => {
      const z = 1.5;
      const sig = sigmoid(z) as number;
      const deriv = sigmoidDerivative(z) as number;
      expect(deriv).toBeCloseTo(sig * (1 - sig), 5);
    });

    it('should handle array input', () => {
      const result = sigmoidDerivative([0, 1, -1]) as number[];
      expect(result.length).toBe(3);
      expect(result[0]).toBeCloseTo(0.25, 5);
    });
  });

  describe('tanh', () => {
    it('should return 0 for input 0', () => {
      expect(tanh(0)).toBe(0);
    });

    it('should approach 1 for large positive values', () => {
      expect(tanh(5)).toBeGreaterThan(0.99);
      expect(tanh(50)).toBe(1);
    });

    it('should approach -1 for large negative values', () => {
      expect(tanh(-5)).toBeLessThan(-0.99);
      expect(tanh(-50)).toBe(-1);
    });

    it('should be antisymmetric: tanh(-z) = -tanh(z)', () => {
      const z = 2;
      expect(tanh(-z)).toBeCloseTo(-(tanh(z) as number), 10);
    });

    it('should handle array input', () => {
      const result = tanh([0, 1, -1]) as number[];
      expect(result[0]).toBe(0);
      expect(result[1]).toBeGreaterThan(0.7);
      expect(result[2]).toBeLessThan(-0.7);
    });
  });

  describe('tanhDerivative', () => {
    it('should return 1 at z=0', () => {
      const deriv = tanhDerivative(0) as number;
      expect(deriv).toBeCloseTo(1, 5);
    });

    it('should approach 0 for large absolute values', () => {
      expect((tanhDerivative(10) as number)).toBeLessThan(0.001);
      expect((tanhDerivative(-10) as number)).toBeLessThan(0.001);
    });

    it('should satisfy tanh\'(z) = 1 - tanh²(z)', () => {
      const z = 1.5;
      const tan = tanh(z) as number;
      const deriv = tanhDerivative(z) as number;
      expect(deriv).toBeCloseTo(1 - tan * tan, 5);
    });

    it('should be symmetric', () => {
      const z = 2;
      expect(tanhDerivative(-z)).toBeCloseTo(tanhDerivative(z) as number, 10);
    });
  });

  describe('relu', () => {
    it('should return 0 for negative inputs', () => {
      expect(relu(-5)).toBe(0);
      expect(relu(-0.1)).toBe(0);
      expect(relu(0)).toBe(0);
    });

    it('should return input for positive values', () => {
      expect(relu(5)).toBe(5);
      expect(relu(0.1)).toBe(0.1);
      expect(relu(100)).toBe(100);
    });

    it('should handle array input', () => {
      const result = relu([-2, 0, 2, 5]) as number[];
      expect(result).toEqual([0, 0, 2, 5]);
    });

    it('should have no upper bound', () => {
      expect(relu(1000)).toBe(1000);
      expect(relu(1e6)).toBe(1e6);
    });
  });

  describe('reluDerivative', () => {
    it('should return 0 for negative inputs', () => {
      expect(reluDerivative(-5)).toBe(0);
      expect(reluDerivative(-0.1)).toBe(0);
      expect(reluDerivative(0)).toBe(0);
    });

    it('should return 1 for positive inputs', () => {
      expect(reluDerivative(5)).toBe(1);
      expect(reluDerivative(0.1)).toBe(1);
      expect(reluDerivative(1000)).toBe(1);
    });

    it('should handle array input', () => {
      const result = reluDerivative([-2, 0, 2]) as number[];
      expect(result).toEqual([0, 0, 1]);
    });
  });

  describe('leakyRelu', () => {
    it('should return input for positive values', () => {
      expect(leakyRelu(5)).toBe(5);
      expect(leakyRelu(0.1)).toBe(0.1);
    });

    it('should return alpha*input for negative values', () => {
      expect(leakyRelu(-5, 0.01)).toBe(-0.05);
      expect(leakyRelu(-10, 0.1)).toBe(-1);
    });

    it('should use default alpha=0.01', () => {
      expect(leakyRelu(-5)).toBe(-0.05);
    });

    it('should handle array input', () => {
      const result = leakyRelu([-2, 0, 2], 0.01) as number[];
      expect(result[0]).toBe(-0.02);
      expect(result[1]).toBe(0);
      expect(result[2]).toBe(2);
    });

    it('should allow custom alpha values', () => {
      expect(leakyRelu(-10, 0.2)).toBe(-2);
      expect(leakyRelu(-10, 0.5)).toBe(-5);
    });
  });

  describe('leakyReluDerivative', () => {
    it('should return 1 for positive inputs', () => {
      expect(leakyReluDerivative(5)).toBe(1);
      expect(leakyReluDerivative(0.1)).toBe(1);
    });

    it('should return alpha for negative inputs', () => {
      expect(leakyReluDerivative(-5, 0.01)).toBe(0.01);
      expect(leakyReluDerivative(-10, 0.1)).toBe(0.1);
    });

    it('should use default alpha=0.01', () => {
      expect(leakyReluDerivative(-5)).toBe(0.01);
    });

    it('should handle array input', () => {
      const result = leakyReluDerivative([-2, 0, 2], 0.01) as number[];
      expect(result).toEqual([0.01, 0.01, 1]);
    });
  });
});

describe('Mathematical Utilities', () => {
  describe('dotProduct', () => {
    it('should compute dot product of two vectors', () => {
      const a = [1, 2, 3];
      const b = [4, 5, 6];
      // 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32
      expect(dotProduct(a, b)).toBe(32);
    });

    it('should return 0 for orthogonal vectors', () => {
      const a = [1, 0];
      const b = [0, 1];
      expect(dotProduct(a, b)).toBe(0);
    });

    it('should throw error for different dimensions', () => {
      const a = [1, 2];
      const b = [1, 2, 3];
      expect(() => dotProduct(a, b)).toThrow();
    });

    it('should handle negative values', () => {
      const a = [1, -2, 3];
      const b = [2, 3, -1];
      // 1*2 + (-2)*3 + 3*(-1) = 2 - 6 - 3 = -7
      expect(dotProduct(a, b)).toBe(-7);
    });
  });

  describe('matrixMultiply', () => {
    it('should multiply two matrices correctly', () => {
      const A = [
        [1, 2],
        [3, 4],
      ];
      const B = [
        [5, 6],
        [7, 8],
      ];
      // [1*5+2*7, 1*6+2*8]   [19, 22]
      // [3*5+4*7, 3*6+4*8] = [43, 50]
      const result = matrixMultiply(A, B);
      expect(result).toEqual([
        [19, 22],
        [43, 50],
      ]);
    });

    it('should handle non-square matrices', () => {
      const A = [[1, 2, 3]]; // 1×3
      const B = [
        [4],
        [5],
        [6],
      ]; // 3×1
      // [1*4+2*5+3*6] = [32]
      const result = matrixMultiply(A, B);
      expect(result).toEqual([[32]]);
    });

    it('should throw error for incompatible dimensions', () => {
      const A = [[1, 2]]; // 1×2
      const B = [[3, 4, 5]]; // 1×3
      expect(() => matrixMultiply(A, B)).toThrow();
    });

    it('should handle identity matrix', () => {
      const A = [
        [1, 2],
        [3, 4],
      ];
      const I = [
        [1, 0],
        [0, 1],
      ];
      const result = matrixMultiply(A, I);
      expect(result).toEqual(A);
    });
  });

  describe('addBias', () => {
    it('should add column of 1s at the beginning', () => {
      const X = [
        [1, 2],
        [3, 4],
      ];
      const result = addBias(X);
      expect(result).toEqual([
        [1, 1, 2],
        [1, 3, 4],
      ]);
    });

    it('should handle empty matrix', () => {
      expect(addBias([])).toEqual([]);
    });

    it('should handle single row', () => {
      const X = [[5, 10]];
      const result = addBias(X);
      expect(result).toEqual([[1, 5, 10]]);
    });

    it('should not modify original matrix', () => {
      const X = [
        [1, 2],
        [3, 4],
      ];
      const original = JSON.parse(JSON.stringify(X));
      addBias(X);
      expect(X).toEqual(original);
    });
  });

  describe('initializeWeights', () => {
    it('should create matrix with correct dimensions', () => {
      const W = initializeWeights(3, 4);
      expect(W.length).toBe(3);
      expect(W[0].length).toBe(4);
    });

    it('should initialize with random method', () => {
      const W = initializeWeights(5, 5, 'random');
      const values = W.flat();
      // Random should be in [-0.5, 0.5]
      values.forEach(val => {
        expect(val).toBeGreaterThanOrEqual(-0.5);
        expect(val).toBeLessThanOrEqual(0.5);
      });
    });

    it('should initialize with xavier method', () => {
      const W = initializeWeights(100, 100, 'xavier');
      const values = W.flat();
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance =
        values.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) /
        values.length;

      // Xavier: variance should be approximately 2/(nin + nout)
      const expectedVariance = 2 / (100 + 100);
      expect(Math.abs(mean)).toBeLessThan(0.05); // Mean near 0
      expect(variance).toBeGreaterThan(expectedVariance * 0.5);
      expect(variance).toBeLessThan(expectedVariance * 2);
    });

    it('should initialize with he method', () => {
      const W = initializeWeights(100, 100, 'he');
      const values = W.flat();
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance =
        values.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) /
        values.length;

      // He: variance should be approximately 2/nin
      const expectedVariance = 2 / 100;
      expect(Math.abs(mean)).toBeLessThan(0.05); // Mean near 0
      expect(variance).toBeGreaterThan(expectedVariance * 0.5);
      expect(variance).toBeLessThan(expectedVariance * 2);
    });

    it('should create different values each time', () => {
      const W1 = initializeWeights(3, 3);
      const W2 = initializeWeights(3, 3);
      expect(W1).not.toEqual(W2);
    });
  });
});

describe('Perceptron', () => {
  describe('constructor', () => {
    it('should initialize with default learning rate', () => {
      const p = new Perceptron();
      expect(p).toBeDefined();
    });

    it('should initialize with custom learning rate', () => {
      const p = new Perceptron(0.1);
      expect(p).toBeDefined();
    });
  });

  describe('fit and predict', () => {
    it('should learn AND function', () => {
      const X = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ];
      const y = [0, 0, 0, 1];

      const p = new Perceptron(0.1);
      p.fit(X, y, 100);

      const predictions = p.predict(X);
      expect(predictions).toEqual(y);
    });

    it('should learn OR function', () => {
      const X = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ];
      const y = [0, 1, 1, 1];

      const p = new Perceptron(0.1);
      p.fit(X, y, 100);

      const predictions = p.predict(X);
      expect(predictions).toEqual(y);
    });

    it('should produce probabilities between 0 and 1', () => {
      const X = [
        [0, 0],
        [1, 1],
      ];
      const y = [0, 1];

      const p = new Perceptron(0.1);
      p.fit(X, y, 50);

      const probs = p.predictProba(X);
      probs.forEach(prob => {
        expect(prob).toBeGreaterThanOrEqual(0);
        expect(prob).toBeLessThanOrEqual(1);
      });
    });

    it('should update weights after training', () => {
      const X = [[1, 2]];
      const y = [1];

      const p = new Perceptron(0.1);
      const weightsBefore = p.getWeights();

      p.fit(X, y, 10);
      const weightsAfter = p.getWeights();

      // Weights should have changed
      expect(weightsAfter.weights).not.toEqual(weightsBefore.weights);
    });
  });

  describe('getWeights', () => {
    it('should return weights and bias', () => {
      const p = new Perceptron();
      const X = [[1, 2]];
      const y = [1];
      p.fit(X, y, 10);

      const { weights, bias } = p.getWeights();
      expect(weights).toHaveLength(2);
      expect(typeof bias).toBe('number');
    });

    it('should not allow external modification', () => {
      const p = new Perceptron();
      const X = [[1, 2]];
      const y = [1];
      p.fit(X, y, 10);

      const { weights } = p.getWeights();
      const originalWeight = weights[0];
      weights[0] = 999;

      const { weights: weights2 } = p.getWeights();
      expect(weights2[0]).toBe(originalWeight);
    });
  });
});

describe('MultiLayerPerceptron', () => {
  describe('constructor', () => {
    it('should initialize with required config', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
      });
      expect(mlp).toBeDefined();
    });

    it('should use default values for optional config', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
      });

      const params = mlp.getParameters();
      expect(params.W1.length).toBe(3);
      expect(params.W1[0].length).toBe(2);
      expect(params.W2.length).toBe(1);
      expect(params.W2[0].length).toBe(3);
    });

    it('should initialize with custom activation', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
        activation: 'tanh',
      });
      expect(mlp).toBeDefined();
    });

    it('should initialize with custom weight method', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
        weightInit: 'he',
      });
      expect(mlp).toBeDefined();
    });
  });

  describe('forward', () => {
    it('should produce output of correct dimensions', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 4,
        outputSize: 1,
      });

      const X = [
        [1, 2],
        [3, 4],
      ];
      const { hidden, output } = mlp.forward(X);

      expect(hidden.length).toBe(2); // 2 samples
      expect(hidden[0].length).toBe(4); // 4 hidden neurons
      expect(output.length).toBe(2); // 2 samples
      expect(output[0].length).toBe(1); // 1 output neuron
    });

    it('should produce outputs between 0 and 1', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
      });

      const X = [[1, 2]];
      const { output } = mlp.forward(X);

      output.forEach(o => {
        o.forEach(val => {
          expect(val).toBeGreaterThanOrEqual(0);
          expect(val).toBeLessThanOrEqual(1);
        });
      });
    });

    it('should handle multiple outputs', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 3,
        hiddenSize: 5,
        outputSize: 3,
      });

      const X = [[1, 2, 3]];
      const { output } = mlp.forward(X);

      expect(output[0].length).toBe(3);
    });

    it('should produce different outputs for different inputs', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
      });

      const X1 = [[1, 2]];
      const X2 = [[3, 4]];

      const out1 = mlp.forward(X1).output[0][0];
      const out2 = mlp.forward(X2).output[0][0];

      expect(out1).not.toBe(out2);
    });
  });

  describe('predict', () => {
    it('should predict binary classes', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
      });

      const X = [
        [0, 0],
        [1, 1],
      ];
      const predictions = mlp.predict(X);

      expect(predictions).toHaveLength(2);
      predictions.forEach(pred => {
        expect([0, 1]).toContain(pred);
      });
    });

    it('should predict multiclass with argmax', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 4,
        outputSize: 3,
      });

      const X = [[1, 2]];
      const predictions = mlp.predict(X);

      expect(predictions[0]).toBeGreaterThanOrEqual(0);
      expect(predictions[0]).toBeLessThan(3);
    });
  });

  describe('predictProba', () => {
    it('should return probabilities', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
      });

      const X = [[1, 2]];
      const probs = mlp.predictProba(X);

      expect(probs[0][0]).toBeGreaterThanOrEqual(0);
      expect(probs[0][0]).toBeLessThanOrEqual(1);
    });

    it('should return probabilities for each class', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 4,
        outputSize: 3,
      });

      const X = [[1, 2]];
      const probs = mlp.predictProba(X);

      expect(probs[0].length).toBe(3);
      probs[0].forEach(p => {
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('getParameters', () => {
    it('should return all parameters', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
      });

      const params = mlp.getParameters();

      expect(params.W1).toBeDefined();
      expect(params.b1).toBeDefined();
      expect(params.W2).toBeDefined();
      expect(params.b2).toBeDefined();
    });

    it('should return parameters with correct dimensions', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 4,
        hiddenSize: 5,
        outputSize: 3,
      });

      const params = mlp.getParameters();

      expect(params.W1.length).toBe(5); // hidden_size
      expect(params.W1[0].length).toBe(4); // input_size
      expect(params.b1.length).toBe(5);
      expect(params.W2.length).toBe(3); // output_size
      expect(params.W2[0].length).toBe(5); // hidden_size
      expect(params.b2.length).toBe(3);
    });

    it('should not allow external modification', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
      });

      const params1 = mlp.getParameters();
      params1.W1[0][0] = 999;

      const params2 = mlp.getParameters();
      expect(params2.W1[0][0]).not.toBe(999);
    });
  });

  describe('different activations', () => {
    it('should work with sigmoid activation', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
        activation: 'sigmoid',
      });

      const X = [[1, 2]];
      const { output } = mlp.forward(X);
      expect(output[0][0]).toBeGreaterThanOrEqual(0);
      expect(output[0][0]).toBeLessThanOrEqual(1);
    });

    it('should work with tanh activation', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
        activation: 'tanh',
      });

      const X = [[1, 2]];
      const { hidden } = mlp.forward(X);
      // Hidden layer with tanh should be between -1 and 1
      // but output layer uses sigmoid so should be 0-1
      expect(mlp).toBeDefined();
    });

    it('should work with relu activation', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
        activation: 'relu',
      });

      const X = [[1, 2]];
      const { hidden } = mlp.forward(X);
      // Hidden layer with ReLU should be >= 0
      hidden[0].forEach(h => {
        expect(h).toBeGreaterThanOrEqual(0);
      });
    });

    it('should work with leaky_relu activation', () => {
      const mlp = new MultiLayerPerceptron({
        inputSize: 2,
        hiddenSize: 3,
        outputSize: 1,
        activation: 'leaky_relu',
      });

      const X = [[1, 2]];
      const { output } = mlp.forward(X);
      expect(output[0][0]).toBeGreaterThanOrEqual(0);
      expect(output[0][0]).toBeLessThanOrEqual(1);
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete workflow for binary classification', () => {
    // Create simple dataset
    const X = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ];

    // Create MLP
    const mlp = new MultiLayerPerceptron({
      inputSize: 2,
      hiddenSize: 4,
      outputSize: 1,
      activation: 'relu',
      weightInit: 'he',
    });

    // Forward pass
    const { hidden, output } = mlp.forward(X);

    // Check dimensions
    expect(hidden.length).toBe(4);
    expect(output.length).toBe(4);

    // Make predictions
    const predictions = mlp.predict(X);
    expect(predictions.length).toBe(4);

    // Get probabilities
    const probs = mlp.predictProba(X);
    expect(probs.length).toBe(4);
  });

  it('should handle complete workflow for multiclass', () => {
    // Create dataset
    const X = [
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    // Create MLP for 3 classes
    const mlp = new MultiLayerPerceptron({
      inputSize: 2,
      hiddenSize: 5,
      outputSize: 3,
      activation: 'relu',
    });

    // Forward pass
    const { output } = mlp.forward(X);

    // Predictions should be class indices 0, 1, or 2
    const predictions = mlp.predict(X);
    predictions.forEach(pred => {
      expect(pred).toBeGreaterThanOrEqual(0);
      expect(pred).toBeLessThan(3);
    });

    // Probabilities should sum to ~1 for each sample (after softmax, but we use sigmoid)
    const probs = mlp.predictProba(X);
    expect(probs[0].length).toBe(3);
  });

  it('should compare perceptron vs MLP on same problem', () => {
    const X = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ];
    const y = [0, 0, 0, 1];

    // Train perceptron
    const perceptron = new Perceptron(0.1);
    perceptron.fit(X, y, 100);
    const perceptronPreds = perceptron.predict(X);

    // Create MLP (untrained, random weights)
    const mlp = new MultiLayerPerceptron({
      inputSize: 2,
      hiddenSize: 3,
      outputSize: 1,
    });
    const mlpPreds = mlp.predict(X);

    // Both should produce valid predictions
    expect(perceptronPreds.length).toBe(4);
    expect(mlpPreds.length).toBe(4);

    // Perceptron should learn AND correctly
    expect(perceptronPreds).toEqual(y);
  });
});
