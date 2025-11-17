# Ejercicio 14: RNN para Secuencias

**Objetivo:** Implementar Recurrent Neural Networks (RNN) y Long Short-Term Memory (LSTM) para procesar datos secuenciales.

## 📖 Teoría

### ¿Qué son las RNN?

**Redes neuronales con memoria** diseñadas para secuencias.

**Problema que resuelven:**
- Feedforward networks: No capturan orden temporal
- CNN: Capturan patrones locales pero no dependencias largas
- RNN: Procesan secuencias manteniendo "memoria" del pasado

**Ejemplos de datos secuenciales:**
- Texto: "El gato" → "comió" → "pescado"
- Series temporales: Temperatura por hora
- Audio: Señal de voz
- Video: Frames en el tiempo

### Arquitectura RNN

**Estructura básica:**
```
      ht-1 ──────┐
                 │
Input: xt → [RNN Cell] → Output: yt
                 │
                ht ──────→
```

**Ecuaciones:**
```
ht = tanh(Whh × ht-1 + Wxh × xt + bh)
yt = Why × ht + by
```

**Desenrollado en el tiempo:**
```
x1 → [Cell] → h1 → [Cell] → h2 → [Cell] → h3
      ↓ y1          ↓ y2          ↓ y3
```

Cada celda comparte los mismos pesos (Whh, Wxh, Why).

### Tipos de Secuencias

**One-to-One:** Input fijo → Output fijo (no es RNN)
```
Imagen → Clasificación
```

**One-to-Many:** Input fijo → Secuencia output
```
Imagen → Descripción textual (Image Captioning)
```

**Many-to-One:** Secuencia input → Output fijo
```
Frase → Sentimiento (positivo/negativo)
```

**Many-to-Many (sync):** Secuencia → Secuencia (mismo tamaño)
```
Video → Clasificar cada frame
```

**Many-to-Many (async):** Secuencia → Secuencia (diferente tamaño)
```
Inglés → Español (Traducción)
```

### Problema: Vanishing Gradient

**En RNN, gradientes se multiplican a través del tiempo:**
```
∂L/∂h1 = ∂L/∂h3 × ∂h3/∂h2 × ∂h2/∂h1

Si |∂ht/∂ht-1| < 1:
  Gradiente → 0 (vanishing)

Si |∂ht/∂ht-1| > 1:
  Gradiente → ∞ (exploding)
```

**Consecuencia:**
RNN simple solo "recuerda" ~10 pasos atrás.

**Soluciones:**
- LSTM (Long Short-Term Memory)
- GRU (Gated Recurrent Unit)
- Gradient clipping (para exploding)
- Skip connections

### LSTM (Long Short-Term Memory)

**Diseñado para capturar dependencias largas.**

**Componentes:**
```
Cell State (Ct): "Memoria a largo plazo"
Hidden State (ht): "Memoria a corto plazo"
```

**Gates (Compuertas):**
```
1. Forget Gate (ft): Qué olvidar de Ct-1
   ft = σ(Wf × [ht-1, xt] + bf)

2. Input Gate (it): Qué añadir a Ct
   it = σ(Wi × [ht-1, xt] + bi)
   C̃t = tanh(WC × [ht-1, xt] + bC)

3. Cell State Update:
   Ct = ft ⊙ Ct-1 + it ⊙ C̃t
   (⊙ = element-wise multiplication)

4. Output Gate (ot): Qué parte de Ct mostrar
   ot = σ(Wo × [ht-1, xt] + bo)
   ht = ot ⊙ tanh(Ct)
```

**Intuición:**
- Forget gate: "Olvidemos el sujeto anterior"
- Input gate: "Recordemos el nuevo sujeto"
- Output gate: "Mostremos información relevante ahora"

**¿Por qué funciona?**
El cell state Ct fluye directamente con solo multiplicaciones element-wise, permitiendo que gradientes fluyan mejor.

### GRU (Gated Recurrent Unit)

**Versión simplificada de LSTM** (menos parámetros).

**Ecuaciones:**
```
1. Reset Gate:
   rt = σ(Wr × [ht-1, xt])

2. Update Gate:
   zt = σ(Wz × [ht-1, xt])

3. Candidate:
   h̃t = tanh(W × [rt ⊙ ht-1, xt])

4. Hidden State:
   ht = (1 - zt) ⊙ ht-1 + zt ⊙ h̃t
```

**LSTM vs GRU:**
- LSTM: Más expresivo, mejor para secuencias largas
- GRU: Más simple, más rápido, similar performance
- Regla: Empezar con GRU, usar LSTM si necesitas más capacidad

### Bidirectional RNN

**Procesa secuencia en ambas direcciones:**
```
Forward:  h1→ h2→ h3→
Backward: ←h1 ←h2 ←h3

Output: [h_forward, h_backward] concatenados
```

**Útil cuando:** Contexto futuro ayuda (ej: traducción, NER)
**No útil cuando:** Predicción en tiempo real (no hay futuro disponible)

---

## 🎯 Escenario

**Problema 1:** Predicción de series temporales
```
Input: [temp(t-4), temp(t-3), temp(t-2), temp(t-1)]
Output: temp(t)
```

**Problema 2:** Clasificación de sentimiento
```
Input: "Esta película es increíble" → [0.1, 0.3, 0.2, 0.8]
Output: Positivo (1)
```

---

## 📝 Instrucciones

### Parte 1: RNN Simple

```typescript
export class SimpleRNN {
  constructor(
    inputSize: number,
    hiddenSize: number,
    outputSize: number
  ) {
    // Inicializar Wxh, Whh, Why
  }

  forward(inputs: number[][]): {
    hiddenStates: number[][];
    outputs: number[][];
  } {
    // Procesar secuencia paso a paso
  }

  predict(inputs: number[][]): number[];
}
```

### Parte 2: LSTM Cell

```typescript
export class LSTMCell {
  forward(
    xt: number[],
    ht_prev: number[],
    Ct_prev: number[]
  ): {
    ht: number[];
    Ct: number[];
  } {
    // 1. Forget gate
    // 2. Input gate
    // 3. Cell state update
    // 4. Output gate
  }
}
```

### Parte 3: LSTM Layer

```typescript
export class LSTM {
  constructor(
    inputSize: number,
    hiddenSize: number,
    outputSize: number
  ) {
    // Inicializar parámetros para gates
  }

  forward(inputs: number[][]): {
    hiddenStates: number[][];
    cellStates: number[][];
    outputs: number[][];
  };
}
```

---

## ✅ Resultado Esperado

1. ✅ RNN simple con forward pass
2. ✅ LSTM cell con todos los gates
3. ✅ LSTM completo para secuencias
4. ✅ Predicción many-to-one
5. ✅ Comparar RNN vs LSTM

---

## 🧪 Tests

```bash
npm test 14-rnn-secuencias
```

---

## 💡 Consejos

1. **Hidden size:** 64-512 para tareas reales
2. **Secuencias largas:** Usa LSTM/GRU, no RNN simple
3. **Bidirectional:** Solo si necesitas contexto futuro
4. **Gradient clipping:** Clipear gradientes a [-5, 5]
5. **Inicialización:** Orthogonal para Whh, Xavier para Wxh
6. **Debugging:** Imprimir shapes de tensores

---

## 📊 Matemáticas Detalladas

**RNN Forward Pass:**
```
Para t = 1 a T:
  ht = tanh(Whh×ht-1 + Wxh×xt + bh)
  yt = Why×ht + by
```

**Dimensiones:**
```
xt:  (input_size,)
ht:  (hidden_size,)
Whh: (hidden_size, hidden_size)
Wxh: (hidden_size, input_size)
Why: (output_size, hidden_size)
```

**LSTM Cell State Flow:**
```
Ct-1 ─(forget)→ Ct ─→ Ct+1
         ↑
       (input)
```

---

## 📚 Recursos

- [Understanding LSTM Networks](https://colah.github.io/posts/2015-08-Understanding-LSTMs/)
- [The Unreasonable Effectiveness of RNNs](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)
- [LSTM Paper (1997)](http://www.bioinf.jku.at/publications/older/2604.pdf)

---

**¡Comienza implementando RNN simple en `rnn.ts`!** 🔄
