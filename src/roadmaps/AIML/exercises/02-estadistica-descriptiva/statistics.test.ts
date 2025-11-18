import {
  mean,
  median,
  mode,
  variance,
  standardDeviation,
  range,
  covariance,
  correlation,
  percentile,
  quartiles,
  iqr,
  detectOutliers,
  Statistics,
} from './statistics';

describe('mean', () => {
  it('should calculate the mean of a dataset', () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3);
    expect(mean([10, 20, 30])).toBe(20);
  });

  it('should handle negative numbers', () => {
    expect(mean([-10, 0, 10])).toBe(0);
    expect(mean([-5, -10, -15])).toBe(-10);
  });

  it('should handle decimal numbers', () => {
    expect(mean([1.5, 2.5, 3.5])).toBeCloseTo(2.5, 10);
  });

  it('should throw on empty array', () => {
    expect(() => mean([])).toThrow();
  });

  it('should handle single element', () => {
    expect(mean([42])).toBe(42);
  });
});

describe('median', () => {
  it('should calculate median of odd-length array', () => {
    expect(median([1, 2, 3, 4, 5])).toBe(3);
    expect(median([5, 1, 3])).toBe(3);
  });

  it('should calculate median of even-length array', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
    expect(median([10, 20])).toBe(15);
  });

  it('should handle unsorted data', () => {
    expect(median([5, 1, 3, 2, 4])).toBe(3);
  });

  it('should handle duplicates', () => {
    expect(median([1, 2, 2, 3])).toBe(2);
  });

  it('should throw on empty array', () => {
    expect(() => median([])).toThrow();
  });

  it('should handle single element', () => {
    expect(median([42])).toBe(42);
  });
});

describe('mode', () => {
  it('should find single mode', () => {
    expect(mode([1, 2, 2, 3])).toEqual([2]);
    expect(mode([5, 5, 5, 1, 2, 3])).toEqual([5]);
  });

  it('should find multiple modes', () => {
    expect(mode([1, 1, 2, 2, 3])).toEqual([1, 2]);
    expect(mode([5, 5, 10, 10])).toEqual([5, 10]);
  });

  it('should return empty array when all values are unique', () => {
    expect(mode([1, 2, 3, 4, 5])).toEqual([]);
  });

  it('should handle empty array', () => {
    expect(mode([])).toEqual([]);
  });

  it('should sort modes', () => {
    const result = mode([3, 3, 1, 1, 2, 2]);
    expect(result).toEqual([1, 2, 3]);
  });
});

describe('variance', () => {
  it('should calculate population variance', () => {
    const data = [1, 2, 3, 4, 5];
    expect(variance(data, false)).toBe(2);
  });

  it('should calculate sample variance', () => {
    const data = [1, 2, 3, 4, 5];
    expect(variance(data, true)).toBe(2.5);
  });

  it('should handle zero variance', () => {
    expect(variance([5, 5, 5, 5])).toBe(0);
  });

  it('should throw on empty array', () => {
    expect(() => variance([])).toThrow();
  });

  it('should throw on single element with sample=true', () => {
    expect(() => variance([5], true)).toThrow();
  });
});

describe('standardDeviation', () => {
  it('should calculate population standard deviation', () => {
    const data = [1, 2, 3, 4, 5];
    expect(standardDeviation(data, false)).toBeCloseTo(Math.sqrt(2), 10);
  });

  it('should calculate sample standard deviation', () => {
    const data = [1, 2, 3, 4, 5];
    expect(standardDeviation(data, true)).toBeCloseTo(Math.sqrt(2.5), 10);
  });

  it('should handle zero standard deviation', () => {
    expect(standardDeviation([5, 5, 5])).toBe(0);
  });

  it('should throw on empty array', () => {
    expect(() => standardDeviation([])).toThrow();
  });
});

describe('range', () => {
  it('should calculate range', () => {
    expect(range([1, 2, 3, 4, 5])).toBe(4);
    expect(range([10, 20, 30])).toBe(20);
  });

  it('should handle negative numbers', () => {
    expect(range([-10, 0, 10])).toBe(20);
  });

  it('should handle zero range', () => {
    expect(range([5, 5, 5])).toBe(0);
  });

  it('should throw on empty array', () => {
    expect(() => range([])).toThrow();
  });
});

describe('covariance', () => {
  it('should calculate positive covariance', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [2, 4, 6, 8, 10];
    expect(covariance(x, y)).toBeCloseTo(4, 10);
  });

  it('should calculate negative covariance', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [10, 8, 6, 4, 2];
    expect(covariance(x, y)).toBeCloseTo(-4, 10);
  });

  it('should calculate zero covariance', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [5, 5, 5, 5, 5];
    expect(covariance(x, y)).toBe(0);
  });

  it('should throw on different lengths', () => {
    expect(() => covariance([1, 2, 3], [1, 2])).toThrow();
  });

  it('should throw on empty arrays', () => {
    expect(() => covariance([], [])).toThrow();
  });

  it('should handle sample covariance', () => {
    const x = [1, 2, 3];
    const y = [2, 4, 6];
    const popCov = covariance(x, y, false);
    const sampleCov = covariance(x, y, true);
    expect(sampleCov).toBeGreaterThan(popCov);
  });
});

describe('correlation', () => {
  it('should calculate perfect positive correlation', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [2, 4, 6, 8, 10];
    expect(correlation(x, y)).toBeCloseTo(1, 10);
  });

  it('should calculate perfect negative correlation', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [10, 8, 6, 4, 2];
    expect(correlation(x, y)).toBeCloseTo(-1, 10);
  });

  it('should calculate zero correlation', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [5, 5, 5, 5, 5];
    expect(correlation(x, y)).toBe(0);
  });

  it('should be between -1 and 1', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [1, 3, 2, 5, 4];
    const corr = correlation(x, y);
    expect(corr).toBeGreaterThanOrEqual(-1);
    expect(corr).toBeLessThanOrEqual(1);
  });

  it('should throw on different lengths', () => {
    expect(() => correlation([1, 2, 3], [1, 2])).toThrow();
  });

  it('should throw on empty arrays', () => {
    expect(() => correlation([], [])).toThrow();
  });
});

describe('percentile', () => {
  it('should calculate 50th percentile (median)', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(percentile(data, 50)).toBe(5.5);
  });

  it('should calculate 25th percentile', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(percentile(data, 25)).toBeCloseTo(3.25, 10);
  });

  it('should calculate 75th percentile', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(percentile(data, 75)).toBeCloseTo(7.75, 10);
  });

  it('should handle 0th percentile (min)', () => {
    const data = [1, 2, 3, 4, 5];
    expect(percentile(data, 0)).toBe(1);
  });

  it('should handle 100th percentile (max)', () => {
    const data = [1, 2, 3, 4, 5];
    expect(percentile(data, 100)).toBe(5);
  });

  it('should handle unsorted data', () => {
    const data = [5, 1, 3, 2, 4];
    expect(percentile(data, 50)).toBe(3);
  });

  it('should throw on invalid percentile', () => {
    expect(() => percentile([1, 2, 3], -1)).toThrow();
    expect(() => percentile([1, 2, 3], 101)).toThrow();
  });

  it('should throw on empty array', () => {
    expect(() => percentile([], 50)).toThrow();
  });

  it('should handle single element', () => {
    expect(percentile([42], 50)).toBe(42);
  });
});

describe('quartiles', () => {
  it('should calculate quartiles', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const [q1, q2, q3] = quartiles(data);
    expect(q1).toBeCloseTo(3.25, 10);
    expect(q2).toBe(5.5);
    expect(q3).toBeCloseTo(7.75, 10);
  });

  it('should have Q2 equal to median', () => {
    const data = [1, 2, 3, 4, 5];
    const [, q2] = quartiles(data);
    expect(q2).toBe(median(data));
  });

  it('should throw on empty array', () => {
    expect(() => quartiles([])).toThrow();
  });
});

describe('iqr', () => {
  it('should calculate interquartile range', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(iqr(data)).toBeCloseTo(4.5, 10);
  });

  it('should be Q3 - Q1', () => {
    const data = [1, 2, 3, 4, 5];
    const [q1, , q3] = quartiles(data);
    expect(iqr(data)).toBeCloseTo(q3 - q1, 10);
  });
});

describe('detectOutliers', () => {
  it('should detect outliers using IQR method', () => {
    const data = [10, 12, 13, 12, 11, 13, 14, 100, 12, 11];
    const outliers = detectOutliers(data);
    expect(outliers).toContain(7); // Index of 100
  });

  it('should return empty array when no outliers', () => {
    const data = [1, 2, 3, 4, 5];
    expect(detectOutliers(data)).toEqual([]);
  });

  it('should handle empty array', () => {
    expect(detectOutliers([])).toEqual([]);
  });

  it('should detect multiple outliers', () => {
    const data = [1, 2, 3, 4, 5, 100, 200];
    const outliers = detectOutliers(data);
    expect(outliers.length).toBeGreaterThan(0);
  });
});

describe('Statistics class', () => {
  let stats: Statistics;

  beforeEach(() => {
    stats = new Statistics([1, 2, 3, 4, 5]);
  });

  it('should calculate mean', () => {
    expect(stats.mean()).toBe(3);
  });

  it('should calculate median', () => {
    expect(stats.median()).toBe(3);
  });

  it('should calculate mode', () => {
    const statsWithMode = new Statistics([1, 2, 2, 3]);
    expect(statsWithMode.mode()).toEqual([2]);
  });

  it('should calculate variance', () => {
    expect(stats.variance()).toBe(2);
  });

  it('should calculate standard deviation', () => {
    expect(stats.std()).toBeCloseTo(Math.sqrt(2), 10);
  });

  it('should calculate range', () => {
    expect(stats.range()).toBe(4);
  });

  it('should calculate quartiles', () => {
    const [q1, q2, q3] = stats.quartiles();
    expect(q2).toBe(3); // Median
    expect(q1).toBeLessThan(q2);
    expect(q3).toBeGreaterThan(q2);
  });

  it('should generate complete summary', () => {
    const summary = stats.summary();

    expect(summary.count).toBe(5);
    expect(summary.mean).toBe(3);
    expect(summary.median).toBe(3);
    expect(summary.min).toBe(1);
    expect(summary.max).toBe(5);
    expect(summary.range).toBe(4);
    expect(summary.std).toBeCloseTo(Math.sqrt(2), 10);
    expect(summary.variance).toBe(2);
    expect(summary.q1).toBeLessThan(summary.q2);
    expect(summary.q3).toBeGreaterThan(summary.q2);
    expect(summary.iqr).toBeCloseTo(summary.q3 - summary.q1, 10);
  });

  it('should cache values', () => {
    const mean1 = stats.mean();
    const mean2 = stats.mean();
    expect(mean1).toBe(mean2);
  });

  it('should detect outliers', () => {
    const statsWithOutliers = new Statistics([1, 2, 3, 4, 5, 100]);
    const outliers = statsWithOutliers.outliers();
    expect(outliers.length).toBeGreaterThan(0);
  });

  it('should throw on empty data', () => {
    expect(() => new Statistics([])).toThrow();
  });

  it('should handle real-world data', () => {
    const prices = [250000, 300000, 275000, 450000, 280000, 290000, 320000];
    const priceStats = new Statistics(prices);
    const summary = priceStats.summary();

    expect(summary.count).toBe(7);
    expect(summary.mean).toBeCloseTo(309285.71, 2);
    expect(summary.min).toBe(250000);
    expect(summary.max).toBe(450000);
  });
});
