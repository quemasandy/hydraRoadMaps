/**
 * Event-Driven Architecture Pattern
 *
 * Arquitectura basada en eventos usando EventBridge, SNS, SQS
 * Ejemplo: Sistema de pedidos e-commerce
 */

import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const eventBridgeClient = new EventBridgeClient({});
const snsClient = new SNSClient({});
const sqsClient = new SQSClient({});

// ============================================================================
// Domain Events
// ============================================================================

interface OrderCreatedEvent {
  orderId: string;
  customerId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  totalAmount: number;
  timestamp: string;
}

interface OrderPaidEvent {
  orderId: string;
  paymentId: string;
  amount: number;
  timestamp: string;
}

interface OrderShippedEvent {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  timestamp: string;
}

/**
 * ============================================================================
 * EventBridge - Custom Event Bus
 * ============================================================================
 * Publish domain events to EventBridge
 */

export async function publishOrderCreatedEvent(
  event: OrderCreatedEvent,
): Promise<void> {
  const command = new PutEventsCommand({
    Entries: [
      {
        Source: 'com.ecommerce.orders',
        DetailType: 'OrderCreated',
        Detail: JSON.stringify(event),
        EventBusName: process.env.EVENT_BUS_NAME || 'default',
      },
    ],
  });

  const response = await eventBridgeClient.send(command);

  if (response.FailedEntryCount && response.FailedEntryCount > 0) {
    throw new Error('Failed to publish event');
  }

  console.log('Event published:', event.orderId);
}

/**
 * ============================================================================
 * Event Handlers
 * ============================================================================
 */

// Handler 1: Send confirmation email
export async function handleOrderCreated_SendEmail(event: OrderCreatedEvent) {
  console.log('Sending order confirmation email...');
  // Send email using SES
  // await sesClient.send(new SendEmailCommand({...}));
}

// Handler 2: Reserve inventory
export async function handleOrderCreated_ReserveInventory(event: OrderCreatedEvent) {
  console.log('Reserving inventory...');
  // Update inventory in DynamoDB
  for (const item of event.items) {
    // await decrementStock(item.productId, item.quantity);
  }
}

// Handler 3: Create payment intent
export async function handleOrderCreated_CreatePayment(event: OrderCreatedEvent) {
  console.log('Creating payment intent...');
  // Call payment gateway API
  // const paymentIntent = await stripe.paymentIntents.create({...});
}

/**
 * ============================================================================
 * Saga Pattern with EventBridge
 * ============================================================================
 * Coordinar transacciones distribuidas con compensación
 */

export async function orderSagaOrchestrator(orderId: string) {
  try {
    // Step 1: Reserve inventory
    await publishEvent('InventoryReservationRequested', { orderId });

    // Step 2: Process payment
    await publishEvent('PaymentProcessingRequested', { orderId });

    // Step 3: Schedule shipping
    await publishEvent('ShippingScheduleRequested', { orderId });

    // Success
    await publishEvent('OrderCompleted', { orderId });
  } catch (error) {
    // Rollback/Compensate
    await publishEvent('OrderCancellationRequested', { orderId });
  }
}

async function publishEvent(eventType: string, detail: any) {
  await eventBridgeClient.send(
    new PutEventsCommand({
      Entries: [
        {
          Source: 'com.ecommerce.orders',
          DetailType: eventType,
          Detail: JSON.stringify(detail),
        },
      ],
    }),
  );
}

/**
 * ============================================================================
 * Fan-out Pattern with SNS
 * ============================================================================
 * Un evento notifica a múltiples subscribers
 */

export async function notifyOrderStatusChange(orderId: string, status: string) {
  const command = new PublishCommand({
    TopicArn: process.env.ORDER_UPDATES_TOPIC_ARN,
    Message: JSON.stringify({
      orderId,
      status,
      timestamp: new Date().toISOString(),
    }),
    Subject: `Order ${orderId} - Status Update`,
    // Message attributes para filtros
    MessageAttributes: {
      orderStatus: {
        DataType: 'String',
        StringValue: status,
      },
    },
  });

  await snsClient.send(command);
}

/**
 * ============================================================================
 * Queue-based Processing (SQS)
 * ============================================================================
 */

export async function enqueueOrderForProcessing(order: OrderCreatedEvent) {
  const command = new SendMessageCommand({
    QueueUrl: process.env.ORDERS_QUEUE_URL,
    MessageBody: JSON.stringify(order),
    // Delay delivery
    DelaySeconds: 0,
    // Message attributes
    MessageAttributes: {
      priority: {
        DataType: 'String',
        StringValue: order.totalAmount > 1000 ? 'high' : 'normal',
      },
    },
  });

  await sqsClient.send(command);
}
