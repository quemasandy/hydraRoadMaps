# Conceptos Fundamentales de Cloud Computing

## Modelos de Servicio Cloud

### IaaS (Infrastructure as a Service)
- **Definición**: Provisión de infraestructura virtualizada
- **Control**: Alto - gestionas OS, runtime, aplicaciones
- **Ejemplos**:
  - AWS: EC2, VPC, EBS
  - Azure: Virtual Machines, Virtual Network
  - GCP: Compute Engine, VPC

**Cuándo usar**: Necesitas control total sobre el entorno

### PaaS (Platform as a Service)
- **Definición**: Plataforma para desarrollo y despliegue
- **Control**: Medio - gestionas aplicaciones y datos
- **Ejemplos**:
  - AWS: Elastic Beanstalk, RDS
  - Azure: App Service, SQL Database
  - GCP: App Engine, Cloud SQL

**Cuándo usar**: Quieres enfocarte en código, no en infraestructura

### FaaS (Function as a Service) / Serverless
- **Definición**: Ejecuta código en respuesta a eventos
- **Control**: Bajo - solo gestionas código
- **Ejemplos**:
  - AWS: Lambda
  - Azure: Functions
  - GCP: Cloud Functions

**Cuándo usar**: Event-driven, microservicios, auto-scaling automático

### SaaS (Software as a Service)
- **Definición**: Software completo entregado vía internet
- **Control**: Ninguno - solo usas el servicio
- **Ejemplos**:
  - Gmail, Office 365, Salesforce
  - Slack, Zoom, Notion

**Cuándo usar**: Necesitas una solución completa sin gestión

---

## Conceptos Fundamentales

### Elasticidad
```
Capacidad de escalar recursos automáticamente según demanda

   Alta demanda ────────────────────────────┐
                                            │
   Demanda normal ─────────┬────────────────┤
                           │                │
   Baja demanda ───────────┴────────────────┘

   Recursos se ajustan automáticamente ↕
```

**Ejemplo**: Auto-scaling group que agrega instancias cuando CPU > 70%

### Escalabilidad

#### Vertical (Scale Up)
```
Antes: 2 vCPU, 4GB RAM
Después: 8 vCPU, 32GB RAM
```
- Aumentar potencia de una instancia
- Limitado por hardware
- Requiere downtime

#### Horizontal (Scale Out)
```
Antes: 1 instancia
Después: 10 instancias
```
- Agregar más instancias
- Ilimitado (teóricamente)
- Sin downtime

### Alta Disponibilidad (High Availability)

**Objetivo**: Minimizar downtime

```
┌──────────────────────────────────────────┐
│         Availability Zones               │
├──────────────┬──────────────┬────────────┤
│   Zone A     │   Zone B     │   Zone C   │
│   App + DB   │   App + DB   │   App + DB │
└──────────────┴──────────────┴────────────┘
Si Zone A falla → Traffic va a Zone B y C
```

**Métricas**:
- 99.9% = 8.7 horas downtime/año
- 99.95% = 4.4 horas downtime/año
- 99.99% = 52 minutos downtime/año
- 99.999% = 5 minutos downtime/año

### Disaster Recovery (DR)

**RTO (Recovery Time Objective)**: Tiempo para recuperar servicio
**RPO (Recovery Point Objective)**: Pérdida de datos aceptable

```
Incidente ─────────┬─────────────┬─────────────> Tiempo
                   │             │
                   └─ RPO        └─ RTO
```

**Estrategias**:
1. **Backup & Restore** (RTO: horas, RPO: horas) - Más barato
2. **Pilot Light** (RTO: minutos, RPO: minutos) - Balance
3. **Warm Standby** (RTO: minutos, RPO: segundos) - Caro
4. **Active-Active** (RTO: segundos, RPO: casi cero) - Más caro

### Regiones y Zonas de Disponibilidad

```
┌─────────────────────────────────────────────────┐
│                   Región (ej: us-east)           │
├──────────────┬──────────────┬──────────────────┤
│   Zone A     │   Zone B     │   Zone C          │
│ Datacenter   │ Datacenter   │ Datacenter        │
│ independiente│ independiente│ independiente     │
└──────────────┴──────────────┴──────────────────┘

Low latency (<2ms) entre zones
Fiber optic connection
Separate power, cooling, networking
```

**Regiones por Provider**:
- **AWS**: 30+ regiones, 90+ zonas
- **Azure**: 60+ regiones
- **GCP**: 35+ regiones, 100+ zonas

---

## Pricing Models

### Pay-as-you-go
- Pagas por uso exacto (por segundo/minuto/hora)
- Sin compromiso
- Ideal para cargas variables

### Reserved Instances
- Compromiso 1-3 años
- Descuento: 30-70%
- Ideal para cargas predecibles

### Spot / Preemptible Instances
- Instancias de capacidad sobrante
- Descuento: hasta 90%
- Pueden ser interrumpidas
- Ideal para cargas tolerantes a fallos

### Savings Plans
- Compromiso de gasto por hora
- Flexible en tipo de instancia
- Descuento: 30-50%

---

## Edge Computing y CDN

### CDN (Content Delivery Network)
```
┌──────────┐
│  Origin  │ (us-east-1)
└─────┬────┘
      │
      ├──────────┬──────────┬──────────┐
      │          │          │          │
   ┌──▼──┐   ┌──▼──┐   ┌──▼──┐   ┌──▼──┐
   │ PoP │   │ PoP │   │ PoP │   │ PoP │
   │ USA │   │ EUR │   │ ASIA│   │ LATAM│
   └─────┘   └─────┘   └─────┘   └─────┘
```

**Beneficios**:
- Baja latencia (contenido cerca del usuario)
- Reduce carga en origin
- DDoS protection

**Proveedores**:
- AWS CloudFront
- Azure CDN
- Google Cloud CDN
- Cloudflare (independiente)

---

## 📝 Ejercicio Práctico

### Tarea 1: Comparar Pricing
Calcula el costo mensual de:
- 2 vCPU, 8GB RAM, 100GB storage
- Corriendo 24/7
- En AWS, Azure, GCP
- Con pay-as-you-go vs reserved (1 año)

### Tarea 2: Diseñar Alta Disponibilidad
Diseña una arquitectura para:
- Aplicación web
- 99.95% availability
- 2 regiones
- RTO < 5 minutos
- Presupuesto: $500/mes

### Tarea 3: Edge Computing
Investiga y compara:
- AWS Lambda@Edge vs Azure Functions (Edge) vs GCP Cloud Functions
- Casos de uso
- Limitaciones
- Pricing

---

## 🔗 Recursos

- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Azure Architecture Center](https://docs.microsoft.com/azure/architecture/)
- [Google Cloud Architecture Framework](https://cloud.google.com/architecture/framework)
- [Cloud Computing Patterns](https://www.cloudcomputingpatterns.org/)
