/**
 * Archivo: RabbitMqClient.ts
 * UBICACIÓN: Capa de Infraestructura / Queue
 *
 * Implementación concreta para RabbitMQ (u otro cloud).
 */

import { IQueueService } from '../../domain/interfaces/IQueueService';

export class RabbitMqClient implements IQueueService {
  async publishMessage(queueName: string, message: any): Promise<void> {
    console.log(`[Infra - RabbitMQ] Publicando en exchange 'events', routingKey '${queueName}'`);
    console.log(`[Infra - RabbitMQ] Payload: ${JSON.stringify(message)}`);
  }
}
