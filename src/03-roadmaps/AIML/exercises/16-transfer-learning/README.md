# Ejercicio 16: Transfer Learning

**Objetivo:** Implementar técnicas de Transfer Learning, incluyendo feature extraction y fine-tuning, aprovechando conocimiento pre-entrenado para nuevas tareas.

## 📖 Teoría

### ¿Qué es Transfer Learning?

**Reutilizar conocimiento aprendido de una tarea para resolver otra tarea relacionada.**

**Problema que resuelve:**
- Datasets pequeños: No hay suficientes datos para entrenar desde cero
- Costo computacional: Entrenar redes profundas es muy costoso
- Tiempo: Entrenar puede tomar días/semanas
- Generalización: Modelos pequeños no generalizan bien

**Solución Transfer Learning:**
Usar modelo pre-entrenado en dataset grande (ImageNet, Wikipedia) y adaptarlo a tu tarea específica.

### Analogía: Aprender un Nuevo Idioma

```
Aprender español conociendo inglés:
✓ Ya sabes gramática (estructura)
✓ Ya sabes vocabulario relacionado (cognados)
✗ Solo necesitas aprender diferencias específicas

Transfer Learning:
✓ Red pre-entrenada ya sabe detectar bordes, formas, texturas
✓ Solo necesitas entrenar capas finales para tu tarea específica
```

### Estrategias de Transfer Learning

**1. Feature Extraction (Extracción de Features)**

```
Modelo Pre-entrenado:
Layers 1-10 (frozen) → Extraen features generales
    ↓
Nueva capa (trainable) → Clasificador específico

Ventajas:
✓ Muy rápido (solo entrenas última capa)
✓ Menos overfitting (menos parámetros)
✓ Funciona con datasets muy pequeños

Cuándo usar:
- Dataset pequeño (<1000 ejemplos)
- Tarea muy similar al pre-entrenamiento
- Poco poder computacional
```

**2. Fine-Tuning (Ajuste Fino)**

```
Modelo Pre-entrenado:
Layers 1-5 (frozen) → Features muy generales
Layers 6-10 (trainable) → Features específicas
Nueva capa (trainable) → Clasificador

Ventajas:
✓ Mejor performance que feature extraction
✓ Se adapta mejor a tu tarea específica
✓ Balancea velocidad y precisión

Cuándo usar:
- Dataset mediano (1000-10000 ejemplos)
- Tarea relacionada pero no idéntica
- Suficiente poder computacional
```

**3. Pre-training from Scratch**

```
Todo trainable desde inicio

Cuándo usar:
- Dataset muy grande (>100000 ejemplos)
- Tarea muy diferente
- Mucho poder computacional
```

### Arquitectura Típica

```
Pre-trained Model (ej. ResNet, VGG, BERT):
┌──────────────────────────────────────┐
│ Input Layer                          │
├──────────────────────────────────────┤
│ Early Layers (frozen)                │
│   - Detectan bordes, colores         │
│   - Features muy generales           │
│   - Transferible a cualquier tarea   │
├──────────────────────────────────────┤
│ Middle Layers (frozen o trainable)   │
│   - Detectan formas, texturas        │
│   - Features intermedias             │
├──────────────────────────────────────┤
│ Late Layers (trainable)              │
│   - Features específicas del dataset │
│   - Se adaptan a nueva tarea         │
├──────────────────────────────────────┤
│ New Classification Head (trainable)  │
│   - Específico para tu problema      │
│   - Número de clases de tu dataset   │
└──────────────────────────────────────┘
```

### ¿Qué Capas Congelar?

**Regla general:**

```
Similitud de tarea vs Dataset size:

Dataset Pequeño + Tarea Similar:
→ Congelar TODO excepto última capa

Dataset Pequeño + Tarea Diferente:
→ Congelar early layers, entrenar middle + last

Dataset Grande + Tarea Similar:
→ Fine-tune todas las capas con learning rate bajo

Dataset Grande + Tarea Diferente:
→ Fine-tune todo o entrenar desde cero
```

### Learning Rate en Transfer Learning

**Diferentes learning rates por capa:**

```
Early Layers (muy generales):
  lr = 1e-5  (muy bajo, apenas modificar)

Middle Layers:
  lr = 1e-4  (bajo, ajustar suavemente)

New Layers (específicos):
  lr = 1e-3  (normal, entrenar activamente)
```

**Por qué:**
- Early layers ya aprendieron features útiles
- No queremos destruir ese conocimiento
- New layers parten de cero, necesitan aprender más

### Datasets Pre-entrenados Comunes

**Visión:**
- ImageNet: 1.4M imágenes, 1000 clases
- COCO: 330K imágenes, detección de objetos
- Places365: Reconocimiento de escenas

**NLP:**
- BERT: Pre-entrenado en Wikipedia + BookCorpus
- GPT: Pre-entrenado en WebText
- Word2Vec: Embeddings de palabras

**Audio:**
- AudioSet: 2M clips de audio
- VGGish: Features de audio

### Domain Adaptation

**Cuando source domain ≠ target domain:**

```
Source: ImageNet (fotos naturales)
Target: Rayos X médicos

Solución:
1. Pre-train en source
2. Fine-tune con learning rate muy bajo
3. Posiblemente añadir domain-specific layers
4. Data augmentation específica del dominio
```

### Ventajas vs Desventajas

**Ventajas:**
✓ Menos datos necesarios
✓ Entrenamiento más rápido
✓ Mejor generalización
✓ Aprovecha conocimiento existente
✓ Reduce overfitting

**Desventajas:**
✗ Modelo base puede ser muy grande
✗ No siempre funciona (dominios muy diferentes)
✗ Puede heredar biases del pre-entrenamiento
✗ Menos flexible que entrenar desde cero

---

## 🎯 Escenario

**Problema:** Clasificar imágenes médicas con solo 100 ejemplos

```
Sin Transfer Learning:
Dataset: 100 imágenes
Red profunda: 10M parámetros
Resultado: Overfitting masivo 😢

Con Transfer Learning:
Pre-trained: ResNet en ImageNet
Congelar: Primeras 90% capas
Entrenar: Solo 100K parámetros
Resultado: 95% accuracy 🎉
```

**Ejemplo Práctico:**

```typescript
// Feature Extraction
const baseModel = loadPretrainedModel('imagenet');
baseModel.freeze(); // Congelar todas las capas

const classifier = new DenseLayer(numClasses);
const model = combine(baseModel, classifier);

model.train(smallDataset);  // Solo entrena classifier

// Fine-Tuning
baseModel.unfreeze(['layer8', 'layer9', 'layer10']);
model.train(smallDataset, { lr: 1e-5 });  // Learning rate bajo
```

---

## 📝 Instrucciones

### Parte 1: Modelo Pre-entrenado Simulado

```typescript
export class PretrainedModel {
  constructor(architecture: string) {
    // Simular pesos pre-entrenados
    // Diferentes arquitecturas: 'simple', 'medium', 'deep'
  }

  extractFeatures(input: number[][]): number[];

  freeze(): void;
  unfreeze(layerNames?: string[]): void;

  getLayerNames(): string[];
  isFrozen(layerName: string): boolean;
}
```

### Parte 2: Feature Extraction

```typescript
export class FeatureExtractor {
  constructor(
    baseModel: PretrainedModel,
    numClasses: number
  ) {
    // Base model (frozen)
    // Nueva capa de clasificación
  }

  train(
    X: number[][][],
    y: number[],
    config: TrainingConfig
  ): TrainingHistory;

  predict(input: number[][]): number;
  predictProba(input: number[][]): number[];
}
```

### Parte 3: Fine-Tuning

```typescript
export class FineTuner {
  constructor(
    baseModel: PretrainedModel,
    numClasses: number,
    layersToUnfreeze: string[]
  ) {
    // Descongelar capas específicas
    // Nueva capa de clasificación
  }

  train(
    X: number[][][],
    y: number[],
    config: FineTuningConfig
  ): TrainingHistory;

  // Learning rates diferentes por capa
  setLayerLearningRate(
    layerName: string,
    lr: number
  ): void;
}
```

### Parte 4: Transfer Learning Manager

```typescript
export class TransferLearningManager {
  static recommendStrategy(
    datasetSize: number,
    taskSimilarity: 'low' | 'medium' | 'high'
  ): {
    strategy: 'feature_extraction' | 'fine_tuning' | 'from_scratch';
    layersToFreeze: string[];
    recommendedLR: number;
    reasoning: string;
  };

  static compareStrategies(
    dataset: { X: number[][][]; y: number[] }
  ): {
    featureExtraction: { accuracy: number; time: number };
    fineTuning: { accuracy: number; time: number };
    fromScratch: { accuracy: number; time: number };
  };
}
```

---

## ✅ Resultado Esperado

1. ✅ Modelo pre-entrenado simulado con capas congelables
2. ✅ Feature extraction con base congelada
3. ✅ Fine-tuning con capas selectivas
4. ✅ Learning rates diferenciados por capa
5. ✅ Comparación de estrategias
6. ✅ Recomendación automática de estrategia

---

## 🧪 Tests

```bash
npm test 16-transfer-learning
```

---

## 💡 Consejos

1. **Congelar temprano:** Siempre congela early layers primero
2. **Learning rate:** Usa 10-100x menor para capas pre-entrenadas
3. **Warm-up:** Entrena solo la nueva capa primero, luego fine-tune
4. **Regularización:** Dropout más agresivo en capas nuevas
5. **Batch Normalization:** Cuidado al descongelar (modo train vs eval)
6. **Gradual unfreezing:** Descongela capas progresivamente

---

## 📊 Matemáticas del Fine-Tuning

**Actualización de pesos:**

```
Para capa congelada:
w_new = w_old  (sin cambios)

Para capa descongelada:
w_new = w_old - lr × ∇L

Para fine-tuning:
w_new = w_old - (lr × decay) × ∇L

donde decay = {
  0.01 para early layers   (casi congeladas)
  0.1  para middle layers  (ajuste suave)
  1.0  para new layers     (entrenamiento normal)
}
```

**Trade-off entre congelar y entrenar:**

```
Más capas congeladas:
  + Más rápido
  + Menos overfitting
  - Menos adaptación a nueva tarea

Más capas entrenables:
  + Mejor adaptación
  + Mayor accuracy potencial
  - Más riesgo de overfitting
  - Más lento
```

---

## 🔄 Flujo Típico de Transfer Learning

```
1. Cargar modelo pre-entrenado
   ↓
2. Remover última capa (clasificador)
   ↓
3. Añadir nueva capa para tu tarea
   ↓
4. Congelar base model
   ↓
5. Entrenar solo nueva capa (pocas epochs)
   ↓
6. [Opcional] Descongelar algunas capas
   ↓
7. [Opcional] Fine-tune con lr bajo
   ↓
8. Evaluar y comparar estrategias
```

---

## 📚 Recursos

- [Transfer Learning Guide (CS231n)](http://cs231n.github.io/transfer-learning/)
- [How transferable are features in deep neural networks?](https://arxiv.org/abs/1411.1792)
- [A Survey on Transfer Learning](https://www.cse.ust.hk/~qyang/Docs/2009/tkde_transfer_learning.pdf)
- [Fine-tuning Pre-trained Models](https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html)

---

**¡Comienza implementando el modelo pre-entrenado simulado en `transfer-learning.ts`!** 🚀
