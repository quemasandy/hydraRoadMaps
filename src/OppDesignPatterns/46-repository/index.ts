/**
 * REPOSITORY PATTERN
 * Abstrae el acceso a datos, proporcionando una interfaz tipo colección para dominio.
 *
 * Big Tech: Entity Framework, Spring Data, Sequelize ORM
 */

// Entity
interface Customer {
  id: string;
  name: string;
  email: string;
  tier: 'bronze' | 'silver' | 'gold';
}

// Repository interface
interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  save(customer: Customer): Promise<void>;
  delete(id: string): Promise<boolean>;
}

// In-memory implementation
class InMemoryCustomerRepository implements ICustomerRepository {
  private customers: Map<string, Customer> = new Map();

  async findById(id: string): Promise<Customer | null> {
    console.log(`[Repo] Finding customer ${id}...`);
    return this.customers.get(id) || null;
  }

  async findAll(): Promise<Customer[]> {
    console.log(`[Repo] Finding all customers...`);
    return Array.from(this.customers.values());
  }

  async save(customer: Customer): Promise<void> {
    console.log(`[Repo] Saving customer ${customer.id}...`);
    this.customers.set(customer.id, customer);
  }

  async delete(id: string): Promise<boolean> {
    console.log(`[Repo] Deleting customer ${id}...`);
    return this.customers.delete(id);
  }
}

// SQL implementation (simulated)
class SQLCustomerRepository implements ICustomerRepository {
  async findById(id: string): Promise<Customer | null> {
    console.log(`[SQL] SELECT * FROM customers WHERE id = '${id}'`);
    // Simulate DB query
    return null;
  }

  async findAll(): Promise<Customer[]> {
    console.log(`[SQL] SELECT * FROM customers`);
    return [];
  }

  async save(customer: Customer): Promise<void> {
    console.log(`[SQL] INSERT INTO customers VALUES ('${customer.id}', '${customer.name}', ...)`);
  }

  async delete(id: string): Promise<boolean> {
    console.log(`[SQL] DELETE FROM customers WHERE id = '${id}'`);
    return true;
  }
}

// Service using repository (business logic)
class CustomerService {
  constructor(private repository: ICustomerRepository) {}

  async createCustomer(name: string, email: string): Promise<Customer> {
    const customer: Customer = {
      id: `cus_${Date.now()}`,
      name,
      email,
      tier: 'bronze'
    };

    await this.repository.save(customer);
    console.log(`✅ Customer ${customer.id} created`);

    return customer;
  }

  async upgradeCustomer(id: string, tier: Customer['tier']): Promise<void> {
    const customer = await this.repository.findById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    customer.tier = tier;
    await this.repository.save(customer);
    console.log(`✅ Customer ${id} upgraded to ${tier}`);
  }

  async listAllCustomers(): Promise<void> {
    const customers = await this.repository.findAll();
    console.log(`\n--- Customers (${customers.length}) ---`);
    customers.forEach(c => console.log(`${c.id} | ${c.name} | ${c.tier}`));
  }
}

// Demo
console.log('='.repeat(60));
console.log('REPOSITORY PATTERN - Customer Data Access');
console.log('='.repeat(60));

(async () => {
  // Use in-memory repository
  const inMemoryRepo = new InMemoryCustomerRepository();
  const service = new CustomerService(inMemoryRepo);

  await service.createCustomer('Alice', 'alice@example.com');
  await service.createCustomer('Bob', 'bob@example.com');
  await service.listAllCustomers();

  // Switch to SQL repository (same interface)
  console.log('\n--- Switching to SQL Repository ---');
  const sqlRepo = new SQLCustomerRepository();
  const sqlService = new CustomerService(sqlRepo);
  await sqlService.createCustomer('Charlie', 'charlie@example.com');
})();

/**
 * PREGUNTAS:
 * 1. ¿Repository vs DAO pattern?
 * 2. ¿Generic repository vs specific repositories?
 * 3. ¿Unit of Work pattern con Repository?
 * 4. ¿Repository + specification pattern?
 * 5. ¿Testing con repository pattern?
 * 6. ¿Repository en DDD?
 * 7. ¿CQRS + Repository?
 * 8. ¿Repository abstraction leaks?
 */

export { ICustomerRepository, CustomerService };
