# 📑 Índice de Ejercicios AI/ML

## Navegación Rápida por Nivel

- [Nivel 1: Fundamentos (01-05)](#nivel-1-fundamentos)
- [Nivel 2: ML Clásico (06-10)](#nivel-2-machine-learning-clásico)
- [Nivel 3: Neural Networks (11-15)](#nivel-3-redes-neuronales)
- [Nivel 4: Avanzado (16-20)](#nivel-4-técnicas-avanzadas)

---

## Nivel 1: Fundamentos

### 01 - Datos y Preprocesamiento
📂 `exercises/01-datos-preprocesamiento/`
- **README.md** - Teoría sobre limpieza y preparación de datos
- **preprocessing.ts** - Implementación principal (normalización, codificación)
- **preprocessing.test.ts** - Tests unitarios
- **preprocessing-numpy-style.ts** - Enfoque estilo NumPy/Python
- **preprocessing-functional.ts** - Paradigma funcional puro

**Conceptos clave:**
- Normalización (Min-Max, Z-score)
- One-hot encoding
- Train/test split
- Manejo de valores faltantes

---

### 02 - Estadística Descriptiva
📂 `exercises/02-estadistica-descriptiva/`
- **README.md** - Teoría estadística básica
- **statistics.ts** - Media, mediana, moda, varianza, desviación estándar
- **statistics.test.ts** - Tests con datasets reales
- **correlation.ts** - Correlación de Pearson, Spearman
- **distributions.ts** - Distribuciones normales, uniformes

**Conceptos clave:**
- Medidas de tendencia central
- Medidas de dispersión
- Correlación y covarianza
- Distribuciones de probabilidad

---

### 03 - Álgebra Lineal
📂 `exercises/03-algebra-lineal/`
- **README.md** - Fundamentos de álgebra lineal para ML
- **vectors.ts** - Operaciones vectoriales (dot product, norma)
- **matrices.ts** - Multiplicación, transposición, inversión
- **eigenvalues.ts** - Eigenvalues, eigenvectors, PCA
- **linear-algebra.test.ts** - Tests de operaciones

**Conceptos clave:**
- Vectores y espacios vectoriales
- Producto punto y producto cruz
- Matrices y operaciones matriciales
- Eigenvalores (PCA)

---

### 04 - Probabilidad
📂 `exercises/04-probabilidad/`
- **README.md** - Teoría de probabilidad para ML
- **probability.ts** - Distribuciones, Bayes
- **probability.test.ts** - Tests de teoremas
- **bayes-theorem.ts** - Teorema de Bayes, Naive Bayes
- **distributions.ts** - Binomial, Poisson, Normal

**Conceptos clave:**
- Probabilidad condicional
- Teorema de Bayes
- Distribuciones de probabilidad
- Inferencia estadística

---

### 05 - Gradient Descent
📂 `exercises/05-gradient-descent/`
- **README.md** - Optimización y descenso por gradiente
- **gradient-descent.ts** - GD, SGD, Mini-batch GD
- **gradient-descent.test.ts** - Tests de convergencia
- **learning-rate.ts** - Learning rate scheduling
- **momentum.ts** - Momentum, Adam, RMSprop

**Conceptos clave:**
- Derivadas y gradientes
- Descenso por gradiente
- Learning rate
- Optimizadores avanzados (Adam, RMSprop)

---

## Nivel 2: Machine Learning Clásico

### 06 - Regresión Lineal
📂 `exercises/06-regresion-lineal/`
- **README.md** - Teoría de regresión lineal
- **linear-regression.ts** - Regresión simple y múltiple
- **linear-regression.test.ts** - Tests con datasets
- **cost-function.ts** - MSE, MAE, R²
- **polynomial-regression.ts** - Regresión polinomial

**Conceptos clave:**
- Regresión lineal simple y múltiple
- Función de costo (MSE)
- Ajuste de parámetros
- Evaluación (R², RMSE)

---

### 07 - Clasificación Logística
📂 `exercises/07-clasificacion-logistica/`
- **README.md** - Teoría de clasificación
- **logistic-regression.ts** - Clasificación binaria
- **logistic-regression.test.ts** - Tests
- **sigmoid.ts** - Función sigmoid
- **multiclass.ts** - One-vs-all, softmax

**Conceptos clave:**
- Función sigmoid
- Cross-entropy loss
- Clasificación binaria y multiclase
- Decision boundary

---

### 08 - Clustering K-Means
📂 `exercises/08-clustering-kmeans/`
- **README.md** - Aprendizaje no supervisado
- **kmeans.ts** - Algoritmo K-Means
- **kmeans.test.ts** - Tests con datasets
- **elbow-method.ts** - Método del codo
- **dbscan.ts** - DBSCAN algorithm

**Conceptos clave:**
- Clustering vs clasificación
- K-Means algorithm
- Elbow method
- DBSCAN, hierarchical clustering

---

### 09 - Decision Trees
📂 `exercises/09-decision-trees/`
- **README.md** - Árboles de decisión
- **decision-tree.ts** - Implementación de árbol
- **decision-tree.test.ts** - Tests
- **gini-entropy.ts** - Gini impurity, entropy
- **pruning.ts** - Poda de árboles

**Conceptos clave:**
- Árboles de decisión
- Gini impurity vs Information gain
- Overfitting y poda
- CART algorithm

---

### 10 - Ensemble Methods
📂 `exercises/10-ensemble-methods/`
- **README.md** - Métodos de ensemble
- **random-forest.ts** - Random Forest
- **random-forest.test.ts** - Tests
- **bagging.ts** - Bootstrap Aggregating
- **boosting.ts** - AdaBoost, Gradient Boosting

**Conceptos clave:**
- Bagging vs Boosting
- Random Forest
- AdaBoost
- Gradient Boosting (XGBoost conceptual)

---

## Nivel 3: Redes Neuronales

### 11 - Perceptrón y Redes Neuronales
📂 `exercises/11-perceptron-redes-neuronales/`
- **README.md** - Introducción a neural networks
- **perceptron.ts** - Perceptrón simple
- **perceptron.test.ts** - Tests
- **mlp.ts** - Multi-Layer Perceptron
- **activation-functions.ts** - ReLU, sigmoid, tanh, leaky ReLU

**Conceptos clave:**
- Perceptrón
- Multi-Layer Perceptron (MLP)
- Funciones de activación
- Forward pass

---

### 12 - Backpropagation
📂 `exercises/12-backpropagation/`
- **README.md** - Algoritmo de backpropagation
- **backprop.ts** - Implementación desde cero
- **backprop.test.ts** - Tests de gradientes
- **chain-rule.ts** - Chain rule explicada
- **weight-update.ts** - Actualización de pesos

**Conceptos clave:**
- Backpropagation
- Chain rule
- Gradient computation
- Weight updates

---

### 13 - CNN para Visión
📂 `exercises/13-cnn-vision/`
- **README.md** - Convolutional Neural Networks
- **cnn.ts** - CNN básica
- **cnn.test.ts** - Tests
- **convolution.ts** - Operación de convolución
- **pooling.ts** - Max pooling, average pooling

**Conceptos clave:**
- Convolutional layers
- Filters/kernels
- Pooling layers
- Computer vision applications

---

### 14 - RNN para Secuencias
📂 `exercises/14-rnn-secuencias/`
- **README.md** - Recurrent Neural Networks
- **rnn.ts** - RNN básica
- **rnn.test.ts** - Tests
- **lstm.ts** - Long Short-Term Memory
- **gru.ts** - Gated Recurrent Unit

**Conceptos clave:**
- Recurrent Neural Networks
- LSTM
- GRU
- Sequence processing

---

### 15 - Transformers y Attention
📂 `exercises/15-transformers-attention/`
- **README.md** - Arquitectura Transformer
- **attention.ts** - Mecanismo de atención
- **attention.test.ts** - Tests
- **self-attention.ts** - Self-attention
- **transformer.ts** - Transformer básico

**Conceptos clave:**
- Attention mechanism
- Self-attention
- Multi-head attention
- Transformer architecture (base de GPT/BERT)

---

## Nivel 4: Técnicas Avanzadas

### 16 - Transfer Learning
📂 `exercises/16-transfer-learning/`
- **README.md** - Transfer learning y fine-tuning
- **transfer-learning.ts** - Implementación
- **transfer-learning.test.ts** - Tests
- **fine-tuning.ts** - Fine-tuning strategies
- **feature-extraction.ts** - Feature extraction

**Conceptos clave:**
- Transfer learning
- Fine-tuning
- Feature extraction
- Pre-trained models

---

### 17 - GANs Generativos
📂 `exercises/17-gans-generativos/`
- **README.md** - Generative Adversarial Networks
- **gan.ts** - GAN básica
- **gan.test.ts** - Tests
- **generator.ts** - Red generadora
- **discriminator.ts** - Red discriminadora

**Conceptos clave:**
- Generative Adversarial Networks
- Generator vs Discriminator
- Adversarial training
- Image generation

---

### 18 - Reinforcement Learning
📂 `exercises/18-reinforcement-learning/`
- **README.md** - Aprendizaje por refuerzo
- **q-learning.ts** - Q-Learning
- **q-learning.test.ts** - Tests
- **policy-gradient.ts** - Policy gradient
- **environment.ts** - Entorno de agentes

**Conceptos clave:**
- Reinforcement Learning
- Q-Learning
- Policy gradient
- Agent-environment interaction

---

### 19 - Optimización de Hiperparámetros
📂 `exercises/19-optimizacion-hyperparametros/`
- **README.md** - Técnicas de optimización
- **grid-search.ts** - Grid search
- **grid-search.test.ts** - Tests
- **random-search.ts** - Random search
- **bayesian-opt.ts** - Bayesian optimization

**Conceptos clave:**
- Hiperparámetros vs parámetros
- Grid search
- Random search
- Bayesian optimization

---

### 20 - Deployment en Producción
📂 `exercises/20-deployment-produccion/`
- **README.md** - Deployment de modelos ML
- **model-serialization.ts** - Guardar/cargar modelos
- **model-serialization.test.ts** - Tests
- **rest-api.ts** - API REST para inferencia
- **monitoring.ts** - Monitoreo de modelos

**Conceptos clave:**
- Serialización de modelos
- REST API para ML
- Containerización
- Monitoreo de drift

---

## 📊 Progreso Recomendado

### Semanas 1-4: Fundamentos
- [ ] Ejercicio 01 - Datos y Preprocesamiento
- [ ] Ejercicio 02 - Estadística Descriptiva
- [ ] Ejercicio 03 - Álgebra Lineal
- [ ] Ejercicio 04 - Probabilidad
- [ ] Ejercicio 05 - Gradient Descent

### Semanas 5-10: ML Clásico
- [ ] Ejercicio 06 - Regresión Lineal
- [ ] Ejercicio 07 - Clasificación Logística
- [ ] Ejercicio 08 - Clustering K-Means
- [ ] Ejercicio 09 - Decision Trees
- [ ] Ejercicio 10 - Ensemble Methods

### Semanas 11-16: Neural Networks
- [ ] Ejercicio 11 - Perceptrón y Redes Neuronales
- [ ] Ejercicio 12 - Backpropagation
- [ ] Ejercicio 13 - CNN para Visión
- [ ] Ejercicio 14 - RNN para Secuencias
- [ ] Ejercicio 15 - Transformers y Attention

### Semanas 17-24: Avanzado
- [ ] Ejercicio 16 - Transfer Learning
- [ ] Ejercicio 17 - GANs Generativos
- [ ] Ejercicio 18 - Reinforcement Learning
- [ ] Ejercicio 19 - Optimización de Hiperparámetros
- [ ] Ejercicio 20 - Deployment en Producción

---

## 🎯 Hitos de Aprendizaje

**Después del Nivel 1:** Tienes las bases matemáticas para entender ML
**Después del Nivel 2:** Puedes implementar algoritmos clásicos desde cero
**Después del Nivel 3:** Entiendes deep learning y arquitecturas modernas
**Después del Nivel 4:** Estás listo para proyectos profesionales y producción

---

**¡Usa este índice para navegar rápidamente entre ejercicios!** 🚀
