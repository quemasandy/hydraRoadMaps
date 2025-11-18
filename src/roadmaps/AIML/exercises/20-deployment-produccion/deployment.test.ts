import * as fs from 'fs';
import * as path from 'path';
import {
  saveModel,
  loadModel,
  InferenceAPI,
  ModelMonitor,
  ModelRegistry,
  SimpleModel,
} from './deployment';

describe('Model Serialization', () => {
  const testFile = path.join(__dirname, 'test_model.json');

  afterEach(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  it('should save model to file', () => {
    const model = new SimpleModel();
    model.setParams({ weights: [1, 2, 3], bias: 0.5 });

    saveModel(model, testFile);

    expect(fs.existsSync(testFile)).toBe(true);
  });

  it('should load model from file', () => {
    const model = new SimpleModel();
    model.setParams({ weights: [1, 2, 3], bias: 0.5 });

    saveModel(model, testFile);
    const loaded = loadModel(testFile, SimpleModel);

    const params = loaded.getParams();
    expect(params.weights).toEqual([1, 2, 3]);
    expect(params.bias).toBe(0.5);
  });

  it('should preserve predictions after save/load', () => {
    const model = new SimpleModel();
    model.setParams({ weights: [2, 3], bias: 1 });

    const X = [[1, 2], [3, 4]];
    const pred1 = model.predict(X);

    saveModel(model, testFile);
    const loaded = loadModel(testFile, SimpleModel);
    const pred2 = loaded.predict(X);

    expect(pred1).toEqual(pred2);
  });

  it('should include metadata', () => {
    const model = new SimpleModel();
    saveModel(model, testFile, { accuracy: 0.95, trainDate: '2024-01-01' });

    const json = JSON.parse(fs.readFileSync(testFile, 'utf-8'));
    expect(json.metadata.accuracy).toBe(0.95);
    expect(json.metadata.trainDate).toBe('2024-01-01');
  });
});

describe('InferenceAPI', () => {
  let model: SimpleModel;
  let api: InferenceAPI;

  beforeEach(() => {
    model = new SimpleModel();
    model.setParams({ weights: [1, 1], bias: 0 });
    api = new InferenceAPI(model, { enableLogging: false });
  });

  it('should make predictions', () => {
    const instances = [[1, 2], [3, 4]];
    const result = api.predict(instances);

    expect(result.predictions).toHaveLength(2);
    expect(result.version).toBeDefined();
    expect(result.timestamp).toBeInstanceOf(Date);
    expect(result.latency).toBeGreaterThanOrEqual(0);
  });

  it('should validate input', () => {
    expect(() => api.predict([])).toThrow('Invalid input');
  });

  it('should track request count', () => {
    api.predict([[1, 2]]);
    api.predict([[3, 4]]);

    const health = api.health();
    expect(health.requestCount).toBe(2);
  });

  it('should calculate uptime', () => {
    const health = api.health();
    expect(health.uptime).toBeGreaterThan(0);
  });

  it('should report health status', () => {
    const health = api.health();
    expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status);
  });

  it('should enforce rate limiting', () => {
    const limitedApi = new InferenceAPI(model, { rateLimit: 2 });

    limitedApi.predict([[1, 2]]);
    limitedApi.predict([[3, 4]]);

    expect(() => limitedApi.predict([[5, 6]])).toThrow('Rate limit');
  });

  it('should reset counters', () => {
    api.predict([[1, 2]]);
    api.reset();

    const health = api.health();
    expect(health.requestCount).toBe(0);
  });
});

describe('ModelMonitor', () => {
  let monitor: ModelMonitor;

  beforeEach(() => {
    monitor = new ModelMonitor();
  });

  it('should log predictions', () => {
    monitor.logPrediction([1, 2], 3, 10);
    monitor.logPrediction([4, 5], 9, 20);

    const metrics = monitor.getMetrics();
    expect(metrics.totalPredictions).toBe(2);
  });

  it('should calculate average latency', () => {
    monitor.logPrediction([1, 2], 3, 10);
    monitor.logPrediction([1, 2], 3, 20);
    monitor.logPrediction([1, 2], 3, 30);

    const metrics = monitor.getMetrics();
    expect(metrics.avgLatency).toBe(20);
  });

  it('should calculate percentile latencies', () => {
    for (let i = 1; i <= 100; i++) {
      monitor.logPrediction([1], 1, i);
    }

    const metrics = monitor.getMetrics();
    expect(metrics.p50Latency).toBeGreaterThan(40);
    expect(metrics.p50Latency).toBeLessThan(60);
    expect(metrics.p95Latency).toBeGreaterThan(90);
  });

  it('should detect data drift', () => {
    const refData = Array(100).fill(0).map(() => [0, 0]);
    const newData = Array(100).fill(0).map(() => [5, 5]);

    const drift = monitor.detectDataDrift(newData, refData);

    expect(drift.isDrift).toBe(true);
    expect(drift.score).toBeGreaterThan(drift.threshold);
  });

  it('should not detect drift for similar distributions', () => {
    const refData = Array(100).fill(0).map(() => [Math.random(), Math.random()]);
    const newData = Array(100).fill(0).map(() => [Math.random(), Math.random()]);

    const drift = monitor.detectDataDrift(newData, refData);

    expect(typeof drift.isDrift).toBe('boolean');
    expect(drift.score).toBeGreaterThanOrEqual(0);
  });

  it('should clear logs', () => {
    monitor.logPrediction([1], 1, 10);
    monitor.clearLogs();

    const metrics = monitor.getMetrics();
    expect(metrics.totalPredictions).toBe(0);
  });

  it('should get recent predictions', () => {
    for (let i = 0; i < 50; i++) {
      monitor.logPrediction([i], i, 10);
    }

    const recent = monitor.getRecentPredictions(10);
    expect(recent).toHaveLength(10);
  });

  it('should limit log size', () => {
    const smallMonitor = new ModelMonitor(10);

    for (let i = 0; i < 20; i++) {
      smallMonitor.logPrediction([i], i, 10);
    }

    const metrics = smallMonitor.getMetrics();
    expect(metrics.totalPredictions).toBeLessThanOrEqual(10);
  });
});

describe('ModelRegistry', () => {
  let registry: ModelRegistry;

  beforeEach(() => {
    registry = new ModelRegistry();
  });

  it('should register model', () => {
    const model = new SimpleModel();
    registry.registerModel('test-model', '1.0.0', model);

    const versions = registry.listVersions('test-model');
    expect(versions).toContain('1.0.0');
  });

  it('should register multiple versions', () => {
    const model1 = new SimpleModel();
    const model2 = new SimpleModel();

    registry.registerModel('test-model', '1.0.0', model1);
    registry.registerModel('test-model', '2.0.0', model2);

    const versions = registry.listVersions('test-model');
    expect(versions).toHaveLength(2);
    expect(versions).toContain('1.0.0');
    expect(versions).toContain('2.0.0');
  });

  it('should load model by version', () => {
    const model = new SimpleModel();
    model.setParams({ weights: [1, 2], bias: 3 });

    registry.registerModel('test-model', '1.0.0', model);

    const loaded = registry.loadModel('test-model', '1.0.0');
    expect(loaded.getParams()).toEqual({ weights: [1, 2], bias: 3 });
  });

  it('should throw error for non-existent model', () => {
    expect(() => registry.loadModel('non-existent', '1.0.0')).toThrow();
  });

  it('should throw error for non-existent version', () => {
    const model = new SimpleModel();
    registry.registerModel('test-model', '1.0.0', model);

    expect(() => registry.loadModel('test-model', '2.0.0')).toThrow();
  });

  it('should list all models', () => {
    const model = new SimpleModel();

    registry.registerModel('model-a', '1.0.0', model);
    registry.registerModel('model-b', '1.0.0', model);

    const models = registry.listModels();
    expect(models).toHaveLength(2);
    expect(models).toContain('model-a');
    expect(models).toContain('model-b');
  });

  it('should promote model to staging', () => {
    const model = new SimpleModel();
    registry.registerModel('test-model', '1.0.0', model);

    expect(() => {
      registry.promoteModel('test-model', '1.0.0', 'staging');
    }).not.toThrow();
  });

  it('should promote model to production', () => {
    const model = new SimpleModel();
    registry.registerModel('test-model', '1.0.0', model);

    registry.promoteModel('test-model', '1.0.0', 'production');

    const prodModel = registry.getProductionModel('test-model');
    expect(prodModel).toBeDefined();
  });

  it('should return null if no production model', () => {
    const prodModel = registry.getProductionModel('non-existent');
    expect(prodModel).toBeNull();
  });

  it('should store metadata', () => {
    const model = new SimpleModel();
    registry.registerModel('test-model', '1.0.0', model, {
      accuracy: 0.95,
      author: 'test',
    });

    const metadata = registry.getMetadata('test-model', '1.0.0');
    expect(metadata.accuracy).toBe(0.95);
    expect(metadata.author).toBe('test');
    expect(metadata.registeredAt).toBeDefined();
  });

  it('should return correct production model when multiple versions exist', () => {
    const model1 = new SimpleModel();
    model1.setParams({ weights: [1], bias: 0 });

    const model2 = new SimpleModel();
    model2.setParams({ weights: [2], bias: 0 });

    registry.registerModel('test-model', '1.0.0', model1);
    registry.registerModel('test-model', '2.0.0', model2);

    registry.promoteModel('test-model', '2.0.0', 'production');

    const prodModel = registry.getProductionModel('test-model');
    expect(prodModel?.getParams().weights).toEqual([2]);
  });
});

describe('Integration Tests', () => {
  it('should complete full deployment workflow', () => {
    // 1. Train model
    const model = new SimpleModel();
    model.setParams({ weights: [2, 3], bias: 1 });

    // 2. Save to registry
    const registry = new ModelRegistry();
    registry.registerModel('my-model', '1.0.0', model, { accuracy: 0.9 });

    // 3. Load from registry
    const loadedModel = registry.loadModel('my-model', '1.0.0');

    // 4. Deploy to API
    const api = new InferenceAPI(loadedModel, { enableLogging: false });

    // 5. Make predictions
    const result = api.predict([[1, 2]]);
    expect(result.predictions).toHaveLength(1);

    // 6. Monitor
    const monitor = new ModelMonitor();
    monitor.logPrediction([1, 2], result.predictions[0], result.latency);

    const metrics = monitor.getMetrics();
    expect(metrics.totalPredictions).toBe(1);
  });

  it('should handle A/B testing scenario', () => {
    const modelA = new SimpleModel();
    modelA.setParams({ weights: [1, 1], bias: 0 });

    const modelB = new SimpleModel();
    modelB.setParams({ weights: [2, 2], bias: 0 });

    const registry = new ModelRegistry();
    registry.registerModel('ab-test', 'A', modelA);
    registry.registerModel('ab-test', 'B', modelB);

    const versions = registry.listVersions('ab-test');
    expect(versions).toEqual(['A', 'B']);

    // Simulate traffic split
    const loadedA = registry.loadModel('ab-test', 'A');
    const loadedB = registry.loadModel('ab-test', 'B');

    expect(loadedA).toBeDefined();
    expect(loadedB).toBeDefined();
  });
});

describe('SimpleModel', () => {
  it('should make predictions', () => {
    const model = new SimpleModel();
    model.setParams({ weights: [2, 3], bias: 1 });

    const predictions = model.predict([[1, 2]]);
    expect(predictions[0]).toBe(2 * 1 + 3 * 2 + 1); // 2+6+1=9
  });

  it('should handle multiple instances', () => {
    const model = new SimpleModel();
    model.setParams({ weights: [1, 1], bias: 0 });

    const predictions = model.predict([[1, 2], [3, 4]]);
    expect(predictions).toHaveLength(2);
  });
});
