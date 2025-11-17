/**
 * Ejercicio 08: Clustering K-Means
 *
 * Implementación del algoritmo K-Means para clustering no supervisado.
 */

// ============================================
// TIPOS E INTERFACES
// ============================================

/**
 * Resultado de K-Means
 */
export interface KMeansResult {
  centroids: number[][];
  labels: number[];
  inertia: number;
  iterations: number;
}

/**
 * Resultado del método del codo
 */
export interface ElbowResult {
  K_values: number[];
  inertias: number[];
  optimalK: number;
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Calcula distancia euclidiana entre dos puntos
 */
export function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

/**
 * Inicializa centroides aleatoriamente
 */
function initializeRandomCentroids(X: number[][], K: number): number[][] {
  const m = X.length;
  const indices = new Set<number>();

  while (indices.size < K) {
    indices.add(Math.floor(Math.random() * m));
  }

  return Array.from(indices).map(i => [...X[i]]);
}

/**
 * Inicializa centroides con K-Means++
 */
function initializeKMeansPlusPlus(X: number[][], K: number): number[][] {
  const m = X.length;
  const centroids: number[][] = [];

  // 1. Elegir primer centroide aleatoriamente
  const firstIdx = Math.floor(Math.random() * m);
  centroids.push([...X[firstIdx]]);

  // 2. Elegir K-1 centroides restantes
  for (let k = 1; k < K; k++) {
    // Calcular distancia al centroide más cercano para cada punto
    const distances: number[] = X.map(point => {
      let minDist = Infinity;
      for (const centroid of centroids) {
        const dist = euclideanDistance(point, centroid);
        if (dist < minDist) minDist = dist;
      }
      return minDist;
    });

    // Calcular probabilidades proporcionales a distancia²
    const squaredDistances = distances.map(d => d ** 2);
    const sum = squaredDistances.reduce((a, b) => a + b, 0);

    // Elegir nuevo centroide con probabilidad proporcional
    let rand = Math.random() * sum;
    let idx = 0;

    for (let i = 0; i < m; i++) {
      rand -= squaredDistances[i];
      if (rand <= 0) {
        idx = i;
        break;
      }
    }

    centroids.push([...X[idx]]);
  }

  return centroids;
}

/**
 * Asigna cada punto al centroide más cercano
 */
function assignClusters(X: number[][], centroids: number[][]): number[] {
  return X.map(point => {
    let minDist = Infinity;
    let closestCluster = 0;

    centroids.forEach((centroid, k) => {
      const dist = euclideanDistance(point, centroid);
      if (dist < minDist) {
        minDist = dist;
        closestCluster = k;
      }
    });

    return closestCluster;
  });
}

/**
 * Recalcula centroides como media de puntos asignados
 */
function updateCentroids(
  X: number[][],
  labels: number[],
  K: number
): number[][] {
  const n = X[0].length;
  const centroids: number[][] = Array(K)
    .fill(0)
    .map(() => Array(n).fill(0));

  const counts = Array(K).fill(0);

  // Sumar puntos por cluster
  X.forEach((point, i) => {
    const cluster = labels[i];
    counts[cluster]++;
    point.forEach((val, j) => {
      centroids[cluster][j] += val;
    });
  });

  // Calcular media
  centroids.forEach((centroid, k) => {
    if (counts[k] > 0) {
      centroid.forEach((_, j) => {
        centroid[j] /= counts[k];
      });
    }
  });

  return centroids;
}

/**
 * Calcula la inertia (suma de distancias cuadradas)
 */
export function computeInertia(
  X: number[][],
  centroids: number[][],
  labels: number[]
): number {
  let inertia = 0;

  X.forEach((point, i) => {
    const centroid = centroids[labels[i]];
    const dist = euclideanDistance(point, centroid);
    inertia += dist ** 2;
  });

  return inertia;
}

/**
 * Verifica si las asignaciones han cambiado
 */
function labelsChanged(oldLabels: number[], newLabels: number[]): boolean {
  return oldLabels.some((label, i) => label !== newLabels[i]);
}

// ============================================
// K-MEANS BÁSICO
// ============================================

/**
 * Implementa K-Means con inicialización aleatoria
 */
export function kMeans(
  X: number[][],
  K: number,
  maxIterations: number = 100,
  tolerance: number = 1e-4
): KMeansResult {
  if (K <= 0) {
    throw new Error('K debe ser mayor que 0');
  }

  if (K > X.length) {
    throw new Error('K no puede ser mayor que el número de puntos');
  }

  // Inicializar centroides aleatoriamente
  let centroids = initializeRandomCentroids(X, K);
  let labels = assignClusters(X, centroids);
  let iterations = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    iterations++;

    // Actualizar centroides
    centroids = updateCentroids(X, labels, K);

    // Asignar clusters
    const newLabels = assignClusters(X, centroids);

    // Verificar convergencia
    if (!labelsChanged(labels, newLabels)) {
      labels = newLabels;
      break;
    }

    // Verificar si inertia cambió significativamente
    const oldInertia = computeInertia(X, centroids, labels);
    const newInertia = computeInertia(X, centroids, newLabels);

    labels = newLabels;

    if (Math.abs(oldInertia - newInertia) < tolerance) {
      break;
    }
  }

  const inertia = computeInertia(X, centroids, labels);

  return {
    centroids,
    labels,
    inertia,
    iterations,
  };
}

// ============================================
// K-MEANS++
// ============================================

/**
 * Implementa K-Means con inicialización K-Means++
 */
export function kMeansPlusPlus(
  X: number[][],
  K: number,
  maxIterations: number = 100,
  tolerance: number = 1e-4
): KMeansResult {
  if (K <= 0) {
    throw new Error('K debe ser mayor que 0');
  }

  if (K > X.length) {
    throw new Error('K no puede ser mayor que el número de puntos');
  }

  // Inicializar con K-Means++
  let centroids = initializeKMeansPlusPlus(X, K);
  let labels = assignClusters(X, centroids);
  let iterations = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    iterations++;

    // Actualizar centroides
    centroids = updateCentroids(X, labels, K);

    // Asignar clusters
    const newLabels = assignClusters(X, centroids);

    // Verificar convergencia
    if (!labelsChanged(labels, newLabels)) {
      labels = newLabels;
      break;
    }

    // Verificar si inertia cambió significativamente
    const oldInertia = computeInertia(X, centroids, labels);
    const newInertia = computeInertia(X, centroids, newLabels);

    labels = newLabels;

    if (Math.abs(oldInertia - newInertia) < tolerance) {
      break;
    }
  }

  const inertia = computeInertia(X, centroids, labels);

  return {
    centroids,
    labels,
    inertia,
    iterations,
  };
}

/**
 * Ejecuta K-Means múltiples veces y retorna el mejor resultado
 */
export function kMeansBest(
  X: number[][],
  K: number,
  nInit: number = 10,
  usePlusPlus: boolean = true
): KMeansResult {
  let bestResult: KMeansResult | null = null;

  for (let i = 0; i < nInit; i++) {
    const result = usePlusPlus
      ? kMeansPlusPlus(X, K)
      : kMeans(X, K);

    if (bestResult === null || result.inertia < bestResult.inertia) {
      bestResult = result;
    }
  }

  return bestResult!;
}

// ============================================
// MÉTODO DEL CODO
// ============================================

/**
 * Encuentra K óptimo usando el método del codo
 */
export function elbowMethod(
  X: number[][],
  maxK: number = 10,
  nInit: number = 3
): ElbowResult {
  const K_values: number[] = [];
  const inertias: number[] = [];

  // Ejecutar K-Means para K=1...maxK
  for (let K = 1; K <= maxK; K++) {
    K_values.push(K);

    const result = kMeansBest(X, K, nInit, true);
    inertias.push(result.inertia);
  }

  // Encontrar "codo" usando método de la segunda derivada
  const optimalK = findElbow(inertias);

  return {
    K_values,
    inertias,
    optimalK: K_values[optimalK],
  };
}

/**
 * Encuentra el índice del "codo" en la curva de inertias
 * Usa la segunda derivada para detectar el punto de mayor curvatura
 */
function findElbow(inertias: number[]): number {
  if (inertias.length < 3) return 0;

  const n = inertias.length;

  // Normalizar inertias a [0, 1]
  const maxInertia = Math.max(...inertias);
  const minInertia = Math.min(...inertias);
  const range = maxInertia - minInertia;

  const normalized = inertias.map(v =>
    range === 0 ? 0 : (v - minInertia) / range
  );

  // Calcular segunda derivada (diferencia de diferencias)
  const secondDerivative: number[] = [];

  for (let i = 1; i < n - 1; i++) {
    const d2 = normalized[i + 1] - 2 * normalized[i] + normalized[i - 1];
    secondDerivative.push(Math.abs(d2));
  }

  // Encontrar máximo de segunda derivada
  let maxIdx = 0;
  let maxVal = secondDerivative[0];

  for (let i = 1; i < secondDerivative.length; i++) {
    if (secondDerivative[i] > maxVal) {
      maxVal = secondDerivative[i];
      maxIdx = i;
    }
  }

  // Retornar índice (+1 porque empezamos en i=1)
  return maxIdx + 1;
}

// ============================================
// SILHOUETTE SCORE
// ============================================

/**
 * Calcula el Silhouette Score para evaluar calidad del clustering
 */
export function silhouetteScore(
  X: number[][],
  labels: number[]
): number {
  const m = X.length;
  const K = Math.max(...labels) + 1;

  if (K === 1) return 0; // No hay clustering

  const silhouettes: number[] = [];

  for (let i = 0; i < m; i++) {
    const point = X[i];
    const cluster = labels[i];

    // a(i): Distancia promedio a puntos en su cluster
    let a = 0;
    let countA = 0;

    for (let j = 0; j < m; j++) {
      if (i !== j && labels[j] === cluster) {
        a += euclideanDistance(point, X[j]);
        countA++;
      }
    }

    a = countA > 0 ? a / countA : 0;

    // b(i): Distancia promedio al cluster más cercano
    let b = Infinity;

    for (let k = 0; k < K; k++) {
      if (k === cluster) continue;

      let distToCluster = 0;
      let countB = 0;

      for (let j = 0; j < m; j++) {
        if (labels[j] === k) {
          distToCluster += euclideanDistance(point, X[j]);
          countB++;
        }
      }

      if (countB > 0) {
        const avgDist = distToCluster / countB;
        if (avgDist < b) {
          b = avgDist;
        }
      }
    }

    // s(i) = (b - a) / max(a, b)
    const s = b === Infinity ? 0 : (b - a) / Math.max(a, b);
    silhouettes.push(s);
  }

  // Promedio
  return silhouettes.reduce((sum, s) => sum + s, 0) / m;
}

/**
 * Predice cluster para nuevos puntos
 */
export function predict(
  X: number[][],
  centroids: number[][]
): number[] {
  return assignClusters(X, centroids);
}

// ============================================
// Demostración práctica
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 08: Clustering K-Means ===\n');

  // Dataset: Segmentación de clientes
  const customers = [
    [30, 25],  // Jóvenes con ingresos bajos
    [35, 28],
    [40, 30],
    [80, 45],  // Adultos con ingresos medios
    [75, 40],
    [85, 48],
    [150, 55], // Mayores con ingresos altos
    [145, 52],
    [155, 58],
  ];

  console.log('Dataset: Segmentación de clientes');
  console.log('Features: [Ingresos ($k), Edad]');
  console.log('Puntos:', customers.length);
  console.log();

  // Ejemplo 1: K-Means básico
  console.log('1. K-Means básico (K=3):');
  const result1 = kMeans(customers, 3);
  console.log('Iteraciones:', result1.iterations);
  console.log('Inertia:', result1.inertia.toFixed(2));
  console.log('Labels:', result1.labels);
  console.log('Centroides:');
  result1.centroids.forEach((c, i) => {
    console.log(`  Cluster ${i}: [${c[0].toFixed(1)}, ${c[1].toFixed(1)}]`);
  });
  console.log();

  // Ejemplo 2: K-Means++
  console.log('2. K-Means++ (K=3):');
  const result2 = kMeansPlusPlus(customers, 3);
  console.log('Iteraciones:', result2.iterations);
  console.log('Inertia:', result2.inertia.toFixed(2));
  console.log('Labels:', result2.labels);
  console.log();

  // Ejemplo 3: K-Means Best (múltiples ejecuciones)
  console.log('3. K-Means Best (10 ejecuciones):');
  const result3 = kMeansBest(customers, 3, 10, true);
  console.log('Mejor Inertia:', result3.inertia.toFixed(2));
  console.log('Labels:', result3.labels);
  console.log();

  // Ejemplo 4: Método del codo
  console.log('4. Método del Codo:');
  const elbowResult = elbowMethod(customers, 6, 3);
  console.log('K óptimo:', elbowResult.optimalK);
  console.log('Inertias por K:');
  elbowResult.K_values.forEach((k, i) => {
    console.log(`  K=${k}: ${elbowResult.inertias[i].toFixed(2)}`);
  });
  console.log();

  // Ejemplo 5: Silhouette Score
  console.log('5. Silhouette Score para diferentes K:');
  for (let K = 2; K <= 4; K++) {
    const result = kMeansBest(customers, K, 5, true);
    const score = silhouetteScore(customers, result.labels);
    console.log(`  K=${K}: Silhouette = ${score.toFixed(4)}`);
  }
  console.log();

  // Ejemplo 6: Predicción para nuevos clientes
  console.log('6. Predicción para nuevos clientes:');
  const newCustomers = [
    [32, 27],
    [78, 42],
    [150, 56],
  ];

  const predictions = predict(newCustomers, result3.centroids);
  newCustomers.forEach((customer, i) => {
    console.log(
      `  Cliente [${customer[0]}, ${customer[1]}] → Cluster ${predictions[i]}`
    );
  });
  console.log();

  // Ejemplo 7: Comparación Random vs K-Means++
  console.log('7. Comparación: Random vs K-Means++');
  let randomBetter = 0;
  let kmeansPPBetter = 0;

  for (let i = 0; i < 20; i++) {
    const r1 = kMeans(customers, 3);
    const r2 = kMeansPlusPlus(customers, 3);

    if (r1.inertia < r2.inertia) randomBetter++;
    else kmeansPPBetter++;
  }

  console.log(`  Random mejor: ${randomBetter}/20`);
  console.log(`  K-Means++ mejor: ${kmeansPPBetter}/20`);
}
