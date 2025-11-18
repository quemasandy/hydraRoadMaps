import {
  computeGini,
  computeEntropy,
  computeInformationGain,
  DecisionTreeClassifier,
} from './decision-tree';

describe('Impurity Functions', () => {
  describe('computeGini', () => {
    it('should return 0 for pure set', () => {
      expect(computeGini([1, 1, 1, 1])).toBe(0);
      expect(computeGini([0, 0, 0])).toBe(0);
    });

    it('should return 0.5 for binary 50-50 split', () => {
      const gini = computeGini([0, 1, 0, 1]);
      expect(gini).toBeCloseTo(0.5, 5);
    });

    it('should handle multiclass', () => {
      const gini = computeGini([0, 1, 2, 0, 1, 2]);
      // 1 - 3*(1/3)² = 1 - 3/9 = 2/3
      expect(gini).toBeCloseTo(2 / 3, 5);
    });

    it('should return 0 for empty array', () => {
      expect(computeGini([])).toBe(0);
    });

    it('should return 0 for single element', () => {
      expect(computeGini([1])).toBe(0);
    });
  });

  describe('computeEntropy', () => {
    it('should return 0 for pure set', () => {
      expect(computeEntropy([1, 1, 1, 1])).toBe(0);
    });

    it('should return 1 for binary 50-50 split', () => {
      const entropy = computeEntropy([0, 1, 0, 1]);
      expect(entropy).toBeCloseTo(1, 5);
    });

    it('should handle multiclass', () => {
      const entropy = computeEntropy([0, 1, 2, 0, 1, 2]);
      // -3*(1/3*log2(1/3)) = -log2(1/3) ≈ 1.585
      expect(entropy).toBeCloseTo(1.585, 2);
    });

    it('should return 0 for empty array', () => {
      expect(computeEntropy([])).toBe(0);
    });
  });

  describe('computeInformationGain', () => {
    it('should return maximum gain for perfect split', () => {
      const y_parent = [0, 0, 1, 1];
      const y_left = [0, 0];
      const y_right = [1, 1];

      const ig = computeInformationGain(y_parent, y_left, y_right);
      expect(ig).toBeCloseTo(1, 5); // Perfect split removes all entropy
    });

    it('should return 0 gain for no split', () => {
      const y_parent = [0, 1, 0, 1];
      const y_left = [0, 1];
      const y_right = [0, 1];

      const ig = computeInformationGain(y_parent, y_left, y_right);
      expect(ig).toBeCloseTo(0, 5);
    });

    it('should return positive gain for useful split', () => {
      const y_parent = [0, 0, 0, 1, 1, 1];
      const y_left = [0, 0, 0];
      const y_right = [1, 1, 1];

      const ig = computeInformationGain(y_parent, y_left, y_right);
      expect(ig).toBeGreaterThan(0);
    });
  });
});

describe('DecisionTreeClassifier', () => {
  describe('Basic Functionality', () => {
    let X: number[][];
    let y: number[];

    beforeEach(() => {
      // Linearly separable data
      X = [
        [1, 1], [2, 2], [3, 3],       // Class 0
        [10, 10], [11, 11], [12, 12], // Class 1
      ];
      y = [0, 0, 0, 1, 1, 1];
    });

    it('should train successfully', () => {
      const tree = new DecisionTreeClassifier();
      expect(() => tree.fit(X, y)).not.toThrow();
    });

    it('should throw on mismatched dimensions', () => {
      const tree = new DecisionTreeClassifier();
      expect(() => tree.fit([[1]], [1, 2])).toThrow();
    });

    it('should make predictions', () => {
      const tree = new DecisionTreeClassifier();
      tree.fit(X, y);

      const predictions = tree.predict(X);
      expect(predictions.length).toBe(X.length);
    });

    it('should achieve perfect accuracy on simple data', () => {
      const tree = new DecisionTreeClassifier();
      tree.fit(X, y);

      const predictions = tree.predict(X);
      const accuracy = predictions.filter((p, i) => p === y[i]).length / y.length;

      expect(accuracy).toBe(1);
    });

    it('should throw when predicting before training', () => {
      const tree = new DecisionTreeClassifier();
      expect(() => tree.predict([[1, 2]])).toThrow();
    });
  });

  describe('Configuration', () => {
    const X = [[1], [2], [3], [4], [5], [6]];
    const y = [0, 0, 0, 1, 1, 1];

    it('should respect maxDepth', () => {
      const tree1 = new DecisionTreeClassifier({ maxDepth: 1 });
      const tree10 = new DecisionTreeClassifier({ maxDepth: 10 });

      tree1.fit(X, y);
      tree10.fit(X, y);

      expect(tree1.getDepth()).toBeLessThanOrEqual(1);
      expect(tree10.getDepth()).toBeGreaterThan(0);
    });

    it('should respect minSamplesSplit', () => {
      const tree = new DecisionTreeClassifier({ minSamplesSplit: 10 });
      tree.fit(X, y);

      // With 6 samples and minSamplesSplit=10, should create just a leaf
      expect(tree.getDepth()).toBe(1);
      expect(tree.getNumLeaves()).toBe(1);
    });

    it('should respect minSamplesLeaf', () => {
      const tree = new DecisionTreeClassifier({ minSamplesLeaf: 4 });
      tree.fit(X, y);

      // With minSamplesLeaf=4 and 6 samples, can't split into leaves with 3 each
      expect(tree.getDepth()).toBe(1);
    });

    it('should work with gini criterion', () => {
      const tree = new DecisionTreeClassifier({ criterion: 'gini' });
      tree.fit(X, y);

      const predictions = tree.predict(X);
      expect(predictions.length).toBe(X.length);
    });

    it('should work with entropy criterion', () => {
      const tree = new DecisionTreeClassifier({ criterion: 'entropy' });
      tree.fit(X, y);

      const predictions = tree.predict(X);
      expect(predictions.length).toBe(X.length);
    });
  });

  describe('Tree Structure', () => {
    it('should create single leaf for pure data', () => {
      const X = [[1], [2], [3]];
      const y = [1, 1, 1];

      const tree = new DecisionTreeClassifier();
      tree.fit(X, y);

      expect(tree.getDepth()).toBe(1);
      expect(tree.getNumLeaves()).toBe(1);
    });

    it('should create deeper tree for complex data', () => {
      const X = [
        [1, 1], [1, 2], [2, 1], [2, 2],
        [5, 5], [5, 6], [6, 5], [6, 6],
      ];
      const y = [0, 0, 0, 0, 1, 1, 1, 1];

      const tree = new DecisionTreeClassifier({ maxDepth: 10 });
      tree.fit(X, y);

      expect(tree.getDepth()).toBeGreaterThan(1);
    });

    it('should have leaves equal to depth for perfectly balanced binary tree', () => {
      const X = [[1], [2], [3], [4]];
      const y = [0, 0, 1, 1];

      const tree = new DecisionTreeClassifier();
      tree.fit(X, y);

      // Should create a simple split
      expect(tree.getNumLeaves()).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Predictions', () => {
    it('should predict single example', () => {
      const X = [[1], [2], [10], [11]];
      const y = [0, 0, 1, 1];

      const tree = new DecisionTreeClassifier();
      tree.fit(X, y);

      const pred1 = tree.predictOne([1.5]);
      const pred2 = tree.predictOne([10.5]);

      expect(pred1).toBe(0);
      expect(pred2).toBe(1);
    });

    it('should handle new data points', () => {
      const X = [[1], [2], [10], [11]];
      const y = [0, 0, 1, 1];

      const tree = new DecisionTreeClassifier();
      tree.fit(X, y);

      const newData = [[0], [5], [12]];
      const predictions = tree.predict(newData);

      expect(predictions[0]).toBe(0); // Close to [1,2]
      expect(predictions[2]).toBe(1); // Close to [10,11]
    });

    it('should handle multi-feature data', () => {
      const X = [
        [1, 1], [1, 2],
        [10, 10], [10, 11],
      ];
      const y = [0, 0, 1, 1];

      const tree = new DecisionTreeClassifier();
      tree.fit(X, y);

      const predictions = tree.predict([[1, 1.5], [10, 10.5]]);
      expect(predictions[0]).toBe(0);
      expect(predictions[1]).toBe(1);
    });
  });

  describe('Multiclass Classification', () => {
    it('should handle 3 classes', () => {
      const X = [
        [1], [2],
        [5], [6],
        [10], [11],
      ];
      const y = [0, 0, 1, 1, 2, 2];

      const tree = new DecisionTreeClassifier();
      tree.fit(X, y);

      const predictions = tree.predict(X);
      const accuracy = predictions.filter((p, i) => p === y[i]).length / y.length;

      expect(accuracy).toBeGreaterThan(0.5);
    });

    it('should handle more classes', () => {
      const X = [[1], [2], [3], [4], [5]];
      const y = [0, 1, 2, 3, 4];

      const tree = new DecisionTreeClassifier();
      tree.fit(X, y);

      const predictions = tree.predict(X);
      expect(predictions.length).toBe(y.length);
    });
  });

  describe('Overfitting', () => {
    it('shallow tree should generalize better than deep tree', () => {
      // Create training data with some noise
      const X_train = [
        [1, 1], [1.1, 1.1], [1.2, 0.9],
        [5, 5], [5.1, 5.1], [4.9, 5.2],
      ];
      const y_train = [0, 0, 0, 1, 1, 1];

      // Test data
      const X_test = [[1.5, 1.5], [4.5, 4.5]];
      const y_test = [0, 1];

      const shallowTree = new DecisionTreeClassifier({ maxDepth: 2 });
      const deepTree = new DecisionTreeClassifier({ maxDepth: 10 });

      shallowTree.fit(X_train, y_train);
      deepTree.fit(X_train, y_train);

      // Both should do well on training
      const trainPredShallow = shallowTree.predict(X_train);
      const trainPredDeep = deepTree.predict(X_train);

      const trainAccShallow = trainPredShallow.filter((p, i) => p === y_train[i]).length / y_train.length;
      const trainAccDeep = trainPredDeep.filter((p, i) => p === y_train[i]).length / y_train.length;

      expect(trainAccShallow).toBeGreaterThan(0.5);
      expect(trainAccDeep).toBeGreaterThan(0.5);
    });
  });

  describe('Real-world scenarios', () => {
    it('should classify iris-like dataset', () => {
      // Simplified iris dataset
      const X = [
        [5.1, 3.5], [4.9, 3.0], [4.7, 3.2],  // Setosa
        [7.0, 3.2], [6.4, 3.2], [6.9, 3.1],  // Versicolor
        [6.3, 3.3], [5.8, 2.7], [7.1, 3.0],  // Virginica
      ];
      const y = [0, 0, 0, 1, 1, 1, 2, 2, 2];

      const tree = new DecisionTreeClassifier();
      tree.fit(X, y);

      const predictions = tree.predict(X);
      const accuracy = predictions.filter((p, i) => p === y[i]).length / y.length;

      expect(accuracy).toBeGreaterThan(0.6);
    });

    it('should classify customer purchase behavior', () => {
      // [age, income]
      const X = [
        [25, 40], [30, 60], [35, 50],
        [40, 90], [45, 110], [50, 120],
      ];
      const y = [0, 0, 0, 1, 1, 1]; // 0: no purchase, 1: purchase

      const tree = new DecisionTreeClassifier();
      tree.fit(X, y);

      // Test predictions
      const newCustomers = [[28, 45], [48, 115]];
      const predictions = tree.predict(newCustomers);

      expect(predictions[0]).toBe(0); // Young, low income
      expect(predictions[1]).toBe(1); // Older, high income
    });

    it('should handle categorical features (one-hot encoded)', () => {
      // Features: [is_weekend, is_raining, is_holiday]
      const X = [
        [1, 0, 0], [1, 0, 0],  // Weekend, not raining → goes out
        [0, 1, 0], [0, 1, 0],  // Weekday, raining → stays home
        [0, 0, 1], [0, 0, 1],  // Holiday → goes out
      ];
      const y = [1, 1, 0, 0, 1, 1]; // 1: goes out, 0: stays home

      const tree = new DecisionTreeClassifier();
      tree.fit(X, y);

      const predictions = tree.predict(X);
      const accuracy = predictions.filter((p, i) => p === y[i]).length / y.length;

      expect(accuracy).toBeGreaterThan(0.5);
    });
  });
});
