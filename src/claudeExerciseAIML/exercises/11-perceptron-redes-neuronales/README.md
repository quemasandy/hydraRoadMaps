# Ejercicio 11: Perceptrón y Redes Neuronales

**Objetivo:** Implementar desde cero un perceptrón y redes neuronales Multi-Layer Perceptron (MLP) con diferentes funciones de activación.

## 📖 Teoría

### ¿Qué es un Perceptrón?

**El modelo más simple de neurona artificial** (1958, Frank Rosenblatt)

**Idea central:** Una función que toma entradas, las pondera, suma y decide.

```
      x₁ ──w₁──┐
      x₂ ──w₂──┤
      x₃ ──w₃──├──→ Σ(wixi + b) ──→ σ(z) ──→ ŷ
       ...      │
      xₙ ──wₙ──┘
         bias b
```

**Ecuación matemática:**
```
z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
ŷ = σ(z)
```

Donde:
- **x**: Features de entrada
- **w**: Pesos (weights) - importancia de cada feature
- **b**: Bias - umbral de activación
- **z**: Suma ponderada (weighted sum)
- **σ**: Función de activación
- **ŷ**: Predicción final

**¿Cómo aprende?**
Ajusta pesos w y bias b para minimizar error.

**Limitación:** Solo puede clasificar datos **linealmente separables**.

### Funciones de Activación

**¿Por qué las necesitamos?**
Sin funciones no-lineales, múltiples capas = 1 capa lineal.
Las activaciones introducen **no-linealidad**.

#### 1. Sigmoid (Logística)
```
σ(z) = 1 / (1 + e^(-z))

Rango: (0, 1)
Derivada: σ'(z) = σ(z) × (1 - σ(z))
```

**Ventajas:**
- Salida interpretable como probabilidad
- Suave y diferenciable

**Desventajas:**
- **Vanishing gradient**: Derivada muy pequeña en extremos
- Salida no centrada en 0 (afecta convergencia)

#### 2. Tanh (Tangente Hiperbólica)
```
tanh(z) = (e^z - e^(-z)) / (e^z + e^(-z))

Rango: (-1, 1)
Derivada: tanh'(z) = 1 - tanh²(z)
```

**Ventajas:**
- Centrada en 0 (mejor que sigmoid)
- Convergencia más rápida

**Desventajas:**
- También sufre vanishing gradient

#### 3. ReLU (Rectified Linear Unit)
```
ReLU(z) = max(0, z)

Rango: [0, ∞)
Derivada: ReLU'(z) = { 1 si z > 0, 0 si z ≤ 0 }
```

**Ventajas:**
- **NO vanishing gradient** para z > 0
- Computacionalmente eficiente
- Convergencia ~6x más rápida que sigmoid/tanh

**Desventajas:**
- **Dying ReLU**: Neuronas pueden "morir" (output=0 siempre)

#### 4. Leaky ReLU
```
LeakyReLU(z) = max(αz, z)  donde α = 0.01 típicamente

Rango: (-∞, ∞)
Derivada: { 1 si z > 0, α si z ≤ 0 }
```

**Ventajas:**
- Resuelve dying ReLU
- Permite gradiente pequeño para z < 0

**Recomendación moderna:**
- **Capas ocultas:** ReLU o variantes (Leaky ReLU, ELU, GELU)
- **Salida binaria:** Sigmoid
- **Salida multiclase:** Softmax
- **Salida regresión:** Lineal (sin activación)

### Multi-Layer Perceptron (MLP)

**Red neuronal feedforward** con múltiples capas.

**Arquitectura:**
```
Input Layer → Hidden Layer(s) → Output Layer

Ejemplo 3-4-2:
  x₁   ╔═══╗
  x₂ →→║ h₁║→→╔═══╗→ y₁
  x₃   ║ h₂║  ║out║
       ║ h₃║→→╚═══╝→ y₂
       ║ h₄║
       ╚═══╝
```

**Forward Pass (Propagación hacia adelante):**
```
1. Input → Hidden Layer:
   h = σ(W₁ × x + b₁)

2. Hidden → Output Layer:
   ŷ = σ(W₂ × h + b₂)
```

Donde:
- W₁: Matriz de pesos input-to-hidden (hidden_size × input_size)
- b₁: Vector bias para hidden layer
- W₂: Matriz de pesos hidden-to-output (output_size × hidden_size)
- b₂: Vector bias para output layer

**¿Por qué múltiples capas?**
- 1 hidden layer: Puede aproximar cualquier función continua (Universal Approximation Theorem)
- Más capas: Aprenden representaciones jerárquicas
  - Capa 1: Features básicos
  - Capa 2: Combinaciones de features
  - Capa 3: Conceptos más abstractos

**Trade-offs:**
- Más neuronas/capas = Más capacidad pero más overfitting
- Pocas neuronas = Underfitting
- **Regla de oro:** Empezar simple, aumentar complejidad según necesidad

### Inicialización de Pesos

**¡IMPORTANTE!** No inicializar con ceros → todas neuronas aprenden lo mismo.

**Xavier/Glorot Initialization:**
```
w ~ Uniform(-√(6/(nᵢₙ + nₒᵤₜ)), √(6/(nᵢₙ + nₒᵤₜ)))

o Normal(0, √(2/(nᵢₙ + nₒᵤₜ)))
```

**He Initialization** (para ReLU):
```
w ~ Normal(0, √(2/nᵢₙ))
```

---

## 🎯 Escenario

**Problema 1:** Clasificación binaria de flores Iris (Setosa vs No-Setosa)

```
Sepal Length | Sepal Width | Clase
5.1          | 3.5         | Setosa
6.2          | 2.9         | Versicolor
```

**Problema 2:** Clasificación multiclase de dígitos escritos a mano

```
Pixels de 8x8 → Red Neuronal → Dígito (0-9)
```

---

## 📝 Instrucciones

### Parte 1: Funciones de Activación

```typescript
export function sigmoid(z: number | number[]): number | number[];
export function sigmoidDerivative(z: number | number[]): number | number[];

export function tanh(z: number | number[]): number | number[];
export function tanhDerivative(z: number | number[]): number | number[];

export function relu(z: number | number[]): number | number[];
export function reluDerivative(z: number | number[]): number | number[];

export function leakyRelu(z: number | number[], alpha?: number): number | number[];
export function leakyReluDerivative(z: number | number[], alpha?: number): number | number[];
```

### Parte 2: Perceptrón Simple

```typescript
export class Perceptron {
  private weights: number[] = [];
  private bias: number = 0;
  private learningRate: number;

  constructor(learningRate: number = 0.01) {
    this.learningRate = learningRate;
  }

  fit(X: number[][], y: number[], epochs: number = 100): void {
    // 1. Inicializar pesos
    // 2. Para cada época:
    //    - Para cada ejemplo:
    //      a. Calcular predicción: ŷ = σ(w·x + b)
    //      b. Calcular error: e = y - ŷ
    //      c. Actualizar pesos: w = w + η × e × x
    //      d. Actualizar bias: b = b + η × e
  }

  predict(X: number[][]): number[];
}
```

### Parte 3: Multi-Layer Perceptron

```typescript
export interface MLPConfig {
  inputSize: number;
  hiddenSize: number;
  outputSize: number;
  activation?: 'sigmoid' | 'tanh' | 'relu' | 'leaky_relu';
  learningRate?: number;
  weightInit?: 'random' | 'xavier' | 'he';
}

export class MultiLayerPerceptron {
  private W1: number[][] = [];  // Input → Hidden
  private b1: number[] = [];
  private W2: number[][] = [];  // Hidden → Output
  private b2: number[] = [];

  constructor(config: MLPConfig) {
    // Inicializar pesos y bias
  }

  forward(X: number[][]): {
    hidden: number[][];
    output: number[][];
  } {
    // 1. Hidden layer: h = σ(W₁ × X + b₁)
    // 2. Output layer: ŷ = σ(W₂ × h + b₂)
  }

  predict(X: number[][]): number[];
  predictProba(X: number[][]): number[][];
}
```

### Parte 4: Utilidades

```typescript
export function initializeWeights(
  rows: number,
  cols: number,
  method?: 'random' | 'xavier' | 'he'
): number[][];

export function dotProduct(a: number[], b: number[]): number;

export function matrixMultiply(A: number[][], B: number[][]): number[][];

export function addBias(X: number[][]): number[][];
```

---

## ✅ Resultado Esperado

1. ✅ Implementar 4 funciones de activación + derivadas
2. ✅ Perceptrón simple con entrenamiento
3. ✅ MLP con forward pass
4. ✅ Diferentes métodos de inicialización de pesos
5. ✅ Predicciones binarias y probabilísticas
6. ✅ Comparar activaciones en problemas reales

---

## 🧪 Tests

```bash
npm test 11-perceptron-redes-neuronales
```

---

## 💡 Consejos

1. **Sigmoid:** Solo para output layer en clasificación binaria
2. **ReLU:** Default para hidden layers (rápido, efectivo)
3. **Leaky ReLU:** Si ves "dying ReLU" (neuronas muertas)
4. **Tanh:** Alternativa a sigmoid, mejor centrado
5. **Hidden size:** Empieza con ~64-128 neuronas
6. **Inicialización:** Xavier para sigmoid/tanh, He para ReLU
7. **Learning rate:** 0.01 es buen punto de partida

---

## 📊 Matemáticas Clave

**Forward Pass (2 capas):**
```
Input (x) → Hidden (h) → Output (ŷ)

h = σ₁(W₁ × x + b₁)    ← Activación en hidden layer
ŷ = σ₂(W₂ × h + b₂)    ← Activación en output layer
```

**Dimensiones:**
```
x:  (m, n)      m ejemplos, n features
W₁: (h, n)      h neuronas hidden, n inputs
b₁: (h,)        bias para cada neurona hidden
h:  (m, h)      activaciones hidden layer
W₂: (k, h)      k outputs, h hidden
b₂: (k,)        bias para cada output
ŷ:  (m, k)      predicciones finales
```

---

## 📚 Recursos

- [Neural Networks - 3Blue1Brown](https://www.youtube.com/watch?v=aircAruvnKk)
- [Activation Functions - ML Glossary](https://ml-cheatsheet.readthedocs.io/en/latest/activation_functions.html)
- [Universal Approximation Theorem](https://en.wikipedia.org/wiki/Universal_approximation_theorem)
- [Weight Initialization](https://paperswithcode.com/method/xavier-initialization)

---

**¡Comienza implementando las funciones de activación en `neural-network.ts`!** 🧠
