# Comparación de Proveedores Cloud: AWS vs Azure vs GCP

## Matriz de Servicios Equivalentes

| Categoría | AWS | Azure | GCP | Descripción |
|-----------|-----|-------|-----|-------------|
| **Compute - VMs** | EC2 | Virtual Machines | Compute Engine | Máquinas virtuales |
| **Compute - Serverless** | Lambda | Functions | Cloud Functions | Funciones serverless |
| **Compute - Containers** | ECS/EKS/Fargate | AKS/Container Instances | GKE/Cloud Run | Orquestación containers |
| **Storage - Object** | S3 | Blob Storage | Cloud Storage | Almacenamiento objetos |
| **Storage - Block** | EBS | Managed Disks | Persistent Disks | Almacenamiento bloques |
| **Storage - File** | EFS | Azure Files | Filestore | Sistema archivos |
| **Database - SQL** | RDS | SQL Database | Cloud SQL | Bases datos relacionales |
| **Database - NoSQL** | DynamoDB | Cosmos DB | Firestore/Bigtable | Bases datos NoSQL |
| **Networking - VPC** | VPC | Virtual Network | VPC | Redes virtuales |
| **Networking - LB** | ELB/ALB/NLB | Load Balancer | Cloud Load Balancing | Balanceadores carga |
| **Networking - CDN** | CloudFront | Azure CDN | Cloud CDN | Content delivery |
| **Networking - DNS** | Route 53 | Azure DNS | Cloud DNS | DNS management |
| **IAM** | IAM | Azure AD/RBAC | Cloud IAM | Identidad y acceso |
| **Secrets** | Secrets Manager | Key Vault | Secret Manager | Gestión secretos |
| **Messaging - Queue** | SQS | Queue Storage | Cloud Tasks | Colas mensajes |
| **Messaging - Pub/Sub** | SNS | Service Bus | Pub/Sub | Publicación/subscripción |
| **Messaging - Events** | EventBridge | Event Grid | Eventarc | Event bus |
| **Monitoring - Logs** | CloudWatch Logs | Monitor Logs | Cloud Logging | Logs centralizados |
| **Monitoring - Metrics** | CloudWatch | Monitor | Cloud Monitoring | Métricas |
| **Monitoring - Tracing** | X-Ray | Application Insights | Cloud Trace | Tracing distribuido |
| **CI/CD** | CodePipeline | Azure DevOps | Cloud Build | Pipelines CI/CD |
| **API Gateway** | API Gateway | API Management | Cloud Endpoints | Gestión APIs |
| **Email** | SES | SendGrid integration | SendGrid integration | Servicio email |

---

## Comparación Detallada por Servicio

### Compute - Virtual Machines

#### AWS EC2
```typescript
// Tipos de instancia
t3.micro    // 2 vCPU, 1GB RAM - General purpose
m5.large    // 2 vCPU, 8GB RAM - General purpose
c5.xlarge   // 4 vCPU, 8GB RAM - Compute optimized
r5.large    // 2 vCPU, 16GB RAM - Memory optimized

// Pricing (us-east-1, on-demand)
t3.micro: $0.0104/hour
m5.large: $0.096/hour
```

#### Azure Virtual Machines
```typescript
// Tamaños
B1s         // 1 vCPU, 1GB RAM - Burstable
D2s_v3      // 2 vCPU, 8GB RAM - General purpose
F4s_v2      // 4 vCPU, 8GB RAM - Compute optimized
E2s_v3      // 2 vCPU, 16GB RAM - Memory optimized

// Pricing (East US, pay-as-you-go)
B1s: $0.0104/hour
D2s_v3: $0.096/hour
```

#### GCP Compute Engine
```typescript
// Tipos de máquina
e2-micro    // 0.25-2 vCPU, 1GB RAM - Shared core
n1-standard-2 // 2 vCPU, 7.5GB RAM - Standard
c2-standard-4 // 4 vCPU, 16GB RAM - Compute optimized

// Pricing (us-central1, on-demand)
e2-micro: $0.0084/hour
n1-standard-2: $0.095/hour
```

**Ganador por costo**: GCP (preemptible instances hasta 80% descuento)
**Ganador por variedad**: AWS (más tipos de instancias)
**Ganador por facilidad**: Azure (integración con Windows)

---

### Serverless Functions

#### AWS Lambda
```typescript
// Características
- Runtime: Node.js, Python, Java, Go, .NET, Ruby, Custom
- Max timeout: 15 minutos
- Max memory: 10GB
- Concurrency: 1000 por región (soft limit)

// Pricing
- Requests: $0.20 por 1M requests
- Compute: $0.0000166667 por GB-second
- Free tier: 1M requests/mes + 400,000 GB-seconds
```

#### Azure Functions
```typescript
// Características
- Runtime: Node.js, Python, Java, .NET, PowerShell, Custom
- Max timeout: 10 minutos (consumption), ilimitado (premium)
- Max memory: 1.5GB (consumption), 14GB (premium)
- Concurrency: 200 por instancia

// Pricing (Consumption Plan)
- Executions: $0.20 por 1M executions
- Compute: $0.000016 por GB-second
- Free tier: 1M executions/mes + 400,000 GB-seconds
```

#### Google Cloud Functions
```typescript
// Características
- Runtime: Node.js, Python, Go, Java, .NET, Ruby, PHP
- Max timeout: 9 minutos (1st gen), 60 minutos (2nd gen)
- Max memory: 8GB (1st gen), 16GB (2nd gen)
- Concurrency: 1 por instancia (1st gen), 1000 (2nd gen)

// Pricing
- Invocations: $0.40 per 1M invocations
- Compute: $0.0000025 per GB-second
- Free tier: 2M invocations/mes + 400,000 GB-seconds
```

**Ganador por precio**: AWS Lambda (mismo que Azure)
**Ganador por timeout**: GCP 2nd gen (60 min)
**Ganador por memoria**: GCP 2nd gen (16GB)

---

### Object Storage

#### AWS S3
```typescript
// Storage classes
Standard          // Acceso frecuente
Intelligent-Tier  // Auto-optimización
Glacier           // Archival (retrieval en minutos-horas)

// Pricing (us-east-1)
- Storage: $0.023 per GB/month (Standard)
- PUT requests: $0.005 per 1000
- GET requests: $0.0004 per 1000
- Data transfer OUT: $0.09 per GB

// Características
- Durability: 99.999999999% (11 nines)
- Availability: 99.99%
- Max object size: 5TB
```

#### Azure Blob Storage
```typescript
// Access tiers
Hot   // Acceso frecuente
Cool  // Acceso infrecuente
Archive // Archival

// Pricing (East US)
- Storage: $0.0184 per GB/month (Hot)
- Write operations: $0.05 per 10,000
- Read operations: $0.004 per 10,000
- Data transfer OUT: $0.087 per GB

// Características
- Durability: 99.999999999% (11 nines)
- Availability: 99.9%
- Max blob size: 4.75TB
```

#### Google Cloud Storage
```typescript
// Storage classes
Standard          // Acceso frecuente
Nearline          // < 1/mes access
Coldline          // < 1/quarter access
Archive           // < 1/year access

// Pricing (us-central1)
- Storage: $0.020 per GB/month (Standard)
- Class A ops: $0.05 per 10,000
- Class B ops: $0.004 per 10,000
- Network egress: $0.12 per GB

// Características
- Durability: 99.999999999% (11 nines)
- Availability: 99.95%
- Max object size: 5TB
```

**Ganador por precio storage**: Azure ($0.0184/GB)
**Ganador por precio egress**: Azure ($0.087/GB)
**Ganador por features**: AWS S3 (más maduro, más integraciones)

---

## Fortalezas de Cada Proveedor

### AWS 🔸
**Fortalezas**:
- ✅ Líder del mercado (32% market share)
- ✅ Mayor cantidad de servicios (200+)
- ✅ Más regiones globales (30+)
- ✅ Ecosistema más maduro
- ✅ Mejor documentación y comunidad
- ✅ Innovación constante

**Ideal para**:
- Startups que necesitan rápido time-to-market
- Empresas que requieren servicios especializados
- Arquitecturas serverless avanzadas

**Casos de uso estrella**:
- Netflix (streaming)
- Airbnb (booking platform)
- NASA JPL (Mars mission data)

---

### Microsoft Azure 🔷
**Fortalezas**:
- ✅ Integración con Microsoft ecosystem (Office 365, AD)
- ✅ Híbrido cloud (Azure Stack, Azure Arc)
- ✅ Enterprise-friendly
- ✅ Compliance y certificaciones
- ✅ AI/ML capabilities (Azure ML)
- ✅ Mejor soporte Windows

**Ideal para**:
- Empresas con infraestructura Microsoft existente
- Ambientes híbridos (on-premise + cloud)
- Enterprise con necesidades de compliance

**Casos de uso estrella**:
- Boeing (manufacturing)
- 3M (healthcare)
- Adobe (Creative Cloud)

---

### Google Cloud Platform 🔵
**Fortalezas**:
- ✅ Mejor pricing (sustained use discounts)
- ✅ Kubernetes nativo (inventores de K8s)
- ✅ BigData y Analytics (BigQuery)
- ✅ AI/ML (TensorFlow, Vertex AI)
- ✅ Network infrastructure (fiber backbone)
- ✅ Innovación en containers

**Ideal para**:
- Cargas Big Data y analytics
- AI/ML workloads
- Kubernetes-native applications
- Cost-conscious startups

**Casos de uso estrella**:
- Spotify (streaming analytics)
- Twitter (data analytics)
- Home Depot (ecommerce analytics)

---

## Cuándo Elegir Cada Uno

### Matriz de Decisión

| Criterio | AWS | Azure | GCP |
|----------|-----|-------|-----|
| **Startup greenfield** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Enterprise existente** | ⭐⭐ | ⭐⭐⭐ | ⭐ |
| **Windows workloads** | ⭐⭐ | ⭐⭐⭐ | ⭐ |
| **Linux workloads** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Híbrido (on-prem + cloud)** | ⭐⭐ | ⭐⭐⭐ | ⭐ |
| **Serverless** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **Kubernetes** | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Big Data** | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **AI/ML** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Global reach** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Pricing** | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Documentation** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **Community** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |

---

## Pricing Comparison Example

### Escenario: Aplicación Web Típica
```
- 2 web servers (2 vCPU, 8GB RAM)
- 1 database (2 vCPU, 8GB RAM)
- 100GB storage
- 1TB data transfer OUT/month
- Load balancer
```

#### AWS
```
EC2 instances (m5.large × 2): $0.096 × 2 × 730h = $140.16
RDS (db.m5.large): $0.192 × 730h = $140.16
EBS storage (100GB): $0.10 × 100 = $10
Data transfer: $0.09 × 1000GB = $90
ALB: $0.0225 × 730h + LCU = ~$25

Total: ~$405/month
```

#### Azure
```
VMs (D2s_v3 × 2): $0.096 × 2 × 730h = $140.16
SQL Database: ~$140
Managed Disks (100GB): $0.05 × 100 = $5
Data transfer: $0.087 × 1000GB = $87
Load Balancer: ~$20

Total: ~$392/month
```

#### GCP
```
Compute (n1-standard-2 × 2): $0.095 × 2 × 730h = $138.70
Cloud SQL: ~$135
Persistent Disks (100GB): $0.04 × 100 = $4
Network egress: $0.12 × 1000GB = $120
Cloud Load Balancing: ~$20

Total: ~$418/month
```

**Resultado**: Azure ligeramente más barato en este escenario específico

*Nota: Precios aproximados, pueden variar por región y cambios en pricing*

---

## 📝 Ejercicio Práctico

### Tarea: Comparar Servicios
Elige un tipo de aplicación (ej: e-commerce, streaming, IoT) y:

1. Identifica servicios necesarios
2. Mapea equivalentes en AWS/Azure/GCP
3. Calcula costos mensuales estimados
4. Decide qué provider es mejor para ese caso

### Ejemplo de Template
```markdown
**Tipo de aplicación**: E-commerce

**Servicios requeridos**:
- Compute: [...]
- Database: [...]
- Storage: [...]
- CDN: [...]

**Mapping**:
| Servicio | AWS | Azure | GCP |
|----------|-----|-------|-----|
| Compute  | ... | ...   | ... |
| ...      | ... | ...   | ... |

**Costos estimados**:
- AWS: $XXX/month
- Azure: $XXX/month
- GCP: $XXX/month

**Decisión**: [...] porque [...]
```

---

## 🔗 Recursos

- [AWS Pricing Calculator](https://calculator.aws/)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
- [GCP Pricing Calculator](https://cloud.google.com/products/calculator)
- [Cloud Comparison Chart](https://comparecloud.in/)
