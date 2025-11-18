# Ejercicio 02: Estadística Descriptiva

**Objetivo:** Aprender a calcular estadísticos fundamentales que describen y resumen conjuntos de datos.

## 📖 Teoría

### ¿Por qué es importante la estadística descriptiva?

La estadística descriptiva es esencial en Machine Learning para:
- **Entender los datos**: Identificar patrones, tendencias y anomalías
- **Detectar outliers**: Valores que se desvían significativamente
- **Validar modelos**: Comparar predicciones con distribuciones reales
- **Feature engineering**: Crear nuevas características basadas en estadísticos

### Medidas Fundamentales

#### 1. **Medidas de Tendencia Central**

**Media (Mean)**
```
μ = (Σ xi) / n
```
El promedio aritmético de todos los valores.

**Mediana (Median)**
- Valor central cuando los datos están ordenados
- Más robusta a outliers que la media

**Moda (Mode)**
- Valor que aparece con mayor frecuencia
- Puede haber múltiples modas

#### 2. **Medidas de Dispersión**

**Varianza (Variance)**
```
σ² = Σ(xi - μ)² / n
```
Mide qué tan dispersos están los datos respecto a la media.

**Desviación Estándar (Standard Deviation)**
```
σ = √(σ²)
```
Raíz cuadrada de la varianza, en las mismas unidades que los datos.

**Rango (Range)**
```
range = max - min
```
Diferencia entre el valor máximo y mínimo.

#### 3. **Medidas de Relación**

**Covarianza (Covariance)**
```
cov(X,Y) = Σ(xi - μx)(yi - μy) / n
```
Mide cómo varían dos variables juntas.

**Correlación de Pearson (Correlation)**
```
r = cov(X,Y) / (σx * σy)
```
Covarianza normalizada entre -1 y 1.
- r = 1: correlación positiva perfecta
- r = 0: sin correlación
- r = -1: correlación negativa perfecta

---

## 🎯 Escenario

Eres un analista de datos en una inmobiliaria. Tienes información sobre ventas de casas:
- Precios: [250000, 300000, 275000, 450000, 280000, 290000, 320000]
- Áreas: [100, 120, 110, 180, 115, 125, 140] (en m²)

Necesitas calcular estadísticos descriptivos para:
1. Entender la distribución de precios
2. Identificar outliers (la casa de $450,000)
3. Determinar si el precio y el área están correlacionados

---

## 📝 Instrucciones

### Parte 1: Media, Mediana y Moda

Implementa funciones para calcular medidas de tendencia central:

```typescript
export function mean(data: number[]): number {
  // Tu código aquí
  // Suma todos los valores y divide por la cantidad
}

export function median(data: number[]): number {
  // Tu código aquí
  // 1. Ordenar el array
  // 2. Si es impar: retornar el elemento central
  // 3. Si es par: retornar el promedio de los dos centrales
}

export function mode(data: number[]): number[] {
  // Tu código aquí
  // 1. Contar frecuencia de cada valor
  // 2. Encontrar la(s) frecuencia(s) máxima(s)
  // 3. Retornar todos los valores con esa frecuencia
}

// Ejemplo de uso:
const data = [1, 2, 2, 3, 4, 5];
console.log(mean(data));   // 2.833...
console.log(median(data)); // 2.5
console.log(mode(data));   // [2]
```

### Parte 2: Varianza y Desviación Estándar

Implementa funciones para medir dispersión:

```typescript
export function variance(data: number[]): number {
  // Tu código aquí
  // 1. Calcular la media
  // 2. Sumar (x - media)² para cada x
  // 3. Dividir por n
}

export function standardDeviation(data: number[]): number {
  // Tu código aquí
  // Raíz cuadrada de la varianza
}

export function range(data: number[]): number {
  // Tu código aquí
  // max - min
}

// Ejemplo de uso:
const data = [1, 2, 3, 4, 5];
console.log(variance(data));          // 2
console.log(standardDeviation(data)); // 1.414...
console.log(range(data));             // 4
```

### Parte 3: Covarianza y Correlación

Implementa funciones para medir relaciones entre variables:

```typescript
export function covariance(x: number[], y: number[]): number {
  // Tu código aquí
  // 1. Calcular medias de x e y
  // 2. Sumar (xi - mean_x) * (yi - mean_y)
  // 3. Dividir por n
}

export function correlation(x: number[], y: number[]): number {
  // Tu código aquí
  // cov(x,y) / (std(x) * std(y))
}

// Ejemplo de uso:
const areas = [100, 120, 110, 140];
const prices = [250, 300, 275, 320];
console.log(covariance(areas, prices));  // Valor positivo
console.log(correlation(areas, prices)); // Entre 0 y 1
```

### Parte 4: Percentiles y Cuartiles

Implementa funciones para dividir datos en percentiles:

```typescript
export function percentile(data: number[], p: number): number {
  // Tu código aquí
  // p = 50 es la mediana
  // p = 25 es Q1 (primer cuartil)
  // p = 75 es Q3 (tercer cuartil)
}

export function quartiles(data: number[]): [number, number, number] {
  // Tu código aquí
  // Retorna [Q1, Q2 (mediana), Q3]
}

// Ejemplo de uso:
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(percentile(data, 25));  // 2.75
console.log(percentile(data, 50));  // 5.5
console.log(percentile(data, 75));  // 7.75
console.log(quartiles(data));       // [2.75, 5.5, 7.75]
```

### Parte 5: Clase Statistics (Bonus)

Crea una clase que encapsule todos los estadísticos:

```typescript
export class Statistics {
  constructor(private data: number[]) {}

  mean(): number { /* ... */ }
  median(): number { /* ... */ }
  mode(): number[] { /* ... */ }
  variance(): number { /* ... */ }
  std(): number { /* ... */ }

  summary(): {
    count: number;
    mean: number;
    median: number;
    std: number;
    min: number;
    max: number;
    q1: number;
    q3: number;
  } {
    // Retorna un resumen completo
  }
}

// Ejemplo de uso:
const stats = new Statistics([1, 2, 3, 4, 5]);
console.log(stats.summary());
```

---

## ✅ Resultado Esperado

Al finalizar, deberías poder:

1. ✅ Calcular media, mediana y moda de cualquier dataset
2. ✅ Medir dispersión con varianza y desviación estándar
3. ✅ Calcular correlación entre dos variables
4. ✅ Determinar percentiles y cuartiles
5. ✅ Generar un resumen estadístico completo
6. ✅ Entender cuándo usar cada medida

---

## 🧪 Tests

Ejecuta los tests para verificar tu implementación:

```bash
npm test 02-estadistica-descriptiva
```

Los tests verificarán:
- Cálculo correcto de todos los estadísticos
- Manejo de casos extremos (arrays vacíos, un elemento)
- Precisión numérica (tolerancia de decimales)
- Correlación entre -1 y 1
- Percentiles correctos

---

## 💡 Consejos

1. **Ordena una copia**: Para mediana y percentiles, ordena una copia del array
2. **Usa reduce()**: Para sumas y productos
3. **Map para frecuencias**: Usa `Map<number, number>` para contar modas
4. **Valida longitudes**: En covarianza/correlación, x e y deben tener igual longitud
5. **Precisión**: Usa `toFixed()` o `toPrecision()` para redondear resultados

---

## 🎓 Conceptos Clave

- **Media vs Mediana**: La mediana es más robusta a outliers
- **Varianza vs Desviación Estándar**: La desviación está en las mismas unidades que los datos
- **Correlación ≠ Causalidad**: Dos variables pueden estar correlacionadas sin que una cause la otra
- **Percentiles**: Dividen los datos en 100 partes iguales
- **IQR (Rango Intercuartílico)**: Q3 - Q1, usado para detectar outliers

---

## 📊 Visualización Mental

Para los datos `[1, 2, 3, 4, 5]`:

```
Media:               3
Mediana:             3
Varianza:            2
Desviación Estándar: 1.414
Rango:               4

Distribución:
1    2    3    4    5
|----|----|----|----|
Q1   Med       Q3
```

---

## 📚 Recursos

- [Statistics for Machine Learning](https://machinelearningmastery.com/statistics_for_machine_learning/)
- [Descriptive Statistics - Wikipedia](https://en.wikipedia.org/wiki/Descriptive_statistics)
- [Correlation vs Causation](https://www.tylervigen.com/spurious-correlations)

---

**¡Comienza implementando en `statistics.ts`!** 🚀
