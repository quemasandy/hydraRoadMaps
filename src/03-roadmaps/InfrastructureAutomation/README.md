# 🏗️ Roadmap de Aprendizaje: Infraestructura Moderna con AWS CDK y Terraform

## 📚 Tabla de Contenidos
- [Nivel 1: Fundamentos de IaC](#nivel-1-fundamentos-de-iac)
- [Nivel 2: AWS CDK Básico](#nivel-2-aws-cdk-básico)
- [Nivel 3: Terraform Fundamentals](#nivel-3-terraform-fundamentals)
- [Nivel 4: Arquitecturas Avanzadas](#nivel-4-arquitecturas-avanzadas)
- [Nivel 5: CI/CD y Automatización](#nivel-5-cicd-y-automatización)
- [Nivel 6: Multi-Cloud y Patrones Expertos](#nivel-6-multi-cloud-y-patrones-expertos)
- [Recursos y Práctica](#recursos-y-práctica)

---

## Nivel 1: Fundamentos de IaC

### 1.1 Introducción a Infrastructure as Code
**Tiempo estimado: 1-2 semanas**

- [ ] **¿Qué es Infrastructure as Code?**
  - Definición y filosofía
  - Ventajas sobre configuración manual
  - Desventajas y trade-offs
  - Casos de uso ideales
  - Comparación: IaC vs ClickOps
  - Reproducibilidad y versionado
  - Documentación como código

- [ ] **Conceptos Fundamentales**
  - Declarativo vs Imperativo
  - Immutable Infrastructure
  - Idempotencia
  - State management
  - Drift detection
  - Plan, Apply, Destroy lifecycle
  - Resource dependencies

- [ ] **Panorama de Herramientas IaC**
  - CloudFormation (AWS nativo)
  - AWS CDK (Cloud Development Kit)
  - Terraform (multi-cloud)
  - Pulumi (código general-purpose)
  - Ansible (configuration management)
  - Comparativa y cuándo usar cada una
  - Ejercicio: Evaluar herramientas para tu caso de uso

### 1.2 Fundamentos de AWS
**Tiempo estimado: 2-3 semanas**

- [ ] **AWS Core Services**
  - VPC y networking (subnets, route tables, IGW)
  - EC2 (instancias, security groups)
  - S3 (buckets, policies)
  - IAM (usuarios, roles, policies)
  - RDS (bases de datos relacionales)
  - Lambda (compute serverless)
  - CloudWatch (logs y métricas)
  - Ejercicio: Arquitectura básica en consola

- [ ] **AWS Well-Architected Framework**
  - 6 pilares: Operational Excellence, Security, Reliability, Performance, Cost Optimization, Sustainability
  - Best practices por pilar
  - Design principles
  - Ejercicio: Evaluar arquitectura con Well-Architected Tool

- [ ] **Modelo de Seguridad AWS**
  - Shared Responsibility Model
  - IAM best practices
  - Least privilege principle
  - Resource policies vs Identity policies
  - Service Control Policies (SCPs)
  - Ejercicio: Diseñar estrategia IAM

### 1.3 Fundamentos de Infraestructura
**Tiempo estimado: 1-2 semanas**

- [ ] **Networking Básico**
  - CIDR notation y subnetting
  - Public vs Private subnets
  - NAT Gateway vs NAT Instance
  - Route tables y routing
  - Security Groups vs NACLs
  - Ejercicio: Diseñar VPC multi-AZ

- [ ] **Conceptos de Compute**
  - Virtual machines vs Containers vs Serverless
  - Auto Scaling Groups
  - Load Balancers (ALB, NLB, CLB)
  - Placement strategies
  - Ejercicio: Arquitectura escalable básica

- [ ] **Storage y Database Patterns**
  - Block storage (EBS)
  - Object storage (S3)
  - File systems (EFS)
  - Relational (RDS) vs NoSQL (DynamoDB)
  - Caching strategies (ElastiCache)
  - Ejercicio: Seleccionar storage apropiado

---

## Nivel 2: AWS CDK Básico

### 2.1 Introducción a AWS CDK
**Tiempo estimado: 2-3 semanas**

- [ ] **Fundamentos de CDK**
  - ¿Qué es CDK y por qué usarlo?
  - CDK vs CloudFormation
  - CDK vs Terraform
  - Ventajas de usar lenguajes de programación
  - TypeScript como lenguaje preferido
  - Instalación y setup
  - Ejercicio: Primer proyecto CDK

- [ ] **Conceptos Core de CDK**
  - App (aplicación CDK)
  - Stack (unidad de despliegue)
  - Construct (building block)
  - L1, L2, L3 constructs
  - Construct Library
  - Context values
  - Ejercicio: Crear stack con múltiples constructs

- [ ] **CDK CLI y Workflow**
  - `cdk init` - inicializar proyecto
  - `cdk synth` - generar CloudFormation
  - `cdk diff` - ver cambios
  - `cdk deploy` - desplegar
  - `cdk destroy` - eliminar
  - `cdk bootstrap` - setup inicial
  - Ejercicio: Ciclo completo de deployment

### 2.2 Constructs y Patterns
**Tiempo estimado: 2-3 semanas**

- [ ] **L1 Constructs (CFN Resources)**
  - Mapeo 1:1 con CloudFormation
  - Prefijo `Cfn`
  - Cuándo usar L1 constructs
  - Escape hatches
  - Ejercicio: Migrar CloudFormation a CDK L1

- [ ] **L2 Constructs (Curated)**
  - Abstracciones con sensible defaults
  - Grant methods para permisos
  - Métodos de conveniencia
  - Ejemplos: Bucket, Function, Table
  - Ejercicio: Refactorizar L1 a L2

- [ ] **L3 Constructs (Patterns)**
  - Patrones arquitectónicos completos
  - AWS Solutions Constructs
  - Construct Hub
  - Crear custom constructs
  - Ejercicio: Implementar patrón con L3

- [ ] **Props e Interfaces**
  - Tipado fuerte con TypeScript
  - Props immutables
  - Builder pattern
  - Default values
  - Ejercicio: Constructs configurables

### 2.3 Recursos Básicos con CDK
**Tiempo estimado: 3-4 semanas**

- [ ] **Networking con CDK**
  - VPC construct
  - Subnets y subnet selection
  - Security Groups
  - NACLs
  - VPC Peering
  - Ejercicio: VPC multi-tier completa

- [ ] **Compute con CDK**
  - EC2 instances
  - Auto Scaling Groups
  - Load Balancers (ALB/NLB)
  - Launch Templates
  - User Data scripts
  - Ejercicio: Web app escalable

- [ ] **Storage con CDK**
  - S3 Buckets
  - Bucket policies
  - Lifecycle rules
  - Versioning y encryption
  - EBS volumes
  - Ejercicio: Static website hosting

- [ ] **Serverless con CDK**
  - Lambda functions
  - API Gateway
  - DynamoDB tables
  - Lambda layers
  - Event sources
  - Ejercicio: REST API serverless

### 2.4 IAM y Seguridad en CDK
**Tiempo estimado: 2-3 semanas**

- [ ] **IAM Roles y Policies**
  - Role construct
  - PolicyStatement
  - Managed policies
  - Grant methods (`bucket.grantRead()`)
  - Service principals
  - Ejercicio: Roles con least privilege

- [ ] **Security Best Practices**
  - Secrets Manager integration
  - Parameter Store
  - KMS encryption
  - Certificate Manager
  - WAF rules
  - Ejercicio: Aplicación segura end-to-end

- [ ] **Cross-Stack References**
  - Stack outputs y exports
  - ImportValue
  - CfnOutput
  - Stack dependencies
  - Ejercicio: Arquitectura multi-stack

---

## Nivel 3: Terraform Fundamentals

### 3.1 Introducción a Terraform
**Tiempo estimado: 2-3 semanas**

- [ ] **Fundamentos de Terraform**
  - ¿Qué es Terraform?
  - HashiCorp Configuration Language (HCL)
  - Terraform vs otros IaC tools
  - Terraform workflow
  - Instalación y setup
  - Providers concept
  - Ejercicio: Primer proyecto Terraform

- [ ] **Sintaxis HCL**
  - Bloques: resource, data, variable, output
  - Argumentos y atributos
  - Expresiones y funciones
  - Interpolation
  - Comentarios
  - Formatting con `terraform fmt`
  - Ejercicio: Refactorizar JSON a HCL

- [ ] **Terraform CLI**
  - `terraform init` - inicializar
  - `terraform plan` - preview changes
  - `terraform apply` - aplicar cambios
  - `terraform destroy` - eliminar recursos
  - `terraform validate` - validar sintaxis
  - `terraform show` - inspeccionar state
  - Ejercicio: Workflow completo

### 3.2 State Management
**Tiempo estimado: 2-3 semanas**

- [ ] **Terraform State Basics**
  - ¿Qué es el state?
  - terraform.tfstate file
  - State locking
  - State refresh
  - State drift detection
  - Manual state manipulation
  - Ejercicio: Inspeccionar y modificar state

- [ ] **Remote State**
  - S3 backend con DynamoDB locking
  - Terraform Cloud
  - Ventajas del remote state
  - State encryption
  - Backup strategies
  - Ejercicio: Configurar S3 backend

- [ ] **State Collaboration**
  - State locking en equipos
  - Remote state data source
  - Workspaces
  - State isolation
  - Ejercicio: Setup para equipos

### 3.3 Resources y Data Sources
**Tiempo estimado: 3-4 semanas**

- [ ] **AWS Provider**
  - Configuración del provider
  - Authentication methods
  - Provider versioning
  - Multiple providers (multi-region)
  - Alias providers
  - Ejercicio: Multi-region setup

- [ ] **Resources Fundamentals**
  - Resource syntax
  - Meta-arguments (count, for_each, depends_on)
  - Resource addressing
  - Lifecycle rules
  - Ejercicio: Crear recursos básicos (VPC, EC2, S3)

- [ ] **Data Sources**
  - Querying existing resources
  - AMI lookups
  - Availability zones
  - VPC discovery
  - Ejercicio: Referencias a recursos existentes

- [ ] **Dependencies**
  - Implicit dependencies
  - Explicit dependencies (depends_on)
  - Dependency graph
  - Ejercicio: Arquitectura con dependencias complejas

### 3.4 Variables y Outputs
**Tiempo estimado: 2 semanas**

- [ ] **Input Variables**
  - Variable types (string, number, bool, list, map, object)
  - Default values
  - Variable validation
  - Sensitive variables
  - Variable files (.tfvars)
  - Environment variables
  - Ejercicio: Configuración parametrizable

- [ ] **Output Values**
  - Output syntax
  - Output dependencies
  - Sensitive outputs
  - Querying outputs
  - Ejercicio: Outputs útiles para debugging

- [ ] **Locals**
  - Local values
  - DRY principle
  - Computed values
  - Ejercicio: Refactorizar con locals

---

## Nivel 4: Arquitecturas Avanzadas

### 4.1 CDK Avanzado
**Tiempo estimado: 3-4 semanas**

- [ ] **Custom Constructs**
  - Crear bibliotecas de constructs
  - Construct composition
  - Construct testing con Jest
  - Publishing a npm
  - Ejercicio: Biblioteca de company patterns

- [ ] **Aspects y Tagging**
  - IAspect interface
  - Tag propagation
  - Policy enforcement
  - Cost allocation tags
  - Ejercicio: Compliance automation

- [ ] **CDK Pipelines**
  - Self-mutating pipelines
  - Multi-stage deployment
  - Approval gates
  - Testing stages
  - Ejercicio: Pipeline completo CI/CD

- [ ] **Testing en CDK**
  - Fine-grained assertions
  - Snapshot tests
  - Template validation
  - Integration tests
  - Ejercicio: Test suite completo

### 4.2 Terraform Avanzado
**Tiempo estimado: 3-4 semanas**

- [ ] **Modules**
  - ¿Qué son los modules?
  - Module structure
  - Public registry modules
  - Private modules
  - Module versioning
  - Module composition
  - Ejercicio: Crear módulo reutilizable

- [ ] **Dynamic Blocks**
  - Dynamic content generation
  - for_each en blocks
  - Conditional resources
  - Complex objects
  - Ejercicio: Configuración dinámica

- [ ] **Functions**
  - Built-in functions (lookup, merge, concat)
  - String functions
  - Collection functions
  - Type conversion
  - Ejercicio: Transformaciones complejas

- [ ] **Provisioners**
  - local-exec provisioner
  - remote-exec provisioner
  - file provisioner
  - null_resource
  - Cuándo NO usar provisioners
  - Ejercicio: Bootstrap instances

### 4.3 Arquitecturas Multi-Tier
**Tiempo estimado: 3-4 semanas**

- [ ] **3-Tier Architecture con CDK**
  - Presentation tier (ALB, CloudFront)
  - Application tier (ECS, Lambda)
  - Data tier (RDS, DynamoDB)
  - Networking completo
  - Ejercicio: E-commerce architecture

- [ ] **3-Tier Architecture con Terraform**
  - Modularización por tiers
  - Outputs entre módulos
  - Variable passing
  - Ejercicio: Mismo e-commerce en Terraform

- [ ] **High Availability Patterns**
  - Multi-AZ deployments
  - Auto Scaling
  - Health checks
  - Disaster recovery
  - Ejercicio: HA architecture

- [ ] **Microservices Infrastructure**
  - ECS/Fargate clusters
  - Service discovery
  - API Gateway
  - Shared services
  - Ejercicio: Microservices platform

### 4.4 Observability como Código
**Tiempo estimado: 2-3 semanas**

- [ ] **Monitoring con IaC**
  - CloudWatch dashboards
  - Custom metrics
  - Log groups y retention
  - Metric alarms
  - Ejercicio: Observability completa

- [ ] **Alerting y Notifications**
  - SNS topics
  - CloudWatch alarms
  - EventBridge rules
  - PagerDuty integration
  - Ejercicio: On-call alerting setup

- [ ] **Tracing y APM**
  - X-Ray con CDK/Terraform
  - Service maps
  - Distributed tracing
  - Ejercicio: End-to-end tracing

---

## Nivel 5: CI/CD y Automatización

### 5.1 Pipelines de Infraestructura
**Tiempo estimado: 3-4 semanas**

- [ ] **CDK Pipelines Deep Dive**
  - CodePipeline integration
  - GitHub Actions para CDK
  - GitLab CI/CD
  - Pipeline stages
  - Artifact management
  - Ejercicio: Multi-account pipeline

- [ ] **Terraform en CI/CD**
  - terraform plan en PR
  - Auto-apply strategies
  - State locking en pipelines
  - Atlantis setup
  - Terraform Cloud workflows
  - Ejercicio: GitHub Actions con Terraform

- [ ] **Testing Strategies**
  - Unit tests (constructs/modules)
  - Integration tests
  - End-to-end tests
  - Policy as Code (OPA, Sentinel)
  - Ejercicio: Comprehensive test suite

- [ ] **Approval Workflows**
  - Manual approvals
  - Automated policy checks
  - Cost estimation gates
  - Security scanning
  - Ejercicio: Enterprise approval process

### 5.2 Multi-Account Strategy
**Tiempo estimado: 2-3 semanas**

- [ ] **AWS Organizations**
  - Account structure
  - Organizational Units (OUs)
  - Service Control Policies
  - Consolidated billing
  - Ejercicio: Org structure design

- [ ] **Cross-Account Deployments**
  - CDK cross-account stacks
  - Terraform assume role
  - Pipeline permissions
  - Ejercicio: Deploy to multiple accounts

- [ ] **Landing Zone Patterns**
  - AWS Control Tower
  - Account Factory
  - Guardrails
  - Centralized logging
  - Ejercicio: Landing zone setup

### 5.3 GitOps y Automation
**Tiempo estimado: 2-3 semanas**

- [ ] **GitOps Principles**
  - Git as source of truth
  - Pull-based deployments
  - Drift detection automation
  - Self-healing systems
  - Ejercicio: GitOps workflow

- [ ] **Drift Detection**
  - CDK diff automation
  - Terraform plan monitoring
  - Alerting on drift
  - Remediation strategies
  - Ejercicio: Drift monitoring system

- [ ] **Self-Service Infrastructure**
  - Service catalogs
  - Template repositories
  - Developer portals
  - Ejercicio: Platform engineering setup

### 5.4 Security Automation
**Tiempo estimado: 2-3 semanas**

- [ ] **Security Scanning**
  - cfn-nag para CloudFormation
  - tfsec para Terraform
  - Checkov (multi-tool)
  - Custom policy checks
  - Ejercicio: Security gates en pipeline

- [ ] **Secrets Management**
  - AWS Secrets Manager
  - Parameter Store
  - External Secrets Operator
  - Rotation automation
  - Ejercicio: Secrets lifecycle

- [ ] **Compliance as Code**
  - AWS Config rules
  - Security Hub
  - Automated remediation
  - Audit logs
  - Ejercicio: Compliance framework

---

## Nivel 6: Multi-Cloud y Patrones Expertos

### 6.1 Multi-Cloud con Terraform
**Tiempo estimado: 3-4 semanas**

- [ ] **Terraform Multi-Provider**
  - AWS + Azure providers
  - AWS + GCP providers
  - Provider configurations
  - Resource naming strategies
  - Ejercicio: Hybrid cloud architecture

- [ ] **Cloud-Agnostic Patterns**
  - Abstraction layers
  - Provider-agnostic modules
  - Conditional resources
  - Ejercicio: Portable infrastructure

- [ ] **Multi-Cloud Networking**
  - VPN connections
  - Direct Connect / ExpressRoute
  - Transit Gateway
  - Ejercicio: Cross-cloud connectivity

### 6.2 Advanced CDK Patterns
**Tiempo estimado: 3-4 semanas**

- [ ] **CDK for Kubernetes (CDK8s)**
  - Kubernetes manifests con código
  - Helm integration
  - Custom resources
  - Ejercicio: K8s app deployment

- [ ] **CDK for Terraform (CDKTF)**
  - Terraform con TypeScript
  - Provider bindings
  - Comparing CDKTF vs native Terraform
  - Ejercicio: Migrar HCL a CDKTF

- [ ] **Projen para CDK**
  - Project scaffolding
  - Build automation
  - Publishing workflows
  - Ejercicio: Projen-based construct library

### 6.3 Advanced Terraform Patterns
**Tiempo estimado: 3-4 semanas**

- [ ] **Terraform Workspaces**
  - Workspace strategies
  - Environment isolation
  - State per workspace
  - Ejercicio: Multi-environment setup

- [ ] **Module Composition Patterns**
  - Composite modules
  - Module federation
  - Versioning strategies
  - Breaking changes management
  - Ejercicio: Module ecosystem

- [ ] **Terraform Providers Development**
  - Custom providers
  - Provider plugins
  - Testing providers
  - Ejercicio: Simple custom provider

### 6.4 Cost Optimization
**Tiempo estimado: 2-3 semanas**

- [ ] **FinOps con IaC**
  - Cost tagging strategies
  - Budget enforcement
  - Cost Explorer integration
  - Reserved Instance automation
  - Ejercicio: Cost optimization dashboard

- [ ] **Resource Right-Sizing**
  - Automated instance sizing
  - Spot instance integration
  - Savings Plans
  - Ejercicio: Cost reduction pipeline

- [ ] **Infrastructure Lifecycle**
  - Automated cleanup
  - TTL for dev environments
  - Scheduled scaling
  - Ejercicio: Environment lifecycle automation

### 6.5 Platform Engineering
**Tiempo estimado: 3-4 semanas**

- [ ] **Internal Developer Platforms**
  - Self-service portals
  - Backstage integration
  - Golden paths
  - Ejercicio: Developer platform

- [ ] **Infrastructure Templates**
  - Cookiecutter for IaC
  - Yeoman generators
  - Template repositories
  - Ejercicio: Template library

- [ ] **Policy-Driven Infrastructure**
  - Open Policy Agent (OPA)
  - Sentinel (Terraform Cloud)
  - AWS Service Catalog
  - Ejercicio: Policy framework

### 6.6 Proyecto Final Integrador
**Tiempo estimado: 8-12 semanas**

- [ ] **Plataforma SaaS Multi-Tenant Completa**

**Arquitectura híbrida (CDK + Terraform):**
  - Landing Zone (Terraform)
  - Networking (Terraform modules)
  - Shared services (CDK)
  - Application stacks (CDK)
  - Multi-account setup (Organizations)
  - Multi-region deployment
  - DR strategy

**Componentes:**
  - Frontend: S3 + CloudFront (CDK)
  - API: API Gateway + ECS/Fargate (CDK)
  - Auth: Cognito multi-tenant (CDK)
  - Database: RDS Aurora multi-tenant (Terraform)
  - Caching: ElastiCache (Terraform)
  - Queue: SQS/SNS (CDK)
  - Storage: S3 con lifecycle (Terraform)
  - Search: OpenSearch (Terraform)
  - Analytics: Kinesis + Athena (CDK)

**CI/CD:**
  - GitHub Actions pipeline
  - Multi-environment (dev/staging/prod)
  - Automated testing
  - Security scanning
  - Cost gates
  - Approval workflows

**Observability:**
  - CloudWatch dashboards
  - X-Ray tracing
  - Centralized logging
  - Custom metrics
  - Alerting

**Security:**
  - WAF rules
  - Secrets rotation
  - Encryption at rest/transit
  - Compliance checks
  - Audit logging

**FinOps:**
  - Cost allocation tags
  - Budget alerts
  - Reserved capacity
  - Automated scaling

**Requisitos técnicos:**
  - TypeScript con CDK
  - HCL con Terraform
  - Modules reutilizables
  - >80% test coverage
  - GitOps workflow
  - Infrastructure documentation
  - Runbooks automatizados

---

## 📖 Recursos y Práctica

### Libros Recomendados
1. **"Terraform: Up & Running"** - Yevgeniy Brikman
2. **"Infrastructure as Code"** - Kief Morris
3. **"The CDK Book"** - Thorsten Hoeger, Sathyajith Bhat
4. **"Cloud Native Infrastructure"** - Justin Garrison, Kris Nova
5. **"AWS Well-Architected Framework"** - AWS Whitepapers
6. **"Site Reliability Engineering"** - Google

### Recursos Online
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [Terraform Documentation](https://www.terraform.io/docs)
- [Terraform Registry](https://registry.terraform.io/)
- [Construct Hub](https://constructs.dev/)
- [AWS Solutions Constructs](https://aws.amazon.com/solutions/constructs/)
- [CDK Patterns](https://cdkpatterns.com/)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)
- [AWS Samples GitHub](https://github.com/aws-samples)

### Cursos Recomendados
- HashiCorp Certified: Terraform Associate
- AWS Certified DevOps Engineer - Professional
- A Cloud Guru - Infrastructure as Code courses
- Linux Academy - Terraform Deep Dive
- Udemy - AWS CDK Masterclass

### Comunidades
- [CDK Slack](https://cdk.dev)
- [Terraform Discuss](https://discuss.hashicorp.com/c/terraform-core)
- [r/terraform on Reddit](https://www.reddit.com/r/Terraform/)
- [r/aws on Reddit](https://www.reddit.com/r/aws/)
- [AWS Community Builders](https://aws.amazon.com/developer/community/community-builders/)

### Práctica Recomendada

#### Ejercicios Diarios (30-60 min)
- Crear pequeños módulos/constructs
- Refactorizar IaC existente
- Experimentar con nuevos recursos
- Leer código de proyectos open source

#### Ejercicios Semanales (3-5 horas)
- Implementar patrón arquitectónico completo
- Crear módulo reutilizable
- Setup de pipeline CI/CD
- Migrar infraestructura manual a código

#### Proyectos Mensuales (10-20 horas)
- Proyectos integradores al final de cada nivel
- Contribuir a módulos open source
- Crear bibliotecas de constructs/modules
- Blog posts sobre aprendizajes

### Sistema de Evaluación

#### Por cada herramienta/patrón:
- [ ] Entender el problema que resuelve
- [ ] Conocer sintaxis y API
- [ ] Implementar desde cero
- [ ] Identificar cuándo usar y cuándo NO usar
- [ ] Conocer best practices y anti-patterns
- [ ] Hacer al menos 2-3 ejercicios prácticos
- [ ] Implementar en proyecto real

#### Criterios de Dominio:
- **Básico**: Puedes seguir ejemplos y tutoriales
- **Intermedio**: Puedes diseñar infraestructura simple
- **Avanzado**: Puedes diseñar arquitecturas complejas
- **Experto**: Puedes optimizar, troubleshoot y enseñar

---

## 🎯 Plan de Estudio Sugerido

### Opción Intensiva (4-6 meses)
- 20-30 horas/semana
- Enfoque full-time en aprendizaje
- Completar todos los niveles secuencialmente
- Proyecto final completo
- Budget AWS: ~$100-200/mes

### Opción Moderada (8-12 meses)
- 10-15 horas/semana
- Balance con trabajo
- Profundizar en cada concepto
- Proyectos incrementales
- Budget AWS: ~$50-100/mes

### Opción Pausada (12-18 meses)
- 5-10 horas/semana
- Aprendizaje sostenible
- Máxima retención y práctica
- Budget AWS: ~$30-50/mes

---

## 💰 Gestión de Costos AWS

### Free Tier Relevante
- EC2: 750 horas/mes t2.micro (primeros 12 meses)
- S3: 5GB storage (primeros 12 meses)
- RDS: 750 horas/mes db.t2.micro (primeros 12 meses)
- Lambda: 1M requests/mes
- CloudWatch: 10 custom metrics

### Consejos para Minimizar Costos
1. **Usar Free Tier al máximo**
2. **terraform destroy después de practicar**
3. **cdk destroy para limpiar recursos**
4. **Configurar billing alerts** ($10, $50, $100)
5. **Usar tags para tracking**
6. **Scheduled shutdown de recursos dev**
7. **Spot instances para testing**
8. **Revisar Cost Explorer semanalmente**
9. **Automatizar cleanup con Lambda**
10. **Usar LocalStack para testing local**

### Scripts de Limpieza
```bash
# Terraform
terraform destroy -auto-approve

# CDK
cdk destroy --all

# AWS CLI - listar recursos huérfanos
aws resourcegroupstaggingapi get-resources \
  --tag-filters Key=Environment,Values=test
```

---

## 🚀 Consejos para el Éxito

1. **Empieza con un proyecto real** - No solo tutoriales
2. **Versiona todo desde día 1** - Git es fundamental
3. **Escribe documentación** - Future-you te lo agradecerá
4. **Automatiza temprano** - CI/CD desde el inicio
5. **Practica disaster recovery** - Destruye y reconstruye
6. **Lee código de otros** - GitHub es tu biblioteca
7. **Contribuye a open source** - Aprende de code reviews
8. **Certifícate** - Terraform Associate, AWS DevOps
9. **Construye un portafolio** - GitHub + blog posts
10. **Enseña lo que aprendes** - Talks, mentoring
11. **Monitorea costos obsesivamente** - FinOps mindset
12. **Diseña para resiliencia** - Todo falla
13. **Security first** - Nunca hardcodear secrets
14. **Test everything** - Infraestructura también se prueba
15. **Mantente actualizado** - AWS/Terraform evolucionan rápido

---

## 📝 Tracking de Progreso

### Formato de Registro

Para cada servicio/patrón completado, registra:
```
Servicio/Patrón: [Nombre]
Fecha: [DD/MM/YYYY]
Tiempo invertido: [X horas]
Costo AWS: [$X.XX]
Herramienta: [CDK/Terraform]
Nivel de comprensión: [Básico/Intermedio/Avanzado/Experto]
Ejercicios completados: [X/Y]
Proyecto GitHub: [URL]
Notas: [Insights, dificultades, optimizaciones]
```

### Milestones

- [ ] **Mes 1**: Fundamentos y primer stack CDK/Terraform
- [ ] **Mes 2**: VPC completa y recursos compute
- [ ] **Mes 3**: Arquitectura serverless end-to-end
- [ ] **Mes 4**: Terraform modules y CDK constructs
- [ ] **Mes 5**: CI/CD pipeline funcional
- [ ] **Mes 6**: Multi-account setup
- [ ] **Mes 7-8**: Arquitecturas avanzadas
- [ ] **Mes 9-12**: Proyecto final y certificaciones

---

## 🎓 Próximos Pasos

1. **Evalúa tu nivel actual** (AWS knowledge, programación)
2. **Instala herramientas** (AWS CLI, CDK, Terraform)
3. **Crea cuenta AWS dedicada** (no mezcles con producción)
4. **Configura billing alerts** (crítico!)
5. **Elige CDK o Terraform para empezar** (luego aprende el otro)
6. **Deploya tu primera infraestructura** (VPC simple)
7. **Únete a comunidades** (Slack, Discord, Reddit)
8. **Crea repositorio de aprendizaje** (GitHub público)
9. **Decide tu plan de estudio** (Intensivo/Moderado/Pausado)
10. **Comienza con Nivel 1** (no saltes pasos)

---

## 🏆 Certificaciones Recomendadas

### Orden Sugerido:
1. **HashiCorp Certified: Terraform Associate** (fundamental Terraform)
2. **AWS Certified Solutions Architect - Associate** (arquitectura AWS)
3. **AWS Certified Developer - Associate** (servicios AWS)
4. **AWS Certified DevOps Engineer - Professional** (avanzado IaC)
5. **Certified Kubernetes Administrator (CKA)** (opcional, containers)

---

## 🔥 Proyectos de Práctica Sugeridos

### Nivel Principiante:
- Static website (S3 + CloudFront)
- VPC multi-tier básica
- Lambda + API Gateway
- EC2 con Auto Scaling

### Nivel Intermedio:
- WordPress en ECS/Fargate
- CI/CD pipeline para IaC
- Multi-region failover
- Monitoring stack completo

### Nivel Avanzado:
- SaaS platform completa (proyecto final)
- Multi-account landing zone
- Kubernetes cluster con addons
- Data lake con analytics
- Multi-cloud deployment

---

## 💡 Comparativa Rápida: CDK vs Terraform

### Cuándo usar AWS CDK:
✅ Infraestructura exclusivamente AWS
✅ Equipo con fuerte background en TypeScript/Python/Java
✅ Necesitas abstracción de alto nivel (L3 constructs)
✅ Integración nativa con servicios AWS
✅ Quieres aprovechar el ecosistema de programming language
✅ Testing robusto con frameworks de testing estándar

### Cuándo usar Terraform:
✅ Multi-cloud (AWS + Azure + GCP)
✅ Equipo prefiere declarative syntax
✅ Necesitas ecosistema maduro de modules
✅ State management robusto desde día 1
✅ HCL como lenguaje simple y específico
✅ Terraform Cloud/Enterprise para governance

### Por qué aprender AMBOS:
- **CDK** domina para serverless y servicios AWS nativos
- **Terraform** es estándar de industria para multi-cloud
- **CDK para Terraform (CDKTF)** combina lo mejor de ambos
- **Versatilidad profesional** - más oportunidades laborales
- **Diferentes contextos** - startups (CDK) vs enterprise (Terraform)

---

## 🛠️ Herramientas Complementarias

### Linting y Validation
- **cfn-nag** - CloudFormation security scanning
- **tfsec** - Terraform security scanner
- **Checkov** - Multi-tool security scanner
- **terraform-compliance** - BDD testing
- **cdk-nag** - CDK security checks

### Cost Management
- **Infracost** - Cost estimates en CI/CD
- **AWS Cost Explorer** - Análisis de costos
- **Cloud Custodian** - Policy enforcement
- **Komiser** - Cloud cost optimization

### Documentation
- **terraform-docs** - Auto-generar README
- **CDK API Reference** - Generated docs
- **Diagrams as Code** - Architecture diagrams (Python diagrams, d2)

### Testing
- **Terratest** - Go-based infrastructure testing
- **Kitchen-Terraform** - Test Kitchen for Terraform
- **CDK Testing Matchers** - Jest assertions for CDK
- **LocalStack** - Local AWS cloud stack

---

**¡Buena suerte en tu viaje hacia la maestría en Infraestructura como Código!** 🚀

*Recuerda: El objetivo NO es eliminar completamente los "trámites manuales" de un día para otro, sino construir un framework reproducible que te permita desplegar arquitecturas complejas con confianza. La automatización real viene de la práctica constante y la iteración continua.*

**Pro tip**: Destruye y reconstruye tu infraestructura regularmente. Si no puedes hacer `terraform destroy` o `cdk destroy` y reconstruir desde cero en minutos, tu IaC no es verdaderamente reproducible. Practica hasta que sea muscle memory.

**Meta inmediata alcanzada**: Después de completar Nivel 1-3, serás capaz de desplegar una arquitectura serverless completa con un solo comando (`terraform apply` o `cdk deploy`), sin ningún paso manual. 🎯
