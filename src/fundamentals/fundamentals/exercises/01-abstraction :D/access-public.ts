/*
Ejercicio: public

Idea clave:
- public (por defecto) es accesible desde cualquier lugar.
*/

export class BankAccount {
  protected balance: number; // accesible desde fuera

  constructor(initial: number) {
    this.balance = initial;
  }

  public deposit(amount: number): void {
    this.balance += amount;
    console.log(`Depositado: ${amount}`);
  }
}

export function runPublicDemo(): void {
  const acc = new BankAccount(100);
  acc.deposit(50); // OK: método público
  console.log('Balance visible:', acc.balance); // OK: propiedad pública

  // Si quitas el "public" sigue siendo accesible, porque es el modificador por defecto.
}

// Ejecuta el ejemplo solo cuando este archivo es el punto de entrada.
declare const require: any | undefined;
declare const module: any | undefined;
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  runPublicDemo();
}

