# Ejercicio 01: Datos y Preprocesamiento

**Objetivo:** Aprender a limpiar, transformar y preparar datos para algoritmos de Machine Learning.

## 📖 Teoría

### ¿Por qué es importante el preprocesamiento?

Los algoritmos de ML funcionan mejor cuando los datos están:
- **Normalizados**: En la misma escala
- **Completos**: Sin valores faltantes
- **Codificados**: Variables categóricas convertidas a numéricas
- **Divididos**: Train/test sets para evaluación

### Técnicas Principales

1. **Normalización Min-Max**
   ```
   x_norm = (x - x_min) / (x_max - x_min)
   ```
   Escala valores entre 0 y 1

2. **Normalización Z-score (Standardization)**
   ```
   x_std = (x - μ) / σ
   ```
   Centra datos con media 0 y desviación estándar 1

3. **One-Hot Encoding**
   Convierte categorías en vectores binarios:
   ```
   ['red', 'blue', 'green'] →
   [[1,0,0], [0,1,0], [0,0,1]]
   ```

4. **Train/Test Split**
   Divide datos en conjuntos de entrenamiento y prueba (típicamente 80/20)

---

## 🎯 Escenario

Tienes un dataset de casas con diferentes escalas:
- Precio: $100,000 - $500,000
- Superficie: 50m² - 300m²
- Habitaciones: 1 - 5
- Tipo: 'apartment', 'house', 'condo'

Necesitas preparar estos datos para entrenar un modelo de predicción de precios.

---

## 📝 Instrucciones

### Parte 1: Normalización Min-Max

Implementa una función que normalice un array de números entre 0 y 1:

```typescript
export function normalizeMinMax(data: number[]): number[] {
  // Tu código aquí
}

// Ejemplo de uso:
const data = [10, 20, 30, 40, 50];
console.log(normalizeMinMax(data)); // [0, 0.25, 0.5, 0.75, 1]
```

### Parte 2: Normalización Z-score

Implementa una función que estandarice datos:

```typescript
export function normalizeZScore(data: number[]): number[] {
  // Tu código aquí
  // mean = suma / n
  // stdDev = sqrt(suma((x - mean)^2) / n)
  // z = (x - mean) / stdDev
}

// Ejemplo de uso:
const data = [10, 20, 30, 40, 50];
console.log(normalizeZScore(data));
// Aproximadamente: [-1.26, -0.63, 0, 0.63, 1.26]
```

### Parte 3: One-Hot Encoding

Implementa una función que codifique variables categóricas:

```typescript
export function oneHotEncode(data: string[]): number[][] {
  // Tu código aquí
  // 1. Obtener categorías únicas
  // 2. Para cada elemento, crear un vector con 1 en la posición correcta
}

// Ejemplo de uso:
const types = ['apartment', 'house', 'apartment', 'condo'];
console.log(oneHotEncode(types));
// [[1,0,0], [0,1,0], [1,0,0], [0,0,1]]
```

### Parte 4: Train/Test Split

Implementa una función que divida datos en conjuntos de entrenamiento y prueba:

```typescript
export function trainTestSplit<T>(
  data: T[],
  trainSize: number = 0.8
): [T[], T[]] {
  // Tu código aquí
  // 1. Calcular índice de división
  // 2. Dividir array
  // 3. (Bonus) Shuffle antes de dividir
}

// Ejemplo de uso:
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const [train, test] = trainTestSplit(data, 0.8);
console.log(train.length); // 8
console.log(test.length);  // 2
```

### Parte 5: Manejo de Valores Faltantes

Implementa una función que maneje valores `null` o `undefined`:

```typescript
export function fillMissing(
  data: (number | null)[],
  strategy: 'mean' | 'median' | 'zero' = 'mean'
): number[] {
  // Tu código aquí
}

// Ejemplo de uso:
const data = [1, 2, null, 4, 5, null];
console.log(fillMissing(data, 'mean')); // [1, 2, 3, 4, 5, 3]
```

---

## ✅ Resultado Esperado

Al finalizar, deberías poder:

1. ✅ Normalizar datos con Min-Max y Z-score
2. ✅ Codificar variables categóricas con one-hot encoding
3. ✅ Dividir datasets en train/test
4. ✅ Manejar valores faltantes con diferentes estrategias
5. ✅ Entender por qué cada técnica es importante

---

## 🧪 Tests

Ejecuta los tests para verificar tu implementación:

```bash
npm test 01-datos-preprocesamiento
```

Los tests verificarán:
- Normalización correcta (valores entre 0-1 o media 0)
- One-hot encoding con dimensiones correctas
- Train/test split con proporciones correctas
- Manejo de casos extremos (arrays vacíos, un solo elemento)

---

## 💡 Consejos

1. **Maneja casos extremos**: ¿Qué pasa si todos los valores son iguales?
2. **Usa reduce()**: Para calcular sumas y promedios
3. **Usa map()**: Para transformaciones elemento por elemento
4. **Set para únicos**: `new Set(array)` elimina duplicados
5. **Math.sqrt()**: Para calcular desviación estándar

---

## 🎓 Conceptos Clave

- **Feature Scaling**: Esencial para algoritmos basados en distancia (K-Means, KNN, SVM)
- **Min-Max vs Z-score**:
  - Min-Max: Usa cuando conoces los límites
  - Z-score: Usa cuando hay outliers
- **One-Hot Encoding**: Evita que el modelo interprete categorías como ordinales
- **Train/Test Split**: Previene overfitting y evalúa generalización

---

## 📚 Recursos

- [Scikit-learn Preprocessing](https://scikit-learn.org/stable/modules/preprocessing.html)
- [Feature Scaling in ML](https://en.wikipedia.org/wiki/Feature_scaling)
- [One-Hot Encoding Explained](https://machinelearningmastery.com/why-one-hot-encode-data-in-machine-learning/)

---

**¡Comienza implementando en `preprocessing.ts`!** 🚀
