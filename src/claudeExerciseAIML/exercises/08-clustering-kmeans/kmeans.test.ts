import {
  euclideanDistance,
  computeInertia,
  kMeans,
  kMeansPlusPlus,
  kMeansBest,
  elbowMethod,
  silhouetteScore,
  predict,
} from './kmeans';

describe('Utility Functions', () => {
  describe('euclideanDistance', () => {
    it('should calculate distance between points', () => {
      expect(euclideanDistance([0, 0], [3, 4])).toBe(5);
      expect(euclideanDistance([1, 1], [1, 1])).toBe(0);
    });

    it('should handle multi-dimensional points', () => {
      const dist = euclideanDistance([1, 2, 3], [4, 6, 8]);
      expect(dist).toBeCloseTo(7.071, 2);
    });

    it('should be symmetric', () => {
      const d1 = euclideanDistance([1, 2], [3, 4]);
      const d2 = euclideanDistance([3, 4], [1, 2]);
      expect(d1).toBe(d2);
    });
  });

  describe('computeInertia', () => {
    it('should calculate inertia correctly', () => {
      const X = [[0, 0], [1, 1], [10, 10], [11, 11]];
      const centroids = [[0.5, 0.5], [10.5, 10.5]];
      const labels = [0, 0, 1, 1];

      const inertia = computeInertia(X, centroids, labels);
      expect(inertia).toBeGreaterThan(0);
    });

    it('should return 0 for perfect clustering', () => {
      const X = [[0, 0], [10, 10]];
      const centroids = [[0, 0], [10, 10]];
      const labels = [0, 1];

      const inertia = computeInertia(X, centroids, labels);
      expect(inertia).toBe(0);
    });

    it('should decrease with better clustering', () => {
      const X = [[0, 0], [1, 1], [10, 10], [11, 11]];

      // Bad clustering: all in one cluster
      const labels1 = [0, 0, 0, 0];
      const centroids1 = [[5.5, 5.5]];
      const inertia1 = computeInertia(X, centroids1, labels1);

      // Good clustering: two clusters
      const labels2 = [0, 0, 1, 1];
      const centroids2 = [[0.5, 0.5], [10.5, 10.5]];
      const inertia2 = computeInertia(X, centroids2, labels2);

      expect(inertia2).toBeLessThan(inertia1);
    });
  });
});

describe('K-Means Algorithm', () => {
  let X: number[][];

  beforeEach(() => {
    // Well-separated clusters
    X = [
      [1, 1], [1.5, 2], [2, 1.5],       // Cluster 0
      [10, 10], [10.5, 11], [11, 10.5], // Cluster 1
    ];
  });

  describe('kMeans', () => {
    it('should cluster data correctly', () => {
      const result = kMeans(X, 2);

      expect(result.centroids.length).toBe(2);
      expect(result.labels.length).toBe(X.length);
      expect(result.inertia).toBeGreaterThanOrEqual(0);
      expect(result.iterations).toBeGreaterThan(0);
    });

    it('should converge', () => {
      const result = kMeans(X, 2, 100);
      expect(result.iterations).toBeLessThanOrEqual(100);
    });

    it('should identify well-separated clusters', () => {
      const result = kMeans(X, 2, 100);

      // Points 0,1,2 should be in one cluster
      // Points 3,4,5 should be in another
      const cluster0 = result.labels.slice(0, 3);
      const cluster1 = result.labels.slice(3, 6);

      // All points in first half should have same label
      expect(cluster0[0]).toBe(cluster0[1]);
      expect(cluster0[1]).toBe(cluster0[2]);

      // All points in second half should have same label
      expect(cluster1[0]).toBe(cluster1[1]);
      expect(cluster1[1]).toBe(cluster1[2]);

      // The two clusters should be different
      expect(cluster0[0]).not.toBe(cluster1[0]);
    });

    it('should throw on invalid K', () => {
      expect(() => kMeans(X, 0)).toThrow();
      expect(() => kMeans(X, -1)).toThrow();
      expect(() => kMeans(X, X.length + 1)).toThrow();
    });

    it('should handle K=1', () => {
      const result = kMeans(X, 1);
      expect(result.labels.every(l => l === 0)).toBe(true);
    });

    it('should handle K=n (each point is its own cluster)', () => {
      const result = kMeans(X, X.length);
      expect(new Set(result.labels).size).toBe(X.length);
      expect(result.inertia).toBeCloseTo(0, 5);
    });
  });

  describe('kMeansPlusPlus', () => {
    it('should cluster data correctly', () => {
      const result = kMeansPlusPlus(X, 2);

      expect(result.centroids.length).toBe(2);
      expect(result.labels.length).toBe(X.length);
      expect(result.inertia).toBeGreaterThanOrEqual(0);
    });

    it('should generally converge faster than random init', () => {
      let kmeansIters = 0;
      let kppIters = 0;

      for (let i = 0; i < 10; i++) {
        const r1 = kMeans(X, 2);
        const r2 = kMeansPlusPlus(X, 2);
        kmeansIters += r1.iterations;
        kppIters += r2.iterations;
      }

      // K-Means++ should generally converge faster
      // (not guaranteed but very likely)
      expect(kppIters / 10).toBeLessThanOrEqual(kmeansIters / 10 + 5);
    });

    it('should give better or equal inertia than random init', () => {
      const r1 = kMeans(X, 2);
      const r2 = kMeansPlusPlus(X, 2);

      // K-Means++ should give similar or better result
      // (not guaranteed but very likely with well-separated clusters)
      expect(r2.inertia).toBeLessThanOrEqual(r1.inertia * 1.5);
    });
  });

  describe('kMeansBest', () => {
    it('should return best result from multiple runs', () => {
      const result = kMeansBest(X, 2, 10, true);

      expect(result.centroids.length).toBe(2);
      expect(result.labels.length).toBe(X.length);
    });

    it('should give better results with more initializations', () => {
      const result1 = kMeansBest(X, 2, 1, false);
      const result10 = kMeansBest(X, 2, 10, false);

      // More runs should give equal or better inertia
      expect(result10.inertia).toBeLessThanOrEqual(result1.inertia);
    });

    it('should use K-Means++ when specified', () => {
      const resultPP = kMeansBest(X, 2, 5, true);
      const resultRandom = kMeansBest(X, 2, 5, false);

      // Both should give reasonable results
      expect(resultPP.inertia).toBeGreaterThan(0);
      expect(resultRandom.inertia).toBeGreaterThan(0);
    });
  });
});

describe('Elbow Method', () => {
  it('should compute inertias for different K', () => {
    const X = [
      [1, 1], [2, 2], [3, 3],
      [10, 10], [11, 11], [12, 12],
    ];

    const result = elbowMethod(X, 4, 2);

    expect(result.K_values).toEqual([1, 2, 3, 4]);
    expect(result.inertias.length).toBe(4);
    expect(result.optimalK).toBeGreaterThanOrEqual(1);
    expect(result.optimalK).toBeLessThanOrEqual(4);
  });

  it('should show decreasing inertia', () => {
    const X = [
      [1, 1], [2, 2],
      [10, 10], [11, 11],
      [20, 20], [21, 21],
    ];

    const result = elbowMethod(X, 5, 2);

    // Inertia should generally decrease as K increases
    for (let i = 1; i < result.inertias.length; i++) {
      expect(result.inertias[i]).toBeLessThanOrEqual(result.inertias[i - 1]);
    }
  });

  it('should suggest reasonable K for well-separated data', () => {
    const X = [
      [1, 1], [1.5, 1.5], [2, 2],
      [10, 10], [10.5, 10.5], [11, 11],
    ];

    const result = elbowMethod(X, 5, 3);

    // Should suggest K=2 or K=3 for this data
    expect(result.optimalK).toBeGreaterThanOrEqual(2);
    expect(result.optimalK).toBeLessThanOrEqual(3);
  });
});

describe('Silhouette Score', () => {
  it('should calculate silhouette score', () => {
    const X = [[1, 1], [2, 2], [10, 10], [11, 11]];
    const labels = [0, 0, 1, 1];

    const score = silhouetteScore(X, labels);

    // Good clustering should have score > 0.5
    expect(score).toBeGreaterThan(0.5);
  });

  it('should return 0 for single cluster', () => {
    const X = [[1, 1], [2, 2], [3, 3]];
    const labels = [0, 0, 0];

    const score = silhouetteScore(X, labels);
    expect(score).toBe(0);
  });

  it('should give higher score for better clustering', () => {
    const X = [[1, 1], [2, 2], [10, 10], [11, 11]];

    // Good clustering
    const labels1 = [0, 0, 1, 1];
    const score1 = silhouetteScore(X, labels1);

    // Bad clustering
    const labels2 = [0, 1, 0, 1];
    const score2 = silhouetteScore(X, labels2);

    expect(score1).toBeGreaterThan(score2);
  });

  it('should be between -1 and 1', () => {
    const X = [[1, 1], [2, 2], [3, 3], [4, 4]];
    const labels = [0, 0, 1, 1];

    const score = silhouetteScore(X, labels);

    expect(score).toBeGreaterThanOrEqual(-1);
    expect(score).toBeLessThanOrEqual(1);
  });
});

describe('Predict', () => {
  it('should assign new points to nearest centroids', () => {
    const centroids = [[0, 0], [10, 10]];
    const X_new = [[1, 1], [9, 9], [11, 11]];

    const labels = predict(X_new, centroids);

    expect(labels[0]).toBe(0); // Closest to [0, 0]
    expect(labels[1]).toBe(1); // Closest to [10, 10]
    expect(labels[2]).toBe(1); // Closest to [10, 10]
  });

  it('should work with multi-dimensional data', () => {
    const centroids = [[1, 1, 1], [10, 10, 10]];
    const X_new = [[0, 0, 0], [11, 11, 11]];

    const labels = predict(X_new, centroids);

    expect(labels[0]).toBe(0);
    expect(labels[1]).toBe(1);
  });
});

describe('Real-world scenarios', () => {
  it('should segment customers into groups', () => {
    // Customer data: [income, age]
    const X = [
      [30, 25], [35, 28], [40, 30],     // Young, low income
      [80, 45], [75, 40], [85, 48],     // Middle-aged, medium income
      [150, 55], [145, 52], [155, 58],  // Older, high income
    ];

    const result = kMeansPlusPlus(X, 3);

    // Should create 3 distinct groups
    const uniqueLabels = new Set(result.labels);
    expect(uniqueLabels.size).toBe(3);

    // Silhouette score should be reasonable
    const score = silhouetteScore(X, result.labels);
    expect(score).toBeGreaterThan(0);
  });

  it('should compress image colors', () => {
    // RGB values
    const colors = [
      [255, 0, 0], [250, 5, 5],       // Red cluster
      [0, 255, 0], [5, 250, 5],       // Green cluster
      [0, 0, 255], [5, 5, 250],       // Blue cluster
    ];

    const result = kMeansPlusPlus(colors, 3);

    // Should identify 3 color clusters
    expect(new Set(result.labels).size).toBe(3);

    // Inertia should be small (colors are distinct)
    expect(result.inertia).toBeLessThan(1000);
  });

  it('should find optimal K for various datasets', () => {
    // Dataset with 2 clear clusters
    const X = [
      [1, 1], [1.5, 1.5], [2, 2], [2.5, 2.5],
      [10, 10], [10.5, 10.5], [11, 11], [11.5, 11.5],
    ];

    const result = elbowMethod(X, 5, 3);

    // Should suggest K=2
    expect(result.optimalK).toBe(2);
  });

  it('should handle noisy data', () => {
    // Main clusters with some noise
    const X = [
      [1, 1], [1.2, 1.1], [0.9, 1.2],
      [10, 10], [10.1, 9.9], [9.8, 10.2],
      [5, 5], // Noise point
    ];

    const result = kMeansPlusPlus(X, 2);

    // Should still identify 2 main clusters
    expect(result.centroids.length).toBe(2);
  });

  it('should work with high-dimensional data', () => {
    // 5-dimensional data
    const X = [
      [1, 1, 1, 1, 1],
      [1.1, 1.1, 1.1, 1.1, 1.1],
      [10, 10, 10, 10, 10],
      [10.1, 10.1, 10.1, 10.1, 10.1],
    ];

    const result = kMeansPlusPlus(X, 2);

    expect(result.labels[0]).toBe(result.labels[1]);
    expect(result.labels[2]).toBe(result.labels[3]);
    expect(result.labels[0]).not.toBe(result.labels[2]);
  });
});
