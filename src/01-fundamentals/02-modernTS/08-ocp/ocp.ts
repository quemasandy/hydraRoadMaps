/**
 * MODERN TS: Open/Closed Principle (OCP)
 *
 * En OOP: "Abierto a extensión, cerrado a modificación" (usando herencia/interfaces).
 * En Modern TS: Inyección de Funciones (Function Injection) o Configuración.
 *
 * Podemos cambiar el comportamiento pasando una función diferente, sin tocar el código original.
 */

// El código "Cerrado" (Core logic)
const filterItems = <T>(items: T[], predicate: (item: T) => boolean): T[] => {
  return items.filter(predicate);
};

// Extensiones (Nuevos filtros) sin tocar `filterItems`
const numbers = [1, 2, 3, 4, 5, 6];

const isEven = (n: number) => n % 2 === 0;
const isBig = (n: number) => n > 4;

console.log(filterItems(numbers, isEven)); // [2, 4, 6]
console.log(filterItems(numbers, isBig)); // [5, 6]
