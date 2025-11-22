# Ejercicio 10: Ensemble Methods

**Objetivo:** Implementar métodos de ensemble (bagging y random forest) para mejorar el rendimiento combinando múltiples modelos.

## 📖 Teoría

### ¿Qué son los Ensemble Methods?

**Idea central:** "La sabiduría de las multitudes"

Combinar múltiples modelos débiles para crear un modelo fuerte.

**Ventajas:**
- **Mejor accuracy**: Supera modelos individuales
- **Reduce overfitting**: Promedia errores
- **Más robusto**: Menos sensible a ruido
- **Reduce varianza**: Predicciones más estables

### Bagging (Bootstrap Aggregating)

**Algoritmo:**
```
1. Para i = 1 a M:
   a. Tomar muestra bootstrap de datos (con reemplazo)
   b. Entrenar modelo en esta muestra
2. Predicción:
   - Clasificación: Votación mayoritaria
   - Regresión: Promedio
```

**Bootstrap Sample:**
```
Datos originales: [1, 2, 3, 4, 5]
Bootstrap 1:      [1, 1, 3, 4, 5]
Bootstrap 2:      [2, 2, 2, 3, 5]
Bootstrap 3:      [1, 3, 4, 4, 5]
```

Cada muestra tiene mismo tamaño, pero con reemplazo.

**¿Por qué funciona?**
- Reduce varianza sin aumentar bias
- Modelos ven diferentes datos
- Errores se cancelan al promediar

### Random Forest

**Mejora sobre bagging:** Añade aleatoriedad en features.

**Algoritmo:**
```
1. Para cada árbol:
   a. Tomar muestra bootstrap de datos
   b. En cada split:
      - Elegir subconjunto aleatorio de m features
      - Encontrar mejor split entre esas m features
2. Predicción: Votación/promedio de todos los árboles
```

**Parámetro clave:**
```
m = sqrt(n_features) para clasificación
m = n_features / 3 para regresión
```

**Ventajas adicionales:**
- Reduce correlación entre árboles
- Mejor generalización
- Maneja miles de features
- Feature importance automático

### Boosting (Conceptos básicos)

**Idea:** Entrenar modelos secuencialmente, enfocándose en errores previos.

**AdaBoost (Adaptive Boosting):**
```
1. Inicializar pesos wi = 1/n para cada ejemplo
2. Para t = 1 a T:
   a. Entrenar clasificador ht con pesos wi
   b. Calcular error εt = Σ(wi × I(yi ≠ ht(xi)))
   c. Calcular αt = log((1-εt)/εt)
   d. Actualizar pesos: wi = wi × exp(αt × I(yi ≠ ht(xi)))
3. Predicción: sign(Σ(αt × ht(x)))
```

**Diferencia con Bagging:**
- Bagging: Modelos paralelos e independientes
- Boosting: Modelos secuenciales, cada uno corrige errores del anterior

### Comparación de Métodos

| Método | Entrenamiento | Varianza | Bias | Overfitting |
|--------|---------------|----------|------|-------------|
| Single Tree | Rápido | Alta | Baja | Alto |
| Bagging | Paralelo | Baja | Igual | Medio |
| Random Forest | Paralelo | Muy baja | Igual | Bajo |
| Boosting | Secuencial | Baja | Baja | Medio-Alto |

**Recomendación general:** Random Forest es excelente punto de partida.

---

## 🎯 Escenario

Dataset de préstamos bancarios:

```
Edad | Ingresos | Deuda | Default
25   | 40k      | 10k   | No
30   | 60k      | 5k    | No
35   | 50k      | 30k   | Sí
40   | 90k      | 20k   | No
```

**Objetivo:** Predecir si un cliente hará default en su préstamo.

---

## 📝 Instrucciones

### Parte 1: Bagging Classifier

```typescript
export class BaggingClassifier {
  private models: DecisionTreeClassifier[] = [];
  private nEstimators: number;
  private maxSamples: number;

  constructor(nEstimators: number = 10, maxSamples: number = 1.0) {
    this.nEstimators = nEstimators;
    this.maxSamples = maxSamples;
  }

  fit(X: number[][], y: number[]): void {
    // 1. Para cada estimador:
    //    - Crear muestra bootstrap
    //    - Entrenar árbol de decisión
  }

  predict(X: number[][]): number[] {
    // Votación mayoritaria de todos los árboles
  }
}
```

### Parte 2: Random Forest

```typescript
export class RandomForestClassifier {
  private trees: DecisionTreeClassifier[] = [];
  private nEstimators: number;
  private maxFeatures: number | 'sqrt' | 'log2';

  constructor(config: {
    nEstimators?: number;
    maxFeatures?: number | 'sqrt' | 'log2';
    maxDepth?: number;
  }) {
    // Configuración
  }

  fit(X: number[][], y: number[]): void {
    // Entrenar múltiples árboles con feature randomness
  }

  predict(X: number[][]): number[];
  predictProba(X: number[][]): number[][];
  getFeatureImportance(): number[];
}
```

### Parte 3: Utilidades

```typescript
export function bootstrapSample(
  X: number[][],
  y: number[]
): { X_sample: number[][]; y_sample: number[] };

export function randomSubset<T>(arr: T[], size: number): T[];

export function majorityVote(predictions: number[][]): number[];

export function outOfBagScore(
  model: BaggingClassifier | RandomForestClassifier,
  X: number[][],
  y: number[]
): number;
```

---

## ✅ Resultado Esperado

1. ✅ Implementar Bagging desde cero
2. ✅ Implementar Random Forest
3. ✅ Bootstrap sampling
4. ✅ Votación mayoritaria
5. ✅ Feature importance
6. ✅ Out-of-bag scoring

---

## 🧪 Tests

```bash
npm test 10-ensemble-methods
```

---

## 💡 Consejos

1. **n_estimators=100**: Buen punto de partida
2. **max_features='sqrt'**: Para clasificación
3. **Más árboles = mejor**: Pero más lento
4. **max_depth=10**: Previene overfitting individual
5. **OOB score**: Estima accuracy sin validation set
6. **Feature importance**: Identifica variables clave

---

## 📚 Recursos

- [Random Forest - sklearn](https://scikit-learn.org/stable/modules/ensemble.html#forest)
- [Bagging Predictors - Breiman](https://www.stat.berkeley.edu/~breiman/bagging.pdf)
- [Random Forest Paper](https://www.stat.berkeley.edu/~breiman/randomforest2001.pdf)

---

**¡Comienza implementando en `ensemble.ts`!** 🚀
