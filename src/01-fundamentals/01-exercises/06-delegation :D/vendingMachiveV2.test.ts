import { VendingMachine, NoCoinState, HasCoinState } from './vendingMachiveV2';

describe('VendingMachine', () => {
  let vendingMachine: VendingMachine;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    vendingMachine = new VendingMachine();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should initialize in NoCoinState', () => {
    // Accessing private state for testing purposes (casting to any)
    expect((vendingMachine as any).state).toBeInstanceOf(NoCoinState);
  });

  describe('NoCoinState', () => {
    it('should log message when selecting product without coin', () => {
      vendingMachine.selectProduct();
      expect(consoleSpy).toHaveBeenCalledWith('Please insert a coin first.');
      expect((vendingMachine as any).state).toBeInstanceOf(NoCoinState);
    });

    it('should transition to HasCoinState when coin is inserted', () => {
      vendingMachine.insertCoin();
      expect(consoleSpy).toHaveBeenCalledWith('Coin inserted.');
      expect((vendingMachine as any).state).toBeInstanceOf(HasCoinState);
    });
  });

  describe('HasCoinState', () => {
    beforeEach(() => {
      // Transition to HasCoinState
      vendingMachine.insertCoin();
      consoleSpy.mockClear(); // Clear logs from setup
    });

    it('should dispense product and transition to NoCoinState when product is selected', () => {
      vendingMachine.selectProduct();
      expect(consoleSpy).toHaveBeenCalledWith('Product dispensed. Thank you!');
      expect((vendingMachine as any).state).toBeInstanceOf(NoCoinState);
    });

    it('should reject second coin, dispense product, and transition to NoCoinState', () => {
      vendingMachine.insertCoin();
      expect(consoleSpy).toHaveBeenCalledWith('Already has a coin. Dispensing product.');
      // It calls selectProduct internally
      expect(consoleSpy).toHaveBeenCalledWith('Product dispensed. Thank you!');
      expect((vendingMachine as any).state).toBeInstanceOf(NoCoinState);
    });
  });

  describe('Full Workflow', () => {
    it('should handle a full cycle of operations', () => {
      // Start
      expect((vendingMachine as any).state).toBeInstanceOf(NoCoinState);

      // Insert Coin
      vendingMachine.insertCoin();
      expect((vendingMachine as any).state).toBeInstanceOf(HasCoinState);

      // Select Product
      vendingMachine.selectProduct();
      expect((vendingMachine as any).state).toBeInstanceOf(NoCoinState);

      // Select Product again (fail)
      vendingMachine.selectProduct();
      expect(consoleSpy).toHaveBeenLastCalledWith('Please insert a coin first.');
    });
  });
});
