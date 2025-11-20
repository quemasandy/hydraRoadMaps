/**
 * MODERN TS: XState (Declarative State Machines)
 *
 * En lugar de clases `State`, usamos objetos de configuración JSON.
 * Esto permite visualizar la lógica y serializarla.
 */

type LightState = 'red' | 'green' | 'yellow';
type LightEvent = 'TIMER';

// Configuración pura (Data)
const trafficLightConfig = {
  initial: 'red',
  states: {
    red: { on: { TIMER: 'green' } },
    green: { on: { TIMER: 'yellow' } },
    yellow: { on: { TIMER: 'red' } },
  },
} as const;

// Intérprete genérico (Behavior)
const transition = (current: LightState, event: LightEvent): LightState => {
  const stateNode = trafficLightConfig.states[current];
  const nextState = stateNode.on[event];
  return (nextState as LightState) || current;
};

// Uso
let current: LightState = 'red';
current = transition(current, 'TIMER'); // green
console.log(current);
