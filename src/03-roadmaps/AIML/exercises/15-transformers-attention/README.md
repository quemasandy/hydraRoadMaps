# Ejercicio 15: Transformers y Attention

**Objetivo:** Implementar mecanismos de atención y componentes básicos de Transformers, la arquitectura que revolucionó NLP y más allá.

## 📖 Teoría

### ¿Qué es Attention?

**Mecanismo que permite al modelo "enfocarse" en partes relevantes de la entrada.**

**Problema que resuelve:**
- RNN/LSTM: Toda la información debe pasar por hidden state (cuello de botella)
- Secuencias largas: Información distante se pierde
- Procesamiento secuencial: No se puede paralelizar

**Solución Attention:**
Acceso directo a cualquier parte de la entrada, con pesos aprendidos.

### Analogía: Búsqueda en Base de Datos

```
Query (Q): "¿Qué busco?"
Key (K):   "¿Qué tengo?"
Value (V): "Contenido real"

Attention: Encontrar Keys similares a Query,
           luego devolver Values correspondientes.
```

### Atención (Attention Mechanism)

**Ecuación básica:**
```
Attention(Q, K, V) = softmax(Q × Kᵀ / √dk) × V
```

**Paso a paso:**
```
1. Similarity scores: S = Q × Kᵀ
   "¿Qué tan relacionados están query y keys?"

2. Scaling: S_scaled = S / √dk
   "Normalizar para estabilidad numérica"

3. Attention weights: α = softmax(S_scaled)
   "Convertir a probabilidades"

4. Weighted sum: Output = α × V
   "Combinar values según importancia"
```

**Ejemplo numérico:**
```
Secuencia: "El gato come pescado"

Para palabra "come":
Query: [0.2, 0.8]

Keys:
El:      [0.1, 0.3]
gato:    [0.4, 0.7]
come:    [0.2, 0.8]
pescado: [0.9, 0.1]

Scores = Q · Kᵀ:
El:      0.2×0.1 + 0.8×0.3 = 0.26
gato:    0.2×0.4 + 0.8×0.7 = 0.64
come:    0.2×0.2 + 0.8×0.8 = 0.68
pescado: 0.2×0.9 + 0.8×0.1 = 0.26

Weights = softmax([0.26, 0.64, 0.68, 0.26]):
≈ [0.15, 0.22, 0.23, 0.15]

Output = weighted sum of Values
(presta más atención a "come" y "gato")
```

### Self-Attention

**Atención sobre la misma secuencia.**

```
Input: "El gato come pescado"

Para cada palabra:
  Q = W_Q × word
  K = W_K × word
  V = W_V × word

Cada palabra puede atender a cualquier otra palabra.
```

**Ventajas:**
- Captura relaciones entre cualquier par de palabras
- Paralelizable (no secuencial como RNN)
- No limitado por distancia

**Ejemplo: Resolución de correferencias**
```
"El gato vio al perro. Él estaba feliz."

"Él" atiende fuertemente a "gato" (no "perro")
gracias a self-attention.
```

### Multi-Head Attention

**Múltiples atenciones en paralelo.**

```
Head 1: Captura sintaxis
Head 2: Captura semántica
Head 3: Captura dependencias a largo plazo
...
Head h: Otro aspecto

Output = concat(Head₁, Head₂, ..., Headₕ) × W_O
```

**Ecuación:**
```
MultiHead(Q, K, V) = Concat(head₁, ..., headₕ) × W_O

donde:
headᵢ = Attention(Q×W_Qⁱ, K×W_Kⁱ, V×W_Vⁱ)
```

**Ventajas:**
- Diferentes heads aprenden diferentes patrones
- Más expresivo que single-head
- Estándar: 8-12 heads

### Arquitectura Transformer

**Componentes principales:**

```
Input
  ↓
Positional Encoding (añadir info de posición)
  ↓
Multi-Head Self-Attention
  ↓
Add & Norm (residual connection + layer norm)
  ↓
Feed-Forward Network
  ↓
Add & Norm
  ↓
Output
```

**Encoder-Decoder:**
```
Input → Encoder → Decoder → Output

Encoder: Stack de N capas (self-attention + FFN)
Decoder: Stack de N capas (self-attention + cross-attention + FFN)
```

### Positional Encoding

**Problema:** Attention no tiene noción de orden.

**Solución:** Añadir información de posición.

**Sinusoidal encoding:**
```
PE(pos, 2i)   = sin(pos / 10000^(2i/d))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d))

donde:
- pos: posición en secuencia
- i: dimensión
- d: dimensión del modelo
```

**Propiedades:**
- Diferentes frecuencias para diferentes dimensiones
- Permite extrapolar a secuencias más largas
- Patrones distinguibles para cada posición

### Masked Attention

**Para Decoder: No ver el futuro.**

```
Durante entrenamiento de "El gato come":

Para predecir "gato": Solo ve "El"
Para predecir "come": Ve "El gato"
Para predecir <EOS>:  Ve "El gato come"
```

**Implementación:** Mask infinito en futuro antes de softmax.

```
Scores:
     El  gato  come
El   0.5  0.3   0.2
gato 0.4  0.6   0.8
come 0.2  0.1   0.3

Masked (durante predicción de "gato"):
     El  gato  come
El   0.5  -∞    -∞
gato 0.4  0.6   -∞
come 0.2  0.1   0.3

Después de softmax, -∞ → 0
```

### ¿Por qué Transformers son tan buenos?

**1. Paralelización:**
- RNN: Secuencial (lento)
- Transformer: Todo en paralelo (rápido)

**2. Long-range dependencies:**
- RNN: Gradientes se desvanecen
- Transformer: Conexión directa vía attention

**3. Flexibilidad:**
- BERT: Encoder-only (comprensión)
- GPT: Decoder-only (generación)
- T5: Encoder-Decoder (traducción)

**4. Escalabilidad:**
- Más datos + más parámetros = mejor
- GPT-3: 175B parámetros
- Palm: 540B parámetros

---

## 🎯 Escenario

**Problema:** Traducción o clasificación de texto

```
Input:  "I love machine learning"
Tokens: [1, 234, 567, 891]
Embeddings: 4 × 512

→ Self-Attention → Captura relaciones
→ FFN → Transformaciones
→ Output → Clasificación o siguiente palabra
```

---

## 📝 Instrucciones

### Parte 1: Scaled Dot-Product Attention

```typescript
export function scaledDotProductAttention(
  Q: number[][],
  K: number[][],
  V: number[][],
  mask?: number[][]
): {
  output: number[][];
  attentionWeights: number[][];
};
```

### Parte 2: Multi-Head Attention

```typescript
export class MultiHeadAttention {
  constructor(
    dModel: number,
    numHeads: number
  ) {
    // Inicializar W_Q, W_K, W_V para cada head
    // Inicializar W_O para output
  }

  forward(
    Q: number[][],
    K: number[][],
    V: number[][],
    mask?: number[][]
  ): number[][];
}
```

### Parte 3: Positional Encoding

```typescript
export function positionalEncoding(
  sequenceLength: number,
  dModel: number
): number[][];

export function addPositionalEncoding(
  embeddings: number[][],
  encodings: number[][]
): number[][];
```

### Parte 4: Transformer Encoder Layer

```typescript
export class TransformerEncoderLayer {
  constructor(
    dModel: number,
    numHeads: number,
    dFF: number
  ) {
    // Multi-head attention
    // Feed-forward network
    // Layer normalization
  }

  forward(x: number[][]): number[][];
}
```

---

## ✅ Resultado Esperado

1. ✅ Scaled dot-product attention desde cero
2. ✅ Multi-head attention con múltiples heads
3. ✅ Positional encoding sinusoidal
4. ✅ Masking para decoder
5. ✅ Componentes de Transformer encoder
6. ✅ Visualizar attention weights

---

## 🧪 Tests

```bash
npm test 15-transformers-attention
```

---

## 💡 Consejos

1. **dModel:** 512 (BERT-base), 768 (BERT-large), 1024 (GPT-2)
2. **numHeads:** 8-12 es estándar
3. **Scaling:** División por √dk previene softmax saturation
4. **Dropout:** Aplicar en attention weights y FFN
5. **Layer Norm:** Antes o después (pre-norm vs post-norm)
6. **Residual:** Siempre añadir conexiones residuales

---

## 📊 Matemáticas Detalladas

**Attention paso a paso:**
```
Dado:
Q: (seq_len, d_k)  Query
K: (seq_len, d_k)  Key
V: (seq_len, d_v)  Value

Paso 1: Scores
S = Q × Kᵀ
S: (seq_len, seq_len)

Paso 2: Scale
S_scaled = S / √d_k

Paso 3: Mask (opcional)
S_masked = S_scaled + mask
donde mask[i][j] = -∞ si position j no debe atender a i

Paso 4: Softmax
α = softmax(S_masked, dim=-1)
α: (seq_len, seq_len)  # suma fila = 1

Paso 5: Apply to values
Output = α × V
Output: (seq_len, d_v)
```

**Multi-Head dimensiones:**
```
Input: (seq_len, d_model)

Para cada head i:
  Q_i = Input × W_Q^i    W_Q^i: (d_model, d_k)
  K_i = Input × W_K^i    W_K^i: (d_model, d_k)
  V_i = Input × W_V^i    W_V^i: (d_model, d_v)

  head_i = Attention(Q_i, K_i, V_i)
  head_i: (seq_len, d_v)

MultiHead = Concat(head_1, ..., head_h) × W_O
          : (seq_len, h×d_v) × (h×d_v, d_model)
          = (seq_len, d_model)

Típicamente: d_k = d_v = d_model / h
```

---

## 📚 Recursos

- [Attention is All You Need (Paper)](https://arxiv.org/abs/1706.03762)
- [The Illustrated Transformer](http://jalammar.github.io/illustrated-transformer/)
- [Transformer Explainer](https://poloclub.github.io/transformer-explainer/)
- [Attention Mechanisms (Distill)](https://distill.pub/2016/augmented-rnns/)

---

**¡Comienza implementando scaled dot-product attention en `transformer.ts`!** 🤖
