import {
  padImage,
  computeOutputSize,
  convolve2D,
  correlate2D,
  maxPool2D,
  avgPool2D,
  globalMaxPool2D,
  globalAvgPool2D,
  KERNELS,
  ConvLayer,
  SimpleCNN,
} from './cnn';

describe('Image Processing Utilities', () => {
  describe('padImage', () => {
    it('should not modify image when padding=0', () => {
      const image = [[1, 2], [3, 4]];
      const padded = padImage(image, 0);
      expect(padded).toEqual(image);
    });

    it('should add padding with zeros', () => {
      const image = [[1, 2], [3, 4]];
      const padded = padImage(image, 1);
      expect(padded).toEqual([
        [0, 0, 0, 0],
        [0, 1, 2, 0],
        [0, 3, 4, 0],
        [0, 0, 0, 0],
      ]);
    });

    it('should use custom padding value', () => {
      const image = [[1, 2]];
      const padded = padImage(image, 1, -1);
      expect(padded[0][0]).toBe(-1);
      expect(padded[1][1]).toBe(1);
    });

    it('should handle multiple padding layers', () => {
      const image = [[1]];
      const padded = padImage(image, 2);
      expect(padded.length).toBe(5);
      expect(padded[0].length).toBe(5);
      expect(padded[2][2]).toBe(1);
    });
  });

  describe('computeOutputSize', () => {
    it('should compute output size for valid convolution', () => {
      // 5×5 input, 3×3 kernel, no padding, stride 1
      const size = computeOutputSize(5, 3, 1, 0);
      expect(size).toBe(3); // (5-3)/1 + 1 = 3
    });

    it('should compute output size with padding (same)', () => {
      // 5×5 input, 3×3 kernel, padding 1, stride 1
      const size = computeOutputSize(5, 3, 1, 1);
      expect(size).toBe(5); // (5+2-3)/1 + 1 = 5
    });

    it('should compute output size with stride > 1', () => {
      // 8×8 input, 3×3 kernel, no padding, stride 2
      const size = computeOutputSize(8, 3, 2, 0);
      expect(size).toBe(3); // (8-3)/2 + 1 = 3
    });

    it('should handle typical CNN layer', () => {
      // 28×28 input, 5×5 kernel, stride 1
      const size = computeOutputSize(28, 5, 1, 0);
      expect(size).toBe(24); // (28-5)/1 + 1 = 24
    });
  });
});

describe('Convolution Operations', () => {
  describe('convolve2D', () => {
    it('should perform basic convolution', () => {
      const input = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const kernel = [
        [1, 0],
        [0, 1],
      ];
      const result = convolve2D(input, kernel);
      // Output should be 2×2
      expect(result.length).toBe(2);
      expect(result[0].length).toBe(2);
    });

    it('should apply identity kernel correctly', () => {
      const input = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const result = convolve2D(input, KERNELS.IDENTITY);
      // Center values should be unchanged
      expect(result[0][0]).toBe(5);
    });

    it('should detect vertical edges', () => {
      const input = [
        [0, 0, 1, 1, 1],
        [0, 0, 1, 1, 1],
        [0, 0, 1, 1, 1],
        [0, 0, 1, 1, 1],
        [0, 0, 1, 1, 1],
      ];
      const result = convolve2D(input, KERNELS.EDGE_VERTICAL);
      // Should have high values at the edge
      expect(Math.abs(result[1][1])).toBeGreaterThan(2);
    });

    it('should work with stride > 1', () => {
      const input = [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25],
      ];
      const kernel = [[1, 1], [1, 1]];
      const result = convolve2D(input, kernel, 2);
      // With stride 2, should reduce size
      expect(result.length).toBe(2);
    });

    it('should work with padding', () => {
      const input = [[1, 2, 3]];
      const kernel = [[1, 1]];
      const result = convolve2D(input, kernel, 1, 1);
      // Padding should increase output size
      expect(result[0].length).toBeGreaterThan(1);
    });
  });

  describe('correlate2D', () => {
    it('should be equivalent to convolve2D', () => {
      const input = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      const kernel = [[1, 0], [0, 1]];

      const convResult = convolve2D(input, kernel);
      const corrResult = correlate2D(input, kernel);

      expect(corrResult).toEqual(convResult);
    });
  });
});

describe('Pooling Operations', () => {
  describe('maxPool2D', () => {
    it('should perform basic max pooling', () => {
      const input = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const result = maxPool2D(input, 2);
      expect(result).toEqual([
        [6, 8],
        [14, 16],
      ]);
    });

    it('should handle non-square pooling', () => {
      const input = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const result = maxPool2D(input, 2);
      // Should reduce to 1×1 (or close)
      expect(result.length).toBeGreaterThan(0);
    });

    it('should work with custom stride', () => {
      const input = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const result = maxPool2D(input, 2, 1);
      // Overlapping windows with stride 1
      expect(result.length).toBe(3);
    });

    it('should extract maximum values', () => {
      const input = [
        [1, 100],
        [2, 3],
      ];
      const result = maxPool2D(input, 2);
      expect(result[0][0]).toBe(100);
    });
  });

  describe('avgPool2D', () => {
    it('should perform average pooling', () => {
      const input = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const result = avgPool2D(input, 2);
      // (1+2+5+6)/4 = 3.5
      expect(result[0][0]).toBe(3.5);
      // (3+4+7+8)/4 = 5.5
      expect(result[0][1]).toBe(5.5);
    });

    it('should handle uniform values', () => {
      const input = [
        [5, 5],
        [5, 5],
      ];
      const result = avgPool2D(input, 2);
      expect(result[0][0]).toBe(5);
    });
  });

  describe('globalMaxPool2D', () => {
    it('should find global maximum', () => {
      const input = [
        [1, 2, 3],
        [4, 100, 6],
        [7, 8, 9],
      ];
      expect(globalMaxPool2D(input)).toBe(100);
    });

    it('should handle negative values', () => {
      const input = [
        [-5, -2],
        [-10, -1],
      ];
      expect(globalMaxPool2D(input)).toBe(-1);
    });
  });

  describe('globalAvgPool2D', () => {
    it('should compute global average', () => {
      const input = [
        [1, 2],
        [3, 4],
      ];
      expect(globalAvgPool2D(input)).toBe(2.5);
    });

    it('should handle uniform values', () => {
      const input = [
        [7, 7],
        [7, 7],
      ];
      expect(globalAvgPool2D(input)).toBe(7);
    });
  });
});

describe('Predefined Kernels', () => {
  it('should have edge detection kernels', () => {
    expect(KERNELS.EDGE_HORIZONTAL).toBeDefined();
    expect(KERNELS.EDGE_VERTICAL).toBeDefined();
  });

  it('should have correct kernel sizes', () => {
    expect(KERNELS.SOBEL_X.length).toBe(3);
    expect(KERNELS.SOBEL_X[0].length).toBe(3);
  });

  it('should have identity kernel with center 1', () => {
    expect(KERNELS.IDENTITY[1][1]).toBe(1);
  });

  it('should have blur kernel that sums to 1', () => {
    const sum = KERNELS.BLUR.flat().reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
  });
});

describe('ConvLayer', () => {
  describe('constructor', () => {
    it('should initialize with required parameters', () => {
      const layer = new ConvLayer(1, {
        numFilters: 8,
        kernelSize: 3,
      });
      expect(layer).toBeDefined();
    });

    it('should create correct number of filters', () => {
      const layer = new ConvLayer(1, {
        numFilters: 5,
        kernelSize: 3,
      });
      const filters = layer.getFilters();
      expect(filters.length).toBe(5);
    });

    it('should initialize filters with correct dimensions', () => {
      const layer = new ConvLayer(3, {
        numFilters: 10,
        kernelSize: 5,
      });
      const filters = layer.getFilters();
      // Should be (10, 3, 5, 5)
      expect(filters[0].length).toBe(3); // channels
      expect(filters[0][0].length).toBe(5); // kernel height
      expect(filters[0][0][0].length).toBe(5); // kernel width
    });
  });

  describe('forward', () => {
    it('should produce output with correct dimensions', () => {
      const layer = new ConvLayer(1, {
        numFilters: 8,
        kernelSize: 3,
        padding: 1,
      });

      const input = Array(5).fill(0).map(() =>
        Array(5).fill(0).map(() => [0])
      );

      const output = layer.forward(input);
      expect(output.length).toBe(5);
      expect(output[0].length).toBe(5);
      expect(output[0][0].length).toBe(8);
    });

    it('should apply activation function', () => {
      const layer = new ConvLayer(1, {
        numFilters: 4,
        kernelSize: 3,
        activation: 'relu',
      });

      const input = Array(5).fill(0).map(() =>
        Array(5).fill(0).map(() => [Math.random() - 0.5])
      );

      const output = layer.forward(input);
      // With ReLU, all values should be >= 0
      output.forEach(row =>
        row.forEach(pixel =>
          pixel.forEach(val => expect(val).toBeGreaterThanOrEqual(0))
        )
      );
    });

    it('should reduce size without padding', () => {
      const layer = new ConvLayer(1, {
        numFilters: 4,
        kernelSize: 3,
        padding: 0,
      });

      const input = Array(8).fill(0).map(() =>
        Array(8).fill(0).map(() => [1])
      );

      const output = layer.forward(input);
      // 8 - 3 + 1 = 6
      expect(output.length).toBe(6);
    });
  });
});

describe('SimpleCNN', () => {
  describe('constructor', () => {
    it('should initialize with config', () => {
      const cnn = new SimpleCNN({
        inputSize: 8,
        numClasses: 10,
      });
      expect(cnn).toBeDefined();
    });
  });

  describe('forward', () => {
    it('should produce scores for each class', () => {
      const cnn = new SimpleCNN({
        inputSize: 8,
        numClasses: 5,
      });

      const input = Array(8).fill(0).map(() =>
        Array(8).fill(Math.random())
      );

      const scores = cnn.forward(input);
      expect(scores.length).toBe(5);
    });

    it('should handle different input sizes', () => {
      const cnn = new SimpleCNN({
        inputSize: 16,
        numClasses: 10,
      });

      const input = Array(16).fill(0).map(() =>
        Array(16).fill(0.5)
      );

      const scores = cnn.forward(input);
      expect(scores.length).toBe(10);
    });
  });

  describe('predict', () => {
    it('should return class index', () => {
      const cnn = new SimpleCNN({
        inputSize: 8,
        numClasses: 10,
      });

      const input = Array(8).fill(0).map(() =>
        Array(8).fill(Math.random())
      );

      const prediction = cnn.predict(input);
      expect(prediction).toBeGreaterThanOrEqual(0);
      expect(prediction).toBeLessThan(10);
    });
  });

  describe('predictProba', () => {
    it('should return probabilities', () => {
      const cnn = new SimpleCNN({
        inputSize: 8,
        numClasses: 5,
      });

      const input = Array(8).fill(0).map(() =>
        Array(8).fill(Math.random())
      );

      const probs = cnn.predictProba(input);
      expect(probs.length).toBe(5);

      // Probabilities should sum to ~1
      const sum = probs.reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1, 5);

      // All should be between 0 and 1
      probs.forEach(p => {
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('integration', () => {
    it('should process image through full pipeline', () => {
      const cnn = new SimpleCNN({
        inputSize: 8,
        numClasses: 10,
      });

      // Create a simple pattern
      const input = Array(8).fill(0).map((_, i) =>
        Array(8).fill(0).map((_, j) => (i + j) % 2)
      );

      const prediction = cnn.predict(input);
      const probs = cnn.predictProba(input);

      expect(typeof prediction).toBe('number');
      expect(probs[prediction]).toBeGreaterThan(0);
    });
  });
});
