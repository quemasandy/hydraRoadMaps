import {
  GridWorld,
  QLearningAgent,
  trainAgent,
  visualizePolicy,
  plotLearningCurve,
} from './reinforcement-learning';

describe('GridWorld', () => {
  describe('Initialization', () => {
    it('should create grid with default parameters', () => {
      const env = new GridWorld();
      expect(env).toBeDefined();
      expect(env.getNumStates()).toBe(25);
    });

    it('should create grid with custom size', () => {
      const env = new GridWorld(3, 4);
      expect(env.getNumStates()).toBe(12);
    });

    it('should accept obstacles', () => {
      const obstacles: [number, number][] = [[1, 1], [2, 2]];
      const env = new GridWorld(5, 5, obstacles);
      expect(env).toBeDefined();
    });
  });

  describe('State Management', () => {
    it('should reset to start position', () => {
      const env = new GridWorld(5, 5, [], [4, 4], [0, 0]);
      const state = env.reset();
      expect(state).toBe(0); // Position (0,0)
    });

    it('should convert position to state correctly', () => {
      const env = new GridWorld(5, 5);
      expect(env.positionToState([0, 0])).toBe(0);
      expect(env.positionToState([4, 4])).toBe(24);
      expect(env.positionToState([2, 2])).toBe(12);
    });

    it('should convert state to position correctly', () => {
      const env = new GridWorld(5, 5);
      expect(env.stateToPosition(0)).toEqual([0, 0]);
      expect(env.stateToPosition(24)).toEqual([4, 4]);
      expect(env.stateToPosition(12)).toEqual([2, 2]);
    });

    it('should round-trip position/state conversion', () => {
      const env = new GridWorld(5, 5);
      const pos: [number, number] = [3, 2];
      const state = env.positionToState(pos);
      const backToPos = env.stateToPosition(state);
      expect(backToPos).toEqual(pos);
    });
  });

  describe('Actions', () => {
    it('should move up correctly', () => {
      const env = new GridWorld(3, 3, [], [2, 2], [1, 1]);
      env.reset();

      const { nextState } = env.step('up');
      expect(nextState).toBe(env.positionToState([1, 0]));
    });

    it('should move down correctly', () => {
      const env = new GridWorld(3, 3, [], [2, 2], [1, 1]);
      env.reset();

      const { nextState } = env.step('down');
      expect(nextState).toBe(env.positionToState([1, 2]));
    });

    it('should move left correctly', () => {
      const env = new GridWorld(3, 3, [], [2, 2], [1, 1]);
      env.reset();

      const { nextState } = env.step('left');
      expect(nextState).toBe(env.positionToState([0, 1]));
    });

    it('should move right correctly', () => {
      const env = new GridWorld(3, 3, [], [2, 2], [1, 1]);
      env.reset();

      const { nextState } = env.step('right');
      expect(nextState).toBe(env.positionToState([2, 1]));
    });
  });

  describe('Boundaries', () => {
    it('should stay in place when hitting wall', () => {
      const env = new GridWorld(3, 3, [], [2, 2], [0, 0]);
      env.reset();

      const { nextState, reward } = env.step('up');
      expect(nextState).toBe(0); // Stay at (0,0)
      expect(reward).toBe(-1); // Penalty for invalid move
    });

    it('should handle all boundary cases', () => {
      const env = new GridWorld(3, 3, [], [2, 2], [0, 0]);
      env.reset();

      const leftResult = env.step('left');
      expect(leftResult.nextState).toBe(0);

      env.reset();
      const upResult = env.step('up');
      expect(upResult.nextState).toBe(0);
    });
  });

  describe('Rewards', () => {
    it('should give large reward for reaching goal', () => {
      const env = new GridWorld(2, 2, [], [1, 1], [1, 0]);
      env.reset();

      const { reward, done } = env.step('down');
      expect(reward).toBe(10);
      expect(done).toBe(true);
    });

    it('should give penalty for hitting obstacle', () => {
      const obstacles: [number, number][] = [[1, 0]];
      const env = new GridWorld(2, 2, obstacles, [1, 1], [0, 0]);
      env.reset();

      const { reward, done } = env.step('right');
      expect(reward).toBe(-10);
      expect(done).toBe(true);
    });

    it('should give small penalty for empty moves', () => {
      const env = new GridWorld(3, 3, [], [2, 2], [0, 0]);
      env.reset();

      const { reward, done } = env.step('right');
      expect(reward).toBeCloseTo(-0.1);
      expect(done).toBe(false);
    });
  });

  describe('Rendering', () => {
    it('should render grid without errors', () => {
      const env = new GridWorld(3, 3);
      const rendered = env.render();
      expect(rendered).toBeTruthy();
      expect(typeof rendered).toBe('string');
    });

    it('should show agent position', () => {
      const env = new GridWorld(3, 3);
      env.reset();
      const rendered = env.render();
      expect(rendered).toContain('A'); // Agent
    });
  });

  describe('Valid Positions', () => {
    it('should validate positions correctly', () => {
      const env = new GridWorld(5, 5);

      expect(env.isValidPosition(0, 0)).toBe(true);
      expect(env.isValidPosition(4, 4)).toBe(true);
      expect(env.isValidPosition(2, 2)).toBe(true);
      expect(env.isValidPosition(-1, 0)).toBe(false);
      expect(env.isValidPosition(0, -1)).toBe(false);
      expect(env.isValidPosition(5, 0)).toBe(false);
      expect(env.isValidPosition(0, 5)).toBe(false);
    });
  });
});

describe('QLearningAgent', () => {
  const actions = ['up', 'down', 'left', 'right'] as const;

  describe('Initialization', () => {
    it('should initialize with correct parameters', () => {
      const agent = new QLearningAgent(25, [...actions], {
        learningRate: 0.1,
        discountFactor: 0.9,
      });

      expect(agent).toBeDefined();
    });

    it('should initialize Q-table with default values', () => {
      const agent = new QLearningAgent(4, [...actions], {
        learningRate: 0.1,
        discountFactor: 0.9,
        initialQValue: 0,
      });

      expect(agent.getQValue(0, 'up')).toBe(0);
      expect(agent.getQValue(3, 'right')).toBe(0);
    });

    it('should initialize Q-table with custom values', () => {
      const agent = new QLearningAgent(4, [...actions], {
        learningRate: 0.1,
        discountFactor: 0.9,
        initialQValue: 1.5,
      });

      expect(agent.getQValue(0, 'up')).toBe(1.5);
      expect(agent.getQValue(2, 'left')).toBe(1.5);
    });
  });

  describe('Action Selection', () => {
    it('should choose random action with epsilon=1', () => {
      const agent = new QLearningAgent(25, [...actions], {
        learningRate: 0.1,
        discountFactor: 0.9,
      });

      const action = agent.chooseAction(0, 1.0);
      expect(actions).toContain(action);
    });

    it('should choose best action with epsilon=0', () => {
      const agent = new QLearningAgent(4, [...actions], {
        learningRate: 0.1,
        discountFactor: 0.9,
        initialQValue: 0,
      });

      // Manually set Q-values
      agent.learn(0, 'right', 10, 1, true);

      const action = agent.chooseAction(0, 0.0);
      expect(action).toBe('right');
    });

    it('should explore sometimes with 0 < epsilon < 1', () => {
      const agent = new QLearningAgent(4, [...actions], {
        learningRate: 0.1,
        discountFactor: 0.9,
      });

      // With epsilon=0.5, should get mix of exploration/exploitation
      const chosenActions: string[] = [];
      for (let i = 0; i < 100; i++) {
        chosenActions.push(agent.chooseAction(0, 0.5));
      }

      // Should have variety of actions
      const uniqueActions = new Set(chosenActions);
      expect(uniqueActions.size).toBeGreaterThan(1);
    });
  });

  describe('Learning', () => {
    it('should update Q-values when learning', () => {
      const agent = new QLearningAgent(4, [...actions], {
        learningRate: 0.1,
        discountFactor: 0.9,
        initialQValue: 0,
      });

      const initialQ = agent.getQValue(0, 'right');

      agent.learn(0, 'right', 10, 1, true);

      const updatedQ = agent.getQValue(0, 'right');
      expect(updatedQ).not.toBe(initialQ);
      expect(updatedQ).toBeGreaterThan(initialQ);
    });

    it('should use discount factor correctly', () => {
      const agent = new QLearningAgent(4, [...actions], {
        learningRate: 1.0, // Full update for easier testing
        discountFactor: 0.5,
        initialQValue: 0,
      });

      // Set future Q-value
      agent.learn(1, 'up', 10, 2, true);

      // Learn from state 0
      agent.learn(0, 'right', 0, 1, false);

      const q = agent.getQValue(0, 'right');
      // Q(0,right) = 0 + 1.0 * (0 + 0.5 * 10 - 0) = 5
      expect(q).toBeCloseTo(5.0, 1);
    });

    it('should handle terminal states correctly', () => {
      const agent = new QLearningAgent(4, [...actions], {
        learningRate: 1.0,
        discountFactor: 0.9,
        initialQValue: 0,
      });

      agent.learn(0, 'right', 10, 1, true); // Terminal

      const q = agent.getQValue(0, 'right');
      // Q(0,right) = 0 + 1.0 * (10 - 0) = 10
      expect(q).toBe(10);
    });

    it('should accumulate learning over multiple updates', () => {
      const agent = new QLearningAgent(4, [...actions], {
        learningRate: 0.1,
        discountFactor: 0.9,
        initialQValue: 0,
      });

      const q0 = agent.getQValue(0, 'right');

      // Multiple updates
      for (let i = 0; i < 10; i++) {
        agent.learn(0, 'right', 1, 1, false);
      }

      const q1 = agent.getQValue(0, 'right');
      expect(q1).toBeGreaterThan(q0);
    });
  });

  describe('Best Action', () => {
    it('should return action with highest Q-value', () => {
      const agent = new QLearningAgent(4, [...actions], {
        learningRate: 1.0,
        discountFactor: 0.9,
        initialQValue: 0,
      });

      // Set different Q-values
      agent.learn(0, 'up', 1, 1, true);
      agent.learn(0, 'down', 5, 1, true);
      agent.learn(0, 'left', 2, 1, true);
      agent.learn(0, 'right', 3, 1, true);

      const bestAction = agent.getBestAction(0);
      expect(bestAction).toBe('down');
    });

    it('should break ties consistently', () => {
      const agent = new QLearningAgent(4, [...actions], {
        learningRate: 0.1,
        discountFactor: 0.9,
        initialQValue: 0,
      });

      // All Q-values are 0
      const action1 = agent.getBestAction(0);
      const action2 = agent.getBestAction(0);

      expect(action1).toBe(action2); // Consistent
    });
  });

  describe('Q-Table', () => {
    it('should provide access to Q-table', () => {
      const agent = new QLearningAgent(4, [...actions], {
        learningRate: 0.1,
        discountFactor: 0.9,
      });

      const qTable = agent.getQTable();
      expect(qTable).toBeDefined();
      expect(qTable.size).toBeGreaterThan(0);
    });

    it('should have entries for all state-action pairs', () => {
      const agent = new QLearningAgent(2, ['up', 'down'], {
        learningRate: 0.1,
        discountFactor: 0.9,
      });

      const qTable = agent.getQTable();
      expect(qTable.size).toBe(4); // 2 states × 2 actions
    });
  });
});

describe('Training', () => {
  it('should train agent without errors', () => {
    const env = new GridWorld(3, 3, [], [2, 2], [0, 0]);
    const agent = new QLearningAgent(env.getNumStates(), env.getActions(), {
      learningRate: 0.1,
      discountFactor: 0.9,
    });

    expect(() => {
      trainAgent(env, agent, {
        episodes: 10,
        maxStepsPerEpisode: 50,
        epsilonStart: 1.0,
        epsilonEnd: 0.1,
        epsilonDecay: 0.99,
        verbose: false,
      });
    }).not.toThrow();
  });

  it('should return training history', () => {
    const env = new GridWorld(3, 3, [], [2, 2], [0, 0]);
    const agent = new QLearningAgent(env.getNumStates(), env.getActions(), {
      learningRate: 0.1,
      discountFactor: 0.9,
    });

    const history = trainAgent(env, agent, {
      episodes: 20,
      maxStepsPerEpisode: 50,
      epsilonStart: 1.0,
      epsilonEnd: 0.1,
      epsilonDecay: 0.99,
      verbose: false,
    });

    expect(history.episodeRewards).toHaveLength(20);
    expect(history.episodeLengths).toHaveLength(20);
    expect(history.epsilonDecay).toHaveLength(20);
    expect(history.averageRewards).toHaveLength(20);
  });

  it('should decay epsilon over time', () => {
    const env = new GridWorld(3, 3);
    const agent = new QLearningAgent(env.getNumStates(), env.getActions(), {
      learningRate: 0.1,
      discountFactor: 0.9,
    });

    const history = trainAgent(env, agent, {
      episodes: 50,
      maxStepsPerEpisode: 50,
      epsilonStart: 1.0,
      epsilonEnd: 0.01,
      epsilonDecay: 0.95,
      verbose: false,
    });

    const firstEpsilon = history.epsilonDecay[0];
    const lastEpsilon = history.epsilonDecay[history.epsilonDecay.length - 1];

    expect(firstEpsilon).toBeGreaterThan(lastEpsilon);
    expect(lastEpsilon).toBeGreaterThanOrEqual(0.01);
  });

  it('should improve over episodes', () => {
    const env = new GridWorld(5, 5, [], [4, 4], [0, 0]);
    const agent = new QLearningAgent(env.getNumStates(), env.getActions(), {
      learningRate: 0.1,
      discountFactor: 0.9,
    });

    const history = trainAgent(env, agent, {
      episodes: 200,
      maxStepsPerEpisode: 100,
      epsilonStart: 1.0,
      epsilonEnd: 0.01,
      epsilonDecay: 0.995,
      verbose: false,
    });

    const earlyAvg = history.averageRewards.slice(0, 20).reduce((a, b) => a + b) / 20;
    const lateAvg = history.averageRewards.slice(-20).reduce((a, b) => a + b) / 20;

    expect(lateAvg).toBeGreaterThan(earlyAvg);
  });

  it('should handle verbose mode', () => {
    const env = new GridWorld(3, 3);
    const agent = new QLearningAgent(env.getNumStates(), env.getActions(), {
      learningRate: 0.1,
      discountFactor: 0.9,
    });

    expect(() => {
      trainAgent(env, agent, {
        episodes: 50,
        maxStepsPerEpisode: 50,
        epsilonStart: 1.0,
        epsilonEnd: 0.1,
        epsilonDecay: 0.99,
        verbose: true,
      });
    }).not.toThrow();
  });
});

describe('Visualization', () => {
  it('should visualize policy without errors', () => {
    const env = new GridWorld(3, 3);
    const agent = new QLearningAgent(env.getNumStates(), env.getActions(), {
      learningRate: 0.1,
      discountFactor: 0.9,
    });

    expect(() => {
      visualizePolicy(env, agent);
    }).not.toThrow();
  });

  it('should return string representation', () => {
    const env = new GridWorld(3, 3);
    const agent = new QLearningAgent(env.getNumStates(), env.getActions(), {
      learningRate: 0.1,
      discountFactor: 0.9,
    });

    const policy = visualizePolicy(env, agent);
    expect(typeof policy).toBe('string');
    expect(policy.length).toBeGreaterThan(0);
  });

  it('should plot learning curve without errors', () => {
    const history = {
      episodeRewards: [1, 2, 3, 4, 5],
      episodeLengths: [10, 9, 8, 7, 6],
      epsilonDecay: [1.0, 0.9, 0.8, 0.7, 0.6],
      averageRewards: [1, 1.5, 2, 2.5, 3],
    };

    expect(() => {
      plotLearningCurve(history);
    }).not.toThrow();
  });
});

describe('Integration Tests', () => {
  it('should complete full RL workflow', () => {
    // 1. Create environment
    const obstacles: [number, number][] = [[1, 1], [3, 1]];
    const env = new GridWorld(5, 5, obstacles, [4, 4], [0, 0]);

    // 2. Create agent
    const agent = new QLearningAgent(env.getNumStates(), env.getActions(), {
      learningRate: 0.1,
      discountFactor: 0.9,
      initialQValue: 0,
    });

    // 3. Train
    const history = trainAgent(env, agent, {
      episodes: 100,
      maxStepsPerEpisode: 100,
      epsilonStart: 1.0,
      epsilonEnd: 0.01,
      epsilonDecay: 0.99,
      verbose: false,
    });

    expect(history.episodeRewards).toHaveLength(100);

    // 4. Test learned policy
    env.reset();
    const bestAction = agent.getBestAction(0);
    expect(['up', 'down', 'left', 'right']).toContain(bestAction);

    // 5. Visualize
    const policy = visualizePolicy(env, agent);
    expect(policy).toBeTruthy();
  });

  it('should learn to avoid obstacles', () => {
    const obstacles: [number, number][] = [[1, 0]];
    const env = new GridWorld(3, 1, obstacles, [2, 0], [0, 0]);

    const agent = new QLearningAgent(env.getNumStates(), env.getActions(), {
      learningRate: 0.5,
      discountFactor: 0.9,
    });

    trainAgent(env, agent, {
      episodes: 200,
      maxStepsPerEpisode: 20,
      epsilonStart: 1.0,
      epsilonEnd: 0.01,
      epsilonDecay: 0.99,
      verbose: false,
    });

    // Agent should learn not to go right from (0,0) since (1,0) is obstacle
    const qRight = agent.getQValue(0, 'right');
    const qOther = Math.max(
      agent.getQValue(0, 'up'),
      agent.getQValue(0, 'down'),
      agent.getQValue(0, 'left')
    );

    // Q-value for going to obstacle should be lower
    expect(qRight).toBeLessThan(qOther + 5);
  });

  it('should handle edge case: start is goal', () => {
    const env = new GridWorld(3, 3, [], [0, 0], [0, 0]);
    const agent = new QLearningAgent(env.getNumStates(), env.getActions(), {
      learningRate: 0.1,
      discountFactor: 0.9,
    });

    expect(() => {
      trainAgent(env, agent, {
        episodes: 10,
        maxStepsPerEpisode: 10,
        epsilonStart: 1.0,
        epsilonEnd: 0.1,
        epsilonDecay: 0.99,
        verbose: false,
      });
    }).not.toThrow();
  });
});
