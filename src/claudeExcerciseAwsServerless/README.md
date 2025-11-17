# 🚀 Roadmap de Aprendizaje: AWS Serverless con TypeScript

## 📚 Tabla de Contenidos
- [Nivel 1: Fundamentos](#nivel-1-fundamentos)
- [Nivel 2: Lambda Básico](#nivel-2-lambda-básico)
- [Nivel 3: API Gateway y DynamoDB](#nivel-3-api-gateway-y-dynamodb)
- [Nivel 4: Servicios AWS Avanzados](#nivel-4-servicios-aws-avanzados)
- [Nivel 5: Arquitecturas Serverless](#nivel-5-arquitecturas-serverless)
- [Nivel 6: Patrones Avanzados y Producción](#nivel-6-patrones-avanzados-y-producción)
- [Recursos y Práctica](#recursos-y-práctica)

---

## Nivel 1: Fundamentos

### 1.1 Conceptos Básicos de Serverless
**Tiempo estimado: 1-2 semanas**

- [ ] **¿Qué es Serverless?**
  - Definición y características
  - Ventajas y desventajas
  - Casos de uso ideales
  - Comparación con arquitecturas tradicionales
  - Modelo de costos (pay-per-use)
  - Cold starts y warm starts

- [ ] **Ecosistema AWS Serverless**
  - AWS Lambda (compute)
  - API Gateway (API management)
  - DynamoDB (database NoSQL)
  - S3 (storage)
  - EventBridge (event bus)
  - Step Functions (orchestration)
  - SNS/SQS (messaging)
  - CloudWatch (monitoring)

- [ ] **Configuración del Entorno de Desarrollo**
  - Crear cuenta AWS (Free Tier)
  - Instalar AWS CLI
  - Configurar credenciales (aws configure)
  - Instalar Node.js y npm
  - Configurar TypeScript
  - Instalar Serverless Framework / SAM / CDK

### 1.2 TypeScript para Serverless
**Tiempo estimado: 1 semana**

- [ ] **TypeScript Esencial**
  - Tipos básicos y avanzados
  - Interfaces para eventos AWS
  - Tipos para respuestas HTTP
  - Genéricos para handlers
  - Utility types (Partial, Pick, Omit)

- [ ] **AWS SDK v3 con TypeScript**
  - Modular vs v2 completo
  - Clients y Commands
  - Tipos fuertemente tipados
  - Manejo de errores con tipos
  - Ejercicio: Script básico con SDK

### 1.3 Infraestructura como Código (IaC)
**Tiempo estimado: 1-2 semanas**

- [ ] **AWS SAM (Serverless Application Model)**
  - Estructura de template.yaml
  - Definición de funciones Lambda
  - Variables de entorno
  - Permisos IAM básicos
  - sam build, deploy, local

- [ ] **Serverless Framework**
  - Instalación y configuración
  - serverless.yml estructura
  - Plugins útiles
  - Stages y variables
  - Deployment

- [ ] **AWS CDK (Cloud Development Kit)**
  - Conceptos: App, Stack, Construct
  - CDK con TypeScript
  - L1, L2, L3 constructs
  - cdk synth, deploy, destroy
  - Ejercicio: Desplegar primera Lambda con CDK

---

## Nivel 2: Lambda Básico

### 2.1 AWS Lambda Fundamentos
**Tiempo estimado: 2-3 semanas**

- [ ] **Anatomía de una Función Lambda**
  - Handler function signature
  - Event, Context, Callback
  - Runtime de Node.js
  - Configuración (memoria, timeout, variables)
  - Capas (Layers) para dependencias compartidas
  - Ejercicio: "Hello World" Lambda

- [ ] **Tipos de Eventos Lambda**
  - HTTP (API Gateway)
  - S3 Events
  - DynamoDB Streams
  - EventBridge
  - SQS
  - SNS
  - Scheduled (Cron)
  - Ejercicio: Lambda con múltiples triggers

- [ ] **Manejo de Entradas y Salidas**
  - Event types con TypeScript
  - @types/aws-lambda
  - APIGatewayProxyEvent
  - APIGatewayProxyResult
  - Context object
  - Response formatting (HTTP)
  - Ejercicio: API REST básica (CRUD endpoints)

### 2.2 Desarrollo Local y Testing
**Tiempo estimado: 2 semanas**

- [ ] **Desarrollo Local**
  - SAM Local (sam local start-api)
  - Serverless Offline
  - LocalStack para servicios AWS locales
  - Docker para emulación
  - Ejercicio: Levantar API localmente

- [ ] **Testing de Funciones Lambda**
  - Unit tests con Jest
  - Mocking AWS SDK
  - Mocking eventos Lambda
  - Integration tests
  - Test de handlers
  - Coverage mínimo recomendado
  - Ejercicio: Test suite completo para CRUD

- [ ] **Debugging**
  - Console.log vs structured logging
  - CloudWatch Logs
  - AWS X-Ray para tracing
  - VSCode debugging con SAM
  - Ejercicio: Debugging de Lambda local

### 2.3 Optimización de Lambda
**Tiempo estimado: 1-2 semanas**

- [ ] **Performance**
  - Cold start mitigation
  - Provisioned concurrency
  - Optimización de bundle size
  - Tree shaking con webpack/esbuild
  - Reutilizar conexiones (SDK clients)
  - Ejercicio: Reducir cold start en 50%

- [ ] **Best Practices**
  - Funciones pequeñas y especializadas
  - Principio de responsabilidad única
  - Manejo de errores robusto
  - Timeouts apropiados
  - Variables de entorno vs Parameter Store
  - Ejercicio: Refactorizar Lambda monolítica

---

## Nivel 3: API Gateway y DynamoDB

### 3.1 API Gateway
**Tiempo estimado: 2-3 semanas**

- [ ] **REST API con API Gateway**
  - Crear API REST
  - Recursos y métodos
  - Integración con Lambda
  - Request/Response mapping
  - CORS configuration
  - Ejercicio: API REST completa para Blog

- [ ] **HTTP API (API Gateway v2)**
  - Diferencias con REST API
  - Menor latencia y costo
  - JWT authorizers
  - Ejercicio: Migrar REST API a HTTP API

- [ ] **Validación y Transformación**
  - Request validation
  - JSON Schema
  - Velocity Template Language (VTL)
  - Request/Response models
  - Ejercicio: Validación de inputs

- [ ] **Autorización y Seguridad**
  - API Keys
  - Lambda Authorizers (Custom)
  - Cognito Authorizers
  - IAM authorization
  - Usage plans y throttling
  - Ejercicio: API con autenticación JWT

### 3.2 DynamoDB Básico
**Tiempo estimado: 2-3 semanas**

- [ ] **Conceptos Fundamentales**
  - Tablas, items, atributos
  - Partition key y Sort key
  - Primary key design
  - Tipos de datos
  - Capacity modes (On-demand vs Provisioned)
  - Ejercicio: Diseñar esquema para e-commerce

- [ ] **Operaciones CRUD**
  - PutItem, GetItem
  - UpdateItem, DeleteItem
  - BatchWriteItem, BatchGetItem
  - Conditional writes
  - Expresiones de condición
  - Ejercicio: Implementar CRUD completo

- [ ] **Queries y Scans**
  - Query vs Scan (diferencias)
  - Key condition expressions
  - Filter expressions
  - Projection expressions
  - Paginación con LastEvaluatedKey
  - Ejercicio: API de búsqueda eficiente

- [ ] **DynamoDB con TypeScript**
  - AWS SDK v3 DynamoDB client
  - DynamoDB DocumentClient
  - Tipos para items
  - Builders de expresiones
  - Ejercicio: Clase Repository genérica

### 3.3 DynamoDB Avanzado
**Tiempo estimado: 2 semanas**

- [ ] **Índices Secundarios**
  - Global Secondary Index (GSI)
  - Local Secondary Index (LSI)
  - Cuándo usar cada uno
  - Proyecciones (ALL, KEYS_ONLY, INCLUDE)
  - Ejercicio: Optimizar queries con GSI

- [ ] **Patrones de Diseño DynamoDB**
  - Single table design
  - Composite keys
  - Overloading GSI
  - Adjacent list pattern
  - Ejercicio: Modelar sistema de posts con comentarios

- [ ] **Transacciones y Batch Operations**
  - TransactWriteItems
  - TransactGetItems
  - ACID en DynamoDB
  - Limitaciones
  - Ejercicio: Sistema de transferencias con transacciones

---

## Nivel 4: Servicios AWS Avanzados

### 4.1 Almacenamiento y Procesamiento
**Tiempo estimado: 2-3 semanas**

- [ ] **S3 (Simple Storage Service)**
  - Buckets y objetos
  - Operaciones (put, get, delete, list)
  - Presigned URLs
  - S3 Events con Lambda
  - Multipart upload
  - Ejercicio: Sistema de upload de imágenes

- [ ] **Procesamiento de Archivos**
  - Lambda triggers desde S3
  - Procesamiento de imágenes (Sharp)
  - Generación de thumbnails
  - Procesamiento de CSV/JSON
  - Ejercicio: Pipeline de procesamiento de imágenes

- [ ] **DynamoDB Streams**
  - Habilitar streams
  - Event types (INSERT, MODIFY, REMOVE)
  - Lambda como consumer
  - Use cases (auditoria, replicación)
  - Ejercicio: Sistema de auditoria con Streams

### 4.2 Mensajería y Eventos
**Tiempo estimado: 2-3 semanas**

- [ ] **SQS (Simple Queue Service)**
  - Standard vs FIFO queues
  - Lambda con SQS trigger
  - Dead Letter Queues (DLQ)
  - Batch processing
  - Visibility timeout
  - Ejercicio: Sistema de procesamiento asíncrono

- [ ] **SNS (Simple Notification Service)**
  - Topics y subscriptions
  - Fan-out pattern
  - Email, SMS, HTTP endpoints
  - Lambda subscriptions
  - Ejercicio: Sistema de notificaciones multi-canal

- [ ] **EventBridge**
  - Event bus (default y custom)
  - Event patterns
  - Rules y targets
  - Scheduled events (cron)
  - Cross-account events
  - Ejercicio: Event-driven architecture

### 4.3 Autenticación y Autorización
**Tiempo estimado: 2-3 semanas**

- [ ] **Cognito User Pools**
  - Crear User Pool
  - Sign up y sign in
  - Grupos de usuarios
  - Lambda triggers (pre-signup, post-confirmation)
  - Ejercicio: Sistema de autenticación completo

- [ ] **Cognito con API Gateway**
  - Authorizers con Cognito
  - JWT tokens
  - Scopes y grupos
  - Ejercicio: API protegida con Cognito

- [ ] **IAM y Permisos**
  - Políticas IAM
  - Roles de ejecución Lambda
  - Least privilege principle
  - Resource-based policies
  - Ejercicio: Configurar permisos mínimos necesarios

### 4.4 Observabilidad
**Tiempo estimado: 2 semanas**

- [ ] **CloudWatch Logs**
  - Log groups y log streams
  - Structured logging
  - Log Insights queries
  - Retention policies
  - Ejercicio: Implementar logger estructurado

- [ ] **CloudWatch Metrics**
  - Custom metrics
  - Dashboards
  - Alarmas
  - Lambda Insights
  - Ejercicio: Dashboard de monitoreo completo

- [ ] **AWS X-Ray**
  - Habilitar tracing
  - Segments y subsegments
  - Annotations y metadata
  - Service map
  - Ejercicio: Tracing de flujo completo

---

## Nivel 5: Arquitecturas Serverless

### 5.1 Patrones Arquitectónicos
**Tiempo estimado: 3-4 semanas**

- [ ] **RESTful API Pattern**
  - CRUD operations
  - Versionamiento
  - Paginación
  - Filtering y sorting
  - Ejercicio: API REST completa de productos

- [ ] **GraphQL API**
  - AWS AppSync
  - Resolvers con Lambda
  - Subscriptions en tiempo real
  - Ejercicio: API GraphQL para blog

- [ ] **Event-Driven Architecture**
  - Event sourcing
  - CQRS (Command Query Responsibility Segregation)
  - Saga pattern
  - Ejercicio: Sistema de pedidos event-driven

- [ ] **Microservices Pattern**
  - Separación por dominio
  - API Gateway como orchestrator
  - Service-to-service communication
  - Ejercicio: Sistema modular multi-servicio

### 5.2 Workflows y Orquestación
**Tiempo estimado: 2-3 semanas**

- [ ] **Step Functions**
  - State machines (Standard vs Express)
  - States: Task, Choice, Parallel, Wait
  - Error handling y retries
  - Callback patterns
  - Ejercicio: Workflow de aprobación de pedidos

- [ ] **Saga Pattern con Step Functions**
  - Compensating transactions
  - Distributed transactions
  - Ejercicio: Proceso de reserva con rollback

- [ ] **Integration Patterns**
  - Fan-out/Fan-in
  - Request-Response
  - Async processing
  - Ejercicio: Pipeline de procesamiento de datos

### 5.3 Data Patterns
**Tiempo estimado: 2-3 semanas**

- [ ] **API Composition Pattern**
  - Agregación de múltiples fuentes
  - Parallel fetching
  - Ejercicio: Dashboard con datos de múltiples APIs

- [ ] **Cache Pattern**
  - DynamoDB DAX
  - API Gateway caching
  - Lambda at Edge con CloudFront
  - Ejercicio: API con caching multi-nivel

- [ ] **Data Lake Pattern**
  - S3 + Lambda + Athena
  - ETL processes
  - Ejercicio: Pipeline de analytics

---

## Nivel 6: Patrones Avanzados y Producción

### 6.1 Patrones Avanzados
**Tiempo estimado: 3-4 semanas**

- [ ] **Backend for Frontend (BFF)**
  - APIs específicas por cliente
  - Agregación de datos
  - Ejercicio: BFF para web y mobile

- [ ] **Strangler Fig Pattern**
  - Migración incremental a serverless
  - Proxy pattern
  - Ejercicio: Migrar API monolítica

- [ ] **Circuit Breaker**
  - Protección contra fallos en cascada
  - Implementación con Lambda
  - Ejercicio: API resiliente con circuit breaker

- [ ] **Bulkhead Pattern**
  - Aislamiento de recursos
  - Reserved concurrency
  - Ejercicio: Isolación de funciones críticas

### 6.2 CI/CD y DevOps
**Tiempo estimado: 2-3 semanas**

- [ ] **Pipelines de Deployment**
  - GitHub Actions / GitLab CI
  - AWS CodePipeline
  - CodeBuild para compilación
  - Ejercicio: Pipeline completo de CI/CD

- [ ] **Testing en CI/CD**
  - Unit tests
  - Integration tests
  - E2E tests
  - Load testing con Artillery
  - Ejercicio: Test suite en pipeline

- [ ] **Blue/Green y Canary Deployments**
  - Lambda versions y aliases
  - Traffic shifting
  - Rollback automático
  - Ejercicio: Despliegue canary con rollback

### 6.3 Seguridad y Compliance
**Tiempo estimado: 2-3 semanas**

- [ ] **Seguridad de APIs**
  - Rate limiting
  - WAF (Web Application Firewall)
  - API Gateway resource policies
  - Ejercicio: API fortificada contra ataques

- [ ] **Secrets Management**
  - AWS Secrets Manager
  - Systems Manager Parameter Store
  - Rotación de secrets
  - Ejercicio: Gestión segura de credenciales

- [ ] **Compliance y Auditoria**
  - CloudTrail
  - Config rules
  - GuardDuty
  - Ejercicio: Setup de auditoria completa

### 6.4 Optimización de Costos
**Tiempo estimado: 1-2 semanas**

- [ ] **Cost Optimization**
  - Análisis con Cost Explorer
  - Right-sizing de funciones
  - Optimización de DynamoDB
  - S3 Intelligent-Tiering
  - Ejercicio: Reducir costos en 30%

- [ ] **FinOps Practices**
  - Tagging strategy
  - Budget alerts
  - Cost allocation
  - Ejercicio: Dashboard de costos

### 6.5 Proyecto Final Integrador
**Tiempo estimado: 6-8 semanas**

- [ ] **E-commerce Serverless Completo**

**Arquitectura completa:**
  - Frontend: S3 + CloudFront
  - API: API Gateway + Lambda
  - Auth: Cognito
  - Database: DynamoDB
  - Storage: S3 para imágenes
  - Search: Elasticsearch Service
  - Email: SES con SNS
  - Payment: Lambda + Stripe/PayPal
  - Orders: Step Functions workflow
  - Notifications: SNS + SQS
  - Monitoring: CloudWatch + X-Ray
  - CI/CD: Pipeline completo

**Funcionalidades:**
  - Catálogo de productos con búsqueda
  - Carrito de compras (DynamoDB)
  - Sistema de autenticación/registro
  - Proceso de checkout
  - Procesamiento de pagos
  - Gestión de pedidos (Step Functions)
  - Sistema de notificaciones (email, SMS)
  - Panel de administración
  - Analytics en tiempo real
  - Sistema de reviews y ratings

**Requisitos técnicos:**
  - TypeScript estricto
  - Tests (>80% coverage)
  - Documentación completa (API docs)
  - IaC con CDK o SAM
  - CI/CD automatizado
  - Monitoreo y alertas
  - Seguridad (WAF, encryption)
  - Multi-region (opcional)

---

## 📖 Recursos y Práctica

### Libros Recomendados
1. **"AWS Lambda in Action"** - Danilo Poccia
2. **"Serverless Architectures on AWS"** - Peter Sbarski
3. **"Programming AWS Lambda"** - Mike Roberts
4. **"Serverless Design Patterns and Best Practices"** - Brian Zambrano
5. **"The DynamoDB Book"** - Alex DeBrie

### Recursos Online
- [AWS Serverless Documentation](https://aws.amazon.com/serverless/)
- [AWS Well-Architected Framework - Serverless](https://aws.amazon.com/architecture/well-architected/)
- [Serverless Land](https://serverlessland.com/) - Patrones y ejemplos
- [AWS Workshops](https://workshops.aws/)
- [AWS Samples GitHub](https://github.com/aws-samples)
- [Yan Cui's Blog](https://theburningmonk.com/) - Serverless expert
- [Off-by-none Newsletter](https://www.jeremydaly.com/newsletter/)

### Cursos Recomendados
- AWS Certified Developer - Associate
- AWS Certified Solutions Architect
- A Cloud Guru - Serverless courses
- Udemy - AWS Serverless APIs & Apps

### Práctica Recomendada

#### Ejercicios Diarios (30-60 min)
- Crear pequeñas funciones Lambda
- Explorar un servicio AWS nuevo
- Leer documentación oficial
- Resolver problemas en Stack Overflow

#### Ejercicios Semanales (3-5 horas)
- Implementar un patrón arquitectónico
- Crear mini-proyecto end-to-end
- Code review de proyectos open source
- Experimentar con nuevos servicios

#### Proyectos Mensuales (10-20 horas)
- Proyectos integradores al final de cada nivel
- Contribuir a proyectos serverless open source
- Crear APIs públicas documentadas
- Blog posts sobre aprendizajes

### Sistema de Evaluación

#### Por cada servicio/concepto:
- [ ] Entender el problema que resuelve
- [ ] Conocer pricing y límites
- [ ] Implementar desde cero
- [ ] Identificar cuándo usar y cuándo NO usar
- [ ] Conocer best practices y anti-patterns
- [ ] Hacer al menos 2-3 ejercicios prácticos

#### Criterios de Dominio:
- **Básico**: Puedes implementar siguiendo tutoriales
- **Intermedio**: Puedes diseñar arquitecturas simples
- **Avanzado**: Puedes diseñar arquitecturas complejas
- **Experto**: Puedes optimizar costos y performance

---

## 🎯 Plan de Estudio Sugerido

### Opción Intensiva (4-5 meses)
- 20-30 horas/semana
- Enfoque full-time en aprendizaje
- Completar todos los niveles secuencialmente
- Budget AWS: ~$50-100/mes

### Opción Moderada (8-10 meses)
- 10-15 horas/semana
- Balance con trabajo
- Profundizar en cada servicio
- Budget AWS: ~$30-50/mes

### Opción Pausada (12-15 meses)
- 5-10 horas/semana
- Aprendizaje sostenible
- Máxima retención y práctica
- Budget AWS: ~$20-30/mes

---

## 💰 Gestión de Costos AWS

### Free Tier
- Lambda: 1M requests/mes + 400,000 GB-seconds
- API Gateway: 1M requests/mes (primeros 12 meses)
- DynamoDB: 25GB storage + 25 RCU/WCU
- S3: 5GB storage (primeros 12 meses)
- CloudWatch: 10 métricas custom

### Consejos para Minimizar Costos
1. **Usar Free Tier al máximo**
2. **Configurar billing alerts** (AWS Budgets)
3. **Eliminar recursos no usados**
4. **Usar tags para tracking**
5. **DynamoDB On-Demand para desarrollo**
6. **LocalStack para testing local**
7. **Apagar recursos fuera de horario de práctica**
8. **Revisar Cost Explorer semanalmente**

---

## 🚀 Consejos para el Éxito

1. **Crea una cuenta AWS dedicada a aprendizaje** - No mezcles con producción
2. **Configura billing alerts inmediatamente** - Evita sorpresas
3. **Practica con proyectos reales** - No solo tutoriales
4. **Automatiza desde el inicio** - IaC es fundamental
5. **Monitorea todo** - Los logs son tus mejores amigos
6. **Aprende a leer la documentación AWS** - Es extensa pero completa
7. **Únete a comunidades** - AWS Community, Reddit r/aws
8. **Certifícate** - Las certificaciones validan tu conocimiento
9. **Construye un portafolio público** - GitHub + README detallados
10. **Enseña lo que aprendes** - Blog posts, videos, talks
11. **Experimenta con límites** - Entiende las restricciones
12. **Diseña para fallos** - Todo falla, prepárate
13. **Optimiza después de hacer funcionar** - Primero que funcione
14. **Lee arquitecturas de referencia** - AWS Solutions Library
15. **Mantente actualizado** - AWS lanza servicios constantemente

---

## 📝 Tracking de Progreso

### Formato de Registro

Para cada servicio/patrón completado, registra:
```
Servicio/Patrón: [Nombre]
Fecha: [DD/MM/YYYY]
Tiempo invertido: [X horas]
Costo AWS: [$X.XX]
Nivel de comprensión: [Básico/Intermedio/Avanzado/Experto]
Ejercicios completados: [X/Y]
Proyecto GitHub: [URL]
Notas: [Insights, dificultades, optimizaciones]
```

### Milestones

- [ ] **Mes 1**: Fundamentos y primera Lambda en producción
- [ ] **Mes 2**: API REST completa con DynamoDB
- [ ] **Mes 3**: Integración de múltiples servicios AWS
- [ ] **Mes 4**: Arquitectura event-driven funcional
- [ ] **Mes 5**: Step Functions y workflows complejos
- [ ] **Mes 6**: Patrones avanzados implementados
- [ ] **Mes 7-8**: CI/CD y producción ready
- [ ] **Mes 9-12**: Proyecto final y certificación AWS

---

## 🎓 Próximos Pasos

1. **Crea tu cuenta AWS** (usa email dedicado)
2. **Configura MFA y billing alerts** (seguridad primero)
3. **Instala herramientas** (AWS CLI, Node.js, TypeScript)
4. **Elige tu IaC tool** (SAM, Serverless Framework, o CDK)
5. **Deploya tu primera Lambda** ("Hello World")
6. **Únete a comunidades** (Slack, Discord, Reddit)
7. **Crea repositorio de aprendizaje** (GitHub público)
8. **Planifica tu presupuesto AWS** (billing alerts!)
9. **Decide tu plan de estudio** (Intensivo/Moderado/Pausado)
10. **Comienza con Nivel 1** (no saltes pasos)

---

## 🏆 Certificaciones Recomendadas

### Orden Sugerido:
1. **AWS Certified Cloud Practitioner** (opcional, introductorio)
2. **AWS Certified Developer - Associate** (fundamental)
3. **AWS Certified Solutions Architect - Associate** (arquitectura)
4. **AWS Certified DevOps Engineer - Professional** (avanzado)

---

## 🔥 Proyectos de Práctica Sugeridos

### Nivel Principiante:
- URL Shortener (Lambda + DynamoDB)
- Image Resizer (S3 + Lambda)
- TODO API (API Gateway + Lambda + DynamoDB)

### Nivel Intermedio:
- Blog Platform (CRUD completo + Auth)
- File Upload Service (S3 + presigned URLs)
- Notification System (SNS + SQS + Lambda)

### Nivel Avanzado:
- E-commerce Platform (proyecto final)
- Real-time Chat (WebSockets + DynamoDB)
- Data Processing Pipeline (S3 + Lambda + Step Functions)
- Multi-tenant SaaS (Cognito + API Gateway + RLS)

---

**¡Buena suerte en tu viaje hacia la maestría en AWS Serverless con TypeScript!** 🚀

*Recuerda: El objetivo no es conocer todos los servicios AWS, sino dominar los fundamentales y saber cuándo y cómo aplicarlos. La arquitectura serverless es sobre resolver problemas de negocio de manera eficiente y escalable.*

**Pro tip**: Elimina recursos AWS después de cada sesión de práctica para minimizar costos. La mejor práctica es tener scripts de tear-down automáticos.
