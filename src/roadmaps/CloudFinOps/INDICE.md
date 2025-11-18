# 📑 Índice de Ejercicios de CloudFinOps

## Navegación Rápida por Nivel

- [Nivel 1: Fundamentos de FinOps](#nivel-1-fundamentos-de-finops)
- [Nivel 2: Monitorización de Costos](#nivel-2-monitorización-de-costos)
- [Nivel 3: Optimización de Cómputo](#nivel-3-optimización-de-cómputo)
- [Nivel 4: Optimización de Almacenamiento](#nivel-4-optimización-de-almacenamiento)
- [Nivel 5: Arquitectura y Costos](#nivel-5-arquitectura-y-costos)
- [Nivel 6: Gobierno y Automatización](#nivel-6-gobierno-y-automatización)

---

## Nivel 1: Fundamentos de FinOps

### 📂 Conceptos Básicos
`01-fundamentos-finops/conceptos-basicos/`

**Archivos:**
- `01-finops-principles.ts` - Principios fundamentales de FinOps
- `02-cost-culture.ts` - Cultura de costos en equipos de ingeniería
- `03-finops-kpis.ts` - KPIs clave: Unit economics, Cost per transaction
- `04-shared-responsibility.ts` - Modelo de responsabilidad compartida
- `05-finops-lifecycle.ts` - Ciclo de vida FinOps: Inform, Optimize, Operate

**Conceptos clave:**
- FinOps = Finanzas + DevOps + Cloud
- Unit economics y métricas de negocio
- Cultura de costos como código
- Responsabilidad compartida entre equipos

---

### 📂 Modelos de Pricing
`01-fundamentos-finops/modelos-pricing/`

**Archivos:**
- `01-ondemand-pricing.ts` - On-Demand: Pago por uso sin compromisos
- `02-reserved-instances.ts` - Reserved Instances: Ahorros con compromiso 1-3 años
- `03-savings-plans.ts` - Savings Plans: Flexibilidad con descuentos
- `04-spot-instances-intro.ts` - Spot Instances: Hasta 90% de ahorro
- `05-pricing-comparison.ts` - Comparativa: Cuándo usar cada modelo

**Conceptos clave:**
- On-Demand vs Reserved vs Spot
- Savings Plans: Compute vs EC2 vs SageMaker
- Modelos de compromiso y flexibilidad
- Break-even analysis

---

### 📂 ROI y TCO
`01-fundamentos-finops/roi-tco/`

**Archivos:**
- `01-tco-calculator.ts` - Total Cost of Ownership: On-premise vs Cloud
- `02-roi-analysis.ts` - Return on Investment para migraciones
- `03-payback-period.ts` - Período de recuperación de inversión
- `04-cloud-value-framework.ts` - Cloud Value Framework de AWS

**Conceptos clave:**
- TCO: Costo total de propiedad
- ROI calculation para cloud migrations
- Payback period y NPV
- Business value metrics

---

## Nivel 2: Monitorización de Costos

### 📂 CloudWatch y Billing
`02-monitorizacion-costos/cloudwatch-billing/`

**Archivos:**
- `01-billing-metrics.ts` - Métricas de facturación en CloudWatch
- `02-custom-cost-metrics.ts` - Métricas custom para costos
- `03-cloudwatch-dashboards.ts` - Dashboards de costos en tiempo real
- `04-billing-alarms.ts` - Alarmas de facturación
- `05-anomaly-detection.ts` - Detección de anomalías en costos

**Conceptos clave:**
- Métricas de billing en CloudWatch
- Dashboards personalizados
- Alarmas proactivas
- Anomaly detection con ML

---

### 📂 Budgets y Alerts
`02-monitorizacion-costos/budgets-alerts/`

**Archivos:**
- `01-monthly-budgets.ts` - Presupuestos mensuales por servicio
- `02-project-budgets.ts` - Presupuestos por proyecto/equipo
- `03-forecast-budgets.ts` - Presupuestos basados en forecast
- `04-budget-actions.ts` - Acciones automáticas al superar presupuesto
- `05-notification-strategies.ts` - Estrategias de notificación

**Conceptos clave:**
- AWS Budgets configuration
- Budget actions automáticas
- Multi-account budgets
- Forecasting basado en histórico

---

### 📂 Cost Explorer
`02-monitorizacion-costos/cost-explorer/`

**Archivos:**
- `01-cost-explorer-api.ts` - Cost Explorer API para análisis
- `02-cost-breakdown.ts` - Desglose de costos por servicio
- `03-cost-trends.ts` - Análisis de tendencias de costos
- `04-cost-forecasting.ts` - Forecasting de costos futuros
- `05-cost-reports.ts` - Reportes automáticos de costos

**Conceptos clave:**
- Cost Explorer API
- Análisis histórico de costos
- Forecasting con ML
- Reportes automatizados

---

## Nivel 3: Optimización de Cómputo

### 📂 Lambda vs Fargate
`03-optimizacion-computo/lambda-vs-fargate/`

**Archivos:**
- `01-lambda-cost-model.ts` - Modelo de costos de Lambda
- `02-fargate-cost-model.ts` - Modelo de costos de Fargate
- `03-cost-comparison.ts` - Comparativa Lambda vs Fargate por carga
- `04-breakeven-analysis.ts` - Punto de equilibrio según tráfico
- `05-workload-patterns.ts` - Patrones de carga: Cuándo usar cada uno
- `06-cost-optimization-tips.ts` - Tips de optimización para cada servicio

**Conceptos clave:**
- Lambda pricing: GB-second, requests
- Fargate pricing: vCPU-hour, GB-hour
- Break-even point calculation
- Workload pattern matching

---

### 📂 EC2 Rightsizing
`03-optimizacion-computo/ec2-rightsizing/`

**Archivos:**
- `01-utilization-analysis.ts` - Análisis de utilización de CPU/Memoria
- `02-rightsizing-recommendations.ts` - Recomendaciones de rightsizing
- `03-instance-family-selection.ts` - Selección de familia de instancias
- `04-cost-impact-calculator.ts` - Calculadora de impacto de rightsizing
- `05-migration-strategy.ts` - Estrategia de migración sin downtime

**Conceptos clave:**
- CloudWatch metrics para rightsizing
- Instance families: General, Compute, Memory, Storage
- Rightsizing sin impacto en performance
- Automated rightsizing recommendations

---

### 📂 Spot Instances
`03-optimizacion-computo/spot-instances/`

**Archivos:**
- `01-spot-pricing-strategy.ts` - Estrategia de pricing con Spot
- `02-spot-interruption-handling.ts` - Manejo de interrupciones
- `03-spot-fleet.ts` - Spot Fleet para alta disponibilidad
- `04-savings-calculator.ts` - Calculadora de ahorros con Spot
- `05-best-practices.ts` - Best practices para Spot Instances

**Conceptos clave:**
- Spot pricing: hasta 90% de ahorro
- Manejo de interrupciones con 2-minute warning
- Spot Fleet vs Auto Scaling
- Workloads ideales para Spot

---

## Nivel 4: Optimización de Almacenamiento

### 📂 S3 Tiering
`04-optimizacion-almacenamiento/s3-tiers/`

**Archivos:**
- `01-storage-classes.ts` - S3 Storage Classes: Standard, IA, Glacier
- `02-lifecycle-policies.ts` - Políticas de lifecycle automáticas
- `03-intelligent-tiering.ts` - S3 Intelligent-Tiering
- `04-cost-comparison.ts` - Comparativa de costos por clase
- `05-access-patterns.ts` - Patrones de acceso y tiering strategy
- `06-savings-calculator.ts` - Calculadora de ahorros con tiering

**Conceptos clave:**
- S3 Storage Classes pricing
- Lifecycle policies automation
- Intelligent-Tiering for unpredictable access
- Cost optimization con tiering correcto

---

### 📂 EBS Optimización
`04-optimizacion-almacenamiento/ebs-optimizacion/`

**Archivos:**
- `01-ebs-volume-types.ts` - Tipos de volúmenes: gp3, io2, st1, sc1
- `02-volume-rightsizing.ts` - Rightsizing de volúmenes EBS
- `03-snapshot-optimization.ts` - Optimización de snapshots
- `04-cost-calculator.ts` - Calculadora de costos EBS
- `05-migration-gp2-to-gp3.ts` - Migración de gp2 a gp3 (20% ahorro)

**Conceptos clave:**
- EBS volume types y pricing
- gp3 vs gp2: 20% cheaper
- Snapshot lifecycle management
- Rightsizing de IOPS y throughput

---

### 📂 Data Lifecycle
`04-optimizacion-almacenamiento/data-lifecycle/`

**Archivos:**
- `01-lifecycle-management.ts` - Data lifecycle management strategy
- `02-archival-strategy.ts` - Estrategia de archivado (Glacier, Deep Archive)
- `03-data-retention.ts` - Políticas de retención de datos
- `04-automated-cleanup.ts` - Cleanup automático de datos antiguos
- `05-compliance-retention.ts` - Retención para compliance (GDPR, HIPAA)

**Conceptos clave:**
- Lifecycle policies para S3, EBS, RDS
- Archival strategies con Glacier
- Data retention policies
- Compliance requirements

---

## Nivel 5: Arquitectura y Costos

### 📂 Serverless Costs
`05-arquitectura-costos/serverless-costs/`

**Archivos:**
- `01-serverless-cost-model.ts` - Modelo de costos serverless completo
- `02-api-gateway-costs.ts` - API Gateway pricing y optimización
- `03-dynamodb-capacity.ts` - DynamoDB: On-demand vs Provisioned
- `04-stepfunctions-costs.ts` - Step Functions cost optimization
- `05-eventbridge-costs.ts` - EventBridge pricing
- `06-total-serverless-calculator.ts` - Calculadora total de stack serverless

**Conceptos clave:**
- Serverless pricing models
- API Gateway caching para reducir costos
- DynamoDB capacity modes
- Event-driven architecture costs

---

### 📂 Calculadoras ROI
`05-arquitectura-costos/calculadoras-roi/`

**Archivos:**
- `01-migration-roi.ts` - ROI de migración a cloud
- `02-serverless-vs-containers.ts` - ROI: Serverless vs Containers
- `03-multi-cloud-roi.ts` - ROI de estrategia multi-cloud
- `04-cost-benefit-analysis.ts` - Análisis costo-beneficio de decisiones
- `05-financial-modeling.ts` - Modelado financiero para arquitectura

**Conceptos clave:**
- ROI calculation frameworks
- Cost-benefit analysis
- Financial modeling for architecture
- TCO comparisons

---

### 📂 Patrones de Ahorro
`05-arquitectura-costos/patrones-ahorro/`

**Archivos:**
- `01-event-driven-savings.ts` - Event-driven vs polling: ahorro de costos
- `02-cache-layers.ts` - Cache layers para reducir I/O costs
- `03-async-processing.ts` - Procesamiento asíncrono para optimizar
- `04-batch-processing.ts` - Batch processing vs real-time
- `05-data-compression.ts` - Compresión de datos para reducir storage
- `06-cdn-optimization.ts` - CDN para reducir data transfer costs

**Conceptos clave:**
- Event-driven architecture savings
- Caching strategies (CloudFront, ElastiCache)
- Async vs sync processing costs
- Data transfer optimization

---

## Nivel 6: Gobierno y Automatización

### 📂 Tagging Strategy
`06-gobierno-automatizacion/tagging-strategy/`

**Archivos:**
- `01-tagging-standards.ts` - Estándares de etiquetado
- `02-cost-allocation-tags.ts` - Tags para cost allocation
- `03-automated-tagging.ts` - Tagging automático con IaC
- `04-tag-compliance.ts` - Compliance de tags con policies
- `05-chargeback-showback.ts` - Chargeback y Showback con tags

**Conceptos clave:**
- Tagging standards (Environment, Owner, Project, CostCenter)
- Cost allocation tags
- Automated tagging con CDK/Terraform
- Chargeback vs Showback

---

### 📂 Cost Policies
`06-gobierno-automatizacion/cost-policies/`

**Archivos:**
- `01-service-control-policies.ts` - SCPs para control de costos
- `02-instance-type-restrictions.ts` - Restricciones de tipos de instancia
- `03-region-restrictions.ts` - Restricción de regiones caras
- `04-spending-limits.ts` - Límites de gasto por cuenta
- `05-approval-workflows.ts` - Workflows de aprobación para recursos costosos

**Conceptos clave:**
- Service Control Policies (SCPs)
- Preventive controls para costos
- Approval workflows
- Multi-account governance

---

### 📂 Automatización
`06-gobierno-automatizacion/automation/`

**Archivos:**
- `01-auto-shutdown.ts` - Auto-shutdown de recursos dev/test
- `02-rightsizing-automation.ts` - Rightsizing automático
- `03-orphan-resource-cleanup.ts` - Limpieza de recursos huérfanos
- `04-snapshot-lifecycle-automation.ts` - Automatización de lifecycle de snapshots
- `05-cost-optimization-lambda.ts` - Lambda functions para optimización
- `06-scheduled-scaling.ts` - Scheduled scaling basado en patrones

**Conceptos clave:**
- Automated shutdown schedules
- Orphan resource detection
- Cost optimization automation
- Infrastructure as Code para FinOps

---

## 📊 Progreso Recomendado

### Semanas 1-2: Fundamentos FinOps
- [ ] Principios de FinOps y cultura de costos
- [ ] Modelos de pricing: On-Demand, Reserved, Spot
- [ ] Calculadoras de TCO y ROI

### Semanas 3-4: Monitorización
- [ ] CloudWatch Billing metrics
- [ ] AWS Budgets y alertas
- [ ] Cost Explorer para análisis

### Semanas 5-6: Optimización Cómputo
- [ ] Lambda vs Fargate cost analysis
- [ ] EC2 Rightsizing
- [ ] Spot Instances strategies

### Semanas 7-8: Optimización Storage
- [ ] S3 Storage Classes y tiering
- [ ] EBS optimization (gp2 → gp3)
- [ ] Data lifecycle management

### Semanas 9-10: Arquitectura Cost-Aware
- [ ] Serverless cost modeling
- [ ] ROI calculators
- [ ] Cost-saving patterns

### Semanas 11-12: Gobierno y Automatización
- [ ] Tagging strategies
- [ ] Cost policies con SCPs
- [ ] Automation de optimizaciones

---

## 🎯 Hitos de Aprendizaje

**Después del Nivel 1:** Comprendes principios FinOps y modelos de pricing
**Después del Nivel 2:** Implementas monitorización y alertas de costos
**Después del Nivel 3:** Optimizas costos de cómputo (Lambda, EC2, Fargate)
**Después del Nivel 4:** Optimizas costos de almacenamiento (S3, EBS)
**Después del Nivel 5:** Diseñas arquitecturas cost-aware con ROI
**Después del Nivel 6:** Implementas gobierno y automatización de costos

---

## 💡 Casos de Uso por Nivel

**Nivel 1:** "¿Debo usar Reserved Instances o Savings Plans?"
**Nivel 2:** "Cómo configurar alertas cuando mi factura supere $10k"
**Nivel 3:** "¿Lambda o Fargate para mi API con 1M requests/día?"
**Nivel 4:** "Reducir costos de S3 de $50k/mes a $15k/mes"
**Nivel 5:** "Calcular ROI de migrar de EC2 a serverless"
**Nivel 6:** "Automatizar shutdown de recursos dev fuera de horario laboral"

---

**¡Usa este índice para navegar rápidamente entre ejercicios!** 💰☁️
