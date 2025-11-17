/**
 * MVC PATTERN (Model-View-Controller)
 * Separa la aplicación en tres componentes: Model (datos), View (UI), Controller (lógica).
 *
 * Big Tech: Ruby on Rails, ASP.NET MVC, Spring MVC, Angular (adaptado)
 */

// MODEL: Business logic and data
class Invoice {
  constructor(
    public id: string,
    public amount: number,
    public customerId: string,
    public status: 'draft' | 'sent' | 'paid' = 'draft'
  ) {}

  markAsPaid(): void {
    this.status = 'paid';
  }

  markAsSent(): void {
    this.status = 'sent';
  }
}

class InvoiceModel {
  private invoices: Invoice[] = [];

  addInvoice(invoice: Invoice): void {
    this.invoices.push(invoice);
  }

  getInvoice(id: string): Invoice | undefined {
    return this.invoices.find(inv => inv.id === id);
  }

  getAllInvoices(): Invoice[] {
    return [...this.invoices];
  }

  updateInvoiceStatus(id: string, status: Invoice['status']): boolean {
    const invoice = this.getInvoice(id);
    if (invoice) {
      invoice.status = status;
      return true;
    }
    return false;
  }

  deleteInvoice(id: string): boolean {
    const index = this.invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
      this.invoices.splice(index, 1);
      return true;
    }
    return false;
  }
}

// VIEW: Presentation layer (renders data)
class InvoiceView {
  displayInvoice(invoice: Invoice): void {
    console.log('\n--- Invoice Details ---');
    console.log(`ID: ${invoice.id}`);
    console.log(`Customer: ${invoice.customerId}`);
    console.log(`Amount: $${invoice.amount}`);
    console.log(`Status: ${invoice.status.toUpperCase()}`);
    console.log('---\n');
  }

  displayInvoiceList(invoices: Invoice[]): void {
    console.log('\n=== Invoice List ===');
    if (invoices.length === 0) {
      console.log('(No invoices)');
    } else {
      invoices.forEach(inv => {
        console.log(`${inv.id} | $${inv.amount} | ${inv.status} | ${inv.customerId}`);
      });
    }
    console.log('===================\n');
  }

  displaySuccess(message: string): void {
    console.log(`✅ ${message}`);
  }

  displayError(message: string): void {
    console.log(`❌ ${message}`);
  }
}

// CONTROLLER: Handles user input and updates Model/View
class InvoiceController {
  constructor(private model: InvoiceModel, private view: InvoiceView) {}

  createInvoice(id: string, amount: number, customerId: string): void {
    console.log(`[Controller] Creating invoice ${id}...`);

    const invoice = new Invoice(id, amount, customerId);
    this.model.addInvoice(invoice);

    this.view.displaySuccess(`Invoice ${id} created`);
    this.view.displayInvoice(invoice);
  }

  viewInvoice(id: string): void {
    console.log(`[Controller] Fetching invoice ${id}...`);

    const invoice = this.model.getInvoice(id);
    if (invoice) {
      this.view.displayInvoice(invoice);
    } else {
      this.view.displayError(`Invoice ${id} not found`);
    }
  }

  listInvoices(): void {
    console.log(`[Controller] Fetching all invoices...`);

    const invoices = this.model.getAllInvoices();
    this.view.displayInvoiceList(invoices);
  }

  markInvoiceAsSent(id: string): void {
    console.log(`[Controller] Marking invoice ${id} as sent...`);

    const success = this.model.updateInvoiceStatus(id, 'sent');
    if (success) {
      this.view.displaySuccess(`Invoice ${id} marked as sent`);
      this.viewInvoice(id);
    } else {
      this.view.displayError(`Failed to update invoice ${id}`);
    }
  }

  markInvoiceAsPaid(id: string): void {
    console.log(`[Controller] Processing payment for invoice ${id}...`);

    const success = this.model.updateInvoiceStatus(id, 'paid');
    if (success) {
      this.view.displaySuccess(`Invoice ${id} marked as paid`);
      this.viewInvoice(id);
    } else {
      this.view.displayError(`Failed to update invoice ${id}`);
    }
  }

  deleteInvoice(id: string): void {
    console.log(`[Controller] Deleting invoice ${id}...`);

    const success = this.model.deleteInvoice(id);
    if (success) {
      this.view.displaySuccess(`Invoice ${id} deleted`);
    } else {
      this.view.displayError(`Invoice ${id} not found`);
    }
  }
}

// Demo
console.log('='.repeat(60));
console.log('MVC PATTERN - Invoice Management System');
console.log('='.repeat(60));

// Initialize MVC components
const model = new InvoiceModel();
const view = new InvoiceView();
const controller = new InvoiceController(model, view);

// User actions (simulated)
controller.createInvoice('INV-001', 1000, 'CUS-A');
controller.createInvoice('INV-002', 1500, 'CUS-B');
controller.createInvoice('INV-003', 2000, 'CUS-A');

controller.listInvoices();

controller.markInvoiceAsSent('INV-001');
controller.markInvoiceAsPaid('INV-001');

controller.viewInvoice('INV-999'); // Not found

controller.deleteInvoice('INV-003');
controller.listInvoices();

/**
 * Real-world: REST API with MVC
 */
console.log('\n' + '='.repeat(60));
console.log('REAL-WORLD: REST API with MVC (Express-like)');
console.log('='.repeat(60));

// Simulated HTTP Request/Response
interface Request {
  params: Record<string, string>;
  body: any;
}

interface Response {
  json(data: any): void;
  status(code: number): Response;
  send(message: string): void;
}

// Model
class UserModel {
  private users = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' }
  ];

  findAll() {
    return this.users;
  }

  findById(id: string) {
    return this.users.find(u => u.id === id);
  }

  create(user: { name: string; email: string }) {
    const newUser = { id: String(this.users.length + 1), ...user };
    this.users.push(newUser);
    return newUser;
  }
}

// Controller (handles HTTP requests)
class UserController {
  constructor(private model: UserModel) {}

  // GET /users
  getAll(req: Request, res: Response): void {
    console.log('[Controller] GET /users');
    const users = this.model.findAll();
    res.json({ users });
  }

  // GET /users/:id
  getById(req: Request, res: Response): void {
    console.log(`[Controller] GET /users/${req.params.id}`);
    const user = this.model.findById(req.params.id);

    if (user) {
      res.json({ user });
    } else {
      res.status(404).send('User not found');
    }
  }

  // POST /users
  create(req: Request, res: Response): void {
    console.log('[Controller] POST /users');
    const user = this.model.create(req.body);
    res.status(201).json({ user });
  }
}

// Simulated responses
const mockResponse = (): Response => ({
  json: (data) => console.log(`  Response: ${JSON.stringify(data)}`),
  status: (code) => {
    console.log(`  Status: ${code}`);
    return mockResponse();
  },
  send: (msg) => console.log(`  Response: ${msg}`)
});

const userModel = new UserModel();
const userController = new UserController(userModel);

// Simulate requests
userController.getAll({ params: {}, body: {} }, mockResponse());
userController.getById({ params: { id: '1' }, body: {} }, mockResponse());
userController.create({ params: {}, body: { name: 'Charlie', email: 'charlie@example.com' } }, mockResponse());
userController.getAll({ params: {}, body: {} }, mockResponse());

/**
 * PREGUNTAS:
 * 1. ¿MVC vs MVP vs MVVM differences?
 * 2. ¿Cuándo usar MVC en aplicaciones frontend modernas?
 * 3. ¿MVC en frameworks como Express.js vs Rails?
 * 4. ¿Fat models vs fat controllers?
 * 5. ¿Testing en MVC: unit tests por componente?
 * 6. ¿MVC con single-page applications (SPAs)?
 * 7. ¿Cómo Ruby on Rails implementa MVC?
 * 8. ¿MVC + REST API best practices?
 */

export { InvoiceModel, InvoiceView, InvoiceController };
