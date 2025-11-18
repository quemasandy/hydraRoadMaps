/**
 * Ejercicio 03: Álgebra Lineal
 *
 * Este módulo implementa operaciones fundamentales de álgebra lineal
 * que son la base de muchos algoritmos de Machine Learning.
 */

/**
 * Tipo para representar una matriz como array 2D
 */
export type Matrix = number[][];

// ============================================
// OPERACIONES CON VECTORES
// ============================================

/**
 * Suma dos vectores elemento por elemento
 *
 * @param v - Primer vector
 * @param w - Segundo vector
 * @returns Vector suma v + w
 */
export function vectorAdd(v: number[], w: number[]): number[] {
  if (v.length !== w.length) {
    throw new Error('Los vectores deben tener la misma longitud');
  }

  return v.map((vi, i) => vi + w[i]);
}

/**
 * Resta dos vectores elemento por elemento
 *
 * @param v - Primer vector
 * @param w - Segundo vector
 * @returns Vector diferencia v - w
 */
export function vectorSubtract(v: number[], w: number[]): number[] {
  if (v.length !== w.length) {
    throw new Error('Los vectores deben tener la misma longitud');
  }

  return v.map((vi, i) => vi - w[i]);
}

/**
 * Multiplica un vector por un escalar
 *
 * @param v - Vector a multiplicar
 * @param k - Escalar
 * @returns Vector k * v
 */
export function vectorScalarMultiply(v: number[], k: number): number[] {
  return v.map(vi => vi * k);
}

/**
 * Calcula la magnitud (norma L2) de un vector
 * Formula: ||v|| = √(v1² + v2² + ... + vn²)
 *
 * @param v - Vector
 * @returns Magnitud del vector
 */
export function vectorMagnitude(v: number[]): number {
  if (v.length === 0) {
    return 0;
  }

  const sumSquares = v.reduce((sum, vi) => sum + vi * vi, 0);
  return Math.sqrt(sumSquares);
}

/**
 * Normaliza un vector (lo convierte en vector unitario)
 * Vector unitario tiene magnitud = 1
 *
 * @param v - Vector a normalizar
 * @returns Vector normalizado v / ||v||
 */
export function vectorNormalize(v: number[]): number[] {
  const magnitude = vectorMagnitude(v);

  if (magnitude === 0) {
    throw new Error('No se puede normalizar un vector de magnitud cero');
  }

  return vectorScalarMultiply(v, 1 / magnitude);
}

/**
 * Calcula el producto punto de dos vectores
 * Formula: v · w = v1*w1 + v2*w2 + ... + vn*wn
 *
 * @param v - Primer vector
 * @param w - Segundo vector
 * @returns Producto punto v · w
 */
export function dotProduct(v: number[], w: number[]): number {
  if (v.length !== w.length) {
    throw new Error('Los vectores deben tener la misma longitud');
  }

  return v.reduce((sum, vi, i) => sum + vi * w[i], 0);
}

/**
 * Calcula la similitud coseno entre dos vectores
 * Formula: cos(θ) = (v · w) / (||v|| * ||w||)
 * Retorna un valor entre -1 y 1
 *
 * @param v - Primer vector
 * @param w - Segundo vector
 * @returns Similitud coseno entre v y w
 */
export function cosineSimilarity(v: number[], w: number[]): number {
  if (v.length !== w.length) {
    throw new Error('Los vectores deben tener la misma longitud');
  }

  const dot = dotProduct(v, w);
  const magV = vectorMagnitude(v);
  const magW = vectorMagnitude(w);

  if (magV === 0 || magW === 0) {
    throw new Error('No se puede calcular similitud de vector cero');
  }

  return dot / (magV * magW);
}

/**
 * Calcula la distancia euclidiana entre dos vectores
 * Formula: ||v - w|| = √((v1-w1)² + (v2-w2)² + ... + (vn-wn)²)
 *
 * @param v - Primer vector
 * @param w - Segundo vector
 * @returns Distancia euclidiana entre v y w
 */
export function euclideanDistance(v: number[], w: number[]): number {
  if (v.length !== w.length) {
    throw new Error('Los vectores deben tener la misma longitud');
  }

  const diff = vectorSubtract(v, w);
  return vectorMagnitude(diff);
}

// ============================================
// OPERACIONES CON MATRICES
// ============================================

/**
 * Obtiene las dimensiones de una matriz
 *
 * @param A - Matriz
 * @returns Tupla [filas, columnas]
 */
export function matrixShape(A: Matrix): [number, number] {
  if (A.length === 0) {
    return [0, 0];
  }

  return [A.length, A[0].length];
}

/**
 * Valida que una matriz tenga dimensiones consistentes
 *
 * @param A - Matriz a validar
 * @returns true si es válida
 */
export function isValidMatrix(A: Matrix): boolean {
  if (A.length === 0) {
    return true;
  }

  const cols = A[0].length;
  return A.every(row => row.length === cols);
}

/**
 * Suma dos matrices elemento por elemento
 *
 * @param A - Primera matriz
 * @param B - Segunda matriz
 * @returns Matriz suma A + B
 */
export function matrixAdd(A: Matrix, B: Matrix): Matrix {
  const [rowsA, colsA] = matrixShape(A);
  const [rowsB, colsB] = matrixShape(B);

  if (rowsA !== rowsB || colsA !== colsB) {
    throw new Error('Las matrices deben tener las mismas dimensiones');
  }

  return A.map((row, i) => row.map((val, j) => val + B[i][j]));
}

/**
 * Resta dos matrices elemento por elemento
 *
 * @param A - Primera matriz
 * @param B - Segunda matriz
 * @returns Matriz diferencia A - B
 */
export function matrixSubtract(A: Matrix, B: Matrix): Matrix {
  const [rowsA, colsA] = matrixShape(A);
  const [rowsB, colsB] = matrixShape(B);

  if (rowsA !== rowsB || colsA !== colsB) {
    throw new Error('Las matrices deben tener las mismas dimensiones');
  }

  return A.map((row, i) => row.map((val, j) => val - B[i][j]));
}

/**
 * Multiplica una matriz por un escalar
 *
 * @param A - Matriz
 * @param k - Escalar
 * @returns Matriz k * A
 */
export function matrixScalarMultiply(A: Matrix, k: number): Matrix {
  return A.map(row => row.map(val => val * k));
}

/**
 * Transpone una matriz (intercambia filas por columnas)
 *
 * @param A - Matriz a transponer
 * @returns Matriz transpuesta A^T
 */
export function matrixTranspose(A: Matrix): Matrix {
  const [rows, cols] = matrixShape(A);

  if (rows === 0 || cols === 0) {
    return [];
  }

  const result: Matrix = [];

  for (let j = 0; j < cols; j++) {
    const newRow: number[] = [];
    for (let i = 0; i < rows; i++) {
      newRow.push(A[i][j]);
    }
    result.push(newRow);
  }

  return result;
}

/**
 * Multiplica dos matrices
 * A (m×n) × B (n×p) = C (m×p)
 *
 * @param A - Primera matriz (m×n)
 * @param B - Segunda matriz (n×p)
 * @returns Matriz producto A × B
 */
export function matrixMultiply(A: Matrix, B: Matrix): Matrix {
  const [rowsA, colsA] = matrixShape(A);
  const [rowsB, colsB] = matrixShape(B);

  if (colsA !== rowsB) {
    throw new Error(
      `Dimensiones incompatibles: (${rowsA}×${colsA}) × (${rowsB}×${colsB})`
    );
  }

  const result: Matrix = [];

  for (let i = 0; i < rowsA; i++) {
    const row: number[] = [];
    for (let j = 0; j < colsB; j++) {
      // Producto punto de fila i de A con columna j de B
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += A[i][k] * B[k][j];
      }
      row.push(sum);
    }
    result.push(row);
  }

  return result;
}

/**
 * Multiplica una matriz por un vector
 * Caso especial de multiplicación de matrices
 *
 * @param A - Matriz (m×n)
 * @param v - Vector (n)
 * @returns Vector resultado (m)
 */
export function matrixVectorMultiply(A: Matrix, v: number[]): number[] {
  const [rows, cols] = matrixShape(A);

  if (cols !== v.length) {
    throw new Error(
      `Dimensiones incompatibles: matriz ${rows}×${cols}, vector ${v.length}`
    );
  }

  return A.map(row => dotProduct(row, v));
}

/**
 * Crea una matriz identidad de tamaño n×n
 * Matriz con 1s en la diagonal y 0s en el resto
 *
 * @param n - Tamaño de la matriz
 * @returns Matriz identidad n×n
 */
export function identityMatrix(n: number): Matrix {
  if (n <= 0) {
    throw new Error('El tamaño debe ser positivo');
  }

  const result: Matrix = [];

  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      row.push(i === j ? 1 : 0);
    }
    result.push(row);
  }

  return result;
}

/**
 * Crea una matriz de ceros
 *
 * @param rows - Número de filas
 * @param cols - Número de columnas
 * @returns Matriz de ceros rows×cols
 */
export function zeroMatrix(rows: number, cols: number): Matrix {
  if (rows <= 0 || cols <= 0) {
    throw new Error('Las dimensiones deben ser positivas');
  }

  return Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(0));
}

/**
 * Crea una matriz de unos
 *
 * @param rows - Número de filas
 * @param cols - Número de columnas
 * @returns Matriz de unos rows×cols
 */
export function onesMatrix(rows: number, cols: number): Matrix {
  if (rows <= 0 || cols <= 0) {
    throw new Error('Las dimensiones deben ser positivas');
  }

  return Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(1));
}

// ============================================
// CLASES ORIENTADAS A OBJETOS
// ============================================

/**
 * Clase Vector que encapsula operaciones vectoriales
 */
export class Vector {
  constructor(public elements: number[]) {
    if (elements.length === 0) {
      throw new Error('El vector no puede estar vacío');
    }
  }

  /**
   * Dimensión del vector
   */
  get dimension(): number {
    return this.elements.length;
  }

  /**
   * Suma este vector con otro
   */
  add(other: Vector): Vector {
    return new Vector(vectorAdd(this.elements, other.elements));
  }

  /**
   * Resta otro vector de este vector
   */
  subtract(other: Vector): Vector {
    return new Vector(vectorSubtract(this.elements, other.elements));
  }

  /**
   * Multiplica este vector por un escalar
   */
  scale(k: number): Vector {
    return new Vector(vectorScalarMultiply(this.elements, k));
  }

  /**
   * Calcula la magnitud de este vector
   */
  magnitude(): number {
    return vectorMagnitude(this.elements);
  }

  /**
   * Calcula el producto punto con otro vector
   */
  dot(other: Vector): number {
    return dotProduct(this.elements, other.elements);
  }

  /**
   * Normaliza este vector (retorna un nuevo vector unitario)
   */
  normalize(): Vector {
    return new Vector(vectorNormalize(this.elements));
  }

  /**
   * Calcula la similitud coseno con otro vector
   */
  cosineSimilarity(other: Vector): number {
    return cosineSimilarity(this.elements, other.elements);
  }

  /**
   * Calcula la distancia euclidiana a otro vector
   */
  distanceTo(other: Vector): number {
    return euclideanDistance(this.elements, other.elements);
  }

  /**
   * Retorna una representación en string del vector
   */
  toString(): string {
    return `Vector([${this.elements.join(', ')}])`;
  }
}

/**
 * Clase MatrixClass que encapsula operaciones matriciales
 */
export class MatrixClass {
  constructor(public data: Matrix) {
    if (!isValidMatrix(data)) {
      throw new Error('La matriz tiene dimensiones inconsistentes');
    }
  }

  /**
   * Forma de la matriz [filas, columnas]
   */
  get shape(): [number, number] {
    return matrixShape(this.data);
  }

  /**
   * Número de filas
   */
  get rows(): number {
    return this.data.length;
  }

  /**
   * Número de columnas
   */
  get cols(): number {
    return this.data.length > 0 ? this.data[0].length : 0;
  }

  /**
   * Suma esta matriz con otra
   */
  add(other: MatrixClass): MatrixClass {
    return new MatrixClass(matrixAdd(this.data, other.data));
  }

  /**
   * Resta otra matriz de esta matriz
   */
  subtract(other: MatrixClass): MatrixClass {
    return new MatrixClass(matrixSubtract(this.data, other.data));
  }

  /**
   * Multiplica esta matriz por un escalar
   */
  scale(k: number): MatrixClass {
    return new MatrixClass(matrixScalarMultiply(this.data, k));
  }

  /**
   * Multiplica esta matriz con otra
   */
  multiply(other: MatrixClass): MatrixClass {
    return new MatrixClass(matrixMultiply(this.data, other.data));
  }

  /**
   * Multiplica esta matriz por un vector
   */
  multiplyVector(v: Vector): Vector {
    return new Vector(matrixVectorMultiply(this.data, v.elements));
  }

  /**
   * Transpone esta matriz
   */
  transpose(): MatrixClass {
    return new MatrixClass(matrixTranspose(this.data));
  }

  /**
   * Crea una matriz identidad de tamaño n×n
   */
  static identity(n: number): MatrixClass {
    return new MatrixClass(identityMatrix(n));
  }

  /**
   * Crea una matriz de ceros
   */
  static zeros(rows: number, cols: number): MatrixClass {
    return new MatrixClass(zeroMatrix(rows, cols));
  }

  /**
   * Crea una matriz de unos
   */
  static ones(rows: number, cols: number): MatrixClass {
    return new MatrixClass(onesMatrix(rows, cols));
  }

  /**
   * Retorna una representación en string de la matriz
   */
  toString(): string {
    return `Matrix(${this.rows}×${this.cols})`;
  }
}

// ============================================
// Demostración práctica
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 03: Álgebra Lineal ===\n');

  // Ejemplo 1: Operaciones con vectores
  console.log('1. Operaciones con Vectores:');
  const v = [1, 2, 3];
  const w = [4, 5, 6];
  console.log('v =', v);
  console.log('w =', w);
  console.log('v + w =', vectorAdd(v, w));
  console.log('v - w =', vectorSubtract(v, w));
  console.log('2 * v =', vectorScalarMultiply(v, 2));
  console.log('||v|| =', vectorMagnitude(v).toFixed(3));
  console.log();

  // Ejemplo 2: Producto punto y similitud
  console.log('2. Producto Punto y Similitud:');
  console.log('v · w =', dotProduct(v, w));
  console.log('cos(v, w) =', cosineSimilarity(v, w).toFixed(3));
  console.log('distancia(v, w) =', euclideanDistance(v, w).toFixed(3));
  console.log();

  // Ejemplo 3: Sistema de recomendación
  console.log('3. Sistema de Recomendación de Películas:');
  const usuario = [5, 3, 1]; // [acción, comedia, drama]
  const pelicula1 = [4, 1, 2]; // Película de acción
  const pelicula2 = [1, 5, 3]; // Película de comedia
  console.log('Preferencias usuario:', usuario);
  console.log('Película 1 (acción):', pelicula1);
  console.log('Película 2 (comedia):', pelicula2);
  console.log('Similitud película 1:', cosineSimilarity(usuario, pelicula1).toFixed(3));
  console.log('Similitud película 2:', cosineSimilarity(usuario, pelicula2).toFixed(3));
  console.log();

  // Ejemplo 4: Operaciones con matrices
  console.log('4. Operaciones con Matrices:');
  const A = [[1, 2], [3, 4]];
  const B = [[5, 6], [7, 8]];
  console.log('A =', A);
  console.log('B =', B);
  console.log('A + B =', matrixAdd(A, B));
  console.log('A^T =', matrixTranspose(A));
  console.log();

  // Ejemplo 5: Multiplicación de matrices
  console.log('5. Multiplicación de Matrices:');
  console.log('A × B =', matrixMultiply(A, B));
  const vector = [1, 2];
  console.log('A × [1, 2] =', matrixVectorMultiply(A, vector));
  console.log();

  // Ejemplo 6: Matriz identidad
  console.log('6. Matriz Identidad:');
  const I = identityMatrix(3);
  console.log('I(3) =');
  I.forEach(row => console.log(' ', row));
  console.log();

  // Ejemplo 7: Clases orientadas a objetos
  console.log('7. Clases Vector y Matrix:');
  const vec1 = new Vector([1, 2, 3]);
  const vec2 = new Vector([4, 5, 6]);
  console.log('vec1 =', vec1.toString());
  console.log('vec2 =', vec2.toString());
  console.log('vec1 + vec2 =', vec1.add(vec2).toString());
  console.log('||vec1|| =', vec1.magnitude().toFixed(3));
  console.log('vec1 · vec2 =', vec1.dot(vec2));
  console.log();

  const mat1 = new MatrixClass([[1, 2], [3, 4]]);
  const mat2 = new MatrixClass([[5, 6], [7, 8]]);
  console.log('mat1 =', mat1.toString(), mat1.data);
  console.log('mat2 =', mat2.toString(), mat2.data);
  console.log('mat1 × mat2 =', mat1.multiply(mat2).data);
  console.log('mat1^T =', mat1.transpose().data);
}
