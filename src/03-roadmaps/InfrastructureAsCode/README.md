# 🏗️ Roadmap de Aprendizaje: Infrastructure as Code (Terraform/CDK) con TypeScript

## 📚 Tabla de Contenidos
- [Nivel 1: Fundamentos de IaC](#nivel-1-fundamentos-de-iac)
- [Nivel 2: Terraform Básico](#nivel-2-terraform-básico)
- [Nivel 3: AWS CDK con TypeScript](#nivel-3-aws-cdk-con-typescript)
- [Nivel 4: Patrones y Best Practices](#nivel-4-patrones-y-best-practices)
- [Nivel 5: Multi-Cloud y Arquitecturas Avanzadas](#nivel-5-multi-cloud-y-arquitecturas-avanzadas)
- [Nivel 6: GitOps, Seguridad y Producción](#nivel-6-gitops-seguridad-y-producción)
- [Recursos y Práctica](#recursos-y-práctica)

---

## Nivel 1: Fundamentos de IaC

### 1.1 Conceptos Básicos de Infrastructure as Code
**Tiempo estimado: 1-2 semanas**

- [ ] **¿Qué es Infrastructure as Code?**
  - Definición y evolución histórica
  - Infraestructura declarativa vs imperativa
  - Beneficios: reproducibilidad, versionamiento, automatización
  - Eliminar "trabajo manual" y "click-ops"
  - Reducir drift de configuración
  - Documentation as code
  - Disaster recovery y business continuity

- [ ] **Comparación de Herramientas IaC**
  - Terraform (HashiCorp)
  - AWS CDK (AWS Cloud Development Kit)
  - Pulumi
  - CloudFormation
  - Ansible vs Terraform
  - Cuándo usar cada herramienta
  - Matriz de comparación detallada

- [ ] **Conceptos Core de IaC**
  - Estado (State) e idempotencia
  - Recursos y dependencias
  - Providers y módulos
  - Variables y outputs
  - Dry-run y plan
  - Drift detection
  - Ejercicio: Infraestructura manual vs IaC comparison

### 1.2 Preparación del Entorno
**Tiempo estimado: 1 semana**

- [ ] **Instalación de Herramientas**
  - Terraform CLI installation
  - AWS CDK installation
  - Node.js y npm (20+)
  - AWS CLI configuration
  - Azure CLI (opcional)
  - Google Cloud SDK (opcional)
  - Docker para testing local

- [ ] **Configuración de Credenciales**
  - AWS credentials setup
  - IAM roles y políticas
  - Service accounts (GCP)
  - Service principals (Azure)
  - Credential management best practices
  - aws-vault, aws-sso
  - Ejercicio: Multi-account AWS setup

- [ ] **TypeScript Setup para IaC**
  - TypeScript configuration
  - Type definitions para providers
  - Linting y formatting
  - Testing frameworks (Jest)
  - VSCode extensions útiles
  - Ejercicio: Proyecto IaC base con TypeScript

### 1.3 Fundamentos de Cloud Computing
**Tiempo estimado: 1-2 semanas**

- [ ] **Networking Basics**
  - VPC, subnets, CIDR blocks
  - Security groups y NACLs
  - Route tables y Internet Gateways
  - NAT Gateways y VPC Endpoints
  - VPN y Direct Connect
  - Ejercicio: Diseñar arquitectura de red

- [ ] **Compute y Storage**
  - EC2, ECS, EKS concepts
  - Auto Scaling Groups
  - Load Balancers (ALB, NLB)
  - S3, EBS, EFS storage
  - Ejercicio: Comparar opciones de compute

- [ ] **Seguridad Básica**
  - IAM roles, policies, users
  - Encryption at rest y in transit
  - Secrets management
  - Compliance basics
  - Ejercicio: Security baseline setup

---

## Nivel 2: Terraform Básico

### 2.1 Terraform Fundamentals
**Tiempo estimado: 2-3 semanas**

- [ ] **Lenguaje HCL (HashiCorp Configuration Language)**
  - Sintaxis básica de HCL
  - Blocks, arguments, expressions
  - Variables y locals
  - Data sources
  - Outputs
  - Comments y formatting
  - Ejercicio: Primer archivo .tf

- [ ] **Terraform Workflow**
  - terraform init
  - terraform plan
  - terraform apply
  - terraform destroy
  - terraform validate
  - terraform fmt
  - Ejercicio: Deploy simple EC2 instance

- [ ] **Estado de Terraform (State)**
  - Qué es el state file
  - Local vs remote state
  - State locking
  - State manipulation commands
  - terraform import
  - terraform state mv/rm
  - Ejercicio: Migrar state local a S3

### 2.2 Recursos y Data Sources
**Tiempo estimado: 2-3 semanas**

- [ ] **Definición de Recursos**
  - Resource blocks
  - Resource arguments
  - Meta-arguments (count, for_each, depends_on)
  - Lifecycle rules
  - Timeouts
  - Provisioners (cuando evitarlos)
  - Ejercicio: VPC con subnets públicas/privadas

- [ ] **Data Sources**
  - Buscar recursos existentes
  - AMI lookups
  - Availability zones
  - VPC y subnet discovery
  - Ejercicio: Referenciar recursos existentes

- [ ] **Variables y Outputs**
  - Variable types (string, number, bool, list, map)
  - Variable validation
  - Sensitive variables
  - tfvars files
  - Output values
  - Ejercicio: Módulo parametrizado

### 2.3 Terraform Modules
**Tiempo estimado: 2-3 semanas**

- [ ] **Creación de Módulos**
  - Estructura de módulos
  - Input variables
  - Output values
  - Module composition
  - Versioning de módulos
  - Ejercicio: Módulo de networking

- [ ] **Uso de Módulos**
  - Module sources (local, git, registry)
  - Module versioning
  - Terraform Registry
  - Módulos públicos vs privados
  - Ejercicio: Usar módulos del registry

- [ ] **Best Practices de Módulos**
  - Single responsibility
  - Composability
  - Documentación
  - Testing de módulos
  - Ejercicio: Refactor a módulos reusables

### 2.4 Terraform State Management
**Tiempo estimado: 2 semanas**

- [ ] **Remote State**
  - S3 backend con DynamoDB locking
  - Terraform Cloud
  - Azure Storage backend
  - GCS backend
  - Ejercicio: Setup remote state con S3

- [ ] **State Collaboration**
  - Multi-developer workflows
  - State locking strategies
  - State file segmentation
  - Workspaces
  - Ejercicio: Team collaboration setup

- [ ] **State Troubleshooting**
  - State drift detection
  - Manual state fixes
  - State recovery
  - Import existing resources
  - Ejercicio: Resolver drift conflicts

---

## Nivel 3: AWS CDK con TypeScript

### 3.1 CDK Fundamentals
**Tiempo estimado: 2-3 semanas**

- [ ] **Conceptos de CDK**
  - CDK vs CloudFormation vs Terraform
  - Constructs (L1, L2, L3)
  - Stacks y Apps
  - Synthesis (cdk synth)
  - Deployment (cdk deploy)
  - Ventajas de CDK con TypeScript
  - Ejercicio: Hello World CDK app

- [ ] **CDK Project Structure**
  - App y Stack organization
  - bin/ y lib/ directories
  - cdk.json configuration
  - Testing structure
  - Multi-stack applications
  - Ejercicio: Multi-stack CDK project

- [ ] **Constructs Deep Dive**
  - L1 Constructs (CFN resources)
  - L2 Constructs (high-level)
  - L3 Constructs (patterns)
  - Custom constructs
  - Construct libraries
  - Ejercicio: Crear custom construct

### 3.2 CDK Core Concepts
**Tiempo estimado: 2-3 semanas**

- [ ] **Working with Stacks**
  - Stack props y configuration
  - Cross-stack references
  - Stack dependencies
  - Nested stacks
  - StackSets
  - Ejercicio: Multi-stack architecture

- [ ] **Assets y Bundling**
  - Lambda assets
  - Docker assets
  - S3 assets
  - Bundling con esbuild
  - Asset customization
  - Ejercicio: Lambda con dependencies

- [ ] **CDK Parameters y Context**
  - Environment variables
  - Context values
  - Feature flags
  - Runtime context
  - cdk.context.json
  - Ejercicio: Parameterized stacks

### 3.3 CDK Patterns y Libraries
**Tiempo estimado: 2-3 semanas**

- [ ] **AWS Solutions Constructs**
  - Pre-built patterns
  - aws-apigateway-lambda
  - aws-s3-lambda
  - aws-eventbridge-lambda
  - Ejercicio: Implementar solution construct

- [ ] **CDK Pipelines**
  - Self-mutating pipelines
  - CodePipeline integration
  - GitHub Actions con CDK
  - Multi-stage deployments
  - Ejercicio: CI/CD pipeline con CDK

- [ ] **Testing CDK Code**
  - Unit tests con Jest
  - Snapshot tests
  - Fine-grained assertions
  - Integration tests
  - Ejercicio: Test suite completo

### 3.4 Advanced CDK
**Tiempo estimado: 2 semanas**

- [ ] **Custom Resources**
  - Lambda-backed custom resources
  - Provider framework
  - Custom resource lifecycle
  - Ejercicio: Custom resource implementation

- [ ] **Aspects**
  - IAspect interface
  - Tag all resources
  - Security validations
  - Compliance checks
  - Ejercicio: Custom aspects

- [ ] **CDK Escape Hatches**
  - addOverride
  - addPropertyOverride
  - Accessing L1 constructs
  - Raw CloudFormation
  - Ejercicio: Override default behaviors

---

## Nivel 4: Patrones y Best Practices

### 4.1 Design Patterns para IaC
**Tiempo estimado: 2-3 semanas**

- [ ] **Immutable Infrastructure**
  - Concepto y beneficios
  - Blue/Green deployments
  - AMI/Container immutability
  - Ejercicio: Immutable deployment pattern

- [ ] **GitOps Fundamentals**
  - Git como source of truth
  - Pull-based deployments
  - Automated reconciliation
  - ArgoCD, Flux concepts
  - Ejercicio: GitOps workflow setup

- [ ] **Environment Parity**
  - Dev, staging, production
  - Configuración por environment
  - Promotion workflows
  - Ejercicio: Multi-environment setup

### 4.2 Code Organization
**Tiempo estimado: 2 semanas**

- [ ] **Mono-repo vs Multi-repo**
  - Ventajas y desventajas
  - Workspaces strategy
  - Dependency management
  - Ejercicio: Evaluar estrategia para proyecto

- [ ] **Directory Structure**
  - Separación por environment
  - Separación por service
  - Módulos compartidos
  - Ejercicio: Reestructurar proyecto

- [ ] **DRY Principles**
  - Módulos reutilizables
  - Variable abstraction
  - Template generation
  - Ejercicio: Eliminar duplicación

### 4.3 State Management Patterns
**Tiempo estimado: 2 semanas**

- [ ] **State Segmentation**
  - Por environment
  - Por service/component
  - Blast radius reduction
  - Ejercicio: Segmentar state monolítico

- [ ] **Cross-Stack References**
  - Outputs y data sources
  - SSM Parameter Store
  - Secrets Manager
  - Service discovery
  - Ejercicio: Inter-stack communication

- [ ] **State Migration**
  - Refactoring strategies
  - Zero-downtime migrations
  - State import/export
  - Ejercicio: Migrate resources sin downtime

### 4.4 Testing Strategies
**Tiempo estimado: 2-3 semanas**

- [ ] **Unit Testing**
  - Terraform: terratest
  - CDK: Jest assertions
  - Mock testing
  - Ejercicio: Unit tests para módulos

- [ ] **Integration Testing**
  - Kitchen-Terraform
  - LocalStack
  - Real environment testing
  - Ejercicio: Integration test suite

- [ ] **Policy Testing**
  - OPA (Open Policy Agent)
  - Sentinel (Terraform Cloud)
  - Custom policies
  - Compliance as code
  - Ejercicio: Security policies

---

## Nivel 5: Multi-Cloud y Arquitecturas Avanzadas

### 5.1 Multi-Cloud Fundamentals
**Tiempo estimado: 2-3 semanas**

- [ ] **Multi-Cloud Strategy**
  - Por qué multi-cloud
  - Vendor lock-in mitigation
  - Best-of-breed services
  - Cost optimization
  - Disaster recovery
  - Regulatory compliance

- [ ] **Terraform Multi-Cloud**
  - Multiple providers
  - Provider aliasing
  - Cross-provider networking
  - Ejercicio: AWS + Azure setup

- [ ] **CDK Multi-Cloud (CDKTF)**
  - CDK for Terraform
  - TypeScript para multi-cloud
  - Constructs cross-provider
  - Ejercicio: CDKTF con AWS y GCP

### 5.2 Azure con IaC
**Tiempo estimado: 2-3 semanas**

- [ ] **Terraform con Azure**
  - azurerm provider
  - Resource groups
  - Virtual networks
  - App Services
  - AKS (Azure Kubernetes)
  - Ejercicio: Complete Azure stack

- [ ] **Azure Bicep**
  - Bicep vs Terraform
  - Bicep syntax
  - Modules
  - Cuándo usar Bicep
  - Ejercicio: Compare Bicep vs Terraform

- [ ] **CDK para Azure (experimental)**
  - CDKTF con Azure
  - Ejercicio: CDK app con Azure resources

### 5.3 Google Cloud Platform
**Tiempo estimado: 2-3 semanas**

- [ ] **Terraform con GCP**
  - google provider
  - Projects y organizations
  - VPC networks
  - Compute Engine
  - GKE (Google Kubernetes)
  - Cloud Functions
  - Ejercicio: GCP infrastructure

- [ ] **GCP Deployment Manager**
  - Deployment Manager vs Terraform
  - Jinja templates
  - Python templates
  - Ejercicio: Compare approaches

- [ ] **Multi-Region GCP**
  - Global load balancing
  - Multi-region deployments
  - Disaster recovery
  - Ejercicio: Global GCP architecture

### 5.4 Kubernetes con IaC
**Tiempo estimado: 3-4 semanas**

- [ ] **Cluster Provisioning**
  - EKS con Terraform/CDK
  - AKS con Terraform
  - GKE con Terraform
  - Self-managed clusters
  - Ejercicio: Production-ready EKS

- [ ] **Kubernetes Resources con IaC**
  - Terraform Kubernetes provider
  - CDK8s
  - Helm charts con Terraform
  - GitOps con ArgoCD
  - Ejercicio: Complete K8s deployment

- [ ] **Service Mesh y Networking**
  - Istio/Linkerd provisioning
  - Network policies
  - Ingress controllers
  - Ejercicio: Service mesh setup

---

## Nivel 6: GitOps, Seguridad y Producción

### 6.1 GitOps Avanzado
**Tiempo estimado: 2-3 semanas**

- [ ] **CI/CD Pipelines**
  - GitHub Actions
  - GitLab CI
  - Jenkins
  - Atlantis for Terraform
  - Automated planning
  - Ejercicio: Complete CI/CD pipeline

- [ ] **Pull Request Workflows**
  - Automated terraform plan
  - Policy enforcement
  - Cost estimation
  - Security scanning
  - Ejercicio: PR-based workflow

- [ ] **Deployment Strategies**
  - Rolling deployments
  - Blue/Green
  - Canary
  - Feature flags
  - Ejercicio: Advanced deployment strategy

### 6.2 Security y Compliance
**Tiempo estimado: 2-3 semanas**

- [ ] **Secret Management**
  - AWS Secrets Manager
  - HashiCorp Vault
  - SOPS (Secrets OPerationS)
  - Encrypted state files
  - Ejercicio: Secure secrets workflow

- [ ] **Security Scanning**
  - tfsec
  - Checkov
  - Terrascan
  - Snyk IaC
  - Ejercicio: Security pipeline integration

- [ ] **Compliance as Code**
  - Policy as Code
  - OPA policies
  - Sentinel policies
  - CIS benchmarks
  - Ejercicio: Compliance automation

### 6.3 Cost Management
**Tiempo estimado: 2 semanas**

- [ ] **Cost Estimation**
  - Infracost
  - AWS Cost Calculator
  - Terraform cost modules
  - Budget alerts
  - Ejercicio: Cost tracking setup

- [ ] **Cost Optimization**
  - Right-sizing
  - Reserved instances
  - Spot instances
  - S3 lifecycle policies
  - Ejercicio: Reduce costs 30%

- [ ] **FinOps Practices**
  - Tagging strategy
  - Cost allocation
  - Chargeback models
  - Ejercicio: FinOps dashboard

### 6.4 Observability
**Tiempo estimado: 2 semanas**

- [ ] **Infrastructure Monitoring**
  - CloudWatch dashboards
  - Datadog integration
  - Prometheus/Grafana
  - Ejercicio: Monitoring as code

- [ ] **Change Tracking**
  - CloudTrail
  - Config rules
  - Drift detection automation
  - Ejercicio: Drift alerting system

- [ ] **Incident Response**
  - Runbooks as code
  - Automated remediation
  - Disaster recovery
  - Ejercicio: DR automation

### 6.5 Advanced Topics
**Tiempo estimado: 2-3 semanas**

- [ ] **Service Catalogs**
  - AWS Service Catalog
  - Self-service infrastructure
  - Vending machines
  - Ejercicio: Self-service platform

- [ ] **Platform Engineering**
  - Internal developer platforms
  - Abstraction layers
  - Golden paths
  - Ejercicio: Platform design

- [ ] **Terraform Enterprise/Cloud**
  - Workspace management
  - Sentinel policies
  - Private registry
  - Team collaboration
  - Ejercicio: Terraform Cloud setup

### 6.6 Proyecto Final Integrador
**Tiempo estimado: 6-8 semanas**

- [ ] **Plataforma Multi-Cloud E-commerce Completa**

**Arquitectura:**
  - Frontend: CloudFront + S3 (AWS)
  - API Layer: API Gateway + Lambda (AWS)
  - Container Platform: EKS (AWS) + AKS (Azure) multi-region
  - Database: RDS Multi-AZ + DynamoDB
  - Cache: ElastiCache Redis
  - Search: Elasticsearch
  - CDN: CloudFront + Azure CDN
  - Monitoring: Datadog multi-cloud
  - Secrets: Vault cluster
  - CI/CD: GitHub Actions + ArgoCD
  - Disaster Recovery: Multi-region active-active

**IaC Requirements:**
  - Todo en Terraform modules + CDK
  - GitOps workflow completo
  - Automated testing (terratest)
  - Security scanning (tfsec, Checkov)
  - Cost tracking (Infracost)
  - Policy enforcement (OPA)
  - Multi-environment (dev/staging/prod)
  - Zero-downtime deployments
  - Self-healing infrastructure
  - Complete documentation

**Funcionalidades:**
  - Auto-scaling global
  - Multi-region failover
  - Automated backups
  - Security compliance (CIS)
  - Cost optimization
  - Observability completa
  - Disaster recovery testing
  - Chaos engineering

---

## 📖 Recursos y Práctica

### Libros Recomendados
1. **"Terraform: Up & Running"** - Yevgeniy Brikman
2. **"Infrastructure as Code"** - Kief Morris
3. **"The Terraform Book"** - James Turnbull
4. **"AWS CDK in Action"** - Matthew Bonig
5. **"Cloud Native Infrastructure"** - Justin Garrison, Kris Nova
6. **"Site Reliability Engineering"** - Google

### Recursos Online
- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [HashiCorp Learn](https://learn.hashicorp.com/)
- [CDK Patterns](https://cdkpatterns.com/)
- [Terraform Registry](https://registry.terraform.io/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [CDK Workshop](https://cdkworkshop.com/)
- [Terragrunt](https://terragrunt.gruntwork.io/)

### Herramientas Esenciales
- **Terraform**: Provisioning declarativo
- **AWS CDK**: Infraestructura con TypeScript
- **Terragrunt**: Terraform wrapper para DRY
- **Terratest**: Testing framework
- **tfsec**: Security scanner
- **Checkov**: Policy scanner
- **Infracost**: Cost estimation
- **Atlantis**: PR automation
- **LocalStack**: Local AWS testing
- **CDK8s**: Kubernetes con CDK

### Práctica Recomendada

#### Ejercicios Diarios (30-60 min)
- Crear pequeños módulos de Terraform
- Explorar nuevos recursos de CDK
- Leer documentación de providers
- Refactorizar código existente

#### Ejercicios Semanales (3-5 horas)
- Implementar un patrón arquitectónico
- Crear módulo reutilizable
- Setup de nuevo environment
- Security audit de infraestructura

#### Proyectos Mensuales (10-20 horas)
- Proyectos integradores al final de cada nivel
- Contribuir a módulos open source
- Crear módulos internos de empresa
- Blog posts sobre aprendizajes

### Sistema de Evaluación

#### Por cada herramienta/concepto:
- [ ] Entender el problema que resuelve
- [ ] Conocer alternativas
- [ ] Implementar desde cero
- [ ] Identificar cuándo usar y cuándo NO usar
- [ ] Conocer best practices y anti-patterns
- [ ] Hacer al menos 2-3 ejercicios prácticos
- [ ] Documentar aprendizajes

#### Criterios de Dominio:
- **Básico**: Puedes implementar siguiendo tutoriales
- **Intermedio**: Puedes diseñar infraestructura simple
- **Avanzado**: Puedes diseñar arquitecturas complejas
- **Experto**: Puedes optimizar y crear abstracciones

---

## 🎯 Plan de Estudio Sugerido

### Opción Intensiva (4-5 meses)
- 20-30 horas/semana
- Enfoque full-time en aprendizaje
- Completar todos los niveles secuencialmente
- Cloud Budget: ~$100-200/mes

### Opción Moderada (8-10 meses)
- 10-15 horas/semana
- Balance con trabajo
- Profundizar en cada herramienta
- Cloud Budget: ~$50-100/mes

### Opción Pausada (12-15 meses)
- 5-10 horas/semana
- Aprendizaje sostenible
- Máxima retención y práctica
- Cloud Budget: ~$30-50/mes

---

## 💰 Gestión de Costos Cloud

### AWS Free Tier
- EC2: 750 horas/mes t2.micro (primeros 12 meses)
- S3: 5GB storage
- Lambda: 1M requests/mes
- RDS: 750 horas/mes db.t2.micro
- CloudFormation: Gratis

### Consejos para Minimizar Costos
1. **Usar Free Tier al máximo**
2. **Configurar billing alerts** (budget $10, $50, $100)
3. **Destruir recursos después de práctica** (`terraform destroy`)
4. **Usar LocalStack para testing**
5. **Tags para tracking de costos**
6. **Auto-shutdown scripts** (Lambda para stop EC2s)
7. **Spot instances para testing**
8. **Revisar AWS Cost Explorer semanalmente**
9. **Usar Infracost en PRs**
10. **S3 lifecycle policies**

---

## 🚀 Consejos para el Éxito

1. **Destruye todo después de practicar** - Costos se acumulan rápido
2. **Configura billing alerts desde día 1** - No sorpresas
3. **Versiona TODO en Git** - IaC sin Git no es IaC
4. **Automatiza desde el inicio** - Manual es el enemigo
5. **Documenta tus decisiones** - README.md en cada módulo
6. **Aprende HCL y TypeScript bien** - Son tus lenguajes
7. **Lee state files** - Entiende qué maneja Terraform
8. **Practica con proyectos reales** - No solo tutoriales
9. **Únete a comunidades** - HashiCorp Community, CDK Slack
10. **Certifícate** - HashiCorp Certified Terraform Associate
11. **Experimenta pero en sandbox** - Nunca en producción directo
12. **Diseña para fallos** - Todo falla, prepárate
13. **Monitorea drift** - Infraestructura cambia sin avisar
14. **Testing es crucial** - Infraestructura también se testea
15. **Mantente actualizado** - Providers cambian frecuentemente

---

## 📝 Tracking de Progreso

### Formato de Registro

Para cada concepto completado, registra:
```
Herramienta/Concepto: [Nombre]
Fecha: [DD/MM/YYYY]
Tiempo invertido: [X horas]
Costo Cloud: [$X.XX]
Nivel de comprensión: [Básico/Intermedio/Avanzado/Experto]
Ejercicios completados: [X/Y]
Repositorio GitHub: [URL]
Notas: [Insights, dificultades, optimizaciones, costos incurridos]
```

### Milestones

- [ ] **Mes 1**: Fundamentos y primer recurso desplegado
- [ ] **Mes 2**: Terraform módulos y remote state
- [ ] **Mes 3**: CDK completo con testing
- [ ] **Mes 4**: Patrones avanzados implementados
- [ ] **Mes 5**: Multi-cloud funcional
- [ ] **Mes 6**: GitOps y CI/CD completo
- [ ] **Mes 7-8**: Security y compliance
- [ ] **Mes 9-12**: Proyecto final y certificación

---

## 🎓 Próximos Pasos

1. **Crea cuentas cloud** (AWS, Azure, GCP - free tier)
2. **Configura MFA y billing alerts** (seguridad y costos)
3. **Instala herramientas** (Terraform, CDK, AWS CLI)
4. **Crea primer recurso** (S3 bucket con Terraform)
5. **Crea primer CDK app** (Lambda function)
6. **Únete a comunidades** (HashiCorp forums, CDK Slack)
7. **Crea repositorio de aprendizaje** (GitHub público)
8. **Planifica presupuesto cloud** (billing alerts!)
9. **Decide tu plan de estudio** (Intensivo/Moderado/Pausado)
10. **Comienza con Nivel 1** (fundamentos primero)

---

## 🏆 Certificaciones Recomendadas

### Orden Sugerido:
1. **HashiCorp Certified: Terraform Associate** (fundamental)
2. **AWS Certified Solutions Architect - Associate** (arquitectura cloud)
3. **AWS Certified DevOps Engineer - Professional** (avanzado)
4. **Certified Kubernetes Administrator (CKA)** (si trabajas con K8s)

---

## 🔥 Proyectos de Práctica Sugeridos

### Nivel Principiante:
- Static website (S3 + CloudFront con Terraform)
- Lambda function deployment (CDK)
- VPC con subnets públicas/privadas

### Nivel Intermedio:
- Auto-scaling web app (ALB + ASG + RDS)
- EKS cluster completo
- Multi-environment setup (dev/staging/prod)

### Nivel Avanzado:
- Multi-cloud platform (proyecto final)
- Service mesh deployment
- Complete CI/CD pipeline con GitOps
- Multi-region disaster recovery

---

## 💡 Anti-Patterns a Evitar

❌ **Nunca**:
1. State files en repositorio Git
2. Credenciales hardcodeadas
3. Manual changes sin actualizar IaC
4. Módulos sin versioning
5. Deploying directo a producción
6. Sin testing de infraestructura
7. Módulos monolíticos
8. Ignorar drift detection
9. Sin documentación
10. Copiar-pegar código sin entender

---

## 🌟 Habilidades que Obtendrás

Al completar este roadmap dominarás:

✅ Automatización completa de infraestructura
✅ Eliminar trabajo manual de deployments
✅ Multi-cloud deployments
✅ Terraform avanzado (modules, state, providers)
✅ AWS CDK con TypeScript
✅ GitOps workflows
✅ Security as code
✅ Cost optimization
✅ Disaster recovery automation
✅ CI/CD para infraestructura
✅ Compliance as code
✅ Infrastructure testing

---

**¡Buena suerte en tu viaje hacia la maestría en Infrastructure as Code!** 🚀

*Recuerda: El objetivo no es conocer todos los recursos cloud, sino dominar la automatización y eliminar el trabajo manual. IaC es sobre reproducibilidad, versionamiento y colaboración. Empieza simple, destruye recursos después de practicar, y construye incrementalmente.*

**Pro tip**: Configura `terraform destroy` o `cdk destroy` en un cron job para apagar todo automáticamente y evitar costos innecesarios. La mejor práctica es infraestructura efímera - créala cuando necesitas, destrúyela cuando terminas.
