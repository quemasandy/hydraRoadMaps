/**
 * MODERN TS: Inheritance
 *
 * En OOP: `class Dog extends Animal`. Problema: Herencia frágil, "Gorilla Banana Problem".
 * En Modern TS: Composición de Tipos (Intersection Types) y Spread Operator.
 *
 * "Prefiere composición sobre herencia".
 */

type Entity = { id: string; createdAt: Date };
type Named = { name: string };
type Locatable = { x: number; y: number };

// Herencia múltiple fácil con Intersection Types (&)
type Player = Entity & Named & Locatable & { health: number };

// Constructor funcional (Factory)
const createPlayer = (name: string): Player => ({
  id: '1',
  createdAt: new Date(),
  name,
  x: 0,
  y: 0,
  health: 100,
});

// Extender comportamiento (simulando override)
const movePlayer = (p: Player, dx: number, dy: number): Player => ({
  ...p, // Copiamos todo (Spread)
  x: p.x + dx, // Sobrescribimos lo que cambia
  y: p.y + dy,
});

const p1 = createPlayer('Mario');
const p2 = movePlayer(p1, 10, 0); // p1 sigue intacto (Inmutabilidad)
