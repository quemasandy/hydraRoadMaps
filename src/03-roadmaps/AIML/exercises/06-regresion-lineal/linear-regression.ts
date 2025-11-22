/**
 * Ejercicio 06: Regresión Lineal
 *
 * Este módulo implementa algoritmos de regresión lineal desde cero,
 * usando tanto la ecuación normal como gradient descent.
 */

import {
  gradientDescent,
  GDParams,
  GDResult,
} from '../05-gradient-descent/gradient-descent';

// ============================================
// TIPOS E INTERFACES
// ============================================

/**
 * Modelo de regresión lineal entrenado
 */
export interface LinearRegressionModel {
  theta: number[];
  intercept: number;
  scalerParams?: ScalerParams;
}

/**
 * Configuración para Gradient Descent
 */
export interface GDConfig {
  learningRate: number;
  iterations: number;
  tolerance?: number;
  normalize?: boolean;
}

/**
 * Resultado del entrenamiento
 */
export interface TrainingResult {
  model: LinearRegressionModel;
  costs: number[];
  iterations: number;
}

/**
 * Parámetros del scaler
 */
export interface ScalerParams {
  mean: number[];
  std: number[];
  min?: number[];
  max?: number[];
}

/**
 * División de datos en train/test
 */
export interface TrainTestSplit {
  X_train: number[][];
  X_test: number[][];
  y_train: number[];
  y_test: number[];
}

// ============================================
// ÁLGEBRA LINEAL BÁSICA
// ============================================

/**
 * Transpone una matriz
 *
 * @param A - Matriz a transponer (m × n)
 * @returns Matriz transpuesta (n × m)
 */
export function transpose(A: number[][]): number[][] {
  if (A.length === 0) return [];

  const m = A.length;
  const n = A[0].length;

  const result: number[][] = Array(n)
    .fill(0)
    .map(() => Array(m).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      result[j][i] = A[i][j];
    }
  }

  return result;
}

/**
 * Multiplica dos matrices
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
      `Dimensiones incompatibles: ${m}×${n} y ${B.length}×${p}`
    );
  }

  const result: number[][] = Array(m)
    .fill(0)
    .map(() => Array(p).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }

  return result;
}

/**
 * Invierte una matriz usando eliminación de Gauss-Jordan
 *
 * @param A - Matriz cuadrada a invertir (n × n)
 * @returns Matriz inversa (n × n)
 */
export function invertMatrix(A: number[][]): number[][] {
  const n = A.length;

  // Verificar que es cuadrada
  if (A.some(row => row.length !== n)) {
    throw new Error('La matriz debe ser cuadrada');
  }

  // Crear matriz aumentada [A | I]
  const augmented = A.map((row, i) => [
    ...row,
    ...Array(n)
      .fill(0)
      .map((_, j) => (i === j ? 1 : 0)),
  ]);

  // Eliminación de Gauss-Jordan
  for (let i = 0; i < n; i++) {
    // Encontrar el pivote
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }

    // Intercambiar filas
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

    // Verificar que el pivote no sea cero
    if (Math.abs(augmented[i][i]) < 1e-10) {
      throw new Error('Matriz singular, no invertible');
    }

    // Escalar fila para que el pivote sea 1
    const pivot = augmented[i][i];
    for (let j = 0; j < 2 * n; j++) {
      augmented[i][j] /= pivot;
    }

    // Eliminar columna en otras filas
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = augmented[k][i];
        for (let j = 0; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
  }

  // Extraer la matriz inversa (parte derecha)
  return augmented.map(row => row.slice(n));
}

/**
 * Multiplica matriz por vector
 *
 * @param A - Matriz (m × n)
 * @param v - Vector (n)
 * @returns Vector resultado (m)
 */
export function matrixVectorMultiply(A: number[][], v: number[]): number[] {
  const m = A.length;
  const n = A[0].length;

  if (v.length !== n) {
    throw new Error(
      `Dimensiones incompatibles: matriz ${m}×${n}, vector ${v.length}`
    );
  }

  const result: number[] = Array(m).fill(0);

  for (let i = 0; i < m; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += A[i][j] * v[j];
    }
    result[i] = sum;
  }

  return result;
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
// FEATURE SCALING
// ============================================

/**
 * Standardiza features (Z-score normalization)
 * x_std = (x - μ) / σ
 *
 * @param X - Matriz de features
 * @returns Objeto con matriz escalada y parámetros
 */
export function standardize(X: number[][]): {
  X_scaled: number[][];
  params: ScalerParams;
} {
  if (X.length === 0) {
    return { X_scaled: [], params: { mean: [], std: [] } };
  }

  const m = X.length;
  const n = X[0].length;

  // Calcular media y desviación estándar por columna
  const mean: number[] = [];
  const std: number[] = [];

  for (let j = 0; j < n; j++) {
    // Media
    let sum = 0;
    for (let i = 0; i < m; i++) {
      sum += X[i][j];
    }
    mean[j] = sum / m;

    // Desviación estándar
    let sumSquares = 0;
    for (let i = 0; i < m; i++) {
      sumSquares += Math.pow(X[i][j] - mean[j], 2);
    }
    std[j] = Math.sqrt(sumSquares / m);

    // Evitar división por cero
    if (std[j] === 0) {
      std[j] = 1;
    }
  }

  // Aplicar standardization
  const X_scaled = X.map(row =>
    row.map((val, j) => (val - mean[j]) / std[j])
  );

  return {
    X_scaled,
    params: { mean, std },
  };
}

/**
 * Normaliza features (Min-Max scaling)
 * x_norm = (x - min) / (max - min)
 *
 * @param X - Matriz de features
 * @returns Objeto con matriz escalada y parámetros
 */
export function normalize(X: number[][]): {
  X_scaled: number[][];
  params: ScalerParams;
} {
  if (X.length === 0) {
    return {
      X_scaled: [],
      params: { mean: [], std: [], min: [], max: [] },
    };
  }

  const m = X.length;
  const n = X[0].length;

  // Calcular min y max por columna
  const min: number[] = [];
  const max: number[] = [];

  for (let j = 0; j < n; j++) {
    min[j] = X[0][j];
    max[j] = X[0][j];

    for (let i = 1; i < m; i++) {
      if (X[i][j] < min[j]) min[j] = X[i][j];
      if (X[i][j] > max[j]) max[j] = X[i][j];
    }
  }

  // Aplicar normalization
  const X_scaled = X.map(row =>
    row.map((val, j) => {
      const range = max[j] - min[j];
      return range === 0 ? 0 : (val - min[j]) / range;
    })
  );

  return {
    X_scaled,
    params: { mean: [], std: [], min, max },
  };
}

/**
 * Aplica scaling con parámetros existentes
 *
 * @param X - Matriz de features
 * @param params - Parámetros del scaler
 * @returns Matriz escalada
 */
export function applyScaling(X: number[][], params: ScalerParams): number[][] {
  if (params.min && params.max) {
    // Min-Max normalization
    return X.map(row =>
      row.map((val, j) => {
        const range = params.max![j] - params.min![j];
        return range === 0 ? 0 : (val - params.min![j]) / range;
      })
    );
  } else {
    // Standardization
    return X.map(row =>
      row.map((val, j) => {
        const std = params.std[j] === 0 ? 1 : params.std[j];
        return (val - params.mean[j]) / std;
      })
    );
  }
}

// ============================================
// ECUACIÓN NORMAL
// ============================================

/**
 * Entrena modelo usando la Ecuación Normal
 * θ = (X^T × X)^-1 × X^T × y
 *
 * @param X - Matriz de features (sin bias)
 * @param y - Vector de targets
 * @returns Modelo entrenado
 */
export function fitNormalEquation(
  X: number[][],
  y: number[]
): LinearRegressionModel {
  // Validar dimensiones
  if (X.length !== y.length) {
    throw new Error('X e y deben tener la misma cantidad de muestras');
  }

  if (X.length === 0) {
    throw new Error('X no puede estar vacío');
  }

  // Añadir columna de bias
  const X_bias = addBias(X);

  // Calcular X^T
  const XT = transpose(X_bias);

  // Calcular X^T × X
  const XTX = matrixMultiply(XT, X_bias);

  // Calcular (X^T × X)^-1
  const XTX_inv = invertMatrix(XTX);

  // Calcular X^T × y
  const XTy = matrixVectorMultiply(XT, y);

  // Calcular θ = (X^T × X)^-1 × X^T × y
  const theta = matrixVectorMultiply(XTX_inv, XTy);

  return {
    theta,
    intercept: theta[0],
  };
}

// ============================================
// GRADIENT DESCENT
// ============================================

/**
 * Entrena modelo usando Gradient Descent
 *
 * @param X - Matriz de features (sin bias)
 * @param y - Vector de targets
 * @param config - Configuración de GD
 * @returns Resultado del entrenamiento
 */
export function fitGradientDescent(
  X: number[][],
  y: number[],
  config: GDConfig
): TrainingResult {
  const { learningRate, iterations, tolerance, normalize: shouldNormalize = true } = config;

  // Normalizar features si es necesario
  let X_train = X;
  let scalerParams: ScalerParams | undefined;

  if (shouldNormalize) {
    const scaled = standardize(X);
    X_train = scaled.X_scaled;
    scalerParams = scaled.params;
  }

  // Añadir columna de bias
  const X_bias = addBias(X_train);

  // Ejecutar gradient descent
  const gdResult = gradientDescent(X_bias, y, {
    learningRate,
    iterations,
    tolerance,
  });

  return {
    model: {
      theta: gdResult.theta,
      intercept: gdResult.theta[0],
      scalerParams,
    },
    costs: gdResult.costs,
    iterations: gdResult.iterations,
  };
}

// ============================================
// PREDICCIONES
// ============================================

/**
 * Hace predicciones para múltiples ejemplos
 *
 * @param X - Matriz de features (sin bias)
 * @param model - Modelo entrenado
 * @returns Vector de predicciones
 */
export function predict(
  X: number[][],
  model: LinearRegressionModel
): number[] {
  // Aplicar scaling si el modelo lo requiere
  let X_scaled = X;
  if (model.scalerParams) {
    X_scaled = applyScaling(X, model.scalerParams);
  }

  // Añadir bias y predecir
  const X_bias = addBias(X_scaled);

  return X_bias.map(row => {
    return row.reduce((sum, xi, i) => sum + xi * model.theta[i], 0);
  });
}

/**
 * Hace predicción para un solo ejemplo
 *
 * @param x - Vector de features
 * @param model - Modelo entrenado
 * @returns Predicción
 */
export function predictOne(x: number[], model: LinearRegressionModel): number {
  return predict([x], model)[0];
}

// ============================================
// MÉTRICAS DE EVALUACIÓN
// ============================================

/**
 * Calcula Mean Squared Error
 * MSE = (1/m) × Σ(ŷi - yi)²
 *
 * @param y_true - Valores reales
 * @param y_pred - Predicciones
 * @returns MSE
 */
export function computeMSE(y_true: number[], y_pred: number[]): number {
  if (y_true.length !== y_pred.length) {
    throw new Error('y_true e y_pred deben tener la misma longitud');
  }

  const m = y_true.length;
  let sum = 0;

  for (let i = 0; i < m; i++) {
    sum += Math.pow(y_pred[i] - y_true[i], 2);
  }

  return sum / m;
}

/**
 * Calcula Root Mean Squared Error
 * RMSE = √MSE
 *
 * @param y_true - Valores reales
 * @param y_pred - Predicciones
 * @returns RMSE
 */
export function computeRMSE(y_true: number[], y_pred: number[]): number {
  return Math.sqrt(computeMSE(y_true, y_pred));
}

/**
 * Calcula Mean Absolute Error
 * MAE = (1/m) × Σ|ŷi - yi|
 *
 * @param y_true - Valores reales
 * @param y_pred - Predicciones
 * @returns MAE
 */
export function computeMAE(y_true: number[], y_pred: number[]): number {
  if (y_true.length !== y_pred.length) {
    throw new Error('y_true e y_pred deben tener la misma longitud');
  }

  const m = y_true.length;
  let sum = 0;

  for (let i = 0; i < m; i++) {
    sum += Math.abs(y_pred[i] - y_true[i]);
  }

  return sum / m;
}

/**
 * Calcula R² (Coefficient of Determination)
 * R² = 1 - (SS_res / SS_tot)
 *
 * @param y_true - Valores reales
 * @param y_pred - Predicciones
 * @returns R²
 */
export function computeR2(y_true: number[], y_pred: number[]): number {
  if (y_true.length !== y_pred.length) {
    throw new Error('y_true e y_pred deben tener la misma longitud');
  }

  const m = y_true.length;

  // Calcular media de y_true
  const mean = y_true.reduce((sum, y) => sum + y, 0) / m;

  // SS_tot = Σ(yi - ȳ)²
  let ss_tot = 0;
  for (let i = 0; i < m; i++) {
    ss_tot += Math.pow(y_true[i] - mean, 2);
  }

  // SS_res = Σ(yi - ŷi)²
  let ss_res = 0;
  for (let i = 0; i < m; i++) {
    ss_res += Math.pow(y_true[i] - y_pred[i], 2);
  }

  // R² = 1 - (SS_res / SS_tot)
  return 1 - ss_res / ss_tot;
}

// ============================================
// REGULARIZACIÓN
// ============================================

/**
 * Entrena modelo usando Ridge Regression (L2)
 * θ = (X^T×X + λ×I)^-1 × X^T × y
 *
 * @param X - Matriz de features (sin bias)
 * @param y - Vector de targets
 * @param lambda - Parámetro de regularización
 * @returns Modelo entrenado
 */
export function fitRidge(
  X: number[][],
  y: number[],
  lambda: number
): LinearRegressionModel {
  // Añadir bias
  const X_bias = addBias(X);

  // X^T
  const XT = transpose(X_bias);

  // X^T × X
  const XTX = matrixMultiply(XT, X_bias);

  // Crear matriz identidad λ×I (sin regularizar el bias)
  const n = XTX.length;
  const lambdaI = Array(n)
    .fill(0)
    .map((_, i) =>
      Array(n)
        .fill(0)
        .map((_, j) => (i === j && i > 0 ? lambda : 0))
    );

  // X^T×X + λ×I
  const XTX_lambda = XTX.map((row, i) => row.map((val, j) => val + lambdaI[i][j]));

  // (X^T×X + λ×I)^-1
  const XTX_lambda_inv = invertMatrix(XTX_lambda);

  // X^T × y
  const XTy = matrixVectorMultiply(XT, y);

  // θ = (X^T×X + λ×I)^-1 × X^T × y
  const theta = matrixVectorMultiply(XTX_lambda_inv, XTy);

  return {
    theta,
    intercept: theta[0],
  };
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Divide datos en train y test
 *
 * @param X - Matriz de features
 * @param y - Vector de targets
 * @param testSize - Proporción de test (0-1)
 * @param shuffle - Mezclar antes de dividir
 * @returns Datos divididos
 */
export function trainTestSplit(
  X: number[][],
  y: number[],
  testSize: number = 0.2,
  shuffle: boolean = true
): TrainTestSplit {
  const m = X.length;
  const testCount = Math.floor(m * testSize);
  const trainCount = m - testCount;

  // Crear índices
  let indices = Array.from({ length: m }, (_, i) => i);

  // Mezclar si es necesario
  if (shuffle) {
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  }

  // Dividir índices
  const trainIndices = indices.slice(0, trainCount);
  const testIndices = indices.slice(trainCount);

  return {
    X_train: trainIndices.map(i => X[i]),
    X_test: testIndices.map(i => X[i]),
    y_train: trainIndices.map(i => y[i]),
    y_test: testIndices.map(i => y[i]),
  };
}

// ============================================
// Demostración práctica
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 06: Regresión Lineal ===\n');

  // Dataset: Predicción de precios de casas
  const sizes = [50, 80, 100, 120, 150, 180, 200];
  const rooms = [1, 2, 2, 3, 3, 4, 4];
  const prices = [100, 160, 200, 240, 300, 360, 400];

  const X = sizes.map((size, i) => [size, rooms[i]]);
  const y = prices;

  console.log('Dataset:');
  console.log('Tamaños (m²):', sizes);
  console.log('Habitaciones:', rooms);
  console.log('Precios ($k):', prices);
  console.log();

  // Dividir en train/test
  const { X_train, X_test, y_train, y_test } = trainTestSplit(X, y, 0.2, true);

  console.log('División de datos:');
  console.log('Train:', X_train.length, 'ejemplos');
  console.log('Test:', X_test.length, 'ejemplos');
  console.log();

  // Ejemplo 1: Ecuación Normal
  console.log('1. Ecuación Normal:');
  const modelNormal = fitNormalEquation(X_train, y_train);
  console.log('θ0 (intercepto):', modelNormal.theta[0].toFixed(2));
  console.log('θ1 (tamaño):', modelNormal.theta[1].toFixed(2));
  console.log('θ2 (habitaciones):', modelNormal.theta[2].toFixed(2));

  const y_pred_normal = predict(X_test, modelNormal);
  const r2_normal = computeR2(y_test, y_pred_normal);
  const rmse_normal = computeRMSE(y_test, y_pred_normal);

  console.log('R² en test:', r2_normal.toFixed(4));
  console.log('RMSE en test:', rmse_normal.toFixed(2));
  console.log();

  // Ejemplo 2: Gradient Descent
  console.log('2. Gradient Descent:');
  const resultGD = fitGradientDescent(X_train, y_train, {
    learningRate: 0.01,
    iterations: 1000,
    normalize: true,
  });

  console.log('θ0 (intercepto):', resultGD.model.theta[0].toFixed(2));
  console.log('θ1 (tamaño normalizado):', resultGD.model.theta[1].toFixed(2));
  console.log('θ2 (habitaciones normalizadas):', resultGD.model.theta[2].toFixed(2));
  console.log('Iteraciones:', resultGD.iterations);
  console.log('Costo final:', resultGD.costs[resultGD.costs.length - 1].toFixed(4));

  const y_pred_gd = predict(X_test, resultGD.model);
  const r2_gd = computeR2(y_test, y_pred_gd);
  const rmse_gd = computeRMSE(y_test, y_pred_gd);

  console.log('R² en test:', r2_gd.toFixed(4));
  console.log('RMSE en test:', rmse_gd.toFixed(2));
  console.log();

  // Ejemplo 3: Ridge Regression
  console.log('3. Ridge Regression (λ=10):');
  const modelRidge = fitRidge(X_train, y_train, 10);
  console.log('θ0:', modelRidge.theta[0].toFixed(2));
  console.log('θ1:', modelRidge.theta[1].toFixed(2));
  console.log('θ2:', modelRidge.theta[2].toFixed(2));

  const y_pred_ridge = predict(X_test, modelRidge);
  const r2_ridge = computeR2(y_test, y_pred_ridge);

  console.log('R² en test:', r2_ridge.toFixed(4));
  console.log();

  // Ejemplo 4: Predicciones
  console.log('4. Predicciones para casas nuevas (modelo Normal Equation):');
  const testCases = [
    [90, 2],
    [110, 2],
    [140, 3],
  ];

  testCases.forEach(([size, rooms]) => {
    const pred = predictOne([size, rooms], modelNormal);
    console.log(`  Casa de ${size}m², ${rooms} hab: $${pred.toFixed(2)}k`);
  });
  console.log();

  // Ejemplo 5: Comparación de métricas
  console.log('5. Comparación de métricas en test:');
  console.log('┌─────────────────┬─────────┬──────────┬──────────┐');
  console.log('│ Método          │ R²      │ RMSE     │ MAE      │');
  console.log('├─────────────────┼─────────┼──────────┼──────────┤');

  const metrics = [
    ['Normal Eq.', y_pred_normal],
    ['Gradient Desc.', y_pred_gd],
    ['Ridge', y_pred_ridge],
  ];

  metrics.forEach(([name, preds]) => {
    const r2 = computeR2(y_test, preds as number[]);
    const rmse = computeRMSE(y_test, preds as number[]);
    const mae = computeMAE(y_test, preds as number[]);
    console.log(
      `│ ${(name as string).padEnd(15)} │ ${r2.toFixed(4)} │ ${rmse.toFixed(4).padStart(8)} │ ${mae.toFixed(4).padStart(8)} │`
    );
  });

  console.log('└─────────────────┴─────────┴──────────┴──────────┘');
  console.log();

  // Ejemplo 6: Convergencia de Gradient Descent
  console.log('6. Convergencia del costo (primeros 10 pasos):');
  console.log(resultGD.costs.slice(0, 10).map(c => c.toFixed(2)));
  console.log();

  // Ejemplo 7: Feature Scaling
  console.log('7. Feature Scaling:');
  const sampleX = [[50, 1], [100, 2], [150, 3]];

  const { X_scaled: standardized, params: stdParams } = standardize(sampleX);
  console.log('Standardized:');
  console.log('  Mean:', stdParams.mean.map(m => m.toFixed(2)));
  console.log('  Std:', stdParams.std.map(s => s.toFixed(2)));
  console.log('  Scaled:', standardized.map(row => row.map(v => v.toFixed(2))));
  console.log();

  const { X_scaled: normalized, params: normParams } = normalize(sampleX);
  console.log('Normalized:');
  console.log('  Min:', normParams.min?.map(m => m.toFixed(2)));
  console.log('  Max:', normParams.max?.map(m => m.toFixed(2)));
  console.log('  Scaled:', normalized.map(row => row.map(v => v.toFixed(2))));
}
