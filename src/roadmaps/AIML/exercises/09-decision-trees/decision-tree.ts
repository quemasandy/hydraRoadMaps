/**
 * Ejercicio 09: Decision Trees
 *
 * Implementación de árboles de decisión usando el algoritmo CART.
 */

// ============================================
// TIPOS E INTERFACES
// ============================================

/**
 * Nodo del árbol de decisión
 */
export interface TreeNode {
  featureIndex?: number;  // Índice de feature para split
  threshold?: number;     // Valor de threshold para split
  left?: TreeNode;        // Subárbol izquierdo (<=threshold)
  right?: TreeNode;       // Subárbol derecho (>threshold)
  value?: number;         // Clase predicha (solo en hojas)
  samples?: number;       // Número de samples en este nodo
  gini?: number;          // Gini impurity del nodo
}

/**
 * Configuración del árbol
 */
export interface DecisionTreeConfig {
  maxDepth?: number;
  minSamplesSplit?: number;
  minSamplesLeaf?: number;
  criterion?: 'gini' | 'entropy';
}

/**
 * Split candidate
 */
interface SplitCandidate {
  featureIndex: number;
  threshold: number;
  gini: number;
  leftIndices: number[];
  rightIndices: number[];
}

// ============================================
// FUNCIONES DE IMPUREZA
// ============================================

/**
 * Calcula Gini impurity
 * Gini = 1 - Σ(pi)²
 */
export function computeGini(y: number[]): number {
  if (y.length === 0) return 0;

  // Contar frecuencias de cada clase
  const classCounts = new Map<number, number>();
  for (const label of y) {
    classCounts.set(label, (classCounts.get(label) || 0) + 1);
  }

  // Calcular Gini
  let gini = 1.0;
  const n = y.length;

  for (const count of classCounts.values()) {
    const p = count / n;
    gini -= p * p;
  }

  return gini;
}

/**
 * Calcula Entropy
 * Entropy = -Σ(pi × log2(pi))
 */
export function computeEntropy(y: number[]): number {
  if (y.length === 0) return 0;

  // Contar frecuencias
  const classCounts = new Map<number, number>();
  for (const label of y) {
    classCounts.set(label, (classCounts.get(label) || 0) + 1);
  }

  // Calcular entropy
  let entropy = 0;
  const n = y.length;

  for (const count of classCounts.values()) {
    const p = count / n;
    if (p > 0) {
      entropy -= p * Math.log2(p);
    }
  }

  return entropy;
}

/**
 * Calcula Information Gain
 * IG = Entropy_parent - weighted_avg(Entropy_children)
 */
export function computeInformationGain(
  y_parent: number[],
  y_left: number[],
  y_right: number[]
): number {
  const n = y_parent.length;
  const n_left = y_left.length;
  const n_right = y_right.length;

  const entropy_parent = computeEntropy(y_parent);
  const entropy_left = computeEntropy(y_left);
  const entropy_right = computeEntropy(y_right);

  const weighted_entropy =
    (n_left / n) * entropy_left + (n_right / n) * entropy_right;

  return entropy_parent - weighted_entropy;
}

/**
 * Calcula la impureza según el criterio especificado
 */
function computeImpurity(y: number[], criterion: 'gini' | 'entropy'): number {
  return criterion === 'gini' ? computeGini(y) : computeEntropy(y);
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Encuentra la clase más común
 */
function mostCommonClass(y: number[]): number {
  const counts = new Map<number, number>();
  for (const label of y) {
    counts.set(label, (counts.get(label) || 0) + 1);
  }

  let maxCount = 0;
  let maxClass = y[0];

  for (const [label, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      maxClass = label;
    }
  }

  return maxClass;
}

/**
 * Obtiene valores únicos de un array
 */
function uniqueValues(arr: number[]): number[] {
  return Array.from(new Set(arr)).sort((a, b) => a - b);
}

// ============================================
// DECISION TREE CLASSIFIER
// ============================================

export class DecisionTreeClassifier {
  private root?: TreeNode;
  private config: Required<DecisionTreeConfig>;
  private nClasses: number = 0;

  constructor(config: DecisionTreeConfig = {}) {
    this.config = {
      maxDepth: config.maxDepth ?? 10,
      minSamplesSplit: config.minSamplesSplit ?? 2,
      minSamplesLeaf: config.minSamplesLeaf ?? 1,
      criterion: config.criterion ?? 'gini',
    };
  }

  /**
   * Entrena el árbol de decisión
   */
  fit(X: number[][], y: number[]): void {
    if (X.length !== y.length) {
      throw new Error('X e y deben tener la misma cantidad de muestras');
    }

    // Determinar número de clases
    this.nClasses = uniqueValues(y).length;

    // Construir árbol
    const indices = Array.from({ length: X.length }, (_, i) => i);
    this.root = this.buildTree(X, y, indices, 0);
  }

  /**
   * Construye el árbol recursivamente
   */
  private buildTree(
    X: number[][],
    y: number[],
    indices: number[],
    depth: number
  ): TreeNode {
    const n_samples = indices.length;
    const y_subset = indices.map(i => y[i]);

    // Calcular impureza del nodo
    const gini = computeImpurity(y_subset, this.config.criterion);

    // Crear nodo
    const node: TreeNode = {
      samples: n_samples,
      gini,
    };

    // Condiciones de parada
    const allSameClass = uniqueValues(y_subset).length === 1;
    const maxDepthReached = depth >= this.config.maxDepth;
    const tooFewSamples = n_samples < this.config.minSamplesSplit;

    if (allSameClass || maxDepthReached || tooFewSamples) {
      // Crear hoja
      node.value = mostCommonClass(y_subset);
      return node;
    }

    // Encontrar mejor split
    const bestSplit = this.findBestSplit(X, y, indices);

    if (!bestSplit) {
      // No se puede dividir más, crear hoja
      node.value = mostCommonClass(y_subset);
      return node;
    }

    // Verificar min_samples_leaf
    if (
      bestSplit.leftIndices.length < this.config.minSamplesLeaf ||
      bestSplit.rightIndices.length < this.config.minSamplesLeaf
    ) {
      node.value = mostCommonClass(y_subset);
      return node;
    }

    // Crear split
    node.featureIndex = bestSplit.featureIndex;
    node.threshold = bestSplit.threshold;

    // Construir subárboles
    node.left = this.buildTree(X, y, bestSplit.leftIndices, depth + 1);
    node.right = this.buildTree(X, y, bestSplit.rightIndices, depth + 1);

    return node;
  }

  /**
   * Encuentra el mejor split para un nodo
   */
  private findBestSplit(
    X: number[][],
    y: number[],
    indices: number[]
  ): SplitCandidate | null {
    let bestSplit: SplitCandidate | null = null;
    let bestImpurity = Infinity;

    const n_features = X[0].length;
    const y_subset = indices.map(i => y[i]);

    // Para cada feature
    for (let featureIdx = 0; featureIdx < n_features; featureIdx++) {
      // Obtener valores únicos de esta feature
      const values = indices.map(i => X[i][featureIdx]);
      const uniqueVals = uniqueValues(values);

      // Probar cada valor como threshold
      for (let i = 0; i < uniqueVals.length - 1; i++) {
        const threshold = (uniqueVals[i] + uniqueVals[i + 1]) / 2;

        // Dividir datos
        const leftIndices: number[] = [];
        const rightIndices: number[] = [];

        for (const idx of indices) {
          if (X[idx][featureIdx] <= threshold) {
            leftIndices.push(idx);
          } else {
            rightIndices.push(idx);
          }
        }

        if (leftIndices.length === 0 || rightIndices.length === 0) {
          continue;
        }

        // Calcular impureza del split
        const y_left = leftIndices.map(i => y[i]);
        const y_right = rightIndices.map(i => y[i]);

        const impurity_left = computeImpurity(y_left, this.config.criterion);
        const impurity_right = computeImpurity(y_right, this.config.criterion);

        const n_left = leftIndices.length;
        const n_right = rightIndices.length;
        const n_total = indices.length;

        const weighted_impurity =
          (n_left / n_total) * impurity_left +
          (n_right / n_total) * impurity_right;

        // Actualizar mejor split
        if (weighted_impurity < bestImpurity) {
          bestImpurity = weighted_impurity;
          bestSplit = {
            featureIndex: featureIdx,
            threshold,
            gini: weighted_impurity,
            leftIndices,
            rightIndices,
          };
        }
      }
    }

    return bestSplit;
  }

  /**
   * Predice clases para múltiples ejemplos
   */
  predict(X: number[][]): number[] {
    if (!this.root) {
      throw new Error('El árbol no ha sido entrenado');
    }

    return X.map(x => this.predictOne(x));
  }

  /**
   * Predice clase para un ejemplo
   */
  predictOne(x: number[]): number {
    if (!this.root) {
      throw new Error('El árbol no ha sido entrenado');
    }

    return this.traverseTree(x, this.root);
  }

  /**
   * Recorre el árbol para hacer una predicción
   */
  private traverseTree(x: number[], node: TreeNode): number {
    // Si es hoja, retornar valor
    if (node.value !== undefined) {
      return node.value;
    }

    // Decidir si ir a izquierda o derecha
    if (x[node.featureIndex!] <= node.threshold!) {
      return this.traverseTree(x, node.left!);
    } else {
      return this.traverseTree(x, node.right!);
    }
  }

  /**
   * Obtiene la profundidad del árbol
   */
  getDepth(): number {
    if (!this.root) return 0;
    return this.computeDepth(this.root);
  }

  private computeDepth(node: TreeNode): number {
    if (node.value !== undefined) return 1;
    const leftDepth = node.left ? this.computeDepth(node.left) : 0;
    const rightDepth = node.right ? this.computeDepth(node.right) : 0;
    return 1 + Math.max(leftDepth, rightDepth);
  }

  /**
   * Obtiene el número de hojas
   */
  getNumLeaves(): number {
    if (!this.root) return 0;
    return this.countLeaves(this.root);
  }

  private countLeaves(node: TreeNode): number {
    if (node.value !== undefined) return 1;
    const leftLeaves = node.left ? this.countLeaves(node.left) : 0;
    const rightLeaves = node.right ? this.countLeaves(node.right) : 0;
    return leftLeaves + rightLeaves;
  }

  /**
   * Obtiene el árbol raíz (para inspección)
   */
  getTree(): TreeNode | undefined {
    return this.root;
  }
}

// ============================================
// Demostración práctica
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 09: Decision Trees ===\n');

  // Dataset: Predicción de compra
  const X = [
    [25, 40],  // [edad, salario_k]
    [30, 60],
    [35, 80],
    [40, 90],
    [45, 110],
    [50, 120],
    [28, 45],
    [33, 70],
  ];

  const y = [0, 0, 1, 1, 1, 1, 0, 1]; // 0: No compra, 1: Compra

  console.log('Dataset: Predicción de compra');
  console.log('Features: [Edad, Salario ($k)]');
  console.log('Ejemplos:', X.length);
  console.log();

  // Ejemplo 1: Árbol básico
  console.log('1. Árbol de Decisión básico:');
  const tree1 = new DecisionTreeClassifier({
    maxDepth: 3,
    minSamplesSplit: 2,
    criterion: 'gini',
  });

  tree1.fit(X, y);
  const predictions1 = tree1.predict(X);

  console.log('Profundidad:', tree1.getDepth());
  console.log('Hojas:', tree1.getNumLeaves());
  console.log('Predicciones:', predictions1);
  console.log('Real:        ', y);

  const accuracy1 = predictions1.filter((p, i) => p === y[i]).length / y.length;
  console.log('Accuracy:', accuracy1.toFixed(4));
  console.log();

  // Ejemplo 2: Gini vs Entropy
  console.log('2. Comparación Gini vs Entropy:');

  const treeGini = new DecisionTreeClassifier({ criterion: 'gini' });
  const treeEntropy = new DecisionTreeClassifier({ criterion: 'entropy' });

  treeGini.fit(X, y);
  treeEntropy.fit(X, y);

  const predsGini = treeGini.predict(X);
  const predsEntropy = treeEntropy.predict(X);

  const accGini = predsGini.filter((p, i) => p === y[i]).length / y.length;
  const accEntropy = predsEntropy.filter((p, i) => p === y[i]).length / y.length;

  console.log('Gini - Accuracy:', accGini.toFixed(4));
  console.log('Entropy - Accuracy:', accEntropy.toFixed(4));
  console.log();

  // Ejemplo 3: Overfitting
  console.log('3. Demostración de Overfitting:');

  const treeShallow = new DecisionTreeClassifier({ maxDepth: 2 });
  const treeDeep = new DecisionTreeClassifier({ maxDepth: 10 });

  treeShallow.fit(X, y);
  treeDeep.fit(X, y);

  console.log('Árbol poco profundo (max_depth=2):');
  console.log('  Profundidad:', treeShallow.getDepth());
  console.log('  Hojas:', treeShallow.getNumLeaves());

  console.log('Árbol profundo (max_depth=10):');
  console.log('  Profundidad:', treeDeep.getDepth());
  console.log('  Hojas:', treeDeep.getNumLeaves());
  console.log();

  // Ejemplo 4: Predicción para nuevos clientes
  console.log('4. Predicción para nuevos clientes:');
  const newCustomers = [
    [27, 50],
    [38, 85],
    [48, 115],
  ];

  const newPreds = tree1.predict(newCustomers);

  newCustomers.forEach((customer, i) => {
    console.log(
      `  Edad=${customer[0]}, Salario=${customer[1]}k: ` +
      `${newPreds[i] === 1 ? 'Comprará' : 'No comprará'}`
    );
  });
  console.log();

  // Ejemplo 5: Cálculo de impurezas
  console.log('5. Cálculo de impurezas:');
  const y_pure = [1, 1, 1, 1];
  const y_impure = [0, 1, 0, 1];
  const y_multiclass = [0, 1, 2, 0, 1, 2];

  console.log('Gini puro [1,1,1,1]:', computeGini(y_pure).toFixed(4));
  console.log('Gini impuro [0,1,0,1]:', computeGini(y_impure).toFixed(4));
  console.log('Gini multiclase [0,1,2,0,1,2]:', computeGini(y_multiclass).toFixed(4));
  console.log();

  console.log('Entropy puro:', computeEntropy(y_pure).toFixed(4));
  console.log('Entropy impuro:', computeEntropy(y_impure).toFixed(4));
  console.log('Entropy multiclase:', computeEntropy(y_multiclass).toFixed(4));
  console.log();

  // Ejemplo 6: Information Gain
  console.log('6. Information Gain:');
  const y_parent = [0, 0, 1, 1];
  const y_left = [0, 0];
  const y_right = [1, 1];

  const ig = computeInformationGain(y_parent, y_left, y_right);
  console.log('Parent:', y_parent);
  console.log('Left:', y_left);
  console.log('Right:', y_right);
  console.log('Information Gain:', ig.toFixed(4));
}
