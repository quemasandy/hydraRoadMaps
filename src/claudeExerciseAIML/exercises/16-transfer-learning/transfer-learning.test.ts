import {
  PretrainedModel,
  FeatureExtractor,
  FineTuner,
  TransferLearningManager,
} from './transfer-learning';

describe('PretrainedModel', () => {
  describe('Architecture', () => {
    it('should create simple architecture', () => {
      const model = new PretrainedModel('simple', 100);
      expect(model.getNumLayers()).toBe(2);
      expect(model.getLayerNames()).toEqual(['layer1', 'layer2']);
    });

    it('should create medium architecture', () => {
      const model = new PretrainedModel('medium', 100);
      expect(model.getNumLayers()).toBe(4);
      expect(model.getLayerNames()).toContain('layer1');
      expect(model.getLayerNames()).toContain('layer4');
    });

    it('should create deep architecture', () => {
      const model = new PretrainedModel('deep', 100);
      expect(model.getNumLayers()).toBe(8);
      expect(model.getLayerNames()).toHaveLength(8);
    });

    it('should throw error for unknown architecture', () => {
      expect(() => new PretrainedModel('unknown', 100)).toThrow();
    });
  });

  describe('Feature Extraction', () => {
    it('should extract features from input', () => {
      const model = new PretrainedModel('simple', 10);
      const input = Array(10).fill(0.5);
      const features = model.extractFeatures(input);

      expect(features).toBeDefined();
      expect(features.length).toBe(model.getFeatureSize());
      expect(features.every(f => typeof f === 'number')).toBe(true);
    });

    it('should handle zero input', () => {
      const model = new PretrainedModel('simple', 10);
      const input = Array(10).fill(0);
      const features = model.extractFeatures(input);

      expect(features).toBeDefined();
      expect(features.length).toBe(model.getFeatureSize());
      // Con ReLU, features pueden ser 0
      expect(features.every(f => f >= 0)).toBe(true);
    });

    it('should produce different features for different inputs', () => {
      const model = new PretrainedModel('simple', 10);
      const input1 = Array(10).fill(0.5);
      const input2 = Array(10).fill(1.0);

      const features1 = model.extractFeatures(input1);
      const features2 = model.extractFeatures(input2);

      // Features deben ser diferentes
      const areDifferent = features1.some(
        (f, i) => Math.abs(f - features2[i]) > 0.001
      );
      expect(areDifferent).toBe(true);
    });

    it('should use ReLU activation (non-negative outputs)', () => {
      const model = new PretrainedModel('medium', 20);
      const input = Array(20)
        .fill(0)
        .map(() => Math.random() - 0.5);

      const features = model.extractFeatures(input);

      // ReLU garantiza valores no negativos
      expect(features.every(f => f >= 0)).toBe(true);
    });
  });

  describe('Freezing/Unfreezing', () => {
    it('should freeze all layers', () => {
      const model = new PretrainedModel('medium', 10);
      model.freeze();

      const layerNames = model.getLayerNames();
      layerNames.forEach(name => {
        expect(model.isFrozen(name)).toBe(true);
      });
    });

    it('should unfreeze all layers', () => {
      const model = new PretrainedModel('medium', 10);
      model.freeze();
      model.unfreeze();

      const layerNames = model.getLayerNames();
      layerNames.forEach(name => {
        expect(model.isFrozen(name)).toBe(false);
      });
    });

    it('should unfreeze specific layers', () => {
      const model = new PretrainedModel('medium', 10);
      model.freeze();
      model.unfreeze(['layer3', 'layer4']);

      expect(model.isFrozen('layer1')).toBe(true);
      expect(model.isFrozen('layer2')).toBe(true);
      expect(model.isFrozen('layer3')).toBe(false);
      expect(model.isFrozen('layer4')).toBe(false);
    });

    it('should handle unfreezing non-existent layers gracefully', () => {
      const model = new PretrainedModel('simple', 10);
      model.freeze();

      expect(() => model.unfreeze(['non_existent_layer'])).not.toThrow();
      // Capas existentes deben seguir congeladas
      expect(model.isFrozen('layer1')).toBe(true);
    });

    it('should return false for non-existent layer freeze check', () => {
      const model = new PretrainedModel('simple', 10);
      expect(model.isFrozen('non_existent')).toBe(false);
    });
  });

  describe('Model Properties', () => {
    it('should return correct feature size', () => {
      const model = new PretrainedModel('simple', 100);
      expect(model.getFeatureSize()).toBeGreaterThan(0);
      expect(typeof model.getFeatureSize()).toBe('number');
    });

    it('should have consistent feature size', () => {
      const model = new PretrainedModel('medium', 50);
      const input1 = Array(50).fill(0.3);
      const input2 = Array(50).fill(0.7);

      const features1 = model.extractFeatures(input1);
      const features2 = model.extractFeatures(input2);

      expect(features1.length).toBe(features2.length);
      expect(features1.length).toBe(model.getFeatureSize());
    });
  });
});

describe('FeatureExtractor', () => {
  let baseModel: PretrainedModel;
  let X_train: number[][];
  let y_train: number[];

  beforeEach(() => {
    baseModel = new PretrainedModel('simple', 10);
    // Dataset simple para tests rápidos
    X_train = [
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    ];
    y_train = [0, 1, 2, 0, 1, 2];
  });

  describe('Initialization', () => {
    it('should freeze base model on initialization', () => {
      const extractor = new FeatureExtractor(baseModel, 3);

      const layerNames = baseModel.getLayerNames();
      layerNames.forEach(name => {
        expect(baseModel.isFrozen(name)).toBe(true);
      });
    });

    it('should initialize with correct number of classes', () => {
      const extractor = new FeatureExtractor(baseModel, 5);
      const input = Array(10).fill(0.5);
      const probas = extractor.predictProba(input);

      expect(probas).toHaveLength(5);
    });
  });

  describe('Training', () => {
    it('should train classifier successfully', () => {
      const extractor = new FeatureExtractor(baseModel, 3);

      const history = extractor.train(X_train, y_train, {
        epochs: 20,
        learningRate: 0.01,
        verbose: false,
      });

      expect(history.loss).toHaveLength(20);
      expect(history.accuracy).toHaveLength(20);
      expect(history.epochs).toBe(20);
      expect(history.trainTime).toBeGreaterThan(0);
    });

    it('should improve over epochs', () => {
      const extractor = new FeatureExtractor(baseModel, 3);

      const history = extractor.train(X_train, y_train, {
        epochs: 50,
        learningRate: 0.01,
        verbose: false,
      });

      // Loss debería disminuir
      const initialLoss = history.loss[0];
      const finalLoss = history.loss[history.loss.length - 1];
      expect(finalLoss).toBeLessThan(initialLoss);

      // Accuracy debería mejorar
      const initialAcc = history.accuracy[0];
      const finalAcc = history.accuracy[history.accuracy.length - 1];
      expect(finalAcc).toBeGreaterThanOrEqual(initialAcc);
    });

    it('should handle verbose mode without errors', () => {
      const extractor = new FeatureExtractor(baseModel, 3);

      expect(() => {
        extractor.train(X_train, y_train, {
          epochs: 10,
          learningRate: 0.01,
          verbose: true,
        });
      }).not.toThrow();
    });

    it('should work with different learning rates', () => {
      const extractor1 = new FeatureExtractor(baseModel, 3);
      const extractor2 = new FeatureExtractor(
        new PretrainedModel('simple', 10),
        3
      );

      const history1 = extractor1.train(X_train, y_train, {
        epochs: 20,
        learningRate: 0.001,
        verbose: false,
      });

      const history2 = extractor2.train(X_train, y_train, {
        epochs: 20,
        learningRate: 0.1,
        verbose: false,
      });

      // Ambos deben completar sin errores
      expect(history1.epochs).toBe(20);
      expect(history2.epochs).toBe(20);
    });
  });

  describe('Prediction', () => {
    it('should predict class', () => {
      const extractor = new FeatureExtractor(baseModel, 3);

      extractor.train(X_train, y_train, {
        epochs: 30,
        learningRate: 0.01,
        verbose: false,
      });

      const testInput = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const predicted = extractor.predict(testInput);

      expect(predicted).toBeGreaterThanOrEqual(0);
      expect(predicted).toBeLessThan(3);
      expect(Number.isInteger(predicted)).toBe(true);
    });

    it('should predict probabilities that sum to 1', () => {
      const extractor = new FeatureExtractor(baseModel, 3);

      extractor.train(X_train, y_train, {
        epochs: 20,
        learningRate: 0.01,
        verbose: false,
      });

      const testInput = [0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0];
      const probas = extractor.predictProba(testInput);

      expect(probas).toHaveLength(3);
      expect(probas.every(p => p >= 0 && p <= 1)).toBe(true);

      const sum = probas.reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 5);
    });

    it('should make consistent predictions', () => {
      const extractor = new FeatureExtractor(baseModel, 3);

      extractor.train(X_train, y_train, {
        epochs: 30,
        learningRate: 0.01,
        verbose: false,
      });

      const testInput = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const pred1 = extractor.predict(testInput);
      const pred2 = extractor.predict(testInput);

      expect(pred1).toBe(pred2);
    });
  });
});

describe('FineTuner', () => {
  let baseModel: PretrainedModel;
  let X_train: number[][];
  let y_train: number[];

  beforeEach(() => {
    baseModel = new PretrainedModel('medium', 10);
    X_train = [
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    ];
    y_train = [0, 1, 2, 0, 1, 2];
  });

  describe('Initialization', () => {
    it('should initialize with selective unfreezing', () => {
      const fineTuner = new FineTuner(baseModel, 3, ['layer3', 'layer4']);

      expect(baseModel.isFrozen('layer1')).toBe(true);
      expect(baseModel.isFrozen('layer2')).toBe(true);
      expect(baseModel.isFrozen('layer3')).toBe(false);
      expect(baseModel.isFrozen('layer4')).toBe(false);
    });

    it('should freeze all if no layers specified', () => {
      const fineTuner = new FineTuner(baseModel, 3);

      const layerNames = baseModel.getLayerNames();
      layerNames.forEach(name => {
        expect(baseModel.isFrozen(name)).toBe(true);
      });
    });
  });

  describe('Layer Learning Rates', () => {
    it('should set layer-specific learning rates', () => {
      const fineTuner = new FineTuner(baseModel, 3, ['layer3', 'layer4']);

      expect(() => {
        fineTuner.setLayerLearningRate('layer3', 0.0001);
        fineTuner.setLayerLearningRate('layer4', 0.001);
      }).not.toThrow();
    });

    it('should handle setting lr for frozen layers', () => {
      const fineTuner = new FineTuner(baseModel, 3, ['layer4']);

      expect(() => {
        fineTuner.setLayerLearningRate('layer1', 0.00001);
      }).not.toThrow();
    });
  });

  describe('Training with Warmup', () => {
    it('should train with warmup phase', () => {
      const fineTuner = new FineTuner(baseModel, 3, ['layer3', 'layer4']);

      const history = fineTuner.train(X_train, y_train, {
        epochs: 30,
        learningRate: 0.01,
        warmupEpochs: 5,
        verbose: false,
      });

      expect(history.epochs).toBe(30);
      expect(history.loss).toHaveLength(30);
      expect(history.accuracy).toHaveLength(30);
    });

    it('should use default warmup if not specified', () => {
      const fineTuner = new FineTuner(baseModel, 3, ['layer4']);

      const history = fineTuner.train(X_train, y_train, {
        epochs: 20,
        learningRate: 0.01,
        verbose: false,
      });

      // Default warmup = 10% of epochs
      expect(history.epochs).toBe(20);
    });

    it('should improve performance over epochs', () => {
      const fineTuner = new FineTuner(baseModel, 3, ['layer3', 'layer4']);

      const history = fineTuner.train(X_train, y_train, {
        epochs: 40,
        learningRate: 0.01,
        warmupEpochs: 5,
        verbose: false,
      });

      const initialLoss = history.loss[0];
      const finalLoss = history.loss[history.loss.length - 1];

      expect(finalLoss).toBeLessThan(initialLoss);
    });

    it('should handle verbose mode with warmup', () => {
      const fineTuner = new FineTuner(baseModel, 3, ['layer4']);

      expect(() => {
        fineTuner.train(X_train, y_train, {
          epochs: 15,
          learningRate: 0.01,
          warmupEpochs: 3,
          verbose: true,
        });
      }).not.toThrow();
    });
  });

  describe('Prediction', () => {
    it('should predict after fine-tuning', () => {
      const fineTuner = new FineTuner(baseModel, 3, ['layer4']);

      fineTuner.train(X_train, y_train, {
        epochs: 20,
        learningRate: 0.01,
        verbose: false,
      });

      const testInput = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const predicted = fineTuner.predict(testInput);

      expect(predicted).toBeGreaterThanOrEqual(0);
      expect(predicted).toBeLessThan(3);
    });

    it('should output valid probabilities', () => {
      const fineTuner = new FineTuner(baseModel, 3, ['layer4']);

      fineTuner.train(X_train, y_train, {
        epochs: 20,
        learningRate: 0.01,
        verbose: false,
      });

      const testInput = [0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0];
      const probas = fineTuner.predictProba(testInput);

      expect(probas).toHaveLength(3);
      const sum = probas.reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 5);
    });
  });
});

describe('TransferLearningManager', () => {
  describe('Strategy Recommendation', () => {
    it('should recommend feature extraction for small dataset + high similarity', () => {
      const rec = TransferLearningManager.recommendStrategy(500, 'high');

      expect(rec.strategy).toBe('feature_extraction');
      expect(rec.layersToFreeze.length).toBeGreaterThan(0);
      expect(rec.recommendedLR).toBeGreaterThan(0);
      expect(rec.reasoning).toBeTruthy();
    });

    it('should recommend fine-tuning for medium dataset', () => {
      const rec = TransferLearningManager.recommendStrategy(5000, 'medium');

      expect(['feature_extraction', 'fine_tuning']).toContain(rec.strategy);
      expect(rec.recommendedLR).toBeGreaterThan(0);
    });

    it('should recommend from_scratch for large dataset + low similarity', () => {
      const rec = TransferLearningManager.recommendStrategy(50000, 'low');

      expect(rec.strategy).toBe('from_scratch');
      expect(rec.layersToFreeze).toHaveLength(0);
    });

    it('should use lower LR for fine-tuning than feature extraction', () => {
      const recFE = TransferLearningManager.recommendStrategy(800, 'high');
      const recFT = TransferLearningManager.recommendStrategy(800, 'low');

      if (recFE.strategy === 'feature_extraction' && recFT.strategy === 'fine_tuning') {
        expect(recFT.recommendedLR).toBeLessThan(recFE.recommendedLR);
      }
    });

    it('should freeze fewer layers for less similar tasks', () => {
      const recHigh = TransferLearningManager.recommendStrategy(1000, 'high');
      const recLow = TransferLearningManager.recommendStrategy(1000, 'low');

      if (recHigh.strategy !== 'from_scratch' && recLow.strategy !== 'from_scratch') {
        expect(recLow.layersToFreeze.length).toBeLessThanOrEqual(
          recHigh.layersToFreeze.length
        );
      }
    });

    it('should provide reasoning for all recommendations', () => {
      const scenarios = [
        { size: 100, similarity: 'high' as const },
        { size: 1000, similarity: 'medium' as const },
        { size: 10000, similarity: 'low' as const },
        { size: 100000, similarity: 'high' as const },
      ];

      scenarios.forEach(({ size, similarity }) => {
        const rec = TransferLearningManager.recommendStrategy(size, similarity);
        expect(rec.reasoning).toBeTruthy();
        expect(rec.reasoning.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Strategy Comparison', () => {
    it('should return results for all strategies', () => {
      const dataset = {
        X: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
        y: [0, 1, 2],
      };

      const comparison = TransferLearningManager.compareStrategies(dataset);

      expect(comparison.featureExtraction).toBeDefined();
      expect(comparison.fineTuning).toBeDefined();
      expect(comparison.fromScratch).toBeDefined();
    });

    it('should include accuracy and time for each strategy', () => {
      const dataset = {
        X: [[1, 2, 3]],
        y: [0],
      };

      const comparison = TransferLearningManager.compareStrategies(dataset);

      expect(comparison.featureExtraction.accuracy).toBeGreaterThan(0);
      expect(comparison.featureExtraction.time).toBeGreaterThan(0);
      expect(comparison.fineTuning.accuracy).toBeGreaterThan(0);
      expect(comparison.fineTuning.time).toBeGreaterThan(0);
      expect(comparison.fromScratch.accuracy).toBeGreaterThan(0);
      expect(comparison.fromScratch.time).toBeGreaterThan(0);
    });

    it('should show feature extraction as fastest', () => {
      const dataset = {
        X: [[1, 2, 3]],
        y: [0],
      };

      const comparison = TransferLearningManager.compareStrategies(dataset);

      expect(comparison.featureExtraction.time).toBeLessThan(
        comparison.fineTuning.time
      );
      expect(comparison.featureExtraction.time).toBeLessThan(
        comparison.fromScratch.time
      );
    });

    it('should show fine-tuning with good accuracy', () => {
      const dataset = {
        X: [[1, 2, 3]],
        y: [0],
      };

      const comparison = TransferLearningManager.compareStrategies(dataset);

      // Fine-tuning típicamente tiene mejor accuracy
      expect(comparison.fineTuning.accuracy).toBeGreaterThanOrEqual(0.8);
    });
  });
});

describe('Integration Tests', () => {
  it('should complete full transfer learning workflow', () => {
    // 1. Crear modelo pre-entrenado
    const pretrainedModel = new PretrainedModel('medium', 20);

    // 2. Feature extraction
    const extractor = new FeatureExtractor(pretrainedModel, 3);

    const X = Array(10)
      .fill(0)
      .map(() => Array(20).fill(0).map(() => Math.random()));
    const y = Array(10)
      .fill(0)
      .map(() => Math.floor(Math.random() * 3));

    const history1 = extractor.train(X, y, {
      epochs: 10,
      learningRate: 0.01,
      verbose: false,
    });

    expect(history1.epochs).toBe(10);

    // 3. Fine-tuning
    const fineTuner = new FineTuner(
      new PretrainedModel('medium', 20),
      3,
      ['layer3', 'layer4']
    );

    const history2 = fineTuner.train(X, y, {
      epochs: 10,
      learningRate: 0.001,
      warmupEpochs: 2,
      verbose: false,
    });

    expect(history2.epochs).toBe(10);

    // 4. Predicciones
    const testSample = Array(20).fill(0.5);
    const pred1 = extractor.predict(testSample);
    const pred2 = fineTuner.predict(testSample);

    expect(pred1).toBeGreaterThanOrEqual(0);
    expect(pred2).toBeGreaterThanOrEqual(0);
  });

  it('should handle edge case: single example', () => {
    const model = new PretrainedModel('simple', 10);
    const extractor = new FeatureExtractor(model, 2);

    const X = [[1, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
    const y = [0];

    expect(() => {
      extractor.train(X, y, {
        epochs: 5,
        learningRate: 0.01,
        verbose: false,
      });
    }).not.toThrow();
  });

  it('should handle binary classification', () => {
    const model = new PretrainedModel('simple', 5);
    const extractor = new FeatureExtractor(model, 2);

    const X = [
      [1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
    ];
    const y = [0, 1];

    const history = extractor.train(X, y, {
      epochs: 10,
      learningRate: 0.01,
      verbose: false,
    });

    expect(history.epochs).toBe(10);

    const pred = extractor.predict([1, 0, 0, 0, 0]);
    expect([0, 1]).toContain(pred);
  });
});
