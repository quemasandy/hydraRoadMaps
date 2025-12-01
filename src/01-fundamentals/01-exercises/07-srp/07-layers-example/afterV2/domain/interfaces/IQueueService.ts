/**
 * Archivo: IQueueService.ts
 * UBICACIÓN: Capa de Dominio / Interfaces (Puertos)
 *
 * Contrato para enviar mensajes a colas.
 * El dominio no sabe si se usa AWS SQS, RabbitMQ o Kafka.
 */

export interface IQueueService {
  publishMessage(queueName: string, message: any): Promise<void>;
}
