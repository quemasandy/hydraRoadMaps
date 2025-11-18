# Ejercicio 09: Decision Trees

**Objetivo:** Implementar árboles de decisión desde cero usando el algoritmo CART con Gini impurity e information gain.

## 📖 Teoría

### ¿Qué son los Decision Trees?

Árboles de decisión son modelos que aprenden reglas de decisión a partir de datos.

**Usos:**
- **Clasificación**: Predecir categorías
- **Regresión**: Predecir valores continuos
- **Interpretabilidad**: Fáciles de visualizar y explicar
- **Base para ensembles**: Random Forest, Gradient Boosting

### Estructura del Árbol

```
           [Feature1 <= 5]
          /              \
    [Feature2 <= 3]     [Class: B]
      /         \
 [Class: A]   [Class: C]
```

**Componentes:**
- **Nodo raíz**: Primera decisión
- **Nodos internos**: Preguntas sobre features
- **Hojas**: Predicciones finales
- **Splits**: Divisiones de datos

### Algoritmo CART

**Classification And Regression Trees**

**Proceso:**
```
1. Empezar con todos los datos en la raíz
2. Para cada feature y threshold:
   - Dividir datos en izquierda/derecha
   - Calcular impureza de la división
3. Elegir mejor split (menor impureza)
4. Recursivamente aplicar a nodos hijos
5. Parar cuando:
   - Todos los puntos son de la misma clase
   - Profundidad máxima alcanzada
   - Muy pocos puntos en el nodo
```

### Gini Impurity

Mide qué tan "impura" es una división:

```
Gini = 1 - Σ(pi)²
```

Donde `pi` es la proporción de clase `i`.

**Ejemplos:**
```
[100% clase A]: Gini = 1 - 1² = 0 (puro)
[50% A, 50% B]: Gini = 1 - (0.5² + 0.5²) = 0.5 (impuro)
[33% A, 33% B, 33% C]: Gini = 1 - 3×(0.33)² = 0.67 (muy impuro)
```

**Gini del Split:**
```
Gini_split = (n_left/n_total) × Gini_left + (n_right/n_total) × Gini_right
```

**Objetivo:** Minimizar Gini del split.

### Information Gain (Entropy)

Alternativa a Gini usando entropía:

```
Entropy = -Σ(pi × log2(pi))
```

**Information Gain:**
```
IG = Entropy_parent - (weighted avg of children entropy)
```

**Objetivo:** Maximizar information gain.

### Comparación: Gini vs Entropy

| Aspecto | Gini | Entropy |
|---------|------|---------|
| Cálculo | Más rápido | Más lento (log) |
| Rango | [0, 0.5] | [0, 1] |
| Resultados | Muy similares | Muy similares |
| Uso | sklearn default | Información teórica |

**Recomendación:** Usar Gini (más rápido, resultados similares).

### Overfitting

Árboles profundos memorizan datos:

**Síntomas:**
- 100% accuracy en train, baja en test
- Árbol muy profundo
- Hojas con muy pocos puntos

**Soluciones:**
1. **max_depth**: Limitar profundidad
2. **min_samples_split**: Mínimo de puntos para dividir
3. **min_samples_leaf**: Mínimo de puntos por hoja
4. **Pruning**: Podar ramas después
5. **Ensembles**: Random Forest

---

## 🎯 Escenario

Predecir si un cliente comprará un producto:

```
Edad | Salario | Compra
25   | 40k     | No
30   | 60k     | No
35   | 80k     | Sí
40   | 90k     | Sí
45   | 110k    | Sí
```

**Árbol aprendido:**
```
Salario <= 70k?
├─ Sí → No
└─ No → Sí
```

---

## 📝 Instrucciones

### Parte 1: Estructura del Árbol

```typescript
export interface TreeNode {
  featureIndex?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  value?: number; // Para hojas: clase predicha
  samples?: number;
  gini?: number;
}

export interface DecisionTreeConfig {
  maxDepth?: number;
  minSamplesSplit?: number;
  minSamplesLeaf?: number;
  criterion?: 'gini' | 'entropy';
}
```

### Parte 2: Implementar Árbol

```typescript
export class DecisionTreeClassifier {
  private root?: TreeNode;
  private config: DecisionTreeConfig;

  constructor(config: DecisionTreeConfig = {}) {
    this.config = {
      maxDepth: 10,
      minSamplesSplit: 2,
      minSamplesLeaf: 1,
      criterion: 'gini',
      ...config,
    };
  }

  fit(X: number[][], y: number[]): void;
  predict(X: number[][]): number[];
  predictOne(x: number[]): number;
}
```

### Parte 3: Funciones de Impureza

```typescript
export function computeGini(y: number[]): number;
export function computeEntropy(y: number[]): number;
export function computeInformationGain(
  y_parent: number[],
  y_left: number[],
  y_right: number[]
): number;
```

### Parte 4: Feature Importance

```typescript
export function computeFeatureImportance(
  tree: DecisionTreeClassifier,
  n_features: number
): number[];
```

---

## ✅ Resultado Esperado

1. ✅ Implementar árbol de decisión con CART
2. ✅ Calcular Gini impurity
3. ✅ Calcular Entropy e Information Gain
4. ✅ Manejar overfitting con hiperparámetros
5. ✅ Hacer predicciones
6. ✅ Calcular feature importance

---

## 🧪 Tests

```bash
npm test 09-decision-trees
```

---

## 💡 Consejos

1. **max_depth=5**: Buen punto de partida
2. **Normalizar no es necesario**: Árboles son invariantes a escala
3. **Categorical features**: Convertir a one-hot encoding
4. **Visualiza árbol**: Ayuda a entender decisiones
5. **Compara con Random Forest**: Suele ser mejor

---

## 📚 Recursos

- [Decision Trees - sklearn](https://scikit-learn.org/stable/modules/tree.html)
- [CART Algorithm](https://machinelearningmastery.com/classification-and-regression-trees-for-machine-learning/)
- [Gini vs Entropy](https://quantdare.com/decision-trees-gini-vs-entropy/)

---

**¡Comienza implementando en `decision-tree.ts`!** 🚀
