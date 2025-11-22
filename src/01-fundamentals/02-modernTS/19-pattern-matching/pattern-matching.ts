/**
 * MODERN TS: Pattern Matching (Discriminated Unions Helper)
 *
 * TypeScript no tiene `match` nativo (aún), pero podemos crear uno.
 * Esto hace que manejar uniones sea tan elegante como en Rust.
 */

type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };

// Helper de utilidad
const match = <T extends { kind: string }, R>(
  value: T,
  patterns: { [K in T['kind']]: (val: Extract<T, { kind: K }>) => R }
): R => {
  const handler = patterns[value.kind];
  return handler(value as any);
};

// Uso
const s: Shape = { kind: 'circle', radius: 10 };

const area = match(s, {
  circle: (c) => Math.PI * c.radius ** 2,
  square: (sq) => sq.side ** 2,
});

console.log(area);
