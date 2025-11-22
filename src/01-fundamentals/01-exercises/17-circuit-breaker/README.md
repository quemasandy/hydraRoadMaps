# Ejercicio 17: Circuit Breaker Pattern

## Problema
En microservicios, si un Servicio A llama a un Servicio B y este último está caído, el Servicio A puede quedarse esperando (timeout), consumiendo recursos y eventualmente cayendo también ("cascading failure").

## Solución: Circuit Breaker
Es como un fusible eléctrico. Tiene 3 estados:

1.  **CLOSED (Cerrado)**: Todo funciona bien. Las llamadas pasan. Si hay muchos fallos seguidos, el circuito se "abre".
2.  **OPEN (Abierto)**: El circuito corta la corriente. Las llamadas fallan inmediatamente sin intentar conectar con el servicio remoto (fail fast). Después de un tiempo, pasa a "Semi-Abierto".
3.  **HALF-OPEN (Semi-Abierto)**: Dejamos pasar *una* llamada de prueba.
    *   Si tiene éxito -> Volvemos a CLOSED (el servicio se recuperó).
    *   Si falla -> Volvemos a OPEN (sigue caído).

## Tu Tarea
Implementa la clase `CircuitBreaker` en `circuitBreaker.ts` para manejar estas transiciones.
