/**
 * MODERN TS: Liskov Substitution Principle (LSP)
 *
 * En OOP: Las subclases deben ser sustituibles por sus clases base.
 * En Modern TS: Structural Typing (Duck Typing).
 *
 * Si tiene forma de pato y camina como pato, es un pato. No necesitamos `implements`.
 */

type Bird = { fly: () => void };

const makeBirdFly = (bird: Bird) => bird.fly();

// Objetos que cumplen la estructura (contrato implícito)
const duck = {
  fly: () => console.log('Duck flying'),
  quack: () => console.log('Quack'), // Extra props ok
};

const drone = {
  fly: () => console.log('Drone flying'),
  battery: 100,
};

makeBirdFly(duck);
makeBirdFly(drone); // Funciona aunque Drone no sea un "Pájaro" biológico

// Ostrich (Avestruz) no vuela, así que TS no nos deja pasarla si no cumple el tipo
// const ostrich = { run: () => console.log('Running') };
// makeBirdFly(ostrich); // Error: Property 'fly' is missing.
