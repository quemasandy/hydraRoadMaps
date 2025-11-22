/**
 * MODERN TS: State Machines (Reducer Pattern)
 *
 * En OOP: Clases `State` mutables.
 * En Modern TS: Función `reducer(state, event) => newState`.
 *
 * Es la base de Redux y `useReducer`.
 */

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: string }
  | { status: 'error'; error: string };

type Action =
  | { type: 'FETCH' }
  | { type: 'RESOLVE'; payload: string }
  | { type: 'REJECT'; error: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH':
      return { status: 'loading' };
    case 'RESOLVE':
      return { status: 'success', data: action.payload };
    case 'REJECT':
      return { status: 'error', error: action.error };
    default:
      return state;
  }
};

// Uso
let s: State = { status: 'idle' };
s = reducer(s, { type: 'FETCH' });
s = reducer(s, { type: 'RESOLVE', payload: 'Data loaded' });
console.log(s); // { status: 'success', data: 'Data loaded' }
