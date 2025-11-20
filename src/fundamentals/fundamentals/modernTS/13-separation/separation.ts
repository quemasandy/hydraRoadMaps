/**
 * MODERN TS: Separation of Concerns
 *
 * En OOP: MVC (Model-View-Controller).
 * En Modern TS: Hooks Pattern (Logic vs View).
 *
 * Separamos la lógica de estado (State Management) de la presentación.
 */

import { useState } from 'react'; // Imaginario, solo para ejemplo

// 1. Lógica (Custom Hook) - Solo maneja estado y reglas
const useCounter = (initial = 0) => {
  const [count, setCount] = useState(initial);
  const inc = () => setCount((c) => c + 1);
  const dec = () => setCount((c) => c - 1);
  return { count, inc, dec };
};

// 2. Vista (Componente) - Solo pinta UI
const CounterView = () => {
  const { count, inc, dec } = useCounter(10); // Conectamos lógica

  return `
    <div>
      <h1>${count}</h1>
      <button onclick="${inc}">+</button>
      <button onclick="${dec}">-</button>
    </div>
  `;
};
