# Ejercicio 03: Álgebra Lineal

**Objetivo:** Implementar operaciones fundamentales de álgebra lineal que son la base de algoritmos de Machine Learning.

## 📖 Teoría

### ¿Por qué es importante el álgebra lineal en ML?

El álgebra lineal es el lenguaje matemático del Machine Learning:
- **Representación de datos**: Cada muestra es un vector, el dataset es una matriz
- **Transformaciones**: Rotaciones, escalados, proyecciones
- **Redes neuronales**: Capas son multiplicaciones de matrices
- **PCA**: Reducción de dimensionalidad usando eigenvalores/eigenvectores
- **Optimización**: Gradientes son vectores, Hessian es una matriz

### Conceptos Fundamentales

#### 1. **Vectores**

Un vector es una lista ordenada de números:
```
v = [1, 2, 3]  // Vector en 3D
```

**Operaciones con vectores:**
- **Suma**: `v + w = [v1+w1, v2+w2, ...]`
- **Resta**: `v - w = [v1-w1, v2-w2, ...]`
- **Escalar**: `k * v = [k*v1, k*v2, ...]`
- **Magnitud**: `||v|| = √(v1² + v2² + ...)`

#### 2. **Producto Punto (Dot Product)**

```
v · w = v1*w1 + v2*w2 + ... + vn*wn
```

Propiedades importantes:
- Mide "similitud" entre vectores
- `v · w = ||v|| * ||w|| * cos(θ)` donde θ es el ángulo entre vectores
- Si `v · w = 0`, los vectores son perpendiculares (ortogonales)

#### 3. **Matrices**

Una matriz es un arreglo 2D de números:
```
A = [[1, 2, 3],
     [4, 5, 6]]  // Matriz 2x3
```

**Operaciones con matrices:**
- **Suma/Resta**: Elemento por elemento (deben tener mismas dimensiones)
- **Multiplicación por escalar**: Multiplica cada elemento
- **Transposición**: Filas se convierten en columnas
- **Multiplicación de matrices**: Producto punto de filas por columnas

#### 4. **Multiplicación de Matrices**

Para multiplicar `A (m×n)` por `B (n×p)`:
```
C[i,j] = Σ(A[i,k] * B[k,j]) para k = 0 hasta n-1
```

Resultado: Matriz `C (m×p)`

**Importante**: El número de columnas de A debe ser igual al número de filas de B.

#### 5. **Matriz Identidad**

Matriz cuadrada con 1s en la diagonal y 0s en el resto:
```
I = [[1, 0, 0],
     [0, 1, 0],
     [0, 0, 1]]
```

Propiedad: `A * I = I * A = A`

---

## 🎯 Escenario

Estás construyendo un sistema de recomendación de películas. Representas:
- **Usuarios como vectores**: Preferencias de géneros `[acción, comedia, drama]`
- **Películas como vectores**: Intensidad de cada género
- **Similitud**: Producto punto entre vector de usuario y película

Ejemplo:
```
Usuario:  [5, 3, 1]  // Le gusta acción, algo de comedia, poco drama
Película: [4, 1, 2]  // Película de acción con algo de drama

Similitud = 5*4 + 3*1 + 1*2 = 20 + 3 + 2 = 25
```

---

## 📝 Instrucciones

### Parte 1: Operaciones con Vectores

Implementa operaciones básicas con vectores:

```typescript
export function vectorAdd(v: number[], w: number[]): number[] {
  // Tu código aquí
  // Sumar elemento por elemento
}

export function vectorSubtract(v: number[], w: number[]): number[] {
  // Tu código aquí
}

export function vectorScalarMultiply(v: number[], k: number): number[] {
  // Tu código aquí
  // Multiplicar cada elemento por k
}

export function vectorMagnitude(v: number[]): number {
  // Tu código aquí
  // √(v1² + v2² + ... + vn²)
}

// Ejemplo de uso:
const v = [1, 2, 3];
const w = [4, 5, 6];
console.log(vectorAdd(v, w));              // [5, 7, 9]
console.log(vectorScalarMultiply(v, 2));   // [2, 4, 6]
console.log(vectorMagnitude(v));           // 3.742...
```

### Parte 2: Producto Punto

Implementa el producto punto (dot product):

```typescript
export function dotProduct(v: number[], w: number[]): number {
  // Tu código aquí
  // v1*w1 + v2*w2 + ... + vn*wn
}

export function cosineSimilarity(v: number[], w: number[]): number {
  // Tu código aquí
  // (v · w) / (||v|| * ||w||)
  // Retorna un valor entre -1 y 1
}

// Ejemplo de uso:
const v = [1, 2, 3];
const w = [4, 5, 6];
console.log(dotProduct(v, w));           // 32
console.log(cosineSimilarity(v, w));     // 0.974...
```

### Parte 3: Operaciones con Matrices

Implementa operaciones básicas con matrices:

```typescript
export type Matrix = number[][];

export function matrixAdd(A: Matrix, B: Matrix): Matrix {
  // Tu código aquí
  // Sumar elemento por elemento
  // A y B deben tener las mismas dimensiones
}

export function matrixScalarMultiply(A: Matrix, k: number): Matrix {
  // Tu código aquí
}

export function matrixTranspose(A: Matrix): Matrix {
  // Tu código aquí
  // Convertir filas en columnas
}

// Ejemplo de uso:
const A = [[1, 2], [3, 4]];
const B = [[5, 6], [7, 8]];
console.log(matrixAdd(A, B));        // [[6, 8], [10, 12]]
console.log(matrixTranspose(A));     // [[1, 3], [2, 4]]
```

### Parte 4: Multiplicación de Matrices

Implementa la multiplicación de matrices:

```typescript
export function matrixMultiply(A: Matrix, B: Matrix): Matrix {
  // Tu código aquí
  // 1. Verificar que # columnas de A = # filas de B
  // 2. Para cada posición [i,j] del resultado:
  //    C[i,j] = suma de A[i,k] * B[k,j] para todo k
}

export function matrixVectorMultiply(A: Matrix, v: number[]): number[] {
  // Tu código aquí
  // Caso especial de multiplicación de matrices
  // Resultado es un vector
}

// Ejemplo de uso:
const A = [[1, 2], [3, 4]];
const B = [[5, 6], [7, 8]];
console.log(matrixMultiply(A, B));   // [[19, 22], [43, 50]]

const v = [1, 2];
console.log(matrixVectorMultiply(A, v));  // [5, 11]
```

### Parte 5: Matriz Identidad

Implementa funciones para crear y trabajar con matrices especiales:

```typescript
export function identityMatrix(n: number): Matrix {
  // Tu código aquí
  // Crear matriz n×n con 1s en diagonal y 0s en el resto
}

export function zeroMatrix(rows: number, cols: number): Matrix {
  // Tu código aquí
  // Crear matriz de ceros
}

// Ejemplo de uso:
console.log(identityMatrix(3));
// [[1, 0, 0],
//  [0, 1, 0],
//  [0, 0, 1]]
```

### Parte 6: Clase Vector y Matrix (Bonus)

Crea clases para encapsular operaciones:

```typescript
export class Vector {
  constructor(public elements: number[]) {}

  add(other: Vector): Vector { /* ... */ }
  subtract(other: Vector): Vector { /* ... */ }
  scale(k: number): Vector { /* ... */ }
  magnitude(): number { /* ... */ }
  dot(other: Vector): number { /* ... */ }
  normalize(): Vector { /* ... */ }
}

export class Matrix {
  constructor(public data: number[][]) {}

  add(other: Matrix): Matrix { /* ... */ }
  multiply(other: Matrix): Matrix { /* ... */ }
  transpose(): Matrix { /* ... */ }

  static identity(n: number): Matrix { /* ... */ }
  static zeros(rows: number, cols: number): Matrix { /* ... */ }
}
```

---

## ✅ Resultado Esperado

Al finalizar, deberías poder:

1. ✅ Realizar operaciones básicas con vectores (suma, resta, escalar)
2. ✅ Calcular magnitud y producto punto de vectores
3. ✅ Sumar, transponer y multiplicar matrices
4. ✅ Calcular similitud entre vectores con cosine similarity
5. ✅ Crear matrices identidad y de ceros
6. ✅ Entender las dimensiones en multiplicación de matrices

---

## 🧪 Tests

Ejecuta los tests para verificar tu implementación:

```bash
npm test 03-algebra-lineal
```

Los tests verificarán:
- Operaciones vectoriales correctas
- Producto punto y similitud coseno
- Multiplicación de matrices con dimensiones correctas
- Transposición de matrices
- Matriz identidad
- Manejo de errores (dimensiones incompatibles)

---

## 💡 Consejos

1. **Valida dimensiones**: Antes de operar, verifica que las dimensiones sean compatibles
2. **Usa map()**: Para transformaciones elemento por elemento
3. **Usa reduce()**: Para sumas y productos punto
4. **Crea copias**: No modifiques los arrays originales
5. **Precisión numérica**: Usa `toFixed()` para comparaciones

---

## 🎓 Conceptos Clave

- **Ortogonalidad**: Dos vectores son ortogonales si su producto punto es 0
- **Normalización**: Vector unitario (magnitud = 1): `v / ||v||`
- **Similitud coseno**: Mide similitud independiente de la magnitud
- **Transpuesta**: Invierte filas y columnas, útil en ML
- **Matriz identidad**: Elemento neutro de la multiplicación
- **Broadcasting**: Operaciones elemento por elemento requieren mismas dimensiones

---

## 📊 Aplicaciones en ML

**Redes Neuronales:**
```
output = σ(W · x + b)
donde W es una matriz de pesos, x es el input (vector), b es bias
```

**Regresión Lineal:**
```
ŷ = X · w
donde X es la matriz de features, w es el vector de pesos
```

**PCA (Principal Component Analysis):**
```
Usa eigenvalores y eigenvectores para reducir dimensionalidad
```

---

## 📚 Recursos

- [Linear Algebra for ML](https://machinelearningmastery.com/linear-algebra-machine-learning/)
- [Matrix Multiplication Explained](https://www.mathsisfun.com/algebra/matrix-multiplying.html)
- [3Blue1Brown - Essence of Linear Algebra](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)

---

**¡Comienza implementando en `linear-algebra.ts`!** 🚀
