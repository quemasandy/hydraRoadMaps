# Modern TypeScript: El Enfoque Funcional

En esta carpeta exploramos cómo escribir TypeScript moderno, influenciado por lenguajes como Rust, Haskell y librerías como React.

## Principios Clave

1.  **Data > Objects**: Separamos los datos (interfaces/types) del comportamiento (funciones). No unimos ambos en clases.
2.  **Discriminated Unions**: En lugar de herencia y polimorfismo de clases, usamos uniones de tipos etiquetados.
3.  **Immutability**: Los objetos no cambian. Las funciones reciben datos y devuelven *nuevos* datos.
4.  **Composition**: Construimos lógica combinando funciones pequeñas, no heredando clases gigantes.

## Comparación Rápida

| OOP (Clásico) | Modern TS (Funcional) |
| :--- | :--- |
| `class Dog extends Animal` | `type Dog = { kind: 'dog' }` |
| `dog.bark()` | `bark(dog)` |
| `instanceof Dog` | `animal.kind === 'dog'` |
| `this.state = newState` | `const newState = update(state)` |
