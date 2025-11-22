# Ejercicio 17: GANs Generativos

**Objetivo:** Implementar Generative Adversarial Networks (GANs) desde cero, comprendiendo el entrenamiento adversarial entre generador y discriminador.

## 📖 Teoría

### ¿Qué son las GANs?

**Dos redes neuronales compitiendo entre sí para generar datos realistas.**

**Componentes:**
- **Generador (G):** Crea datos falsos que parecen reales
- **Discriminador (D):** Distingue entre datos reales y falsos

**Analogía: Falsificador vs Detective**

```
Generador = Falsificador de billetes
  - Intenta crear billetes que parezcan reales
  - Mejora cada vez que el detective lo detecta

Discriminador = Detective
  - Intenta distinguir billetes reales de falsos
  - Mejora cada vez que se equivoca

Resultado: Billetes falsos cada vez más realistas
```

### Arquitectura de una GAN

```
Proceso de Generación:
┌──────────────┐
│ Ruido (z)    │  Vector aleatorio
│ [random vec] │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│   Generator (G)  │  Red neuronal
│   z → G(z)       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Fake Data        │  Imagen/datos generados
│ (looks real)     │
└──────────────────┘

Proceso de Discriminación:
┌──────────────┐     ┌──────────────┐
│  Real Data   │     │  Fake Data   │
└──────┬───────┘     └──────┬───────┘
       │                    │
       └────────┬───────────┘
                ▼
       ┌─────────────────┐
       │ Discriminator(D)│
       │ x → D(x)        │
       └────────┬────────┘
                ▼
       ┌─────────────────┐
       │  Real or Fake?  │
       │  [0.0 - 1.0]    │
       └─────────────────┘
       0 = Fake, 1 = Real
```

### Función de Pérdida (Loss)

**Discriminador:**
```
L_D = -E[log D(x_real)] - E[log(1 - D(G(z)))]

Objetivo: Maximizar esta función
- Quiere D(x_real) = 1 (reconocer reales)
- Quiere D(G(z)) = 0 (detectar falsos)
```

**Generador:**
```
L_G = -E[log D(G(z))]

Objetivo: Minimizar esta función
- Quiere D(G(z)) = 1 (engañar al discriminador)
```

**MinMax Game:**
```
min_G max_D V(D,G) = E[log D(x)] + E[log(1 - D(G(z)))]

Equilibrio de Nash: Cuando ninguno puede mejorar unilateralmente
```

### Entrenamiento Adversarial

**Algoritmo paso a paso:**

```
Para cada iteración:

  1. Entrenar Discriminador (k pasos):
     a. Tomar batch de datos reales: x ~ p_data
     b. Generar batch de datos falsos: z ~ p_z, x_fake = G(z)
     c. Actualizar D para maximizar:
        log D(x_real) + log(1 - D(x_fake))

  2. Entrenar Generador (1 paso):
     a. Generar nuevo batch: z ~ p_z
     b. Actualizar G para minimizar:
        log(1 - D(G(z)))
        o equivalentemente, maximizar log D(G(z))

  3. Repetir hasta convergencia
```

**Ratio de entrenamiento:**
```
Común: k=1 (alternar D y G)
Paper original: k=5 (entrenar D más frecuentemente)

Por qué: Evitar que G mejore demasiado rápido
y "engañe trivialmente" a D débil.
```

### Problemas Comunes de GANs

**1. Mode Collapse**

```
Problema: G genera siempre el mismo output

Ejemplo:
  Se pide generar dígitos 0-9
  G solo genera "8" porque engaña bien a D

Causa: G encuentra un mínimo local

Soluciones:
  - Minibatch discrimination
  - Unrolled GAN
  - Múltiples discriminadores
```

**2. Vanishing Gradients**

```
Problema: D es demasiado bueno → G no recibe gradientes

Cuando D(G(z)) ≈ 0:
  log(1 - D(G(z))) ≈ log(1) = 0
  → Gradiente ≈ 0
  → G no aprende

Solución: Usar -log D(G(z)) en vez de log(1 - D(G(z)))
```

**3. Non-Convergence**

```
Problema: Entrenamiento oscila, nunca converge

Causa: No es optimización, es juego adversarial

Síntomas:
  - Loss de G y D oscilan
  - Calidad de generación varía mucho

Soluciones:
  - Ajustar learning rates
  - Usar optimizadores más estables (Adam)
  - Two time-scale update rule (TTUR)
```

### Variantes de GANs

**DCGAN (Deep Convolutional GAN)**
```
Mejoras arquitectónicas:
- Usar convolutions en vez de FC layers
- BatchNorm en G y D
- ReLU en G, LeakyReLU en D
- No usar pooling, usar strided convolutions

Resultado: Más estable, mejores imágenes
```

**Conditional GAN (cGAN)**
```
Controlar qué generar:

G(z, c) → genera imagen de clase c
D(x, c) → verifica si x es real y de clase c

Ejemplo: "Genera un 7" → G(z, c=7)
```

**Wasserstein GAN (WGAN)**
```
Mejor función de pérdida:

L_D = E[D(x_real)] - E[D(G(z))]
L_G = -E[D(G(z))]

Ventajas:
- Más estable
- Loss correlaciona con calidad
- No mode collapse
```

**StyleGAN**
```
Control fino sobre estilo:
- Controlar atributos específicos
- Mezclar estilos de diferentes imágenes
- Estado del arte en generación de caras
```

### Métricas de Evaluación

**1. Inception Score (IS)**
```
Mide calidad y diversidad

IS = exp(E[KL(p(y|x) || p(y))])

Alto IS → Imágenes claras y variadas
```

**2. Fréchet Inception Distance (FID)**
```
Compara distribuciones

FID = ||μ_real - μ_fake||² + Tr(Σ_real + Σ_fake - 2√(Σ_real Σ_fake))

Bajo FID → Distribuciones similares
```

**3. Visual Inspection**
```
Humanos revisan calidad

¿Se ven realistas?
¿Hay diversidad?
¿Hay artefactos?
```

### Aplicaciones de GANs

**Generación de Imágenes:**
- Caras realistas (ThisPersonDoesNotExist)
- Arte generativo
- Super-resolución

**Data Augmentation:**
- Generar más datos de entrenamiento
- Balancear clases desbalanceadas

**Image-to-Image:**
- Style transfer
- Colorización
- Inpainting (rellenar partes faltantes)

**Síntesis de Datos:**
- Generar datos médicos sintéticos
- Privacidad (datos sintéticos vs reales)

**Detección de Anomalías:**
- G aprende lo "normal"
- Lo que no puede generar = anomalía

---

## 🎯 Escenario

**Problema:** Generar dígitos escritos a mano sintéticos (MNIST-like)

```
Input: Vector de ruido z ~ N(0, 1)
Output: Imagen 28×28 que parece un dígito real

Entrenamiento:
1. D aprende a distinguir dígitos reales vs generados
2. G aprende a generar dígitos que engañen a D
3. Eventualmente, G genera dígitos realistas
```

**Ejemplo Simplificado:**

```typescript
// Generar datos
const noise = generateNoise(100);  // Vector 100D
const fakeData = generator.forward(noise);  // 28×28 imagen

// Discriminar
const probReal = discriminator.forward(realImage);  // ~0.9
const probFake = discriminator.forward(fakeData);   // ~0.1

// Entrenar
trainDiscriminator(realImages, fakeData);
trainGenerator(noise);
```

---

## 📝 Instrucciones

### Parte 1: Generador

```typescript
export class Generator {
  constructor(
    inputSize: number,    // Dimensión del ruido
    outputSize: number,   // Dimensión de la salida
    hiddenSizes: number[] // Capas ocultas
  ) {
    // Inicializar capas
  }

  forward(noise: number[]): number[];

  getParameters(): number[][][];
  setParameters(params: number[][][]): void;
}
```

### Parte 2: Discriminador

```typescript
export class Discriminator {
  constructor(
    inputSize: number,
    hiddenSizes: number[]
  ) {
    // Inicializar capas
    // Output: 1 neurona (probabilidad real/fake)
  }

  forward(input: number[]): number;  // [0, 1]

  getParameters(): number[][][];
  setParameters(params: number[][][]): void;
}
```

### Parte 3: GAN Completa

```typescript
export class GAN {
  constructor(config: GANConfig) {
    // Inicializar generador y discriminador
  }

  train(
    realData: number[][],
    config: TrainingConfig
  ): TrainingHistory;

  generate(numSamples: number): number[][];

  // Métricas
  evaluateDiscriminator(
    realData: number[][],
    fakeData: number[][]
  ): {
    accuracyReal: number;
    accuracyFake: number;
    averageConfidence: number;
  };

  // Detección de mode collapse
  detectModeCollapse(
    generatedSamples: number[][]
  ): {
    collapsed: boolean;
    diversity: number;
  };
}
```

### Parte 4: Utilidades

```typescript
export function generateNoise(
  size: number,
  distribution?: 'normal' | 'uniform'
): number[];

export function visualizeProgress(
  history: TrainingHistory
): void;

export function interpolate(
  z1: number[],
  z2: number[],
  steps: number
): number[][];
```

---

## ✅ Resultado Esperado

1. ✅ Generador que crea datos desde ruido
2. ✅ Discriminador que clasifica real/fake
3. ✅ Entrenamiento adversarial completo
4. ✅ Detección de mode collapse
5. ✅ Interpolación en espacio latente
6. ✅ Métricas de evaluación

---

## 🧪 Tests

```bash
npm test 17-gans-generativos
```

---

## 💡 Consejos

1. **Learning Rates:** Discriminador más alto que generador (ej. 0.0002 vs 0.0001)
2. **Label Smoothing:** Usar 0.9 en vez de 1.0 para datos reales
3. **Noisy Labels:** Ocasionalmente invertir labels (~5%)
4. **Architecture:** G y D de complejidad similar
5. **Activation:** LeakyReLU para evitar dying ReLU
6. **Batch Normalization:** Excepto en output de G y input de D
7. **Patience:** GANs tardan mucho en converger

---

## 📊 Matemáticas Detalladas

**Gradientes del Discriminador:**

```
∂L_D/∂θ_D = -1/m Σ[∂log D(x_i)/∂θ_D + ∂log(1-D(G(z_i)))/∂θ_D]

Backprop normal, dos términos:
1. Clasificar correctamente datos reales
2. Clasificar correctamente datos falsos
```

**Gradientes del Generador:**

```
∂L_G/∂θ_G = -1/m Σ[∂log D(G(z_i))/∂θ_G]

Chain rule:
= -1/m Σ[(1/D(G(z_i))) × ∂D(G(z_i))/∂G(z_i) × ∂G(z_i)/∂θ_G]

Requiere backprop a través del discriminador
```

**Optimal Discriminator (dado G fijo):**

```
D*(x) = p_data(x) / (p_data(x) + p_g(x))

En equilibrio (p_data = p_g):
D*(x) = 1/2  (no puede distinguir)
```

**Convergencia teórica:**

```
Si G y D tienen capacidad infinita y suficiente tiempo:

p_g → p_data
D(x) → 1/2 para todo x

En práctica: Nunca alcanzamos equilibrio perfecto
```

---

## 🔍 Debugging GANs

**D loss → 0, G loss → ∞:**
```
D es demasiado bueno
→ Reducir learning rate de D
→ Entrenar G más veces por iteración
```

**G loss → 0, D loss → ∞:**
```
G es demasiado bueno (raro)
→ Aumentar learning rate de D
→ Mejorar arquitectura de D
```

**Ambos loss oscilan:**
```
Normal en GANs
→ Monitorear calidad visual
→ No solo mirar loss
```

**Outputs todos iguales:**
```
Mode collapse
→ Minibatch discrimination
→ Aumentar diversidad del ruido
```

---

## 📚 Recursos

- [Generative Adversarial Networks (Paper Original)](https://arxiv.org/abs/1406.2661)
- [DCGAN](https://arxiv.org/abs/1511.06434)
- [GAN Training Tips](https://github.com/soumith/ganhacks)
- [The GAN Zoo](https://github.com/hindupuravinash/the-gan-zoo)

---

**¡Comienza implementando el generador en `gan.ts`!** 🎨
