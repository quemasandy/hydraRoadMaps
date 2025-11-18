import {
  SimpleRNN,
  LSTMCell,
  LSTM,
  generateRandomSequence,
  normalizeSequence,
} from './rnn';

describe('SimpleRNN', () => {
  describe('constructor', () => {
    it('should initialize with given dimensions', () => {
      const rnn = new SimpleRNN(3, 5, 2);
      expect(rnn).toBeDefined();
    });
  });

  describe('forward', () => {
    it('should process sequence and return hidden states', () => {
      const rnn = new SimpleRNN(3, 5, 2);
      const sequence = [[1, 2, 3], [4, 5, 6]];

      const { hiddenStates, outputs } = rnn.forward(sequence);

      expect(hiddenStates.length).toBe(2);
      expect(hiddenStates[0].length).toBe(5);
      expect(outputs.length).toBe(2);
      expect(outputs[0].length).toBe(2);
    });

    it('should handle longer sequences', () => {
      const rnn = new SimpleRNN(2, 4, 1);
      const sequence = Array(10).fill([1, 2]);

      const { hiddenStates, outputs } = rnn.forward(sequence);

      expect(hiddenStates.length).toBe(10);
      expect(outputs.length).toBe(10);
    });

    it('should maintain hidden state dimensions', () => {
      const rnn = new SimpleRNN(3, 8, 2);
      const sequence = [[1, 2, 3]];

      const { hiddenStates } = rnn.forward(sequence);

      expect(hiddenStates[0].length).toBe(8);
    });
  });

  describe('predict', () => {
    it('should return final output (many-to-one)', () => {
      const rnn = new SimpleRNN(3, 5, 2);
      const sequence = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

      const prediction = rnn.predict(sequence);

      expect(prediction.length).toBe(2);
      expect(Array.isArray(prediction)).toBe(true);
    });

    it('should produce different outputs for different sequences', () => {
      const rnn = new SimpleRNN(2, 4, 1);
      const seq1 = [[1, 0], [0, 1]];
      const seq2 = [[0, 1], [1, 0]];

      const pred1 = rnn.predict(seq1);
      const pred2 = rnn.predict(seq2);

      // Should be different (statistically)
      expect(pred1).not.toEqual(pred2);
    });
  });

  describe('predictSequence', () => {
    it('should return output for each time step', () => {
      const rnn = new SimpleRNN(2, 4, 3);
      const sequence = [[1, 2], [3, 4], [5, 6]];

      const predictions = rnn.predictSequence(sequence);

      expect(predictions.length).toBe(3);
      predictions.forEach(pred => {
        expect(pred.length).toBe(3);
      });
    });
  });
});

describe('LSTMCell', () => {
  describe('constructor', () => {
    it('should initialize with given dimensions', () => {
      const cell = new LSTMCell(3, 5);
      expect(cell).toBeDefined();
    });
  });

  describe('forward', () => {
    it('should process one time step', () => {
      const cell = new LSTMCell(3, 5);
      const xt = [1, 2, 3];
      const ht_prev = Array(5).fill(0);
      const Ct_prev = Array(5).fill(0);

      const { ht, Ct } = cell.forward(xt, ht_prev, Ct_prev);

      expect(ht.length).toBe(5);
      expect(Ct.length).toBe(5);
    });

    it('should update cell state based on gates', () => {
      const cell = new LSTMCell(2, 3);
      const xt = [1, 1];
      const ht_prev = [0.5, 0.5, 0.5];
      const Ct_prev = [0.3, 0.3, 0.3];

      const { Ct } = cell.forward(xt, ht_prev, Ct_prev);

      // Cell state should be updated (not equal to Ct_prev)
      expect(Ct).not.toEqual(Ct_prev);
    });

    it('should produce hidden state from cell state', () => {
      const cell = new LSTMCell(2, 3);
      const xt = [1, 0];
      const ht_prev = Array(3).fill(0);
      const Ct_prev = Array(3).fill(0);

      const { ht, Ct } = cell.forward(xt, ht_prev, Ct_prev);

      // Hidden state should be derived from cell state
      expect(ht).toBeDefined();
      expect(Ct).toBeDefined();
    });

    it('should handle sequential calls', () => {
      const cell = new LSTMCell(2, 3);
      let ht = Array(3).fill(0);
      let Ct = Array(3).fill(0);

      // Multiple time steps
      for (let t = 0; t < 5; t++) {
        const xt = [Math.random(), Math.random()];
        const result = cell.forward(xt, ht, Ct);
        ht = result.ht;
        Ct = result.Ct;
      }

      expect(ht.length).toBe(3);
      expect(Ct.length).toBe(3);
    });
  });
});

describe('LSTM', () => {
  describe('constructor', () => {
    it('should initialize with given dimensions', () => {
      const lstm = new LSTM(3, 5, 2);
      expect(lstm).toBeDefined();
    });
  });

  describe('forward', () => {
    it('should process sequence and return all states', () => {
      const lstm = new LSTM(3, 5, 2);
      const sequence = [[1, 2, 3], [4, 5, 6]];

      const { hiddenStates, cellStates, outputs } = lstm.forward(sequence);

      expect(hiddenStates.length).toBe(2);
      expect(cellStates.length).toBe(2);
      expect(outputs.length).toBe(2);
    });

    it('should maintain separate hidden and cell states', () => {
      const lstm = new LSTM(2, 4, 1);
      const sequence = [[1, 2], [3, 4]];

      const { hiddenStates, cellStates } = lstm.forward(sequence);

      expect(hiddenStates[0]).not.toEqual(cellStates[0]);
    });

    it('should handle long sequences', () => {
      const lstm = new LSTM(2, 4, 1);
      const sequence = Array(20).fill([1, 2]);

      const { hiddenStates } = lstm.forward(sequence);

      expect(hiddenStates.length).toBe(20);
    });
  });

  describe('predict', () => {
    it('should return final output', () => {
      const lstm = new LSTM(3, 5, 2);
      const sequence = [[1, 2, 3], [4, 5, 6]];

      const prediction = lstm.predict(sequence);

      expect(prediction.length).toBe(2);
    });

    it('should handle single time step', () => {
      const lstm = new LSTM(2, 3, 1);
      const sequence = [[1, 2]];

      const prediction = lstm.predict(sequence);

      expect(prediction.length).toBe(1);
    });
  });

  describe('predictSequence', () => {
    it('should return output for each time step', () => {
      const lstm = new LSTM(2, 4, 3);
      const sequence = [[1, 2], [3, 4], [5, 6]];

      const predictions = lstm.predictSequence(sequence);

      expect(predictions.length).toBe(3);
      predictions.forEach(pred => {
        expect(pred.length).toBe(3);
      });
    });
  });
});

describe('Utility Functions', () => {
  describe('generateRandomSequence', () => {
    it('should generate sequence of correct length', () => {
      const sequence = generateRandomSequence(5, 3);
      expect(sequence.length).toBe(5);
    });

    it('should generate vectors of correct size', () => {
      const sequence = generateRandomSequence(4, 10);
      sequence.forEach(vec => {
        expect(vec.length).toBe(10);
      });
    });

    it('should generate random values', () => {
      const seq1 = generateRandomSequence(5, 3);
      const seq2 = generateRandomSequence(5, 3);

      // Should be different (statistically)
      expect(seq1).not.toEqual(seq2);
    });

    it('should generate values in range [0, 1]', () => {
      const sequence = generateRandomSequence(10, 5);
      sequence.forEach(vec => {
        vec.forEach(val => {
          expect(val).toBeGreaterThanOrEqual(0);
          expect(val).toBeLessThan(1);
        });
      });
    });
  });

  describe('normalizeSequence', () => {
    it('should normalize to [0, 1] range', () => {
      const sequence = [[1, 5, 10], [3, 7, 15]];
      const normalized = normalizeSequence(sequence);

      const flat = normalized.flat();
      const min = Math.min(...flat);
      const max = Math.max(...flat);

      expect(min).toBeCloseTo(0, 5);
      expect(max).toBeCloseTo(1, 5);
    });

    it('should handle uniform sequences', () => {
      const sequence = [[5, 5], [5, 5]];
      const normalized = normalizeSequence(sequence);

      expect(normalized).toEqual(sequence);
    });

    it('should preserve sequence length', () => {
      const sequence = [[1, 2], [3, 4], [5, 6]];
      const normalized = normalizeSequence(sequence);

      expect(normalized.length).toBe(sequence.length);
      expect(normalized[0].length).toBe(sequence[0].length);
    });

    it('should handle negative values', () => {
      const sequence = [[-5, 0], [5, 10]];
      const normalized = normalizeSequence(sequence);

      const flat = normalized.flat();
      expect(Math.min(...flat)).toBeCloseTo(0, 5);
      expect(Math.max(...flat)).toBeCloseTo(1, 5);
    });
  });
});

describe('Integration Tests', () => {
  it('should compare RNN vs LSTM on same sequence', () => {
    const sequence = generateRandomSequence(5, 3);

    const rnn = new SimpleRNN(3, 8, 2);
    const lstm = new LSTM(3, 8, 2);

    const rnnPred = rnn.predict(sequence);
    const lstmPred = lstm.predict(sequence);

    expect(rnnPred.length).toBe(2);
    expect(lstmPred.length).toBe(2);
  });

  it('should process normalized sequences', () => {
    const raw = [[10, 20, 30], [40, 50, 60]];
    const normalized = normalizeSequence(raw);

    const rnn = new SimpleRNN(3, 5, 1);
    const prediction = rnn.predict(normalized);

    expect(prediction).toBeDefined();
    expect(prediction.length).toBe(1);
  });

  it('should handle variable length sequences', () => {
    const lstm = new LSTM(2, 4, 1);

    const shortSeq = generateRandomSequence(3, 2);
    const longSeq = generateRandomSequence(10, 2);

    const predShort = lstm.predict(shortSeq);
    const predLong = lstm.predict(longSeq);

    expect(predShort.length).toBe(1);
    expect(predLong.length).toBe(1);
  });
});
