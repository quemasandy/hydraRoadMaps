# 📑 Índice Completo - AWS Serverless con TypeScript

## 🎯 Inicio Rápido
- [README Principal](./README.md) - Roadmap completo de aprendizaje
- [Quick Start Guide](./QUICK_START.md) - Guía de inicio rápido

## 📚 Contenido por Nivel

### Nivel 1: Fundamentos
**Ubicación:** `01-fundamentos/`

#### Conceptos Serverless
- `conceptos-serverless/README.md` - ¿Qué es serverless? Ventajas, desventajas, casos de uso

#### TypeScript para Serverless
- `typescript-serverless/01-tipos-aws-lambda.ts` - Tipos para eventos Lambda
- `typescript-serverless/02-aws-sdk-v3.ts` - AWS SDK v3 con TypeScript

#### Infraestructura como Código (IaC)
- `iac-basics/01-sam-template.yaml` - AWS SAM template completo
- `iac-basics/02-serverless-framework.yml` - Serverless Framework config
- `iac-basics/03-cdk-stack.ts` - AWS CDK stack en TypeScript

---

### Nivel 2: Lambda Básico
**Ubicación:** `02-lambda-basico/`

#### Anatomía de Lambda
- `anatomia-lambda/01-hello-world.ts` - Función Lambda básica
  - Handler signature
  - Event y Context
  - Variables de entorno
  - Manejo de errores
  - Timeout awareness
  - Cold start optimization
  - Structured logging

#### Tipos de Eventos
- `tipos-eventos/README.md` - Resumen de todos los event sources
- `tipos-eventos/01-api-gateway-event.ts` - HTTP APIs
- `tipos-eventos/02-s3-event.ts` - Procesamiento de archivos
- `tipos-eventos/03-dynamodb-stream-event.ts` - Change tracking
- `tipos-eventos/04-sqs-event.ts` - Queue processing
- `tipos-eventos/05-sns-event.ts` - Pub/Sub
- `tipos-eventos/06-eventbridge-event.ts` - Event bus
- `tipos-eventos/07-scheduled-event.ts` - Cron jobs

#### Desarrollo Local
- `desarrollo-local/README.md` - SAM Local, Serverless Offline, LocalStack
- `desarrollo-local/testing-lambda.test.ts` - Unit tests con Jest

#### Optimización
- `optimizacion/README.md` - Performance, bundle size, provisioned concurrency

---

### Nivel 3: API Gateway y DynamoDB
**Ubicación:** `03-api-dynamodb/`

#### API Gateway
- `api-gateway/01-rest-api-crud.ts` - REST API CRUD completo
  - GET, POST, PUT, DELETE
  - Validación de inputs
  - Paginación y filtros
  - Error handling
  - Response helpers

- `api-gateway/02-authorization.ts` - Autenticación y autorización
  - Lambda Authorizers
  - Cognito integration
  - API Keys

- `api-gateway/03-validation.ts` - Request/Response validation
  - JSON Schema
  - Custom validators

#### DynamoDB Básico
- `dynamodb-basico/01-crud-operations.ts` - Operaciones CRUD
  - PutItem, GetItem, UpdateItem, DeleteItem
  - Query vs Scan
  - Batch operations
  - Conditional writes

- `dynamodb-basico/02-query-patterns.ts` - Patrones de consulta
  - Key condition expressions
  - Filter expressions
  - Projection expressions
  - Paginación

#### DynamoDB Avanzado
- `dynamodb-avanzado/01-gsi-lsi.ts` - Índices secundarios
  - Global Secondary Index (GSI)
  - Local Secondary Index (LSI)
  - Overloading GSI

- `dynamodb-avanzado/02-single-table-design.ts` - Single table design
  - Composite keys
  - Entity types
  - Access patterns

- `dynamodb-avanzado/03-transactions.ts` - Transacciones ACID
  - TransactWriteItems
  - TransactGetItems
  - Use cases

---

### Nivel 4: Servicios AWS Avanzados
**Ubicación:** `04-servicios-avanzados/`

#### Storage (S3)
- `storage-s3/01-s3-operations.ts` - Operaciones básicas
  - Upload, download, delete
  - Presigned URLs
  - Multipart upload

- `storage-s3/02-s3-events.ts` - S3 Events con Lambda
  - Image processing
  - File validation
  - ETL pipelines

#### Mensajería y Eventos
- `mensajeria-eventos/01-sqs.ts` - SQS queues
  - Standard vs FIFO
  - Dead Letter Queues
  - Batch processing

- `mensajeria-eventos/02-sns.ts` - SNS topics
  - Pub/Sub pattern
  - Fan-out
  - Message filtering

- `mensajeria-eventos/03-eventbridge.ts` - EventBridge
  - Custom event bus
  - Event patterns
  - Rules y targets

#### Autenticación (Cognito)
- `auth-cognito/01-user-pools.ts` - Cognito User Pools
  - Sign up, sign in
  - Custom attributes
  - Lambda triggers

- `auth-cognito/02-api-authorization.ts` - API con Cognito
  - JWT validation
  - Scopes y grupos

#### Observabilidad
- `observabilidad/01-cloudwatch-logs.ts` - CloudWatch Logs
  - Structured logging
  - Log Insights queries

- `observabilidad/02-cloudwatch-metrics.ts` - CloudWatch Metrics
  - Custom metrics
  - Dashboards
  - Alarms

- `observabilidad/03-xray.ts` - AWS X-Ray
  - Distributed tracing
  - Service map
  - Annotations

---

### Nivel 5: Arquitecturas Serverless
**Ubicación:** `05-arquitecturas/`

#### Patrones Arquitectónicos
- `patrones-arquitectonicos/01-event-driven.ts` - Event-Driven Architecture
  - Domain events
  - EventBridge patterns
  - Saga pattern

- `patrones-arquitectonicos/02-microservices.ts` - Microservices
  - Service separation
  - API composition
  - Service-to-service communication

- `patrones-arquitectonicos/03-graphql.ts` - GraphQL con AppSync
  - Resolvers
  - Subscriptions
  - Real-time updates

#### Workflows y Orquestación
- `workflows-orquestacion/01-step-functions.ts` - Step Functions
  - State machines
  - Error handling
  - Retry strategies

- `workflows-orquestacion/02-saga-pattern.ts` - Saga Pattern
  - Compensating transactions
  - Distributed transactions

#### Data Patterns
- `data-patterns/01-api-composition.ts` - API Composition
  - Aggregation
  - Parallel fetching

- `data-patterns/02-caching.ts` - Caching strategies
  - DynamoDB DAX
  - API Gateway caching
  - CloudFront

---

### Nivel 6: Patrones Avanzados y Producción
**Ubicación:** `06-avanzado-produccion/`

#### Patrones Avanzados
- `patrones-avanzados/01-circuit-breaker.ts` - Circuit Breaker
  - Failure detection
  - Automatic recovery

- `patrones-avanzados/02-retry-backoff.ts` - Retry with Backoff
  - Exponential backoff
  - Jitter

- `patrones-avanzados/03-bulkhead.ts` - Bulkhead Pattern
  - Resource isolation
  - Reserved concurrency

#### CI/CD y DevOps
- `cicd-devops/01-github-actions.yml` - GitHub Actions pipeline
- `cicd-devops/02-testing-strategy.md` - Testing strategy
- `cicd-devops/03-blue-green-deployment.md` - Deployment strategies

#### Seguridad y Compliance
- `seguridad-compliance/01-api-security.ts` - API security
  - Rate limiting
  - WAF integration

- `seguridad-compliance/02-secrets-management.ts` - Secrets Manager
  - Secret rotation
  - Parameter Store

#### Optimización de Costos
- `optimizacion-costos/README.md` - Cost optimization strategies
  - Right-sizing
  - Reserved capacity
  - Monitoring costs

---

## 🛠️ Archivos de Configuración

- `package.json.example` - Dependencias y scripts
- `tsconfig.json.example` - TypeScript configuration
- `.gitignore` - Git ignore patterns

---

## 📊 Progreso Recomendado

### Semanas 1-2: Fundamentos
✅ Entender conceptos serverless
✅ Configurar entorno de desarrollo
✅ Desplegar primera Lambda

### Semanas 3-4: Lambda Básico
✅ Dominar diferentes event sources
✅ Testing local
✅ Optimización básica

### Semanas 5-7: API + Database
✅ REST API completa
✅ DynamoDB CRUD
✅ Índices secundarios

### Semanas 8-10: Servicios Avanzados
✅ S3 integration
✅ SQS/SNS
✅ Cognito authentication

### Semanas 11-14: Arquitecturas
✅ Event-driven architecture
✅ Step Functions
✅ Microservices patterns

### Semanas 15-20: Producción
✅ CI/CD pipelines
✅ Security best practices
✅ Cost optimization
✅ Proyecto final

---

## 🎯 Proyecto Final Sugerido

**E-commerce Serverless Platform**

Implementa:
- ✅ REST API con CRUD completo
- ✅ Autenticación con Cognito
- ✅ Catálogo de productos (DynamoDB)
- ✅ Carrito de compras
- ✅ Proceso de checkout (Step Functions)
- ✅ Procesamiento de pagos
- ✅ Sistema de notificaciones (SNS/SES)
- ✅ Upload de imágenes (S3)
- ✅ Event-driven architecture
- ✅ CI/CD completo
- ✅ Monitoring y alertas
- ✅ Multi-environment (dev/staging/prod)

---

## 📖 Próximos Pasos

1. Empieza con [QUICK_START.md](./QUICK_START.md)
2. Sigue el [README principal](./README.md) nivel por nivel
3. Completa ejercicios de cada carpeta
4. Construye proyectos incrementales
5. Comparte tu progreso en GitHub

---

**¡Buena suerte en tu aprendizaje de AWS Serverless con TypeScript!** 🚀
