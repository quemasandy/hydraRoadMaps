# Polimorfismo · Ejercicio

**Objetivo:** reutilizar la misma interfaz para objetos que responden de forma distinta bajo un mismo mensaje.

## Escenario
Necesitas enviar notificaciones por distintos canales (email, SMS, push) sin usar condicionales gigantes.

## Instrucciones
1. Define una interfaz `Notifier` con un método `send(message: string): void`.
2. Implementa `EmailNotifier`, `SmsNotifier` y `PushNotifier`.
3. Crea una función `notifyAll(notifiers: Notifier[], message: string)` que invoque `send` sin preguntar quién es quién.
4. Agrega un nuevo canal (`SlackNotifier`) para demostrar que no necesitas tocar `notifyAll`.

```typescript
interface Notifier {
  send(message: string): void;
}

class EmailNotifier implements Notifier {
  send(message: string) {
    console.log(`Email → ${message}`);
  }
}

class SmsNotifier implements Notifier {
  send(message: string) {
    console.log(`SMS → ${message}`);
  }
}

function notifyAll(notifiers: Notifier[], message: string) {
  for (const notifier of notifiers) {
    notifier.send(message);
  }
}

notifyAll([
  new EmailNotifier(),
  new SmsNotifier(),
], "Lanzamiento habilitado");
```

## Resultado esperado
- `notifyAll` mantiene una firma estable mientras varían las implementaciones.
- Agregar comportamientos específicos se resuelve creando nuevas clases, no modificando código existente.
- La lógica condicional se reemplaza por polimorfismo explícito.
