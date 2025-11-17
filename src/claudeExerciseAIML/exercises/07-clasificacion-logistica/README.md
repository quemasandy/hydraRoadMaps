# Ejercicio 07: Clasificación Logística

**Objetivo:** Implementar regresión logística desde cero para clasificación binaria y multiclase, usando la función sigmoid y cross-entropy loss.

## 📖 Teoría

### ¿Qué es la Regresión Logística?

A pesar del nombre "regresión", se usa para **clasificación**. Es fundamental en ML:
- **Clasificación binaria**: Spam/No spam, Fraude/Legítimo
- **Clasificación multiclase**: Dígitos (0-9), Categorías
- **Probabilidades**: Devuelve probabilidades interpretables
- **Baseline**: Punto de partida antes de modelos complejos

### Clasificación Binaria

#### El Modelo

Para clasificación binaria (0 o 1):

```
z = θ0 + θ1×x1 + θ2×x2 + ... + θn×xn = θ^T × x
ŷ = σ(z) = 1 / (1 + e^-z)
```

Donde:
- `z`: Combinación lineal (logit)
- `σ(z)`: Función sigmoid (0 a 1)
- `ŷ`: Probabilidad de clase 1

**Decisión:**
```
Clase 1 si ŷ ≥ 0.5
Clase 0 si ŷ < 0.5
```

#### Función Sigmoid

```
σ(z) = 1 / (1 + e^-z)
```

**Propiedades:**
- Rango: (0, 1) → perfecta para probabilidades
- `σ(0) = 0.5`: Punto de decisión
- `σ(+∞) = 1`: Confianza alta en clase 1
- `σ(-∞) = 0`: Confianza alta en clase 0
- Derivada: `σ'(z) = σ(z) × (1 - σ(z))`

**Forma de S:** Transición suave entre 0 y 1

```
   1 |           ___---
     |       ___/
 0.5 |    __/
     |___/
   0 |_______________
     -∞    0    +∞
```

#### Función de Costo: Cross-Entropy

Para regresión lineal usábamos MSE, pero para clasificación usamos **cross-entropy**:

```
J(θ) = -(1/m) × Σ[yi×log(ŷi) + (1-yi)×log(1-ŷi)]
```

**¿Por qué no MSE?**
- MSE es no-convexa con sigmoid → múltiples mínimos locales
- Cross-entropy es convexa → un solo mínimo global
- Penaliza predicciones incorrectas exponencialmente

**Interpretación:**
```
Si y = 1: costo = -log(ŷ)
  ŷ → 1: costo → 0 (bueno)
  ŷ → 0: costo → ∞ (muy malo)

Si y = 0: costo = -log(1-ŷ)
  ŷ → 0: costo → 0 (bueno)
  ŷ → 1: costo → ∞ (muy malo)
```

#### Gradiente

```
∂J/∂θj = (1/m) × Σ(ŷi - yi) × xij
∇J(θ) = (1/m) × X^T × (ŷ - y)
```

**¡Igual que en regresión lineal!** La diferencia está en que `ŷ = σ(X×θ)`.

### Decision Boundary

El **límite de decisión** es donde `σ(z) = 0.5`, es decir, `z = 0`:

```
θ0 + θ1×x1 + θ2×x2 = 0
```

**Características:**
- Es una línea recta (lineal) en 2D
- Un plano en 3D
- Un hiperplano en n dimensiones

**Limitación:** Solo puede separar clases linealmente separables.

**Solución:** Añadir features polinomiales (x1², x1×x2, etc.)

### Clasificación Multiclase

#### 1. **One-vs-Rest (OvR) / One-vs-All (OvA)**

Entrenar K clasificadores binarios:

```
Clasificador 1: Clase 1 vs (Clase 2, 3, ..., K)
Clasificador 2: Clase 2 vs (Clase 1, 3, ..., K)
...
Clasificador K: Clase K vs (Clase 1, 2, ..., K-1)
```

**Predicción:**
```
clase = argmax(p1, p2, ..., pK)
```

**Ventajas:**
- Fácil de implementar
- Funciona con cualquier clasificador binario

**Desventajas:**
- K modelos separados
- Las probabilidades no suman 1

#### 2. **Softmax Regression (Multinomial Logistic)**

Generalización directa de logistic regression:

```
z_k = θ_k^T × x  (para cada clase k)
P(y = k | x) = e^z_k / Σ(e^z_j)
```

**Propiedades:**
- Las probabilidades suman 1
- Un solo modelo para todas las clases
- Más eficiente que OvR

**Función de costo (Cross-Entropy Multiclase):**
```
J(θ) = -(1/m) × ΣΣ[1{yi=k} × log(P(y=k|xi))]
```

### Regularización

Al igual que en regresión lineal, podemos regularizar:

#### L2 (Ridge)

```
J(θ) = CrossEntropy + (λ/2m) × Σθj²
```

**Efecto:**
- Reduce overfitting
- Hace el modelo más general
- Estabiliza coeficientes

### Métricas de Evaluación

#### 1. **Accuracy (Exactitud)**

```
Accuracy = (TP + TN) / (TP + TN + FP + FN)
```

**Problema:** Engañosa con clases desbalanceadas.

Ejemplo: 95% son clase 0
- Modelo que siempre predice 0 → 95% accuracy
- ¡Pero es inútil!

#### 2. **Precision (Precisión)**

```
Precision = TP / (TP + FP)
```

"De los que predije como positivos, ¿cuántos lo eran?"

#### 3. **Recall (Sensibilidad)**

```
Recall = TP / (TP + FN)
```

"De todos los positivos reales, ¿cuántos detecté?"

#### 4. **F1-Score**

```
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

Media armónica de precision y recall.

#### 5. **Confusion Matrix**

```
                Predicho
                0    1
Real    0    [ TN   FP ]
        1    [ FN   TP ]
```

**Interpretación:**
- **TN (True Negative)**: Correctamente clasificado como 0
- **TP (True Positive)**: Correctamente clasificado como 1
- **FP (False Positive)**: Error tipo I (falsa alarma)
- **FN (False Negative)**: Error tipo II (falló en detectar)

---

## 🎯 Escenario

Tienes datos de exámenes de admisión y quieres predecir si un estudiante será admitido:

```
Datos de entrenamiento:
Exam1 | Exam2 | Admitido
45    | 85    | 1
52    | 68    | 0
60    | 86    | 1
70    | 96    | 1
72    | 45    | 0
80    | 75    | 1
```

**Objetivo:** Predecir admisión basado en notas de exámenes.

```
Modelo: P(admitido=1) = σ(θ0 + θ1×exam1 + θ2×exam2)
```

**Predicción:**
```
Nuevo estudiante: Exam1=65, Exam2=80
¿Probabilidad de admisión?
```

---

## 📝 Instrucciones

### Parte 1: Función Sigmoid

Implementa la función sigmoid:

```typescript
export function sigmoid(z: number | number[]): number | number[] {
  // Tu código aquí
  // σ(z) = 1 / (1 + e^-z)
  // Manejar tanto números como arrays
}

// Ejemplos:
sigmoid(0)     // → 0.5
sigmoid(10)    // → ~1
sigmoid(-10)   // → ~0
sigmoid([0, 1, -1]) // → [0.5, 0.73, 0.27]
```

### Parte 2: Clasificación Binaria

Implementa regresión logística binaria:

```typescript
export interface LogisticRegressionModel {
  theta: number[];
  intercept: number;
  scalerParams?: ScalerParams;
}

export interface TrainingConfig {
  learningRate: number;
  iterations: number;
  tolerance?: number;
  normalize?: boolean;
  lambda?: number; // Regularización
}

export interface TrainingResult {
  model: LogisticRegressionModel;
  costs: number[];
  iterations: number;
}

export function fitLogisticRegression(
  X: number[][],
  y: number[],
  config: TrainingConfig
): TrainingResult {
  // Tu código aquí
  // 1. Normalizar features si es necesario
  // 2. Inicializar theta
  // 3. Gradient descent:
  //    - Calcular z = X × θ
  //    - Calcular ŷ = σ(z)
  //    - Calcular costo (cross-entropy)
  //    - Calcular gradiente
  //    - Actualizar θ
}
```

### Parte 3: Predicciones

Implementa funciones de predicción:

```typescript
export function predictProba(
  X: number[][],
  model: LogisticRegressionModel
): number[] {
  // Retorna probabilidades P(y=1)
}

export function predictBinary(
  X: number[][],
  model: LogisticRegressionModel,
  threshold: number = 0.5
): number[] {
  // Retorna clases (0 o 1)
}
```

### Parte 4: Funciones de Costo

Implementa cross-entropy:

```typescript
export function computeCrossEntropy(
  y_true: number[],
  y_pred_proba: number[]
): number {
  // J = -(1/m) × Σ[y×log(ŷ) + (1-y)×log(1-ŷ)]
}

export function computeCrossEntropyWithRegularization(
  y_true: number[],
  y_pred_proba: number[],
  theta: number[],
  lambda: number
): number {
  // J + (λ/2m) × Σθj²
}
```

### Parte 5: Métricas

Implementa métricas de clasificación:

```typescript
export interface ClassificationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
}

export function computeAccuracy(y_true: number[], y_pred: number[]): number {
  // (TP + TN) / total
}

export function computeConfusionMatrix(
  y_true: number[],
  y_pred: number[]
): number[][] {
  // [[TN, FP], [FN, TP]]
}

export function computeMetrics(
  y_true: number[],
  y_pred: number[]
): ClassificationMetrics {
  // Calcula todas las métricas
}
```

### Parte 6: Clasificación Multiclase (Bonus)

Implementa One-vs-Rest:

```typescript
export interface MulticlassModel {
  models: LogisticRegressionModel[];
  classes: number[];
}

export function fitOneVsRest(
  X: number[][],
  y: number[],
  config: TrainingConfig
): MulticlassModel {
  // Entrenar un modelo por cada clase
}

export function predictMulticlass(
  X: number[][],
  model: MulticlassModel
): number[] {
  // Retorna la clase con mayor probabilidad
}
```

### Parte 7: Decision Boundary (Bonus)

Implementa función para visualizar límite de decisión:

```typescript
export function getDecisionBoundary(
  model: LogisticRegressionModel,
  x1_range: [number, number],
  num_points: number = 100
): number[][] {
  // Retorna puntos (x1, x2) donde θ0 + θ1×x1 + θ2×x2 = 0
}
```

---

## ✅ Resultado Esperado

Al finalizar, deberías poder:

1. ✅ Implementar regresión logística binaria
2. ✅ Calcular probabilidades y hacer predicciones
3. ✅ Usar cross-entropy como función de costo
4. ✅ Calcular accuracy, precision, recall, F1
5. ✅ Crear confusion matrix
6. ✅ Implementar One-vs-Rest para multiclase
7. ✅ Entender el decision boundary

---

## 🧪 Tests

Ejecuta los tests para verificar tu implementación:

```bash
npm test 07-clasificacion-logistica
```

Los tests verificarán:
- Sigmoid funciona correctamente
- Cross-entropy se calcula bien
- Modelo converge
- Predicciones son precisas
- Métricas son correctas
- Multiclase funciona

---

## 💡 Consejos

1. **Estabilidad numérica**: Limita valores de sigmoid para evitar log(0)
2. **Normaliza features**: Mejora convergencia
3. **Learning rate**: 0.01 - 0.1 suele funcionar bien
4. **Regularización**: Usa λ=1 como punto de partida
5. **Threshold**: Ajusta según costo de FP vs FN
6. **Clases desbalanceadas**: Usa F1-score en lugar de accuracy
7. **Inicialización**: theta = 0 funciona bien (a diferencia de redes neuronales)

---

## 🎓 Conceptos Clave

- **Logit**: Logaritmo de odds → `log(p/(1-p)) = θ^T×x`
- **Odds**: Razón de probabilidades → `p/(1-p)`
- **Log-likelihood**: Maximizar log-likelihood = minimizar cross-entropy
- **Maximum Likelihood Estimation (MLE)**: Base teórica de logistic regression
- **Convexidad**: Cross-entropy + sigmoid es convexa → convergencia garantizada
- **Separabilidad lineal**: Clases deben ser linealmente separables
- **Polynomial features**: Añadir x1², x1×x2 para boundaries no lineales

---

## 📊 Comparación: Regresión Lineal vs Logística

| Aspecto | Regresión Lineal | Regresión Logística |
|---------|------------------|---------------------|
| Tarea | Regresión | Clasificación |
| Output | Continuo (-∞, +∞) | Probabilidad [0, 1] |
| Función | h(x) = θ^T×x | h(x) = σ(θ^T×x) |
| Costo | MSE | Cross-Entropy |
| Gradiente | (1/m)X^T(ŷ-y) | (1/m)X^T(σ(Xθ)-y) |
| Convexidad | Convexa | Convexa |
| Interpretación | Valor predicho | Probabilidad |

---

## 📚 Recursos

- [Logistic Regression - Andrew Ng](https://www.coursera.org/learn/machine-learning)
- [Cross-Entropy Loss](https://ml-cheatsheet.readthedocs.io/en/latest/loss_functions.html#cross-entropy)
- [Precision and Recall](https://en.wikipedia.org/wiki/Precision_and_recall)
- [Softmax Regression](https://deeplearning.ai/ai-notes/optimization/)

---

**¡Comienza implementando en `logistic-regression.ts`!** 🚀
