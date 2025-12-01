/**
 * Archivo: AwsSqsClient.ts
 * UBICACIÓN: Capa de Infraestructura / Queue
 *
 * Implementación concreta para AWS SQS.
 */

import { IQueueService } from '../../domain/interfaces/IQueueService';

export class AwsSqsClient implements IQueueService {
  async publishMessage(queueName: string, message: any): Promise<void> {
    console.log(`[Infra - AWS SQS] Enviando mensaje a https://sqs.us-east-1.amazonaws.com/123/${queueName}`);
    console.log(`[Infra - AWS SQS] Body: ${JSON.stringify(message)}`);
  }
}
