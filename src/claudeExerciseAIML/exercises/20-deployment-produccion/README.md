# Ejercicio 20: Deployment en Producción

**Objetivo:** Implementar componentes para llevar modelos de ML a producción, incluyendo serialización, APIs de inferencia, monitoreo y versionado.

## 📖 Teoría

### Del Notebook a Producción

**El proceso de deployment:**

```
Desarrollo → Entrenamiento → Evaluación → Deployment → Monitoreo
  (Local)      (GPU)        (Offline)    (Servidor)   (Continuo)
```

**Desafíos:**
- ✗ Modelo funciona en notebook pero no en producción
- ✗ Latencia muy alta para usuarios reales
- ✗ Modelo degrada con el tiempo (data drift)
- ✗ Difícil debuggear errores en producción
- ✗ Actualizar modelo sin downtime

---

## 🎯 Componentes de Producción

### 1. Serialización de Modelos

**Guardar y cargar modelos entrenados.**

```typescript
// Entrenar
model.fit(X_train, y_train);

// Guardar
saveModel(model, 'model_v1.json');

// Cargar
const model = loadModel('model_v1.json');

// Usar
const predictions = model.predict(X_new);
```

**Formatos comunes:**
- JSON: Simple, human-readable
- Pickle: Python-specific
- ONNX: Cross-framework
- TensorFlow SavedModel
- PyTorch .pt files

### 2. API de Inferencia

**Endpoint REST para predicciones.**

```
POST /predict
{
  "instances": [[1.2, 3.4, 5.6]]
}

Response:
{
  "predictions": [7.8],
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Consideraciones:**
- Validación de input
- Manejo de errores
- Rate limiting
- Autenticación
- Logging

### 3. Monitoreo

**Tracking de performance en producción.**

```
Métricas a monitorear:
- Latencia (p50, p95, p99)
- Throughput (requests/seg)
- Error rate
- Model accuracy (cuando hay ground truth)
- Data drift
- Resource usage (CPU, RAM)
```

### 4. Versionado

**Gestionar múltiples versiones del modelo.**

```
Models:
  - v1.0.0: Baseline (2024-01-01)
  - v1.1.0: +10% accuracy (2024-02-01)
  - v2.0.0: New architecture (2024-03-01)

A/B Testing:
  50% traffic → v1.1.0
  50% traffic → v2.0.0

  Compare metrics → Deploy mejor
```

---

## 📝 Instrucciones

### Parte 1: Serialización

```typescript
export interface SerializedModel {
  type: string;
  version: string;
  parameters: any;
  metadata: {
    trainedAt: Date;
    accuracy?: number;
    [key: string]: any;
  };
}

export function saveModel(
  model: Model,
  filepath: string
): void;

export function loadModel(
  filepath: string
): Model;
```

### Parte 2: API de Inferencia

```typescript
export class InferenceAPI {
  constructor(model: Model, config: APIConfig);

  predict(instances: number[][]): {
    predictions: number[];
    version: string;
    timestamp: Date;
  };

  health(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    latency: number;
    uptime: number;
  };
}
```

### Parte 3: Monitoreo

```typescript
export class ModelMonitor {
  logPrediction(
    input: number[],
    prediction: number,
    latency: number
  ): void;

  getMetrics(): {
    avgLatency: number;
    p95Latency: number;
    totalPredictions: number;
    errorRate: number;
  };

  detectDataDrift(
    newData: number[][],
    referenceData: number[][]
  ): {
    isDrift: boolean;
    score: number;
  };
}
```

### Parte 4: Versionado

```typescript
export class ModelRegistry {
  registerModel(
    name: string,
    version: string,
    model: Model,
    metadata: any
  ): void;

  loadModel(name: string, version: string): Model;

  listVersions(name: string): string[];

  promoteModel(name: string, version: string, stage: 'staging' | 'production'): void;
}
```

---

## ✅ Resultado Esperado

1. ✅ Serialización y deserialización de modelos
2. ✅ API de inferencia simulada
3. ✅ Monitoreo de latencia y throughput
4. ✅ Detección de data drift
5. ✅ Registry de versiones
6. ✅ A/B testing simulado

---

## 🧪 Tests

```bash
npm test 20-deployment-produccion
```

---

## 💡 Best Practices

1. **Validación:** Siempre validar input antes de inferencia
2. **Fallbacks:** Tener modelo backup si principal falla
3. **Caching:** Cachear predicciones frecuentes
4. **Batch:** Procesar múltiples requests juntos
5. **Async:** No bloquear thread principal
6. **Logging:** Log todo para debugging
7. **Testing:** Test de carga antes de deployment

---

## 📚 Recursos

- [ML Model Deployment Best Practices](https://ml-ops.org/)
- [Google MLOps Guide](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning)
- [AWS SageMaker](https://aws.amazon.com/sagemaker/)

---

**¡Comienza implementando serialización en `deployment.ts`!** 🚀
