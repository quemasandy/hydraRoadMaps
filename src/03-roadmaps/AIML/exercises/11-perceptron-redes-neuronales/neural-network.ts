/**
 * Ejercicio 11: Perceptrón y Redes Neuronales
 *
 * Implementación desde cero de perceptrones y redes neuronales MLP
 * con diferentes funciones de activación.
 */

// ============================================
// TIPOS E INTERFACES
// ============================================

/**
 * Configuración para Multi-Layer Perceptron
 */
export interface MLPConfig {
  inputSize: number;
  hiddenSize: number;
  outputSize: number;
  activation?: 'sigmoid' | 'tanh' | 'relu' | 'leaky_relu';
  learningRate?: number;
  weightInit?: 'random' | 'xavier' | 'he';
}

/**
 * Tipo para funciones de activación
 */
export type ActivationFunction = (z: number | number[]) => number | number[];

// ============================================
// FUNCIONES DE ACTIVACIÓN
// ============================================

/**
 * Función Sigmoid (Logística)
 *
 * σ(z) = 1 / (1 + e^(-z))
 *
 * Matemáticamente:
 * - Rango: (0, 1)
 * - Salida interpretable como probabilidad
 * - Suave y diferenciable en todo su dominio
 *
 * Problema: Vanishing gradient en valores extremos
 * cuando |z| es grande, σ'(z) → 0
 *
 * @param z - Valor(es) de entrada
 * @returns Valor(es) transformado(s) entre 0 y 1
 */
export function sigmoid(z: number | number[]): number | number[] {
  const compute = (val: number): number => {
    // Prevenir overflow numérico
    // Si z < -500, e^(-z) → ∞, entonces σ(z) ≈ 0
    if (val < -500) return 0;
    // Si z > 500, e^(-z) → 0, entonces σ(z) ≈ 1
    if (val > 500) return 1;
    return 1 / (1 + Math.exp(-val));
  };

  return Array.isArray(z) ? z.map(compute) : compute(z);
}

/**
 * Derivada de Sigmoid
 *
 * σ'(z) = σ(z) × (1 - σ(z))
 *
 * Demostración:
 * σ(z) = 1 / (1 + e^(-z))
 * d/dz σ(z) = e^(-z) / (1 + e^(-z))²
 *            = σ(z) × (1 - σ(z))
 *
 * Propiedades:
 * - Máximo en z=0: σ'(0) = 0.25
 * - Tiende a 0 cuando |z| → ∞ (vanishing gradient)
 *
 * @param z - Valor(es) de entrada (puede ser pre o post sigmoid)
 * @returns Derivada en ese punto
 */
export function sigmoidDerivative(z: number | number[]): number | number[] {
  const compute = (val: number): number => {
    const sig = typeof sigmoid(val) === 'number' ? sigmoid(val) as number : 0;
    return sig * (1 - sig);
  };

  return Array.isArray(z) ? z.map(compute) : compute(z);
}

/**
 * Función Tanh (Tangente Hiperbólica)
 *
 * tanh(z) = (e^z - e^(-z)) / (e^z + e^(-z))
 *         = 2σ(2z) - 1
 *
 * Matemáticamente:
 * - Rango: (-1, 1)
 * - Centrada en 0 (mejor que sigmoid para convergencia)
 * - tanh(0) = 0
 *
 * Ventajas sobre sigmoid:
 * - Salidas centradas → mejor gradiente
 * - Convergencia más rápida
 *
 * @param z - Valor(es) de entrada
 * @returns Valor(es) transformado(s) entre -1 y 1
 */
export function tanh(z: number | number[]): number | number[] {
  const compute = (val: number): number => {
    // Prevenir overflow
    if (val > 20) return 1;
    if (val < -20) return -1;
    return Math.tanh(val);
  };

  return Array.isArray(z) ? z.map(compute) : compute(z);
}

/**
 * Derivada de Tanh
 *
 * tanh'(z) = 1 - tanh²(z)
 *
 * Demostración:
 * tanh(z) = (e^z - e^(-z)) / (e^z + e^(-z))
 * d/dz tanh(z) = 4 / (e^z + e^(-z))²
 *              = 1 - tanh²(z)
 *
 * Propiedades:
 * - Máximo en z=0: tanh'(0) = 1
 * - Mayor que sigmoid' (mejor flujo de gradiente)
 * - Aún sufre vanishing gradient para |z| grande
 *
 * @param z - Valor(es) de entrada
 * @returns Derivada en ese punto
 */
export function tanhDerivative(z: number | number[]): number | number[] {
  const compute = (val: number): number => {
    const t = typeof tanh(val) === 'number' ? tanh(val) as number : 0;
    return 1 - t * t;
  };

  return Array.isArray(z) ? z.map(compute) : compute(z);
}

/**
 * Función ReLU (Rectified Linear Unit)
 *
 * ReLU(z) = max(0, z) = { z  si z > 0
 *                       { 0  si z ≤ 0
 *
 * Matemáticamente:
 * - Rango: [0, ∞)
 * - No saturación para z > 0
 * - Computacionalmente muy eficiente
 *
 * Ventajas:
 * - NO vanishing gradient para z > 0
 * - Convergencia ~6x más rápida que sigmoid/tanh
 * - Sparsity: ~50% neuronas inactivas (regularización implícita)
 *
 * Problema: "Dying ReLU"
 * Si z < 0 siempre, gradiente = 0 → neurona nunca aprende
 *
 * @param z - Valor(es) de entrada
 * @returns max(0, z)
 */
export function relu(z: number | number[]): number | number[] {
  const compute = (val: number): number => Math.max(0, val);
  return Array.isArray(z) ? z.map(compute) : compute(z);
}

/**
 * Derivada de ReLU
 *
 * ReLU'(z) = { 1  si z > 0
 *            { 0  si z ≤ 0
 *
 * Nota técnica:
 * - En z=0 no es diferenciable (subgradiente)
 * - En práctica: definimos ReLU'(0) = 0
 *
 * Esta discontinuidad no causa problemas en práctica porque:
 * - P(z = 0 exactamente) = 0 con pesos reales
 * - El optimizador rara vez visita z=0 exacto
 *
 * @param z - Valor(es) de entrada
 * @returns 1 si z > 0, 0 si z ≤ 0
 */
export function reluDerivative(z: number | number[]): number | number[] {
  const compute = (val: number): number => (val > 0 ? 1 : 0);
  return Array.isArray(z) ? z.map(compute) : compute(z);
}

/**
 * Función Leaky ReLU
 *
 * LeakyReLU(z) = { z      si z > 0
 *                { α×z    si z ≤ 0
 *
 * donde α = 0.01 típicamente (pequeña pendiente negativa)
 *
 * Matemáticamente:
 * - Rango: (-∞, ∞)
 * - Permite gradiente pequeño para z < 0
 *
 * Resuelve "Dying ReLU":
 * - Neuronas con z < 0 aún reciben gradiente
 * - Pueden "revivir" durante entrenamiento
 *
 * Variantes:
 * - PReLU: α es aprendible (parámetro)
 * - ELU: Exponencial para z < 0
 *
 * @param z - Valor(es) de entrada
 * @param alpha - Pendiente para z < 0 (default: 0.01)
 * @returns z si z > 0, alpha*z si z ≤ 0
 */
export function leakyRelu(
  z: number | number[],
  alpha: number = 0.01
): number | number[] {
  const compute = (val: number): number => (val > 0 ? val : alpha * val);
  return Array.isArray(z) ? z.map(compute) : compute(z);
}

/**
 * Derivada de Leaky ReLU
 *
 * LeakyReLU'(z) = { 1  si z > 0
 *                 { α  si z ≤ 0
 *
 * Siempre tiene gradiente no-cero:
 * - Para z > 0: gradiente completo (1)
 * - Para z ≤ 0: gradiente pequeño (α)
 *
 * Esto permite que todas las neuronas aprendan,
 * incluso las que están en región negativa.
 *
 * @param z - Valor(es) de entrada
 * @param alpha - Pendiente para z < 0 (default: 0.01)
 * @returns 1 si z > 0, alpha si z ≤ 0
 */
export function leakyReluDerivative(
  z: number | number[],
  alpha: number = 0.01
): number | number[] {
  const compute = (val: number): number => (val > 0 ? 1 : alpha);
  return Array.isArray(z) ? z.map(compute) : compute(z);
}

// ============================================
// UTILIDADES MATEMÁTICAS
// ============================================

/**
 * Producto punto entre dos vectores
 *
 * a · b = Σ(ai × bi)
 *
 * @param a - Primer vector
 * @param b - Segundo vector
 * @returns Producto escalar
 */
export function dotProduct(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(
      `Vector dimensions must match: ${a.length} vs ${b.length}`
    );
  }
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

/**
 * Multiplicación de matrices
 *
 * C = A × B
 * donde Cij = Σk(Aik × Bkj)
 *
 * Dimensiones:
 * - A: (m × n)
 * - B: (n × p)
 * - C: (m × p)
 *
 * @param A - Primera matriz (m × n)
 * @param B - Segunda matriz (n × p)
 * @returns Matriz resultado (m × p)
 */
export function matrixMultiply(A: number[][], B: number[][]): number[][] {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;

  if (B.length !== n) {
    throw new Error(
      `Matrix dimensions incompatible for multiplication: ` +
        `(${m}×${n}) × (${B.length}×${p})`
    );
  }

  const C: number[][] = Array(m)
    .fill(0)
    .map(() => Array(p).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      for (let k = 0; k < n; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }

  return C;
}

/**
 * Añade columna de bias (1s) al principio de X
 *
 * X = [[x11, x12],     →  [[1, x11, x12],
 *      [x21, x22]]         [1, x21, x22]]
 *
 * Esto permite incluir el término independiente (bias)
 * en la multiplicación matricial: z = W×X en vez de z = W×X + b
 *
 * @param X - Matriz de features (m × n)
 * @returns Matriz con bias (m × (n+1))
 */
export function addBias(X: number[][]): number[][] {
  return X.map(row => [1, ...row]);
}

/**
 * Inicializa matriz de pesos según método especificado
 *
 * Métodos:
 *
 * 1. Random: Uniforme [-0.5, 0.5]
 *    - Simple pero puede causar problemas
 *
 * 2. Xavier/Glorot: Normal(0, sqrt(2/(nin + nout)))
 *    - Óptimo para sigmoid/tanh
 *    - Mantiene varianza constante entre capas
 *    - Previene vanishing/exploding gradients
 *
 * 3. He: Normal(0, sqrt(2/nin))
 *    - Óptimo para ReLU y variantes
 *    - Cuenta que ReLU "mata" mitad de neuronas
 *    - Factor 2 compensa la reducción de varianza
 *
 * @param rows - Número de filas (neuronas capa actual)
 * @param cols - Número de columnas (neuronas capa anterior)
 * @param method - Método de inicialización
 * @returns Matriz de pesos inicializados
 */
export function initializeWeights(
  rows: number,
  cols: number,
  method: 'random' | 'xavier' | 'he' = 'xavier'
): number[][] {
  const weights: number[][] = [];

  for (let i = 0; i < rows; i++) {
    weights[i] = [];
    for (let j = 0; j < cols; j++) {
      if (method === 'random') {
        // Random: [-0.5, 0.5]
        weights[i][j] = Math.random() - 0.5;
      } else if (method === 'xavier') {
        // Xavier: Normal(0, sqrt(2/(nin + nout)))
        const variance = 2 / (cols + rows);
        const stddev = Math.sqrt(variance);
        weights[i][j] = randomNormal(0, stddev);
      } else {
        // He: Normal(0, sqrt(2/nin))
        const variance = 2 / cols;
        const stddev = Math.sqrt(variance);
        weights[i][j] = randomNormal(0, stddev);
      }
    }
  }

  return weights;
}

/**
 * Genera número aleatorio con distribución normal
 * usando método Box-Muller
 *
 * Box-Muller transform:
 * Si U1, U2 ~ Uniform(0,1), entonces:
 * Z = sqrt(-2×ln(U1)) × cos(2π×U2) ~ Normal(0,1)
 *
 * @param mean - Media
 * @param stddev - Desviación estándar
 * @returns Número aleatorio ~ Normal(mean, stddev²)
 */
function randomNormal(mean: number = 0, stddev: number = 1): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stddev;
}

// ============================================
// PERCEPTRÓN SIMPLE
// ============================================

/**
 * Perceptrón Simple (Rosenblatt, 1958)
 *
 * Modelo de neurona artificial más básico.
 *
 * Ecuación:
 * ŷ = σ(w·x + b)
 *
 * Aprendizaje (Regla Delta):
 * w_new = w_old + η × (y - ŷ) × x
 * b_new = b_old + η × (y - ŷ)
 *
 * donde:
 * - η: learning rate (paso de actualización)
 * - y: etiqueta verdadera
 * - ŷ: predicción
 *
 * Limitación: Solo aprende funciones linealmente separables
 * (no puede aprender XOR, por ejemplo)
 */
export class Perceptron {
  private weights: number[] = [];
  private bias: number = 0;
  private learningRate: number;

  /**
   * @param learningRate - Tasa de aprendizaje (η)
   */
  constructor(learningRate: number = 0.01) {
    this.learningRate = learningRate;
  }

  /**
   * Entrena el perceptrón
   *
   * Algoritmo:
   * 1. Inicializar pesos aleatoriamente
   * 2. Para cada época:
   *    Para cada ejemplo (x, y):
   *      a. Calcular z = w·x + b
   *      b. Calcular ŷ = σ(z)
   *      c. Calcular error e = y - ŷ
   *      d. Actualizar: w += η × e × x
   *      e. Actualizar: b += η × e
   *
   * @param X - Matriz de features (m × n)
   * @param y - Vector de etiquetas (m)
   * @param epochs - Número de iteraciones sobre dataset
   */
  fit(X: number[][], y: number[], epochs: number = 100): void {
    const m = X.length;
    const n = X[0].length;

    // 1. Inicializar pesos pequeños aleatorios
    this.weights = Array(n)
      .fill(0)
      .map(() => (Math.random() - 0.5) * 0.1);
    this.bias = (Math.random() - 0.5) * 0.1;

    // 2. Entrenar por múltiples épocas
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let i = 0; i < m; i++) {
        // a. Forward pass: calcular z = w·x + b
        const z = dotProduct(this.weights, X[i]) + this.bias;

        // b. Aplicar activación: ŷ = σ(z)
        const y_pred = typeof sigmoid(z) === 'number' ? sigmoid(z) as number : 0;

        // c. Calcular error: e = y - ŷ
        const error = y[i] - y_pred;

        // d. Actualizar pesos: w_new = w_old + η × e × x
        for (let j = 0; j < n; j++) {
          this.weights[j] += this.learningRate * error * X[i][j];
        }

        // e. Actualizar bias: b_new = b_old + η × e
        this.bias += this.learningRate * error;
      }
    }
  }

  /**
   * Predice clases para nuevos ejemplos
   *
   * @param X - Matriz de features (m × n)
   * @returns Predicciones binarias (0 o 1)
   */
  predict(X: number[][]): number[] {
    return X.map(x => {
      const z = dotProduct(this.weights, x) + this.bias;
      const prob = typeof sigmoid(z) === 'number' ? sigmoid(z) as number : 0;
      return prob >= 0.5 ? 1 : 0;
    });
  }

  /**
   * Predice probabilidades para nuevos ejemplos
   *
   * @param X - Matriz de features (m × n)
   * @returns Probabilidades entre 0 y 1
   */
  predictProba(X: number[][]): number[] {
    return X.map(x => {
      const z = dotProduct(this.weights, x) + this.bias;
      return typeof sigmoid(z) === 'number' ? sigmoid(z) as number : 0;
    });
  }

  /**
   * Obtiene los pesos aprendidos
   */
  getWeights(): { weights: number[]; bias: number } {
    return {
      weights: [...this.weights],
      bias: this.bias,
    };
  }
}

// ============================================
// MULTI-LAYER PERCEPTRON (MLP)
// ============================================

/**
 * Red Neuronal Multi-Layer Perceptron
 *
 * Arquitectura: Input → Hidden → Output
 *
 * Forward pass:
 * 1. Hidden layer:  h = σ₁(W₁×x + b₁)
 * 2. Output layer:  ŷ = σ₂(W₂×h + b₂)
 *
 * Dimensiones:
 * - W₁: (hidden_size × input_size)
 * - b₁: (hidden_size)
 * - W₂: (output_size × hidden_size)
 * - b₂: (output_size)
 *
 * Nota: Esta implementación solo hace forward pass.
 * El entrenamiento (backpropagation) se implementa en ejercicio 12.
 */
export class MultiLayerPerceptron {
  private W1: number[][] = []; // Input → Hidden weights
  private b1: number[] = []; // Hidden bias
  private W2: number[][] = []; // Hidden → Output weights
  private b2: number[] = []; // Output bias

  private config: Required<MLPConfig>;
  private activationFn: ActivationFunction;

  /**
   * @param config - Configuración de la red
   */
  constructor(config: MLPConfig) {
    this.config = {
      inputSize: config.inputSize,
      hiddenSize: config.hiddenSize,
      outputSize: config.outputSize,
      activation: config.activation || 'relu',
      learningRate: config.learningRate || 0.01,
      weightInit: config.weightInit || 'xavier',
    };

    // Seleccionar función de activación
    this.activationFn = this.getActivationFunction(this.config.activation);

    // Inicializar pesos y bias
    this.initializeParameters();
  }

  /**
   * Inicializa parámetros de la red
   */
  private initializeParameters(): void {
    const { inputSize, hiddenSize, outputSize, weightInit } = this.config;

    // W1: (hidden_size × input_size)
    this.W1 = initializeWeights(hiddenSize, inputSize, weightInit);
    // b1: (hidden_size)
    this.b1 = Array(hiddenSize).fill(0);

    // W2: (output_size × hidden_size)
    this.W2 = initializeWeights(outputSize, hiddenSize, weightInit);
    // b2: (output_size)
    this.b2 = Array(outputSize).fill(0);
  }

  /**
   * Obtiene función de activación por nombre
   */
  private getActivationFunction(name: string): ActivationFunction {
    switch (name) {
      case 'sigmoid':
        return sigmoid;
      case 'tanh':
        return tanh;
      case 'relu':
        return relu;
      case 'leaky_relu':
        return leakyRelu;
      default:
        return relu;
    }
  }

  /**
   * Forward pass: propaga input hacia adelante
   *
   * Matemática:
   *
   * 1. Input → Hidden:
   *    Para cada ejemplo xi:
   *      z1[i] = W₁ × xi + b₁        (suma ponderada)
   *      h[i]  = σ(z1[i])            (activación)
   *
   * 2. Hidden → Output:
   *    Para cada ejemplo (usando hi de paso 1):
   *      z2[i] = W₂ × hi + b₂        (suma ponderada)
   *      ŷ[i]  = σ(z2[i])            (activación)
   *
   * @param X - Matriz de entrada (m × input_size)
   * @returns { hidden, output } - Activaciones de cada capa
   */
  forward(X: number[][]): {
    hidden: number[][];
    output: number[][];
  } {
    const m = X.length;
    const hidden: number[][] = [];
    const output: number[][] = [];

    // Para cada ejemplo
    for (let i = 0; i < m; i++) {
      // 1. Input → Hidden layer
      // z1 = W1 × x + b1
      const z1: number[] = [];
      for (let j = 0; j < this.W1.length; j++) {
        let sum = this.b1[j];
        for (let k = 0; k < X[i].length; k++) {
          sum += this.W1[j][k] * X[i][k];
        }
        z1.push(sum);
      }

      // h = σ(z1)
      const h = this.activationFn(z1) as number[];
      hidden.push(h);

      // 2. Hidden → Output layer
      // z2 = W2 × h + b2
      const z2: number[] = [];
      for (let j = 0; j < this.W2.length; j++) {
        let sum = this.b2[j];
        for (let k = 0; k < h.length; k++) {
          sum += this.W2[j][k] * h[k];
        }
        z2.push(sum);
      }

      // ŷ = σ(z2) - usamos sigmoid para output
      const y = sigmoid(z2) as number[];
      output.push(y);
    }

    return { hidden, output };
  }

  /**
   * Predice clases (0 o 1) para clasificación binaria
   *
   * @param X - Matriz de features
   * @returns Predicciones binarias
   */
  predict(X: number[][]): number[] {
    const { output } = this.forward(X);

    // Para clasificación binaria: threshold en 0.5
    if (this.config.outputSize === 1) {
      return output.map(o => (o[0] >= 0.5 ? 1 : 0));
    }

    // Para multiclase: argmax
    return output.map(o => {
      let maxIdx = 0;
      let maxVal = o[0];
      for (let i = 1; i < o.length; i++) {
        if (o[i] > maxVal) {
          maxVal = o[i];
          maxIdx = i;
        }
      }
      return maxIdx;
    });
  }

  /**
   * Predice probabilidades
   *
   * @param X - Matriz de features
   * @returns Probabilidades para cada clase
   */
  predictProba(X: number[][]): number[][] {
    const { output } = this.forward(X);
    return output;
  }

  /**
   * Obtiene parámetros de la red
   */
  getParameters(): {
    W1: number[][];
    b1: number[];
    W2: number[][];
    b2: number[];
  } {
    return {
      W1: this.W1.map(row => [...row]),
      b1: [...this.b1],
      W2: this.W2.map(row => [...row]),
      b2: [...this.b2],
    };
  }
}

// ============================================
// EJEMPLO DE USO
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 11: Perceptrón y Redes Neuronales ===\n');

  // Ejemplo 1: Perceptrón Simple (AND lógico)
  console.log('1. Perceptrón Simple - AND lógico');
  console.log('-----------------------------------');

  const X_and = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ];
  const y_and = [0, 0, 0, 1];

  const perceptron = new Perceptron(0.1);
  perceptron.fit(X_and, y_and, 100);

  console.log('Entrenamiento completado.');
  console.log('Predicciones:');
  X_and.forEach((x, i) => {
    const pred = perceptron.predict([x])[0];
    const prob = perceptron.predictProba([x])[0];
    console.log(`  ${x} → ${pred} (prob: ${prob.toFixed(3)})`);
  });

  const { weights, bias } = perceptron.getWeights();
  console.log(`Pesos: [${weights.map(w => w.toFixed(3)).join(', ')}]`);
  console.log(`Bias: ${bias.toFixed(3)}\n`);

  // Ejemplo 2: Funciones de Activación
  console.log('2. Comparación de Funciones de Activación');
  console.log('------------------------------------------');

  const testValues = [-2, -1, 0, 1, 2];
  console.log('z    | sigmoid | tanh   | ReLU  | Leaky ReLU');
  console.log('-----|---------|--------|-------|------------');

  testValues.forEach(z => {
    const sig = sigmoid(z) as number;
    const tan = tanh(z) as number;
    const rel = relu(z) as number;
    const lrel = leakyRelu(z) as number;
    console.log(
      `${z.toString().padEnd(4)} | ` +
        `${sig.toFixed(3).padEnd(7)} | ` +
        `${tan.toFixed(3).padEnd(6)} | ` +
        `${rel.toFixed(3).padEnd(5)} | ` +
        `${lrel.toFixed(3)}`
    );
  });
  console.log('');

  // Ejemplo 3: Multi-Layer Perceptron
  console.log('3. Multi-Layer Perceptron - XOR');
  console.log('--------------------------------');

  const X_xor = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ];

  const mlp = new MultiLayerPerceptron({
    inputSize: 2,
    hiddenSize: 4,
    outputSize: 1,
    activation: 'relu',
    weightInit: 'he',
  });

  console.log('Red neuronal creada:');
  console.log('  Input layer: 2 neuronas');
  console.log('  Hidden layer: 4 neuronas (ReLU)');
  console.log('  Output layer: 1 neurona (Sigmoid)');
  console.log('');

  const { hidden, output } = mlp.forward(X_xor);
  console.log('Forward pass (pesos aleatorios):');
  X_xor.forEach((x, i) => {
    console.log(`  ${x} → ${output[i][0].toFixed(3)}`);
  });
  console.log('');

  // Ejemplo 4: Diferentes inicializaciones
  console.log('4. Comparación de Inicializaciones de Pesos');
  console.log('-------------------------------------------');

  const methods: ('random' | 'xavier' | 'he')[] = ['random', 'xavier', 'he'];
  methods.forEach(method => {
    const W = initializeWeights(3, 4, method);
    const values = W.flat();
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) /
      values.length;
    const stddev = Math.sqrt(variance);

    console.log(`\n${method.toUpperCase()}:`);
    console.log(`  Media: ${mean.toFixed(4)}`);
    console.log(`  Std dev: ${stddev.toFixed(4)}`);
    console.log(`  Rango: [${Math.min(...values).toFixed(3)}, ${Math.max(...values).toFixed(3)}]`);
  });

  console.log('\n=== Fin del ejemplo ===');
}
