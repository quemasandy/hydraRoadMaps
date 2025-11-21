
// ❌ BEFORE: The "God Class" Anti-pattern
// This class knows TOO MUCH. It handles business logic, low-level DB operations,
// 3rd party API integrations, and email formatting.
// Reading this requires loading the entire system context into your brain.

export class OrderService {
  async processOrder(orderId: string, userId: string, items: any[], paymentDetails: any) {
    // 1. Validate State (Business Logic?)
    if (!orderId || items.length === 0) {
      throw new Error('Invalid order');
    }

    // 2. Check Inventory (Database Logic?)
    // Imagine this is 50 lines of complex SQL or ORM logic mixed here
    const dbConnection = await this.getDbConnection();
    for (const item of items) {
      const stock = await dbConnection.query(`SELECT stock FROM products WHERE id = ${item.id}`);
      if (stock < item.qty) {
        throw new Error('Out of stock');
      }
    }

    // 3. Process Payment (External API Logic?)
    // Direct dependency on Stripe/PayPal SDKs
    const stripe = require('stripe')('sk_test_...');
    try {
      await stripe.charges.create({
        amount: items.reduce((acc, i) => acc + i.price, 0) * 100,
        currency: 'usd',
        source: paymentDetails.token,
      });
    } catch (e) {
      // Complex error handling for payments
      console.error('Payment failed', e);
      throw e;
    }

    // 4. Generate Shipping Label (Logistics Logic?)
    const shippingProvider = new ShippingProvider(); // Hard dependency
    const label = shippingProvider.createLabel({
      address: paymentDetails.address,
      weight: items.reduce((acc, i) => acc + i.weight, 0)
    });

    // 5. Send Email (Notification Logic?)
    // HTML generation mixed with logic
    const emailService = new EmailService();
    const html = `
      <h1>Order Confirmed</h1>
      <p>Your order ${orderId} is on its way!</p>
      <p>Tracking: ${label.trackingCode}</p>
    `;
    await emailService.send(userId, 'Order Confirmation', html);

    console.log('Order processed successfully');
  }

  private async getDbConnection() {
    // DB connection logic...
    return { query: async (q: string) => 100 };
  }
}

class ShippingProvider { createLabel(data: any) { return { trackingCode: '123' }; } }
class EmailService { async send(to: string, subject: string, body: string) {} }
