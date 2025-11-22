/**
 * MODERN TS: Polymorphism
 *
 * En OOP: Herencia, clases base, métodos virtuales.
 * En Modern TS: Discriminated Unions (Uniones Discriminadas).
 *
 * Es más seguro porque TypeScript te obliga a manejar todos los casos.
 */

type Circle = { kind: 'circle'; radius: number };
type Rect = { kind: 'rect'; width: number; height: number };
type Square = { kind: 'square'; side: number };

// La Unión (Polimorfismo)
type Shape = Circle | Rect | Square;

// Función polimórfica usando Pattern Matching (switch)
export const getArea = (shape: Shape): number => {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rect':
      return shape.width * shape.height;
    case 'square':
      return shape.side ** 2;
    // Si agregas una nueva figura y olvidas este case, TS dará error aquí (Exhaustiveness Check)
  }
};

const c: Circle = { kind: 'circle', radius: 5 };
console.log(getArea(c));
