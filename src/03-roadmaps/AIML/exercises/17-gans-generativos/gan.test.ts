import {
  Generator,
  Discriminator,
  GAN,
  generateNoise,
  interpolate,
  visualizeProgress,
} from './gan';

describe('Noise Generation', () => {
  describe('generateNoise', () => {
    it('should generate noise of correct size', () => {
      const noise = generateNoise(100);
      expect(noise).toHaveLength(100);
    });

    it('should generate different noise each time', () => {
      const noise1 = generateNoise(50);
      const noise2 = generateNoise(50);

      const areDifferent = noise1.some((v, i) => Math.abs(v - noise2[i]) > 0.01);
      expect(areDifferent).toBe(true);
    });

    it('should generate normal distribution by default', () => {
      const noise = generateNoise(1000, 'normal');

      // Check mean ≈ 0
      const mean = noise.reduce((a, b) => a + b, 0) / noise.length;
      expect(Math.abs(mean)).toBeLessThan(0.2);

      // Check std ≈ 1
      const variance =
        noise.reduce((sum, x) => sum + (x - mean) ** 2, 0) / noise.length;
      const std = Math.sqrt(variance);
      expect(std).toBeGreaterThan(0.8);
      expect(std).toBeLessThan(1.2);
    });

    it('should generate uniform distribution when specified', () => {
      const noise = generateNoise(1000, 'uniform');

      // All values should be in [-1, 1]
      expect(noise.every(v => v >= -1 && v <= 1)).toBe(true);

      // Check distribution is reasonably uniform
      const inFirstHalf = noise.filter(v => v < 0).length;
      const ratio = inFirstHalf / noise.length;
      expect(ratio).toBeGreaterThan(0.4);
      expect(ratio).toBeLessThan(0.6);
    });

    it('should work with size 1', () => {
      const noise = generateNoise(1);
      expect(noise).toHaveLength(1);
      expect(typeof noise[0]).toBe('number');
    });
  });
});

describe('Generator', () => {
  describe('Initialization', () => {
    it('should initialize with correct dimensions', () => {
      const generator = new Generator(10, 20, [128, 64]);
      expect(generator).toBeDefined();
    });

    it('should work with no hidden layers (direct mapping)', () => {
      const generator = new Generator(10, 20, []);
      const noise = generateNoise(10);
      const output = generator.forward(noise);

      expect(output).toHaveLength(20);
    });

    it('should work with single hidden layer', () => {
      const generator = new Generator(10, 20, [64]);
      const noise = generateNoise(10);
      const output = generator.forward(noise);

      expect(output).toHaveLength(20);
    });
  });

  describe('Forward Pass', () => {
    it('should generate output of correct size', () => {
      const generator = new Generator(100, 784, [256, 128]);
      const noise = generateNoise(100);
      const output = generator.forward(noise);

      expect(output).toHaveLength(784);
    });

    it('should output values in [-1, 1] range (tanh)', () => {
      const generator = new Generator(50, 100, [128]);
      const noise = generateNoise(50);
      const output = generator.forward(noise);

      expect(output.every(v => v >= -1 && v <= 1)).toBe(true);
    });

    it('should produce different outputs for different inputs', () => {
      const generator = new Generator(20, 50, [64]);
      const noise1 = generateNoise(20);
      const noise2 = generateNoise(20);

      const output1 = generator.forward(noise1);
      const output2 = generator.forward(noise2);

      const areDifferent = output1.some(
        (v, i) => Math.abs(v - output2[i]) > 0.01
      );
      expect(areDifferent).toBe(true);
    });

    it('should be deterministic for same input', () => {
      const generator = new Generator(20, 50, [64]);
      const noise = generateNoise(20);

      const output1 = generator.forward(noise);
      const output2 = generator.forward(noise);

      expect(output1).toEqual(output2);
    });
  });

  describe('Parameters', () => {
    it('should get and set parameters', () => {
      const generator = new Generator(10, 20, [32]);
      const params = generator.getParameters();

      expect(params.weights).toBeDefined();
      expect(params.biases).toBeDefined();
      expect(params.weights.length).toBeGreaterThan(0);
      expect(params.biases.length).toBeGreaterThan(0);

      expect(() => generator.setParameters(params)).not.toThrow();
    });

    it('should preserve parameters when getting and setting', () => {
      const generator = new Generator(10, 20, [32]);
      const noise = generateNoise(10);

      const output1 = generator.forward(noise);
      const params = generator.getParameters();
      generator.setParameters(params);
      const output2 = generator.forward(noise);

      expect(output1).toEqual(output2);
    });

    it('should update parameters correctly', () => {
      const generator = new Generator(10, 20, [32]);
      const params = generator.getParameters();

      const noise = generateNoise(10);
      const output1 = generator.forward(noise);

      // Create zero gradients
      const gradients = {
        weights: params.weights.map(w => w.map(row => row.map(() => 0.1))),
        biases: params.biases.map(b => b.map(() => 0.1)),
      };

      generator.updateParameters(gradients, 0.01);
      const output2 = generator.forward(noise);

      // Output should be different after update
      const changed = output1.some((v, i) => Math.abs(v - output2[i]) > 0.001);
      expect(changed).toBe(true);
    });
  });
});

describe('Discriminator', () => {
  describe('Initialization', () => {
    it('should initialize with correct dimensions', () => {
      const discriminator = new Discriminator(784, [256, 128]);
      expect(discriminator).toBeDefined();
    });

    it('should work with no hidden layers', () => {
      const discriminator = new Discriminator(100, []);
      const input = Array(100).fill(0.5);
      const output = discriminator.forward(input);

      expect(typeof output).toBe('number');
      expect(output).toBeGreaterThanOrEqual(0);
      expect(output).toBeLessThanOrEqual(1);
    });
  });

  describe('Forward Pass', () => {
    it('should output probability in [0, 1]', () => {
      const discriminator = new Discriminator(100, [128, 64]);
      const input = Array(100)
        .fill(0)
        .map(() => Math.random());

      const output = discriminator.forward(input);

      expect(output).toBeGreaterThanOrEqual(0);
      expect(output).toBeLessThanOrEqual(1);
    });

    it('should return single number (probability)', () => {
      const discriminator = new Discriminator(50, [64]);
      const input = Array(50).fill(0.5);

      const output = discriminator.forward(input);

      expect(typeof output).toBe('number');
    });

    it('should produce different outputs for different inputs', () => {
      const discriminator = new Discriminator(100, [128]);
      const input1 = Array(100).fill(0.3);
      const input2 = Array(100).fill(0.7);

      const output1 = discriminator.forward(input1);
      const output2 = discriminator.forward(input2);

      expect(output1).not.toBe(output2);
    });

    it('should be deterministic for same input', () => {
      const discriminator = new Discriminator(50, [64]);
      const input = Array(50)
        .fill(0)
        .map(() => Math.random());

      const output1 = discriminator.forward(input);
      const output2 = discriminator.forward(input);

      expect(output1).toBe(output2);
    });
  });

  describe('Parameters', () => {
    it('should get and set parameters', () => {
      const discriminator = new Discriminator(100, [128]);
      const params = discriminator.getParameters();

      expect(params.weights).toBeDefined();
      expect(params.biases).toBeDefined();

      expect(() => discriminator.setParameters(params)).not.toThrow();
    });

    it('should update parameters', () => {
      const discriminator = new Discriminator(50, [64]);
      const params = discriminator.getParameters();
      const input = Array(50).fill(0.5);

      const output1 = discriminator.forward(input);

      const gradients = {
        weights: params.weights.map(w => w.map(row => row.map(() => 0.1))),
        biases: params.biases.map(b => b.map(() => 0.1)),
      };

      discriminator.updateParameters(gradients, 0.01);
      const output2 = discriminator.forward(input);

      expect(output1).not.toBe(output2);
    });
  });
});

describe('GAN', () => {
  let gan: GAN;
  let realData: number[][];

  beforeEach(() => {
    gan = new GAN({
      noiseSize: 10,
      dataSize: 20,
      generatorHidden: [32],
      discriminatorHidden: [32],
    });

    // Simple synthetic dataset
    realData = [];
    for (let i = 0; i < 50; i++) {
      const sample = Array(20)
        .fill(0)
        .map(() => Math.random() * 2 - 1);
      realData.push(sample);
    }
  });

  describe('Initialization', () => {
    it('should initialize GAN with generator and discriminator', () => {
      expect(gan).toBeDefined();
    });

    it('should accept different architectures', () => {
      const gan2 = new GAN({
        noiseSize: 100,
        dataSize: 784,
        generatorHidden: [256, 128],
        discriminatorHidden: [128, 64],
      });

      expect(gan2).toBeDefined();
    });
  });

  describe('Generation', () => {
    it('should generate samples', () => {
      const samples = gan.generate(10);

      expect(samples).toHaveLength(10);
      expect(samples[0]).toHaveLength(20);
    });

    it('should generate different samples', () => {
      const samples = gan.generate(5);

      const areDifferent = samples[0].some(
        (v, i) => Math.abs(v - samples[1][i]) > 0.01
      );
      expect(areDifferent).toBe(true);
    });

    it('should generate values in valid range', () => {
      const samples = gan.generate(10);

      for (const sample of samples) {
        expect(sample.every(v => v >= -1 && v <= 1)).toBe(true);
      }
    });

    it('should handle generating single sample', () => {
      const samples = gan.generate(1);

      expect(samples).toHaveLength(1);
      expect(samples[0]).toHaveLength(20);
    });
  });

  describe('Training', () => {
    it('should train without errors', () => {
      expect(() => {
        gan.train(realData, {
          epochs: 5,
          batchSize: 10,
          learningRateG: 0.001,
          learningRateD: 0.001,
          verbose: false,
        });
      }).not.toThrow();
    });

    it('should return training history', () => {
      const history = gan.train(realData, {
        epochs: 10,
        batchSize: 10,
        learningRateG: 0.001,
        learningRateD: 0.001,
        verbose: false,
      });

      expect(history.lossG).toHaveLength(10);
      expect(history.lossD).toHaveLength(10);
      expect(history.epochs).toBe(10);
      expect(history.trainTime).toBeGreaterThan(0);
    });

    it('should record losses for each epoch', () => {
      const history = gan.train(realData, {
        epochs: 5,
        batchSize: 10,
        learningRateG: 0.001,
        learningRateD: 0.001,
        verbose: false,
      });

      expect(history.lossG.every(loss => typeof loss === 'number')).toBe(true);
      expect(history.lossD.every(loss => typeof loss === 'number')).toBe(true);
      expect(history.lossG.every(loss => !isNaN(loss))).toBe(true);
      expect(history.lossD.every(loss => !isNaN(loss))).toBe(true);
    });

    it('should work with different k steps', () => {
      const history = gan.train(realData, {
        epochs: 5,
        batchSize: 10,
        learningRateG: 0.001,
        learningRateD: 0.001,
        kSteps: 3,
        verbose: false,
      });

      expect(history.epochs).toBe(5);
    });

    it('should work with label smoothing', () => {
      const history = gan.train(realData, {
        epochs: 5,
        batchSize: 10,
        learningRateG: 0.001,
        learningRateD: 0.001,
        labelSmoothing: true,
        verbose: false,
      });

      expect(history.epochs).toBe(5);
    });

    it('should handle verbose mode', () => {
      expect(() => {
        gan.train(realData, {
          epochs: 10,
          batchSize: 10,
          learningRateG: 0.001,
          learningRateD: 0.001,
          verbose: true,
        });
      }).not.toThrow();
    });

    it('should work with small batch size', () => {
      const history = gan.train(realData, {
        epochs: 3,
        batchSize: 5,
        learningRateG: 0.001,
        learningRateD: 0.001,
        verbose: false,
      });

      expect(history.epochs).toBe(3);
    });
  });

  describe('Evaluation', () => {
    it('should evaluate discriminator performance', () => {
      gan.train(realData, {
        epochs: 10,
        batchSize: 10,
        learningRateG: 0.001,
        learningRateD: 0.001,
        verbose: false,
      });

      const fakeData = gan.generate(20);
      const evaluation = gan.evaluateDiscriminator(
        realData.slice(0, 20),
        fakeData
      );

      expect(evaluation.accuracyReal).toBeGreaterThanOrEqual(0);
      expect(evaluation.accuracyReal).toBeLessThanOrEqual(1);
      expect(evaluation.accuracyFake).toBeGreaterThanOrEqual(0);
      expect(evaluation.accuracyFake).toBeLessThanOrEqual(1);
      expect(evaluation.averageConfidence).toBeGreaterThanOrEqual(0);
      expect(evaluation.averageConfidence).toBeLessThanOrEqual(1);
    });

    it('should work with different dataset sizes', () => {
      const fakeData = gan.generate(10);
      const evaluation = gan.evaluateDiscriminator(
        realData.slice(0, 10),
        fakeData
      );

      expect(evaluation).toBeDefined();
    });
  });

  describe('Mode Collapse Detection', () => {
    it('should detect lack of mode collapse in diverse samples', () => {
      const samples = gan.generate(50);
      const result = gan.detectModeCollapse(samples);

      expect(result.collapsed).toBeDefined();
      expect(result.diversity).toBeGreaterThanOrEqual(0);
      expect(result.diversity).toBeLessThanOrEqual(1);
    });

    it('should detect mode collapse in identical samples', () => {
      const identicalSamples = Array(50)
        .fill(0)
        .map(() => Array(20).fill(0.5));
      const result = gan.detectModeCollapse(identicalSamples);

      expect(result.collapsed).toBe(true);
      expect(result.diversity).toBeLessThan(0.1);
    });

    it('should handle small sample sets', () => {
      const samples = gan.generate(2);
      const result = gan.detectModeCollapse(samples);

      expect(result).toBeDefined();
      expect(typeof result.collapsed).toBe('boolean');
    });

    it('should handle single sample', () => {
      const samples = gan.generate(1);
      const result = gan.detectModeCollapse(samples);

      expect(result.collapsed).toBe(false);
      expect(result.diversity).toBe(1.0);
    });

    it('should give high diversity for very different samples', () => {
      const diverseSamples = [];
      for (let i = 0; i < 50; i++) {
        const sample = Array(20)
          .fill(0)
          .map(() => (Math.random() > 0.5 ? 1 : -1));
        diverseSamples.push(sample);
      }

      const result = gan.detectModeCollapse(diverseSamples);

      expect(result.diversity).toBeGreaterThan(0.5);
      expect(result.collapsed).toBe(false);
    });
  });
});

describe('Interpolation', () => {
  describe('interpolate', () => {
    it('should interpolate between two vectors', () => {
      const z1 = Array(10).fill(0);
      const z2 = Array(10).fill(1);

      const interpolated = interpolate(z1, z2, 5);

      expect(interpolated).toHaveLength(5);
      expect(interpolated[0]).toEqual(z1);
      expect(interpolated[4]).toEqual(z2);
    });

    it('should create smooth transitions', () => {
      const z1 = Array(10).fill(0);
      const z2 = Array(10).fill(10);

      const interpolated = interpolate(z1, z2, 11);

      // Check that values increase smoothly
      for (let i = 0; i < interpolated.length - 1; i++) {
        const sum1 = interpolated[i].reduce((a, b) => a + b, 0);
        const sum2 = interpolated[i + 1].reduce((a, b) => a + b, 0);
        expect(sum2).toBeGreaterThanOrEqual(sum1);
      }
    });

    it('should handle 2 steps (start and end)', () => {
      const z1 = generateNoise(20);
      const z2 = generateNoise(20);

      const interpolated = interpolate(z1, z2, 2);

      expect(interpolated).toHaveLength(2);
      expect(interpolated[0]).toEqual(z1);
      expect(interpolated[1]).toEqual(z2);
    });

    it('should work with large step count', () => {
      const z1 = generateNoise(10);
      const z2 = generateNoise(10);

      const interpolated = interpolate(z1, z2, 100);

      expect(interpolated).toHaveLength(100);
      expect(interpolated[0]).toEqual(z1);
      expect(interpolated[99]).toEqual(z2);
    });

    it('should preserve vector dimensionality', () => {
      const z1 = generateNoise(50);
      const z2 = generateNoise(50);

      const interpolated = interpolate(z1, z2, 10);

      interpolated.forEach(vec => {
        expect(vec).toHaveLength(50);
      });
    });
  });
});

describe('Visualization', () => {
  describe('visualizeProgress', () => {
    it('should visualize training history without errors', () => {
      const history: TrainingHistory = {
        lossG: [1.0, 0.8, 0.6, 0.4, 0.2],
        lossD: [0.5, 0.4, 0.3, 0.2, 0.1],
        epochs: 5,
        trainTime: 1000,
      };

      expect(() => visualizeProgress(history)).not.toThrow();
    });

    it('should handle empty history', () => {
      const history: TrainingHistory = {
        lossG: [],
        lossD: [],
        epochs: 0,
        trainTime: 0,
      };

      expect(() => visualizeProgress(history)).not.toThrow();
    });

    it('should handle long training history', () => {
      const history: TrainingHistory = {
        lossG: Array(100).fill(0.5),
        lossD: Array(100).fill(0.5),
        epochs: 100,
        trainTime: 10000,
      };

      expect(() => visualizeProgress(history)).not.toThrow();
    });
  });
});

describe('Integration Tests', () => {
  it('should complete full GAN workflow', () => {
    // 1. Create GAN
    const gan = new GAN({
      noiseSize: 20,
      dataSize: 30,
      generatorHidden: [64, 32],
      discriminatorHidden: [32, 64],
    });

    // 2. Create synthetic data
    const realData = Array(100)
      .fill(0)
      .map(() => Array(30).fill(0).map(() => Math.random() * 2 - 1));

    // 3. Train
    const history = gan.train(realData, {
      epochs: 20,
      batchSize: 20,
      learningRateG: 0.0002,
      learningRateD: 0.0002,
      kSteps: 1,
      labelSmoothing: true,
      verbose: false,
    });

    expect(history.epochs).toBe(20);

    // 4. Generate samples
    const samples = gan.generate(20);
    expect(samples).toHaveLength(20);

    // 5. Evaluate
    const evaluation = gan.evaluateDiscriminator(realData.slice(0, 20), samples);
    expect(evaluation.accuracyReal).toBeGreaterThanOrEqual(0);
    expect(evaluation.accuracyFake).toBeGreaterThanOrEqual(0);

    // 6. Check mode collapse
    const collapseCheck = gan.detectModeCollapse(samples);
    expect(typeof collapseCheck.collapsed).toBe('boolean');
    expect(collapseCheck.diversity).toBeGreaterThanOrEqual(0);

    // 7. Interpolate
    const z1 = generateNoise(20);
    const z2 = generateNoise(20);
    const interpolated = interpolate(z1, z2, 5);
    expect(interpolated).toHaveLength(5);
  });

  it('should improve generator over training', () => {
    const gan = new GAN({
      noiseSize: 10,
      dataSize: 20,
      generatorHidden: [32],
      discriminatorHidden: [32],
    });

    const realData = Array(50)
      .fill(0)
      .map(() => Array(20).fill(0).map(() => Math.random()));

    // Generate before training
    const beforeSamples = gan.generate(10);

    // Train
    gan.train(realData, {
      epochs: 30,
      batchSize: 10,
      learningRateG: 0.001,
      learningRateD: 0.001,
      verbose: false,
    });

    // Generate after training
    const afterSamples = gan.generate(10);

    // Samples should be different
    const areDifferent = beforeSamples[0].some(
      (v, i) => Math.abs(v - afterSamples[0][i]) > 0.01
    );
    expect(areDifferent).toBe(true);
  });

  it('should handle edge case: very small dataset', () => {
    const gan = new GAN({
      noiseSize: 5,
      dataSize: 10,
      generatorHidden: [16],
      discriminatorHidden: [16],
    });

    const realData = [
      Array(10).fill(0.5),
      Array(10).fill(-0.5),
    ];

    expect(() => {
      gan.train(realData, {
        epochs: 5,
        batchSize: 2,
        learningRateG: 0.001,
        learningRateD: 0.001,
        verbose: false,
      });
    }).not.toThrow();
  });
});
