// Este es un ejemplo conceptual de cómo se define una máquina en XState.
// No necesitas ejecutarlo, solo estúdialo para entender la estructura declarativa.

type TrafficLightContext = {
  carsWaiting: number;
};

type TrafficLightEvent =
  | { type: 'TIMER' }
  | { type: 'POWER_OUTAGE' }
  | { type: 'POWER_RESTORED' };

// Definición de la máquina (pseudo-código similar a XState)
const trafficLightMachine = {
  id: 'trafficLight',
  initial: 'red',
  context: {
    carsWaiting: 0,
  },
  states: {
    red: {
      on: {
        TIMER: { target: 'green' },
        POWER_OUTAGE: { target: 'redBlinking' },
      },
    },
    green: {
      on: {
        TIMER: { target: 'yellow' },
        POWER_OUTAGE: { target: 'redBlinking' },
      },
    },
    yellow: {
      on: {
        TIMER: { target: 'red' },
        POWER_OUTAGE: { target: 'redBlinking' },
      },
    },
    redBlinking: {
      // Estado de error/emergencia
      on: {
        POWER_RESTORED: { target: 'red' },
      },
    },
  },
};

console.log('Estudia la estructura `states` y `on` (eventos) arriba.');
console.log('Nota cómo cada estado define explícitamente a dónde puede ir.');

export {};
