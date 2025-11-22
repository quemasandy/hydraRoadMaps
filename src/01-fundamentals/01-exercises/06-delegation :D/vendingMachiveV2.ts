export interface State {
  insertCoin(): void;
  selectProduct(): void;
}

export class NoCoinState implements State {
  constructor(private vendingMachine: VendingMachine) {
    this.vendingMachine = vendingMachine;
  }

  insertCoin(): void {
    console.log('Coin inserted.');
    this.vendingMachine.setState(new HasCoinState(this.vendingMachine));
  }

  selectProduct(): void {
    console.log('Please insert a coin first.');
  }
}

export class HasCoinState implements State {
  constructor(private vendingMachine: VendingMachine) {
    this.vendingMachine = vendingMachine;
  }

  insertCoin(): void {
    console.log('Already has a coin. Dispensing product.');
    this.selectProduct();
  }

  selectProduct(): void {
    console.log('Product dispensed. Thank you!');
    this.vendingMachine.setState(new NoCoinState(this.vendingMachine));
  }
}

export class VendingMachine {
  private state: State;

  constructor() {
    this.state = new NoCoinState(this);
  }

  setState(state: State) {
    this.state = state;
  }

  insertCoin() {
    this.state.insertCoin();
  }

  selectProduct() {
    this.state.selectProduct();
  }
}

const vendingMachine = new VendingMachine();

vendingMachine.selectProduct();
vendingMachine.selectProduct();

vendingMachine.insertCoin();

vendingMachine.selectProduct();
vendingMachine.selectProduct();

vendingMachine.insertCoin();
vendingMachine.insertCoin();

vendingMachine.selectProduct();
vendingMachine.selectProduct();
