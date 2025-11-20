# Ejercicio 18: Teoría de Máquinas de Estados

## ¿Por qué dibujar?
Antes de escribir código, es vital entender el flujo. Los diagramas de estados evitan bugs lógicos complejos.

## Notación Básica
-   **Círculo**: Un Estado (ej. "Pagado").
-   **Flecha**: Una Transición provocada por un Evento.
-   **Círculo Doble**: Estado Final (donde termina el proceso).

## Ejemplo: Proceso de Compra

```
[ CARRITO ] --(checkout)--> [ PAGO ] --(éxito)--> [ ENVIADO ]
     ^                         |
     |                         | (fallo)
     +--------(reintentar)-----+
```

## Tu Tarea (Mental o en Papel)
En el archivo `exercise.ts`, encontrarás un escenario. Tu trabajo es dibujar (en papel o ASCII art en el código) los estados y flechas necesarios.
