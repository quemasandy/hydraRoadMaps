/**
 * Ejercicio 07: Clasificación Logística
 *
 * Este módulo implementa regresión logística para clasificación binaria
 * y multiclase, usando sigmoid y cross-entropy loss.
 */

import {
  standardize,
  applyScaling,
  ScalerParams,
} from '../06-regresion-lineal/linear-regression';

// ============================================
// TIPOS E INTERFACES
// ============================================

/**
 * Modelo de regresión logística
 */
export interface LogisticRegressionModel {
  theta: number[];
  intercept: number;
  scalerParams?: ScalerParams;
}

/**
 * Configuración de entrenamiento
 */
export interface TrainingConfig {
  learningRate: number;
  iterations: number;
  tolerance?: number;
  normalize?: boolean;
  lambda?: number; // Regularización L2
}

/**
 * Resultado del entrenamiento
 */
export interface TrainingResult {
  model: LogisticRegressionModel;
  costs: number[];
  iterations: number;
}

/**
 * Métricas de clasificación
 */
export interface ClassificationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
}

/**
 * Modelo multiclase (One-vs-Rest)
 */
export interface MulticlassModel {
  models: LogisticRegressionModel[];
  classes: number[];
}

// ============================================
// FUNCIÓN SIGMOID
// ============================================

/**
 * Calcula la función sigmoid
 * σ(z) = 1 / (1 + e^-z)
 *
 * @param z - Número o array de números
 * @returns Valor(es) sigmoid entre 0 y 1
 */
export function sigmoid(z: number): number;
export function sigmoid(z: number[]): number[];
export function sigmoid(z: number | number[]): number | number[] {
  const compute = (val: number): number => {
    // Estabilidad numérica: limitar valores extremos
    if (val > 500) return 1;
    if (val < -500) return 0;
    return 1 / (1 + Math.exp(-val));
  };

  if (Array.isArray(z)) {
    return z.map(compute);
  }
  return compute(z);
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Añade columna de bias (1s) a la matriz X
 *
 * @param X - Matriz de features sin bias
 * @returns Matriz con columna de bias
 */
export function addBias(X: number[][]): number[][] {
  return X.map(row => [1, ...row]);
}

/**
 * Calcula el producto X × θ
 *
 * @param X - Matriz de features (m × n)
 * @param theta - Vector de parámetros (n)
 * @returns Vector resultado (m)
 */
function matrixVectorMultiply(X: number[][], theta: number[]): number[] {
  return X.map(row => row.reduce((sum, xi, i) => sum + xi * theta[i], 0));
}

// ============================================
// FUNCIONES DE COSTO
// ============================================

/**
 * Calcula Cross-Entropy Loss (Binary)
 * J(θ) = -(1/m) × Σ[y×log(ŷ) + (1-y)×log(1-ŷ)]
 *
 * @param y_true - Labels reales (0 o 1)
 * @param y_pred_proba - Probabilidades predichas
 * @returns Cross-entropy loss
 */
export function computeCrossEntropy(
  y_true: number[],
  y_pred_proba: number[]
): number {
  const m = y_true.length;
  const epsilon = 1e-15; // Para estabilidad numérica

  let sum = 0;
  for (let i = 0; i < m; i++) {
    // Limitar probabilidades para evitar log(0)
    const p = Math.max(epsilon, Math.min(1 - epsilon, y_pred_proba[i]));

    sum += y_true[i] * Math.log(p) + (1 - y_true[i]) * Math.log(1 - p);
  }

  return -sum / m;
}

/**
 * Calcula Cross-Entropy con regularización L2
 * J(θ) = CrossEntropy + (λ/2m) × Σθj²
 *
 * @param y_true - Labels reales
 * @param y_pred_proba - Probabilidades predichas
 * @param theta - Parámetros del modelo
 * @param lambda - Parámetro de regularización
 * @returns Cross-entropy con regularización
 */
export function computeCrossEntropyWithRegularization(
  y_true: number[],
  y_pred_proba: number[],
  theta: number[],
  lambda: number
): number {
  const m = y_true.length;
  const crossEntropy = computeCrossEntropy(y_true, y_pred_proba);

  // Regularización L2 (sin incluir el bias θ0)
  let regTerm = 0;
  for (let j = 1; j < theta.length; j++) {
    regTerm += theta[j] ** 2;
  }

  return crossEntropy + (lambda / (2 * m)) * regTerm;
}

// ============================================
// CLASIFICACIÓN BINARIA
// ============================================

/**
 * Entrena un modelo de regresión logística binaria
 *
 * @param X - Matriz de features (sin bias)
 * @param y - Labels (0 o 1)
 * @param config - Configuración de entrenamiento
 * @returns Resultado del entrenamiento
 */
export function fitLogisticRegression(
  X: number[][],
  y: number[],
  config: TrainingConfig
): TrainingResult {
  const {
    learningRate,
    iterations,
    tolerance = 1e-6,
    normalize: shouldNormalize = true,
    lambda = 0,
  } = config;

  // Validar que y contenga solo 0 y 1
  if (!y.every(label => label === 0 || label === 1)) {
    throw new Error('y debe contener solo valores 0 o 1');
  }

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
  const m = y.length;
  const n = X_bias[0].length;

  // Inicializar theta con ceros
  let theta = new Array(n).fill(0);

  const costs: number[] = [];
  let actualIterations = 0;

  // Gradient descent
  for (let iter = 0; iter < iterations; iter++) {
    // Calcular z = X × θ
    const z = matrixVectorMultiply(X_bias, theta);

    // Calcular ŷ = σ(z)
    const y_pred = sigmoid(z) as number[];

    // Calcular costo
    const cost = lambda > 0
      ? computeCrossEntropyWithRegularization(y, y_pred, theta, lambda)
      : computeCrossEntropy(y, y_pred);

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
    const errors = y_pred.map((pred, i) => pred - y[i]);
    const gradient: number[] = [];

    for (let j = 0; j < n; j++) {
      let grad = 0;
      for (let i = 0; i < m; i++) {
        grad += errors[i] * X_bias[i][j];
      }
      grad /= m;

      // Añadir regularización (excepto para bias)
      if (lambda > 0 && j > 0) {
        grad += (lambda / m) * theta[j];
      }

      gradient.push(grad);
    }

    // Actualizar theta
    theta = theta.map((t, j) => t - learningRate * gradient[j]);

    actualIterations = iter + 1;
  }

  return {
    model: {
      theta,
      intercept: theta[0],
      scalerParams,
    },
    costs,
    iterations: actualIterations,
  };
}

// ============================================
// PREDICCIONES
// ============================================

/**
 * Predice probabilidades P(y=1) para ejemplos
 *
 * @param X - Matriz de features (sin bias)
 * @param model - Modelo entrenado
 * @returns Vector de probabilidades
 */
export function predictProba(
  X: number[][],
  model: LogisticRegressionModel
): number[] {
  // Aplicar scaling si el modelo lo requiere
  let X_scaled = X;
  if (model.scalerParams) {
    X_scaled = applyScaling(X, model.scalerParams);
  }

  // Añadir bias
  const X_bias = addBias(X_scaled);

  // Calcular z = X × θ
  const z = matrixVectorMultiply(X_bias, model.theta);

  // Retornar σ(z)
  return sigmoid(z) as number[];
}

/**
 * Predice clases (0 o 1) para ejemplos
 *
 * @param X - Matriz de features
 * @param model - Modelo entrenado
 * @param threshold - Umbral de decisión (default: 0.5)
 * @returns Vector de clases predichas
 */
export function predictBinary(
  X: number[][],
  model: LogisticRegressionModel,
  threshold: number = 0.5
): number[] {
  const probas = predictProba(X, model);
  return probas.map(p => (p >= threshold ? 1 : 0));
}

// ============================================
// MÉTRICAS DE CLASIFICACIÓN
// ============================================

/**
 * Calcula la matriz de confusión
 *
 * @param y_true - Labels reales
 * @param y_pred - Labels predichos
 * @returns Matriz [[TN, FP], [FN, TP]]
 */
export function computeConfusionMatrix(
  y_true: number[],
  y_pred: number[]
): number[][] {
  let TP = 0;
  let TN = 0;
  let FP = 0;
  let FN = 0;

  for (let i = 0; i < y_true.length; i++) {
    if (y_true[i] === 1 && y_pred[i] === 1) TP++;
    else if (y_true[i] === 0 && y_pred[i] === 0) TN++;
    else if (y_true[i] === 0 && y_pred[i] === 1) FP++;
    else if (y_true[i] === 1 && y_pred[i] === 0) FN++;
  }

  return [
    [TN, FP],
    [FN, TP],
  ];
}

/**
 * Calcula accuracy
 *
 * @param y_true - Labels reales
 * @param y_pred - Labels predichos
 * @returns Accuracy (0 a 1)
 */
export function computeAccuracy(y_true: number[], y_pred: number[]): number {
  const correct = y_true.filter((y, i) => y === y_pred[i]).length;
  return correct / y_true.length;
}

/**
 * Calcula precision
 *
 * @param y_true - Labels reales
 * @param y_pred - Labels predichos
 * @returns Precision (0 a 1)
 */
export function computePrecision(y_true: number[], y_pred: number[]): number {
  const cm = computeConfusionMatrix(y_true, y_pred);
  const TP = cm[1][1];
  const FP = cm[0][1];

  if (TP + FP === 0) return 0;
  return TP / (TP + FP);
}

/**
 * Calcula recall (sensibilidad)
 *
 * @param y_true - Labels reales
 * @param y_pred - Labels predichos
 * @returns Recall (0 a 1)
 */
export function computeRecall(y_true: number[], y_pred: number[]): number {
  const cm = computeConfusionMatrix(y_true, y_pred);
  const TP = cm[1][1];
  const FN = cm[1][0];

  if (TP + FN === 0) return 0;
  return TP / (TP + FN);
}

/**
 * Calcula F1-score
 *
 * @param y_true - Labels reales
 * @param y_pred - Labels predichos
 * @returns F1-score (0 a 1)
 */
export function computeF1Score(y_true: number[], y_pred: number[]): number {
  const precision = computePrecision(y_true, y_pred);
  const recall = computeRecall(y_true, y_pred);

  if (precision + recall === 0) return 0;
  return (2 * precision * recall) / (precision + recall);
}

/**
 * Calcula todas las métricas de clasificación
 *
 * @param y_true - Labels reales
 * @param y_pred - Labels predichos
 * @returns Objeto con todas las métricas
 */
export function computeMetrics(
  y_true: number[],
  y_pred: number[]
): ClassificationMetrics {
  return {
    accuracy: computeAccuracy(y_true, y_pred),
    precision: computePrecision(y_true, y_pred),
    recall: computeRecall(y_true, y_pred),
    f1Score: computeF1Score(y_true, y_pred),
    confusionMatrix: computeConfusionMatrix(y_true, y_pred),
  };
}

// ============================================
// CLASIFICACIÓN MULTICLASE (ONE-VS-REST)
// ============================================

/**
 * Entrena un modelo multiclase usando One-vs-Rest
 *
 * @param X - Matriz de features
 * @param y - Labels (pueden ser 0, 1, 2, ...)
 * @param config - Configuración de entrenamiento
 * @returns Modelo multiclase
 */
export function fitOneVsRest(
  X: number[][],
  y: number[],
  config: TrainingConfig
): MulticlassModel {
  // Obtener clases únicas
  const classes = Array.from(new Set(y)).sort((a, b) => a - b);

  const models: LogisticRegressionModel[] = [];

  // Entrenar un modelo por cada clase
  for (const targetClass of classes) {
    // Crear labels binarios: 1 si es la clase target, 0 si no
    const y_binary = y.map(label => (label === targetClass ? 1 : 0));

    // Entrenar modelo binario
    const result = fitLogisticRegression(X, y_binary, config);
    models.push(result.model);
  }

  return {
    models,
    classes,
  };
}

/**
 * Predice clases usando modelo One-vs-Rest
 *
 * @param X - Matriz de features
 * @param model - Modelo multiclase
 * @returns Vector de clases predichas
 */
export function predictMulticlass(
  X: number[][],
  model: MulticlassModel
): number[] {
  const m = X.length;
  const numClasses = model.classes.length;

  // Obtener probabilidades de cada modelo
  const allProbas: number[][] = model.models.map(m => predictProba(X, m));

  // Para cada ejemplo, elegir la clase con mayor probabilidad
  const predictions: number[] = [];

  for (let i = 0; i < m; i++) {
    let maxProba = -Infinity;
    let bestClass = model.classes[0];

    for (let k = 0; k < numClasses; k++) {
      if (allProbas[k][i] > maxProba) {
        maxProba = allProbas[k][i];
        bestClass = model.classes[k];
      }
    }

    predictions.push(bestClass);
  }

  return predictions;
}

/**
 * Predice probabilidades para cada clase
 *
 * @param X - Matriz de features
 * @param model - Modelo multiclase
 * @returns Matriz de probabilidades (m × k)
 */
export function predictMulticlassProba(
  X: number[][],
  model: MulticlassModel
): number[][] {
  const m = X.length;
  const numClasses = model.classes.length;

  // Obtener probabilidades de cada modelo
  const allProbas: number[][] = model.models.map(m => predictProba(X, m));

  // Transponer para tener formato (m × k)
  const result: number[][] = [];

  for (let i = 0; i < m; i++) {
    const probas: number[] = [];
    for (let k = 0; k < numClasses; k++) {
      probas.push(allProbas[k][i]);
    }
    result.push(probas);
  }

  return result;
}

// ============================================
// DECISION BOUNDARY
// ============================================

/**
 * Calcula puntos del decision boundary para 2 features
 * Decision boundary: θ0 + θ1×x1 + θ2×x2 = 0
 * Resolvemos para x2: x2 = -(θ0 + θ1×x1) / θ2
 *
 * @param model - Modelo entrenado
 * @param x1_range - Rango de x1 [min, max]
 * @param num_points - Número de puntos a generar
 * @returns Array de puntos [x1, x2]
 */
export function getDecisionBoundary(
  model: LogisticRegressionModel,
  x1_range: [number, number],
  num_points: number = 100
): number[][] {
  if (model.theta.length !== 3) {
    throw new Error('Decision boundary solo funciona con 2 features');
  }

  const theta0 = model.theta[0];
  const theta1 = model.theta[1];
  const theta2 = model.theta[2];

  if (theta2 === 0) {
    throw new Error('theta2 no puede ser 0 para calcular decision boundary');
  }

  const [x1_min, x1_max] = x1_range;
  const step = (x1_max - x1_min) / (num_points - 1);

  const points: number[][] = [];

  for (let i = 0; i < num_points; i++) {
    const x1 = x1_min + i * step;
    const x2 = -(theta0 + theta1 * x1) / theta2;
    points.push([x1, x2]);
  }

  return points;
}

// ============================================
// Demostración práctica
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 07: Clasificación Logística ===\n');

  // Dataset: Admisión basado en notas de exámenes
  const exam1 = [34, 30, 35, 60, 79, 45, 61, 75, 76, 84, 95, 50];
  const exam2 = [78, 43, 72, 86, 75, 56, 96, 46, 87, 43, 38, 72];
  const admitted = [0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0];

  const X = exam1.map((e1, i) => [e1, exam2[i]]);
  const y = admitted;

  console.log('Dataset:');
  console.log('Ejemplos:', X.length);
  console.log('Admitidos:', admitted.filter(a => a === 1).length);
  console.log('Rechazados:', admitted.filter(a => a === 0).length);
  console.log();

  // Ejemplo 1: Función Sigmoid
  console.log('1. Función Sigmoid:');
  console.log('σ(0) =', sigmoid(0));
  console.log('σ(2) =', sigmoid(2).toFixed(4));
  console.log('σ(-2) =', sigmoid(-2).toFixed(4));
  console.log('σ([0, 1, -1]) =', (sigmoid([0, 1, -1]) as number[]).map(v => v.toFixed(3)));
  console.log();

  // Ejemplo 2: Entrenar modelo
  console.log('2. Entrenar Regresión Logística:');
  const result = fitLogisticRegression(X, y, {
    learningRate: 0.01,
    iterations: 1000,
    normalize: true,
  });

  console.log('Iteraciones:', result.iterations);
  console.log('Costo inicial:', result.costs[0].toFixed(4));
  console.log('Costo final:', result.costs[result.costs.length - 1].toFixed(4));
  console.log();

  // Ejemplo 3: Predicciones
  console.log('3. Predicciones:');
  const probas = predictProba(X, result.model);
  const predictions = predictBinary(X, result.model);

  console.log('Primeros 5 ejemplos:');
  for (let i = 0; i < 5; i++) {
    console.log(
      `  Exam1=${exam1[i]}, Exam2=${exam2[i]}: ` +
      `P(admitido)=${probas[i].toFixed(3)}, ` +
      `Predicción=${predictions[i]}, ` +
      `Real=${y[i]}`
    );
  }
  console.log();

  // Ejemplo 4: Métricas
  console.log('4. Métricas de Clasificación:');
  const metrics = computeMetrics(y, predictions);
  console.log('Accuracy:', metrics.accuracy.toFixed(4));
  console.log('Precision:', metrics.precision.toFixed(4));
  console.log('Recall:', metrics.recall.toFixed(4));
  console.log('F1-Score:', metrics.f1Score.toFixed(4));
  console.log('Confusion Matrix:');
  console.log('  [[TN, FP], [FN, TP]]');
  console.log(' ', metrics.confusionMatrix);
  console.log();

  // Ejemplo 5: Nuevas predicciones
  console.log('5. Predicción para nuevos estudiantes:');
  const newStudents = [
    [45, 85],
    [60, 60],
    [80, 90],
  ];

  const newProbas = predictProba(newStudents, result.model);
  const newPreds = predictBinary(newStudents, result.model);

  newStudents.forEach((student, i) => {
    console.log(
      `  Exam1=${student[0]}, Exam2=${student[1]}: ` +
      `P(admitido)=${newProbas[i].toFixed(3)}, ` +
      `Decisión=${newPreds[i] === 1 ? 'Admitir' : 'Rechazar'}`
    );
  });
  console.log();

  // Ejemplo 6: Regularización
  console.log('6. Comparación con Regularización:');
  const resultReg = fitLogisticRegression(X, y, {
    learningRate: 0.01,
    iterations: 1000,
    normalize: true,
    lambda: 1,
  });

  const predsReg = predictBinary(X, resultReg.model);
  const metricsReg = computeMetrics(y, predsReg);

  console.log('Sin regularización - Accuracy:', metrics.accuracy.toFixed(4));
  console.log('Con regularización - Accuracy:', metricsReg.accuracy.toFixed(4));
  console.log();

  // Ejemplo 7: Clasificación Multiclase
  console.log('7. Clasificación Multiclase (One-vs-Rest):');

  // Dataset simple de 3 clases
  const X_multi = [
    [1, 1], [1.5, 1.8], [2, 1.2],  // Clase 0
    [5, 5], [5.5, 5.2], [5.8, 5.5], // Clase 1
    [9, 1], [9.2, 1.5], [9.5, 1.2], // Clase 2
  ];
  const y_multi = [0, 0, 0, 1, 1, 1, 2, 2, 2];

  const multiModel = fitOneVsRest(X_multi, y_multi, {
    learningRate: 0.1,
    iterations: 500,
    normalize: true,
  });

  console.log('Modelos entrenados:', multiModel.models.length);
  console.log('Clases:', multiModel.classes);

  const multiPreds = predictMulticlass(X_multi, multiModel);
  const multiAccuracy = computeAccuracy(y_multi, multiPreds);

  console.log('Accuracy:', multiAccuracy.toFixed(4));
  console.log('Predicciones:', multiPreds);
  console.log('Real:        ', y_multi);
  console.log();

  // Ejemplo 8: Convergencia del costo
  console.log('8. Convergencia del costo (primeros 10 pasos):');
  console.log(result.costs.slice(0, 10).map(c => c.toFixed(4)));
}
