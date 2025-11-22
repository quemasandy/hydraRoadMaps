# Ejercicio 19: Discriminated Unions

## La forma moderna de "State" en TypeScript

En lugar de crear clases para cada estado (`class LoadingState`, `class ErrorState`), TypeScript nos permite usar **Tipos Algebraicos de Datos (ADTs)**.

Esto se llama "Discriminated Union" porque cada tipo en la unión tiene una propiedad común (el "discriminante", usualmente `kind` o `status`) que nos permite saber cuál es.

### Ventajas
1.  **Menos código**: No hay clases, `this`, ni herencia.
2.  **Type Safety**: TypeScript sabe exactamente qué propiedades existen en cada estado.
3.  **Inmutabilidad**: Fomenta un estilo funcional (Redux, React useReducer).

## Ejemplo
Ver `requestState.ts` para una implementación de estados de carga de datos.
