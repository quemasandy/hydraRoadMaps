# 📑 Índice Completo - Container Orchestration (Kubernetes/Docker)

## 🎯 Inicio Rápido
- [README Principal](./README.md) - Roadmap completo de aprendizaje
- [Quick Start Guide](./QUICK_START.md) - Guía de inicio rápido (10 minutos)

## 📚 Contenido por Nivel

### Nivel 1: Fundamentos de Contenedores
**Ubicación:** `01-fundamentos/`

#### Conceptos Básicos
- `conceptos-contenedores/README.md` - ¿Qué son contenedores? Comparación con VMs
- `conceptos-contenedores/casos-uso.md` - Cuándo usar containers vs serverless

#### Docker Básico
- `docker-basico/01-instalacion.md` - Setup de Docker Desktop/Engine
- `docker-basico/02-imagenes.ts` - Trabajar con imágenes Docker
- `docker-basico/03-containers.ts` - Ejecutar y gestionar containers
- `docker-basico/04-dockerfile.md` - Crear Dockerfiles para TypeScript/Node.js
- `docker-basico/Dockerfile.example` - Ejemplo de Dockerfile multi-stage

#### Docker Compose
- `docker-compose/01-introduccion.md` - ¿Qué es Docker Compose?
- `docker-compose/02-stack-completo/` - App + DB + Redis
  - `docker-compose.yml`
  - `app/Dockerfile`
  - `app/src/index.ts`
- `docker-compose/03-desarrollo.md` - Hot reload y debugging

---

### Nivel 2: Docker Avanzado
**Ubicación:** `02-docker-avanzado/`

#### Optimización de Imágenes
- `optimizacion/01-multi-stage.md` - Multi-stage builds explained
- `optimizacion/02-layer-caching.md` - Estrategias de caching
- `optimizacion/03-base-images.md` - Alpine vs Slim vs Distroless
- `optimizacion/ejemplo-optimizado/`
  - `Dockerfile.before` - 800MB
  - `Dockerfile.after` - 100MB
  - `comparacion.md`

#### TypeScript/Node.js en Docker
- `typescript-node/01-dockerfile-optimo.md` - Best practices
- `typescript-node/02-build-process.md` - Compilación de TypeScript
- `typescript-node/03-runtime-optimization.md` - NODE_ENV, heap size
- `typescript-node/ejemplos/`
  - `nestjs/Dockerfile`
  - `express/Dockerfile`
  - `nextjs/Dockerfile`

#### Container Registries
- `registries/01-docker-hub.md` - Public y private repos
- `registries/02-cloud-registries.md` - ECR, ACR, GCR, GHCR
- `registries/03-private-registry.md` - Harbor setup
- `registries/04-tagging-strategy.md` - Versionamiento de imágenes

#### CI/CD con Docker
- `cicd/01-github-actions.yml` - Build y push workflow
- `cicd/02-testing.md` - Integration tests con containers
- `cicd/03-security-scanning.md` - Trivy, Snyk
- `cicd/ejemplo-pipeline/`
  - `.github/workflows/docker.yml`
  - `tests/integration.test.ts`

---

### Nivel 3: Kubernetes Básico
**Ubicación:** `03-kubernetes-basico/`

#### Introducción a Kubernetes
- `intro-kubernetes/README.md` - ¿Qué es Kubernetes? Arquitectura
- `intro-kubernetes/k8s-vs-alternativas.md` - K8s vs Swarm vs ECS
- `intro-kubernetes/opciones-k8s.md` - minikube, kind, k3d, EKS, GKE, AKS
- `intro-kubernetes/01-setup-local.md` - Instalar minikube/kind

#### Conceptos Core
- `conceptos-core/01-pods/`
  - `README.md` - ¿Qué es un Pod?
  - `pod-simple.yaml` - Pod básico
  - `pod-multi-container.yaml` - Sidecar pattern
  - `commands.md` - kubectl para Pods

- `conceptos-core/02-deployments/`
  - `README.md` - Deployments y ReplicaSets
  - `deployment.yaml` - Deployment de app Node.js
  - `rolling-update.md` - Updates y rollbacks
  - `scaling.md` - Manual scaling

- `conceptos-core/03-services/`
  - `README.md` - Service types
  - `clusterip.yaml` - Internal service
  - `nodeport.yaml` - External access básico
  - `loadbalancer.yaml` - Cloud LoadBalancer

- `conceptos-core/04-namespaces/`
  - `README.md` - Organización lógica
  - `namespaces.yaml` - dev, staging, prod
  - `resource-quotas.yaml` - Limits por namespace

- `conceptos-core/05-config/`
  - `README.md` - ConfigMaps y Secrets
  - `configmap.yaml` - App configuration
  - `secret.yaml` - Passwords y tokens
  - `app-with-config.yaml` - Mounting configs

#### Kubectl y Manifests
- `kubectl-basics/README.md` - kubectl essentials
- `kubectl-basics/cheatsheet.md` - Comandos útiles
- `kubectl-basics/debugging.md` - Troubleshooting guide
- `kubectl-basics/manifests/`
  - `full-app.yaml` - Multi-resource manifest
  - `kustomization.yaml` - Kustomize intro

#### Storage
- `storage/01-volumes.md` - emptyDir, hostPath
- `storage/02-persistent-volumes.md` - PV y PVC
- `storage/03-statefulsets.md` - StatefulSets para DBs
- `storage/ejemplos/`
  - `postgres-statefulset.yaml`
  - `pvc-example.yaml`

---

### Nivel 4: Kubernetes Avanzado
**Ubicación:** `04-kubernetes-avanzado/`

#### Networking Avanzado
- `networking/01-network-model.md` - K8s networking explained
- `networking/02-network-policies.yaml` - Firewall rules
- `networking/03-ingress/`
  - `README.md` - Ingress controllers
  - `nginx-ingress.yaml` - Nginx setup
  - `ingress-multi-app.yaml` - Path/Host routing
  - `ingress-tls.yaml` - HTTPS/TLS

- `networking/04-service-mesh/`
  - `README.md` - Service mesh intro
  - `linkerd-setup.md` - Linkerd installation
  - `istio-basics.md` - Istio overview

#### Security
- `security/01-rbac/`
  - `README.md` - RBAC explained
  - `service-account.yaml`
  - `role.yaml`
  - `rolebinding.yaml`
  - `ejemplo-team-access.yaml`

- `security/02-pod-security/`
  - `README.md` - Pod Security Standards
  - `security-context.yaml`
  - `network-policy.yaml`
  - `pod-security-policy.yaml`

- `security/03-secrets-management/`
  - `README.md` - External secrets
  - `external-secrets-operator.yaml`
  - `sealed-secrets.yaml`
  - `vault-integration.md`

#### Observabilidad
- `observability/01-logging/`
  - `README.md` - Centralized logging
  - `loki-stack/` - Grafana Loki setup
  - `fluentd/` - EFK stack (opcional)

- `observability/02-metrics/`
  - `README.md` - Prometheus + Grafana
  - `prometheus/prometheus.yaml`
  - `grafana/dashboards/`
  - `metrics-server.yaml`
  - `custom-metrics.ts` - Instrumentación

- `observability/03-tracing/`
  - `README.md` - Distributed tracing
  - `jaeger-setup.yaml`
  - `opentelemetry/` - OTEL configuration
  - `app-instrumented.ts` - App con tracing

- `observability/04-alerting/`
  - `alertmanager.yaml`
  - `alert-rules.yaml`
  - `runbooks/` - Runbooks para alerts

#### Scaling y Performance
- `scaling/01-hpa.yaml` - Horizontal Pod Autoscaler
- `scaling/02-vpa.yaml` - Vertical Pod Autoscaler
- `scaling/03-cluster-autoscaler.md` - Node autoscaling
- `scaling/04-resource-management/`
  - `README.md` - Requests vs Limits
  - `qos-classes.md` - QoS explained
  - `limit-ranges.yaml`
  - `resource-quotas.yaml`

---

### Nivel 5: Patrones de Orquestación
**Ubicación:** `05-orchestration-patterns/`

#### Deployment Patterns
- `deployment-patterns/01-rolling-update/`
  - `README.md` - Rolling updates explained
  - `deployment.yaml` - Configuración
  - `zero-downtime.md` - Best practices

- `deployment-patterns/02-blue-green/`
  - `README.md` - Blue/Green strategy
  - `blue-deployment.yaml`
  - `green-deployment.yaml`
  - `service-switch.md` - Traffic switching

- `deployment-patterns/03-canary/`
  - `README.md` - Canary deployments
  - `flagger-setup.yaml` - Automated canaries
  - `canary-example.yaml`
  - `metrics-analysis.md`

#### GitOps
- `gitops/01-intro.md` - ¿Qué es GitOps?
- `gitops/02-flux/`
  - `README.md` - FluxCD setup
  - `flux-system/` - Flux configuration
  - `apps/` - Application manifests
  - `kustomizations/`

- `gitops/03-argocd/`
  - `README.md` - ArgoCD setup
  - `argocd-install.yaml`
  - `applications/` - ArgoCD Applications
  - `applicationsets/` - Multi-app management
  - `best-practices.md`

- `gitops/04-repo-structure/`
  - `README.md` - Mono-repo vs multi-repo
  - `example-structure/`
  - `environment-promotion.md`

#### Helm
- `helm/01-basics/`
  - `README.md` - Helm introduction
  - `using-charts.md` - Install charts
  - `commands.md` - Helm CLI

- `helm/02-creating-charts/`
  - `README.md` - Chart creation
  - `example-chart/` - Full chart structure
    - `Chart.yaml`
    - `values.yaml`
    - `templates/`
  - `templating.md` - Go templates

- `helm/03-best-practices/`
  - `README.md` - Chart best practices
  - `testing.md` - Chart testing
  - `versioning.md` - Chart versions

#### Operators y CRDs
- `operators/01-crds.yaml` - Custom Resource Definition
- `operators/02-operator-pattern.md` - Operator explained
- `operators/03-popular-operators.md` - Prometheus, MySQL, etc.
- `operators/04-building-operator/`
  - `README.md` - Build your operator
  - `typescript-operator/` - Node.js operator example
  - `kubebuilder-guide.md`

---

### Nivel 6: Producción y Enterprise
**Ubicación:** `06-produccion-enterprise/`

#### Multi-Cluster Management
- `multi-cluster/01-strategies.md` - Why multi-cluster?
- `multi-cluster/02-federation/`
  - `README.md` - Cluster federation
  - `kubefed-setup.yaml`
  - `multi-cluster-service.yaml`

- `multi-cluster/03-tools/`
  - `rancher/` - Rancher setup
  - `anthos/` - Google Anthos
  - `azure-arc/` - Azure Arc
  - `comparison.md`

#### Disaster Recovery
- `disaster-recovery/01-backup/`
  - `README.md` - Backup strategies
  - `velero-setup.yaml` - Velero installation
  - `backup-schedule.yaml`
  - `restore-guide.md`

- `disaster-recovery/02-high-availability/`
  - `README.md` - HA setup
  - `pod-disruption-budget.yaml`
  - `topology-spread.yaml`
  - `multi-zone.md`

- `disaster-recovery/03-dr-plan/`
  - `README.md` - DR planning
  - `rto-rpo.md` - Objectives
  - `runbooks/` - Recovery procedures
  - `testing-dr.md`

#### Cost Optimization
- `cost-optimization/01-resource-optimization.md` - Right-sizing
- `cost-optimization/02-kubecost/`
  - `kubecost-setup.yaml`
  - `dashboards.md`
  - `chargeback.md`

- `cost-optimization/03-finops/`
  - `README.md` - FinOps practices
  - `tagging-strategy.md`
  - `spot-instances.md`
  - `idle-detection.md`

#### Managed Kubernetes
- `managed-k8s/01-aws-eks/`
  - `README.md` - EKS overview
  - `eksctl-cluster.yaml` - Cluster setup
  - `irsa.md` - IAM Roles for Service Accounts
  - `aws-load-balancer-controller.yaml`
  - `ebs-csi-driver.yaml`
  - `fargate.md` - Serverless pods

- `managed-k8s/02-azure-aks/`
  - `README.md` - AKS overview
  - `aks-cluster.sh` - az aks commands
  - `azure-ad.md` - AAD integration
  - `azure-cni.md` - Networking
  - `virtual-nodes.md`

- `managed-k8s/03-google-gke/`
  - `README.md` - GKE overview
  - `gke-cluster.sh` - gcloud commands
  - `workload-identity.md`
  - `autopilot-vs-standard.md`

- `managed-k8s/04-comparison/`
  - `README.md` - Feature comparison
  - `pricing-comparison.xlsx`
  - `decision-matrix.md`

#### CI/CD Avanzado
- `cicd-avanzado/01-pipeline-completo/`
  - `.github/workflows/k8s-deploy.yml`
  - `build-stage.md`
  - `security-scan.md`
  - `deploy-stage.md`
  - `smoke-tests.ts`

- `cicd-avanzado/02-progressive-delivery/`
  - `README.md` - Progressive delivery
  - `flagger-canary.yaml`
  - `automated-rollback.md`

- `cicd-avanzado/03-testing/`
  - `unit-tests.md`
  - `integration-tests-kind.md` - Tests con kind
  - `e2e-tests.md`
  - `load-testing-k6.js`
  - `chaos-engineering.md` - Chaos Mesh

#### Proyecto Final
- `proyecto-final/`
  - `README.md` - E-commerce arquitectura
  - `architecture-diagram.png`
  - `services/` - Microservices code
    - `frontend/`
    - `api-gateway/`
    - `products-service/`
    - `orders-service/`
    - `users-service/`
    - `payments-service/`
  - `k8s-manifests/` - All K8s resources
    - `base/` - Kustomize base
    - `overlays/dev/`
    - `overlays/staging/`
    - `overlays/prod/`
  - `helm-charts/` - Helm charts
  - `gitops/` - ArgoCD setup
  - `observability/` - Monitoring stack
  - `docs/`
    - `architecture.md`
    - `runbooks/`
    - `api-docs/`

---

## 🛠️ Archivos de Configuración

- `.dockerignore.example` - Docker ignore patterns
- `Dockerfile.example` - Dockerfile multi-stage optimizado
- `docker-compose.yml.example` - Docker Compose para desarrollo
- `tsconfig.json.example` - TypeScript config
- `package.json.example` - Dependencies
- `.github/workflows/example.yml` - CI/CD pipeline

---

## 📊 Progreso Recomendado

### Semanas 1-2: Fundamentos de Contenedores
✅ Entender contenedores vs VMs
✅ Docker basics
✅ Crear Dockerfiles
✅ Docker Compose

### Semanas 3-4: Docker Avanzado
✅ Multi-stage builds
✅ Optimización de imágenes
✅ Container registries
✅ CI/CD básico

### Semanas 5-8: Kubernetes Básico
✅ Conceptos core (Pods, Deployments, Services)
✅ kubectl mastery
✅ ConfigMaps y Secrets
✅ Storage básico

### Semanas 9-12: Kubernetes Avanzado
✅ Networking e Ingress
✅ RBAC y seguridad
✅ Observabilidad (Prometheus + Grafana)
✅ HPA y scaling

### Semanas 13-16: Patrones de Orquestación
✅ Deployment strategies
✅ GitOps con ArgoCD
✅ Helm charts
✅ Operators básicos

### Semanas 17-24: Producción
✅ Managed Kubernetes (EKS/GKE/AKS)
✅ CI/CD avanzado
✅ Disaster recovery
✅ Cost optimization
✅ Proyecto final

---

## 🎯 Decisión: ¿Cuándo Kubernetes vs Serverless?

### Usa Kubernetes Si:
- ✅ Necesitas portabilidad entre clouds
- ✅ Tienes workloads long-running (WebSockets)
- ✅ Requieres control total del runtime
- ✅ Dependencias complejas o binaries específicos
- ✅ Networking avanzado (service mesh)
- ✅ Workloads predecibles (no bursty)

### Usa Serverless Si:
- ✅ Workloads event-driven
- ✅ Funciones cortas (&lt;15 min)
- ✅ Quieres zero ops
- ✅ Costos variables aceptables
- ✅ Scaling infinito automático
- ✅ Vendor lock-in no es problema

### Arquitectura Híbrida (Lo Mejor)
```
Frontend (S3/CloudFront)
    ↓
API Gateway
    ↓
┌─────────────┬──────────────────┐
│  Serverless │   Kubernetes     │
│  (Lambda)   │    (EKS)         │
├─────────────┼──────────────────┤
│ - Auth      │ - Core API       │
│ - Events    │ - WebSockets     │
│ - Webhooks  │ - ML serving     │
│ - Cron      │ - Databases      │
└─────────────┴──────────────────┘
```

---

## 🚀 Valor Para Arquitecto Multicloud

### ¿Por Qué Aprender Kubernetes?

1. **Portabilidad Real**
   - K8s corre en AWS, Azure, GCP, on-premise
   - No vendor lock-in
   - El VERDADERO estándar multicloud

2. **Decisiones Informadas**
   - Sabrás CUÁNDO usar Serverless
   - Y CUÁNDO NO usarlo
   - Diseñarás arquitecturas híbridas

3. **Credibilidad Técnica**
   - Hablarás el lenguaje de DevOps/SRE
   - Entenderás necesidades de equipos
   - Liderarás decisiones técnicas

4. **Complemento Perfecto**
   - AwsServerless → Event-driven workloads
   - ContainerOrchestration → Stateful/Long-running
   - MulticloudApps → True portability

---

## 📖 Próximos Pasos

1. Lee [README.md](./README.md) completo
2. Sigue [QUICK_START.md](./QUICK_START.md) (10 min setup)
3. Instala Docker Desktop
4. Completa Nivel 1 (Fundamentos)
5. Practica con clusters locales (minikube/kind)
6. Explora cada carpeta secuencialmente
7. Construye proyectos incrementales
8. Documenta tu progreso en GitHub
9. Únete a CNCF Slack
10. Considera certificación CKAD

---

**¡Bienvenido al viaje de Container Orchestration!** 🐳☸️

*Este roadmap transformará tu entendimiento de cloud-native development y te dará las herramientas para tomar decisiones arquitectónicas informadas entre Serverless, Containers, y arquitecturas híbridas.*
