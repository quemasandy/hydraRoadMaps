/**
 * Ejercicio 14: RNN para Secuencias
 *
 * Implementación de Recurrent Neural Networks (RNN) y
 * Long Short-Term Memory (LSTM) para datos secuenciales.
 */

import {
  sigmoid,
  tanh,
  initializeWeights,
} from '../11-perceptron-redes-neuronales/neural-network';

// ============================================
// UTILIDADES
// ============================================

/**
 * Multiplicación matriz-vector
 */
function matrixVectorMultiply(matrix: number[][], vector: number[]): number[] {
  return matrix.map(row =>
    row.reduce((sum, val, i) => sum + val * vector[i], 0)
  );
}

/**
 * Suma element-wise de vectores
 */
function vectorAdd(a: number[], b: number[]): number[] {
  return a.map((val, i) => val + b[i]);
}

/**
 * Multiplicación element-wise (Hadamard product)
 */
function elementWiseMultiply(a: number[], b: number[]): number[] {
  return a.map((val, i) => val * b[i]);
}

/**
 * Concatena dos vectores
 */
function concatenate(a: number[], b: number[]): number[] {
  return [...a, ...b];
}

// ============================================
// RNN SIMPLE
// ============================================

/**
 * Simple Recurrent Neural Network
 *
 * Procesa secuencias manteniendo estado oculto.
 *
 * Ecuaciones:
 * ht = tanh(Whh × ht-1 + Wxh × xt + bh)
 * yt = Why × ht + by
 *
 * Limitación: Sufre vanishing gradient para secuencias largas
 */
export class SimpleRNN {
  private Wxh: number[][];  // Input to hidden
  private Whh: number[][];  // Hidden to hidden
  private Why: number[][];  // Hidden to output
  private bh: number[];     // Hidden bias
  private by: number[];     // Output bias

  private inputSize: number;
  private hiddenSize: number;
  private outputSize: number;

  /**
   * @param inputSize - Dimensión de entrada
   * @param hiddenSize - Dimensión de estado oculto
   * @param outputSize - Dimensión de salida
   */
  constructor(
    inputSize: number,
    hiddenSize: number,
    outputSize: number
  ) {
    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = outputSize;

    // Inicializar pesos
    this.Wxh = initializeWeights(hiddenSize, inputSize, 'xavier');
    this.Whh = initializeWeights(hiddenSize, hiddenSize, 'xavier');
    this.Why = initializeWeights(outputSize, hiddenSize, 'xavier');
    this.bh = Array(hiddenSize).fill(0);
    this.by = Array(outputSize).fill(0);
  }

  /**
   * Forward pass sobre secuencia completa
   *
   * Para cada paso de tiempo t:
   * 1. Calcular ht usando ht-1 y xt
   * 2. Calcular yt usando ht
   *
   * @param inputs - Secuencia de inputs (T × input_size)
   * @returns Estados ocultos y outputs para cada paso
   */
  forward(inputs: number[][]): {
    hiddenStates: number[][];
    outputs: number[][];
  } {
    const T = inputs.length;
    const hiddenStates: number[][] = [];
    const outputs: number[][] = [];

    // Estado inicial: vector de ceros
    let ht = Array(this.hiddenSize).fill(0);

    // Procesar cada paso de tiempo
    for (let t = 0; t < T; t++) {
      const xt = inputs[t];

      // ht = tanh(Whh × ht-1 + Wxh × xt + bh)
      const hhhPart = matrixVectorMultiply(this.Whh, ht);
      const xhPart = matrixVectorMultiply(this.Wxh, xt);
      const hPreActivation = vectorAdd(vectorAdd(hhhPart, xhPart), this.bh);
      ht = (tanh(hPreActivation) as number[]);

      // yt = Why × ht + by
      const yPart = matrixVectorMultiply(this.Why, ht);
      const yt = vectorAdd(yPart, this.by);

      hiddenStates.push([...ht]);
      outputs.push(yt);
    }

    return { hiddenStates, outputs };
  }

  /**
   * Predice salida final (many-to-one)
   *
   * @param inputs - Secuencia de entrada
   * @returns Predicción final
   */
  predict(inputs: number[][]): number[] {
    const { outputs } = this.forward(inputs);
    return outputs[outputs.length - 1]; // Última salida
  }

  /**
   * Predice secuencia completa (many-to-many)
   *
   * @param inputs - Secuencia de entrada
   * @returns Secuencia de predicciones
   */
  predictSequence(inputs: number[][]): number[][] {
    const { outputs } = this.forward(inputs);
    return outputs;
  }
}

// ============================================
// LSTM CELL
// ============================================

/**
 * LSTM Cell (una unidad de tiempo)
 *
 * Implementa los 3 gates y actualización del cell state.
 *
 * Gates:
 * - Forget gate: Qué olvidar del cell state anterior
 * - Input gate: Qué añadir al cell state
 * - Output gate: Qué parte del cell state mostrar
 *
 * Ecuaciones:
 * ft = σ(Wf × [ht-1, xt] + bf)           ← Forget gate
 * it = σ(Wi × [ht-1, xt] + bi)           ← Input gate
 * C̃t = tanh(WC × [ht-1, xt] + bC)        ← Candidate cell state
 * Ct = ft ⊙ Ct-1 + it ⊙ C̃t              ← Cell state update
 * ot = σ(Wo × [ht-1, xt] + bo)           ← Output gate
 * ht = ot ⊙ tanh(Ct)                     ← Hidden state
 */
export class LSTMCell {
  private Wf: number[][];  // Forget gate weights
  private Wi: number[][];  // Input gate weights
  private WC: number[][];  // Candidate weights
  private Wo: number[][];  // Output gate weights
  private bf: number[];    // Forget gate bias
  private bi: number[];    // Input gate bias
  private bC: number[];    // Candidate bias
  private bo: number[];    // Output gate bias

  private hiddenSize: number;

  /**
   * @param inputSize - Dimensión de entrada
   * @param hiddenSize - Dimensión de hidden/cell state
   */
  constructor(inputSize: number, hiddenSize: number) {
    this.hiddenSize = hiddenSize;

    // Tamaño de entrada concatenada: [ht-1, xt]
    const concatSize = hiddenSize + inputSize;

    // Inicializar pesos para cada gate
    this.Wf = initializeWeights(hiddenSize, concatSize, 'xavier');
    this.Wi = initializeWeights(hiddenSize, concatSize, 'xavier');
    this.WC = initializeWeights(hiddenSize, concatSize, 'xavier');
    this.Wo = initializeWeights(hiddenSize, concatSize, 'xavier');

    this.bf = Array(hiddenSize).fill(0);
    this.bi = Array(hiddenSize).fill(0);
    this.bC = Array(hiddenSize).fill(0);
    this.bo = Array(hiddenSize).fill(0);
  }

  /**
   * Forward pass de un paso de tiempo
   *
   * @param xt - Input en tiempo t
   * @param ht_prev - Hidden state anterior
   * @param Ct_prev - Cell state anterior
   * @returns Nuevo hidden state y cell state
   */
  forward(
    xt: number[],
    ht_prev: number[],
    Ct_prev: number[]
  ): {
    ht: number[];
    Ct: number[];
  } {
    // Concatenar [ht-1, xt]
    const concat = concatenate(ht_prev, xt);

    // 1. Forget gate: ft = σ(Wf × [ht-1, xt] + bf)
    const ft_pre = vectorAdd(matrixVectorMultiply(this.Wf, concat), this.bf);
    const ft = sigmoid(ft_pre) as number[];

    // 2. Input gate: it = σ(Wi × [ht-1, xt] + bi)
    const it_pre = vectorAdd(matrixVectorMultiply(this.Wi, concat), this.bi);
    const it = sigmoid(it_pre) as number[];

    // 3. Candidate cell state: C̃t = tanh(WC × [ht-1, xt] + bC)
    const Ct_candidate_pre = vectorAdd(
      matrixVectorMultiply(this.WC, concat),
      this.bC
    );
    const Ct_candidate = tanh(Ct_candidate_pre) as number[];

    // 4. Cell state update: Ct = ft ⊙ Ct-1 + it ⊙ C̃t
    const Ct = vectorAdd(
      elementWiseMultiply(ft, Ct_prev),
      elementWiseMultiply(it, Ct_candidate)
    );

    // 5. Output gate: ot = σ(Wo × [ht-1, xt] + bo)
    const ot_pre = vectorAdd(matrixVectorMultiply(this.Wo, concat), this.bo);
    const ot = sigmoid(ot_pre) as number[];

    // 6. Hidden state: ht = ot ⊙ tanh(Ct)
    const ht = elementWiseMultiply(ot, tanh(Ct) as number[]);

    return { ht, Ct };
  }
}

// ============================================
// LSTM LAYER
// ============================================

/**
 * LSTM Layer completa
 *
 * Procesa secuencias usando LSTM cells.
 *
 * Ventajas sobre RNN simple:
 * - Captura dependencias a largo plazo
 * - Mitiga vanishing gradient
 * - Cell state fluye con mínimas transformaciones
 */
export class LSTM {
  private cell: LSTMCell;
  private Why: number[][];   // Hidden to output
  private by: number[];      // Output bias

  private inputSize: number;
  private hiddenSize: number;
  private outputSize: number;

  /**
   * @param inputSize - Dimensión de entrada
   * @param hiddenSize - Dimensión de hidden/cell state
   * @param outputSize - Dimensión de salida
   */
  constructor(
    inputSize: number,
    hiddenSize: number,
    outputSize: number
  ) {
    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = outputSize;

    this.cell = new LSTMCell(inputSize, hiddenSize);
    this.Why = initializeWeights(outputSize, hiddenSize, 'xavier');
    this.by = Array(outputSize).fill(0);
  }

  /**
   * Forward pass sobre secuencia completa
   *
   * @param inputs - Secuencia de inputs (T × input_size)
   * @returns Hidden states, cell states y outputs
   */
  forward(inputs: number[][]): {
    hiddenStates: number[][];
    cellStates: number[][];
    outputs: number[][];
  } {
    const T = inputs.length;
    const hiddenStates: number[][] = [];
    const cellStates: number[][] = [];
    const outputs: number[][] = [];

    // Estados iniciales
    let ht = Array(this.hiddenSize).fill(0);
    let Ct = Array(this.hiddenSize).fill(0);

    // Procesar cada paso de tiempo
    for (let t = 0; t < T; t++) {
      const xt = inputs[t];

      // LSTM cell forward
      const result = this.cell.forward(xt, ht, Ct);
      ht = result.ht;
      Ct = result.Ct;

      // Output: yt = Why × ht + by
      const yt = vectorAdd(matrixVectorMultiply(this.Why, ht), this.by);

      hiddenStates.push([...ht]);
      cellStates.push([...Ct]);
      outputs.push(yt);
    }

    return { hiddenStates, cellStates, outputs };
  }

  /**
   * Predice salida final (many-to-one)
   */
  predict(inputs: number[][]): number[] {
    const { outputs } = this.forward(inputs);
    return outputs[outputs.length - 1];
  }

  /**
   * Predice secuencia completa (many-to-many)
   */
  predictSequence(inputs: number[][]): number[][] {
    const { outputs } = this.forward(inputs);
    return outputs;
  }
}

// ============================================
// UTILIDADES ADICIONALES
// ============================================

/**
 * Genera secuencia sintética para testing
 *
 * @param length - Longitud de la secuencia
 * @param inputSize - Dimensión de cada input
 * @returns Secuencia aleatoria
 */
export function generateRandomSequence(
  length: number,
  inputSize: number
): number[][] {
  return Array(length)
    .fill(0)
    .map(() =>
      Array(inputSize)
        .fill(0)
        .map(() => Math.random())
    );
}

/**
 * Normaliza secuencia a rango [0, 1]
 */
export function normalizeSequence(sequence: number[][]): number[][] {
  const flat = sequence.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const range = max - min;

  if (range === 0) return sequence;

  return sequence.map(step =>
    step.map(val => (val - min) / range)
  );
}

// ============================================
// EJEMPLO DE USO
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 14: RNN para Secuencias ===\n');

  // Ejemplo 1: RNN Simple
  console.log('1. Simple RNN');
  console.log('-------------');

  const rnn = new SimpleRNN(3, 5, 2);
  const sequence = generateRandomSequence(4, 3);

  console.log(`Secuencia de entrada: ${sequence.length} pasos`);
  console.log(`Dimensión de entrada: ${sequence[0].length}`);

  const { hiddenStates, outputs } = rnn.forward(sequence);

  console.log(`Estados ocultos generados: ${hiddenStates.length}`);
  console.log(`Dimensión estado oculto: ${hiddenStates[0].length}`);
  console.log(`Outputs generados: ${outputs.length}`);
  console.log(`Dimensión output: ${outputs[0].length}`);

  const finalPrediction = rnn.predict(sequence);
  console.log(`Predicción final: [${finalPrediction.map(v => v.toFixed(3)).join(', ')}]`);

  // Ejemplo 2: LSTM
  console.log('\n\n2. LSTM');
  console.log('-------');

  const lstm = new LSTM(3, 5, 2);
  const { cellStates, outputs: lstmOutputs } = lstm.forward(sequence);

  console.log(`Cell states generados: ${cellStates.length}`);
  console.log(`Dimensión cell state: ${cellStates[0].length}`);

  const lstmPrediction = lstm.predict(sequence);
  console.log(`Predicción final: [${lstmPrediction.map(v => v.toFixed(3)).join(', ')}]`);

  // Ejemplo 3: Comparación RNN vs LSTM
  console.log('\n\n3. Comparación: RNN vs LSTM');
  console.log('----------------------------');

  const longSequence = generateRandomSequence(10, 2);

  const rnnLong = new SimpleRNN(2, 8, 1);
  const lstmLong = new LSTM(2, 8, 1);

  const rnnResult = rnnLong.predictSequence(longSequence);
  const lstmResult = lstmLong.predictSequence(longSequence);

  console.log('Secuencia de 10 pasos:');
  console.log(`  RNN outputs: ${rnnResult.length} predicciones`);
  console.log(`  LSTM outputs: ${lstmResult.length} predicciones`);

  console.log('\nPrimeras 3 predicciones RNN:');
  rnnResult.slice(0, 3).forEach((out, i) =>
    console.log(`  t=${i}: ${out[0].toFixed(4)}`)
  );

  console.log('\nPrimeras 3 predicciones LSTM:');
  lstmResult.slice(0, 3).forEach((out, i) =>
    console.log(`  t=${i}: ${out[0].toFixed(4)}`)
  );

  console.log('\n=== Fin del ejemplo ===');
}
