/**
 * Ejercicio 04: Probabilidad
 *
 * Este módulo implementa conceptos fundamentales de probabilidad
 * que son esenciales para Machine Learning, incluyendo el Teorema de Bayes
 * y distribuciones de probabilidad comunes.
 */

// ============================================
// PROBABILIDADES BÁSICAS
// ============================================

/**
 * Calcula la probabilidad de un evento
 * Formula: P(A) = casos favorables / casos totales
 *
 * @param favorable - Número de casos favorables
 * @param total - Número total de casos
 * @returns Probabilidad entre 0 y 1
 */
export function probability(favorable: number, total: number): number {
  if (total <= 0) {
    throw new Error('El total debe ser mayor que cero');
  }

  if (favorable < 0 || favorable > total) {
    throw new Error('Casos favorables deben estar entre 0 y total');
  }

  return favorable / total;
}

/**
 * Calcula el complemento de una probabilidad
 * Formula: P(¬A) = 1 - P(A)
 *
 * @param p - Probabilidad del evento A
 * @returns Probabilidad del complemento
 */
export function complement(p: number): number {
  if (p < 0 || p > 1) {
    throw new Error('La probabilidad debe estar entre 0 y 1');
  }

  return 1 - p;
}

/**
 * Calcula la probabilidad conjunta de dos eventos independientes
 * Formula: P(A ∩ B) = P(A) × P(B)
 *
 * @param pA - Probabilidad del evento A
 * @param pB - Probabilidad del evento B
 * @returns Probabilidad conjunta
 */
export function jointProbability(pA: number, pB: number): number {
  if (pA < 0 || pA > 1 || pB < 0 || pB > 1) {
    throw new Error('Las probabilidades deben estar entre 0 y 1');
  }

  return pA * pB;
}

// ============================================
// PROBABILIDAD CONDICIONAL
// ============================================

/**
 * Calcula la probabilidad condicional P(A|B)
 * Formula: P(A|B) = P(A,B) / P(B)
 *
 * @param pAandB - Probabilidad conjunta P(A,B)
 * @param pB - Probabilidad de B
 * @returns Probabilidad condicional P(A|B)
 */
export function conditionalProbability(
  pAandB: number,
  pB: number
): number {
  if (pB === 0) {
    throw new Error('P(B) no puede ser cero');
  }

  if (pAandB < 0 || pAandB > 1 || pB < 0 || pB > 1) {
    throw new Error('Las probabilidades deben estar entre 0 y 1');
  }

  if (pAandB > pB) {
    throw new Error('P(A,B) no puede ser mayor que P(B)');
  }

  return pAandB / pB;
}

// ============================================
// TEOREMA DE BAYES
// ============================================

/**
 * Aplica el Teorema de Bayes
 * Formula: P(A|B) = P(B|A) × P(A) / P(B)
 *
 * @param pBA - P(B|A) - Likelihood
 * @param pA - P(A) - Prior
 * @param pB - P(B) - Evidence
 * @returns P(A|B) - Posterior
 */
export function bayesTheorem(
  pBA: number,
  pA: number,
  pB: number
): number {
  if (pB === 0) {
    throw new Error('P(B) no puede ser cero');
  }

  if (pBA < 0 || pBA > 1 || pA < 0 || pA > 1 || pB < 0 || pB > 1) {
    throw new Error('Las probabilidades deben estar entre 0 y 1');
  }

  return (pBA * pA) / pB;
}

/**
 * Aplica el Teorema de Bayes calculando P(B) usando ley de probabilidad total
 * P(B) = P(B|A)×P(A) + P(B|¬A)×P(¬A)
 *
 * @param pBA - P(B|A) - Likelihood dado A
 * @param pA - P(A) - Prior
 * @param pBNotA - P(B|¬A) - Likelihood dado ¬A
 * @returns P(A|B) - Posterior
 */
export function bayesWithComplement(
  pBA: number,
  pA: number,
  pBNotA: number
): number {
  if (pBA < 0 || pBA > 1 || pA < 0 || pA > 1 || pBNotA < 0 || pBNotA > 1) {
    throw new Error('Las probabilidades deben estar entre 0 y 1');
  }

  // Ley de probabilidad total
  const pNotA = 1 - pA;
  const pB = pBA * pA + pBNotA * pNotA;

  if (pB === 0) {
    throw new Error('P(B) calculada es cero');
  }

  return (pBA * pA) / pB;
}

// ============================================
// DISTRIBUCIONES DE PROBABILIDAD
// ============================================

/**
 * Calcula la densidad de probabilidad de una distribución uniforme
 *
 * @param x - Valor a evaluar
 * @param min - Límite inferior
 * @param max - Límite superior
 * @returns Densidad de probabilidad en x
 */
export function uniformDistribution(
  x: number,
  min: number,
  max: number
): number {
  if (max <= min) {
    throw new Error('max debe ser mayor que min');
  }

  if (x < min || x > max) {
    return 0;
  }

  return 1 / (max - min);
}

/**
 * Calcula la densidad de probabilidad de una distribución normal (gaussiana)
 * Formula: P(x) = (1/(σ√(2π))) × e^(-(x-μ)²/(2σ²))
 *
 * @param x - Valor a evaluar
 * @param mean - Media (μ)
 * @param stdDev - Desviación estándar (σ)
 * @returns Densidad de probabilidad en x
 */
export function normalDistribution(
  x: number,
  mean: number,
  stdDev: number
): number {
  if (stdDev <= 0) {
    throw new Error('La desviación estándar debe ser positiva');
  }

  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));

  return coefficient * Math.exp(exponent);
}

/**
 * Calcula la probabilidad de una distribución de Bernoulli
 * P(X=1) = p, P(X=0) = 1-p
 *
 * @param x - Valor (debe ser 0 o 1)
 * @param p - Probabilidad de éxito
 * @returns Probabilidad de x
 */
export function bernoulliDistribution(x: number, p: number): number {
  if (p < 0 || p > 1) {
    throw new Error('p debe estar entre 0 y 1');
  }

  if (x !== 0 && x !== 1) {
    throw new Error('x debe ser 0 o 1');
  }

  return x === 1 ? p : 1 - p;
}

// ============================================
// MUESTREO DE DISTRIBUCIONES
// ============================================

/**
 * Genera una muestra aleatoria de una distribución uniforme
 *
 * @param min - Límite inferior
 * @param max - Límite superior
 * @returns Valor aleatorio entre min y max
 */
export function sampleUniform(min: number, max: number): number {
  if (max <= min) {
    throw new Error('max debe ser mayor que min');
  }

  return min + Math.random() * (max - min);
}

/**
 * Genera una muestra aleatoria de una distribución normal
 * Usa el método Box-Muller para transformar uniforme → normal
 *
 * @param mean - Media
 * @param stdDev - Desviación estándar
 * @returns Valor aleatorio con distribución normal
 */
export function sampleNormal(mean: number, stdDev: number): number {
  if (stdDev <= 0) {
    throw new Error('La desviación estándar debe ser positiva');
  }

  // Método Box-Muller
  const u1 = Math.random();
  const u2 = Math.random();

  // Transformación Box-Muller
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  return mean + z0 * stdDev;
}

/**
 * Genera una muestra aleatoria de una distribución de Bernoulli
 *
 * @param p - Probabilidad de éxito (retornar 1)
 * @returns 1 con probabilidad p, 0 con probabilidad 1-p
 */
export function sampleBernoulli(p: number): number {
  if (p < 0 || p > 1) {
    throw new Error('p debe estar entre 0 y 1');
  }

  return Math.random() < p ? 1 : 0;
}

// ============================================
// NAIVE BAYES CLASSIFIER
// ============================================

/**
 * Clasificador Naive Bayes simple para clasificación de texto
 * Asume independencia condicional entre features (palabras)
 */
export class NaiveBayesClassifier {
  private classPriors: Map<string, number>;
  private featureLikelihoods: Map<string, Map<string, number>>;
  private vocabulary: Set<string>;
  private classCounts: Map<string, number>;
  private totalDocs: number;

  constructor(private smoothing: number = 1.0) {
    this.classPriors = new Map();
    this.featureLikelihoods = new Map();
    this.vocabulary = new Set();
    this.classCounts = new Map();
    this.totalDocs = 0;
  }

  /**
   * Entrena el clasificador con datos
   *
   * @param data - Array de ejemplos con features y label
   */
  train(data: Array<{ features: string[]; label: string }>): void {
    if (data.length === 0) {
      throw new Error('Los datos de entrenamiento no pueden estar vacíos');
    }

    this.totalDocs = data.length;

    // Contar clases y construir vocabulario
    const featureCounts = new Map<string, Map<string, number>>();

    data.forEach(({ features, label }) => {
      // Contar clases
      this.classCounts.set(label, (this.classCounts.get(label) || 0) + 1);

      // Inicializar contadores para esta clase si no existen
      if (!featureCounts.has(label)) {
        featureCounts.set(label, new Map());
      }

      // Contar features
      features.forEach(feature => {
        this.vocabulary.add(feature);
        const counts = featureCounts.get(label)!;
        counts.set(feature, (counts.get(feature) || 0) + 1);
      });
    });

    // Calcular priors P(clase)
    this.classCounts.forEach((count, label) => {
      this.classPriors.set(label, count / this.totalDocs);
    });

    // Calcular likelihoods P(feature|clase) con suavizado de Laplace
    this.classCounts.forEach((classCount, label) => {
      const counts = featureCounts.get(label) || new Map();
      const likelihoods = new Map<string, number>();

      // Contar total de features en esta clase
      let totalFeatures = 0;
      counts.forEach(count => {
        totalFeatures += count;
      });

      // Calcular likelihood para cada feature en el vocabulario
      this.vocabulary.forEach(feature => {
        const featureCount = counts.get(feature) || 0;
        // Suavizado de Laplace: (count + α) / (total + α × |V|)
        const likelihood =
          (featureCount + this.smoothing) /
          (totalFeatures + this.smoothing * this.vocabulary.size);
        likelihoods.set(feature, likelihood);
      });

      this.featureLikelihoods.set(label, likelihoods);
    });
  }

  /**
   * Predice la clase más probable para las features dadas
   *
   * @param features - Array de features
   * @returns Clase predicha
   */
  predict(features: string[]): string {
    const probabilities = this.predictProbabilities(features);

    let maxProb = -Infinity;
    let predictedClass = '';

    probabilities.forEach((prob, label) => {
      if (prob > maxProb) {
        maxProb = prob;
        predictedClass = label;
      }
    });

    return predictedClass;
  }

  /**
   * Calcula las probabilidades posteriores de todas las clases
   * Usa log-probabilities para evitar underflow
   *
   * @param features - Array de features
   * @returns Map de clase → probabilidad posterior
   */
  predictProbabilities(features: string[]): Map<string, number> {
    if (this.classPriors.size === 0) {
      throw new Error('El clasificador no ha sido entrenado');
    }

    const logProbabilities = new Map<string, number>();

    // Para cada clase, calcular log P(clase|features)
    this.classPriors.forEach((prior, label) => {
      // Log prior: log P(clase)
      let logProb = Math.log(prior);

      // Log likelihood: Σ log P(feature|clase)
      features.forEach(feature => {
        const likelihoods = this.featureLikelihoods.get(label);
        if (likelihoods) {
          const likelihood = likelihoods.get(feature);
          if (likelihood) {
            logProb += Math.log(likelihood);
          }
        }
      });

      logProbabilities.set(label, logProb);
    });

    // Convertir log-probabilities a probabilities y normalizar
    const probabilities = new Map<string, number>();
    let maxLogProb = Math.max(...logProbabilities.values());

    // Restar el máximo para estabilidad numérica
    let sumProb = 0;
    logProbabilities.forEach((logProb, label) => {
      const prob = Math.exp(logProb - maxLogProb);
      probabilities.set(label, prob);
      sumProb += prob;
    });

    // Normalizar
    probabilities.forEach((prob, label) => {
      probabilities.set(label, prob / sumProb);
    });

    return probabilities;
  }

  /**
   * Retorna las clases conocidas
   */
  getClasses(): string[] {
    return Array.from(this.classPriors.keys());
  }

  /**
   * Retorna el vocabulario aprendido
   */
  getVocabulary(): string[] {
    return Array.from(this.vocabulary);
  }
}

// ============================================
// Demostración práctica
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 04: Probabilidad ===\n');

  // Ejemplo 1: Probabilidades básicas
  console.log('1. Probabilidades Básicas:');
  console.log('P(sacar 6 en un dado):', probability(1, 6).toFixed(3));
  console.log('P(no sacar 6):', complement(probability(1, 6)).toFixed(3));
  console.log(
    'P(dos monedas cara):',
    jointProbability(0.5, 0.5).toFixed(3)
  );
  console.log();

  // Ejemplo 2: Probabilidad condicional
  console.log('2. Probabilidad Condicional:');
  const pRainAndCloudy = 0.25;
  const pCloudy = 0.5;
  console.log('P(lluvia y nublado):', pRainAndCloudy);
  console.log('P(nublado):', pCloudy);
  console.log(
    'P(lluvia|nublado):',
    conditionalProbability(pRainAndCloudy, pCloudy)
  );
  console.log();

  // Ejemplo 3: Teorema de Bayes (detección de spam)
  console.log('3. Teorema de Bayes - Detección de Spam:');
  const pOfertaGivenSpam = 0.8;
  const pSpam = 0.6;
  const pOfertaGivenNoSpam = 0.2;

  const pSpamGivenOferta = bayesWithComplement(
    pOfertaGivenSpam,
    pSpam,
    pOfertaGivenNoSpam
  );

  console.log('P("oferta"|spam):', pOfertaGivenSpam);
  console.log('P(spam):', pSpam);
  console.log('P("oferta"|no-spam):', pOfertaGivenNoSpam);
  console.log('P(spam|"oferta"):', pSpamGivenOferta.toFixed(3));
  console.log(
    `→ ${(pSpamGivenOferta * 100).toFixed(1)}% de probabilidad de que sea spam\n`
  );

  // Ejemplo 4: Distribuciones
  console.log('4. Distribuciones de Probabilidad:');
  console.log('Uniforme(5, 0, 10):', uniformDistribution(5, 0, 10));
  console.log('Normal(0, 0, 1):', normalDistribution(0, 0, 1).toFixed(3));
  console.log('Bernoulli(1, 0.7):', bernoulliDistribution(1, 0.7));
  console.log();

  // Ejemplo 5: Muestreo
  console.log('5. Muestreo de Distribuciones:');
  const uniformSamples = Array(5)
    .fill(0)
    .map(() => sampleUniform(0, 10));
  console.log('5 muestras uniformes [0, 10]:', uniformSamples.map(x => x.toFixed(2)));

  const normalSamples = Array(5)
    .fill(0)
    .map(() => sampleNormal(0, 1));
  console.log('5 muestras normales N(0,1):', normalSamples.map(x => x.toFixed(2)));

  const bernoulliSamples = Array(10)
    .fill(0)
    .map(() => sampleBernoulli(0.7));
  console.log('10 muestras Bernoulli(0.7):', bernoulliSamples.join(', '));
  console.log();

  // Ejemplo 6: Naive Bayes Classifier
  console.log('6. Clasificador Naive Bayes - Spam Detection:');
  const classifier = new NaiveBayesClassifier();

  const trainingData = [
    { features: ['oferta', 'gratis', 'dinero'], label: 'spam' },
    { features: ['oferta', 'limitada', 'compra'], label: 'spam' },
    { features: ['gratis', 'premio', 'ganaste'], label: 'spam' },
    { features: ['reunión', 'mañana', 'oficina'], label: 'no-spam' },
    { features: ['proyecto', 'entrega', 'fecha'], label: 'no-spam' },
    { features: ['almuerzo', 'equipo', 'viernes'], label: 'no-spam' },
  ];

  classifier.train(trainingData);

  console.log('Clases:', classifier.getClasses());
  console.log('Vocabulario:', classifier.getVocabulary().slice(0, 5), '...');

  const testFeatures = ['oferta', 'gratis'];
  const prediction = classifier.predict(testFeatures);
  const probabilities = classifier.predictProbabilities(testFeatures);

  console.log('\nPredición para ["oferta", "gratis"]:');
  console.log('Clase predicha:', prediction);
  console.log('Probabilidades:');
  probabilities.forEach((prob, label) => {
    console.log(`  ${label}: ${(prob * 100).toFixed(1)}%`);
  });
}
