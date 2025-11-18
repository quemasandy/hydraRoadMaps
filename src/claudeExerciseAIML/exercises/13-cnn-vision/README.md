# Ejercicio 13: CNN para Visión

**Objetivo:** Implementar Convolutional Neural Networks (CNN) desde cero, entendiendo convoluciones, pooling y arquitecturas para visión por computadora.

## 📖 Teoría

### ¿Qué es una CNN?

**Red neuronal especializada para procesar datos con estructura de grilla** (imágenes, audio, video).

**Problema que resuelven:**
- Redes densas (fully-connected) necesitan millones de parámetros para imágenes
- Pierden información espacial
- No explotan patrones locales repetitivos

**Ejemplo:**
```
Imagen 28×28 → Fully Connected (100 neuronas) = 28×28×100 = 78,400 parámetros
Imagen 28×28 → Conv (10 filtros 3×3) = 3×3×10 = 90 parámetros
```

**¡870x menos parámetros con CNN!**

### Operación de Convolución

**Deslizar un filtro sobre la imagen** para detectar patrones locales.

**Matemática:**
```
(I * K)[i,j] = ΣΣ I[i+m, j+n] × K[m,n]
              m,n

donde:
- I: Imagen de entrada
- K: Kernel/filtro
- *: Operador de convolución (no multiplicación)
```

**Ejemplo 2D:**
```
Imagen (5×5):              Kernel (3×3):
1  2  3  4  5              1  0 -1
6  7  8  9  10       *     1  0 -1  =  ?
11 12 13 14 15             1  0 -1
16 17 18 19 20
21 22 23 24 25

Cálculo en posición (1,1):
(1×1 + 2×0 + 3×-1) +
(6×1 + 7×0 + 8×-1) +
(11×1 + 12×0 + 13×-1) = -6

Feature Map:
-6  -6  -6
-6  -6  -6
-6  -6  -6
```

**Interpretación:**
Este kernel detecta **bordes verticales** (diferencia entre izquierda y derecha).

### Parámetros de Convolución

**1. Padding (Relleno):**
```
Valid (sin padding):
Input: n×n
Output: (n-k+1)×(n-k+1)  ← la imagen se reduce

Same (con padding):
Padding = (k-1)/2
Output: n×n  ← mantiene tamaño
```

**2. Stride (Paso):**
```
Stride = 1: Mover filtro 1 pixel a la vez
Stride = 2: Mover filtro 2 pixels (subsampling)

Output size = ⌊(n + 2p - k)/s⌋ + 1
donde:
- n: tamaño input
- k: tamaño kernel
- p: padding
- s: stride
```

**3. Channels (Canales):**
```
RGB image: 3 canales (R, G, B)
Kernel: debe tener misma profundidad que input
Output: número de kernels = número de feature maps
```

### Tipos de Kernels Comunes

**Edge Detection (Detección de bordes):**
```
Horizontal:          Vertical:
 1  1  1             1  0 -1
 0  0  0             1  0 -1
-1 -1 -1             1  0 -1
```

**Sharpen (Afilar):**
```
 0 -1  0
-1  5 -1
 0 -1  0
```

**Blur (Desenfoque):**
```
1/9 × [1 1 1]
      [1 1 1]
      [1 1 1]
```

### Pooling Layers

**Reducir dimensionalidad espacial** preservando información importante.

**Max Pooling:**
```
Input (4×4):          Max Pool 2×2, stride=2:
1  2  3  4
5  6  7  8       →    6  8
9  10 11 12           14 16
13 14 15 16

Toma el máximo de cada región 2×2
```

**Average Pooling:**
```
Mismo proceso pero promediando en vez de max
```

**Ventajas:**
- Reduce parámetros y cómputo
- Invarianza a pequeñas traslaciones
- Previene overfitting
- Extrae features dominantes

**Max vs Average:**
- **Max:** Mejor para detectar features (si feature presente, max es alto)
- **Average:** Más suave, preserva información de fondo

### Arquitectura CNN Típica

```
Input Image (28×28×1)
    ↓
Conv Layer 1 (10 filters 3×3) → (26×26×10)
    ↓ ReLU
MaxPool (2×2) → (13×13×10)
    ↓
Conv Layer 2 (20 filters 3×3) → (11×11×20)
    ↓ ReLU
MaxPool (2×2) → (5×5×20) = 500 features
    ↓
Flatten → (500)
    ↓
Dense (50) → ReLU
    ↓
Dense (10) → Softmax
    ↓
Output (10 classes)
```

**Patrón:**
```
CONV → ReLU → POOL → CONV → ReLU → POOL → FC → ReLU → FC
```

### ¿Por qué funcionan las CNN?

**1. Local Connectivity (Conexiones Locales):**
- Cada neurona solo mira ventana pequeña (receptive field)
- Patrones visuales son locales (bordes, texturas)

**2. Parameter Sharing (Compartir Parámetros):**
- Mismo filtro se usa en toda la imagen
- Detector de borde útil arriba también útil abajo

**3. Translation Invariance (Invarianza a traslación):**
- Reconoce gato independientemente de posición
- Pooling ayuda con esto

**4. Hierarchical Features (Features Jerárquicas):**
```
Capa 1: Bordes, colores
Capa 2: Texturas, partes simples
Capa 3: Partes de objetos
Capa 4: Objetos completos
```

### Cálculo del Receptive Field

**Campo receptivo:** Región de la imagen original que afecta a una neurona.

```
Layer 1: RF = 3×3  (kernel size)
Layer 2: RF = 5×5  (cada pixel ve 3×3, y estos ven 3×3)
Layer 3: RF = 7×7  (crece con profundidad)

Formula general:
RF_{l+1} = RF_l + (k-1) × stride_product
```

---

## 🎯 Escenario

**Dataset:** Clasificación de dígitos manuscritos (MNIST simplificado)

```
Input: Imagen 8×8 (64 píxeles)
Output: Dígito (0-9)

Ejemplo:
. . # # # . .
. # . . . # .
. . . . # # .
. . . # . . .
. . # . . . .
. # # # # # .
. . . . . . .

→ Predicción: "5"
```

---

## 📝 Instrucciones

### Parte 1: Operaciones de Convolución

```typescript
export function convolve2D(
  input: number[][],
  kernel: number[][],
  stride?: number,
  padding?: number
): number[][];

export function correlate2D(
  input: number[][],
  kernel: number[][],
  stride?: number,
  padding?: number
): number[][];

export function padImage(
  image: number[][],
  padding: number,
  value?: number
): number[][];

export function computeOutputSize(
  inputSize: number,
  kernelSize: number,
  stride: number,
  padding: number
): number;
```

### Parte 2: Pooling Operations

```typescript
export function maxPool2D(
  input: number[][],
  poolSize: number,
  stride?: number
): number[][];

export function avgPool2D(
  input: number[][],
  poolSize: number,
  stride?: number
): number[][];

export function globalMaxPool2D(input: number[][]): number;
export function globalAvgPool2D(input: number[][]): number;
```

### Parte 3: Convolutional Layer

```typescript
export interface ConvLayerConfig {
  numFilters: number;
  kernelSize: number;
  stride?: number;
  padding?: number;
  activation?: 'relu' | 'sigmoid';
}

export class ConvLayer {
  constructor(
    inputChannels: number,
    config: ConvLayerConfig
  ) {
    // Inicializar filtros (kernels)
  }

  forward(input: number[][][]): number[][][] {
    // Aplicar convolución con todos los filtros
  }

  getFilters(): number[][][][];
}
```

### Parte 4: Arquitectura CNN Simple

```typescript
export interface SimpleCNNConfig {
  inputSize: number;
  numClasses: number;
}

export class SimpleCNN {
  private conv1: ConvLayer;
  private conv2: ConvLayer;
  // ... fully connected layers

  constructor(config: SimpleCNNConfig) {
    // Construir arquitectura
  }

  forward(input: number[][]): number[];
  predict(input: number[][]): number;
  predictProba(input: number[][]): number[];
}
```

---

## ✅ Resultado Esperado

1. ✅ Operación de convolución 2D desde cero
2. ✅ Padding y stride configurables
3. ✅ Max pooling y average pooling
4. ✅ Capa convolucional con múltiples filtros
5. ✅ CNN simple completa
6. ✅ Visualizar feature maps
7. ✅ Detectar bordes en imágenes

---

## 🧪 Tests

```bash
npm test 13-cnn-vision
```

---

## 💡 Consejos

1. **Kernel size:** 3×3 es estándar (VGG), 5×5 para inicio (LeNet)
2. **Padding:** "same" para mantener tamaño, "valid" para reducir
3. **Stride:** 1 es común en CONV, 2 en POOL
4. **Channels:** Aumentan con profundidad (16 → 32 → 64 → 128)
5. **Activación:** ReLU después de cada CONV
6. **Pooling:** Max pool 2×2 stride 2 es estándar
7. **Arquitectura:** Empezar simple (2 CONV + 2 FC)

---

## 📊 Matemáticas Detalladas

**Convolución 2D (un canal):**
```
Output[i,j] = Σ Σ Input[i×s + m, j×s + n] × Kernel[m,n]
             m=0 n=0
             hasta k-1

donde:
- i,j: posición en output
- s: stride
- m,n: posición en kernel
- k: tamaño kernel
```

**Convolución multichannel:**
```
Para cada filtro f:
  Output[i,j,f] = Σ Σ Σ Input[i,j,c] × Kernel[m,n,c,f]
                  c m n

donde c recorre todos los canales de entrada
```

**Dimensiones:**
```
Input:   (H, W, C_in)
Kernel:  (K, K, C_in, C_out)
Output:  (H', W', C_out)

donde:
H' = (H + 2p - K) / s + 1
W' = (W + 2p - K) / s + 1
```

---

## 📚 Recursos

- [CNN Explainer - Interactive](https://poloclub.github.io/cnn-explainer/)
- [CS231n: Convolutional Networks](http://cs231n.github.io/convolutional-networks/)
- [Understanding Convolutions](https://colah.github.io/posts/2014-07-Understanding-Convolutions/)
- [LeNet-5 Paper (1998)](http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf)

---

**¡Comienza implementando la operación de convolución en `cnn.ts`!** 🖼️
