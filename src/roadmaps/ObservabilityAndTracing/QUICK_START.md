# 🚀 Quick Start: Observabilidad y Trazabilidad

> Empieza a implementar observabilidad en menos de 30 minutos

## 🎯 Objetivo

Implementar observabilidad básica en una función Lambda con:
- ✅ Structured logging
- ✅ Custom metrics
- ✅ Distributed tracing
- ✅ Correlation IDs

---

## 📋 Pre-requisitos

### Herramientas Necesarias
```bash
# Node.js y npm
node --version  # v18+
npm --version   # v9+

# AWS CLI configurado
aws --version
aws sts get-caller-identity

# TypeScript
npm install -g typescript
```

### Cuenta AWS
- AWS Account con permisos de Lambda, CloudWatch, X-Ray
- IAM role para Lambda con políticas:
  - `AWSLambdaBasicExecutionRole`
  - `AWSXRayDaemonWriteAccess`

---

## ⚡ Inicio Rápido (30 minutos)

### Paso 1: Setup del Proyecto (5 min)

```bash
# Crear proyecto
mkdir observability-demo
cd observability-demo

# Inicializar proyecto
npm init -y

# Instalar dependencias
npm install @aws-sdk/client-dynamodb @aws-lambda-powertools/logger \
  @aws-lambda-powertools/metrics @aws-lambda-powertools/tracer

npm install -D @types/aws-lambda @types/node typescript
```

### Paso 2: Configurar TypeScript (2 min)

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

```json
// package.json - añadir scripts
{
  "scripts": {
    "build": "tsc",
    "watch": "tsc -w",
    "deploy": "npm run build && aws lambda update-function-code ..."
  }
}
```

### Paso 3: Implementar Lambda con Observabilidad (15 min)

```typescript
// src/handler.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';

// 1️⃣ INICIALIZAR POWERTOOLS
const logger = new Logger({ serviceName: 'orders-api' });
const metrics = new Metrics({ namespace: 'OrdersApp' });
const tracer = new Tracer({ serviceName: 'orders-api' });

// 2️⃣ FUNCIÓN HELPER: Generar Correlation ID
function getCorrelationId(event: APIGatewayProxyEvent): string {
  return (
    event.headers['x-correlation-id'] ||
    event.requestContext.requestId ||
    crypto.randomUUID()
  );
}

// 3️⃣ LAMBDA HANDLER
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Obtener correlation ID
  const correlationId = getCorrelationId(event);

  // Añadir correlation ID a logs
  logger.appendKeys({ correlationId });

  // Añadir metadata al trace
  tracer.putAnnotation('correlationId', correlationId);
  tracer.putMetadata('requestPath', event.path);

  // Log estructurado
  logger.info('Processing order request', {
    path: event.path,
    method: event.httpMethod,
  });

  try {
    // Simular lógica de negocio
    const orderId = crypto.randomUUID();

    // 4️⃣ CUSTOM TRACE: Subsegment para operación específica
    const segment = tracer.getSegment();
    const subsegment = segment?.addNewSubsegment('processOrder');

    try {
      // Simular procesamiento
      await processOrder(orderId);

      // 5️⃣ CUSTOM METRICS
      metrics.addMetric('OrdersCreated', MetricUnits.Count, 1);
      metrics.addMetric('OrderProcessingTime', MetricUnits.Milliseconds, 150);

      logger.info('Order created successfully', { orderId });

      return {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': correlationId, // Propagar correlation ID
        },
        body: JSON.stringify({
          message: 'Order created',
          orderId,
          correlationId,
        }),
      };
    } finally {
      subsegment?.close();
    }
  } catch (error) {
    // Log de error con contexto
    logger.error('Failed to create order', {
      error: error instanceof Error ? error.message : 'Unknown error',
      correlationId,
    });

    // Métrica de error
    metrics.addMetric('OrderErrors', MetricUnits.Count, 1);

    // Marcar trace como error
    tracer.addErrorAsMetadata(error as Error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId,
      },
      body: JSON.stringify({
        error: 'Internal server error',
        correlationId,
      }),
    };
  } finally {
    // 6️⃣ PUBLICAR MÉTRICAS (importante!)
    metrics.publishStoredMetrics();
  }
};

// Función simulada
async function processOrder(orderId: string): Promise<void> {
  // Simular delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log('Order processed:', orderId);
}
```

### Paso 4: Configurar SAM Template (5 min)

```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Timeout: 10
    Runtime: nodejs18.x
    Tracing: Active  # ← Habilita X-Ray
    Environment:
      Variables:
        POWERTOOLS_SERVICE_NAME: orders-api
        POWERTOOLS_METRICS_NAMESPACE: OrdersApp
        LOG_LEVEL: INFO

Resources:
  OrdersFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: dist/
      Handler: handler.handler
      Events:
        CreateOrder:
          Type: Api
          Properties:
            Path: /orders
            Method: POST
      Policies:
        - AWSLambdaBasicExecutionRole
        - AWSXRayDaemonWriteAccess
        - CloudWatchPutMetricPolicy: {}
```

### Paso 5: Deploy y Probar (3 min)

```bash
# Build
npm run build

# Deploy con SAM
sam build
sam deploy --guided

# O deploy con Serverless Framework
# serverless deploy
```

**Probar la función:**

```bash
# Obtener URL de API Gateway
API_URL=$(aws cloudformation describe-stacks \
  --stack-name observability-demo \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text)

# Hacer request
curl -X POST $API_URL/orders \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: test-12345" \
  -d '{"item": "laptop", "quantity": 1}'
```

---

## 🔍 Verificar Observabilidad

### 1. CloudWatch Logs
```bash
# Ver logs recientes
aws logs tail /aws/lambda/OrdersFunction --follow

# Buscar por correlation ID
aws logs filter-log-events \
  --log-group-name /aws/lambda/OrdersFunction \
  --filter-pattern "test-12345"
```

**Ejemplo de log estructurado:**
```json
{
  "level": "INFO",
  "message": "Processing order request",
  "service": "orders-api",
  "timestamp": "2024-11-18T10:30:00.000Z",
  "correlationId": "test-12345",
  "path": "/orders",
  "method": "POST"
}
```

### 2. CloudWatch Metrics
```bash
# Ver custom metrics
aws cloudwatch list-metrics --namespace OrdersApp

# Get metric statistics
aws cloudwatch get-metric-statistics \
  --namespace OrdersApp \
  --metric-name OrdersCreated \
  --start-time 2024-11-18T00:00:00Z \
  --end-time 2024-11-18T23:59:59Z \
  --period 3600 \
  --statistics Sum
```

### 3. X-Ray Service Map

1. Ir a AWS Console → X-Ray → Service Map
2. Ver el trace completo:
   - API Gateway → Lambda → DynamoDB
3. Buscar por annotation: `correlationId = "test-12345"`
4. Ver duración de cada subsegment

**Service Map mostrará:**
```
API Gateway (50ms)
    ↓
Lambda OrdersFunction (150ms)
    ↓
[processOrder subsegment] (100ms)
```

---

## 📊 Dashboards Rápidos

### CloudWatch Dashboard (opcional)

```bash
# Crear dashboard básico
aws cloudwatch put-dashboard \
  --dashboard-name OrdersObservability \
  --dashboard-body file://dashboard.json
```

**dashboard.json:**
```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["OrdersApp", "OrdersCreated"],
          [".", "OrderErrors"]
        ],
        "period": 300,
        "stat": "Sum",
        "region": "us-east-1",
        "title": "Orders Metrics"
      }
    },
    {
      "type": "log",
      "properties": {
        "query": "SOURCE '/aws/lambda/OrdersFunction' | fields @timestamp, message, correlationId | sort @timestamp desc | limit 20",
        "region": "us-east-1",
        "title": "Recent Logs"
      }
    }
  ]
}
```

---

## 🎓 Próximos Pasos

### 1. Profundizar en Logs (Nivel 1)
```bash
# Explorar ejercicios de structured logging
cd src/roadmaps/ObservabilityAndTracing/01-fundamentos-observabilidad/logs-estructurados
```

### 2. Distributed Tracing (Nivel 2)
```bash
# Aprender OpenTelemetry
cd src/roadmaps/ObservabilityAndTracing/02-distributed-tracing
```

### 3. Implementar en Multi-Service
- Lambda → DynamoDB
- Lambda → S3
- Lambda → SQS → Lambda

### 4. Agregar Alerting
```yaml
# SAM template - añadir alarma
OrderErrorsAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: HighOrderErrors
    MetricName: OrderErrors
    Namespace: OrdersApp
    Statistic: Sum
    Period: 300
    EvaluationPeriods: 1
    Threshold: 5
    ComparisonOperator: GreaterThanThreshold
```

---

## ✅ Checklist de Observabilidad Básica

- [ ] Structured logging con JSON
- [ ] Correlation IDs en todos los logs
- [ ] Custom metrics de negocio
- [ ] Distributed tracing habilitado (X-Ray)
- [ ] Error tracking y logging
- [ ] Propagación de correlation ID via headers
- [ ] CloudWatch dashboard básico
- [ ] Alarmas para errores críticos

---

## 💡 Tips Pro

### 1. Cost Optimization
```typescript
// Sampling para reducir costos de tracing
tracer.captureAWSv3Client(dynamoClient, {
  captureHTTPsRequests: true,
  subSegmentName: 'DynamoDB'
});

// Solo samplear 10% en producción
// (configurar en X-Ray sampling rules)
```

### 2. Performance
```typescript
// Lazy initialization fuera del handler
const logger = new Logger({ serviceName: 'orders-api' });

// Reusar conexiones (warm starts)
export const handler = async (event) => {
  // Handler code
};
```

### 3. Debugging Local
```bash
# SAM Local con X-Ray
sam local start-api --docker-network lambda-local

# Mockear AWS SDK
npm install -D aws-sdk-mock
```

---

## 🐛 Troubleshooting

### Problema: No veo traces en X-Ray
```bash
# Verificar IAM permissions
aws iam get-role-policy --role-name lambda-role --policy-name XRayPolicy

# Verificar que tracing está habilitado
aws lambda get-function-configuration \
  --function-name OrdersFunction \
  --query 'TracingConfig'
```

### Problema: Logs no aparecen en CloudWatch
```bash
# Verificar log group existe
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/

# Verificar IAM permissions para CloudWatch Logs
```

### Problema: Métricas no se publican
```typescript
// Asegúrate de llamar publishStoredMetrics()
finally {
  metrics.publishStoredMetrics();  // ← CRÍTICO
}
```

---

## 📚 Recursos Adicionales

- [AWS Lambda Powertools Docs](https://docs.powertools.aws.dev/lambda/typescript/)
- [X-Ray Developer Guide](https://docs.aws.amazon.com/xray/)
- [CloudWatch Logs Insights Query Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)

---

**¡Listo!** Ahora tienes observabilidad básica implementada.

👉 Continúa con el [README completo](./README.md) para profundizar en cada nivel.
