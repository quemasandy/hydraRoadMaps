# Ejercicio 08: Clustering K-Means

**Objetivo:** Implementar el algoritmo K-Means desde cero para agrupar datos sin supervisión, incluyendo el método del codo para seleccionar K óptimo.

## 📖 Teoría

### ¿Qué es Clustering?

Clustering es **aprendizaje no supervisado**: agrupar datos similares sin labels.

**Usos:**
- **Segmentación de clientes**: Agrupar clientes por comportamiento
- **Compresión de imágenes**: Reducir colores
- **Detección de anomalías**: Puntos que no pertenecen a ningún cluster
- **Análisis exploratorio**: Descubrir estructura en los datos

### K-Means Algorithm

El algoritmo más popular de clustering:

**Objetivo:** Dividir n puntos en K clusters minimizando la varianza intra-cluster.

**Función de costo (Inertia):**
```
J = Σ Σ ||xi - μk||²
    k∈K i∈Ck
```

Donde:
- `μk`: Centroide del cluster k
- `Ck`: Conjunto de puntos en cluster k
- `||.||`: Distancia euclidiana

**Algoritmo:**

```
1. Inicializar K centroides (aleatoriamente o K-Means++)
2. Repetir hasta convergencia:
   a. Asignación: Asignar cada punto al centroide más cercano
   b. Actualización: Recalcular centroides como media de puntos
3. Retornar centroides y asignaciones
```

**Convergencia:** Cuando las asignaciones no cambian o inertia no mejora.

### Inicialización: K-Means++

La inicialización aleatoria puede dar malos resultados. **K-Means++** mejora esto:

**Algoritmo:**
```
1. Elegir primer centroide aleatoriamente
2. Para cada nuevo centroide:
   a. Calcular distancia D(x) de cada punto al centroide más cercano
   b. Elegir nuevo centroide con probabilidad ∝ D(x)²
3. Repetir hasta tener K centroides
```

**Ventaja:** Centroides iniciales están bien dispersos → mejor convergencia.

### Método del Codo (Elbow Method)

**Problema:** ¿Cómo elegir K?

**Solución:** Graficar inertia vs K:

```
Inertia
  |
  |\
  | \
  |  \___
  |      ----____
  |____________
  1  2  3  4  5  K
       ↑
     "Codo"
```

**Interpretación:**
- K pequeño: Alta inertia (clusters grandes)
- K grande: Baja inertia (muchos clusters)
- **"Codo"**: Punto donde inertia deja de disminuir significativamente

### Limitaciones de K-Means

1. **Requiere especificar K**: No siempre es obvio
2. **Sensible a inicialización**: Puede converger a mínimos locales
3. **Asume clusters esféricos**: No funciona bien con formas irregulares
4. **Sensible a escala**: Features con mayor rango dominan
5. **Sensible a outliers**: Pueden distorsionar centroides

**Soluciones:**
- K-Means++: Mejor inicialización
- Ejecutar múltiples veces: Elegir mejor resultado
- Normalizar features: Usar StandardScaler
- Remover outliers: Pre-procesamiento
- Alternativas: DBSCAN, GMM para clusters no esféricos

### Métricas de Evaluación

#### 1. **Inertia (Within-Cluster Sum of Squares)**

```
Inertia = Σ Σ ||xi - μk||²
```

**Características:**
- Siempre disminuye al aumentar K
- No normalizada
- Útil para método del codo

#### 2. **Silhouette Score**

Para cada punto:
```
s(i) = (b(i) - a(i)) / max(a(i), b(i))

a(i): Distancia promedio a puntos en su cluster
b(i): Distancia promedio al cluster más cercano
```

**Interpretación:**
- `s(i) ≈ 1`: Bien asignado
- `s(i) ≈ 0`: En el límite entre clusters
- `s(i) < 0`: Probablemente mal asignado

**Silhouette Score promedio:**
```
Silhouette = (1/n) × Σ s(i)
```

Rango: [-1, 1], mayor es mejor.

---

## 🎯 Escenario

Tienes datos de clientes (ingresos, edad) y quieres segmentarlos:

```
Datos:
Ingresos ($k) | Edad | Cluster
30            | 25   | ?
35            | 28   | ?
80            | 45   | ?
75            | 40   | ?
150           | 55   | ?
```

**Objetivo:** Agrupar clientes en K segmentos para marketing dirigido.

---

## 📝 Instrucciones

### Parte 1: K-Means Básico

```typescript
export interface KMeansResult {
  centroids: number[][];
  labels: number[];
  inertia: number;
  iterations: number;
}

export function kMeans(
  X: number[][],
  K: number,
  maxIterations: number = 100,
  tolerance: number = 1e-4
): KMeansResult {
  // 1. Inicializar centroides aleatoriamente
  // 2. Repetir:
  //    - Asignar puntos al centroide más cercano
  //    - Recalcular centroides
  //    - Verificar convergencia
}
```

### Parte 2: K-Means++

```typescript
export function kMeansPlusPlus(
  X: number[][],
  K: number,
  maxIterations: number = 100
): KMeansResult {
  // 1. Inicializar con K-Means++
  // 2. Ejecutar K-Means normal
}
```

### Parte 3: Método del Codo

```typescript
export interface ElbowResult {
  K_values: number[];
  inertias: number[];
  optimalK: number;
}

export function elbowMethod(
  X: number[][],
  maxK: number = 10
): ElbowResult {
  // Ejecutar K-Means para K=1...maxK
  // Encontrar "codo" automáticamente
}
```

### Parte 4: Utilidades

```typescript
export function euclideanDistance(a: number[], b: number[]): number;
export function computeInertia(
  X: number[][],
  centroids: number[][],
  labels: number[]
): number;
export function silhouetteScore(
  X: number[][],
  labels: number[]
): number;
```

---

## ✅ Resultado Esperado

1. ✅ Implementar K-Means desde cero
2. ✅ Implementar K-Means++
3. ✅ Calcular inertia
4. ✅ Método del codo automático
5. ✅ Silhouette score
6. ✅ Ejecutar múltiples veces y elegir mejor

---

## 🧪 Tests

```bash
npm test 08-clustering-kmeans
```

---

## 💡 Consejos

1. **Normaliza datos**: StandardScaler antes de K-Means
2. **Ejecuta múltiples veces**: Elige resultado con menor inertia
3. **K típico**: 2-10 para la mayoría de problemas
4. **Convergencia**: 10-50 iteraciones suelen bastar
5. **Silhouette > 0.5**: Buen clustering
6. **Visualiza**: Grafica puntos y centroides

---

## 📚 Recursos

- [K-Means - Wikipedia](https://en.wikipedia.org/wiki/K-means_clustering)
- [K-Means++ Paper](http://ilpubs.stanford.edu:8090/778/)
- [Silhouette Analysis](https://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_silhouette_analysis.html)

---

**¡Comienza implementando en `kmeans.ts`!** 🚀
