# Fundamentos para dominar patrones de diseño

Excelente — estás haciendo la pregunta que pocos programadores se detienen a hacer. La mayoría se lanza a leer patrones como si fueran recetas, sin haber aprendido primero los principios que los hacen funcionar. Si quieres dominar patrones de diseño de verdad —no memorizarlos, sino entender por qué existen—, necesitas construir una base de pensamiento orientado a objetos más principios de diseño sólidos. Eso es lo que hace que un patrón se sienta natural en tus manos.

Vamos a construir esa base en capas, como lo haría un arquitecto antes de levantar un edificio.

---

## Capa 1 · Mentalidad orientada a objetos (la gramática del diseño)

Antes de los patrones, necesitas entender cómo los objetos se relacionan y se comportan. Estos son los bloques fundacionales:

### 1. Abstracción

- Enfócate en lo que algo hace, no en cómo lo hace.
- Simplifica el mundo real en modelos conceptuales manejables.
- Ejemplo: una clase `Payment` expresa que “procesa pagos”; no importa si por debajo usa Lyra o PayU.

> Sin abstracción, los patrones se vuelven mecánicos.

### 2. Encapsulamiento

- Protege los datos internos y expone solo lo necesario.
- Los objetos se comunican mediante métodos, no accediendo a variables ajenas.
- Esto reduce la entropía: el cambio queda contenido.

> Sin encapsulamiento, cualquier cambio en una clase rompe a las demás.

### 3. Polimorfismo

- “Muchas formas, un mismo nombre.”
- Permite usar el mismo método en distintos objetos que se comportan diferente.
- Es el motor de muchos patrones (State, Strategy, Command…).

```typescript
interface Payment {
  process(): void;
}

class LyraPayment implements Payment {
  process() {
    // ...
  }
}

class PayUPayment implements Payment {
  process() {
    // ...
  }
}

function execute(payment: Payment) {
  payment.process();
}
```

> Sin polimorfismo, estarías condenado a usar `if` y `switch` para todo.

### 4. Herencia

- Reutiliza y especializa comportamiento existente.
- Permite que una clase derive de otra, extendiendo o modificando su comportamiento.
- Se usa en patrones como Template Method o Decorator, aunque en exceso aumenta el acoplamiento.

> La herencia es útil, pero la composición la reemplaza en sistemas modernos.

### 5. Composición

- Un objeto “tiene” otros objetos para delegarles trabajo.
- Ejemplo: un `Player` tiene un `State`.
- En lugar de heredar, combina objetos dinámicamente.

Herencia: “Soy un tipo de…”.  
Composición: “Tengo un…”.

> La composición es más flexible porque puedes cambiar los componentes en tiempo de ejecución.

### 6. Delegación

- Un objeto pasa una tarea a otro objeto especializado.
- Es la forma práctica de aplicar la composición.
- Ejemplo: `Player.clickPlay()` → `state.clickPlay()`. El contexto delega y no sabe cómo se hace.

> Delegación + composición = el corazón de casi todos los patrones.

---

## Capa 2 · Principios de diseño orientado a objetos (la ética del código)

Una vez que dominas los conceptos básicos, necesitas principios que te orienten sobre cuándo aplicar cada cosa. Los más importantes son los principios SOLID, enfocados de forma conceptual.

### 7. SRP — Principio de Responsabilidad Única

- Cada clase debe tener una sola razón para cambiar.
- Si acumula razones de cambio, acumula entropía.
- Es el alma de la mayoría de los patrones de comportamiento.

### 8. OCP — Principio de Abierto/Cerrado

- Abierto para extensión, cerrado para modificación.
- Si quieres agregar comportamiento nuevo, no modifiques código viejo: extiéndelo.
- State, Strategy, Decorator o Factory viven gracias a este principio.

### 9. LSP — Principio de Sustitución de Liskov

- Si `B` hereda de `A`, debe poder usarse donde `A` se espera, sin romper nada.
- Es la base de un polimorfismo sano.
- Evita herencias que violen el contrato.

### 10. ISP — Principio de Segregación de Interfaces

- Prefiere muchas interfaces pequeñas a una gigantesca.
- Permite que las clases dependan solo de lo que realmente usan.
- Potencia patrones que se apoyan en contratos (Command, Observer…).

### 11. DIP — Principio de Inversión de Dependencias

- Depende de abstracciones, no de implementaciones concretas.
- Los patrones de diseño son manifestaciones prácticas de este principio.
- Ejemplo: el `Context` depende de `State` (una interfaz), no de `ReadyState` o `PlayingState` directamente.

---

## Capa 3 · Pensamiento sistémico y arquitectónico

Para aplicar patrones con criterio, piensa también en este “meta-nivel” de la ingeniería:

### 12. Acoplamiento y cohesión

- Busca alta cohesión (cada clase hace una sola cosa) y bajo acoplamiento (las clases dependen poco entre sí).
- Patrones como Observer, Mediator o Facade existen para equilibrar estos factores.

### 13. Separación de responsabilidades

- Divide el código según qué hace, quién lo usa y qué cambia con el tiempo.
- Esta visión prepara el terreno para patrones estructurales (Bridge, Composite) y arquitecturas como MVC o CQRS.

### 14. Principio de diseño por composición

- “Prefiere composición sobre herencia.”
- Es la filosofía central de Head First Design Patterns y Refactoring Guru.
- Consiste en componer objetos especializados para lograr comportamientos complejos sin romper el encapsulamiento.

### 15. Inmutabilidad y estado controlado

- Los objetos deberían cambiar de estado de forma explícita y controlada.
- Es esencial en patrones como State, Memento o Command, donde el estado es protagonista.

---

## Panorama general

| Categoría       | Conceptos que debes dominar                                           | Qué te permiten                                 |
| --------------- | --------------------------------------------------------------------- | ------------------------------------------------ |
| OO básicos      | Abstracción, Encapsulamiento, Polimorfismo, Herencia, Composición, Delegación | Entender cómo los objetos cooperan              |
| Principios SOLID| SRP, OCP, LSP, ISP, DIP                                               | Diseñar para el cambio sin romper el código      |
| Arquitectura    | Acoplamiento, Cohesión, Separación de responsabilidades, Inmutabilidad | Controlar la entropía y escalar sistemas         |

---

## Ruta de estudio recomendada

1. Revisa los fundamentos OO con ejemplos simples (como `Shape`, `Car`, `Employee`).
2. Aprende a detectar cuándo una clase está haciendo demasiado y refactorízala.
3. Practica composición y delegación creando objetos que se ayudan entre sí.
4. Avanza a los patrones más conceptuales: Strategy, State, Observer, Decorator, Factory y Adapter.

Si dominas esos seis, el resto de los 23 patrones de GoF se sentirán naturales.

---

## ¿Quieres ir más allá?

¿Quieres que prepare una ruta de estudio progresiva (con ejercicios y mini proyectos) para consolidar cada principio en código real? Puedo armarte una secuencia práctica para que entres a los patrones con confianza.
