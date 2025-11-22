# 📑 Índice Completo - Infrastructure as Code (Terraform/CDK)

## 🎯 Inicio Rápido
- [README Principal](./README.md) - Roadmap completo de aprendizaje
- [Quick Start Guide](./QUICK_START.md) - Guía de inicio rápido

## 📚 Contenido por Nivel

### Nivel 1: Fundamentos de IaC
**Ubicación:** `01-fundamentos/`

#### Conceptos Básicos
- `conceptos-iac/README.md` - ¿Qué es IaC? Beneficios, herramientas, comparación
- `conceptos-iac/01-manual-vs-iac.md` - Comparación detallada

#### Configuración Inicial
- `setup/01-terraform-install.md` - Instalación de Terraform
- `setup/02-cdk-install.md` - Instalación de AWS CDK
- `setup/03-aws-credentials.md` - Configuración de credenciales
- `setup/04-multi-cloud-setup.md` - Azure y GCP setup

#### Cloud Fundamentals
- `cloud-basics/01-networking.md` - VPC, subnets, security groups
- `cloud-basics/02-compute-storage.md` - EC2, S3, RDS basics
- `cloud-basics/03-iam-security.md` - IAM, roles, policies

---

### Nivel 2: Terraform Básico
**Ubicación:** `02-terraform-basico/`

#### Terraform Fundamentals
- `fundamentos/01-hcl-syntax.tf` - HCL syntax y estructura
  - Variables, locals, outputs
  - Data sources
  - Resource blocks
  - Meta-arguments

- `fundamentos/02-terraform-workflow.md` - init, plan, apply, destroy
- `fundamentos/03-first-resource.tf` - Primera EC2 instance

#### State Management
- `state/01-local-state.md` - State file local
- `state/02-remote-state-s3.tf` - S3 backend con DynamoDB
- `state/03-state-operations.md` - import, mv, rm commands
- `state/04-workspaces.md` - Terraform workspaces

#### Modules
- `modules/01-module-basics/` - Primera módulo de networking
  - `main.tf` - VPC, subnets, route tables
  - `variables.tf` - Input variables
  - `outputs.tf` - Output values
  - `README.md` - Documentación

- `modules/02-using-modules.tf` - Consumir módulos
- `modules/03-module-registry.md` - Terraform Registry

#### Recursos Avanzados
- `recursos/01-vpc-completo.tf` - VPC con subnets públicas/privadas
- `recursos/02-compute-resources.tf` - EC2, ASG, ALB
- `recursos/03-database.tf` - RDS instance
- `recursos/04-storage.tf` - S3 buckets con políticas

---

### Nivel 3: AWS CDK con TypeScript
**Ubicación:** `03-cdk-typescript/`

#### CDK Fundamentals
- `fundamentos/01-hello-world-cdk/` - Primera CDK app
  - `bin/app.ts` - CDK App
  - `lib/stack.ts` - CDK Stack
  - `test/stack.test.ts` - Tests
  - `cdk.json` - CDK config

- `fundamentos/02-constructs.ts` - L1, L2, L3 constructs
- `fundamentos/03-cdk-workflow.md` - synth, deploy, destroy

#### CDK Core
- `core-concepts/01-stacks.ts` - Stack organization
  - Cross-stack references
  - Stack props
  - Dependencies

- `core-concepts/02-assets.ts` - Lambda assets, Docker assets
- `core-concepts/03-parameters.ts` - Environment variables, context

#### CDK Patterns
- `patterns/01-api-lambda/` - API Gateway + Lambda pattern
  - `lib/api-stack.ts` - API stack
  - `lambda/handler.ts` - Lambda function
  - `test/api.test.ts` - Tests

- `patterns/02-s3-lambda/` - S3 event processing
- `patterns/03-eventbridge-lambda/` - Event-driven pattern
- `patterns/04-step-functions/` - Workflow orchestration

#### CDK Advanced
- `advanced/01-custom-constructs.ts` - Custom L3 constructs
- `advanced/02-custom-resources.ts` - Lambda-backed resources
- `advanced/03-aspects.ts` - Cross-cutting concerns
- `advanced/04-cdk-pipelines.ts` - Self-mutating pipelines

#### Testing
- `testing/01-unit-tests.test.ts` - Jest unit tests
- `testing/02-snapshot-tests.test.ts` - Snapshot testing
- `testing/03-assertions.test.ts` - Fine-grained assertions
- `testing/04-integration-tests.test.ts` - Integration tests

---

### Nivel 4: Patrones y Best Practices
**Ubicación:** `04-patrones-bestpractices/`

#### Design Patterns
- `patterns/01-immutable-infrastructure.md` - Blue/Green deployments
- `patterns/02-gitops.md` - GitOps fundamentals
- `patterns/03-environment-parity/` - Dev/Staging/Prod
  - `dev.tfvars`
  - `staging.tfvars`
  - `prod.tfvars`

#### Code Organization
- `organization/01-mono-vs-multi-repo.md` - Repository strategies
- `organization/02-directory-structure/` - Estructura recomendada
- `organization/03-dry-principles.md` - Eliminar duplicación

#### State Management Patterns
- `state-patterns/01-segmentation.md` - State segmentation
- `state-patterns/02-cross-stack.tf` - Cross-stack references
- `state-patterns/03-migration.md` - State migration strategies

#### Testing Strategies
- `testing/01-terratest/` - Terratest examples
  - `terraform/` - Terraform code
  - `test/terraform_test.go` - Go tests

- `testing/02-cdk-testing/` - CDK testing
- `testing/03-policy-testing/` - OPA policies
  - `policies/` - Rego policies
  - `tests/` - Policy tests

---

### Nivel 5: Multi-Cloud y Arquitecturas Avanzadas
**Ubicación:** `05-multi-cloud/`

#### Multi-Cloud Strategy
- `strategy/01-why-multicloud.md` - Razones y consideraciones
- `strategy/02-provider-comparison.md` - AWS vs Azure vs GCP

#### Terraform Multi-Cloud
- `terraform-multicloud/01-aws-azure.tf` - AWS + Azure providers
- `terraform-multicloud/02-cross-cloud-networking.tf` - VPN entre clouds
- `terraform-multicloud/03-data-replication.md` - Cross-cloud data

#### Azure
- `azure/01-azure-basics.tf` - Resource groups, VNets
- `azure/02-app-services.tf` - Azure App Service
- `azure/03-aks-cluster.tf` - Azure Kubernetes Service
- `azure/04-bicep-vs-terraform.md` - Comparación

#### Google Cloud Platform
- `gcp/01-gcp-basics.tf` - Projects, VPC networks
- `gcp/02-compute-engine.tf` - GCE instances
- `gcp/03-gke-cluster.tf` - Google Kubernetes Engine
- `gcp/04-cloud-functions.tf` - Serverless functions

#### Kubernetes
- `kubernetes/01-eks-cluster/` - Production EKS
  - `terraform/` - EKS con Terraform
  - `cdk/` - EKS con CDK

- `kubernetes/02-k8s-resources.tf` - Terraform K8s provider
- `kubernetes/03-cdk8s/` - CDK for Kubernetes
- `kubernetes/04-helm-charts.tf` - Helm con Terraform
- `kubernetes/05-service-mesh.tf` - Istio deployment

---

### Nivel 6: GitOps, Seguridad y Producción
**Ubicación:** `06-gitops-produccion/`

#### GitOps
- `gitops/01-github-actions/` - CI/CD con GitHub Actions
  - `.github/workflows/terraform.yml`
  - `.github/workflows/cdk.yml`

- `gitops/02-atlantis/` - Atlantis setup
  - `atlantis.yaml`
  - `README.md`

- `gitops/03-argocd/` - ArgoCD para Kubernetes
- `gitops/04-deployment-strategies.md` - Rolling, Blue/Green, Canary

#### Security
- `security/01-secrets-management/` - Vault, Secrets Manager
  - `vault-setup.tf`
  - `secrets-rotation.tf`

- `security/02-scanning/` - Security scanning
  - `tfsec.yml` - tfsec config
  - `checkov.yml` - Checkov config
  - `.github/workflows/security-scan.yml`

- `security/03-compliance/` - Compliance as Code
  - `policies/` - OPA/Sentinel policies
  - `cis-benchmarks/` - CIS compliance

#### Cost Management
- `cost/01-infracost/` - Cost estimation
  - `.github/workflows/infracost.yml`
  - `infracost.yml`

- `cost/02-optimization.md` - Cost optimization strategies
- `cost/03-finops.md` - FinOps practices
- `cost/04-tagging-strategy.tf` - Resource tagging

#### Observability
- `observability/01-monitoring.tf` - CloudWatch, Datadog
- `observability/02-drift-detection/` - Automated drift detection
  - `drift-detection-lambda/`
  - `alerts.tf`

- `observability/03-incident-response/` - Runbooks as code

#### Advanced Topics
- `advanced/01-service-catalog/` - AWS Service Catalog
- `advanced/02-platform-engineering/` - Internal developer platform
- `advanced/03-terraform-cloud.md` - Terraform Cloud/Enterprise

---

## 🛠️ Archivos de Configuración

### Terraform
- `terraform-config/terraform.tf` - Provider versions
- `terraform-config/backend.tf` - Remote state config
- `terraform-config/.terraform-version` - tfenv version
- `terraform-config/.terraform.lock.hcl` - Dependency lock

### CDK
- `cdk-config/package.json` - Dependencies
- `cdk-config/tsconfig.json` - TypeScript config
- `cdk-config/cdk.json` - CDK config
- `cdk-config/jest.config.js` - Testing config

### CI/CD
- `cicd-templates/.github/workflows/` - GitHub Actions workflows
- `cicd-templates/.gitlab-ci.yml` - GitLab CI
- `cicd-templates/Jenkinsfile` - Jenkins pipeline

---

## 📊 Progreso Recomendado

### Semanas 1-2: Fundamentos
✅ Entender IaC concepts
✅ Instalar herramientas
✅ Primer recurso con Terraform
✅ Primer stack con CDK

### Semanas 3-4: Terraform Básico
✅ Dominar HCL syntax
✅ Remote state setup
✅ Primer módulo creado

### Semanas 5-7: CDK Completo
✅ Stacks y constructs
✅ CDK patterns implementados
✅ Testing suite completo

### Semanas 8-10: Patterns
✅ GitOps workflow
✅ Multi-environment setup
✅ Testing automatizado

### Semanas 11-14: Multi-Cloud
✅ Terraform multi-provider
✅ Azure o GCP deployments
✅ Kubernetes clusters

### Semanas 15-20: Producción
✅ CI/CD pipelines
✅ Security scanning
✅ Cost optimization
✅ Proyecto final

---

## 🎯 Proyecto Final Sugerido

**Multi-Cloud E-commerce Platform**

Implementa:
- ✅ AWS infrastructure (Terraform + CDK)
- ✅ Azure infrastructure (Terraform)
- ✅ GCP infrastructure (Terraform)
- ✅ Kubernetes clusters (EKS, AKS, GKE)
- ✅ Multi-region active-active
- ✅ GitOps workflow completo
- ✅ Automated testing (Terratest + Jest)
- ✅ Security scanning pipeline
- ✅ Cost tracking (Infracost)
- ✅ Compliance policies (OPA)
- ✅ Disaster recovery automation
- ✅ Observability completa

---

## 📖 Recursos Adicionales

### Documentation
- [Terraform Docs](https://www.terraform.io/docs)
- [AWS CDK Docs](https://docs.aws.amazon.com/cdk/)
- [Terraform Registry](https://registry.terraform.io/)
- [CDK Patterns](https://cdkpatterns.com/)

### Tools
- [tfsec](https://github.com/aquasecurity/tfsec) - Security scanner
- [Checkov](https://www.checkov.io/) - Policy scanner
- [Infracost](https://www.infracost.io/) - Cost estimation
- [Terratest](https://terratest.gruntwork.io/) - Testing framework
- [LocalStack](https://localstack.cloud/) - Local AWS testing

### Communities
- HashiCorp Community Forums
- CDK Slack workspace
- r/terraform on Reddit
- r/aws on Reddit
- DevOps communities

---

## 📝 Próximos Pasos

1. Empieza con [QUICK_START.md](./QUICK_START.md)
2. Sigue el [README principal](./README.md) nivel por nivel
3. Completa ejercicios de cada carpeta
4. Construye proyectos incrementales
5. Documenta todo en GitHub
6. Comparte tu progreso

---

## 💡 Quick Reference

### Terraform Common Commands
```bash
terraform init          # Initialize working directory
terraform plan          # Preview changes
terraform apply         # Apply changes
terraform destroy       # Destroy infrastructure
terraform state list    # List resources in state
terraform state show    # Show resource details
terraform import        # Import existing resource
terraform fmt           # Format code
terraform validate      # Validate syntax
```

### CDK Common Commands
```bash
cdk init app --language typescript  # Create new app
cdk synth                            # Synthesize CloudFormation
cdk diff                             # Show differences
cdk deploy                           # Deploy stack
cdk destroy                          # Destroy stack
cdk ls                               # List stacks
cdk doctor                           # Check environment
npm test                             # Run tests
```

### Cost Management Commands
```bash
# Terraform destroy all
terraform destroy -auto-approve

# CDK destroy all stacks
cdk destroy --all

# List running EC2 instances
aws ec2 describe-instances --query "Reservations[].Instances[?State.Name=='running']"

# Stop all running instances (careful!)
aws ec2 stop-instances --instance-ids $(aws ec2 describe-instances --query "Reservations[].Instances[?State.Name=='running'].InstanceId" --output text)
```

---

**¡Buena suerte en tu aprendizaje de Infrastructure as Code!** 🚀

*Recuerda: Siempre ejecuta `terraform destroy` o `cdk destroy` después de practicar para evitar costos innecesarios. La mejor infraestructura es la que puedes recrear en minutos.*
