# Ejercicio 05: Gradient Descent

**Objetivo:** Implementar algoritmos de optimización basados en gradiente descendente, fundamentales para entrenar modelos de Machine Learning.

## 📖 Teoría

### ¿Qué es Gradient Descent?

Gradient Descent es el algoritmo de optimización más importante en Machine Learning. Se usa para:
- **Entrenar redes neuronales**: Ajustar pesos para minimizar el error
- **Regresión lineal**: Encontrar la línea que mejor ajusta los datos
- **Regresión logística**: Optimizar la función de clasificación
- **Cualquier función diferenciable**: Encontrar mínimos locales/globales

### El Problema de Optimización

Queremos encontrar `θ` que minimice una función de costo `J(θ)`:
```
θ* = argmin J(θ)
```

Ejemplo en regresión lineal:
```
J(θ) = (1/2m) Σ(hθ(xi) - yi)²
donde hθ(x) = θ0 + θ1*x
```

### Conceptos Fundamentales

#### 1. **El Gradiente**

El gradiente `∇J(θ)` es un vector de derivadas parciales:
```
∇J(θ) = [∂J/∂θ0, ∂J/∂θ1, ..., ∂J/∂θn]
```

Propiedades:
- Apunta en la dirección de **mayor crecimiento**
- La dirección opuesta `-∇J(θ)` es la de **mayor decrecimiento**
- Su magnitud indica qué tan empinada es la función

#### 2. **Batch Gradient Descent**

Actualiza los parámetros usando **todos** los datos:
```
θ = θ - α × ∇J(θ)
```

Donde:
- `α` (alpha) es el **learning rate** (tasa de aprendizaje)
- `∇J(θ)` es el gradiente calculado con todos los datos

**Ventajas:**
- Convergencia suave y estable
- Garantiza convergencia para funciones convexas

**Desventajas:**
- Lento con datasets grandes
- Costoso computacionalmente

#### 3. **Stochastic Gradient Descent (SGD)**

Actualiza los parámetros usando **un solo** ejemplo:
```
Para cada ejemplo (xi, yi):
  θ = θ - α × ∇J(θ; xi, yi)
```

**Ventajas:**
- Mucho más rápido
- Puede escapar de mínimos locales (por el ruido)
- Actualiza frecuentemente

**Desventajas:**
- Convergencia ruidosa
- Puede oscilar alrededor del mínimo

#### 4. **Mini-Batch Gradient Descent**

Compromiso entre Batch y SGD, usa un **subconjunto** de datos:
```
Para cada batch de tamaño b:
  θ = θ - α × ∇J(θ; batch)
```

**Ventajas:**
- Balance entre velocidad y estabilidad
- Aprovecha paralelización (GPUs)
- Es el más usado en práctica

#### 5. **Learning Rate (α)**

El learning rate controla el tamaño del paso:
```
- Muy pequeño: Convergencia lenta
- Muy grande: Puede diverger
- Óptimo: Convergencia rápida y estable
```

Estrategias:
- **Constante**: α fijo
- **Decaimiento**: α disminuye con el tiempo
- **Adaptativo**: Ajusta α automáticamente (Adam, RMSprop)

#### 6. **Optimizadores Avanzados**

**Momentum:**
```
v = β × v + ∇J(θ)
θ = θ - α × v
```
- Acelera convergencia
- Reduce oscilaciones

**RMSprop:**
```
s = β × s + (1-β) × (∇J(θ))²
θ = θ - α × ∇J(θ) / √(s + ε)
```
- Adapta learning rate por parámetro

**Adam (Adaptive Moment Estimation):**
```
m = β1 × m + (1-β1) × ∇J(θ)
v = β2 × v + (1-β2) × (∇J(θ))²
θ = θ - α × m / (√v + ε)
```
- Combina Momentum y RMSprop
- El más popular actualmente

---

## 🎯 Escenario

Tienes datos de precios de casas y quieres predecir el precio basado en el tamaño:
```
Datos: [(50m², $100k), (80m², $160k), (100m², $200k)]
Modelo: precio = θ0 + θ1 × tamaño
```

Objetivo: Encontrar θ0 y θ1 que minimicen el error:
```
J(θ) = (1/2m) Σ(θ0 + θ1×xi - yi)²
```

Gradiente:
```
∂J/∂θ0 = (1/m) Σ(θ0 + θ1×xi - yi)
∂J/∂θ1 = (1/m) Σ((θ0 + θ1×xi - yi) × xi)
```

---

## 📝 Instrucciones

### Parte 1: Batch Gradient Descent

Implementa el algoritmo básico:

```typescript
export interface GDParams {
  learningRate: number;
  iterations: number;
  tolerance?: number;
}

export interface GDResult {
  theta: number[];
  costs: number[];
  iterations: number;
}

export function gradientDescent(
  X: number[][],
  y: number[],
  params: GDParams
): GDResult {
  // Tu código aquí
  // 1. Inicializar theta con ceros
  // 2. Para cada iteración:
  //    - Calcular predicciones
  //    - Calcular gradiente
  //    - Actualizar theta
  //    - Guardar costo
  //    - Verificar convergencia
}

// Ejemplo de uso:
const X = [[1, 50], [1, 80], [1, 100]]; // [bias, tamaño]
const y = [100, 160, 200];
const result = gradientDescent(X, y, {
  learningRate: 0.01,
  iterations: 1000
});
console.log('Parámetros:', result.theta);
```

### Parte 2: Stochastic Gradient Descent

Implementa SGD:

```typescript
export function stochasticGradientDescent(
  X: number[][],
  y: number[],
  params: GDParams & { epochs: number }
): GDResult {
  // Tu código aquí
  // 1. Para cada época:
  //    - Mezclar los datos
  //    - Para cada ejemplo:
  //      - Calcular gradiente con un solo ejemplo
  //      - Actualizar theta
  //    - Calcular costo total de la época
}

// Ejemplo de uso:
const result = stochasticGradientDescent(X, y, {
  learningRate: 0.01,
  iterations: 100,
  epochs: 10
});
```

### Parte 3: Mini-Batch Gradient Descent

Implementa Mini-Batch GD:

```typescript
export function miniBatchGradientDescent(
  X: number[][],
  y: number[],
  params: GDParams & { batchSize: number }
): GDResult {
  // Tu código aquí
  // 1. Para cada época:
  //    - Dividir datos en batches
  //    - Para cada batch:
  //      - Calcular gradiente con el batch
  //      - Actualizar theta
}

// Ejemplo de uso:
const result = miniBatchGradientDescent(X, y, {
  learningRate: 0.01,
  iterations: 100,
  batchSize: 32
});
```

### Parte 4: Momentum

Implementa Momentum:

```typescript
export function gradientDescentWithMomentum(
  X: number[][],
  y: number[],
  params: GDParams & { momentum: number }
): GDResult {
  // Tu código aquí
  // 1. Inicializar velocidad v = 0
  // 2. Para cada iteración:
  //    - Calcular gradiente
  //    - v = β × v + ∇J(θ)
  //    - θ = θ - α × v
}

// Ejemplo de uso:
const result = gradientDescentWithMomentum(X, y, {
  learningRate: 0.01,
  iterations: 1000,
  momentum: 0.9
});
```

### Parte 5: Adam Optimizer

Implementa Adam:

```typescript
export interface AdamParams {
  learningRate: number;
  beta1?: number;
  beta2?: number;
  epsilon?: number;
  iterations: number;
}

export function adam(
  X: number[][],
  y: number[],
  params: AdamParams
): GDResult {
  // Tu código aquí
  // 1. Inicializar m = 0, v = 0
  // 2. Para cada iteración t:
  //    - Calcular gradiente g
  //    - m = β1×m + (1-β1)×g
  //    - v = β2×v + (1-β2)×g²
  //    - m̂ = m / (1-β1^t) (bias correction)
  //    - v̂ = v / (1-β2^t)
  //    - θ = θ - α × m̂ / (√v̂ + ε)
}

// Ejemplo de uso:
const result = adam(X, y, {
  learningRate: 0.01,
  beta1: 0.9,
  beta2: 0.999,
  epsilon: 1e-8,
  iterations: 1000
});
```

### Parte 6: Funciones de Utilidad

Implementa funciones auxiliares:

```typescript
export function predict(X: number[][], theta: number[]): number[] {
  // Tu código aquí
  // Calcula y = X × θ
}

export function computeCost(
  X: number[][],
  y: number[],
  theta: number[]
): number {
  // Tu código aquí
  // J(θ) = (1/2m) Σ(hθ(xi) - yi)²
}

export function computeGradient(
  X: number[][],
  y: number[],
  theta: number[]
): number[] {
  // Tu código aquí
  // ∇J(θ) = (1/m) × X^T × (X×θ - y)
}

export function shuffle<T>(array: T[]): T[] {
  // Fisher-Yates shuffle
}
```

---

## ✅ Resultado Esperado

Al finalizar, deberías poder:

1. ✅ Implementar Batch, SGD y Mini-Batch Gradient Descent
2. ✅ Calcular gradientes correctamente
3. ✅ Implementar optimizadores avanzados (Momentum, Adam)
4. ✅ Entender el impacto del learning rate
5. ✅ Visualizar la convergencia del costo
6. ✅ Comparar diferentes optimizadores

---

## 🧪 Tests

Ejecuta los tests para verificar tu implementación:

```bash
npm test 05-gradient-descent
```

Los tests verificarán:
- Convergencia a valores correctos
- Reducción monotónica del costo (Batch GD)
- Gradientes calculados correctamente
- Optimizadores convergen más rápido
- Manejo de diferentes learning rates

---

## 💡 Consejos

1. **Normaliza features**: X con media 0 y std 1 converge más rápido
2. **Learning rate schedule**: Reduce α con el tiempo
3. **Inicialización**: Empieza con theta = 0 o valores pequeños aleatorios
4. **Convergencia**: Detén cuando |ΔJ| < tolerance
5. **Vectorización**: Usa operaciones matriciales en lugar de loops

---

## 🎓 Conceptos Clave

- **Convexidad**: Funciones convexas tienen un solo mínimo global
- **Saddle points**: Puntos donde el gradiente es 0 pero no es mínimo
- **Vanishing gradients**: Gradientes muy pequeños → aprendizaje lento
- **Exploding gradients**: Gradientes muy grandes → divergencia
- **Learning rate decay**: α(t) = α0 / (1 + decay × t)
- **Gradient clipping**: Limita la magnitud del gradiente

---

## 📊 Comparación de Optimizadores

| Algoritmo | Velocidad | Memoria | Convergencia |
|-----------|-----------|---------|--------------|
| Batch GD  | Lenta     | Baja    | Suave        |
| SGD       | Rápida    | Baja    | Ruidosa      |
| Mini-Batch| Media     | Media   | Balanceada   |
| Momentum  | Rápida    | Media   | Suave        |
| Adam      | Muy rápida| Alta    | Muy suave    |

**Recomendación:** Usa Adam para la mayoría de problemas.

---

## 📚 Recursos

- [Gradient Descent - Andrew Ng](https://www.coursera.org/learn/machine-learning)
- [An Overview of Gradient Descent Optimization Algorithms](https://ruder.io/optimizing-gradient-descent/)
- [Adam: A Method for Stochastic Optimization](https://arxiv.org/abs/1412.6980)
- [Why Momentum Works](https://distill.pub/2017/momentum/)

---

**¡Comienza implementando en `gradient-descent.ts`!** 🚀
