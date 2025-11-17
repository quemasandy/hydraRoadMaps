# Herencia · Ejercicio

**Objetivo:** reutilizar comportamiento común creando una jerarquía simple.

## Escenario
Un sistema de alertas tiene comportamientos compartidos (registrar la hora, mensaje base) y especializaciones según el canal.

## Instrucciones
1. Crea una clase base `Alert` con constructor `(public message: string)` y un método `log()` que imprima la hora y el mensaje.
2. Hereda `EmailAlert` y `SmsAlert` añadiendo un método `send()` específico.
3. Reutiliza `log()` desde las subclases para evitar duplicidad.
4. Muestra cómo un tercer canal (`PushAlert`) puede extender la base sin modificarla.

```typescript
class Alert {
  constructor(public message: string) {}

  log() {
    console.log(`[${new Date().toISOString()}] ${this.message}`);
  }
}

class EmailAlert extends Alert {
  send() {
    this.log();
    console.log("Enviando email");
  }
}

class SmsAlert extends Alert {
  send() {
    this.log();
    console.log("Enviando SMS");
  }
}

new EmailAlert("Servidor caído").send();
```

## Resultado esperado
- El comportamiento compartido vive en `Alert` y se hereda sin duplicación.
- Cada subclase agrega o modifica solo lo necesario.
- Observa cómo un mal uso de herencia (sobre-escrituras que rompen) sería un olor para migrar a composición.
