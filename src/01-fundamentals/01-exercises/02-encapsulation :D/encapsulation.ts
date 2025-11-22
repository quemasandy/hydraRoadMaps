class BankAccount {
  constructor(private balance = 0) {
    this.balance = balance;
  }

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
console.log('account:', typeof account)
console.log('account:', account)

account.deposit(100);
console.log('account:', account)

account.withdraw(40);

console.log('account:', account)

console.log(account.getBalance())

// account.deposit(100);
// account.withdraw(40);
// console.log(account.getBalance()); // 60