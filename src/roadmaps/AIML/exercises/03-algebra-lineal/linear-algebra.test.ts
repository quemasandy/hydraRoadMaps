import {
  vectorAdd,
  vectorSubtract,
  vectorScalarMultiply,
  vectorMagnitude,
  vectorNormalize,
  dotProduct,
  cosineSimilarity,
  euclideanDistance,
  matrixShape,
  isValidMatrix,
  matrixAdd,
  matrixSubtract,
  matrixScalarMultiply,
  matrixTranspose,
  matrixMultiply,
  matrixVectorMultiply,
  identityMatrix,
  zeroMatrix,
  onesMatrix,
  Vector,
  MatrixClass,
  type Matrix,
} from './linear-algebra';

describe('Vector Operations', () => {
  describe('vectorAdd', () => {
    it('should add two vectors', () => {
      expect(vectorAdd([1, 2, 3], [4, 5, 6])).toEqual([5, 7, 9]);
    });

    it('should throw on different lengths', () => {
      expect(() => vectorAdd([1, 2], [1, 2, 3])).toThrow();
    });
  });

  describe('vectorSubtract', () => {
    it('should subtract two vectors', () => {
      expect(vectorSubtract([5, 7, 9], [1, 2, 3])).toEqual([4, 5, 6]);
    });

    it('should throw on different lengths', () => {
      expect(() => vectorSubtract([1, 2], [1, 2, 3])).toThrow();
    });
  });

  describe('vectorScalarMultiply', () => {
    it('should multiply vector by scalar', () => {
      expect(vectorScalarMultiply([1, 2, 3], 2)).toEqual([2, 4, 6]);
      expect(vectorScalarMultiply([1, 2, 3], 0)).toEqual([0, 0, 0]);
    });

    it('should handle negative scalars', () => {
      expect(vectorScalarMultiply([1, 2, 3], -1)).toEqual([-1, -2, -3]);
    });
  });

  describe('vectorMagnitude', () => {
    it('should calculate magnitude', () => {
      expect(vectorMagnitude([3, 4])).toBe(5);
      expect(vectorMagnitude([1, 0, 0])).toBe(1);
    });

    it('should handle zero vector', () => {
      expect(vectorMagnitude([0, 0, 0])).toBe(0);
    });

    it('should handle empty vector', () => {
      expect(vectorMagnitude([])).toBe(0);
    });

    it('should calculate for arbitrary vectors', () => {
      expect(vectorMagnitude([1, 2, 3])).toBeCloseTo(Math.sqrt(14), 10);
    });
  });

  describe('vectorNormalize', () => {
    it('should normalize vector to unit length', () => {
      const normalized = vectorNormalize([3, 4]);
      expect(normalized[0]).toBeCloseTo(0.6, 10);
      expect(normalized[1]).toBeCloseTo(0.8, 10);
      expect(vectorMagnitude(normalized)).toBeCloseTo(1, 10);
    });

    it('should throw on zero vector', () => {
      expect(() => vectorNormalize([0, 0])).toThrow();
    });
  });

  describe('dotProduct', () => {
    it('should calculate dot product', () => {
      expect(dotProduct([1, 2, 3], [4, 5, 6])).toBe(32);
      expect(dotProduct([1, 0], [0, 1])).toBe(0);
    });

    it('should handle orthogonal vectors', () => {
      expect(dotProduct([1, 0, 0], [0, 1, 0])).toBe(0);
    });

    it('should throw on different lengths', () => {
      expect(() => dotProduct([1, 2], [1, 2, 3])).toThrow();
    });
  });

  describe('cosineSimilarity', () => {
    it('should calculate cosine similarity', () => {
      expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1, 10);
      expect(cosineSimilarity([1, 0], [-1, 0])).toBeCloseTo(-1, 10);
      expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0, 10);
    });

    it('should be between -1 and 1', () => {
      const sim = cosineSimilarity([1, 2, 3], [4, 5, 6]);
      expect(sim).toBeGreaterThanOrEqual(-1);
      expect(sim).toBeLessThanOrEqual(1);
    });

    it('should throw on zero vector', () => {
      expect(() => cosineSimilarity([0, 0], [1, 2])).toThrow();
    });

    it('should throw on different lengths', () => {
      expect(() => cosineSimilarity([1, 2], [1, 2, 3])).toThrow();
    });
  });

  describe('euclideanDistance', () => {
    it('should calculate distance', () => {
      expect(euclideanDistance([0, 0], [3, 4])).toBe(5);
      expect(euclideanDistance([1, 1], [1, 1])).toBe(0);
    });

    it('should be symmetric', () => {
      const v = [1, 2, 3];
      const w = [4, 5, 6];
      expect(euclideanDistance(v, w)).toBe(euclideanDistance(w, v));
    });

    it('should throw on different lengths', () => {
      expect(() => euclideanDistance([1, 2], [1, 2, 3])).toThrow();
    });
  });
});

describe('Matrix Operations', () => {
  describe('matrixShape', () => {
    it('should return shape', () => {
      expect(matrixShape([[1, 2], [3, 4]])).toEqual([2, 2]);
      expect(matrixShape([[1, 2, 3]])).toEqual([1, 3]);
      expect(matrixShape([[1], [2], [3]])).toEqual([3, 1]);
    });

    it('should handle empty matrix', () => {
      expect(matrixShape([])).toEqual([0, 0]);
    });
  });

  describe('isValidMatrix', () => {
    it('should validate consistent dimensions', () => {
      expect(isValidMatrix([[1, 2], [3, 4]])).toBe(true);
      expect(isValidMatrix([[1, 2, 3], [4, 5, 6]])).toBe(true);
    });

    it('should reject inconsistent dimensions', () => {
      expect(isValidMatrix([[1, 2], [3, 4, 5]])).toBe(false);
    });

    it('should handle empty matrix', () => {
      expect(isValidMatrix([])).toBe(true);
    });
  });

  describe('matrixAdd', () => {
    it('should add two matrices', () => {
      const A = [[1, 2], [3, 4]];
      const B = [[5, 6], [7, 8]];
      expect(matrixAdd(A, B)).toEqual([[6, 8], [10, 12]]);
    });

    it('should throw on different dimensions', () => {
      expect(() => matrixAdd([[1, 2]], [[1], [2]])).toThrow();
    });
  });

  describe('matrixSubtract', () => {
    it('should subtract two matrices', () => {
      const A = [[6, 8], [10, 12]];
      const B = [[1, 2], [3, 4]];
      expect(matrixSubtract(A, B)).toEqual([[5, 6], [7, 8]]);
    });

    it('should throw on different dimensions', () => {
      expect(() => matrixSubtract([[1, 2]], [[1], [2]])).toThrow();
    });
  });

  describe('matrixScalarMultiply', () => {
    it('should multiply matrix by scalar', () => {
      const A = [[1, 2], [3, 4]];
      expect(matrixScalarMultiply(A, 2)).toEqual([[2, 4], [6, 8]]);
    });

    it('should handle zero', () => {
      const A = [[1, 2], [3, 4]];
      expect(matrixScalarMultiply(A, 0)).toEqual([[0, 0], [0, 0]]);
    });
  });

  describe('matrixTranspose', () => {
    it('should transpose square matrix', () => {
      const A = [[1, 2], [3, 4]];
      expect(matrixTranspose(A)).toEqual([[1, 3], [2, 4]]);
    });

    it('should transpose rectangular matrix', () => {
      const A = [[1, 2, 3], [4, 5, 6]];
      expect(matrixTranspose(A)).toEqual([[1, 4], [2, 5], [3, 6]]);
    });

    it('should be involutory (A^T^T = A)', () => {
      const A = [[1, 2], [3, 4]];
      const AT = matrixTranspose(A);
      const ATT = matrixTranspose(AT);
      expect(ATT).toEqual(A);
    });

    it('should handle empty matrix', () => {
      expect(matrixTranspose([])).toEqual([]);
    });
  });

  describe('matrixMultiply', () => {
    it('should multiply two matrices', () => {
      const A = [[1, 2], [3, 4]];
      const B = [[5, 6], [7, 8]];
      expect(matrixMultiply(A, B)).toEqual([[19, 22], [43, 50]]);
    });

    it('should multiply rectangular matrices', () => {
      const A = [[1, 2, 3]]; // 1×3
      const B = [[4], [5], [6]]; // 3×1
      expect(matrixMultiply(A, B)).toEqual([[32]]); // 1×1
    });

    it('should multiply with identity', () => {
      const A = [[1, 2], [3, 4]];
      const I = identityMatrix(2);
      expect(matrixMultiply(A, I)).toEqual(A);
      expect(matrixMultiply(I, A)).toEqual(A);
    });

    it('should throw on incompatible dimensions', () => {
      const A = [[1, 2]]; // 1×2
      const B = [[1], [2], [3]]; // 3×1
      expect(() => matrixMultiply(A, B)).toThrow();
    });
  });

  describe('matrixVectorMultiply', () => {
    it('should multiply matrix by vector', () => {
      const A = [[1, 2], [3, 4]];
      const v = [1, 2];
      expect(matrixVectorMultiply(A, v)).toEqual([5, 11]);
    });

    it('should throw on incompatible dimensions', () => {
      const A = [[1, 2]];
      const v = [1, 2, 3];
      expect(() => matrixVectorMultiply(A, v)).toThrow();
    });
  });

  describe('identityMatrix', () => {
    it('should create identity matrix', () => {
      expect(identityMatrix(2)).toEqual([[1, 0], [0, 1]]);
      expect(identityMatrix(3)).toEqual([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]);
    });

    it('should satisfy A × I = A', () => {
      const A = [[1, 2], [3, 4]];
      const I = identityMatrix(2);
      expect(matrixMultiply(A, I)).toEqual(A);
    });

    it('should throw on non-positive size', () => {
      expect(() => identityMatrix(0)).toThrow();
      expect(() => identityMatrix(-1)).toThrow();
    });
  });

  describe('zeroMatrix', () => {
    it('should create zero matrix', () => {
      expect(zeroMatrix(2, 3)).toEqual([[0, 0, 0], [0, 0, 0]]);
    });

    it('should throw on non-positive dimensions', () => {
      expect(() => zeroMatrix(0, 1)).toThrow();
      expect(() => zeroMatrix(1, 0)).toThrow();
    });
  });

  describe('onesMatrix', () => {
    it('should create ones matrix', () => {
      expect(onesMatrix(2, 3)).toEqual([[1, 1, 1], [1, 1, 1]]);
    });

    it('should throw on non-positive dimensions', () => {
      expect(() => onesMatrix(0, 1)).toThrow();
      expect(() => onesMatrix(1, 0)).toThrow();
    });
  });
});

describe('Vector Class', () => {
  let v: Vector;
  let w: Vector;

  beforeEach(() => {
    v = new Vector([1, 2, 3]);
    w = new Vector([4, 5, 6]);
  });

  it('should create vector', () => {
    expect(v.elements).toEqual([1, 2, 3]);
    expect(v.dimension).toBe(3);
  });

  it('should throw on empty vector', () => {
    expect(() => new Vector([])).toThrow();
  });

  it('should add vectors', () => {
    const result = v.add(w);
    expect(result.elements).toEqual([5, 7, 9]);
  });

  it('should subtract vectors', () => {
    const result = w.subtract(v);
    expect(result.elements).toEqual([3, 3, 3]);
  });

  it('should scale vector', () => {
    const result = v.scale(2);
    expect(result.elements).toEqual([2, 4, 6]);
  });

  it('should calculate magnitude', () => {
    const v2 = new Vector([3, 4]);
    expect(v2.magnitude()).toBe(5);
  });

  it('should calculate dot product', () => {
    expect(v.dot(w)).toBe(32);
  });

  it('should normalize vector', () => {
    const normalized = v.normalize();
    expect(normalized.magnitude()).toBeCloseTo(1, 10);
  });

  it('should calculate cosine similarity', () => {
    const v2 = new Vector([1, 0]);
    const w2 = new Vector([1, 0]);
    expect(v2.cosineSimilarity(w2)).toBeCloseTo(1, 10);
  });

  it('should calculate distance', () => {
    const v2 = new Vector([0, 0]);
    const w2 = new Vector([3, 4]);
    expect(v2.distanceTo(w2)).toBe(5);
  });

  it('should have string representation', () => {
    expect(v.toString()).toBe('Vector([1, 2, 3])');
  });
});

describe('MatrixClass', () => {
  let A: MatrixClass;
  let B: MatrixClass;

  beforeEach(() => {
    A = new MatrixClass([[1, 2], [3, 4]]);
    B = new MatrixClass([[5, 6], [7, 8]]);
  });

  it('should create matrix', () => {
    expect(A.data).toEqual([[1, 2], [3, 4]]);
    expect(A.shape).toEqual([2, 2]);
    expect(A.rows).toBe(2);
    expect(A.cols).toBe(2);
  });

  it('should throw on invalid matrix', () => {
    expect(() => new MatrixClass([[1, 2], [3, 4, 5]])).toThrow();
  });

  it('should add matrices', () => {
    const result = A.add(B);
    expect(result.data).toEqual([[6, 8], [10, 12]]);
  });

  it('should subtract matrices', () => {
    const result = B.subtract(A);
    expect(result.data).toEqual([[4, 4], [4, 4]]);
  });

  it('should scale matrix', () => {
    const result = A.scale(2);
    expect(result.data).toEqual([[2, 4], [6, 8]]);
  });

  it('should multiply matrices', () => {
    const result = A.multiply(B);
    expect(result.data).toEqual([[19, 22], [43, 50]]);
  });

  it('should multiply by vector', () => {
    const v = new Vector([1, 2]);
    const result = A.multiplyVector(v);
    expect(result.elements).toEqual([5, 11]);
  });

  it('should transpose matrix', () => {
    const result = A.transpose();
    expect(result.data).toEqual([[1, 3], [2, 4]]);
  });

  it('should create identity matrix', () => {
    const I = MatrixClass.identity(3);
    expect(I.data).toEqual([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]);
  });

  it('should create zero matrix', () => {
    const Z = MatrixClass.zeros(2, 3);
    expect(Z.data).toEqual([[0, 0, 0], [0, 0, 0]]);
  });

  it('should create ones matrix', () => {
    const O = MatrixClass.ones(2, 3);
    expect(O.data).toEqual([[1, 1, 1], [1, 1, 1]]);
  });

  it('should have string representation', () => {
    expect(A.toString()).toBe('Matrix(2×2)');
  });
});
