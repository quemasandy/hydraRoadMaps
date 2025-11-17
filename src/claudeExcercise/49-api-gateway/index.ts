/**
 * API GATEWAY PATTERN
 * Punto de entrada único para requests, enruta a microservicios
 *
 * Big Tech: AWS API Gateway, Kong, Netflix Zuul
 */

// Backend services
class UserService {
  async getUser(id: string) {
    return { id, name: 'Alice', email: 'alice@example.com' };
  }
}

class OrderService {
  async getOrders(userId: string) {
    return [{ id: 'ord_1', amount: 100 }, { id: 'ord_2', amount: 200 }];
  }
}

class PaymentService {
  async getPayments(userId: string) {
    return [{ id: 'pay_1', amount: 100, status: 'paid' }];
  }
}

// API GATEWAY (aggregates responses)
class APIGateway {
  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private paymentService: PaymentService
  ) {}

  // Single endpoint aggregates data from multiple services
  async getUserDashboard(userId: string) {
    console.log(`[Gateway] Fetching dashboard for user ${userId}...`);

    const [user, orders, payments] = await Promise.all([
      this.userService.getUser(userId),
      this.orderService.getOrders(userId),
      this.paymentService.getPayments(userId)
    ]);

    return { user, orders, payments };
  }

  // Route to specific service
  async getUser(userId: string) {
    return this.userService.getUser(userId);
  }
}

// Demo
console.log('='.repeat(60));
console.log('API GATEWAY - Microservices Aggregation');
console.log('='.repeat(60));

(async () => {
  const gateway = new APIGateway(new UserService(), new OrderService(), new PaymentService());

  const dashboard = await gateway.getUserDashboard('user_123');
  console.log('\nDashboard:', JSON.stringify(dashboard, null, 2));
})();

/**
 * PREGUNTAS:
 * 1. ¿API Gateway vs Backend for Frontend (BFF)?
 * 2. ¿API Gateway authentication/authorization?
 * 3. ¿Rate limiting en API Gateway?
 * 4. ¿API Gateway caching?
 * 5. ¿Gateway vs Service Mesh?
 * 6. ¿Response aggregation patterns?
 * 7. ¿API Gateway in AWS/Azure/GCP?
 * 8. ¿Gateway scalability?
 */

export { APIGateway };
