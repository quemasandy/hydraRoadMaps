# 📑 Índice Completo - Infraestructura Moderna con AWS CDK y Terraform

## 🎯 Inicio Rápido
- [README Principal](./README.md) - Roadmap completo de aprendizaje
- [Quick Start Guide](./QUICK_START.md) - Guía de inicio rápido

## 📚 Contenido por Nivel

### Nivel 1: Fundamentos de IaC
**Ubicación:** `01-fundamentos/`

#### Introducción a IaC
- `introduccion-iac/README.md` - ¿Qué es IaC? Ventajas, desventajas, casos de uso
- `introduccion-iac/01-manual-vs-iac.md` - Comparativa ClickOps vs IaC
- `introduccion-iac/02-herramientas-comparativa.md` - CloudFormation, CDK, Terraform, Pulumi

#### Fundamentos de AWS
- `fundamentos-aws/01-core-services.md` - VPC, EC2, S3, IAM, RDS, Lambda
- `fundamentos-aws/02-well-architected.md` - 6 pilares del Well-Architected Framework
- `fundamentos-aws/03-seguridad-iam.md` - IAM best practices y estrategias

#### Fundamentos de Infraestructura
- `fundamentos-infra/01-networking.md` - CIDR, subnets, routing
- `fundamentos-infra/02-compute-patterns.md` - VMs vs Containers vs Serverless
- `fundamentos-infra/03-storage-database.md` - Selección de storage apropiado
- `fundamentos-infra/ejercicio-vpc-design.md` - Diseño de VPC multi-AZ

---

### Nivel 2: AWS CDK Básico
**Ubicación:** `02-cdk-basico/`

#### Introducción a CDK
- `intro-cdk/README.md` - ¿Qué es CDK? Instalación y setup
- `intro-cdk/01-hello-world.ts` - Primer stack CDK
  - Estructura de proyecto
  - CDK CLI básico
  - Deploy workflow

#### Conceptos Core
- `conceptos-core/01-app-stack-construct.ts` - App, Stack, Construct
  - L1, L2, L3 constructs
  - Construct tree
  - Context values

- `conceptos-core/02-props-interfaces.ts` - Tipado con TypeScript
  - Props immutables
  - Default values
  - Builder pattern

#### Recursos Básicos
- `recursos-basicos/01-networking.ts` - VPC, Subnets, Security Groups
  - VPC construct
  - Subnet selection
  - CIDR allocation

- `recursos-basicos/02-compute.ts` - EC2, Auto Scaling, Load Balancers
  - Instance configuration
  - Launch templates
  - User data scripts

- `recursos-basicos/03-storage.ts` - S3 Buckets
  - Bucket policies
  - Lifecycle rules
  - Encryption

- `recursos-basicos/04-serverless.ts` - Lambda, API Gateway, DynamoDB
  - Function props
  - API integration
  - Event sources

#### IAM y Seguridad
- `iam-seguridad/01-roles-policies.ts` - IAM Roles y Policies
  - PolicyStatement
  - Grant methods
  - Service principals

- `iam-seguridad/02-secrets.ts` - Secrets Manager y Parameter Store
  - Secret rotation
  - Secure string parameters

- `iam-seguridad/03-cross-stack.ts` - Cross-stack references
  - Stack outputs
  - ImportValue
  - Dependencies

---

### Nivel 3: Terraform Fundamentals
**Ubicación:** `03-terraform-fundamentals/`

#### Introducción a Terraform
- `intro-terraform/README.md` - ¿Qué es Terraform? Instalación
- `intro-terraform/01-hello-world.tf` - Primer proyecto Terraform
  - HCL syntax
  - Providers
  - Basic workflow

#### State Management
- `state-management/01-state-basics.md` - Terraform State
  - terraform.tfstate
  - State locking
  - Drift detection

- `state-management/02-remote-state.tf` - S3 Backend
  - S3 + DynamoDB locking
  - State encryption
  - Backup strategies

- `state-management/03-workspaces.md` - Terraform Workspaces
  - Environment isolation
  - Workspace strategies

#### Resources y Data Sources
- `resources-data/01-aws-provider.tf` - AWS Provider configuration
  - Authentication
  - Multi-region setup
  - Provider versioning

- `resources-data/02-resources.tf` - Resources fundamentals
  - Resource syntax
  - Meta-arguments (count, for_each, depends_on)
  - Lifecycle rules

- `resources-data/03-data-sources.tf` - Data sources
  - AMI lookups
  - VPC discovery
  - Querying existing resources

- `resources-data/04-dependencies.tf` - Dependencies
  - Implicit vs explicit
  - Dependency graph

#### Variables y Outputs
- `variables-outputs/01-input-variables.tf` - Input Variables
  - Variable types
  - Validation
  - tfvars files

- `variables-outputs/02-outputs.tf` - Output values
  - Output syntax
  - Sensitive outputs

- `variables-outputs/03-locals.tf` - Local values
  - DRY principle
  - Computed values

---

### Nivel 4: Arquitecturas Avanzadas
**Ubicación:** `04-arquitecturas-avanzadas/`

#### CDK Avanzado
- `cdk-avanzado/01-custom-constructs.ts` - Custom Constructs
  - Construct composition
  - Testing con Jest
  - Publishing a npm

- `cdk-avanzado/02-aspects-tagging.ts` - Aspects y Tagging
  - IAspect interface
  - Policy enforcement
  - Tag propagation

- `cdk-avanzado/03-cdk-pipelines.ts` - CDK Pipelines
  - Self-mutating pipelines
  - Multi-stage deployment
  - Approval gates

- `cdk-avanzado/04-testing.test.ts` - Testing en CDK
  - Fine-grained assertions
  - Snapshot tests
  - Integration tests

#### Terraform Avanzado
- `terraform-avanzado/01-modules/` - Terraform Modules
  - Module structure
  - Public registry
  - Module versioning
  - Composition patterns

- `terraform-avanzado/02-dynamic-blocks.tf` - Dynamic Blocks
  - Dynamic content generation
  - for_each in blocks
  - Conditional resources

- `terraform-avanzado/03-functions.tf` - Built-in Functions
  - String functions
  - Collection functions
  - Type conversion

- `terraform-avanzado/04-provisioners.tf` - Provisioners
  - local-exec, remote-exec
  - null_resource
  - Cuándo NO usar provisioners

#### Arquitecturas Multi-Tier
- `multi-tier/01-cdk-3tier.ts` - 3-Tier con CDK
  - Presentation tier
  - Application tier
  - Data tier

- `multi-tier/02-terraform-3tier/` - 3-Tier con Terraform
  - Modularización
  - Variable passing
  - Outputs entre módulos

- `multi-tier/03-high-availability.ts` - HA Patterns
  - Multi-AZ deployments
  - Auto Scaling
  - Health checks

- `multi-tier/04-microservices.ts` - Microservices Infrastructure
  - ECS/Fargate clusters
  - Service discovery
  - API Gateway

#### Observability
- `observability/01-monitoring.ts` - Monitoring como Código
  - CloudWatch dashboards
  - Custom metrics
  - Log groups

- `observability/02-alerting.ts` - Alerting
  - SNS topics
  - CloudWatch alarms
  - PagerDuty integration

- `observability/03-tracing.ts` - X-Ray Tracing
  - Service maps
  - Distributed tracing

---

### Nivel 5: CI/CD y Automatización
**Ubicación:** `05-cicd-automatizacion/`

#### Pipelines de Infraestructura
- `pipelines/01-cdk-pipeline.ts` - CDK Pipeline completo
  - CodePipeline integration
  - Multi-account deployment
  - Testing stages

- `pipelines/02-terraform-cicd/` - Terraform en CI/CD
  - GitHub Actions workflow
  - terraform plan en PR
  - Auto-apply strategies
  - Atlantis setup

- `pipelines/03-testing-strategies.md` - Testing
  - Unit tests
  - Integration tests
  - Policy as Code (OPA)

- `pipelines/04-approval-workflows.md` - Approval gates
  - Manual approvals
  - Cost estimation
  - Security scanning

#### Multi-Account Strategy
- `multi-account/01-organizations.md` - AWS Organizations
  - Account structure
  - OUs y SCPs
  - Consolidated billing

- `multi-account/02-cross-account-deploy.ts` - Cross-account deployments
  - CDK cross-account
  - Terraform assume role
  - Pipeline permissions

- `multi-account/03-landing-zone.md` - Landing Zone
  - AWS Control Tower
  - Account Factory
  - Guardrails

#### GitOps y Automation
- `gitops/01-principles.md` - GitOps Principles
  - Git as source of truth
  - Pull-based deployments
  - Self-healing

- `gitops/02-drift-detection.md` - Drift Detection
  - CDK diff automation
  - Terraform plan monitoring
  - Remediation strategies

- `gitops/03-self-service.md` - Self-service Infrastructure
  - Service catalogs
  - Template repositories
  - Developer portals

#### Security Automation
- `security-auto/01-scanning.md` - Security Scanning
  - cfn-nag, tfsec, Checkov
  - Pipeline integration
  - Custom policies

- `security-auto/02-secrets-mgmt.ts` - Secrets Management
  - AWS Secrets Manager
  - Rotation automation
  - External Secrets Operator

- `security-auto/03-compliance.md` - Compliance as Code
  - AWS Config rules
  - Security Hub
  - Automated remediation

---

### Nivel 6: Multi-Cloud y Patrones Expertos
**Ubicación:** `06-multi-cloud-expertos/`

#### Multi-Cloud con Terraform
- `multi-cloud/01-multi-provider.tf` - Terraform Multi-Provider
  - AWS + Azure
  - AWS + GCP
  - Provider configurations

- `multi-cloud/02-cloud-agnostic/` - Cloud-Agnostic Modules
  - Abstraction layers
  - Conditional resources
  - Portable infrastructure

- `multi-cloud/03-networking.tf` - Multi-Cloud Networking
  - VPN connections
  - Cross-cloud connectivity

#### Advanced CDK Patterns
- `advanced-cdk/01-cdk8s.ts` - CDK for Kubernetes
  - K8s manifests con código
  - Helm integration
  - Custom resources

- `advanced-cdk/02-cdktf.ts` - CDK for Terraform
  - Terraform con TypeScript
  - Provider bindings
  - CDKTF vs HCL

- `advanced-cdk/03-projen.ts` - Projen
  - Project scaffolding
  - Build automation
  - Publishing workflows

#### Advanced Terraform Patterns
- `advanced-terraform/01-workspaces.md` - Workspaces avanzado
  - Workspace strategies
  - Environment isolation
  - State per workspace

- `advanced-terraform/02-module-composition/` - Module Composition
  - Composite modules
  - Module federation
  - Versioning strategies

- `advanced-terraform/03-custom-provider/` - Custom Providers
  - Provider development
  - Plugin architecture
  - Testing providers

#### Cost Optimization
- `cost-optimization/01-finops.md` - FinOps con IaC
  - Cost tagging
  - Budget enforcement
  - Reserved capacity

- `cost-optimization/02-right-sizing.ts` - Resource Right-Sizing
  - Automated instance sizing
  - Spot instances
  - Savings Plans

- `cost-optimization/03-lifecycle.ts` - Infrastructure Lifecycle
  - Automated cleanup
  - TTL for environments
  - Scheduled scaling

#### Platform Engineering
- `platform-eng/01-idp.md` - Internal Developer Platform
  - Self-service portals
  - Backstage integration
  - Golden paths

- `platform-eng/02-templates/` - Infrastructure Templates
  - Cookiecutter
  - Yeoman generators
  - Template library

- `platform-eng/03-policy-driven.md` - Policy-Driven Infrastructure
  - Open Policy Agent
  - Sentinel
  - AWS Service Catalog

---

## 🛠️ Archivos de Configuración

### CDK
- `examples/cdk/cdk.json` - CDK configuration
- `examples/cdk/package.json` - Dependencies
- `examples/cdk/tsconfig.json` - TypeScript config
- `examples/cdk/.gitignore` - Git ignore patterns

### Terraform
- `examples/terraform/.terraform.lock.hcl` - Provider lock
- `examples/terraform/backend.tf` - Remote state config
- `examples/terraform/providers.tf` - Provider configs
- `examples/terraform/variables.tf` - Variable definitions
- `examples/terraform/terraform.tfvars.example` - Example values
- `examples/terraform/.gitignore` - Git ignore patterns

### CI/CD
- `.github/workflows/cdk-deploy.yml` - GitHub Actions for CDK
- `.github/workflows/terraform-plan.yml` - Terraform plan on PR
- `.github/workflows/terraform-apply.yml` - Terraform apply on merge
- `.gitlab-ci.yml.example` - GitLab CI example

---

## 📊 Progreso Recomendado

### Semanas 1-2: Fundamentos
✅ Entender IaC y sus beneficios
✅ Conocer servicios AWS core
✅ Diseñar primera VPC

### Semanas 3-5: CDK Básico
✅ Primer stack CDK
✅ Recursos básicos (VPC, EC2, S3)
✅ Lambda + API Gateway

### Semanas 6-8: Terraform Fundamentals
✅ Primer proyecto Terraform
✅ State management
✅ Modules básicos

### Semanas 9-12: Arquitecturas Avanzadas
✅ Custom constructs/modules
✅ 3-tier architecture
✅ Testing de infraestructura

### Semanas 13-16: CI/CD
✅ Pipeline CDK
✅ Terraform en GitHub Actions
✅ Multi-account setup

### Semanas 17-24: Multi-Cloud y Expertos
✅ Terraform multi-cloud
✅ CDKTF exploration
✅ Platform engineering
✅ Proyecto final

---

## 🎯 Proyectos de Práctica por Nivel

### Nivel 1 - Fundamentos
**Proyecto:** VPC Multi-Tier Básica
- ✅ VPC con 3 subnets (public, private, data)
- ✅ Internet Gateway y NAT Gateway
- ✅ Route tables configuradas
- ✅ Security Groups básicos
- ✅ Documentación de CIDR ranges

### Nivel 2 - CDK Básico
**Proyecto:** Static Website con CDN
- ✅ S3 bucket con website hosting
- ✅ CloudFront distribution
- ✅ Route 53 DNS
- ✅ ACM certificate
- ✅ CI/CD para deploy de contenido

### Nivel 3 - Terraform Fundamentals
**Proyecto:** WordPress en EC2
- ✅ EC2 con Auto Scaling
- ✅ RDS MySQL
- ✅ Application Load Balancer
- ✅ ElastiCache para caching
- ✅ Módulos reutilizables

### Nivel 4 - Arquitecturas Avanzadas
**Proyecto:** Microservices Platform
- ✅ ECS/Fargate cluster
- ✅ Service discovery (Cloud Map)
- ✅ API Gateway
- ✅ DynamoDB tables
- ✅ CloudWatch dashboards
- ✅ X-Ray tracing

### Nivel 5 - CI/CD
**Proyecto:** Multi-Account Landing Zone
- ✅ AWS Organizations setup
- ✅ Cuenta de management
- ✅ Cuentas de dev/staging/prod
- ✅ Pipeline que deploya a múltiples cuentas
- ✅ Centralized logging
- ✅ Security scanning en pipeline

### Nivel 6 - Multi-Cloud y Expertos
**Proyecto:** SaaS Platform Multi-Tenant
- ✅ Frontend: CloudFront + S3
- ✅ API: API Gateway + ECS/Fargate
- ✅ Auth: Cognito multi-tenant
- ✅ Database: Aurora PostgreSQL
- ✅ Cache: ElastiCache Redis
- ✅ Queue: SQS/SNS
- ✅ Search: OpenSearch
- ✅ Analytics: Kinesis + Athena
- ✅ Multi-region setup
- ✅ DR strategy
- ✅ Cost optimization automática
- ✅ Comprehensive monitoring

---

## 📖 Recursos de Referencia

### AWS CDK
- [CDK API Reference](https://docs.aws.amazon.com/cdk/api/v2/)
- [CDK Patterns](https://cdkpatterns.com/)
- [AWS Solutions Constructs](https://aws.amazon.com/solutions/constructs/)
- [Construct Hub](https://constructs.dev/)

### Terraform
- [Terraform Registry](https://registry.terraform.io/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)
- [Terraform Modules Examples](https://github.com/terraform-aws-modules)

### AWS Well-Architected
- [Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS Architecture Center](https://aws.amazon.com/architecture/)
- [AWS Solutions Library](https://aws.amazon.com/solutions/)

---

## 💡 Tips Rápidos

### CDK
```typescript
// Usar L2 constructs siempre que sea posible
const bucket = new s3.Bucket(this, 'MyBucket', {
  encryption: s3.BucketEncryption.S3_MANAGED,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Grant methods para IAM
bucket.grantRead(myLambda);
```

### Terraform
```hcl
# Usar variables para reusabilidad
variable "environment" {
  type        = string
  description = "Environment name"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Must be dev, staging, or prod"
  }
}

# Locals para DRY
locals {
  common_tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
```

---

## 🎓 Próximos Pasos

1. Empieza con [QUICK_START.md](./QUICK_START.md)
2. Sigue el [README principal](./README.md) nivel por nivel
3. Completa ejercicios de cada carpeta
4. Construye proyectos incrementales
5. Comparte tu progreso en GitHub

---

## 📚 Glosario

- **IaC**: Infrastructure as Code
- **CDK**: Cloud Development Kit (AWS)
- **HCL**: HashiCorp Configuration Language
- **Construct**: Building block en CDK
- **Module**: Componente reutilizable en Terraform
- **Stack**: Unidad de despliegue
- **State**: Representación del estado de la infraestructura
- **Provider**: Plugin que permite interactuar con APIs
- **Resource**: Componente de infraestructura (EC2, S3, etc.)
- **Data Source**: Query de información existente
- **Output**: Valor expuesto después del deployment
- **Remote State**: State almacenado remotamente (S3, Terraform Cloud)
- **Workspace**: Entorno aislado en Terraform
- **Drift**: Diferencia entre código y realidad

---

**¡Buena suerte en tu aprendizaje de Infraestructura como Código!** 🚀

**Meta inmediata**: Al finalizar Nivel 3, podrás desplegar una arquitectura serverless completa con `cdk deploy` o `terraform apply`, eliminando todos los "trámites manuales" que hoy te frustran. 🎯
