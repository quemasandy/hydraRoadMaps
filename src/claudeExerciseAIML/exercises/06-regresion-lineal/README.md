# Ejercicio 06: Regresión Lineal

**Objetivo:** Implementar algoritmos de regresión lineal desde cero, tanto con la ecuación normal como con gradient descent, para predecir valores continuos.

## 📖 Teoría

### ¿Qué es la Regresión Lineal?

La regresión lineal es uno de los algoritmos más fundamentales en Machine Learning. Se usa para:
- **Predecir valores continuos**: Precio de casas, temperatura, ventas
- **Entender relaciones**: Cómo las features afectan el target
- **Baseline models**: Punto de partida antes de modelos complejos
- **Interpretabilidad**: Los coeficientes tienen significado claro

### El Modelo

Queremos encontrar una función lineal que relacione las features `X` con el target `y`:

```
ŷ = θ0 + θ1×x1 + θ2×x2 + ... + θn×xn
```

En notación matricial:
```
ŷ = X × θ
```

Donde:
- `ŷ` (y-hat): Predicción
- `X`: Matriz de features (m × n)
- `θ` (theta): Vector de parámetros (n)
- `θ0`: Intercepto (bias)
- `θ1...θn`: Pesos de cada feature

### Función de Costo: MSE (Mean Squared Error)

Queremos minimizar la diferencia entre predicciones y valores reales:

```
J(θ) = (1/2m) × Σ(ŷi - yi)²
     = (1/2m) × Σ(θ0 + θ1×xi1 + ... + θn×xin - yi)²
```

Donde:
- `m`: Número de ejemplos
- El factor `1/2` facilita las derivadas

**¿Por qué MSE?**
- Penaliza errores grandes (cuadrático)
- Diferenciable (permite gradient descent)
- Tiene solución analítica (ecuación normal)

### Métodos de Solución

#### 1. **Ecuación Normal (Normal Equation)**

Solución analítica directa sin iteraciones:

```
θ = (X^T × X)^-1 × X^T × y
```

**Ventajas:**
- No requiere elegir learning rate
- No requiere iteraciones
- Da la solución óptima directamente

**Desventajas:**
- Muy lento con muchas features (O(n³) por la inversión)
- No funciona si X^T × X es singular (no invertible)
- No escala bien (> 10,000 features)

**Cuándo usar:**
- Pocas features (< 10,000)
- Quieres la solución exacta
- No necesitas entrenar iterativamente

#### 2. **Gradient Descent**

Solución iterativa que usa optimización:

```
θ = θ - α × ∇J(θ)
```

**Gradiente del MSE:**
```
∂J/∂θj = (1/m) × Σ(ŷi - yi) × xij
∇J(θ) = (1/m) × X^T × (X×θ - y)
```

**Ventajas:**
- Escala bien con muchas features
- Funciona con datasets grandes
- Puede usar mini-batch / SGD

**Desventajas:**
- Requiere elegir learning rate
- Requiere múltiples iteraciones
- Puede requerir normalización de features

**Cuándo usar:**
- Muchas features (> 10,000)
- Datasets grandes (> 1,000,000 ejemplos)
- Necesitas actualizar el modelo incrementalmente

### Métricas de Evaluación

#### 1. **MSE (Mean Squared Error)**

```
MSE = (1/m) × Σ(ŷi - yi)²
```

**Características:**
- Unidades al cuadrado del target
- Penaliza errores grandes
- Sensible a outliers

#### 2. **RMSE (Root Mean Squared Error)**

```
RMSE = √MSE
```

**Características:**
- Mismas unidades que el target
- Más interpretable que MSE
- Estándar en competencias de ML

#### 3. **MAE (Mean Absolute Error)**

```
MAE = (1/m) × Σ|ŷi - yi|
```

**Características:**
- Menos sensible a outliers
- Lineal, no cuadrático
- Mismas unidades que el target

#### 4. **R² (Coefficient of Determination)**

```
R² = 1 - (SS_res / SS_tot)
SS_res = Σ(yi - ŷi)²  (suma de residuos)
SS_tot = Σ(yi - ȳ)²   (varianza total)
```

**Interpretación:**
- `R² = 1`: Modelo perfecto
- `R² = 0`: Modelo tan bueno como la media
- `R² < 0`: Modelo peor que la media

**Ventajas:**
- Normalizado (0 a 1)
- Independiente de escala
- Fácil de interpretar (% de varianza explicada)

### Feature Scaling

Normalizar features acelera convergencia:

#### 1. **Normalization (Min-Max Scaling)**

```
x_norm = (x - min) / (max - min)
```

Rango: [0, 1]

#### 2. **Standardization (Z-score)**

```
x_std = (x - μ) / σ
```

Rango: aprox. [-3, 3]

**¿Cuál usar?**
- **Normal Equation**: No requiere scaling
- **Gradient Descent**: Requiere scaling (preferir standardization)

### Regularización

Para evitar overfitting, penaliza parámetros grandes:

#### 1. **Ridge Regression (L2)**

```
J(θ) = MSE + λ × Σθj²
```

**Características:**
- Reduce magnitud de todos los θ
- No elimina features (θ ≈ 0, pero no = 0)
- Mejor cuando todas las features son relevantes

#### 2. **Lasso Regression (L1)**

```
J(θ) = MSE + λ × Σ|θj|
```

**Características:**
- Puede hacer θ = 0 exacto
- Hace feature selection
- Mejor cuando pocas features son relevantes

#### 3. **Elastic Net (L1 + L2)**

```
J(θ) = MSE + λ1 × Σ|θj| + λ2 × Σθj²
```

**Características:**
- Combina ventajas de L1 y L2
- Más robusto que Lasso
- Requiere ajustar 2 hiperparámetros

---

## 🎯 Escenario

Tienes datos de casas y quieres predecir precios:

```
Datos de entrenamiento:
Tamaño (m²) | Habitaciones | Precio ($k)
50          | 1            | 100
80          | 2            | 160
100         | 2            | 200
120         | 3            | 240
150         | 3            | 300
```

**Objetivo:** Crear un modelo que prediga el precio basado en tamaño y habitaciones.

```
Modelo: precio = θ0 + θ1×tamaño + θ2×habitaciones
```

**Predicción:**
```
Casa nueva: 90m², 2 habitaciones
¿Precio predicho?
```

---

## 📝 Instrucciones

### Parte 1: Ecuación Normal

Implementa la solución analítica:

```typescript
export interface LinearRegressionModel {
  theta: number[];
  intercept: number;
}

export function fitNormalEquation(
  X: number[][],
  y: number[]
): LinearRegressionModel {
  // Tu código aquí
  // 1. Añadir columna de bias (1s) a X
  // 2. Calcular θ = (X^T × X)^-1 × X^T × y
  // 3. Retornar modelo con theta
}

// Ejemplo de uso:
const X = [[50, 1], [80, 2], [100, 2], [120, 3], [150, 3]];
const y = [100, 160, 200, 240, 300];
const model = fitNormalEquation(X, y);
```

### Parte 2: Gradient Descent

Implementa la solución iterativa:

```typescript
export interface GDConfig {
  learningRate: number;
  iterations: number;
  tolerance?: number;
}

export interface TrainingResult {
  model: LinearRegressionModel;
  costs: number[];
  iterations: number;
}

export function fitGradientDescent(
  X: number[][],
  y: number[],
  config: GDConfig
): TrainingResult {
  // Tu código aquí
  // 1. Normalizar features (importante!)
  // 2. Usar gradient descent del ejercicio 05
  // 3. Retornar modelo y métricas
}
```

### Parte 3: Predicciones

Implementa funciones de predicción:

```typescript
export function predict(
  X: number[][],
  model: LinearRegressionModel
): number[] {
  // Tu código aquí
  // ŷ = X × θ
}

export function predictOne(
  x: number[],
  model: LinearRegressionModel
): number {
  // Predicción para un solo ejemplo
}
```

### Parte 4: Métricas

Implementa funciones de evaluación:

```typescript
export function computeMSE(y_true: number[], y_pred: number[]): number {
  // MSE = (1/m) × Σ(ŷi - yi)²
}

export function computeRMSE(y_true: number[], y_pred: number[]): number {
  // RMSE = √MSE
}

export function computeMAE(y_true: number[], y_pred: number[]): number {
  // MAE = (1/m) × Σ|ŷi - yi|
}

export function computeR2(y_true: number[], y_pred: number[]): number {
  // R² = 1 - (SS_res / SS_tot)
}
```

### Parte 5: Feature Scaling

Implementa normalización:

```typescript
export interface ScalerParams {
  mean: number[];
  std: number[];
  min?: number[];
  max?: number[];
}

export function standardize(X: number[][]): {
  X_scaled: number[][];
  params: ScalerParams;
} {
  // Standardization: (x - μ) / σ
}

export function normalize(X: number[][]): {
  X_scaled: number[][];
  params: ScalerParams;
} {
  // Normalization: (x - min) / (max - min)
}

export function applyScaling(
  X: number[][],
  params: ScalerParams
): number[][] {
  // Aplicar scaling con parámetros existentes
}
```

### Parte 6: Regularización (Bonus)

Implementa Ridge Regression:

```typescript
export function fitRidge(
  X: number[][],
  y: number[],
  lambda: number
): LinearRegressionModel {
  // Tu código aquí
  // θ = (X^T×X + λ×I)^-1 × X^T × y
}
```

### Parte 7: Validación

Implementa train/test split:

```typescript
export interface TrainTestSplit {
  X_train: number[][];
  X_test: number[][];
  y_train: number[];
  y_test: number[];
}

export function trainTestSplit(
  X: number[][],
  y: number[],
  testSize: number = 0.2,
  shuffle: boolean = true
): TrainTestSplit {
  // Dividir datos en train y test
}
```

---

## ✅ Resultado Esperado

Al finalizar, deberías poder:

1. ✅ Implementar regresión lineal con ecuación normal
2. ✅ Implementar regresión lineal con gradient descent
3. ✅ Hacer predicciones precisas
4. ✅ Calcular MSE, RMSE, MAE, R²
5. ✅ Normalizar y estandarizar features
6. ✅ Comparar ambos métodos de entrenamiento
7. ✅ Entender cuándo usar cada método

---

## 🧪 Tests

Ejecuta los tests para verificar tu implementación:

```bash
npm test 06-regresion-lineal
```

Los tests verificarán:
- Ecuación normal da solución correcta
- Gradient descent converge a la misma solución
- Predicciones son precisas
- Métricas se calculan correctamente
- Feature scaling funciona
- Manejo de edge cases

---

## 💡 Consejos

1. **Normaliza siempre con GD**: Gradient descent requiere features normalizadas
2. **Normal equation para pocas features**: Es exacto y rápido
3. **GD para muchas features**: Escala mejor
4. **Verifica dimensiones**: X debe ser (m × n), y debe ser (m,)
5. **Divide train/test**: Siempre evalúa en datos no vistos
6. **Visualiza residuos**: Deberían ser aleatorios, no tener patrón
7. **R² > 0.7 es bueno**: Depende del problema

---

## 🎓 Conceptos Clave

- **Linearidad**: Asume relación lineal entre X e y
- **Independencia**: Los errores deben ser independientes
- **Homoscedasticidad**: Varianza de errores constante
- **Normalidad de residuos**: Para inferencia estadística
- **No multicolinealidad**: Features no deben ser altamente correlacionadas
- **Bias-Variance Tradeoff**: Regularización controla complejidad

---

## 📊 Comparación de Métodos

| Método | Tiempo | Precisión | Escalabilidad | Cuándo usar |
|--------|--------|-----------|---------------|-------------|
| Normal Equation | O(n³) | Exacta | Baja (n < 10k) | Pocas features |
| Batch GD | O(k×m×n) | Muy buena | Alta | Muchas features |
| SGD | O(k×n) | Buena | Muy alta | Datasets enormes |

---

## 📚 Recursos

- [Linear Regression - Andrew Ng](https://www.coursera.org/learn/machine-learning)
- [An Introduction to Statistical Learning](https://www.statlearning.com/)
- [The Elements of Statistical Learning](https://hastie.su.domains/ElemStatLearn/)
- [Linear Regression Assumptions](https://statisticsbyjim.com/regression/ols-linear-regression-assumptions/)

---

**¡Comienza implementando en `linear-regression.ts`!** 🚀
