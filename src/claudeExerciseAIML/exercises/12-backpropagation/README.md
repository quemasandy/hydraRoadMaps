# Ejercicio 12: Backpropagation

**Objetivo:** Implementar el algoritmo de backpropagation desde cero para entrenar redes neuronales, entendiendo la regla de la cadena y la actualización de pesos.

## 📖 Teoría

### ¿Qué es Backpropagation?

**Algoritmo fundamental** para entrenar redes neuronales (1986, Rumelhart, Hinton, Williams).

**Idea central:** Propagar el error desde la salida hacia atrás, calculando gradientes para actualizar pesos.

```
Forward Pass:  Input → Hidden → Output → Loss
                 ↓        ↓        ↓       ↓
Backward Pass:  ∇W₁  ←  ∇W₂   ←  ∇ŷ   ←  ∇L
```

**¿Por qué es importante?**
- **Eficiencia:** Calcula todos los gradientes en una pasada
- **Preciso:** Usa regla de la cadena matemática exacta
- **Escalable:** Funciona para redes de cualquier profundidad

### La Regla de la Cadena

**Fundamento matemático** de backpropagation.

**En cálculo:**
```
Si y = f(g(x)), entonces:
dy/dx = (dy/dg) × (dg/dx)
```

**En redes neuronales:**
```
Si Loss = L(ŷ) y ŷ = σ(z) y z = W×x + b:

∂L/∂W = (∂L/∂ŷ) × (∂ŷ/∂z) × (∂z/∂W)
        └─────┘   └─────┘   └─────┘
        error     derivada   input
                  activación
```

**Ejemplo numérico:**
```
Forward:
z = 2×3 + 1 = 7
ŷ = σ(7) = 0.999
L = (1 - 0.999)² = 0.000001

Backward:
∂L/∂ŷ = 2(ŷ - y) = 2(0.999 - 1) = -0.002
∂ŷ/∂z = σ'(7) = σ(7)×(1-σ(7)) = 0.001
∂z/∂W = x = 3

∂L/∂W = (-0.002) × (0.001) × 3 = -0.000006
```

### Algoritmo Backpropagation (2 capas)

**Arquitectura:** Input → Hidden → Output

**Forward Pass:**
```
1. z₁ = W₁×x + b₁          (suma ponderada hidden)
2. h = σ(z₁)               (activación hidden)
3. z₂ = W₂×h + b₂          (suma ponderada output)
4. ŷ = σ(z₂)               (activación output)
5. L = (y - ŷ)²            (loss)
```

**Backward Pass:**
```
1. Gradiente output layer:
   ∂L/∂ŷ = 2(ŷ - y)                    ← error en output
   ∂ŷ/∂z₂ = σ'(z₂)                     ← derivada activación
   δ₂ = ∂L/∂ŷ × ∂ŷ/∂z₂                ← error term output

2. Gradientes W₂ y b₂:
   ∂L/∂W₂ = δ₂ × hᵀ                    ← gradient weight
   ∂L/∂b₂ = δ₂                         ← gradient bias

3. Gradiente hidden layer (chain rule):
   ∂L/∂h = W₂ᵀ × δ₂                    ← error propagado
   ∂h/∂z₁ = σ'(z₁)                     ← derivada activación
   δ₁ = ∂L/∂h ⊙ ∂h/∂z₁                 ← error term hidden (⊙ = element-wise)

4. Gradientes W₁ y b₁:
   ∂L/∂W₁ = δ₁ × xᵀ                    ← gradient weight
   ∂L/∂b₁ = δ₁                         ← gradient bias
```

**Update (Gradient Descent):**
```
W₁ = W₁ - η × ∂L/∂W₁
b₁ = b₁ - η × ∂L/∂b₁
W₂ = W₂ - η × ∂L/∂W₂
b₂ = b₂ - η × ∂L/∂b₂
```

### Derivadas de Funciones de Activación

**Sigmoid:**
```
σ(z) = 1/(1 + e⁻ᶻ)
σ'(z) = σ(z) × (1 - σ(z))
```

**Tanh:**
```
tanh(z) = (eᶻ - e⁻ᶻ)/(eᶻ + e⁻ᶻ)
tanh'(z) = 1 - tanh²(z)
```

**ReLU:**
```
ReLU(z) = max(0, z)
ReLU'(z) = { 1 if z > 0
           { 0 if z ≤ 0
```

### Funciones de Loss

**Mean Squared Error (MSE) - Regresión:**
```
L = (1/m) × Σ(yᵢ - ŷᵢ)²
∂L/∂ŷ = (2/m) × (ŷ - y)
```

**Binary Cross-Entropy - Clasificación:**
```
L = -(1/m) × Σ[y×log(ŷ) + (1-y)×log(1-ŷ)]
∂L/∂ŷ = (ŷ - y) / [ŷ×(1-ŷ)]
```

### Vanishing Gradient Problem

**Problema:** Gradientes muy pequeños en capas iniciales.

**Causa:**
```
δ₁ = δ₂ × W₂ᵀ × σ'(z₁)
     └─propagado─┘ └─derivada─┘
```

Si σ'(z₁) < 1 (como en sigmoid: max=0.25), el gradiente se "desvanece" multiplicándose por valores < 1 en cada capa.

**Ejemplo numérico (red de 3 capas con sigmoid):**
```
Capa 3: δ₃ = 1.0
Capa 2: δ₂ = δ₃ × W₃ᵀ × σ'(z₂) = 1.0 × 0.5 × 0.25 = 0.125
Capa 1: δ₁ = δ₂ × W₂ᵀ × σ'(z₁) = 0.125 × 0.5 × 0.25 = 0.0156
```

Capa 1 recibe gradiente ~64x más pequeño que capa 3!

**Soluciones:**
1. **ReLU:** Derivada = 1 para z > 0 (no satura)
2. **Batch Normalization:** Normaliza activaciones
3. **Residual Connections:** Skip connections (ResNet)
4. **Better initialization:** Xavier/He
5. **Lower learning rate** en capas profundas

### Gradient Checking

**Verificar** que backpropagation está correcto.

**Método:** Aproximación numérica del gradiente.

```
Gradiente analítico: ∂L/∂w (calculado por backprop)

Gradiente numérico:
∂L/∂w ≈ [L(w + ε) - L(w - ε)] / (2ε)
donde ε = 1e-7
```

**Comparación:**
```
difference = |grad_analytic - grad_numeric| /
             max(|grad_analytic|, |grad_numeric|)

✓ difference < 1e-7: Excelente
✓ difference < 1e-5: Bueno
✗ difference > 1e-3: Error en implementación
```

---

## 🎯 Escenario

**Dataset:** Clasificación binaria de flores Iris

```
Sepal Length | Sepal Width | Clase
5.1          | 3.5         | 0 (Setosa)
6.2          | 2.9         | 1 (No Setosa)
```

**Objetivo:** Entrenar red neuronal con backpropagation para clasificar correctamente.

---

## 📝 Instrucciones

### Parte 1: Funciones de Loss

```typescript
export function meanSquaredError(
  y_true: number[],
  y_pred: number[]
): number;

export function meanSquaredErrorDerivative(
  y_true: number[],
  y_pred: number[]
): number[];

export function binaryCrossEntropy(
  y_true: number[],
  y_pred: number[]
): number;

export function binaryCrossEntropyDerivative(
  y_true: number[],
  y_pred: number[]
): number[];
```

### Parte 2: MLP con Backpropagation

```typescript
export interface BackpropConfig {
  inputSize: number;
  hiddenSize: number;
  outputSize: number;
  activation?: 'sigmoid' | 'tanh' | 'relu';
  learningRate?: number;
  lossFunction?: 'mse' | 'binary_crossentropy';
}

export interface TrainingHistory {
  epochs: number[];
  losses: number[];
  accuracies?: number[];
}

export class MLPWithBackprop {
  constructor(config: BackpropConfig) {
    // Inicializar red
  }

  forward(X: number[][]): {
    z1: number[][];
    h: number[][];
    z2: number[][];
    output: number[][];
  } {
    // Forward pass guardando valores intermedios
    // Necesarios para backward pass
  }

  backward(
    X: number[][],
    y: number[][],
    cache: {
      z1: number[][];
      h: number[][];
      z2: number[][];
      output: number[][];
    }
  ): void {
    // Backward pass
    // 1. Calcular δ₂ (error output layer)
    // 2. Calcular gradientes ∂L/∂W₂, ∂L/∂b₂
    // 3. Propagar error: calcular δ₁
    // 4. Calcular gradientes ∂L/∂W₁, ∂L/∂b₁
    // 5. Actualizar pesos con gradient descent
  }

  fit(
    X: number[][],
    y: number[][],
    epochs: number,
    verbose?: boolean
  ): TrainingHistory {
    // Entrenar red con backpropagation
  }

  predict(X: number[][]): number[];
  predictProba(X: number[][]): number[][];
}
```

### Parte 3: Gradient Checking

```typescript
export function numericalGradient(
  computeLoss: (w: number) => number,
  w: number,
  epsilon?: number
): number;

export function checkGradients(
  model: MLPWithBackprop,
  X: number[][],
  y: number[][],
  epsilon?: number
): {
  maxDifference: number;
  avgDifference: number;
  isCorrect: boolean;
};
```

### Parte 4: Utilidades

```typescript
export function oneHotEncode(y: number[], numClasses: number): number[][];

export function computeAccuracy(
  y_true: number[],
  y_pred: number[]
): number;

export function shuffle(
  X: number[][],
  y: number[][]
): { X_shuffled: number[][]; y_shuffled: number[][] };
```

---

## ✅ Resultado Esperado

1. ✅ Implementar MSE y Binary Cross-Entropy con derivadas
2. ✅ MLP con forward pass completo (guardando valores intermedios)
3. ✅ Backward pass con chain rule
4. ✅ Actualización de pesos con gradient descent
5. ✅ Entrenar red y ver loss disminuir
6. ✅ Gradient checking para verificar implementación
7. ✅ Visualizar curva de aprendizaje

---

## 🧪 Tests

```bash
npm test 12-backpropagation
```

---

## 💡 Consejos

1. **Guardar valores intermedios** en forward pass (z1, h, z2, ŷ)
2. **Implementar paso a paso:** Primero forward, luego backward
3. **Verificar con gradient checking** antes de entrenar
4. **Learning rate:** Empezar con 0.01, ajustar si diverge
5. **Batch vs Sample:** Esta implementación usa batch completo
6. **Debugging:** Imprimir shapes de matrices para verificar dimensiones
7. **Vanishing gradient:** Si no aprende, probar ReLU o aumentar learning rate

---

## 📊 Matemáticas Detalladas

**Gradiente de W₂ (output layer):**
```
Para un ejemplo (x, y):

Forward:
h = σ(W₁×x + b₁)
ŷ = σ(W₂×h + b₂)
L = (y - ŷ)²

Backward:
∂L/∂W₂ = ∂L/∂ŷ × ∂ŷ/∂z₂ × ∂z₂/∂W₂

donde:
∂L/∂ŷ = -2(y - ŷ)           ← derivada del loss
∂ŷ/∂z₂ = σ'(z₂)             ← derivada sigmoid
∂z₂/∂W₂ = hᵀ                ← derivada de z = W×h + b

Combinando:
δ₂ = -2(y - ŷ) ⊙ σ'(z₂)     ← error term
∂L/∂W₂ = δ₂ × hᵀ            ← gradient (outer product)
```

**Gradiente de W₁ (hidden layer):**
```
Propagamos error desde output:

∂L/∂h = W₂ᵀ × δ₂             ← error propagado desde output
∂h/∂z₁ = σ'(z₁)              ← derivada activación hidden
δ₁ = ∂L/∂h ⊙ σ'(z₁)          ← error term hidden
∂L/∂W₁ = δ₁ × xᵀ             ← gradient
```

**Dimensiones (crucial para implementación):**
```
Batch de m ejemplos:

X:  (m, n_in)
W₁: (n_h, n_in)     W₁×Xᵀ: (n_h, m)
b₁: (n_h, 1)        →  (n_h, m) [broadcasting]
h:  (m, n_h)

W₂: (n_out, n_h)    W₂×hᵀ: (n_out, m)
b₂: (n_out, 1)      →  (n_out, m) [broadcasting]
ŷ:  (m, n_out)

Gradientes:
∂L/∂W₂: (n_out, n_h)  ← mismo shape que W₂
∂L/∂W₁: (n_h, n_in)   ← mismo shape que W₁
```

---

## 📚 Recursos

- [Backpropagation - 3Blue1Brown](https://www.youtube.com/watch?v=tIeHLnjs5U8)
- [Backprop Calculus - 3Blue1Brown](https://www.youtube.com/watch?v=Ilg3gGewQ5U)
- [CS231n: Backpropagation](http://cs231n.github.io/optimization-2/)
- [Gradient Checking](https://www.coursera.org/learn/deep-neural-network/lecture/Y3s6r/gradient-checking)

---

**¡Comienza implementando las funciones de loss en `backpropagation.ts`!** 🔙
