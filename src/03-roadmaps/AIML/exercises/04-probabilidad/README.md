# Ejercicio 04: Probabilidad

**Objetivo:** Comprender y aplicar conceptos fundamentales de probabilidad que son esenciales para Machine Learning.

## 📖 Teoría

### ¿Por qué es importante la probabilidad en ML?

La probabilidad es fundamental en ML para:
- **Clasificación**: Predecir la probabilidad de que una muestra pertenezca a una clase
- **Incertidumbre**: Cuantificar la confianza de las predicciones
- **Inferencia Bayesiana**: Actualizar creencias con nueva evidencia
- **Modelos Generativos**: Modelar la distribución de los datos
- **Teoría de Decisiones**: Tomar decisiones óptimas bajo incertidumbre

### Conceptos Fundamentales

#### 1. **Probabilidad Básica**

**Probabilidad de un evento:**
```
P(A) = Casos favorables / Casos posibles
```

Propiedades:
- `0 ≤ P(A) ≤ 1`
- `P(A) + P(¬A) = 1` (complemento)
- `P(∅) = 0` (evento imposible)
- `P(Ω) = 1` (evento seguro)

#### 2. **Probabilidad Conjunta**

Probabilidad de que dos eventos ocurran juntos:
```
P(A ∩ B) o P(A, B)
```

**Eventos independientes:**
```
P(A, B) = P(A) × P(B)
```

#### 3. **Probabilidad Condicional**

Probabilidad de A dado que B ocurrió:
```
P(A|B) = P(A, B) / P(B)
```

Donde `P(B) > 0`

#### 4. **Teorema de Bayes**

Uno de los teoremas más importantes en ML:
```
P(A|B) = P(B|A) × P(A) / P(B)
```

Términos:
- `P(A|B)`: Probabilidad posterior (lo que queremos calcular)
- `P(B|A)`: Likelihood (verosimilitud)
- `P(A)`: Prior (probabilidad a priori)
- `P(B)`: Evidencia (normalización)

**Aplicación en ML:**
```
P(Clase|Datos) = P(Datos|Clase) × P(Clase) / P(Datos)
```

#### 5. **Distribuciones de Probabilidad**

**Distribución Uniforme:**
- Todos los valores tienen la misma probabilidad
- `P(x) = 1/n` para n valores posibles

**Distribución Normal (Gaussiana):**
```
P(x) = (1 / (σ√(2π))) × e^(-(x-μ)²/(2σ²))
```
- `μ`: media
- `σ`: desviación estándar

**Distribución Bernoulli:**
- Para variables binarias (éxito/fracaso)
- `P(X=1) = p`, `P(X=0) = 1-p`

---

## 🎯 Escenario

Estás desarrollando un sistema de detección de spam. Necesitas calcular:
```
P(Spam|"oferta") = ¿Probabilidad de que sea spam dado que contiene "oferta"?
```

Datos:
- 60% de los emails son spam: `P(Spam) = 0.6`
- 80% de los spams contienen "oferta": `P("oferta"|Spam) = 0.8`
- 20% de los no-spam contienen "oferta": `P("oferta"|NoSpam) = 0.2`

Usando Bayes:
```
P(Spam|"oferta") = P("oferta"|Spam) × P(Spam) / P("oferta")
                 = 0.8 × 0.6 / P("oferta")
```

Donde:
```
P("oferta") = P("oferta"|Spam)×P(Spam) + P("oferta"|NoSpam)×P(NoSpam)
            = 0.8×0.6 + 0.2×0.4
            = 0.48 + 0.08 = 0.56
```

Resultado:
```
P(Spam|"oferta") = 0.48 / 0.56 = 0.857 (85.7%)
```

---

## 📝 Instrucciones

### Parte 1: Probabilidades Básicas

Implementa funciones para calcular probabilidades básicas:

```typescript
export function probability(favorable: number, total: number): number {
  // Tu código aquí
  // P(A) = favorable / total
}

export function complement(p: number): number {
  // Tu código aquí
  // P(¬A) = 1 - P(A)
}

export function jointProbability(pA: number, pB: number): number {
  // Tu código aquí
  // P(A ∩ B) = P(A) × P(B) para eventos independientes
}

// Ejemplo de uso:
console.log(probability(1, 6));        // 0.166... (tirar un dado)
console.log(complement(0.3));          // 0.7
console.log(jointProbability(0.5, 0.5)); // 0.25
```

### Parte 2: Probabilidad Condicional

Implementa la probabilidad condicional:

```typescript
export function conditionalProbability(
  pAandB: number,
  pB: number
): number {
  // Tu código aquí
  // P(A|B) = P(A,B) / P(B)
}

// Ejemplo de uso:
const pRain = 0.3;         // P(lluvia)
const pCloudy = 0.5;       // P(nublado)
const pRainAndCloudy = 0.25; // P(lluvia y nublado)

console.log(conditionalProbability(pRainAndCloudy, pCloudy));
// P(lluvia|nublado) = 0.25 / 0.5 = 0.5
```

### Parte 3: Teorema de Bayes

Implementa el Teorema de Bayes:

```typescript
export function bayesTheorem(
  pBA: number,  // P(B|A) - likelihood
  pA: number,   // P(A) - prior
  pB: number    // P(B) - evidence
): number {
  // Tu código aquí
  // P(A|B) = P(B|A) × P(A) / P(B)
}

export function bayesWithComplement(
  pBA: number,     // P(B|A)
  pA: number,      // P(A)
  pBNotA: number   // P(B|¬A)
): number {
  // Tu código aquí
  // Calcular P(B) usando ley de probabilidad total:
  // P(B) = P(B|A)×P(A) + P(B|¬A)×P(¬A)
  // Luego aplicar Bayes
}

// Ejemplo de uso (spam):
const pOfertaGivenSpam = 0.8;
const pSpam = 0.6;
const pOfertaGivenNoSpam = 0.2;

console.log(bayesWithComplement(
  pOfertaGivenSpam,
  pSpam,
  pOfertaGivenNoSpam
)); // 0.857 (85.7% de probabilidad de spam)
```

### Parte 4: Distribuciones de Probabilidad

Implementa funciones para distribuciones comunes:

```typescript
export function uniformDistribution(
  x: number,
  min: number,
  max: number
): number {
  // Tu código aquí
  // P(x) = 1 / (max - min) si min ≤ x ≤ max, 0 en otro caso
}

export function normalDistribution(
  x: number,
  mean: number,
  stdDev: number
): number {
  // Tu código aquí
  // Fórmula de la distribución normal
}

export function bernoulliDistribution(
  x: number,
  p: number
): number {
  // Tu código aquí
  // P(X=1) = p, P(X=0) = 1-p
}

// Ejemplo de uso:
console.log(uniformDistribution(5, 0, 10));  // 0.1
console.log(normalDistribution(0, 0, 1));    // ~0.398 (en la media)
console.log(bernoulliDistribution(1, 0.7));  // 0.7
```

### Parte 5: Muestreo de Distribuciones

Implementa funciones para generar muestras aleatorias:

```typescript
export function sampleUniform(min: number, max: number): number {
  // Tu código aquí
  // Retorna un valor aleatorio entre min y max
}

export function sampleNormal(mean: number, stdDev: number): number {
  // Tu código aquí
  // Usa el método Box-Muller para generar valores normales
}

export function sampleBernoulli(p: number): number {
  // Tu código aquí
  // Retorna 1 con probabilidad p, 0 con probabilidad 1-p
}

// Ejemplo de uso:
const samples = Array(1000).fill(0).map(() => sampleNormal(0, 1));
console.log('Media de muestras:', mean(samples)); // ~0
```

### Parte 6: Naive Bayes Classifier (Bonus)

Implementa un clasificador Naive Bayes simple:

```typescript
export class NaiveBayesClassifier {
  private classPriors: Map<string, number>;
  private featureLikelihoods: Map<string, Map<string, number>>;

  train(data: Array<{features: string[], label: string}>): void {
    // Calcular P(clase) y P(feature|clase)
  }

  predict(features: string[]): string {
    // Usar Bayes para predecir la clase más probable
  }

  predictProbabilities(features: string[]): Map<string, number> {
    // Retornar probabilidades de todas las clases
  }
}

// Ejemplo de uso:
const classifier = new NaiveBayesClassifier();
classifier.train([
  { features: ['oferta', 'gratis'], label: 'spam' },
  { features: ['reunión', 'mañana'], label: 'no-spam' },
  // ... más datos
]);

console.log(classifier.predict(['oferta'])); // 'spam'
```

---

## ✅ Resultado Esperado

Al finalizar, deberías poder:

1. ✅ Calcular probabilidades básicas y complementos
2. ✅ Calcular probabilidades condicionales
3. ✅ Aplicar el Teorema de Bayes
4. ✅ Trabajar con distribuciones de probabilidad
5. ✅ Generar muestras aleatorias de distribuciones
6. ✅ Implementar un clasificador Naive Bayes básico
7. ✅ Entender la diferencia entre prior, likelihood y posterior

---

## 🧪 Tests

Ejecuta los tests para verificar tu implementación:

```bash
npm test 04-probabilidad
```

Los tests verificarán:
- Probabilidades entre 0 y 1
- Teorema de Bayes correctamente aplicado
- Distribuciones normalizadas
- Muestras con distribución correcta
- Clasificador Naive Bayes con predicciones razonables

---

## 💡 Consejos

1. **Valida probabilidades**: Siempre entre 0 y 1
2. **Box-Muller**: Para generar distribución normal desde uniforme
3. **Log-probabilities**: Para evitar underflow con muchas multiplicaciones
4. **Suavizado de Laplace**: Añade pseudoconteo para evitar probabilidades cero
5. **Normalización**: Asegúrate de que las probabilidades suman 1

---

## 🎓 Conceptos Clave

- **Prior**: Tu creencia inicial antes de ver los datos
- **Likelihood**: Qué tan bien los datos explican la hipótesis
- **Posterior**: Tu creencia actualizada después de ver los datos
- **Independencia**: Naive Bayes asume features independientes
- **Ley de probabilidad total**: `P(B) = Σ P(B|A_i)×P(A_i)`
- **Underflow**: Multiplicar muchas probabilidades pequeñas → usar log

---

## 📊 Aplicaciones en ML

**Naive Bayes:**
- Clasificación de texto (spam, sentimiento)
- Diagnóstico médico
- Filtrado de contenido

**Modelos Bayesianos:**
- A/B Testing
- Bandits multi-brazo
- Optimización bayesiana de hiperparámetros

**Redes Bayesianas:**
- Modelado de dependencias causales
- Razonamiento probabilístico

---

## 📚 Recursos

- [Bayes Theorem for Machine Learning](https://machinelearningmastery.com/bayes-theorem-for-machine-learning/)
- [Naive Bayes Classifier](https://en.wikipedia.org/wiki/Naive_Bayes_classifier)
- [Probability Distributions](https://www.probabilitycourse.com/)
- [Think Bayes - Allen Downey](http://www.greenteapress.com/thinkbayes/)

---

**¡Comienza implementando en `probability.ts`!** 🚀
