# Ejercicios de Artificial Intelligence / Machine Learning con TypeScript

## 🎯 Objetivo General

Este conjunto de ejercicios está diseñado para llevarte desde **cero conocimiento hasta nivel experto** en Inteligencia Artificial y Machine Learning, utilizando TypeScript como lenguaje principal. Aprenderás tanto la teoría como la implementación práctica de algoritmos fundamentales y avanzados.

## 📚 Estructura del Curso

### **Nivel 1: Fundamentos (Semanas 1-4)**
Conceptos básicos esenciales para comprender ML.

#### Ejercicios 01-05: Fundamentos Matemáticos y Computacionales
- **01-datos-preprocesamiento**: Manipulación, limpieza y normalización de datos
- **02-estadistica-descriptiva**: Media, mediana, varianza, desviación estándar, correlación
- **03-algebra-lineal**: Vectores, matrices, operaciones matriciales, eigenvalues
- **04-probabilidad**: Distribuciones, teorema de Bayes, inferencia estadística
- **05-gradient-descent**: Optimización, descenso por gradiente, learning rate

**Objetivos de aprendizaje:**
- Comprender estructuras de datos para ML
- Dominar estadística descriptiva e inferencial
- Aplicar álgebra lineal a problemas de ML
- Implementar algoritmos de optimización desde cero

---

### **Nivel 2: Machine Learning Clásico (Semanas 5-10)**
Algoritmos fundamentales supervisados y no supervisados.

#### Ejercicios 06-10: Algoritmos Clásicos de ML
- **06-regresion-lineal**: Regresión simple y múltiple, MSE, R²
- **07-clasificacion-logistica**: Clasificación binaria y multiclase, sigmoid, cross-entropy
- **08-clustering-kmeans**: Agrupamiento, K-Means, DBSCAN, evaluación de clusters
- **09-decision-trees**: Árboles de decisión, Gini impurity, information gain, poda
- **10-ensemble-methods**: Random Forest, Bagging, Boosting (AdaBoost, XGBoost)

**Objetivos de aprendizaje:**
- Resolver problemas de regresión y clasificación
- Aplicar técnicas de clustering para descubrir patrones
- Entender ensemble learning y sus ventajas
- Evaluar modelos con métricas apropiadas (accuracy, precision, recall, F1)

---

### **Nivel 3: Redes Neuronales (Semanas 11-16)**
Deep Learning fundamentals y arquitecturas básicas.

#### Ejercicios 11-15: Neural Networks y Deep Learning
- **11-perceptron-redes-neuronales**: Perceptrón simple, MLP, funciones de activación
- **12-backpropagation**: Propagación hacia atrás, actualización de pesos, chain rule
- **13-cnn-vision**: Convolutional Neural Networks, computer vision, filtros, pooling
- **14-rnn-secuencias**: Recurrent Neural Networks, LSTM, GRU, procesamiento de secuencias
- **15-transformers-attention**: Mecanismo de atención, Transformers, self-attention

**Objetivos de aprendizaje:**
- Construir redes neuronales desde cero
- Implementar backpropagation manualmente
- Aplicar CNNs a problemas de visión computacional
- Procesar secuencias con RNNs y Transformers
- Comprender la arquitectura Transformer (base de GPT, BERT)

---

### **Nivel 4: Técnicas Avanzadas (Semanas 17-24)**
Modelos generativos, reinforcement learning y producción.

#### Ejercicios 16-20: ML Avanzado y Producción
- **16-transfer-learning**: Fine-tuning, feature extraction, pre-trained models
- **17-gans-generativos**: Generative Adversarial Networks, generación de imágenes
- **18-reinforcement-learning**: Q-Learning, Policy Gradient, entorno de agentes
- **19-optimizacion-hyperparametros**: Grid search, random search, Bayesian optimization
- **20-deployment-produccion**: Serialización, API REST, contenedores, monitoreo

**Objetivos de aprendizaje:**
- Aplicar transfer learning para reducir tiempo de entrenamiento
- Implementar GANs para generar contenido nuevo
- Resolver problemas con reinforcement learning
- Optimizar hiperparámetros sistemáticamente
- Desplegar modelos en producción con buenas prácticas

---

## 🚀 Quick Start

### Prerrequisitos

```bash
# Node.js 18+ y npm
node --version  # v18.0.0+
npm --version   # 9.0.0+

# TypeScript
npm install -g typescript ts-node

# Instalar dependencias del proyecto
cd src/claudeExerciseAIML
npm install
```

### Ejecutar un Ejercicio

```bash
# Ejecutar implementación
ts-node exercises/01-datos-preprocesamiento/preprocessing.ts

# Ejecutar tests
npm test exercises/01-datos-preprocesamiento
```

### Estructura de un Ejercicio Típico

```
01-datos-preprocesamiento/
├── README.md                    # Descripción, instrucciones, teoría
├── preprocessing.ts             # Implementación principal
├── preprocessing.test.ts        # Tests unitarios
├── preprocessing-numpy-style.ts # Enfoque alternativo (estilo NumPy)
├── preprocessing-functional.ts  # Paradigma funcional
└── notas.md                     # Notas personales
```

---

## 📖 Metodología de Aprendizaje

### Por Cada Ejercicio

1. **Lee el README.md** - Entiende el concepto y el problema
2. **Implementa desde cero** - Escribe el código sin copiar
3. **Ejecuta los tests** - Verifica tu implementación
4. **Estudia alternativas** - Revisa diferentes enfoques
5. **Toma notas** - Documenta tus aprendizajes en `notas.md`

### Orden Recomendado

**Semanas 1-4:** Ejercicios 01-05 (Fundamentos)
**Semanas 5-10:** Ejercicios 06-10 (ML Clásico)
**Semanas 11-16:** Ejercicios 11-15 (Neural Networks)
**Semanas 17-24:** Ejercicios 16-20 (Avanzado)

**Total: ~6 meses a ritmo constante (5-10 horas/semana)**

---

## 🧪 Dependencias y Herramientas

```json
{
  "dependencies": {
    "mathjs": "^12.0.0",           // Operaciones matemáticas
    "lodash": "^4.17.21",          // Utilidades de datos
    "csv-parser": "^3.0.0",        // Lectura de CSV
    "d3-array": "^3.2.0"           // Estadística y manipulación de arrays
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/jest": "^29.5.0",
    "@types/lodash": "^4.14.195",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0"
  }
}
```

**Nota:** Estos ejercicios implementan algoritmos desde cero para comprensión profunda. Para producción, usa librerías especializadas como TensorFlow.js o ONNX Runtime.

---

## 📊 Evaluación de Progreso

### Nivel Básico (Ejercicios 01-05)
- ✅ Puedes limpiar y normalizar datasets
- ✅ Calculas métricas estadísticas manualmente
- ✅ Implementas operaciones matriciales básicas
- ✅ Entiendes gradient descent y lo implementas

### Nivel Intermedio (Ejercicios 06-10)
- ✅ Implementas regresión y clasificación desde cero
- ✅ Aplicas algoritmos de clustering
- ✅ Construyes árboles de decisión
- ✅ Usas ensemble methods para mejorar predicciones

### Nivel Avanzado (Ejercicios 11-15)
- ✅ Construyes redes neuronales multicapa
- ✅ Implementas backpropagation manualmente
- ✅ Creas CNNs para clasificación de imágenes
- ✅ Procesas secuencias con RNNs y Transformers

### Nivel Experto (Ejercicios 16-20)
- ✅ Aplicas transfer learning efectivamente
- ✅ Implementas GANs generativos
- ✅ Resuelves problemas con reinforcement learning
- ✅ Optimizas hiperparámetros sistemáticamente
- ✅ Despliegas modelos en producción

---

## 🎓 Recursos Adicionales

### Libros Recomendados
1. **"Pattern Recognition and Machine Learning"** - Christopher Bishop
2. **"Deep Learning"** - Ian Goodfellow, Yoshua Bengio, Aaron Courville
3. **"Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow"** - Aurélien Géron
4. **"The Hundred-Page Machine Learning Book"** - Andriy Burkov

### Cursos Online
- **Andrew Ng's Machine Learning** (Coursera)
- **Fast.ai Practical Deep Learning**
- **Stanford CS229** (Machine Learning)
- **MIT 6.S191** (Introduction to Deep Learning)

### Papers Fundamentales
- "Attention Is All You Need" (Transformers)
- "Generative Adversarial Networks" (GANs)
- "ImageNet Classification with Deep CNNs" (AlexNet)
- "Playing Atari with Deep Reinforcement Learning" (DQN)

### Datasets para Practicar
- **MNIST** - Dígitos escritos a mano
- **CIFAR-10** - Clasificación de imágenes
- **IMDB Reviews** - Análisis de sentimiento
- **Boston Housing** - Regresión
- **Iris Dataset** - Clasificación multiclase

---

## 💡 Tips para el Éxito

1. **Implementa desde cero primero** - No uses librerías avanzadas hasta entender la teoría
2. **Visualiza los datos** - Gráficos ayudan a entender el comportamiento de los modelos
3. **Experimenta con hiperparámetros** - Learning rate, batch size, epochs, etc.
4. **Lee los papers originales** - Entiende la motivación detrás de cada técnica
5. **Practica con datasets reales** - Kaggle competitions son excelentes
6. **Debugging es clave** - Verifica dimensiones de matrices, valores NaN, gradients exploding
7. **Documenta tus experimentos** - Lleva un registro de qué funciona y qué no
8. **Comparte y discute** - Únete a comunidades (Reddit r/MachineLearning, Papers with Code)
9. **Matemáticas son fundamentales** - No te saltes álgebra lineal y cálculo
10. **Sé paciente** - ML es un campo amplio, toma tiempo dominarlo

---

## 🔧 Troubleshooting

### "Module not found"
```bash
npm install
```

### "Gradient exploding/vanishing"
- Usa gradient clipping
- Ajusta learning rate
- Verifica inicialización de pesos

### "Overfitting"
- Usa regularización (L1, L2, dropout)
- Aumenta datos de entrenamiento
- Reduce complejidad del modelo

### "Training muy lento"
- Reduce tamaño del modelo
- Usa batch processing
- Verifica que no estés recalculando operaciones

---

## 🏆 Proyectos Finales Sugeridos

Una vez completados todos los ejercicios, intenta estos proyectos:

1. **Sistema de Recomendación** - Collaborative filtering para películas/productos
2. **Clasificador de Imágenes** - CNN para clasificar imágenes personalizadas
3. **Chatbot Simple** - RNN/Transformer para generación de texto
4. **Predictor de Series Temporales** - LSTM para predecir precios de acciones
5. **Generador de Imágenes** - GAN para crear imágenes sintéticas
6. **Juego con RL** - Agente que aprende a jugar Snake/Tic-Tac-Toe

---

## 📝 Certificaciones Recomendadas

- **TensorFlow Developer Certificate** (Google)
- **AWS Certified Machine Learning - Specialty**
- **Azure AI Engineer Associate**
- **Deep Learning Specialization** (Coursera)

---

## 🤝 Contribuciones

Si encuentras errores o quieres mejorar los ejercicios:
1. Documenta el issue
2. Propón una solución
3. Mantén el estilo consistente con otros ejercicios

---

## 📄 Licencia

Estos ejercicios son para uso educativo personal. Las implementaciones son didácticas, no optimizadas para producción.

---

**¡Comienza tu viaje en AI/ML! 🚀**

