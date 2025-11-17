/**
 * Ejercicio 18: Reinforcement Learning
 *
 * Implementación de Q-Learning y GridWorld environment
 * para aprender navegación mediante prueba y error.
 */

// ============================================
// TIPOS E INTERFACES
// ============================================

export type Action = 'up' | 'down' | 'left' | 'right';
export type State = number; // Index lineal del grid

/**
 * Configuración de Q-Learning
 */
export interface QLearningConfig {
  learningRate: number; // α
  discountFactor: number; // γ
  initialQValue?: number;
}

/**
 * Configuración de entrenamiento
 */
export interface TrainingConfig {
  episodes: number;
  maxStepsPerEpisode: number;
  epsilonStart: number;
  epsilonEnd: number;
  epsilonDecay: number;
  verbose?: boolean;
}

/**
 * Historial de entrenamiento
 */
export interface TrainingHistory {
  episodeRewards: number[];
  episodeLengths: number[];
  epsilonDecay: number[];
  averageRewards: number[]; // Moving average
}

// ============================================
// GRIDWORLD ENVIRONMENT
// ============================================

/**
 * GridWorld Environment
 *
 * Grid 2D con:
 * - Start: Posición inicial
 * - Goal: Objetivo (+recompensa)
 * - Obstacles: Obstáculos (-recompensa)
 * - Empty: Espacios vacíos (pequeño costo)
 */
export class GridWorld {
  private width: number;
  private height: number;
  private start: [number, number];
  private goal: [number, number];
  private obstacles: Set<string>;
  private currentPos: [number, number];
  private numStates: number;

  constructor(
    width: number = 5,
    height: number = 5,
    obstacles: [number, number][] = [],
    goal: [number, number] = [4, 4],
    start: [number, number] = [0, 0]
  ) {
    this.width = width;
    this.height = height;
    this.start = start;
    this.goal = goal;
    this.currentPos = [...start];
    this.numStates = width * height;

    // Almacenar obstáculos como Set para búsqueda rápida
    this.obstacles = new Set(obstacles.map(([x, y]) => `${x},${y}`));
  }

  /**
   * Reinicia environment a estado inicial
   */
  reset(): State {
    this.currentPos = [...this.start];
    return this.positionToState(this.currentPos);
  }

  /**
   * Ejecuta acción y devuelve resultado
   */
  step(action: Action): {
    nextState: State;
    reward: number;
    done: boolean;
  } {
    const [x, y] = this.currentPos;
    let newX = x;
    let newY = y;

    // Calcular nueva posición según acción
    switch (action) {
      case 'up':
        newY = y - 1;
        break;
      case 'down':
        newY = y + 1;
        break;
      case 'left':
        newX = x - 1;
        break;
      case 'right':
        newX = x + 1;
        break;
    }

    // Verificar validez y calcular recompensa
    let reward: number;
    let done = false;

    if (!this.isValidPosition(newX, newY)) {
      // Movimiento inválido (fuera de límites): quedarse en lugar
      reward = -1;
      newX = x;
      newY = y;
    } else if (this.isObstacle(newX, newY)) {
      // Obstáculo: gran penalización
      reward = -10;
      done = true;
    } else if (this.isGoal(newX, newY)) {
      // Goal: gran recompensa
      reward = 10;
      done = true;
    } else {
      // Espacio vacío: pequeño costo por movimiento
      reward = -0.1;
    }

    // Actualizar posición
    this.currentPos = [newX, newY];
    const nextState = this.positionToState(this.currentPos);

    return { nextState, reward, done };
  }

  /**
   * Verifica si posición es válida
   */
  isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Verifica si posición es obstáculo
   */
  private isObstacle(x: number, y: number): boolean {
    return this.obstacles.has(`${x},${y}`);
  }

  /**
   * Verifica si posición es goal
   */
  private isGoal(x: number, y: number): boolean {
    return x === this.goal[0] && y === this.goal[1];
  }

  /**
   * Convierte posición (x,y) a estado lineal
   */
  positionToState(pos: [number, number]): State {
    return pos[1] * this.width + pos[0];
  }

  /**
   * Convierte estado lineal a posición (x,y)
   */
  stateToPosition(state: State): [number, number] {
    const y = Math.floor(state / this.width);
    const x = state % this.width;
    return [x, y];
  }

  /**
   * Renderiza grid como string ASCII
   */
  render(): string {
    let output = '\n';

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (x === this.currentPos[0] && y === this.currentPos[1]) {
          output += ' A '; // Agent
        } else if (x === this.goal[0] && y === this.goal[1]) {
          output += ' G '; // Goal
        } else if (this.isObstacle(x, y)) {
          output += ' X '; // Obstacle
        } else if (x === this.start[0] && y === this.start[1]) {
          output += ' S '; // Start
        } else {
          output += ' . '; // Empty
        }
      }
      output += '\n';
    }

    return output;
  }

  /**
   * Obtiene número total de estados
   */
  getNumStates(): number {
    return this.numStates;
  }

  /**
   * Obtiene acciones disponibles
   */
  getActions(): Action[] {
    return ['up', 'down', 'left', 'right'];
  }
}

// ============================================
// Q-LEARNING AGENT
// ============================================

/**
 * Q-Learning Agent
 *
 * Aprende política óptima mediante interacción con environment.
 * Usa Q-table para almacenar valores Q(s,a).
 */
export class QLearningAgent {
  private qTable: Map<string, number>;
  private numStates: number;
  private actions: Action[];
  private config: Required<QLearningConfig>;

  constructor(
    numStates: number,
    actions: Action[],
    config: QLearningConfig
  ) {
    this.numStates = numStates;
    this.actions = actions;
    this.config = {
      learningRate: config.learningRate,
      discountFactor: config.discountFactor,
      initialQValue: config.initialQValue || 0,
    };

    // Inicializar Q-table
    this.qTable = new Map();
    this.initializeQTable();
  }

  /**
   * Inicializa Q-table con valores iniciales
   */
  private initializeQTable(): void {
    for (let s = 0; s < this.numStates; s++) {
      for (const action of this.actions) {
        const key = this.getKey(s, action);
        this.qTable.set(key, this.config.initialQValue);
      }
    }
  }

  /**
   * Genera key para Q-table
   */
  private getKey(state: State, action: Action): string {
    return `${state}-${action}`;
  }

  /**
   * Obtiene Q-value
   */
  getQValue(state: State, action: Action): number {
    const key = this.getKey(state, action);
    return this.qTable.get(key) || this.config.initialQValue;
  }

  /**
   * Establece Q-value
   */
  private setQValue(state: State, action: Action, value: number): void {
    const key = this.getKey(state, action);
    this.qTable.set(key, value);
  }

  /**
   * Elige acción usando ε-greedy
   *
   * Con probabilidad ε: acción aleatoria (exploration)
   * Con probabilidad 1-ε: mejor acción (exploitation)
   */
  chooseAction(state: State, epsilon: number): Action {
    if (Math.random() < epsilon) {
      // Explorar: acción aleatoria
      const randomIdx = Math.floor(Math.random() * this.actions.length);
      return this.actions[randomIdx];
    } else {
      // Explotar: mejor acción
      return this.getBestAction(state);
    }
  }

  /**
   * Obtiene mejor acción para estado
   */
  getBestAction(state: State): Action {
    let bestAction = this.actions[0];
    let bestValue = this.getQValue(state, bestAction);

    for (let i = 1; i < this.actions.length; i++) {
      const action = this.actions[i];
      const value = this.getQValue(state, action);

      if (value > bestValue) {
        bestValue = value;
        bestAction = action;
      }
    }

    return bestAction;
  }

  /**
   * Obtiene máximo Q-value para estado
   */
  private getMaxQValue(state: State): number {
    let maxValue = this.getQValue(state, this.actions[0]);

    for (let i = 1; i < this.actions.length; i++) {
      const value = this.getQValue(state, this.actions[i]);
      if (value > maxValue) {
        maxValue = value;
      }
    }

    return maxValue;
  }

  /**
   * Actualiza Q-value usando Q-Learning
   *
   * Q(s,a) ← Q(s,a) + α[r + γ max_a' Q(s',a') - Q(s,a)]
   */
  learn(
    state: State,
    action: Action,
    reward: number,
    nextState: State,
    done: boolean
  ): void {
    const currentQ = this.getQValue(state, action);

    // Calcular target
    let target: number;
    if (done) {
      // Si episodio terminó, no hay valor futuro
      target = reward;
    } else {
      // Target = r + γ max_a' Q(s',a')
      const maxNextQ = this.getMaxQValue(nextState);
      target = reward + this.config.discountFactor * maxNextQ;
    }

    // TD Error
    const tdError = target - currentQ;

    // Actualizar Q-value
    const newQ = currentQ + this.config.learningRate * tdError;
    this.setQValue(state, action, newQ);
  }

  /**
   * Obtiene Q-table completa (para debugging/visualización)
   */
  getQTable(): Map<string, number> {
    return new Map(this.qTable);
  }
}

// ============================================
// TRAINING
// ============================================

/**
 * Entrena agente en environment
 */
export function trainAgent(
  env: GridWorld,
  agent: QLearningAgent,
  config: TrainingConfig
): TrainingHistory {
  const history: TrainingHistory = {
    episodeRewards: [],
    episodeLengths: [],
    epsilonDecay: [],
    averageRewards: [],
  };

  let epsilon = config.epsilonStart;

  for (let episode = 0; episode < config.episodes; episode++) {
    let state = env.reset();
    let totalReward = 0;
    let steps = 0;

    // Ejecutar episodio
    for (let step = 0; step < config.maxStepsPerEpisode; step++) {
      // Elegir acción
      const action = agent.chooseAction(state, epsilon);

      // Ejecutar acción
      const { nextState, reward, done } = env.step(action);

      // Aprender
      agent.learn(state, action, reward, nextState, done);

      // Actualizar
      totalReward += reward;
      state = nextState;
      steps++;

      if (done) {
        break;
      }
    }

    // Guardar resultados del episodio
    history.episodeRewards.push(totalReward);
    history.episodeLengths.push(steps);
    history.epsilonDecay.push(epsilon);

    // Calcular promedio móvil (últimos 100 episodios)
    const windowSize = Math.min(100, episode + 1);
    const recentRewards = history.episodeRewards.slice(-windowSize);
    const avgReward = recentRewards.reduce((a, b) => a + b, 0) / windowSize;
    history.averageRewards.push(avgReward);

    // Decaer epsilon
    epsilon = Math.max(
      config.epsilonEnd,
      epsilon * config.epsilonDecay
    );

    // Log progreso
    if (
      config.verbose &&
      (episode % 100 === 0 || episode === config.episodes - 1)
    ) {
      console.log(
        `Episode ${episode + 1}/${config.episodes}: ` +
        `Reward=${totalReward.toFixed(2)}, ` +
        `Steps=${steps}, ` +
        `Epsilon=${epsilon.toFixed(3)}, ` +
        `Avg Reward=${avgReward.toFixed(2)}`
      );
    }
  }

  return history;
}

// ============================================
// VISUALIZACIÓN
// ============================================

/**
 * Visualiza política aprendida
 */
export function visualizePolicy(
  env: GridWorld,
  agent: QLearningAgent
): string {
  let output = '\nLearned Policy:\n';
  output += '(Best action in each state)\n\n';

  const actionSymbols: Record<Action, string> = {
    up: '↑',
    down: '↓',
    left: '←',
    right: '→',
  };

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const state = env.positionToState([x, y]);
      const bestAction = agent.getBestAction(state);
      const symbol = actionSymbols[bestAction];

      output += ` ${symbol} `;
    }
    output += '\n';
  }

  return output;
}

/**
 * Visualiza curva de aprendizaje (consola)
 */
export function plotLearningCurve(history: TrainingHistory): void {
  console.log('\n=== Learning Curve ===');
  console.log(`Total episodes: ${history.episodeRewards.length}`);

  const step = Math.max(1, Math.floor(history.episodeRewards.length / 10));

  console.log('\nAverage Rewards (moving average):');
  for (let i = 0; i < history.averageRewards.length; i += step) {
    const episode = i + 1;
    const avgReward = history.averageRewards[i];
    const epsilon = history.epsilonDecay[i];

    console.log(
      `Episode ${episode.toString().padStart(4)}: ` +
      `Avg Reward=${avgReward.toFixed(2).padStart(6)}, ` +
      `Epsilon=${epsilon.toFixed(3)}`
    );
  }

  // Últimas estadísticas
  const lastIdx = history.averageRewards.length - 1;
  console.log(
    `\nFinal Average Reward: ${history.averageRewards[lastIdx].toFixed(2)}`
  );

  const avgLength =
    history.episodeLengths.reduce((a, b) => a + b, 0) /
    history.episodeLengths.length;
  console.log(`Average Episode Length: ${avgLength.toFixed(2)}`);
}

// ============================================
// EJEMPLO DE USO
// ============================================

if (require.main === module) {
  console.log('=== Ejercicio 18: Reinforcement Learning ===\n');

  // Ejemplo 1: GridWorld
  console.log('1. GridWorld Environment');
  console.log('------------------------');

  const obstacles: [number, number][] = [
    [1, 1],
    [3, 1],
    [1, 3],
  ];

  const env = new GridWorld(5, 5, obstacles, [4, 4], [0, 0]);

  console.log('Initial Grid:');
  console.log(env.render());

  // Ejemplo 2: Interacción manual
  console.log('\n2. Manual Interaction');
  console.log('---------------------');

  env.reset();
  console.log('Taking random actions:');

  const actions: Action[] = ['right', 'down', 'right', 'down'];
  let totalReward = 0;

  for (const action of actions) {
    const { nextState, reward, done } = env.step(action);
    totalReward += reward;

    console.log(
      `Action: ${action}, State: ${nextState}, Reward: ${reward.toFixed(2)}, Done: ${done}`
    );

    if (done) break;
  }

  console.log(`Total reward: ${totalReward.toFixed(2)}`);

  // Ejemplo 3: Q-Learning Agent
  console.log('\n\n3. Q-Learning Agent');
  console.log('-------------------');

  const agent = new QLearningAgent(env.getNumStates(), env.getActions(), {
    learningRate: 0.1,
    discountFactor: 0.9,
    initialQValue: 0,
  });

  console.log('Training agent...\n');

  const history = trainAgent(env, agent, {
    episodes: 500,
    maxStepsPerEpisode: 100,
    epsilonStart: 1.0,
    epsilonEnd: 0.01,
    epsilonDecay: 0.995,
    verbose: true,
  });

  // Visualizar política aprendida
  console.log(visualizePolicy(env, agent));

  // Ejemplo 4: Testing (sin exploration)
  console.log('\n4. Testing Learned Policy');
  console.log('-------------------------');

  env.reset();
  console.log('Initial position:');
  console.log(env.render());

  let state = env.reset();
  let testSteps = 0;
  let testReward = 0;
  const path: [number, number][] = [];

  console.log('Following learned policy:');

  for (let i = 0; i < 20; i++) {
    const action = agent.getBestAction(state);
    const { nextState, reward, done } = env.step(action);

    path.push(env.stateToPosition(state));

    console.log(
      `Step ${i + 1}: Action=${action}, Reward=${reward.toFixed(2)}`
    );

    testReward += reward;
    state = nextState;
    testSteps++;

    if (done) {
      console.log(`\nReached goal in ${testSteps} steps!`);
      console.log(`Total reward: ${testReward.toFixed(2)}`);
      break;
    }
  }

  // Curva de aprendizaje
  console.log('\n\n5. Learning Progress');
  plotLearningCurve(history);

  console.log('\n=== Fin del ejemplo ===');
}
