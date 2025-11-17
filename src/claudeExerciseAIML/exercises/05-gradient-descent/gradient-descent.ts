/**
 * Ejercicio 05: Gradient Descent
 *
 * Este módulo implementa algoritmos de optimización basados en gradiente
 * descendente, fundamentales para entrenar modelos de Machine Learning.
 */

// ============================================
// TIPOS E INTERFACES
// ============================================

/**
 * Parámetros para Gradient Descent
 */
export interface GDParams {
  learningRate: number;
  iterations: number;
  tolerance?: number;
}

/**
 * Resultado de Gradient Descent
 */
export interface GDResult {
  theta: number[];
  costs: number[];
  iterations: number;
}

/**
 * Parámetros para Adam optimizer
 */
export interface AdamParams {
  learningRate: number;
  beta1?: number;
  beta2?: number;
  epsilon?: number;
  iterations: number;
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

/**
 * Calcula las predicciones y = X × θ
 *
 * @param X - Matriz de features (m × n)
 * @param theta - Vector de parámetros (n)
 * @returns Vector de predicciones (m)
 */
export function predict(X: number[][], theta: number[]): number[] {
  return X.map(row => {
    return row.reduce((sum, xi, i) => sum + xi * theta[i], 0);
  });
}

/**
 * Calcula el costo MSE (Mean Squared Error)
 * J(θ) = (1/2m) × Σ(ŷi - yi)²
 *
 * @param X - Matriz de features
 * @param y - Vector de valores reales
 * @param theta - Vector de parámetros
 * @returns Costo
 */
export function computeCost(
  X: number[][],
  y: number[],
  theta: number[]
): number {
  const m = y.length;
  const predictions = predict(X, theta);

  const squaredErrors = predictions.map((pred, i) => Math.pow(pred - y[i], 2));
  const sumSquaredErrors = squaredErrors.reduce((sum, err) => sum + err, 0);

  return sumSquaredErrors / (2 * m);
}

/**
 * Calcula el gradiente ∇J(θ)
 * ∇J(θ) = (1/m) × X^T × (X×θ - y)
 *
 * @param X - Matriz de features (m × n)
 * @param y - Vector de valores reales (m)
 * @param theta - Vector de parámetros (n)
 * @returns Vector gradiente (n)
 */
export function computeGradient(
  X: number[][],
  y: number[],
  theta: number[]
): number[] {
  const m = y.length;
  const predictions = predict(X, theta);

  // Calcular errores
  const errors = predictions.map((pred, i) => pred - y[i]);

  // Calcular gradiente para cada parámetro
  const gradient: number[] = [];
  const n = theta.length;

  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < m; i++) {
      sum += errors[i] * X[i][j];
    }
    gradient.push(sum / m);
  }

  return gradient;
}

/**
 * Mezcla un array usando Fisher-Yates shuffle
 *
 * @param array - Array a mezclar
 * @returns Nuevo array mezclado
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Añade columna de bias (1s) a la matriz X
 *
 * @param X - Matriz de features sin bias
 * @returns Matriz con columna de bias
 */
export function addBias(X: number[][]): number[][] {
  return X.map(row => [1, ...row]);
}

// ============================================
// BATCH GRADIENT DESCENT
// ============================================

/**
 * Implementa Batch Gradient Descent
 * Usa todos los datos para calcular el gradiente en cada iteración
 *
 * @param X - Matriz de features (incluir columna de bias)
 * @param y - Vector de valores reales
 * @param params - Parámetros de GD
 * @returns Resultado con theta óptimo y costos
 */
export function gradientDescent(
  X: number[][],
  y: number[],
  params: GDParams
): GDResult {
  const { learningRate, iterations, tolerance = 1e-6 } = params;

  // Validar dimensiones
  if (X.length !== y.length) {
    throw new Error('X e y deben tener la misma cantidad de muestras');
  }

  if (X.length === 0) {
    throw new Error('X no puede estar vacío');
  }

  // Inicializar theta con ceros
  const n = X[0].length;
  let theta = new Array(n).fill(0);

  const costs: number[] = [];
  let actualIterations = 0;

  // Gradient descent loop
  for (let iter = 0; iter < iterations; iter++) {
    // Calcular costo actual
    const cost = computeCost(X, y, theta);
    costs.push(cost);

    // Verificar convergencia
    if (
      iter > 0 &&
      tolerance &&
      Math.abs(costs[iter] - costs[iter - 1]) < tolerance
    ) {
      actualIterations = iter + 1;
      break;
    }

    // Calcular gradiente
    const gradient = computeGradient(X, y, theta);

    // Actualizar theta
    theta = theta.map((t, j) => t - learningRate * gradient[j]);

    actualIterations = iter + 1;
  }

  return {
    theta,
    costs,
    iterations: actualIterations,
  };
}

// ============================================
// STOCHASTIC GRADIENT DESCENT
// ============================================

/**
 * Implementa Stochastic Gradient Descent
 * Actualiza theta con un ejemplo a la vez
 *
 * @param X - Matriz de features
 * @param y - Vector de valores reales
 * @param params - Parámetros incluyendo epochs
 * @returns Resultado con theta óptimo
 */
export function stochasticGradientDescent(
  X: number[][],
  y: number[],
  params: GDParams & { epochs: number }
): GDResult {
  const { learningRate, epochs, tolerance = 1e-6 } = params;

  const m = y.length;
  const n = X[0].length;
  let theta = new Array(n).fill(0);

  const costs: number[] = [];
  let totalIterations = 0;

  for (let epoch = 0; epoch < epochs; epoch++) {
    // Mezclar los datos
    const indices = shuffle(Array.from({ length: m }, (_, i) => i));

    for (let idx of indices) {
      const xi = X[idx];
      const yi = y[idx];

      // Calcular predicción para este ejemplo
      const prediction = xi.reduce((sum, xij, j) => sum + xij * theta[j], 0);
      const error = prediction - yi;

      // Calcular gradiente para este ejemplo
      const gradient = xi.map(xij => error * xij);

      // Actualizar theta
      theta = theta.map((t, j) => t - learningRate * gradient[j]);

      totalIterations++;
    }

    // Calcular costo al final de la época
    const cost = computeCost(X, y, theta);
    costs.push(cost);

    // Verificar convergencia
    if (
      epoch > 0 &&
      tolerance &&
      Math.abs(costs[epoch] - costs[epoch - 1]) < tolerance
    ) {
      break;
    }
  }

  return {
    theta,
    costs,
    iterations: totalIterations,
  };
}

// ============================================
// MINI-BATCH GRADIENT DESCENT
// ============================================

/**
 * Implementa Mini-Batch Gradient Descent
 * Usa un subconjunto de datos para calcular el gradiente
 *
 * @param X - Matriz de features
 * @param y - Vector de valores reales
 * @param params - Parámetros incluyendo batchSize
 * @returns Resultado con theta óptimo
 */
export function miniBatchGradientDescent(
  X: number[][],
  y: number[],
  params: GDParams & { batchSize: number }
): GDResult {
  const { learningRate, iterations, batchSize, tolerance = 1e-6 } = params;

  const m = y.length;
  const n = X[0].length;
  let theta = new Array(n).fill(0);

  const costs: number[] = [];
  let totalIterations = 0;

  const numBatches = Math.ceil(m / batchSize);

  for (let iter = 0; iter < iterations; iter++) {
    // Mezclar datos
    const indices = shuffle(Array.from({ length: m }, (_, i) => i));

    for (let b = 0; b < numBatches; b++) {
      // Crear mini-batch
      const startIdx = b * batchSize;
      const endIdx = Math.min(startIdx + batchSize, m);
      const batchIndices = indices.slice(startIdx, endIdx);

      const Xbatch = batchIndices.map(i => X[i]);
      const ybatch = batchIndices.map(i => y[i]);

      // Calcular gradiente con el batch
      const gradient = computeGradient(Xbatch, ybatch, theta);

      // Actualizar theta
      theta = theta.map((t, j) => t - learningRate * gradient[j]);

      totalIterations++;
    }

    // Calcular costo al final de la iteración
    const cost = computeCost(X, y, theta);
    costs.push(cost);

    // Verificar convergencia
    if (
      iter > 0 &&
      tolerance &&
      Math.abs(costs[iter] - costs[iter - 1]) < tolerance
    ) {
      break;
    }
  }

  return {
    theta,
    costs,
    iterations: totalIterations,
  };
}

// ============================================
// GRADIENT DESCENT WITH MOMENTUM
// ============================================

/**
 * Implementa Gradient Descent con Momentum
 * Acelera convergencia y reduce oscilaciones
 *
 * @param X - Matriz de features
 * @param y - Vector de valores reales
 * @param params - Parámetros incluyendo momentum
 * @returns Resultado con theta óptimo
 */
export function gradientDescentWithMomentum(
  X: number[][],
  y: number[],
  params: GDParams & { momentum: number }
): GDResult {
  const { learningRate, iterations, momentum, tolerance = 1e-6 } = params;

  const n = X[0].length;
  let theta = new Array(n).fill(0);
  let velocity = new Array(n).fill(0);

  const costs: number[] = [];
  let actualIterations = 0;

  for (let iter = 0; iter < iterations; iter++) {
    // Calcular costo
    const cost = computeCost(X, y, theta);
    costs.push(cost);

    // Verificar convergencia
    if (
      iter > 0 &&
      tolerance &&
      Math.abs(costs[iter] - costs[iter - 1]) < tolerance
    ) {
      actualIterations = iter + 1;
      break;
    }

    // Calcular gradiente
    const gradient = computeGradient(X, y, theta);

    // Actualizar velocidad: v = β×v + ∇J(θ)
    velocity = velocity.map((v, j) => momentum * v + gradient[j]);

    // Actualizar theta: θ = θ - α×v
    theta = theta.map((t, j) => t - learningRate * velocity[j]);

    actualIterations = iter + 1;
  }

  return {
    theta,
    costs,
    iterations: actualIterations,
  };
}

// ============================================
// ADAM OPTIMIZER
// ============================================

/**
 * Implementa el optimizador Adam
 * Adaptive Moment Estimation - combina Momentum y RMSprop
 *
 * @param X - Matriz de features
 * @param y - Vector de valores reales
 * @param params - Parámetros de Adam
 * @returns Resultado con theta óptimo
 */
export function adam(
  X: number[][],
  y: number[],
  params: AdamParams
): GDResult {
  const {
    learningRate,
    iterations,
    beta1 = 0.9,
    beta2 = 0.999,
    epsilon = 1e-8,
  } = params;

  const n = X[0].length;
  let theta = new Array(n).fill(0);
  let m = new Array(n).fill(0); // Primer momento (media)
  let v = new Array(n).fill(0); // Segundo momento (varianza)

  const costs: number[] = [];

  for (let t = 1; t <= iterations; t++) {
    // Calcular costo
    const cost = computeCost(X, y, theta);
    costs.push(cost);

    // Calcular gradiente
    const gradient = computeGradient(X, y, theta);

    // Actualizar momentos
    m = m.map((mi, j) => beta1 * mi + (1 - beta1) * gradient[j]);
    v = v.map((vi, j) => beta2 * vi + (1 - beta2) * gradient[j] ** 2);

    // Bias correction
    const mHat = m.map(mi => mi / (1 - beta1 ** t));
    const vHat = v.map(vi => vi / (1 - beta2 ** t));

    // Actualizar theta
    theta = theta.map((ti, j) => ti - learningRate * mHat[j] / (Math.sqrt(vHat[j]) + epsilon));
  }

  return {
    theta,
    costs,
    iterations,
  };
}

// ============================================
// RMSprop OPTIMIZER
// ============================================

/**
 * Implementa el optimizador RMSprop
 * Root Mean Square Propagation
 *
 * @param X - Matriz de features
 * @param y - Vector de valores reales
 * @param params - Parámetros incluyendo beta
 * @returns Resultado con theta óptimo
 */
export function rmsprop(
  X: number[][],
  y: number[],
  params: GDParams & { beta?: number; epsilon?: number }
): GDResult {
  const {
    learningRate,
    iterations,
    beta = 0.9,
    epsilon = 1e-8,
    tolerance = 1e-6,
  } = params;

  const n = X[0].length;
  let theta = new Array(n).fill(0);
  let s = new Array(n).fill(0); // Promedio de cuadrados del gradiente

  const costs: number[] = [];
  let actualIterations = 0;

  for (let iter = 0; iter < iterations; iter++) {
    // Calcular costo
    const cost = computeCost(X, y, theta);
    costs.push(cost);

    // Verificar convergencia
    if (
      iter > 0 &&
      tolerance &&
      Math.abs(costs[iter] - costs[iter - 1]) < tolerance
    ) {
      actualIterations = iter + 1;
      break;
    }

    // Calcular gradiente
    const gradient = computeGradient(X, y, theta);

    // Actualizar s: s = β×s + (1-β)×g²
    s = s.map((si, j) => beta * si + (1 - beta) * gradient[j] ** 2);

    // Actualizar theta: θ = θ - α × g / √(s + ε)
    theta = theta.map((ti, j) => ti - learningRate * gradient[j] / (Math.sqrt(s[j]) + epsilon));

    actualIterations = iter + 1;
  }

  return {
    theta,
    costs,
    iterations: actualIterations,
  };
}

// ============================================
// Demostración práctica
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 05: Gradient Descent ===\n');

  // Dataset: Predicción de precios de casas basado en tamaño
  const sizes = [50, 80, 100, 120, 150];
  const prices = [100, 160, 200, 240, 300];

  // Añadir columna de bias
  const X = sizes.map(size => [1, size]);
  const y = prices;

  console.log('Dataset:');
  console.log('Tamaños (m²):', sizes);
  console.log('Precios ($k):', prices);
  console.log();

  // Ejemplo 1: Batch Gradient Descent
  console.log('1. Batch Gradient Descent:');
  const result1 = gradientDescent(X, y, {
    learningRate: 0.0001,
    iterations: 1000,
  });
  console.log('θ0 (intercepto):', result1.theta[0].toFixed(2));
  console.log('θ1 (pendiente):', result1.theta[1].toFixed(2));
  console.log('Costo final:', result1.costs[result1.costs.length - 1].toFixed(4));
  console.log('Iteraciones:', result1.iterations);
  console.log('Ecuación: precio =', result1.theta[0].toFixed(2), '+', result1.theta[1].toFixed(2), '× tamaño');
  console.log();

  // Ejemplo 2: Stochastic Gradient Descent
  console.log('2. Stochastic Gradient Descent:');
  const result2 = stochasticGradientDescent(X, y, {
    learningRate: 0.0001,
    iterations: 100,
    epochs: 50,
  });
  console.log('θ0:', result2.theta[0].toFixed(2));
  console.log('θ1:', result2.theta[1].toFixed(2));
  console.log('Costo final:', result2.costs[result2.costs.length - 1].toFixed(4));
  console.log('Épocas:', result2.costs.length);
  console.log();

  // Ejemplo 3: Mini-Batch Gradient Descent
  console.log('3. Mini-Batch Gradient Descent:');
  const result3 = miniBatchGradientDescent(X, y, {
    learningRate: 0.0001,
    iterations: 100,
    batchSize: 2,
  });
  console.log('θ0:', result3.theta[0].toFixed(2));
  console.log('θ1:', result3.theta[1].toFixed(2));
  console.log('Costo final:', result3.costs[result3.costs.length - 1].toFixed(4));
  console.log();

  // Ejemplo 4: Gradient Descent con Momentum
  console.log('4. Gradient Descent con Momentum:');
  const result4 = gradientDescentWithMomentum(X, y, {
    learningRate: 0.0001,
    iterations: 1000,
    momentum: 0.9,
  });
  console.log('θ0:', result4.theta[0].toFixed(2));
  console.log('θ1:', result4.theta[1].toFixed(2));
  console.log('Costo final:', result4.costs[result4.costs.length - 1].toFixed(4));
  console.log('Iteraciones:', result4.iterations);
  console.log();

  // Ejemplo 5: Adam Optimizer
  console.log('5. Adam Optimizer:');
  const result5 = adam(X, y, {
    learningRate: 0.1,
    iterations: 1000,
    beta1: 0.9,
    beta2: 0.999,
  });
  console.log('θ0:', result5.theta[0].toFixed(2));
  console.log('θ1:', result5.theta[1].toFixed(2));
  console.log('Costo final:', result5.costs[result5.costs.length - 1].toFixed(4));
  console.log();

  // Ejemplo 6: RMSprop
  console.log('6. RMSprop Optimizer:');
  const result6 = rmsprop(X, y, {
    learningRate: 0.01,
    iterations: 1000,
    beta: 0.9,
  });
  console.log('θ0:', result6.theta[0].toFixed(2));
  console.log('θ1:', result6.theta[1].toFixed(2));
  console.log('Costo final:', result6.costs[result6.costs.length - 1].toFixed(4));
  console.log();

  // Ejemplo 7: Predicciones
  console.log('7. Predicciones con el modelo (Adam):');
  const testSizes = [60, 90, 110];
  const testX = testSizes.map(size => [1, size]);
  const predictions = predict(testX, result5.theta);

  testSizes.forEach((size, i) => {
    console.log(`  Casa de ${size}m²: $${predictions[i].toFixed(2)}k`);
  });
  console.log();

  // Ejemplo 8: Comparación de convergencia
  console.log('8. Comparación de Convergencia (primeros 10 costos):');
  console.log('Batch GD:', result1.costs.slice(0, 10).map(c => c.toFixed(2)));
  console.log('Momentum:', result4.costs.slice(0, 10).map(c => c.toFixed(2)));
  console.log('Adam:    ', result5.costs.slice(0, 10).map(c => c.toFixed(2)));
}
