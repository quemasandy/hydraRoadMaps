# Ejercicio 19: Optimización de Hiperparámetros

**Objetivo:** Implementar técnicas de optimización de hiperparámetros incluyendo Grid Search, Random Search y validación cruzada para encontrar la mejor configuración del modelo.

## 📖 Teoría

### ¿Qué son Hiperparámetros?

**Parámetros que se configuran ANTES del entrenamiento y controlan el proceso de aprendizaje.**

**Diferencia con Parámetros:**
```
Parámetros (aprendidos):
  - Pesos de red neuronal
  - Coeficientes de regresión
  - Centroides de K-Means
  → Se optimizan durante entrenamiento

Hiperparámetros (configurados):
  - Learning rate
  - Número de capas/neuronas
  - Regularización (λ)
  → Se eligen antes de entrenar
```

**Ejemplos por algoritmo:**

```
Regresión Lineal:
  - λ (regularización L1/L2)
  - Polynomial degree

Árboles de Decisión:
  - max_depth
  - min_samples_split
  - min_samples_leaf

Redes Neuronales:
  - learning_rate
  - batch_size
  - num_layers
  - neurons_per_layer
  - dropout_rate
  - activation_function

K-Means:
  - k (número de clusters)
  - max_iterations

Gradient Boosting:
  - n_estimators
  - max_depth
  - learning_rate
```

### ¿Por qué Optimizar Hiperparámetros?

**Impacto enorme en performance:**

```
Ejemplo: Red Neuronal

Config A:
  lr=0.001, layers=2, neurons=64
  → Accuracy: 75%

Config B:
  lr=0.01, layers=3, neurons=128
  → Accuracy: 92%

Misma arquitectura, distinta config!
```

**Trade-offs:**
- **Underfitting:** Modelo muy simple (ej. max_depth=1)
- **Overfitting:** Modelo muy complejo (ej. max_depth=∞)
- **Optimal:** Balance perfecto

---

## 🎯 Estrategias de Búsqueda

### 1. Manual Search

**Probar configuraciones a mano.**

```
Ventajas:
  ✓ Usa conocimiento del dominio
  ✓ Rápido para expertos

Desventajas:
  ✗ Tedioso y lento
  ✗ Depende de intuición
  ✗ No sistemático
```

### 2. Grid Search

**Probar todas las combinaciones de una cuadrícula.**

```typescript
params = {
  learning_rate: [0.001, 0.01, 0.1],
  num_layers: [2, 3, 4],
  neurons: [32, 64, 128]
}

Grid Search:
  Total configs = 3 × 3 × 3 = 27
  Probar las 27 combinaciones
  Elegir la mejor
```

**Ventajas:**
- Sistemático y exhaustivo
- Garantiza encontrar mejor combinación en grid

**Desventajas:**
- Explosión combinatoria (curse of dimensionality)
- Desperdicia recursos en combinaciones malas
- Solo explora valores discretos

**Complejidad:**
```
n parámetros, k valores cada uno:
Total = k^n configuraciones

Ejemplo:
  5 parámetros, 10 valores → 10^5 = 100,000 configs!
```

### 3. Random Search

**Probar configuraciones aleatorias.**

```typescript
params = {
  learning_rate: uniform(0.0001, 0.1),
  num_layers: randint(2, 5),
  neurons: randint(16, 256)
}

Random Search:
  Total trials = 50 (configurable)
  Samplear 50 configuraciones aleatorias
  Elegir la mejor
```

**Ventajas:**
- Más eficiente que Grid Search
- Explora espacio continuo
- Fácil de paralel izar

**Desventajas:**
- No garantiza encontrar óptimo
- Puede duplicar configs similares

**¿Por qué funciona mejor?**
```
Grid Search:
  Valor1  Valor2  Valor3
    ×       ×       ×     → 3 valores únicos por parámetro

Random Search con 9 trials:
  Valores distribuidos en rango continuo
    → 9 valores únicos por parámetro

Para parámetros importantes, Random explora mejor!
```

### 4. Bayesian Optimization

**Usar modelos probabilísticos para elegir próxima configuración.**

```
Proceso:
  1. Probar configuración inicial
  2. Construir modelo (Gaussian Process)
  3. Modelo predice qué config probar siguiente
  4. Actualizar modelo con resultado
  5. Repetir

Acquisition Function:
  - Expected Improvement (EI)
  - Probability of Improvement (PI)
  - Upper Confidence Bound (UCB)
```

**Ventajas:**
- Muy eficiente (pocas evaluaciones)
- Balancea exploration/exploitation
- Estado del arte

**Desventajas:**
- Más complejo de implementar
- Overhead de modelado
- Difícil de paralelizar

---

## 📊 Validación Cruzada

**Evaluar modelo de forma robusta.**

### K-Fold Cross-Validation

```
Dataset dividido en K folds:

Fold 1: Test  | Train | Train | Train | Train
Fold 2: Train | Test  | Train | Train | Train
Fold 3: Train | Train | Test  | Train | Train
Fold 4: Train | Train | Train | Test  | Train
Fold 5: Train | Train | Train | Train | Test

Performance = Promedio de los K folds
```

**Ventajas:**
- Usa todos los datos para train y test
- Reduce varianza del estimador
- Detecta overfitting

**Típico:** K=5 o K=10

### Stratified K-Fold

**Mantiene proporción de clases en cada fold.**

```
Dataset desbalanceado:
  Clase 0: 90%
  Clase 1: 10%

K-Fold normal:
  Fold puede tener solo clase 0 → malo

Stratified K-Fold:
  Cada fold tiene 90% clase 0, 10% clase 1 → bien
```

### Train/Validation/Test Split

```
Durante Hyperparameter Search:
┌─────────────────────────────────┐
│         Training Set            │ 60%
│  (entrena modelo con cada config)│
├─────────────────────────────────┤
│        Validation Set           │ 20%
│  (elige mejor config)           │
├─────────────────────────────────┤
│          Test Set               │ 20%
│  (evalúa modelo final)          │
│  ¡NO USAR PARA TUNING!          │
└─────────────────────────────────┘

Proceso:
  1. Grid/Random Search usa Train+Val
  2. Mejor config se entrena en Train+Val
  3. Performance final se evalúa en Test
```

---

## 💡 Consejos Prácticos

### Orden de Importancia

**Empezar con hiperparámetros más importantes:**

1. **Learning rate** (crucial en casi todo)
2. **Architecture** (capas, neuronas)
3. **Regularización** (dropout, L2)
4. **Batch size**
5. **Optimizador** (Adam vs SGD)
6. **Activation functions**

### Rangos Comunes

```typescript
learning_rate: [1e-5, 1e-4, 1e-3, 1e-2, 1e-1]
                (escala logarítmica)

batch_size: [16, 32, 64, 128, 256]
            (potencias de 2)

dropout: [0.0, 0.1, 0.2, 0.3, 0.5]
         (0 = no dropout)

weight_decay: [1e-5, 1e-4, 1e-3]
              (regularización L2)
```

### Estrategia Práctica

**Coarse to Fine:**

```
1. Grid Search grueso:
   lr: [0.001, 0.01, 0.1]
   layers: [2, 4, 6]
   → Mejor: lr=0.01, layers=4

2. Random Search fino:
   lr: uniform(0.005, 0.015)
   layers: [3, 4, 5]
   → Refinar alrededor del mejor

3. Final tuning manual
```

### Early Stopping

**No entrenar epochs completos si modelo es malo.**

```typescript
if (validation_loss_at_epoch_5 > threshold) {
  // Este config es malo, no vale la pena continuar
  abort_training();
  try_next_config();
}
```

**Ahorra muchísimo tiempo.**

---

## 📝 Instrucciones

### Parte 1: Grid Search

```typescript
export class GridSearch {
  constructor(
    paramGrid: Record<string, any[]>,
    model: Model,
    scorer: (y_true: number[], y_pred: number[]) => number
  );

  fit(X: number[][], y: number[]): GridSearchResult;

  getBestParams(): Record<string, any>;
  getBestScore(): number;
}
```

### Parte 2: Random Search

```typescript
export class RandomSearch {
  constructor(
    paramDistributions: Record<string, Distribution>,
    model: Model,
    nIter: number,
    scorer: (y_true: number[], y_pred: number[]) => number
  );

  fit(X: number[][], y: number[]): RandomSearchResult;
}
```

### Parte 3: Cross-Validation

```typescript
export function crossValidate(
  model: Model,
  X: number[][],
  y: number[],
  cv: number,
  stratify?: boolean
): CrossValidationResult;

export function kFoldSplit(
  X: number[][],
  y: number[],
  k: number
): { train: number[]; test: number[] }[];
```

---

## ✅ Resultado Esperado

1. ✅ Grid Search exhaustivo
2. ✅ Random Search eficiente
3. ✅ K-Fold Cross-Validation
4. ✅ Stratified CV para clases desbalanceadas
5. ✅ Comparación de estrategias
6. ✅ Visualización de resultados

---

## 🧪 Tests

```bash
npm test 19-optimizacion-hyperparametros
```

---

## 📚 Recursos

- [Hyperparameter Optimization (Bergstra & Bengio)](https://www.jmlr.org/papers/v13/bergstra12a.html)
- [Random Search for Hyper-Parameter Optimization](https://www.jmlr.org/papers/volume13/bergstra12a/bergstra12a.pdf)
- [Scikit-learn: Model Selection](https://scikit-learn.org/stable/model_selection.html)

---

**¡Comienza implementando Grid Search en `hyperparameter-optimization.ts`!** 🔧
