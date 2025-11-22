# 🏗️ Roadmap de Aprendizaje: System Design (Diseño de Sistemas)

## 📚 Tabla de Contenidos
- [Nivel 1: Fundamentos](#nivel-1-fundamentos)
- [Nivel 2: Componentes de Infraestructura](#nivel-2-componentes-de-infraestructura)
- [Nivel 3: Diseño de Bases de Datos y Almacenamiento](#nivel-3-diseño-de-bases-de-datos-y-almacenamiento)
- [Nivel 4: Arquitecturas Distribuidas](#nivel-4-arquitecturas-distribuidas)
- [Nivel 5: Casos de Estudio Clásicos](#nivel-5-casos-de-estudio-clásicos)
- [Nivel 6: Tópicos Avanzados y Optimización](#nivel-6-tópicos-avanzados-y-optimización)
- [Recursos y Práctica](#recursos-y-práctica)

---

## Nivel 1: Fundamentos

### 1.1 Introducción al System Design
**Tiempo estimado: 1-2 semanas**

- [ ] **¿Qué es System Design?**
  - Definición y propósito
  - Diferencia entre diseño de bajo nivel y alto nivel
  - Importancia en entrevistas técnicas
  - Ciclo de vida del diseño de sistemas
  - Trade-offs y decisiones arquitectónicas
  - Pensamiento en escala y crecimiento

- [ ] **Requerimientos Funcionales vs No Funcionales**
  - Identificar requerimientos funcionales
  - Requerimientos no funcionales (NFRs)
  - Disponibilidad (Availability)
  - Escalabilidad (Scalability)
  - Confiabilidad (Reliability)
  - Mantenibilidad (Maintainability)
  - Ejercicio: Extraer requerimientos de casos de uso

- [ ] **Estimaciones y Cálculos de Capacidad**
  - Back-of-the-envelope calculations
  - Estimación de usuarios activos
  - Cálculo de QPS (Queries Per Second)
  - Estimación de storage necesario
  - Estimación de bandwidth
  - Números que todo desarrollador debe conocer
  - Ejercicio: Estimar capacidad para Twitter

### 1.2 Conceptos Fundamentales
**Tiempo estimado: 2-3 semanas**

- [ ] **Escalabilidad (Scalability)**
  - Vertical scaling (scale-up)
  - Horizontal scaling (scale-out)
  - Cuándo usar cada uno
  - Limitaciones de cada enfoque
  - Auto-scaling
  - Ejercicio: Diseñar estrategia de scaling

- [ ] **Disponibilidad (Availability)**
  - Definición de uptime
  - Cálculo de nines (99%, 99.9%, 99.99%)
  - SLA (Service Level Agreement)
  - SLO (Service Level Objective)
  - SLI (Service Level Indicator)
  - High availability patterns
  - Ejercicio: Calcular downtime permitido para 99.99%

- [ ] **Latencia vs Throughput**
  - Definición de latencia
  - Definición de throughput
  - Trade-offs entre ambos
  - Cómo medirlos
  - Percentiles (p50, p95, p99)
  - Ejercicio: Analizar métricas de sistemas reales

- [ ] **Consistencia (Consistency)**
  - Strong consistency
  - Eventual consistency
  - Weak consistency
  - Read-your-writes consistency
  - Monotonic reads
  - Ejercicio: Elegir modelo para diferentes casos

### 1.3 Teoremas y Principios Fundamentales
**Tiempo estimado: 1-2 semanas**

- [ ] **CAP Theorem**
  - Consistency, Availability, Partition Tolerance
  - Por qué solo puedes elegir 2
  - CP systems (MongoDB, HBase)
  - AP systems (Cassandra, DynamoDB)
  - CA systems (RDBMS tradicionales)
  - Ejercicio: Clasificar sistemas conocidos

- [ ] **PACELC Theorem**
  - Extensión de CAP
  - PAC: en caso de Partition, elegir A o C
  - ELC: en caso normal (Else), elegir Latency o Consistency
  - Aplicaciones prácticas
  - Ejercicio: Aplicar PACELC a casos reales

- [ ] **BASE vs ACID**
  - ACID: Atomicity, Consistency, Isolation, Durability
  - BASE: Basically Available, Soft state, Eventual consistency
  - Cuándo usar cada modelo
  - Trade-offs
  - Ejercicio: Diseñar transacciones bajo cada modelo

---

## Nivel 2: Componentes de Infraestructura

### 2.1 Load Balancing
**Tiempo estimado: 2-3 semanas**

- [ ] **Conceptos de Load Balancing**
  - ¿Qué es un load balancer?
  - Layer 4 vs Layer 7 load balancing
  - Hardware vs Software load balancers
  - Cloud load balancers (ELB, ALB, NLB)
  - Ejercicio: Elegir tipo de LB para diferentes escenarios

- [ ] **Algoritmos de Load Balancing**
  - Round Robin
  - Least Connections
  - Weighted Round Robin
  - IP Hash
  - Least Response Time
  - Random
  - Ejercicio: Implementar algoritmo de LB simple

- [ ] **Health Checks y Failover**
  - Active health checks
  - Passive health checks
  - Circuit breaker pattern
  - Graceful degradation
  - Ejercicio: Diseñar estrategia de health checks

### 2.2 Caching
**Tiempo estimado: 2-3 semanas**

- [ ] **Fundamentos de Caching**
  - ¿Por qué cachear?
  - Cache hit vs cache miss
  - Hit ratio y métricas
  - Cuándo NO cachear
  - TTL (Time To Live)
  - Ejercicio: Calcular beneficio de caching

- [ ] **Niveles de Caché**
  - Client-side cache (browser)
  - CDN cache
  - Application cache (Redis, Memcached)
  - Database cache
  - CPU cache
  - Ejercicio: Diseñar estrategia multi-nivel

- [ ] **Estrategias de Invalidación**
  - Write-through cache
  - Write-around cache
  - Write-back cache
  - Cache-aside (lazy loading)
  - Refresh-ahead
  - Ejercicio: Elegir estrategia por caso de uso

- [ ] **Políticas de Eviction**
  - LRU (Least Recently Used)
  - LFU (Least Frequently Used)
  - FIFO (First In First Out)
  - Random Replacement
  - Ejercicio: Implementar LRU cache

### 2.3 Content Delivery Network (CDN)
**Tiempo estimado: 1-2 semanas**

- [ ] **Conceptos de CDN**
  - ¿Qué es un CDN?
  - Edge locations
  - Origin server
  - Push vs Pull CDN
  - Beneficios (latencia, bandwidth, DDoS)
  - Ejercicio: Diseñar estrategia de CDN global

- [ ] **Proveedores y Configuración**
  - CloudFront, Cloudflare, Akamai
  - Configuración de caching rules
  - Cache invalidation
  - Signed URLs y cookies
  - Ejercicio: Configurar CDN para sitio web

### 2.4 Reverse Proxy y API Gateway
**Tiempo estimado: 1-2 semanas**

- [ ] **Reverse Proxy**
  - Nginx, HAProxy
  - SSL/TLS termination
  - Compression
  - Static file serving
  - Ejercicio: Configurar Nginx como reverse proxy

- [ ] **API Gateway**
  - Rate limiting
  - Authentication y Authorization
  - Request/Response transformation
  - API versioning
  - Analytics y monitoring
  - Ejercicio: Diseñar API Gateway para microservicios

---

## Nivel 3: Diseño de Bases de Datos y Almacenamiento

### 3.1 Bases de Datos Relacionales
**Tiempo estimado: 2-3 semanas**

- [ ] **Diseño de Esquemas**
  - Normalización (1NF, 2NF, 3NF, BCNF)
  - Desnormalización intencional
  - Índices (B-Tree, Hash)
  - Claves primarias y foráneas
  - Constraints
  - Ejercicio: Diseñar esquema para e-commerce

- [ ] **Optimización de Queries**
  - EXPLAIN plans
  - Query optimization
  - N+1 problem
  - Batch operations
  - Connection pooling
  - Ejercicio: Optimizar queries lentas

- [ ] **Sharding de Bases de Datos**
  - ¿Qué es sharding?
  - Horizontal vs Vertical partitioning
  - Sharding keys
  - Consistent hashing
  - Problemas: joins, foreign keys
  - Ejercicio: Diseñar estrategia de sharding

- [ ] **Replicación**
  - Master-Slave replication
  - Master-Master replication
  - Read replicas
  - Write conflicts
  - Replication lag
  - Ejercicio: Configurar replicación MySQL

### 3.2 Bases de Datos NoSQL
**Tiempo estimado: 2-3 semanas**

- [ ] **Tipos de Bases de Datos NoSQL**
  - Document stores (MongoDB, CouchDB)
  - Key-Value stores (Redis, DynamoDB)
  - Column-family (Cassandra, HBase)
  - Graph databases (Neo4j, DGraph)
  - Ejercicio: Elegir BD NoSQL por caso de uso

- [ ] **Patrones de Diseño NoSQL**
  - Embedding vs Referencing
  - Denormalization
  - Indexing strategies
  - Query patterns
  - Ejercicio: Modelar datos para MongoDB

- [ ] **Cassandra Deep Dive**
  - Partition key y clustering columns
  - Replication factor
  - Consistency levels (ONE, QUORUM, ALL)
  - Gossip protocol
  - Ejercicio: Diseñar esquema Cassandra

### 3.3 Almacenamiento de Objetos
**Tiempo estimado: 1-2 semanas**

- [ ] **Object Storage (S3, GCS, Azure Blob)**
  - Conceptos básicos
  - Buckets y objects
  - Durabilidad y disponibilidad
  - Storage classes
  - Versioning
  - Lifecycle policies
  - Ejercicio: Diseñar estrategia de almacenamiento multimedia

- [ ] **File Storage vs Block Storage**
  - Diferencias y casos de uso
  - EFS, EBS en AWS
  - Network File System (NFS)
  - Ejercicio: Elegir tipo de storage

### 3.4 Búsqueda y Análisis
**Tiempo estimado: 2 semanas**

- [ ] **Search Engines (Elasticsearch, Solr)**
  - Inverted indexes
  - Tokenization y analyzers
  - Relevance scoring
  - Faceted search
  - Autocomplete
  - Ejercicio: Diseñar sistema de búsqueda

- [ ] **Data Warehousing**
  - OLTP vs OLAP
  - ETL pipelines
  - Data lakes
  - BigQuery, Redshift, Snowflake
  - Ejercicio: Diseñar pipeline de analytics

---

## Nivel 4: Arquitecturas Distribuidas

### 4.1 Comunicación entre Servicios
**Tiempo estimado: 2-3 semanas**

- [ ] **Protocolo de Comunicación**
  - HTTP/REST
  - gRPC
  - WebSockets
  - GraphQL
  - Ventajas y desventajas de cada uno
  - Ejercicio: Elegir protocolo por caso

- [ ] **Message Queues**
  - RabbitMQ, Apache Kafka, AWS SQS
  - Publish-Subscribe pattern
  - Producer-Consumer pattern
  - Dead Letter Queues (DLQ)
  - Message ordering y deduplication
  - Ejercicio: Diseñar sistema de mensajería

- [ ] **Event-Driven Architecture**
  - Event sourcing
  - CQRS (Command Query Responsibility Segregation)
  - Event bus (EventBridge, Event Grid)
  - Choreography vs Orchestration
  - Ejercicio: Diseñar arquitectura event-driven

### 4.2 Microservicios
**Tiempo estimado: 3-4 semanas**

- [ ] **Fundamentos de Microservicios**
  - Monolith vs Microservices
  - Domain-Driven Design (DDD)
  - Bounded contexts
  - Service boundaries
  - API contracts
  - Ejercicio: Descomponer monolito en microservicios

- [ ] **Patrones de Microservicios**
  - API Gateway pattern
  - Service mesh (Istio, Linkerd)
  - Sidecar pattern
  - Strangler pattern
  - Backend for Frontend (BFF)
  - Ejercicio: Aplicar patrones a arquitectura

- [ ] **Desafíos de Microservicios**
  - Distributed transactions (Saga pattern)
  - Service discovery
  - Configuration management
  - Distributed tracing
  - Debugging distribuido
  - Ejercicio: Resolver problema de transacción distribuida

- [ ] **Resiliencia y Fault Tolerance**
  - Circuit breaker pattern
  - Retry policies (exponential backoff)
  - Timeout strategies
  - Bulkhead pattern
  - Fallback strategies
  - Ejercicio: Implementar circuit breaker

### 4.3 Sincronización y Coordinación
**Tiempo estimado: 2 semanas**

- [ ] **Distributed Locks**
  - Necesidad de locks distribuidos
  - Redlock algorithm (Redis)
  - ZooKeeper
  - Consensus algorithms
  - Ejercicio: Implementar distributed lock

- [ ] **Distributed Consensus**
  - Paxos algorithm
  - Raft algorithm
  - Leader election
  - Split-brain problem
  - Ejercicio: Simular Raft consensus

### 4.4 Observabilidad
**Tiempo estimado: 2-3 semanas**

- [ ] **Logging**
  - Structured logging
  - Centralized logging (ELK, Splunk)
  - Log levels
  - Correlation IDs
  - Ejercicio: Implementar logging estrategia

- [ ] **Monitoring y Alerting**
  - Métricas (Prometheus, Grafana)
  - Golden signals (latency, traffic, errors, saturation)
  - Dashboards
  - Alerting rules
  - On-call practices
  - Ejercicio: Configurar monitoring completo

- [ ] **Distributed Tracing**
  - OpenTelemetry
  - Jaeger, Zipkin
  - Trace context propagation
  - Span y traces
  - Ejercicio: Implementar tracing en microservicios

---

## Nivel 5: Casos de Estudio Clásicos

### 5.1 Social Media y Comunicación
**Tiempo estimado: 3-4 semanas**

- [ ] **Diseñar Twitter**
  - Requerimientos funcionales (tweet, follow, timeline)
  - Requerimientos no funcionales (baja latencia, alta disponibilidad)
  - Timeline generation (fan-out on write vs read)
  - Sharding strategy
  - Caching strategy
  - Media storage
  - Ejercicio: Diseño completo con diagramas

- [ ] **Diseñar Instagram**
  - Photo upload y storage
  - Feed generation
  - Likes y comments
  - Search y discovery
  - CDN para imágenes
  - Ejercicio: Optimizar para alto tráfico

- [ ] **Diseñar WhatsApp / Messenger**
  - Real-time messaging (WebSockets)
  - Message storage
  - Group chats
  - Message delivery guarantees
  - End-to-end encryption
  - Ejercicio: Diseñar sistema de chat escalable

- [ ] **Diseñar Notification System**
  - Push notifications
  - Email notifications
  - SMS notifications
  - Priority queues
  - Rate limiting por usuario
  - Ejercicio: Sistema de notificaciones multi-canal

### 5.2 Content y Media
**Tiempo estimado: 3-4 semanas**

- [ ] **Diseñar YouTube / Netflix**
  - Video upload y processing
  - Video encoding y adaptive bitrate
  - CDN strategy
  - Recommendations
  - Analytics
  - Ejercicio: Optimizar para streaming global

- [ ] **Diseñar Spotify**
  - Audio streaming
  - Playlist management
  - Collaborative playlists
  - Offline mode
  - Recommendations
  - Ejercicio: Sistema de streaming de música

- [ ] **Diseñar TikTok**
  - Short video upload
  - Video recommendation feed
  - Real-time engagement
  - Viral content distribution
  - Ejercicio: Diseñar feed algorítmico

### 5.3 E-commerce y Transacciones
**Tiempo estimado: 3-4 semanas**

- [ ] **Diseñar Amazon / E-commerce**
  - Product catalog
  - Search y filters
  - Shopping cart
  - Inventory management
  - Order processing
  - Payment processing
  - Ejercicio: Sistema de e-commerce completo

- [ ] **Diseñar Payment System (Stripe)**
  - Transaction processing
  - Double-entry bookkeeping
  - Idempotency
  - Fraud detection
  - PCI compliance
  - Ejercicio: Sistema de pagos seguro

- [ ] **Diseñar Uber / Ride-Sharing**
  - Real-time location tracking
  - Driver-rider matching
  - ETA calculation
  - Pricing (surge pricing)
  - Trip history
  - Ejercicio: Sistema de matching geográfico

### 5.4 Infraestructura y Utilidades
**Tiempo estimado: 3-4 semanas**

- [ ] **Diseñar URL Shortener (bit.ly)**
  - URL encoding
  - Collision handling
  - Analytics
  - Custom aliases
  - Expiration
  - Ejercicio: Sistema de URL shortening escalable

- [ ] **Diseñar Web Crawler**
  - URL frontier
  - Politeness policy
  - Duplicate detection
  - Distributed crawling
  - Ejercicio: Crawler distribuido

- [ ] **Diseñar Rate Limiter**
  - Algoritmos (Token Bucket, Leaky Bucket)
  - Distributed rate limiting
  - Per-user vs per-IP
  - Redis-based implementation
  - Ejercicio: Implementar rate limiter distribuido

- [ ] **Diseñar Distributed Cache**
  - Consistent hashing
  - Replication
  - Eviction policies
  - Hot key problem
  - Ejercicio: Cache distribuido con Redis

- [ ] **Diseñar Search Autocomplete**
  - Trie data structure
  - Top K suggestions
  - Real-time updates
  - Personalization
  - Ejercicio: Sistema de autocomplete escalable

---

## Nivel 6: Tópicos Avanzados y Optimización

### 6.1 Seguridad y Compliance
**Tiempo estimado: 2-3 semanas**

- [ ] **Authentication y Authorization**
  - OAuth 2.0 / OpenID Connect
  - JWT (JSON Web Tokens)
  - Session management
  - SSO (Single Sign-On)
  - RBAC vs ABAC
  - Ejercicio: Diseñar sistema de auth

- [ ] **Seguridad de Datos**
  - Encryption at rest
  - Encryption in transit (TLS/SSL)
  - Key management (KMS)
  - Data masking
  - GDPR y compliance
  - Ejercicio: Implementar seguridad end-to-end

- [ ] **DDoS Protection**
  - Rate limiting
  - WAF (Web Application Firewall)
  - Bot detection
  - Cloudflare, AWS Shield
  - Ejercicio: Estrategia de protección DDoS

### 6.2 Performance Optimization
**Tiempo estimado: 2-3 semanas**

- [ ] **Database Optimization**
  - Query optimization
  - Index optimization
  - Connection pooling
  - Read replicas
  - Caching strategies
  - Ejercicio: Optimizar base de datos lenta

- [ ] **Network Optimization**
  - HTTP/2 vs HTTP/3
  - Compression (gzip, brotli)
  - Minification
  - Image optimization
  - Lazy loading
  - Ejercicio: Reducir latencia de API

- [ ] **Application-Level Optimization**
  - Profiling y benchmarking
  - Memory management
  - Async processing
  - Background jobs
  - Ejercicio: Optimizar aplicación existente

### 6.3 Disaster Recovery y Business Continuity
**Tiempo estimado: 2 semanas**

- [ ] **Backup y Recovery**
  - Backup strategies (full, incremental, differential)
  - RTO (Recovery Time Objective)
  - RPO (Recovery Point Objective)
  - Point-in-time recovery
  - Ejercicio: Diseñar estrategia de backup

- [ ] **High Availability Patterns**
  - Multi-region deployment
  - Active-Active vs Active-Passive
  - Failover mechanisms
  - Chaos engineering
  - Ejercicio: Diseñar arquitectura multi-region

- [ ] **Incident Response**
  - Incident management process
  - Post-mortems
  - Runbooks
  - On-call rotations
  - Ejercicio: Crear runbook para servicio

### 6.4 Emerging Technologies
**Tiempo estimado: 2-3 semanas**

- [ ] **Containerization y Orchestration**
  - Docker fundamentals
  - Kubernetes architecture
  - Pods, Services, Deployments
  - Service mesh (Istio)
  - Ejercicio: Deplegar app en Kubernetes

- [ ] **Serverless Architecture**
  - FaaS (Function as a Service)
  - Event-driven serverless
  - Cold starts
  - Pricing considerations
  - Ejercicio: Migrar app a serverless

- [ ] **Edge Computing**
  - Edge locations
  - Lambda@Edge / Cloudflare Workers
  - Benefits y use cases
  - Ejercicio: Implementar lógica en edge

### 6.5 Metodología y Best Practices
**Tiempo estimado: 2 semanas**

- [ ] **Framework de Design de Sistemas**
  1. Clarificar requerimientos (5 min)
  2. Estimaciones de capacidad (5 min)
  3. Diseño de alto nivel (15-20 min)
  4. Diseño detallado (10-15 min)
  5. Identificar cuellos de botella (5 min)
  6. Discutir trade-offs
  - Ejercicio: Practicar con múltiples casos

- [ ] **Communication Skills**
  - Hacer preguntas clarificadoras
  - Pensar en voz alta
  - Discutir trade-offs
  - Dibujar diagramas claros
  - Ejercicio: Mock interviews

- [ ] **Common Pitfalls**
  - Over-engineering
  - Under-engineering
  - Ignorar requerimientos no funcionales
  - No considerar crecimiento
  - No discutir trade-offs
  - Ejercicio: Identificar errores en diseños

### 6.6 Proyecto Final Integrador
**Tiempo estimado: 8-12 semanas**

- [ ] **Diseñar y Documentar Sistema Completo a Elección**

**Opciones de Proyecto:**
1. **Sistema de Social Media** (estilo Twitter/Instagram)
2. **Plataforma de E-learning** (estilo Coursera/Udemy)
3. **Food Delivery Platform** (estilo Uber Eats/DoorDash)
4. **Real-time Gaming Platform** (multiplayer games)
5. **Healthcare Platform** (telemedicina + registros)

**Componentes Requeridos:**
- Documento de requerimientos detallado
- Estimaciones de capacidad completas
- Diagrama de arquitectura de alto nivel
- Diseño detallado de cada componente
- Esquemas de bases de datos
- APIs y contratos de servicios
- Estrategias de caching
- Plan de monitoring y alerting
- Plan de disaster recovery
- Análisis de costos
- Documentación de trade-offs
- Identificación de single points of failure
- Plan de escalamiento
- Estrategia de deployment
- Consideraciones de seguridad

**Deliverables:**
- Documento técnico de diseño (20-30 páginas)
- Diagramas arquitectónicos (C4, UML, secuencia)
- Prototipo funcional (opcional pero recomendado)
- Presentación ejecutiva (15-20 min)
- Code review de componentes críticos
- Prueba de concepto de partes complejas

---

## 📖 Recursos y Práctica

### Libros Recomendados
1. **"Designing Data-Intensive Applications"** - Martin Kleppmann (MUST READ)
2. **"System Design Interview"** - Alex Xu (Volumen 1 y 2)
3. **"Web Scalability for Startup Engineers"** - Artur Ejsmont
4. **"Building Microservices"** - Sam Newman
5. **"Site Reliability Engineering"** - Google (SRE Book)
6. **"Database Internals"** - Alex Petrov
7. **"The Art of Scalability"** - Martin Abbott
8. **"Release It!"** - Michael Nygard

### Recursos Online
- [System Design Primer](https://github.com/donnemartin/system-design-primer) - GitHub
- [Grokking the System Design Interview](https://www.educative.io/)
- [ByteByteGo](https://bytebytego.com/) - Alex Xu
- [High Scalability Blog](http://highscalability.com/)
- [AWS Architecture Center](https://aws.amazon.com/architecture/)
- [Microsoft Azure Architecture](https://docs.microsoft.com/azure/architecture/)
- [Google Cloud Architecture](https://cloud.google.com/architecture)
- [Engineering Blogs](https://github.com/kilimchoi/engineering-blogs) - Collection

### Canales y Cursos
- **YouTube:**
  - Gaurav Sen (System Design)
  - Tech Dummies (System Design)
  - Hussein Nasser
  - InfoQ (conferencias técnicas)
- **Cursos:**
  - Coursera: Cloud Computing Specialization
  - Udemy: System Design Interview
  - Educative.io: Grokking series

### Práctica Recomendada

#### Ejercicios Diarios (30-60 min)
- Leer un caso de estudio de arquitectura
- Analizar arquitectura de empresas tech
- Practicar estimaciones de capacidad
- Resolver mini-problemas de diseño

#### Ejercicios Semanales (3-5 horas)
- Diseñar un sistema completo (1-2 horas)
- Leer engineering blog de tech company
- Practicar mock interview
- Revisar y mejorar diseños anteriores

#### Proyectos Mensuales (10-20 horas)
- Implementar prototipo de sistema diseñado
- Crear documento técnico detallado
- Contribuir a proyectos open source
- Escribir blog post sobre arquitectura

### Sistema de Evaluación

#### Por cada concepto/sistema:
- [ ] Entender el problema y requerimientos
- [ ] Conocer componentes principales
- [ ] Calcular estimaciones de capacidad
- [ ] Diseñar arquitectura de alto nivel
- [ ] Identificar cuellos de botella
- [ ] Discutir trade-offs
- [ ] Optimizar el diseño
- [ ] Documentar decisiones

#### Criterios de Dominio:
- **Básico**: Puedes entender diseños existentes
- **Intermedio**: Puedes diseñar sistemas simples
- **Avanzado**: Puedes diseñar sistemas complejos y escalables
- **Experto**: Puedes optimizar y liderar arquitectura

---

## 🎯 Plan de Estudio Sugerido

### Opción Intensiva (3-4 meses)
- 20-30 horas/semana
- Preparación intensiva para entrevistas
- Completar todos los niveles secuencialmente
- 2-3 casos de estudio por semana

### Opción Moderada (6-8 meses)
- 10-15 horas/semana
- Balance con trabajo
- Profundizar en cada concepto
- 1 caso de estudio por semana

### Opción Pausada (12 meses)
- 5-10 horas/semana
- Aprendizaje sostenible
- Máxima retención y práctica
- Implementar prototipos reales

---

## 🚀 Consejos para el Éxito

1. **Entiende el "por qué" antes del "cómo"** - Comprende problemas antes de soluciones
2. **Practica estimaciones constantemente** - Los números son cruciales
3. **Dibuja siempre** - Los diagramas son tu mejor herramienta
4. **Piensa en trade-offs** - No hay soluciones perfectas
5. **Lee architecture blogs** - Aprende de sistemas reales
6. **Haz preguntas clarificadoras** - Nunca asumas requerimientos
7. **Empieza simple, luego escala** - No over-engineer desde el inicio
8. **Considera los edge cases** - Los detalles importan
9. **Discute monitoreo y alerting** - La observabilidad es crítica
10. **Practica mock interviews** - La comunicación es clave
11. **Estudia sistemas reales** - Lee papers de Google, Amazon, etc.
12. **No memorices soluciones** - Entiende los principios
13. **Considera costos** - El presupuesto es un constraint real
14. **Piensa en el ciclo de vida completo** - Deploy, monitor, maintain
15. **Mantente actualizado** - La tecnología evoluciona rápido

---

## 📝 Tracking de Progreso

### Formato de Registro

Para cada sistema diseñado, registra:
```
Sistema: [Nombre]
Fecha: [DD/MM/YYYY]
Tiempo invertido: [X horas]
Nivel de comprensión: [Básico/Intermedio/Avanzado/Experto]
Componentes cubiertos: [Lista]
Trade-offs identificados: [Lista]
Link a diseño: [URL/Path]
Notas: [Insights, desafíos, aprendizajes]
```

### Milestones

- [ ] **Mes 1**: Fundamentos dominados, primera estimación de capacidad
- [ ] **Mes 2**: Componentes de infraestructura, caché y LB diseñados
- [ ] **Mes 3**: Bases de datos y sharding, primer diseño completo
- [ ] **Mes 4**: Arquitecturas distribuidas, microservicios
- [ ] **Mes 5-6**: Casos de estudio 1-5 completados
- [ ] **Mes 7-8**: Casos de estudio 6-10 completados
- [ ] **Mes 9-10**: Tópicos avanzados dominados
- [ ] **Mes 11-12**: Proyecto final y consolidación

---

## 🎓 Próximos Pasos

1. **Evalúa tu nivel actual** - ¿Cuánto sabes de cada nivel?
2. **Elige tu plan de estudio** - Intensivo, Moderado o Pausado
3. **Comienza con Nivel 1** - No saltes fundamentos
4. **Practica estimaciones diariamente** - Son fundamentales
5. **Crea un repositorio de diseños** - Documenta todo
6. **Únete a comunidades** - Reddit r/systemdesign, Blind
7. **Lee engineering blogs semanalmente** - Mantente actualizado
8. **Practica con mock interviews** - Pramp, Interviewing.io
9. **Implementa prototipos** - La teoría + práctica = dominio
10. **Comparte tus diseños** - Recibe feedback

---

## 🏆 Preparación para Entrevistas

### Estructura de Entrevista (45-60 min)

1. **Requerimientos (5-7 min)**
   - Clarificar casos de uso
   - Definir NFRs (escala, latencia, disponibilidad)
   - Hacer preguntas

2. **Estimaciones (3-5 min)**
   - Usuarios, QPS, storage, bandwidth
   - Back-of-envelope calculations

3. **High-Level Design (10-15 min)**
   - Componentes principales
   - Flujo de datos
   - APIs básicas

4. **Deep Dive (15-20 min)**
   - Diseño de BD
   - Caching strategy
   - Escalabilidad
   - Componentes críticos

5. **Bottlenecks y Optimización (5-10 min)**
   - Identificar SPOFs
   - Discutir trade-offs
   - Optimizaciones posibles

6. **Q&A (5 min)**

### Checklist para Entrevistas

Antes de la entrevista:
- [ ] Repasar fundamentos (CAP, sharding, caching)
- [ ] Practicar estimaciones
- [ ] Revisar casos de estudio comunes
- [ ] Preparar preguntas clarificadoras
- [ ] Practicar dibujar diagramas rápidamente

Durante la entrevista:
- [ ] Pedir clarificación de requerimientos
- [ ] Pensar en voz alta
- [ ] Dibujar diagramas claros
- [ ] Discutir trade-offs
- [ ] Considerar edge cases
- [ ] Mencionar monitoring y alerting
- [ ] Ser receptivo a feedback

---

## 💡 Errores Comunes a Evitar

1. **No hacer preguntas clarificadoras** - Nunca asumas
2. **Saltarte las estimaciones** - Son críticas
3. **Ir directo a detalles** - Empieza con high-level
4. **No discutir trade-offs** - Toda decisión tiene pros/cons
5. **Ignorar single points of failure** - Siempre identifícalos
6. **Over-engineering** - Keep it simple
7. **No considerar crecimiento** - Piensa en escala
8. **Olvidar monitoreo** - Observabilidad es crucial
9. **No comunicar** - Piensa en voz alta
10. **Memorizar soluciones** - Entiende principios

---

## 📚 Glosario Rápido

- **QPS**: Queries Per Second
- **SLA**: Service Level Agreement (acuerdo contractual)
- **SLO**: Service Level Objective (objetivo técnico)
- **SLI**: Service Level Indicator (métrica medible)
- **RPO**: Recovery Point Objective (pérdida de datos tolerable)
- **RTO**: Recovery Time Objective (downtime tolerable)
- **SPOF**: Single Point Of Failure
- **TTL**: Time To Live
- **CDN**: Content Delivery Network
- **LB**: Load Balancer
- **CAP**: Consistency, Availability, Partition Tolerance
- **ACID**: Atomicity, Consistency, Isolation, Durability
- **BASE**: Basically Available, Soft state, Eventual consistency

---

**¡Buena suerte en tu viaje hacia la maestría en System Design!** 🚀

*Recuerda: El objetivo no es memorizar arquitecturas, sino desarrollar la capacidad de razonar sobre trade-offs, identificar problemas de escalabilidad, y tomar decisiones arquitectónicas informadas. System Design es tanto arte como ciencia.*

**Pro tip**: La mejor forma de aprender system design es estudiando sistemas reales. Lee engineering blogs de compañías como Netflix, Uber, Airbnb, Amazon, Google, Facebook. Analiza sus decisiones arquitectónicas y entiende el "por qué" detrás de cada elección.

---

## 🔗 Enlaces Útiles

### Engineering Blogs Recomendados
- Netflix Tech Blog
- Uber Engineering
- Airbnb Engineering
- AWS Architecture Blog
- Google Cloud Blog
- Meta Engineering
- LinkedIn Engineering
- Spotify Engineering
- Twitter Engineering
- Pinterest Engineering

### Papers Clásicos
- Google File System (GFS)
- MapReduce
- BigTable
- Dynamo (Amazon)
- Cassandra
- Kafka
- Spanner

### Comunidades
- r/systemdesign (Reddit)
- System Design Interview (Discord)
- Tech Interview Handbook
- Blind (foros de tech workers)
