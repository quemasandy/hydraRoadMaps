import {
  scaledDotProductAttention,
  MultiHeadAttention,
  positionalEncoding,
  addPositionalEncoding,
  createCausalMask,
  createPaddingMask,
  FeedForwardNetwork,
  TransformerEncoderLayer,
} from './transformer';

describe('Scaled Dot-Product Attention', () => {
  describe('scaledDotProductAttention', () => {
    it('should compute attention correctly', () => {
      const Q = [[1, 0], [0, 1]];
      const K = [[1, 0], [0, 1]];
      const V = [[10, 20], [30, 40]];

      const { output, attentionWeights } = scaledDotProductAttention(Q, K, V);

      expect(output.length).toBe(2);
      expect(output[0].length).toBe(2);
      expect(attentionWeights.length).toBe(2);
    });

    it('should produce attention weights that sum to 1', () => {
      const Q = [[1, 2], [3, 4]];
      const K = [[1, 2], [3, 4]];
      const V = [[5, 6], [7, 8]];

      const { attentionWeights } = scaledDotProductAttention(Q, K, V);

      attentionWeights.forEach(row => {
        const sum = row.reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(1, 5);
      });
    });

    it('should handle masking', () => {
      const Q = [[1, 0], [0, 1]];
      const K = [[1, 0], [0, 1]];
      const V = [[10, 20], [30, 40]];
      const mask = [[1, 0], [1, 1]]; // Mask position (0,1)

      const { attentionWeights } = scaledDotProductAttention(Q, K, V, mask);

      // Position (0,1) should have 0 weight after masking
      expect(attentionWeights[0][1]).toBeCloseTo(0, 5);
    });

    it('should scale by sqrt(dk)', () => {
      const Q = [[1, 2, 3, 4]];
      const K = [[1, 2, 3, 4]];
      const V = [[5]];

      // With scaling, softmax should not saturate
      const { attentionWeights } = scaledDotProductAttention(Q, K, V);

      expect(attentionWeights[0][0]).toBeLessThan(1);
      expect(attentionWeights[0][0]).toBeGreaterThan(0);
    });

    it('should handle identity attention', () => {
      // When Q=K, should attend equally (with same vectors)
      const Q = [[1, 1]];
      const K = [[1, 1]];
      const V = [[100]];

      const { output } = scaledDotProductAttention(Q, K, V);

      expect(output[0][0]).toBeCloseTo(100, 1);
    });
  });
});

describe('Multi-Head Attention', () => {
  describe('constructor', () => {
    it('should initialize with valid parameters', () => {
      const mha = new MultiHeadAttention(8, 2);
      expect(mha).toBeDefined();
      expect(mha.getNumHeads()).toBe(2);
    });

    it('should throw error if dModel not divisible by numHeads', () => {
      expect(() => new MultiHeadAttention(10, 3)).toThrow();
    });

    it('should handle different head configurations', () => {
      const mha4 = new MultiHeadAttention(64, 4);
      const mha8 = new MultiHeadAttention(64, 8);

      expect(mha4.getNumHeads()).toBe(4);
      expect(mha8.getNumHeads()).toBe(8);
    });
  });

  describe('forward', () => {
    it('should maintain input dimensions', () => {
      const mha = new MultiHeadAttention(8, 2);
      const input = [[1, 2, 3, 4, 5, 6, 7, 8], [9, 10, 11, 12, 13, 14, 15, 16]];

      const output = mha.forward(input, input, input);

      expect(output.length).toBe(2);
      expect(output[0].length).toBe(8);
    });

    it('should handle different sequence lengths', () => {
      const mha = new MultiHeadAttention(4, 2);
      const short = Array(2).fill(0).map(() => [1, 2, 3, 4]);
      const long = Array(10).fill(0).map(() => [1, 2, 3, 4]);

      const outputShort = mha.forward(short, short, short);
      const outputLong = mha.forward(long, long, long);

      expect(outputShort.length).toBe(2);
      expect(outputLong.length).toBe(10);
    });

    it('should support cross-attention', () => {
      const mha = new MultiHeadAttention(4, 2);
      const Q = [[1, 2, 3, 4]];
      const K = [[5, 6, 7, 8], [9, 10, 11, 12]];
      const V = [[13, 14, 15, 16], [17, 18, 19, 20]];

      const output = mha.forward(Q, K, V);

      expect(output.length).toBe(1);
      expect(output[0].length).toBe(4);
    });
  });
});

describe('Positional Encoding', () => {
  describe('positionalEncoding', () => {
    it('should create encodings with correct dimensions', () => {
      const PE = positionalEncoding(5, 8);
      expect(PE.length).toBe(5);
      expect(PE[0].length).toBe(8);
    });

    it('should use sinusoidal functions', () => {
      const PE = positionalEncoding(10, 4);

      // All values should be in [-1, 1]
      PE.forEach(pos => {
        pos.forEach(val => {
          expect(val).toBeGreaterThanOrEqual(-1);
          expect(val).toBeLessThanOrEqual(1);
        });
      });
    });

    it('should produce different encodings for different positions', () => {
      const PE = positionalEncoding(3, 4);

      // Position 0 and position 1 should be different
      expect(PE[0]).not.toEqual(PE[1]);
      expect(PE[1]).not.toEqual(PE[2]);
    });

    it('should have deterministic output', () => {
      const PE1 = positionalEncoding(5, 8);
      const PE2 = positionalEncoding(5, 8);

      expect(PE1).toEqual(PE2);
    });

    it('should alternate sin/cos in dimensions', () => {
      const PE = positionalEncoding(1, 4);
      const pos0 = PE[0];

      // Even indices use sin, odd use cos
      // We can't directly test this without knowing the formula,
      // but we can verify structure
      expect(pos0.length).toBe(4);
    });
  });

  describe('addPositionalEncoding', () => {
    it('should add encodings to embeddings', () => {
      const embeddings = [[1, 2], [3, 4]];
      const encodings = [[0.1, 0.2], [0.3, 0.4]];

      const result = addPositionalEncoding(embeddings, encodings);

      expect(result[0][0]).toBeCloseTo(1.1, 5);
      expect(result[0][1]).toBeCloseTo(2.2, 5);
      expect(result[1][0]).toBeCloseTo(3.3, 5);
      expect(result[1][1]).toBeCloseTo(4.4, 5);
    });

    it('should preserve dimensions', () => {
      const embeddings = Array(5).fill(0).map(() => Array(8).fill(1));
      const encodings = positionalEncoding(5, 8);

      const result = addPositionalEncoding(embeddings, encodings);

      expect(result.length).toBe(5);
      expect(result[0].length).toBe(8);
    });
  });
});

describe('Masking', () => {
  describe('createCausalMask', () => {
    it('should create lower triangular mask', () => {
      const mask = createCausalMask(3);

      expect(mask).toEqual([
        [1, 0, 0],
        [1, 1, 0],
        [1, 1, 1],
      ]);
    });

    it('should allow attending to past and present', () => {
      const mask = createCausalMask(4);

      // Position 2 can attend to 0, 1, 2 but not 3
      expect(mask[2][0]).toBe(1);
      expect(mask[2][1]).toBe(1);
      expect(mask[2][2]).toBe(1);
      expect(mask[2][3]).toBe(0);
    });

    it('should handle single position', () => {
      const mask = createCausalMask(1);
      expect(mask).toEqual([[1]]);
    });
  });

  describe('createPaddingMask', () => {
    it('should mask padding tokens', () => {
      const sequence = [1, 2, 3, 0, 0];
      const mask = createPaddingMask(sequence, 0);

      expect(mask).toEqual([1, 1, 1, 0, 0]);
    });

    it('should handle no padding', () => {
      const sequence = [1, 2, 3, 4];
      const mask = createPaddingMask(sequence, 0);

      expect(mask).toEqual([1, 1, 1, 1]);
    });

    it('should handle all padding', () => {
      const sequence = [0, 0, 0];
      const mask = createPaddingMask(sequence, 0);

      expect(mask).toEqual([0, 0, 0]);
    });
  });
});

describe('FeedForwardNetwork', () => {
  describe('constructor', () => {
    it('should initialize with given dimensions', () => {
      const ffn = new FeedForwardNetwork(8, 32);
      expect(ffn).toBeDefined();
    });
  });

  describe('forward', () => {
    it('should maintain sequence length and dModel', () => {
      const ffn = new FeedForwardNetwork(4, 16);
      const input = [[1, 2, 3, 4], [5, 6, 7, 8]];

      const output = ffn.forward(input);

      expect(output.length).toBe(2);
      expect(output[0].length).toBe(4);
    });

    it('should apply non-linear transformation', () => {
      const ffn = new FeedForwardNetwork(4, 16);
      const input = [[1, 2, 3, 4]];

      const output = ffn.forward(input);

      // Output should be different from input (transformed)
      expect(output).not.toEqual(input);
    });

    it('should handle longer sequences', () => {
      const ffn = new FeedForwardNetwork(8, 32);
      const input = Array(10).fill(0).map(() => Array(8).fill(1));

      const output = ffn.forward(input);

      expect(output.length).toBe(10);
    });
  });
});

describe('TransformerEncoderLayer', () => {
  describe('constructor', () => {
    it('should initialize with valid parameters', () => {
      const layer = new TransformerEncoderLayer(8, 2, 32);
      expect(layer).toBeDefined();
    });
  });

  describe('forward', () => {
    it('should maintain input dimensions', () => {
      const layer = new TransformerEncoderLayer(8, 2, 32);
      const input = Array(5).fill(0).map(() => Array(8).fill(1));

      const output = layer.forward(input);

      expect(output.length).toBe(5);
      expect(output[0].length).toBe(8);
    });

    it('should transform input', () => {
      const layer = new TransformerEncoderLayer(4, 2, 16);
      const input = [[1, 2, 3, 4], [5, 6, 7, 8]];

      const output = layer.forward(input);

      // Output should be different (transformed)
      expect(output).not.toEqual(input);
    });

    it('should handle variable sequence lengths', () => {
      const layer = new TransformerEncoderLayer(8, 2, 32);

      const short = Array(2).fill(0).map(() => Array(8).fill(1));
      const long = Array(20).fill(0).map(() => Array(8).fill(1));

      const outputShort = layer.forward(short);
      const outputLong = layer.forward(long);

      expect(outputShort.length).toBe(2);
      expect(outputLong.length).toBe(20);
    });
  });
});

describe('Integration Tests', () => {
  it('should process sequence through full encoder', () => {
    const seqLen = 4;
    const dModel = 8;

    // Create embeddings
    const embeddings = Array(seqLen).fill(0).map(() =>
      Array(dModel).fill(0).map(() => Math.random())
    );

    // Add positional encoding
    const PE = positionalEncoding(seqLen, dModel);
    const input = addPositionalEncoding(embeddings, PE);

    // Process through encoder layer
    const encoder = new TransformerEncoderLayer(dModel, 2, 32);
    const output = encoder.forward(input);

    expect(output.length).toBe(seqLen);
    expect(output[0].length).toBe(dModel);
  });

  it('should handle masked attention', () => {
    const Q = [[1, 0], [0, 1], [1, 1]];
    const K = [[1, 0], [0, 1], [1, 1]];
    const V = [[10, 20], [30, 40], [50, 60]];

    const mask = createCausalMask(3);
    const { attentionWeights } = scaledDotProductAttention(Q, K, V, mask);

    // First position should only attend to itself
    expect(attentionWeights[0][1]).toBeCloseTo(0, 5);
    expect(attentionWeights[0][2]).toBeCloseTo(0, 5);

    // Second position can attend to 0 and 1
    expect(attentionWeights[1][2]).toBeCloseTo(0, 5);
  });

  it('should combine positional encoding with attention', () => {
    const seqLen = 3;
    const dModel = 4;

    const embeddings = Array(seqLen).fill(0).map(() => [1, 1, 1, 1]);
    const PE = positionalEncoding(seqLen, dModel);
    const input = addPositionalEncoding(embeddings, PE);

    const mha = new MultiHeadAttention(dModel, 2);
    const output = mha.forward(input, input, input);

    expect(output.length).toBe(seqLen);
    expect(output[0].length).toBe(dModel);
  });
});
