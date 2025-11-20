interface State {
  selectProduct(vendingMachine: VendingMachine): void;
}

class NoCoin implements State {
  selectProduct(): void {
    console.log('No coin inserted. Please insert a coin.');
  }
}

class HasCoin implements State {
  selectProduct(vendingMachine: VendingMachine): void {
    console.log('Product dispensed. Thank you!');
    vendingMachine.setState(new NoCoin());
  }
}

class VendingMachine {
  constructor(private state: State) {}

  setState(state: State) {
    this.state = state;
  }

  selectProduct() {
    this.state.selectProduct(this);
  }
}

const vendingMachine = new VendingMachine(new NoCoin());
vendingMachine.selectProduct();
vendingMachine.selectProduct();
vendingMachine.selectProduct();

vendingMachine.setState(new HasCoin());

vendingMachine.selectProduct();
vendingMachine.selectProduct();

export {};
