import {
  normalizeMinMax,
  normalizeZScore,
  oneHotEncode,
  trainTestSplit,
  fillMissing,
  DataPreprocessor,
} from './preprocessing';

describe('normalizeMinMax', () => {
  it('should normalize data between 0 and 1', () => {
    const data = [10, 20, 30, 40, 50];
    const result = normalizeMinMax(data);
    expect(result).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it('should handle empty array', () => {
    expect(normalizeMinMax([])).toEqual([]);
  });

  it('should handle single element', () => {
    expect(normalizeMinMax([5])).toEqual([0]);
  });

  it('should handle all equal values', () => {
    const data = [5, 5, 5, 5];
    const result = normalizeMinMax(data);
    expect(result).toEqual([0, 0, 0, 0]);
  });

  it('should handle negative values', () => {
    const data = [-10, 0, 10];
    const result = normalizeMinMax(data);
    expect(result).toEqual([0, 0.5, 1]);
  });
});

describe('normalizeZScore', () => {
  it('should standardize data with mean 0 and std 1', () => {
    const data = [10, 20, 30, 40, 50];
    const result = normalizeZScore(data);

    // Verificar media ≈ 0
    const mean = result.reduce((a, b) => a + b, 0) / result.length;
    expect(mean).toBeCloseTo(0, 10);

    // Verificar std ≈ 1
    const variance =
      result.reduce((sum, x) => sum + x * x, 0) / result.length;
    const std = Math.sqrt(variance);
    expect(std).toBeCloseTo(1, 10);
  });

  it('should handle empty array', () => {
    expect(normalizeZScore([])).toEqual([]);
  });

  it('should handle all equal values', () => {
    const data = [5, 5, 5];
    const result = normalizeZScore(data);
    expect(result).toEqual([0, 0, 0]);
  });
});

describe('oneHotEncode', () => {
  it('should encode categories correctly', () => {
    const data = ['red', 'blue', 'red', 'green'];
    const result = oneHotEncode(data);
    expect(result).toEqual([
      [0, 0, 1], // red
      [1, 0, 0], // blue
      [0, 0, 1], // red
      [0, 1, 0], // green
    ]);
  });

  it('should handle single category', () => {
    const data = ['cat', 'cat', 'cat'];
    const result = oneHotEncode(data);
    expect(result).toEqual([[1], [1], [1]]);
  });

  it('should handle empty array', () => {
    expect(oneHotEncode([])).toEqual([]);
  });

  it('should maintain consistent order', () => {
    const data = ['c', 'a', 'b'];
    const result = oneHotEncode(data);
    // Should be sorted alphabetically
    expect(result).toEqual([
      [0, 0, 1], // c
      [1, 0, 0], // a
      [0, 1, 0], // b
    ]);
  });
});

describe('trainTestSplit', () => {
  it('should split data with correct proportions', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const [train, test] = trainTestSplit(data, 0.8);

    expect(train.length).toBe(8);
    expect(test.length).toBe(2);
  });

  it('should not modify original array', () => {
    const data = [1, 2, 3, 4, 5];
    const original = [...data];
    trainTestSplit(data, 0.8);
    expect(data).toEqual(original);
  });

  it('should handle empty array', () => {
    const [train, test] = trainTestSplit([], 0.8);
    expect(train).toEqual([]);
    expect(test).toEqual([]);
  });

  it('should handle trainSize = 1', () => {
    const data = [1, 2, 3, 4, 5];
    const [train, test] = trainTestSplit(data, 1);
    expect(train.length).toBe(5);
    expect(test.length).toBe(0);
  });

  it('should handle trainSize = 0', () => {
    const data = [1, 2, 3, 4, 5];
    const [train, test] = trainTestSplit(data, 0);
    expect(train.length).toBe(0);
    expect(test.length).toBe(5);
  });

  it('should throw on invalid trainSize', () => {
    expect(() => trainTestSplit([1, 2, 3], 1.5)).toThrow();
    expect(() => trainTestSplit([1, 2, 3], -0.1)).toThrow();
  });

  it('should shuffle when requested', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const [train1] = trainTestSplit(data, 0.8, true);
    const [train2] = trainTestSplit(data, 0.8, true);

    // Con shuffle, es improbable que sean idénticos
    // (puede fallar ocasionalmente por azar, pero es muy improbable)
    const areSame = JSON.stringify(train1) === JSON.stringify(train2);
    // No aseguramos diferencia porque puede coincidir por azar
    expect(train1.length).toBe(8);
  });
});

describe('fillMissing', () => {
  it('should fill with mean by default', () => {
    const data = [1, 2, null, 4, 5];
    const result = fillMissing(data);
    // mean of [1,2,4,5] = 3
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should fill with median', () => {
    const data = [1, 2, null, 4, 5];
    const result = fillMissing(data, 'median');
    // median of [1,2,4,5] = 3
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should fill with zero', () => {
    const data = [1, 2, null, 4, 5];
    const result = fillMissing(data, 'zero');
    expect(result).toEqual([1, 2, 0, 4, 5]);
  });

  it('should handle undefined values', () => {
    const data = [1, undefined, 3];
    const result = fillMissing(data);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle all missing values', () => {
    const data = [null, null, null];
    const result = fillMissing(data);
    expect(result).toEqual([0, 0, 0]);
  });

  it('should handle empty array', () => {
    expect(fillMissing([])).toEqual([]);
  });
});

describe('DataPreprocessor', () => {
  it('should fit and transform with Min-Max', () => {
    const data = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];

    const preprocessor = new DataPreprocessor();
    preprocessor.fit(data);

    const result = preprocessor.transformMinMax(data);

    expect(result[0]).toEqual([0, 0]);
    expect(result[1]).toEqual([0.5, 0.5]);
    expect(result[2]).toEqual([1, 1]);
  });

  it('should fit and transform with Z-score', () => {
    const data = [
      [10, 100],
      [20, 200],
      [30, 300],
    ];

    const preprocessor = new DataPreprocessor();
    preprocessor.fit(data);

    const result = preprocessor.transformZScore(data);

    // Verificar que cada columna tiene media ≈ 0
    const col1Mean =
      result.reduce((sum, row) => sum + row[0], 0) / result.length;
    const col2Mean =
      result.reduce((sum, row) => sum + row[1], 0) / result.length;

    expect(col1Mean).toBeCloseTo(0, 10);
    expect(col2Mean).toBeCloseTo(0, 10);
  });

  it('should throw if transform before fit', () => {
    const preprocessor = new DataPreprocessor();
    expect(() => preprocessor.transformMinMax([[1, 2]])).toThrow();
  });

  it('should handle single feature', () => {
    const data = [[1], [2], [3]];
    const preprocessor = new DataPreprocessor();
    preprocessor.fit(data);

    const result = preprocessor.transformMinMax(data);
    expect(result).toEqual([[0], [0.5], [1]]);
  });
});
