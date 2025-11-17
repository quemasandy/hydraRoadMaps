/**
 * Ejercicio 20: Deployment en Producción
 *
 * Implementación de componentes para deployment de modelos ML:
 * serialización, API de inferencia, monitoreo y versionado.
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// TIPOS E INTERFACES
// ============================================

export interface Model {
  predict(X: number[][]): number[];
  getParams(): Record<string, any>;
  setParams(params: Record<string, any>): void;
}

export interface SerializedModel {
  type: string;
  version: string;
  parameters: any;
  metadata: {
    trainedAt: string;
    accuracy?: number;
    [key: string]: any;
  };
}

export interface APIConfig {
  rateLimit?: number;
  timeout?: number;
  enableLogging?: boolean;
}

export interface PredictionLog {
  input: number[];
  prediction: number;
  latency: number;
  timestamp: Date;
}

// ============================================
// SERIALIZACIÓN
// ============================================

/**
 * Guarda modelo en formato JSON
 */
export function saveModel(
  model: Model,
  filepath: string,
  metadata: Record<string, any> = {}
): void {
  const serialized: SerializedModel = {
    type: model.constructor.name,
    version: '1.0.0',
    parameters: model.getParams(),
    metadata: {
      trainedAt: new Date().toISOString(),
      ...metadata,
    },
  };

  const json = JSON.stringify(serialized, null, 2);
  fs.writeFileSync(filepath, json, 'utf-8');
}

/**
 * Carga modelo desde JSON
 */
export function loadModel(filepath: string, ModelClass: any): Model {
  const json = fs.readFileSync(filepath, 'utf-8');
  const serialized: SerializedModel = JSON.parse(json);

  const model = new ModelClass();
  model.setParams(serialized.parameters);

  return model;
}

// ============================================
// API DE INFERENCIA
// ============================================

/**
 * API de Inferencia
 *
 * Simula API REST para servir predicciones.
 */
export class InferenceAPI {
  private model: Model;
  private config: Required<APIConfig>;
  private requestCount: number = 0;
  private startTime: Date;
  private errors: number = 0;

  constructor(model: Model, config: APIConfig = {}) {
    this.model = model;
    this.config = {
      rateLimit: config.rateLimit || 1000,
      timeout: config.timeout || 5000,
      enableLogging: config.enableLogging !== false,
    };
    this.startTime = new Date();
  }

  /**
   * Endpoint: POST /predict
   */
  predict(instances: number[][]): {
    predictions: number[];
    version: string;
    timestamp: Date;
    latency: number;
  } {
    const startTime = Date.now();

    // Validación
    if (!instances || instances.length === 0) {
      this.errors++;
      throw new Error('Invalid input: instances cannot be empty');
    }

    // Rate limiting
    this.requestCount++;
    if (this.requestCount > this.config.rateLimit) {
      this.errors++;
      throw new Error('Rate limit exceeded');
    }

    // Inferencia
    try {
      const predictions = this.model.predict(instances);
      const latency = Date.now() - startTime;

      if (this.config.enableLogging) {
        console.log(
          `[API] Prediction: ${instances.length} instances, ${latency}ms`
        );
      }

      return {
        predictions,
        version: '1.0.0',
        timestamp: new Date(),
        latency,
      };
    } catch (error) {
      this.errors++;
      throw error;
    }
  }

  /**
   * Endpoint: GET /health
   */
  health(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    latency: number;
    uptime: number;
    requestCount: number;
    errorRate: number;
  } {
    const uptime = Date.now() - this.startTime.getTime();
    const errorRate = this.requestCount > 0 ? this.errors / this.requestCount : 0;

    // Dummy latency check
    const latency = Math.random() * 100;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (errorRate > 0.5 || latency > 1000) {
      status = 'unhealthy';
    } else if (errorRate > 0.1 || latency > 500) {
      status = 'degraded';
    } else {
      status = 'healthy';
    }

    return {
      status,
      latency,
      uptime,
      requestCount: this.requestCount,
      errorRate,
    };
  }

  /**
   * Resetea contadores (para testing)
   */
  reset(): void {
    this.requestCount = 0;
    this.errors = 0;
    this.startTime = new Date();
  }
}

// ============================================
// MONITOREO
// ============================================

/**
 * Monitor de Modelo
 *
 * Tracking de métricas en producción.
 */
export class ModelMonitor {
  private predictions: PredictionLog[] = [];
  private maxLogs: number;

  constructor(maxLogs: number = 10000) {
    this.maxLogs = maxLogs;
  }

  /**
   * Registra predicción
   */
  logPrediction(
    input: number[],
    prediction: number,
    latency: number
  ): void {
    this.predictions.push({
      input: [...input],
      prediction,
      latency,
      timestamp: new Date(),
    });

    // Limitar tamaño de logs
    if (this.predictions.length > this.maxLogs) {
      this.predictions.shift();
    }
  }

  /**
   * Obtiene métricas agregadas
   */
  getMetrics(): {
    avgLatency: number;
    p50Latency: number;
    p95Latency: number;
    p99Latency: number;
    totalPredictions: number;
    errorRate: number;
  } {
    if (this.predictions.length === 0) {
      return {
        avgLatency: 0,
        p50Latency: 0,
        p95Latency: 0,
        p99Latency: 0,
        totalPredictions: 0,
        errorRate: 0,
      };
    }

    const latencies = this.predictions.map(p => p.latency).sort((a, b) => a - b);
    const avgLatency =
      latencies.reduce((a, b) => a + b, 0) / latencies.length;

    const p50Idx = Math.floor(latencies.length * 0.5);
    const p95Idx = Math.floor(latencies.length * 0.95);
    const p99Idx = Math.floor(latencies.length * 0.99);

    return {
      avgLatency,
      p50Latency: latencies[p50Idx] || 0,
      p95Latency: latencies[p95Idx] || 0,
      p99Latency: latencies[p99Idx] || 0,
      totalPredictions: this.predictions.length,
      errorRate: 0, // Simplificado
    };
  }

  /**
   * Detecta data drift
   *
   * Compara distribución de nuevos datos con referencia.
   * Usa KS test simplificado.
   */
  detectDataDrift(
    newData: number[][],
    referenceData: number[][]
  ): {
    isDrift: boolean;
    score: number;
    threshold: number;
  } {
    // Calcular estadísticas básicas para primera dimensión
    const newMeans = this.calculateMeans(newData);
    const refMeans = this.calculateMeans(referenceData);

    const newStds = this.calculateStds(newData, newMeans);
    const refStds = this.calculateStds(referenceData, refMeans);

    // Drift score: diferencia en medias y stds
    let totalDrift = 0;
    for (let i = 0; i < newMeans.length; i++) {
      const meanDiff = Math.abs(newMeans[i] - refMeans[i]);
      const stdDiff = Math.abs(newStds[i] - refStds[i]);
      totalDrift += meanDiff + stdDiff;
    }

    const driftScore = totalDrift / newMeans.length;
    const threshold = 0.5; // Arbitrario

    return {
      isDrift: driftScore > threshold,
      score: driftScore,
      threshold,
    };
  }

  private calculateMeans(data: number[][]): number[] {
    if (data.length === 0) return [];

    const numFeatures = data[0].length;
    const means: number[] = Array(numFeatures).fill(0);

    for (const row of data) {
      for (let i = 0; i < numFeatures; i++) {
        means[i] += row[i];
      }
    }

    return means.map(sum => sum / data.length);
  }

  private calculateStds(data: number[][], means: number[]): number[] {
    if (data.length === 0) return [];

    const numFeatures = data[0].length;
    const variances: number[] = Array(numFeatures).fill(0);

    for (const row of data) {
      for (let i = 0; i < numFeatures; i++) {
        variances[i] += (row[i] - means[i]) ** 2;
      }
    }

    return variances.map(v => Math.sqrt(v / data.length));
  }

  /**
   * Limpia logs
   */
  clearLogs(): void {
    this.predictions = [];
  }

  /**
   * Obtiene predicciones recientes
   */
  getRecentPredictions(n: number = 100): PredictionLog[] {
    return this.predictions.slice(-n);
  }
}

// ============================================
// REGISTRO DE MODELOS
// ============================================

/**
 * Model Registry
 *
 * Gestiona versiones de modelos.
 */
export class ModelRegistry {
  private models: Map<string, Map<string, { model: Model; metadata: any; stage: string }>> = new Map();

  /**
   * Registra modelo
   */
  registerModel(
    name: string,
    version: string,
    model: Model,
    metadata: any = {}
  ): void {
    if (!this.models.has(name)) {
      this.models.set(name, new Map());
    }

    this.models.get(name)!.set(version, {
      model,
      metadata: {
        ...metadata,
        registeredAt: new Date().toISOString(),
      },
      stage: 'none',
    });
  }

  /**
   * Carga modelo por nombre y versión
   */
  loadModel(name: string, version: string): Model {
    const modelVersions = this.models.get(name);
    if (!modelVersions) {
      throw new Error(`Model '${name}' not found`);
    }

    const modelEntry = modelVersions.get(version);
    if (!modelEntry) {
      throw new Error(`Version '${version}' of model '${name}' not found`);
    }

    return modelEntry.model;
  }

  /**
   * Lista versiones de un modelo
   */
  listVersions(name: string): string[] {
    const modelVersions = this.models.get(name);
    if (!modelVersions) {
      return [];
    }

    return Array.from(modelVersions.keys());
  }

  /**
   * Lista todos los modelos
   */
  listModels(): string[] {
    return Array.from(this.models.keys());
  }

  /**
   * Promueve modelo a staging/production
   */
  promoteModel(
    name: string,
    version: string,
    stage: 'staging' | 'production'
  ): void {
    const modelEntry = this.models.get(name)?.get(version);
    if (!modelEntry) {
      throw new Error(`Model '${name}' version '${version}' not found`);
    }

    modelEntry.stage = stage;
  }

  /**
   * Obtiene modelo en production
   */
  getProductionModel(name: string): Model | null {
    const modelVersions = this.models.get(name);
    if (!modelVersions) return null;

    for (const [version, entry] of modelVersions.entries()) {
      if (entry.stage === 'production') {
        return entry.model;
      }
    }

    return null;
  }

  /**
   * Obtiene metadata de modelo
   */
  getMetadata(name: string, version: string): any {
    return this.models.get(name)?.get(version)?.metadata || null;
  }
}

// ============================================
// MODELO DE EJEMPLO
// ============================================

export class SimpleModel implements Model {
  private weights: number[] = [];
  private bias: number = 0;

  predict(X: number[][]): number[] {
    return X.map(row => {
      let sum = this.bias;
      for (let i = 0; i < row.length && i < this.weights.length; i++) {
        sum += row[i] * this.weights[i];
      }
      return sum;
    });
  }

  getParams(): Record<string, any> {
    return {
      weights: [...this.weights],
      bias: this.bias,
    };
  }

  setParams(params: Record<string, any>): void {
    if (params.weights) this.weights = [...params.weights];
    if (params.bias !== undefined) this.bias = params.bias;
  }

  train(X: number[][], y: number[]): void {
    // Entrenar simple (para demo)
    this.weights = Array(X[0].length).fill(1);
    this.bias = 0;
  }
}

// ============================================
// EJEMPLO DE USO
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 20: Deployment en Producción ===\n');

  // Ejemplo 1: Serialización
  console.log('1. Serialización de Modelo');
  console.log('--------------------------');

  const model = new SimpleModel();
  model.setParams({ weights: [2, 3, 1], bias: 1 });

  const tempFile = path.join(__dirname, 'model_temp.json');
  saveModel(model, tempFile, { accuracy: 0.95 });
  console.log(`Modelo guardado en: ${tempFile}`);

  const loadedModel = loadModel(tempFile, SimpleModel);
  console.log('Parámetros cargados:', loadedModel.getParams());

  // Limpiar archivo temporal
  fs.unlinkSync(tempFile);

  // Ejemplo 2: API de Inferencia
  console.log('\n\n2. API de Inferencia');
  console.log('--------------------');

  const api = new InferenceAPI(model, { enableLogging: true });

  const instances = [[1, 2, 3], [4, 5, 6]];
  const result = api.predict(instances);

  console.log(`\nPredicciones:`, result.predictions);
  console.log(`Latencia: ${result.latency}ms`);
  console.log(`Version: ${result.version}`);

  // Health check
  const health = api.health();
  console.log(`\nHealth Status: ${health.status}`);
  console.log(`Uptime: ${health.uptime}ms`);
  console.log(`Request Count: ${health.requestCount}`);

  // Ejemplo 3: Monitoreo
  console.log('\n\n3. Monitoreo');
  console.log('------------');

  const monitor = new ModelMonitor();

  // Simular predicciones
  for (let i = 0; i < 100; i++) {
    const input = [Math.random(), Math.random()];
    const prediction = Math.random();
    const latency = Math.random() * 100;

    monitor.logPrediction(input, prediction, latency);
  }

  const metrics = monitor.getMetrics();
  console.log(`\nTotal Predictions: ${metrics.totalPredictions}`);
  console.log(`Avg Latency: ${metrics.avgLatency.toFixed(2)}ms`);
  console.log(`P50 Latency: ${metrics.p50Latency.toFixed(2)}ms`);
  console.log(`P95 Latency: ${metrics.p95Latency.toFixed(2)}ms`);
  console.log(`P99 Latency: ${metrics.p99Latency.toFixed(2)}ms`);

  // Data Drift
  const refData = Array(100).fill(0).map(() => [Math.random(), Math.random()]);
  const newData = Array(100).fill(0).map(() => [Math.random() + 0.1, Math.random()]);

  const drift = monitor.detectDataDrift(newData, refData);
  console.log(`\nData Drift Detected: ${drift.isDrift}`);
  console.log(`Drift Score: ${drift.score.toFixed(4)}`);

  // Ejemplo 4: Registry
  console.log('\n\n4. Model Registry');
  console.log('-----------------');

  const registry = new ModelRegistry();

  // Registrar versiones
  const modelV1 = new SimpleModel();
  modelV1.setParams({ weights: [1, 1], bias: 0 });

  const modelV2 = new SimpleModel();
  modelV2.setParams({ weights: [2, 2], bias: 1 });

  registry.registerModel('my-model', '1.0.0', modelV1, { accuracy: 0.85 });
  registry.registerModel('my-model', '2.0.0', modelV2, { accuracy: 0.92 });

  console.log('Registered Models:', registry.listModels());
  console.log('Versions of my-model:', registry.listVersions('my-model'));

  // Promover a production
  registry.promoteModel('my-model', '2.0.0', 'production');
  console.log('\nPromoted v2.0.0 to production');

  const prodModel = registry.getProductionModel('my-model');
  console.log('Production Model Params:', prodModel?.getParams());

  console.log('\n=== Fin del ejemplo ===');
}
