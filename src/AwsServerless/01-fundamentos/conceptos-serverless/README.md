# Conceptos Básicos de Serverless

## 🎯 Objetivo
Entender los conceptos fundamentales de la arquitectura serverless y su aplicación en AWS.

## 📚 Conceptos Clave

### ¿Qué es Serverless?
- **No gestión de servidores**: No necesitas aprovisionar, escalar o mantener servidores
- **Escalado automático**: Escala automáticamente según la demanda
- **Pago por uso**: Solo pagas por el tiempo de ejecución y recursos consumidos
- **Event-driven**: Las funciones se ejecutan en respuesta a eventos

### Ventajas
✅ Menor costo operacional
✅ Escalabilidad automática
✅ Menor time-to-market
✅ Alta disponibilidad integrada
✅ No gestión de infraestructura

### Desventajas
❌ Cold starts (latencia inicial)
❌ Límites de ejecución (timeout, memoria)
❌ Vendor lock-in
❌ Debugging más complejo
❌ No ideal para procesos de larga duración

### Cold Start vs Warm Start

#### Cold Start
- Primera invocación o después de inactividad
- AWS debe:
  1. Descargar código
  2. Iniciar runtime
  3. Ejecutar código de inicialización
- **Latencia**: 100ms - 3s (depende del runtime y tamaño)

#### Warm Start
- Reutiliza contenedor existente
- Solo ejecuta el handler
- **Latencia**: 1ms - 10ms

## 🔥 Casos de Uso Ideales

### ✅ Perfecto para:
- APIs REST/GraphQL
- Procesamiento de eventos
- Cron jobs / Tareas programadas
- Webhooks
- Procesamiento de archivos
- Backends móviles
- Chatbots
- IoT backends

### ❌ No ideal para:
- Aplicaciones de larga duración (>15 min)
- Alto tráfico constante 24/7 (puede ser más caro)
- Aplicaciones con estado persistente
- Procesamiento que requiere GPUs específicas
- Aplicaciones con requisitos de red muy específicos

## 💰 Modelo de Costos

### AWS Lambda Pricing (US East)
- **Requests**: $0.20 por 1M de requests
- **Duration**: $0.0000166667 por GB-second
  - 1GB memoria x 1 segundo = $0.0000166667
  - 512MB memoria x 1 segundo = $0.0000083333

### Ejemplo de Cálculo
```
Escenario:
- 5 millones de requests/mes
- 512MB de memoria
- 200ms promedio de ejecución

Cálculo:
- Requests: 5M * $0.20/1M = $1.00
- Compute: 5M * 0.2s * 0.5GB * $0.0000166667 = $8.33
- Total: $9.33/mes

Free Tier incluye:
- 1M requests gratis/mes
- 400,000 GB-seconds gratis/mes
```

## 🛠️ Servicios AWS Serverless Core

### Compute
- **Lambda**: Ejecutar código sin servidores
- **Fargate**: Contenedores serverless

### API
- **API Gateway**: REST APIs
- **AppSync**: GraphQL APIs

### Database
- **DynamoDB**: NoSQL serverless
- **Aurora Serverless**: SQL serverless
- **S3**: Object storage

### Messaging
- **SQS**: Message queues
- **SNS**: Pub/Sub messaging
- **EventBridge**: Event bus

### Orchestration
- **Step Functions**: Workflows visuales

### Monitoring
- **CloudWatch**: Logs, metrics, alarms
- **X-Ray**: Distributed tracing

## 📊 Arquitectura Tradicional vs Serverless

### Tradicional (EC2)
```
[Client] → [Load Balancer] → [EC2 Auto Scaling Group]
                                ↓
                              [RDS Database]

Gestión manual de:
- Servers (patching, updates)
- Scaling (rules, thresholds)
- Load balancing
- High availability
- Security groups
- Backups
```

### Serverless
```
[Client] → [API Gateway] → [Lambda Functions]
                              ↓
                           [DynamoDB]

AWS gestiona:
✅ Scaling automático
✅ High availability
✅ Patching & updates
✅ Load balancing
Tú gestionas:
- Código de negocio
- IAM permissions
- Monitoring
```

## 🎓 Ejercicios

### Ejercicio 1: Análisis de Caso de Uso
**Pregunta**: ¿Serverless o no?

1. API que recibe 10 requests/segundo constantes 24/7
2. Procesamiento de imágenes cuando se suben a S3
3. Cron job que corre cada hora
4. Streaming de video en vivo
5. Backend de app móvil con tráfico variable

<details>
<summary>Ver respuestas</summary>

1. **Depende**: Con tráfico constante, EC2 con reserved instances podría ser más barato. Pero Lambda con provisioned concurrency podría funcionar.
2. **✅ Serverless**: Caso de uso ideal - event-driven, procesamiento on-demand
3. **✅ Serverless**: Perfecto - pagas solo cuando se ejecuta
4. **❌ No serverless**: Lambda tiene timeout de 15 min máximo
5. **✅ Serverless**: Ideal - escala automáticamente con picos de tráfico

</details>

### Ejercicio 2: Cálculo de Costos
Calcula el costo mensual de Lambda para:
- 2 millones de requests
- 1GB de memoria
- 300ms promedio de ejecución

<details>
<summary>Ver respuesta</summary>

```
Requests: 2M - 1M (free tier) = 1M
Costo requests: 1M * $0.20/1M = $0.20

Compute time: (2M - 1M) * 0.3s * 1GB = 300,000 GB-seconds
Free tier: 400,000 GB-seconds
Todo está en free tier!

Total: $0.20 (solo requests adicionales)
```

</details>

### Ejercicio 3: Cold Start Impact
Una función Lambda con 128MB tarda 2 segundos en cold start y 10ms en warm start.
Si recibe 1000 requests en 1 hora con 10% de cold starts, ¿cuál es la latencia promedio?

<details>
<summary>Ver respuesta</summary>

```
Cold starts: 1000 * 10% = 100 requests * 2000ms = 200,000ms
Warm starts: 1000 * 90% = 900 requests * 10ms = 9,000ms

Total: 200,000ms + 9,000ms = 209,000ms
Promedio: 209,000ms / 1000 = 209ms por request

Estrategias de mitigación:
- Provisioned concurrency
- Aumentar memoria (menos cold start time)
- Mantener funciones "warm" con pings
```

</details>

## 📖 Recursos Adicionales

- [AWS Lambda Pricing](https://aws.amazon.com/lambda/pricing/)
- [Serverless Cost Calculator](https://calculator.aws/)
- [AWS Well-Architected Serverless Lens](https://docs.aws.amazon.com/wellarchitected/latest/serverless-applications-lens/welcome.html)

## ✅ Checklist de Dominio

- [ ] Puedo explicar qué es serverless a alguien no técnico
- [ ] Entiendo la diferencia entre cold start y warm start
- [ ] Sé calcular costos de Lambda básicos
- [ ] Puedo identificar cuándo usar y cuándo NO usar serverless
- [ ] Conozco los principales servicios AWS serverless
- [ ] Entiendo el modelo de pricing de Lambda
