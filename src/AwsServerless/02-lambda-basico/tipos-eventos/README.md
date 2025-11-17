# Tipos de Eventos Lambda

## 📚 Resumen

Lambda puede ser invocada por múltiples servicios AWS. Cada servicio envía un formato de evento diferente.

## 🎯 Event Sources Principales

### 1. **API Gateway** (HTTP)
- **Uso**: APIs REST/HTTP
- **Tipo de evento**: `APIGatewayProxyEvent`
- **Casos comunes**: CRUD APIs, webhooks

### 2. **S3** (Object Storage)
- **Uso**: Procesamiento de archivos
- **Tipo de evento**: `S3Event`
- **Casos comunes**: Image processing, ETL, file validation

### 3. **DynamoDB Streams**
- **Uso**: Reaccionar a cambios en tabla
- **Tipo de evento**: `DynamoDBStreamEvent`
- **Casos comunes**: Auditoría, replicación, notificaciones

### 4. **SQS** (Message Queue)
- **Uso**: Procesamiento asíncrono
- **Tipo de evento**: `SQSEvent`
- **Casos comunes**: Background jobs, decoupling services

### 5. **SNS** (Pub/Sub)
- **Uso**: Fan-out de mensajes
- **Tipo de evento**: `SNSEvent`
- **Casos comunes**: Notificaciones, event broadcasting

### 6. **EventBridge** (Event Bus)
- **Uso**: Event-driven architecture
- **Tipo de evento**: `EventBridgeEvent<DetailType, Detail>`
- **Casos comunes**: Microservices communication

### 7. **Scheduled Events** (Cron)
- **Uso**: Tareas programadas
- **Tipo de evento**: `ScheduledEvent`
- **Casos comunes**: Cleanup jobs, reporting

### 8. **Cognito Triggers**
- **Uso**: Custom auth flows
- **Tipo de evento**: `CognitoUserPoolTriggerEvent`
- **Casos comunes**: Pre-signup validation, post-auth actions

### 9. **ALB** (Application Load Balancer)
- **Uso**: HTTP routing con ALB
- **Tipo de evento**: `ALBEvent`
- **Casos comunes**: Microservices con ALB

### 10. **CloudWatch Logs**
- **Uso**: Procesamiento de logs
- **Tipo de evento**: `CloudWatchLogsEvent`
- **Casos comunes**: Log aggregation, alerting

## 📊 Comparación

| Event Source | Sync/Async | Retries | Max Batch | Use Case |
|-------------|------------|---------|-----------|----------|
| API Gateway | Sync | No | 1 | HTTP APIs |
| S3 | Async | Yes | 1 | File processing |
| DynamoDB Streams | Async | Yes | 10,000 | Change tracking |
| SQS | Async | Yes* | 10 | Background jobs |
| SNS | Async | Yes | 1 | Notifications |
| EventBridge | Async | Yes | 1 | Events |
| Scheduled | Async | No | 1 | Cron jobs |

*SQS: Los mensajes permanecen en la queue si Lambda falla

## 🎓 Ejercicios por Tipo

Ver archivos individuales para ejemplos detallados:
- `01-api-gateway-event.ts` - HTTP APIs
- `02-s3-event.ts` - Procesamiento de archivos
- `03-dynamodb-stream-event.ts` - Change tracking
- `04-sqs-event.ts` - Queue processing
- `05-sns-event.ts` - Pub/Sub
- `06-eventbridge-event.ts` - Event bus
- `07-scheduled-event.ts` - Cron jobs

## 💡 Best Practices

1. **Validar el evento siempre** - Los eventos pueden variar
2. **Idempotencia** - Manejar invocaciones duplicadas
3. **Error handling** - Diferentes sources tienen diferentes retry policies
4. **Batch processing** - Procesar en lotes cuando sea posible
5. **Partial failures** - Reportar qué items fallaron (SQS, Kinesis)
6. **Timeouts apropiados** - Según el tipo de procesamiento
7. **Dead Letter Queues** - Para eventos fallidos

## 🔍 Testing Local

```bash
# Crear un evento de ejemplo
sam local generate-event apigateway aws-proxy > event.json

# Invocar con el evento
sam local invoke MyFunction -e event.json

# Eventos disponibles:
sam local generate-event s3 put
sam local generate-event dynamodb update
sam local generate-event sqs receive-message
sam local generate-event sns notification
sam local generate-event cloudwatch scheduled-event
```

## 📖 Recursos

- [AWS Lambda Event Sources](https://docs.aws.amazon.com/lambda/latest/dg/lambda-services.html)
- [@types/aws-lambda](https://www.npmjs.com/package/@types/aws-lambda) - Tipos TypeScript
- [Lambda Event Source Mappings](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html)
