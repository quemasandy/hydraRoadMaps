# 📑 Índice del Roadmap de System Design

## 🗺️ Navegación Rápida

### [📘 README Principal](./README.md)
Roadmap completo con todos los niveles y recursos

### [🚀 Quick Start](./QUICK_START.md)
Guía rápida para comenzar tu aprendizaje

---

## 📚 Estructura por Niveles

### Nivel 1: Fundamentos (4-6 semanas)
- **1.1** Introducción al System Design
  - ¿Qué es System Design?
  - Requerimientos funcionales vs no funcionales
  - Estimaciones y cálculos de capacidad
- **1.2** Conceptos Fundamentales
  - Escalabilidad (Vertical vs Horizontal)
  - Disponibilidad y SLAs
  - Latencia vs Throughput
  - Consistencia
- **1.3** Teoremas y Principios
  - CAP Theorem
  - PACELC Theorem
  - BASE vs ACID

**Habilidades clave:** Estimaciones, identificar NFRs, entender trade-offs

---

### Nivel 2: Componentes de Infraestructura (6-8 semanas)
- **2.1** Load Balancing
  - Layer 4 vs Layer 7
  - Algoritmos (Round Robin, Least Connections)
  - Health checks y failover
- **2.2** Caching
  - Niveles de caché
  - Estrategias (Write-through, Cache-aside)
  - Políticas de eviction (LRU, LFU)
- **2.3** CDN
  - Edge locations
  - Push vs Pull CDN
- **2.4** Reverse Proxy y API Gateway
  - Nginx, HAProxy
  - Rate limiting, authentication

**Habilidades clave:** Optimización de latencia, reducción de carga en backend

---

### Nivel 3: Bases de Datos y Almacenamiento (8-10 semanas)
- **3.1** Bases de Datos Relacionales
  - Diseño de esquemas
  - Normalización vs desnormalización
  - Sharding y partitioning
  - Replicación (Master-Slave)
- **3.2** Bases de Datos NoSQL
  - Document stores (MongoDB)
  - Key-Value (Redis, DynamoDB)
  - Column-family (Cassandra)
  - Graph (Neo4j)
- **3.3** Object Storage
  - S3, GCS, Azure Blob
  - Storage classes
- **3.4** Search y Analytics
  - Elasticsearch, Solr
  - Data warehousing

**Habilidades clave:** Diseño de esquemas, elegir BD correcta, sharding

---

### Nivel 4: Arquitecturas Distribuidas (10-12 semanas)
- **4.1** Comunicación entre Servicios
  - REST, gRPC, WebSockets, GraphQL
  - Message queues (Kafka, RabbitMQ)
  - Event-driven architecture
- **4.2** Microservicios
  - Descomposición de monolitos
  - Patrones (API Gateway, Service Mesh)
  - Distributed transactions (Saga)
  - Resiliencia (Circuit breaker)
- **4.3** Sincronización
  - Distributed locks
  - Consensus (Paxos, Raft)
  - Leader election
- **4.4** Observabilidad
  - Logging centralizado (ELK)
  - Monitoring (Prometheus, Grafana)
  - Distributed tracing (Jaeger)

**Habilidades clave:** Arquitecturas distribuidas, debugging, resiliencia

---

### Nivel 5: Casos de Estudio Clásicos (12-16 semanas)

#### 5.1 Social Media
- Diseñar Twitter
- Diseñar Instagram
- Diseñar WhatsApp/Messenger
- Diseñar Notification System

#### 5.2 Content y Media
- Diseñar YouTube/Netflix
- Diseñar Spotify
- Diseñar TikTok

#### 5.3 E-commerce
- Diseñar Amazon
- Diseñar Payment System
- Diseñar Uber

#### 5.4 Infraestructura
- Diseñar URL Shortener
- Diseñar Web Crawler
- Diseñar Rate Limiter
- Diseñar Distributed Cache
- Diseñar Search Autocomplete

**Habilidades clave:** Aplicar todos los conceptos, diseño end-to-end

---

### Nivel 6: Tópicos Avanzados (8-12 semanas)
- **6.1** Seguridad
  - Authentication (OAuth, JWT)
  - Encryption
  - DDoS protection
- **6.2** Performance Optimization
  - Database tuning
  - Network optimization
  - Application profiling
- **6.3** Disaster Recovery
  - Backup strategies
  - High availability patterns
  - Multi-region deployment
- **6.4** Emerging Technologies
  - Kubernetes
  - Serverless
  - Edge computing
- **6.5** Metodología
  - Framework de diseño
  - Communication skills
  - Common pitfalls
- **6.6** Proyecto Final
  - Sistema completo documentado

**Habilidades clave:** Optimización, seguridad, resiliencia, metodología

---

## 🎯 Guías de Estudio

### Por Objetivo

**Para Entrevistas (3-4 meses intensivo)**
1. Nivel 1: Fundamentos → 2 semanas
2. Nivel 2: Componentes → 3 semanas
3. Nivel 3: Bases de datos → 3 semanas
4. Nivel 4: Distribuidos → 4 semanas
5. Nivel 5: Casos de estudio → 6 semanas (todos)
6. Nivel 6: Metodología → 2 semanas
7. Mock interviews → continuo

**Para Trabajo (6-8 meses moderado)**
- Seguir orden secuencial
- Implementar prototipos de cada nivel
- 1 caso de estudio por semana
- Leer engineering blogs

**Para Aprendizaje Profundo (12 meses)**
- Profundizar en cada componente
- Implementar sistemas completos
- Contribuir a open source
- Escribir blog posts

---

## 📊 Checklist de Progreso

### Nivel 1: Fundamentos
- [ ] Puedo estimar capacidad de un sistema
- [ ] Entiendo CAP theorem y puedo aplicarlo
- [ ] Sé calcular QPS, storage, bandwidth
- [ ] Entiendo trade-offs de consistencia

### Nivel 2: Componentes
- [ ] Sé cuándo usar caching y qué estrategia
- [ ] Entiendo diferentes tipos de load balancers
- [ ] Puedo diseñar estrategia de CDN
- [ ] Sé implementar rate limiting

### Nivel 3: Bases de Datos
- [ ] Puedo diseñar esquema normalizado
- [ ] Sé cuándo usar SQL vs NoSQL
- [ ] Entiendo sharding y replicación
- [ ] Puedo elegir tipo de BD por caso de uso

### Nivel 4: Distribuidos
- [ ] Entiendo pros/cons de microservicios
- [ ] Puedo diseñar comunicación entre servicios
- [ ] Sé implementar patrones de resiliencia
- [ ] Entiendo consensus algorithms

### Nivel 5: Casos de Estudio
- [ ] He diseñado al menos 10 sistemas completos
- [ ] Puedo explicar decisiones arquitectónicas
- [ ] Identifico bottlenecks fácilmente
- [ ] Sé optimizar diseños existentes

### Nivel 6: Avanzado
- [ ] Entiendo seguridad end-to-end
- [ ] Puedo optimizar sistemas existentes
- [ ] Sé diseñar para disaster recovery
- [ ] Domino metodología de system design

---

## 🎓 Recursos por Nivel

### Nivel 1-2: Fundamentos
- "Designing Data-Intensive Applications" (Capítulos 1-3)
- System Design Primer (GitHub)
- High Scalability blog

### Nivel 3: Bases de Datos
- "Designing Data-Intensive Applications" (Capítulos 5-7)
- "The DynamoDB Book"
- Database internals blogs

### Nivel 4: Distribuidos
- "Designing Data-Intensive Applications" (Capítulos 8-9)
- "Building Microservices"
- Google SRE Book

### Nivel 5: Casos de Estudio
- "System Design Interview" Vol 1 & 2 (Alex Xu)
- Grokking the System Design Interview
- Engineering blogs (Netflix, Uber, etc.)

### Nivel 6: Avanzado
- Papers (GFS, MapReduce, Dynamo)
- AWS/Azure/GCP architecture docs
- Kubernetes documentation

---

## 🔑 Conceptos Clave por Nivel

### Must-Know por Nivel

**Nivel 1:**
- CAP theorem
- Back-of-envelope calculations
- NFRs (latency, availability, scalability)

**Nivel 2:**
- Load balancing algorithms
- Caching strategies (LRU)
- CDN benefits

**Nivel 3:**
- Sharding vs replication
- SQL vs NoSQL
- Consistent hashing

**Nivel 4:**
- Microservices patterns
- Event-driven architecture
- Circuit breaker

**Nivel 5:**
- Fan-out on read vs write
- Consistent hashing in practice
- Real-world trade-offs

**Nivel 6:**
- Multi-region deployment
- Chaos engineering
- Performance optimization

---

## 📈 Tracking Template

```markdown
## Progreso Semanal

**Semana:** [Número]
**Fecha:** [DD/MM/YYYY]
**Nivel:** [1-6]
**Tiempo invertido:** [X horas]

### Completado
- [ ] Temas estudiados
- [ ] Sistemas diseñados
- [ ] Ejercicios prácticos

### En Progreso
- [ ] Tema actual
- [ ] Desafíos encontrados

### Próximos Pasos
- [ ] Siguiente tema
- [ ] Ejercicios pendientes

### Notas y Aprendizajes
- Insight 1
- Insight 2

### Sistemas Diseñados Esta Semana
1. [Nombre] - [Link al diseño]
2. [Nombre] - [Link al diseño]
```

---

## 💡 Tips de Navegación

- **¿Primera vez?** → Lee [QUICK_START.md](./QUICK_START.md)
- **¿Preparación para entrevistas?** → Ve directo a Nivel 5 (con bases de 1-4)
- **¿Quieres profundizar?** → Sigue orden secuencial completo
- **¿Necesitas un concepto específico?** → Usa este índice para saltar

---

## 🔗 Enlaces Rápidos

- [📘 README Principal](./README.md) - Roadmap completo
- [🚀 Quick Start](./QUICK_START.md) - Comenzar ahora
- [📊 Proyecto Final](./README.md#66-proyecto-final-integrador) - Nivel 6
- [📚 Recursos](./README.md#-recursos-y-práctica) - Libros y cursos
- [🎯 Entrevistas](./README.md#-preparación-para-entrevistas) - Guía

---

**Última actualización:** 2025-11-17
