# Ejercicio 18: Reinforcement Learning

**Objetivo:** Implementar algoritmos de Reinforcement Learning (Q-Learning) y entornos simples para entender cómo los agentes aprenden mediante interacción.

## 📖 Teoría

### ¿Qué es Reinforcement Learning?

**Aprender mediante prueba y error, recibiendo recompensas o castigos.**

**Problema que resuelve:**
- No hay labels (supervisión)
- No sabemos la acción correcta a priori
- Debemos descubrir qué acciones maximizan recompensa a largo plazo

**Diferencia con otros ML:**
```
Supervised Learning:
  Input → Model → Output
  Compare con label → Backprop

Unsupervised Learning:
  Input → Model → Patterns
  Sin labels, descubrir estructura

Reinforcement Learning:
  State → Agent → Action
  Environment → Reward
  Maximizar recompensa acumulada
```

### Componentes de RL

**Analogía: Aprender a Jugar Videojuegos**

```
Agent:    Jugador
Environment: Juego
State:    Pantalla actual (posición, enemigos, etc.)
Action:   Botones presionados (↑, ↓, ←, →, A, B)
Reward:   Puntos ganados/perdidos
Policy:   Estrategia de juego
```

**Ciclo de RL:**

```
Loop:
  1. Agent observa State (s_t)
  2. Agent elige Action (a_t) según Policy
  3. Environment ejecuta acción
  4. Environment devuelve:
     - New State (s_{t+1})
     - Reward (r_t)
  5. Agent actualiza conocimiento
  6. Repetir
```

### Markov Decision Process (MDP)

**Framework matemático para RL.**

**Componentes:**
- **S:** Conjunto de estados
- **A:** Conjunto de acciones
- **P:** Probabilidad de transición P(s'|s,a)
- **R:** Función de recompensa R(s,a,s')
- **γ:** Factor de descuento [0, 1]

**Propiedad de Markov:**
```
P(s_{t+1} | s_t, a_t, s_{t-1}, ..., s_0) = P(s_{t+1} | s_t, a_t)

El futuro depende solo del presente, no del pasado.
```

**Retorno (Return):**
```
G_t = r_t + γr_{t+1} + γ²r_{t+2} + ... = Σ γᵏ r_{t+k}

γ = 0: Solo importa recompensa inmediata
γ = 1: Todas las recompensas valen igual
γ = 0.9: Recompensas futuras valen menos
```

### Value Functions

**V(s): Value Function**
```
V(s) = E[G_t | s_t = s]

Recompensa esperada empezando en estado s y siguiendo policy.

Ejemplo (GridWorld):
  Estado cerca de goal: V(s) alto
  Estado lejos de goal: V(s) bajo
  Estado con trampa: V(s) negativo
```

**Q(s,a): Action-Value Function**
```
Q(s,a) = E[G_t | s_t = s, a_t = a]

Recompensa esperada tomando acción a en estado s.

Ventaja: No necesitas saber P(s'|s,a)
Puedes elegir acción: argmax_a Q(s,a)
```

**Bellman Equation:**
```
V(s) = max_a [R(s,a) + γ Σ P(s'|s,a) V(s')]

Q(s,a) = R(s,a) + γ Σ P(s'|s,a) max_{a'} Q(s',a')

Relación recursiva: Valor de estado = recompensa inmediata + valor futuro descontado
```

### Q-Learning

**Algoritmo libre de modelo (model-free).**

**No necesitas conocer:**
- P(s'|s,a): Probabilidades de transición
- R(s,a): Función de recompensa exacta

**Solo necesitas:**
- Interactuar con environment
- Observar (s, a, r, s')

**Actualización Q-Learning:**

```
Q(s,a) ← Q(s,a) + α[r + γ max_{a'} Q(s',a') - Q(s,a)]
              └─────────────┬─────────────┘
                         TD Error

Componentes:
  α: Learning rate (qué tan rápido aprender)
  r: Recompensa inmediata
  γ: Discount factor
  max Q(s',a'): Mejor valor futuro posible
```

**Interpretación:**
```
Target = r + γ max Q(s',a')  "Lo que debería valer"
Error  = Target - Q(s,a)     "Cuánto nos equivocamos"
Update = α × Error           "Corrección proporcional"
```

**Ejemplo paso a paso:**

```
Estado: Robot en posición (0,0)
Acción: Mover derecha
Q(0,0, right) = 0.5

Resultado:
  - Nueva posición: (1,0)
  - Recompensa: -0.1 (costo de movimiento)
  - max Q(1,0, *) = 0.8

Actualización con α=0.1, γ=0.9:
  Target = -0.1 + 0.9 × 0.8 = 0.62
  Error  = 0.62 - 0.5 = 0.12
  Q_new  = 0.5 + 0.1 × 0.12 = 0.512
```

### Exploration vs Exploitation

**Dilema fundamental de RL:**

```
Exploitation: Usar lo que sabes
  - Elegir acción con mayor Q(s,a)
  - Maximizar recompensa inmediata
  - Riesgo: Quedarse en óptimo local

Exploration: Probar cosas nuevas
  - Elegir acciones aleatorias
  - Descubrir mejores estrategias
  - Riesgo: Perder recompensa a corto plazo
```

**ε-Greedy Policy:**

```
Con probabilidad ε:
  Explorar (acción aleatoria)

Con probabilidad 1-ε:
  Explotar (mejor acción conocida)

Decaimiento de ε:
  Inicio: ε = 1.0 (exploración total)
  Entrenamiento: ε → 0.1 (más explotación)
  Producción: ε = 0 (solo explotación)
```

**Otras estrategias:**
- **Softmax:** Probabilidad proporcional a Q-values
- **UCB:** Upper Confidence Bound
- **Optimistic Initialization:** Q inicial alto

### Convergencia de Q-Learning

**Condiciones para convergencia:**

1. Todos los pares (s,a) visitados infinitas veces
2. Learning rate decae apropiadamente:
   ```
   Σ α_t = ∞   (suma infinita)
   Σ α_t² < ∞  (suma de cuadrados finita)

   Ejemplo: α_t = 1/t cumple ambas
   ```

**En práctica:**
- Usar α constante pequeño (ej. 0.1)
- Garantizar exploración con ε-greedy
- Puede no converger exactamente, pero funciona bien

### Variantes de Q-Learning

**SARSA (State-Action-Reward-State-Action)**
```
Q(s,a) ← Q(s,a) + α[r + γ Q(s',a') - Q(s,a)]

Diferencia con Q-Learning:
  - Q-Learning: Off-policy (usa max Q)
  - SARSA: On-policy (usa Q de acción tomada)

SARSA es más conservador (aprende política actual)
Q-Learning es más optimista (aprende política óptima)
```

**Deep Q-Network (DQN)**
```
Q(s,a) representado por red neuronal

Mejoras:
  - Experience Replay
  - Target Network
  - Funciona con estados continuos/grandes

Usado en: Atari, Go, robótica
```

**Policy Gradient**
```
Aprende policy directamente (no Q-values)

π_θ(a|s) = probabilidad de acción a en estado s

Ventaja: Funciona con acciones continuas
```

---

## 🎯 Escenario

**Problema:** Navegación en GridWorld

```
Grid 5×5:
  S: Start
  G: Goal (+10)
  X: Obstacle (-10)
  .: Empty (-1 por paso)

┌───┬───┬───┬───┬───┐
│ S │   │   │   │   │
├───┼───┼───┼───┼───┤
│   │ X │   │ X │   │
├───┼───┼───┼───┼───┤
│   │   │   │   │   │
├───┼───┼───┼───┼───┤
│   │ X │   │   │   │
├───┼───┼───┼───┼───┤
│   │   │   │   │ G │
└───┴───┴───┴───┴───┘

Acciones: ↑, ↓, ←, →
Objetivo: Llegar a G minimizando pasos
```

**Aprendizaje:**
```
Episodio 1: Camina aleatoriamente, cae en X
           Q-values: Aprende que X es malo

Episodio 100: Evita X, pero no encuentra G
             Q-values: Aprende áreas seguras

Episodio 1000: Encuentra camino óptimo a G
              Q-values: Convergen a valores óptimos
```

---

## 📝 Instrucciones

### Parte 1: Environment (GridWorld)

```typescript
export class GridWorld {
  constructor(
    width: number,
    height: number,
    obstacles?: [number, number][],
    goal?: [number, number]
  ) {
    // Inicializar grid
  }

  reset(): State;
  step(action: Action): {
    nextState: State;
    reward: number;
    done: boolean;
  };

  isValidPosition(x: number, y: number): boolean;
  render(): string;  // Visualización ASCII
}
```

### Parte 2: Q-Learning Agent

```typescript
export class QLearningAgent {
  constructor(
    numStates: number,
    numActions: number,
    config: QLearningConfig
  ) {
    // Inicializar Q-table
  }

  chooseAction(state: State, epsilon: number): Action;

  learn(
    state: State,
    action: Action,
    reward: number,
    nextState: State,
    done: boolean
  ): void;

  getQValue(state: State, action: Action): number;
  getBestAction(state: State): Action;
}
```

### Parte 3: Training Loop

```typescript
export function trainAgent(
  env: GridWorld,
  agent: QLearningAgent,
  config: TrainingConfig
): TrainingHistory;

export interface TrainingHistory {
  episodeRewards: number[];
  episodeLengths: number[];
  epsilonDecay: number[];
}
```

### Parte 4: Visualización

```typescript
export function visualizePolicy(
  env: GridWorld,
  agent: QLearningAgent
): string;

export function plotLearningCurve(
  history: TrainingHistory
): void;
```

---

## ✅ Resultado Esperado

1. ✅ GridWorld environment con estados y acciones
2. ✅ Q-Learning agent con Q-table
3. ✅ ε-greedy exploration
4. ✅ Training loop completo
5. ✅ Convergencia a política óptima
6. ✅ Visualización de política aprendida

---

## 🧪 Tests

```bash
npm test 18-reinforcement-learning
```

---

## 💡 Consejos

1. **Learning Rate:** Empezar con 0.1-0.5
2. **Discount Factor:** γ = 0.9-0.99 es común
3. **Exploration:** ε inicial = 1.0, final = 0.01
4. **Decay:** ε_new = ε_old × 0.995 cada episodio
5. **Episodes:** Al menos 1000 para convergencia
6. **Q-Init:** Optimistic (alto) incentiva exploración
7. **Rewards:** Diseño crucial para comportamiento

---

## 📊 Matemáticas Detalladas

**Derivación de Q-Learning:**

```
Objetivo: Estimar Q*(s,a) óptimo

Bellman Optimality:
Q*(s,a) = E[r + γ max_{a'} Q*(s',a') | s,a]

Método de muestreo (sample-based):
  Observamos: (s, a, r, s')
  Estimación: r + γ max_{a'} Q(s',a')

Temporal Difference (TD) Learning:
  Error = [r + γ max Q(s',a')] - Q(s,a)
  Update = Q(s,a) + α × Error

Convergencia (bajo condiciones):
  lim Q(s,a) = Q*(s,a)
```

**Descomposición del Error:**

```
TD Error = δ_t = r_t + γ max Q(s_{t+1}, a) - Q(s_t, a_t)

Varianza del error:
  Alta: Learning inestable
  Baja: Learning suave pero lento

α controla trade-off:
  α alto → rápido pero inestable
  α bajo → lento pero estable
```

---

## 🎮 Extensiones

**Multi-Arm Bandit:**
- Caso especial: 1 estado, múltiples acciones
- Usado en: A/B testing, recomendaciones

**CartPole:**
- Balancear polo en carrito
- Estado continuo: posición, velocidad, ángulo
- Requiere discretización o DQN

**Atari Games:**
- Imagen como estado
- Deep Q-Network
- Convolutional layers

---

## 📚 Recursos

- [Sutton & Barto: RL Book](http://incompleteideas.net/book/the-book-2nd.html)
- [OpenAI Spinning Up](https://spinningup.openai.com/)
- [David Silver's RL Course](https://www.davidsilver.uk/teaching/)
- [Q-Learning Paper](https://link.springer.com/article/10.1007/BF00992698)

---

**¡Comienza implementando GridWorld en `reinforcement-learning.ts`!** 🎮
