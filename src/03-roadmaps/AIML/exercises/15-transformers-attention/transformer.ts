/**
 * Ejercicio 15: Transformers y Attention
 *
 * Implementación de mecanismos de atención y componentes
 * básicos de la arquitectura Transformer.
 */

import { initializeWeights } from '../11-perceptron-redes-neuronales/neural-network';

// ============================================
// UTILIDADES MATEMÁTICAS
// ============================================

/**
 * Multiplicación de matrices
 */
function matrixMultiply(A: number[][], B: number[][]): number[][] {
  const m = A.length;
  const n = B[0].length;
  const p = B.length;

  const result: number[][] = Array(m)
    .fill(0)
    .map(() => Array(n).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < p; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }

  return result;
}

/**
 * Transponer matriz
 */
function transpose(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const result: number[][] = Array(cols)
    .fill(0)
    .map(() => Array(rows).fill(0));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }

  return result;
}

/**
 * Softmax por filas
 */
function softmax(matrix: number[][]): number[][] {
  return matrix.map(row => {
    const maxVal = Math.max(...row);
    const expVals = row.map(x => Math.exp(x - maxVal));
    const sumExp = expVals.reduce((a, b) => a + b, 0);
    return expVals.map(x => x / sumExp);
  });
}

/**
 * División escalar de matriz
 */
function scalarDivide(matrix: number[][], scalar: number): number[][] {
  return matrix.map(row => row.map(val => val / scalar));
}

/**
 * Suma element-wise de matrices
 */
function matrixAdd(A: number[][], B: number[][]): number[][] {
  return A.map((row, i) => row.map((val, j) => val + B[i][j]));
}

// ============================================
// SCALED DOT-PRODUCT ATTENTION
// ============================================

/**
 * Scaled Dot-Product Attention
 *
 * La operación fundamental de Transformers.
 *
 * Attention(Q, K, V) = softmax(Q×Kᵀ / √dk) × V
 *
 * Intuición:
 * 1. Q×Kᵀ: Calcula similaridad entre queries y keys
 * 2. /√dk: Escala para prevenir gradientes pequeños en softmax
 * 3. softmax: Convierte scores a probabilidades
 * 4. ×V: Weighted sum de values
 *
 * ¿Por qué scaling?
 * Sin scaling, para dk grande, dot products crecen en magnitud,
 * empujando softmax a regiones con gradientes extremadamente pequeños.
 *
 * Demostración:
 * Si Q, K ~ N(0,1), entonces Q·K ~ N(0, dk)
 * Dividir por √dk → Q·K/√dk ~ N(0, 1)
 *
 * @param Q - Queries (seq_len × d_k)
 * @param K - Keys (seq_len × d_k)
 * @param V - Values (seq_len × d_v)
 * @param mask - Máscara opcional (seq_len × seq_len)
 * @returns Output y attention weights
 */
export function scaledDotProductAttention(
  Q: number[][],
  K: number[][],
  V: number[][],
  mask?: number[][]
): {
  output: number[][];
  attentionWeights: number[][];
} {
  const dk = K[0].length;

  // 1. Scores: Q × Kᵀ
  const Kt = transpose(K);
  let scores = matrixMultiply(Q, Kt);

  // 2. Scale: scores / √dk
  scores = scalarDivide(scores, Math.sqrt(dk));

  // 3. Apply mask (opcional)
  // Mask con -Infinity para posiciones que no deben atenderse
  if (mask) {
    scores = scores.map((row, i) =>
      row.map((val, j) => (mask[i][j] === 0 ? val : -Infinity))
    );
  }

  // 4. Softmax: Convierte a probabilidades
  const attentionWeights = softmax(scores);

  // 5. Apply to values: α × V
  const output = matrixMultiply(attentionWeights, V);

  return { output, attentionWeights };
}

// ============================================
// MULTI-HEAD ATTENTION
// ============================================

/**
 * Multi-Head Attention
 *
 * Permite al modelo atender a información de diferentes
 * espacios de representación en diferentes posiciones.
 *
 * MultiHead(Q,K,V) = Concat(head₁,...,headₕ) × W_O
 *
 * donde headᵢ = Attention(Q×W_Qⁱ, K×W_Kⁱ, V×W_Vⁱ)
 *
 * Ventajas:
 * - Diferentes heads capturan diferentes tipos de relaciones
 * - Un head: sintaxis, otro: semántica, otro: long-range
 * - Más expresivo que single-head
 *
 * Típicamente:
 * - d_k = d_v = d_model / num_heads
 * - Esto mantiene costo computacional similar a single-head
 */
export class MultiHeadAttention {
  private numHeads: number;
  private dModel: number;
  private dk: number;

  // Proyecciones para cada head
  private WQ: number[][][]; // num_heads × d_model × d_k
  private WK: number[][][];
  private WV: number[][][];
  private WO: number[][];   // d_model × d_model

  /**
   * @param dModel - Dimensión del modelo
   * @param numHeads - Número de attention heads
   */
  constructor(dModel: number, numHeads: number) {
    if (dModel % numHeads !== 0) {
      throw new Error('dModel must be divisible by numHeads');
    }

    this.dModel = dModel;
    this.numHeads = numHeads;
    this.dk = dModel / numHeads;

    // Inicializar proyecciones para cada head
    this.WQ = Array(numHeads)
      .fill(0)
      .map(() => initializeWeights(this.dk, dModel, 'xavier'));

    this.WK = Array(numHeads)
      .fill(0)
      .map(() => initializeWeights(this.dk, dModel, 'xavier'));

    this.WV = Array(numHeads)
      .fill(0)
      .map(() => initializeWeights(this.dk, dModel, 'xavier'));

    // Proyección final
    this.WO = initializeWeights(dModel, dModel, 'xavier');
  }

  /**
   * Forward pass
   *
   * Para cada head:
   * 1. Proyectar Q, K, V a espacio de dimensión d_k
   * 2. Calcular attention
   * 3. Concatenar outputs de todos los heads
   * 4. Proyectar con W_O
   *
   * @param Q - Queries (seq_len × d_model)
   * @param K - Keys (seq_len × d_model)
   * @param V - Values (seq_len × d_model)
   * @param mask - Máscara opcional
   * @returns Output (seq_len × d_model)
   */
  forward(
    Q: number[][],
    K: number[][],
    V: number[][],
    mask?: number[][]
  ): number[][] {
    const headOutputs: number[][][] = [];

    // Para cada head
    for (let h = 0; h < this.numHeads; h++) {
      // Proyectar Q, K, V
      const Qh = matrixMultiply(Q, transpose(this.WQ[h]));
      const Kh = matrixMultiply(K, transpose(this.WK[h]));
      const Vh = matrixMultiply(V, transpose(this.WV[h]));

      // Attention
      const { output } = scaledDotProductAttention(Qh, Kh, Vh, mask);
      headOutputs.push(output);
    }

    // Concatenar heads
    const seqLen = Q.length;
    const concatenated: number[][] = Array(seqLen)
      .fill(0)
      .map(() => []);

    for (let i = 0; i < seqLen; i++) {
      for (const head of headOutputs) {
        concatenated[i].push(...head[i]);
      }
    }

    // Proyección final
    const output = matrixMultiply(concatenated, transpose(this.WO));

    return output;
  }

  /**
   * Obtiene número de heads
   */
  getNumHeads(): number {
    return this.numHeads;
  }
}

// ============================================
// POSITIONAL ENCODING
// ============================================

/**
 * Positional Encoding Sinusoidal
 *
 * Añade información de posición a embeddings.
 *
 * Fórmulas:
 * PE(pos, 2i)   = sin(pos / 10000^(2i/dModel))
 * PE(pos, 2i+1) = cos(pos / 10000^(2i/dModel))
 *
 * Propiedades:
 * - Determinista (mismo encoding para misma posición)
 * - Valores acotados [-1, 1]
 * - Diferentes frecuencias capturan diferentes escalas
 * - PE(pos+k) puede expresarse como función lineal de PE(pos)
 *
 * ¿Por qué seno/coseno?
 * Permiten al modelo "aprender" a atender por posición relativa,
 * ya que:
 * sin(α+β) = sin(α)cos(β) + cos(α)sin(β)
 *
 * @param sequenceLength - Longitud de la secuencia
 * @param dModel - Dimensión del modelo
 * @returns Matriz de positional encodings (seq_len × d_model)
 */
export function positionalEncoding(
  sequenceLength: number,
  dModel: number
): number[][] {
  const PE: number[][] = Array(sequenceLength)
    .fill(0)
    .map(() => Array(dModel).fill(0));

  for (let pos = 0; pos < sequenceLength; pos++) {
    for (let i = 0; i < dModel; i++) {
      // Calcular denominador: 10000^(2i/dModel)
      const denominator = Math.pow(10000, (2 * Math.floor(i / 2)) / dModel);

      if (i % 2 === 0) {
        // Dimensiones pares: sin
        PE[pos][i] = Math.sin(pos / denominator);
      } else {
        // Dimensiones impares: cos
        PE[pos][i] = Math.cos(pos / denominator);
      }
    }
  }

  return PE;
}

/**
 * Añade positional encoding a embeddings
 *
 * @param embeddings - Word embeddings (seq_len × d_model)
 * @param encodings - Positional encodings (seq_len × d_model)
 * @returns Embeddings con posición (seq_len × d_model)
 */
export function addPositionalEncoding(
  embeddings: number[][],
  encodings: number[][]
): number[][] {
  return matrixAdd(embeddings, encodings);
}

// ============================================
// MASKING
// ============================================

/**
 * Crea máscara causal (look-ahead mask)
 *
 * Para decoder: previene que posición i atienda a j > i
 *
 * Ejemplo para seq_len=4:
 * [[1, 0, 0, 0],
 *  [1, 1, 0, 0],
 *  [1, 1, 1, 0],
 *  [1, 1, 1, 1]]
 *
 * 1 = puede atender, 0 = no puede atender
 *
 * @param size - Tamaño de la secuencia
 * @returns Máscara causal
 */
export function createCausalMask(size: number): number[][] {
  const mask: number[][] = Array(size)
    .fill(0)
    .map(() => Array(size).fill(0));

  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= i; j++) {
      mask[i][j] = 1; // Puede atender al pasado y presente
    }
  }

  return mask;
}

/**
 * Crea padding mask
 *
 * Para ignorar tokens de padding.
 *
 * @param sequenceLength - Longitud de la secuencia
 * @param paddingIdx - Índice del token de padding
 * @returns Máscara de padding
 */
export function createPaddingMask(
  sequence: number[],
  paddingIdx: number
): number[] {
  return sequence.map(token => (token === paddingIdx ? 0 : 1));
}

// ============================================
// FEED-FORWARD NETWORK
// ============================================

/**
 * Position-wise Feed-Forward Network
 *
 * FFN(x) = max(0, x×W₁ + b₁) × W₂ + b₂
 *
 * Aplicado independientemente a cada posición.
 *
 * Típicamente: d_ff = 4 × d_model
 */
export class FeedForwardNetwork {
  private W1: number[][];
  private b1: number[];
  private W2: number[][];
  private b2: number[];

  constructor(dModel: number, dFF: number) {
    this.W1 = initializeWeights(dFF, dModel, 'xavier');
    this.b1 = Array(dFF).fill(0);
    this.W2 = initializeWeights(dModel, dFF, 'xavier');
    this.b2 = Array(dModel).fill(0);
  }

  /**
   * Forward pass
   */
  forward(x: number[][]): number[][] {
    // Layer 1: ReLU(x×W₁ + b₁)
    const hidden = x.map(row => {
      const linear = matrixMultiply([row], transpose(this.W1))[0];
      const withBias = linear.map((val, i) => val + this.b1[i]);
      return withBias.map(val => Math.max(0, val)); // ReLU
    });

    // Layer 2: hidden×W₂ + b₂
    const output = matrixMultiply(hidden, transpose(this.W2));
    return output.map(row => row.map((val, i) => val + this.b2[i]));
  }
}

// ============================================
// TRANSFORMER ENCODER LAYER
// ============================================

/**
 * Una capa del Transformer Encoder
 *
 * Componentes:
 * 1. Multi-Head Self-Attention
 * 2. Add & Norm (residual + layer norm)
 * 3. Feed-Forward Network
 * 4. Add & Norm
 */
export class TransformerEncoderLayer {
  private attention: MultiHeadAttention;
  private ffn: FeedForwardNetwork;

  constructor(dModel: number, numHeads: number, dFF: number) {
    this.attention = new MultiHeadAttention(dModel, numHeads);
    this.ffn = new FeedForwardNetwork(dModel, dFF);
  }

  /**
   * Forward pass
   *
   * @param x - Input (seq_len × d_model)
   * @returns Output (seq_len × d_model)
   */
  forward(x: number[][]): number[][] {
    // 1. Multi-Head Self-Attention
    const attnOutput = this.attention.forward(x, x, x);

    // 2. Add & Norm (simplified: just add residual)
    const afterAttn = matrixAdd(x, attnOutput);

    // 3. Feed-Forward
    const ffnOutput = this.ffn.forward(afterAttn);

    // 4. Add & Norm
    const output = matrixAdd(afterAttn, ffnOutput);

    return output;
  }
}

// ============================================
// EJEMPLO DE USO
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 15: Transformers y Attention ===\n');

  // Ejemplo 1: Scaled Dot-Product Attention
  console.log('1. Scaled Dot-Product Attention');
  console.log('--------------------------------');

  const Q = [[1, 0], [0, 1], [1, 1]];
  const K = [[1, 0], [0, 1], [0.5, 0.5]];
  const V = [[10, 20], [30, 40], [50, 60]];

  const { output, attentionWeights } = scaledDotProductAttention(Q, K, V);

  console.log('Attention Weights:');
  attentionWeights.forEach((row, i) =>
    console.log(`  Position ${i}: [${row.map(w => w.toFixed(3)).join(', ')}]`)
  );

  console.log('\nOutput:');
  output.forEach((row, i) =>
    console.log(`  Position ${i}: [${row.map(v => v.toFixed(2)).join(', ')}]`)
  );

  // Ejemplo 2: Multi-Head Attention
  console.log('\n\n2. Multi-Head Attention');
  console.log('-----------------------');

  const dModel = 8;
  const numHeads = 2;
  const seqLen = 3;

  const mha = new MultiHeadAttention(dModel, numHeads);
  const input = Array(seqLen)
    .fill(0)
    .map(() => Array(dModel).fill(0).map(() => Math.random()));

  const mhaOutput = mha.forward(input, input, input);

  console.log(`Input shape: ${seqLen} × ${dModel}`);
  console.log(`Number of heads: ${numHeads}`);
  console.log(`Output shape: ${mhaOutput.length} × ${mhaOutput[0].length}`);

  // Ejemplo 3: Positional Encoding
  console.log('\n\n3. Positional Encoding');
  console.log('----------------------');

  const PE = positionalEncoding(5, 4);

  console.log('Positional Encodings (5 positions, 4 dimensions):');
  PE.forEach((pos, i) =>
    console.log(`  Pos ${i}: [${pos.map(v => v.toFixed(3)).join(', ')}]`)
  );

  // Ejemplo 4: Causal Mask
  console.log('\n\n4. Causal Mask');
  console.log('--------------');

  const mask = createCausalMask(4);
  console.log('Causal mask (4×4):');
  mask.forEach(row => console.log(`  [${row.join(', ')}]`));

  // Ejemplo 5: Transformer Encoder Layer
  console.log('\n\n5. Transformer Encoder Layer');
  console.log('----------------------------');

  const encoder = new TransformerEncoderLayer(8, 2, 32);
  const encoderInput = Array(4)
    .fill(0)
    .map(() => Array(8).fill(0).map(() => Math.random()));

  const encoderOutput = encoder.forward(encoderInput);

  console.log(`Input shape: ${encoderInput.length} × ${encoderInput[0].length}`);
  console.log(`Output shape: ${encoderOutput.length} × ${encoderOutput[0].length}`);

  console.log('\n=== Fin del ejemplo ===');
}
