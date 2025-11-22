
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

abstract class whatEverNotifier implements Notifier {
  send(message: string) {
    console.log(`What Ever → ${message}`);
  }
}

class whatEverNotifierSon extends whatEverNotifier {
  // Firmas de sobrecarga (overload signatures)
  send(message: string): void;
  send(message: string, recipient: string): void;
  send(message: string, recipient: string, priority: 'high' | 'low'): void;

  // Implementación (implementation signature)
  send(message: string, recipient?: string, priority?: 'high' | 'low'): void {
    let output = `What Ever Son :D → ${message}`;

    if (recipient) {
      output += ` | To: ${recipient}`;
    }

    if (priority) {
      output += ` | Priority: ${priority.toUpperCase()}`;
    }

    console.log(output);
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
  new whatEverNotifierSon()
], "Lanzamiento habilitado");

// Ejemplos de sobrecarga del método send
console.log('\n--- Ejemplos de sobrecarga ---');
const notifier = new whatEverNotifierSon();

// Sobrecarga 1: solo mensaje
notifier.send("Sistema iniciado");

// Sobrecarga 2: mensaje + destinatario
notifier.send("Nueva actualización disponible", "admin@example.com");

// Sobrecarga 3: mensaje + destinatario + prioridad
notifier.send("Error crítico detectado", "support@example.com", "high");
notifier.send("Mantenimiento programado", "users@example.com", "low");
