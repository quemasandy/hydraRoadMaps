# Ejercicio 16: Introducción a XState

## ¿Qué es XState?

XState es una librería estándar en la industria para crear, interpretar y ejecutar máquinas de estados finitos y statecharts en JavaScript/TypeScript.

A diferencia de nuestro enfoque manual con clases (`State Pattern`), XState nos permite:
1.  **Visualizar** la lógica de nuestra aplicación (puedes copiar el código a [stately.ai/viz](https://stately.ai/viz)).
2.  **Prevenir** estados imposibles.
3.  **Manejar** efectos secundarios (acciones) y transiciones automáticas de forma declarativa.

## Conceptos Clave

-   **Machine**: La definición de todos los estados y transiciones posibles.
-   **State**: La situación actual del sistema (ej. 'idle', 'loading').
-   **Event**: La señal que causa una transición (ej. 'SUBMIT', 'RETRY').
-   **Context**: Datos extendidos (estado infinito) como formularios, contadores, etc.

## Tu Tarea

Revisa el archivo `trafficLight.ts`. Aunque no tenemos la librería instalada, el código muestra cómo se estructura una configuración de máquina de estados. Intenta entender el flujo leyendo el objeto JSON.
