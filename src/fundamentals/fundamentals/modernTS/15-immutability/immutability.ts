/**
 * MODERN TS: Immutability
 *
 * En OOP: Setters (`this.x = 5`). Estado mutable compartido = Bugs.
 * En Modern TS: `Readonly`, `const`, Spread Operator.
 *
 * Nunca modificamos objetos, creamos copias modificadas.
 */

type State = {
  readonly count: number;
  readonly user?: { readonly name: string };
};

const initialState: State = { count: 0 };

// BAD: Mutation
// const incrementBad = (s: State) => { s.count++; } // Error: read-only

// GOOD: Copy & Update
const increment = (s: State): State => ({
  ...s,
  count: s.count + 1,
});

const setName = (s: State, name: string): State => ({
  ...s,
  user: { ...s.user, name }, // Nested update seguro
});

let state = initialState;
state = increment(state);
state = setName(state, 'Andy');

console.log(state);
