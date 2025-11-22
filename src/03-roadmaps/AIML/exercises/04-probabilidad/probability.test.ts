import {
  probability,
  complement,
  jointProbability,
  conditionalProbability,
  bayesTheorem,
  bayesWithComplement,
  uniformDistribution,
  normalDistribution,
  bernoulliDistribution,
  sampleUniform,
  sampleNormal,
  sampleBernoulli,
  NaiveBayesClassifier,
} from './probability';

describe('Basic Probabilities', () => {
  describe('probability', () => {
    it('should calculate basic probability', () => {
      expect(probability(1, 6)).toBeCloseTo(1 / 6, 10);
      expect(probability(1, 2)).toBe(0.5);
      expect(probability(0, 10)).toBe(0);
      expect(probability(10, 10)).toBe(1);
    });

    it('should throw on invalid inputs', () => {
      expect(() => probability(1, 0)).toThrow();
      expect(() => probability(-1, 10)).toThrow();
      expect(() => probability(11, 10)).toThrow();
    });
  });

  describe('complement', () => {
    it('should calculate complement', () => {
      expect(complement(0.3)).toBeCloseTo(0.7, 10);
      expect(complement(0)).toBe(1);
      expect(complement(1)).toBe(0);
    });

    it('should throw on invalid probability', () => {
      expect(() => complement(-0.1)).toThrow();
      expect(() => complement(1.1)).toThrow();
    });
  });

  describe('jointProbability', () => {
    it('should calculate joint probability', () => {
      expect(jointProbability(0.5, 0.5)).toBe(0.25);
      expect(jointProbability(0.3, 0.4)).toBeCloseTo(0.12, 10);
    });

    it('should handle edge cases', () => {
      expect(jointProbability(0, 0.5)).toBe(0);
      expect(jointProbability(1, 1)).toBe(1);
    });

    it('should throw on invalid probabilities', () => {
      expect(() => jointProbability(-0.1, 0.5)).toThrow();
      expect(() => jointProbability(0.5, 1.1)).toThrow();
    });
  });
});

describe('Conditional Probability', () => {
  describe('conditionalProbability', () => {
    it('should calculate conditional probability', () => {
      expect(conditionalProbability(0.25, 0.5)).toBe(0.5);
      expect(conditionalProbability(0.12, 0.4)).toBeCloseTo(0.3, 10);
    });

    it('should throw on zero P(B)', () => {
      expect(() => conditionalProbability(0.5, 0)).toThrow();
    });

    it('should throw on invalid probabilities', () => {
      expect(() => conditionalProbability(-0.1, 0.5)).toThrow();
      expect(() => conditionalProbability(0.6, 0.5)).toThrow();
    });
  });
});

describe('Bayes Theorem', () => {
  describe('bayesTheorem', () => {
    it('should apply Bayes theorem', () => {
      const pBA = 0.8;
      const pA = 0.6;
      const pB = 0.56;
      const result = bayesTheorem(pBA, pA, pB);
      expect(result).toBeCloseTo(0.857, 2);
    });

    it('should satisfy P(A|B) * P(B) = P(B|A) * P(A)', () => {
      const pBA = 0.7;
      const pA = 0.3;
      const pB = 0.4;
      const pAB = bayesTheorem(pBA, pA, pB);

      expect(pAB * pB).toBeCloseTo(pBA * pA, 10);
    });

    it('should throw on zero P(B)', () => {
      expect(() => bayesTheorem(0.5, 0.3, 0)).toThrow();
    });

    it('should throw on invalid probabilities', () => {
      expect(() => bayesTheorem(-0.1, 0.3, 0.4)).toThrow();
      expect(() => bayesTheorem(0.5, 1.1, 0.4)).toThrow();
    });
  });

  describe('bayesWithComplement', () => {
    it('should calculate Bayes with complement', () => {
      const pBA = 0.8;
      const pA = 0.6;
      const pBNotA = 0.2;
      const result = bayesWithComplement(pBA, pA, pBNotA);
      expect(result).toBeCloseTo(0.857, 2);
    });

    it('should match bayesTheorem when P(B) is calculated', () => {
      const pBA = 0.7;
      const pA = 0.3;
      const pBNotA = 0.4;

      // Calculate P(B) manually
      const pB = pBA * pA + pBNotA * (1 - pA);

      const result1 = bayesWithComplement(pBA, pA, pBNotA);
      const result2 = bayesTheorem(pBA, pA, pB);

      expect(result1).toBeCloseTo(result2, 10);
    });

    it('should throw on invalid probabilities', () => {
      expect(() => bayesWithComplement(-0.1, 0.3, 0.4)).toThrow();
      expect(() => bayesWithComplement(0.5, 1.1, 0.4)).toThrow();
    });
  });
});

describe('Probability Distributions', () => {
  describe('uniformDistribution', () => {
    it('should calculate uniform distribution', () => {
      expect(uniformDistribution(5, 0, 10)).toBe(0.1);
      expect(uniformDistribution(3, 0, 5)).toBe(0.2);
    });

    it('should return 0 outside range', () => {
      expect(uniformDistribution(-1, 0, 10)).toBe(0);
      expect(uniformDistribution(11, 0, 10)).toBe(0);
    });

    it('should throw on invalid range', () => {
      expect(() => uniformDistribution(5, 10, 0)).toThrow();
      expect(() => uniformDistribution(5, 5, 5)).toThrow();
    });
  });

  describe('normalDistribution', () => {
    it('should calculate normal distribution', () => {
      // At mean, should be maximum
      const atMean = normalDistribution(0, 0, 1);
      expect(atMean).toBeCloseTo(0.3989, 3);

      // Should be symmetric
      const left = normalDistribution(-1, 0, 1);
      const right = normalDistribution(1, 0, 1);
      expect(left).toBeCloseTo(right, 10);
    });

    it('should handle different parameters', () => {
      const result = normalDistribution(5, 5, 2);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeCloseTo(0.1995, 3);
    });

    it('should throw on non-positive stdDev', () => {
      expect(() => normalDistribution(0, 0, 0)).toThrow();
      expect(() => normalDistribution(0, 0, -1)).toThrow();
    });
  });

  describe('bernoulliDistribution', () => {
    it('should calculate Bernoulli distribution', () => {
      expect(bernoulliDistribution(1, 0.7)).toBeCloseTo(0.7, 10);
      expect(bernoulliDistribution(0, 0.7)).toBeCloseTo(0.3, 10);
    });

    it('should throw on invalid x', () => {
      expect(() => bernoulliDistribution(2, 0.5)).toThrow();
      expect(() => bernoulliDistribution(-1, 0.5)).toThrow();
    });

    it('should throw on invalid p', () => {
      expect(() => bernoulliDistribution(1, -0.1)).toThrow();
      expect(() => bernoulliDistribution(1, 1.1)).toThrow();
    });
  });
});

describe('Sampling', () => {
  describe('sampleUniform', () => {
    it('should sample within range', () => {
      for (let i = 0; i < 100; i++) {
        const sample = sampleUniform(0, 10);
        expect(sample).toBeGreaterThanOrEqual(0);
        expect(sample).toBeLessThanOrEqual(10);
      }
    });

    it('should have approximately uniform distribution', () => {
      const samples = Array(1000)
        .fill(0)
        .map(() => sampleUniform(0, 10));
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
      expect(mean).toBeCloseTo(5, 0); // Should be around 5
    });

    it('should throw on invalid range', () => {
      expect(() => sampleUniform(10, 0)).toThrow();
    });
  });

  describe('sampleNormal', () => {
    it('should sample with approximately correct mean', () => {
      const samples = Array(1000)
        .fill(0)
        .map(() => sampleNormal(0, 1));
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
      expect(mean).toBeCloseTo(0, 0); // Within ±0.5 of 0
    });

    it('should sample with approximately correct stdDev', () => {
      const samples = Array(1000)
        .fill(0)
        .map(() => sampleNormal(0, 1));
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
      const variance =
        samples.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) /
        samples.length;
      const stdDev = Math.sqrt(variance);
      expect(stdDev).toBeCloseTo(1, 0); // Within ±0.5 of 1
    });

    it('should throw on non-positive stdDev', () => {
      expect(() => sampleNormal(0, 0)).toThrow();
      expect(() => sampleNormal(0, -1)).toThrow();
    });
  });

  describe('sampleBernoulli', () => {
    it('should sample 0 or 1', () => {
      for (let i = 0; i < 100; i++) {
        const sample = sampleBernoulli(0.5);
        expect([0, 1]).toContain(sample);
      }
    });

    it('should have approximately correct probability', () => {
      const p = 0.7;
      const samples = Array(1000)
        .fill(0)
        .map(() => sampleBernoulli(p));
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
      expect(mean).toBeCloseTo(p, 1); // Within ±0.05
    });

    it('should throw on invalid p', () => {
      expect(() => sampleBernoulli(-0.1)).toThrow();
      expect(() => sampleBernoulli(1.1)).toThrow();
    });
  });
});

describe('NaiveBayesClassifier', () => {
  let classifier: NaiveBayesClassifier;
  let trainingData: Array<{ features: string[]; label: string }>;

  beforeEach(() => {
    classifier = new NaiveBayesClassifier();
    trainingData = [
      { features: ['oferta', 'gratis', 'dinero'], label: 'spam' },
      { features: ['oferta', 'limitada', 'compra'], label: 'spam' },
      { features: ['gratis', 'premio', 'ganaste'], label: 'spam' },
      { features: ['reunión', 'mañana', 'oficina'], label: 'no-spam' },
      { features: ['proyecto', 'entrega', 'fecha'], label: 'no-spam' },
      { features: ['almuerzo', 'equipo', 'viernes'], label: 'no-spam' },
    ];
  });

  it('should train without errors', () => {
    expect(() => classifier.train(trainingData)).not.toThrow();
  });

  it('should throw on empty training data', () => {
    expect(() => classifier.train([])).toThrow();
  });

  it('should learn classes', () => {
    classifier.train(trainingData);
    const classes = classifier.getClasses();
    expect(classes).toContain('spam');
    expect(classes).toContain('no-spam');
    expect(classes.length).toBe(2);
  });

  it('should build vocabulary', () => {
    classifier.train(trainingData);
    const vocab = classifier.getVocabulary();
    expect(vocab).toContain('oferta');
    expect(vocab).toContain('gratis');
    expect(vocab).toContain('reunión');
    expect(vocab.length).toBeGreaterThan(0);
  });

  it('should predict spam correctly', () => {
    classifier.train(trainingData);
    const prediction = classifier.predict(['oferta', 'gratis']);
    expect(prediction).toBe('spam');
  });

  it('should predict no-spam correctly', () => {
    classifier.train(trainingData);
    const prediction = classifier.predict(['reunión', 'oficina']);
    expect(prediction).toBe('no-spam');
  });

  it('should return probabilities', () => {
    classifier.train(trainingData);
    const probs = classifier.predictProbabilities(['oferta', 'gratis']);

    expect(probs.size).toBe(2);
    expect(probs.has('spam')).toBe(true);
    expect(probs.has('no-spam')).toBe(true);

    // Probabilities should sum to 1
    let sum = 0;
    probs.forEach(p => (sum += p));
    expect(sum).toBeCloseTo(1, 10);

    // Probabilities should be between 0 and 1
    probs.forEach(p => {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
    });
  });

  it('should give higher probability to spam for spam features', () => {
    classifier.train(trainingData);
    const probs = classifier.predictProbabilities(['oferta', 'gratis']);
    const spamProb = probs.get('spam')!;
    const noSpamProb = probs.get('no-spam')!;
    expect(spamProb).toBeGreaterThan(noSpamProb);
  });

  it('should handle unseen features with smoothing', () => {
    classifier.train(trainingData);
    expect(() => classifier.predict(['palabra', 'inexistente'])).not.toThrow();
  });

  it('should throw when predicting before training', () => {
    expect(() => classifier.predict(['test'])).toThrow();
  });

  it('should handle different smoothing values', () => {
    const classifier1 = new NaiveBayesClassifier(0.1);
    const classifier2 = new NaiveBayesClassifier(10);

    classifier1.train(trainingData);
    classifier2.train(trainingData);

    const pred1 = classifier1.predict(['oferta']);
    const pred2 = classifier2.predict(['oferta']);

    // Both should predict spam, but with different confidence
    expect(pred1).toBe('spam');
    expect(pred2).toBe('spam');
  });

  it('should make consistent predictions', () => {
    classifier.train(trainingData);
    const features = ['oferta', 'gratis'];
    const pred1 = classifier.predict(features);
    const pred2 = classifier.predict(features);
    expect(pred1).toBe(pred2);
  });
});
