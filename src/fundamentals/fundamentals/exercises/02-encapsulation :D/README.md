# Encapsulamiento · Ejercicio

**Objetivo:** proteger el estado interno de un objeto y exponer solo operaciones seguras.

## Escenario
Un `BankAccount` debe permitir depósitos y retiros controlados. Nadie puede modificar el saldo directamente ni dejar la cuenta en negativo.

## Instrucciones
1. Declara una clase `BankAccount` con un campo privado `balance` iniciado en 0.
2. Expone métodos `deposit(amount: number)` y `withdraw(amount: number)` que validen las operaciones.
3. Agrega un método de solo lectura `getBalance()`.
4. Simula el uso creando una cuenta y ejecutando una secuencia de depósitos/retiros.
5. Verifica que intentar `account.balance = 999` falle en TypeScript.

```typescript
class BankAccount {
  constructor(private balance = 0) {}

  deposit(amount: number) {
    if (amount <= 0) throw new Error("Monto inválido");
    this.balance += amount;
  }

  withdraw(amount: number) {
    if (amount <= 0) throw new Error("Monto inválido");
    if (amount > this.balance) throw new Error("Fondos insuficientes");
    this.balance -= amount;
  }

  getBalance() {
    return this.balance;
  }
}

const account = new BankAccount();
account.deposit(100);
account.withdraw(40);
console.log(account.getBalance()); // 60
```

## Resultado esperado
- El saldo solo cambia a través de métodos que aplican reglas de negocio.
- El consumidor de `BankAccount` no conoce ni altera el detalle de almacenamiento.
- La entropía disminuye porque un cambio en la implementación no rompe a los clientes.
