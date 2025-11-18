# 🐳 Roadmap de Aprendizaje: Container Orchestration (Kubernetes/Docker)

## 📚 Tabla de Contenidos
- [Nivel 1: Fundamentos de Contenedores](#nivel-1-fundamentos-de-contenedores)
- [Nivel 2: Docker Avanzado](#nivel-2-docker-avanzado)
- [Nivel 3: Kubernetes Básico](#nivel-3-kubernetes-básico)
- [Nivel 4: Kubernetes Avanzado](#nivel-4-kubernetes-avanzado)
- [Nivel 5: Patrones de Orquestación](#nivel-5-patrones-de-orquestación)
- [Nivel 6: Producción y Enterprise](#nivel-6-producción-y-enterprise)
- [Recursos y Práctica](#recursos-y-práctica)

---

## 🎯 ¿Por Qué Este Roadmap?

### Para Arquitectos Multicloud y Serverless

**Si ya conoces AWS Serverless y quieres MulticloudApps, necesitas entender Kubernetes.**

El estándar "agnóstico" de nube hoy (y en 2030) no es siempre Serverless, es Kubernetes:
- ✅ **Portabilidad real**: Corre en AWS, Azure, GCP, on-premise
- ✅ **Control total**: Sobre runtime, dependencies, networking
- ✅ **No vendor lock-in**: Kubernetes es el mismo en todas partes
- ✅ **Ecosistema maduro**: Helm, Istio, ArgoCD, Prometheus

### Cuándo Usar Contenedores vs Serverless

**Usa Kubernetes/Docker cuando:**
- Necesitas aplicaciones long-running (WebSockets, streams)
- Tienes dependencias complejas o binaries específicos
- Requieres control total del runtime environment
- Necesitas portabilidad entre clouds
- Tienes workloads predecibles (no bursty)
- Necesitas networking avanzado o service mesh

**Usa Serverless cuando:**
- Tienes workloads event-driven o bursty
- Quieres zero operational overhead
- Las funciones son cortas (&lt;15 min)
- Costos variables son aceptables
- Vendor lock-in no es problema crítico

### El Valor Para Ti

Incluso si no usas Kubernetes día a día, un **Arquitecto Multicloud** debe entenderlo para:
1. **Tomar decisiones informadas**: Saber cuándo NO usar Serverless
2. **Diseñar híbridos**: Combinar Serverless + Kubernetes
3. **Hablar con equipos**: Entender sus necesidades
4. **Evaluar costos**: Comparar TCO de diferentes arquitecturas
5. **Portabilidad**: Diseñar para multi-cloud real

---

## Nivel 1: Fundamentos de Contenedores

### 1.1 ¿Qué Son los Contenedores?
**Tiempo estimado: 1-2 semanas**

- [ ] **Conceptos Fundamentales**
  - ¿Qué es un contenedor vs VM?
  - Namespaces y cgroups en Linux
  - Container runtime (containerd, CRI-O)
  - OCI (Open Container Initiative)
  - Imágenes vs Contenedores
  - Layered filesystem (UnionFS)
  - Ejercicio: Comparar tamaño VM vs Container

- [ ] **Historia y Evolución**
  - De VMs a Containers
  - Docker y la revolución de contenedores
  - Kubernetes y CNCF
  - Timeline de adopción cloud-native
  - Futuro: WebAssembly, eBPF

- [ ] **Casos de Uso de Contenedores**
  - Microservices
  - CI/CD pipelines
  - Ambientes de desarrollo consistentes
  - Aplicaciones legacy (lift-and-shift)
  - Machine Learning workflows
  - Ejercicio: Identificar 5 casos de uso en tu contexto

### 1.2 Docker Básico
**Tiempo estimado: 2-3 semanas**

- [ ] **Instalación y Setup**
  - Docker Desktop (Mac/Windows)
  - Docker Engine en Linux
  - Docker CLI basics
  - Docker daemon configuration
  - Configurar registries
  - Ejercicio: Hello World container

- [ ] **Trabajando con Imágenes**
  - docker pull, push, tag
  - Docker Hub y registries públicos
  - Buscar imágenes oficiales
  - Image layers y cache
  - Inspeccionar imágenes (docker inspect)
  - Limpieza de imágenes (docker image prune)
  - Ejercicio: Descargar y explorar imagen de Node.js

- [ ] **Ejecutando Contenedores**
  - docker run basics
  - Flags importantes (-d, -p, -v, -e, --name)
  - Port mapping
  - Volume mounting
  - Environment variables
  - Container logs (docker logs)
  - Ejecutar comandos (docker exec)
  - Detener y eliminar contenedores
  - Ejercicio: Levantar PostgreSQL + pgAdmin

- [ ] **Dockerfile Fundamentals**
  - Sintaxis básica de Dockerfile
  - FROM, RUN, COPY, ADD
  - CMD vs ENTRYPOINT
  - EXPOSE, ENV, WORKDIR
  - ARG para build-time variables
  - LABEL para metadata
  - .dockerignore
  - Ejercicio: Crear Dockerfile para app TypeScript

### 1.3 Contenedores en Desarrollo
**Tiempo estimado: 2 semanas**

- [ ] **Docker Compose**
  - ¿Qué es Docker Compose?
  - docker-compose.yml syntax
  - Services, networks, volumes
  - Depends_on y healthchecks
  - Environment files (.env)
  - docker-compose up/down
  - Scaling services
  - Ejercicio: Stack completo (app + DB + Redis)

- [ ] **Desarrollo Local con Containers**
  - Hot reload en containers
  - Volume mapping para código
  - Debugging dentro de containers
  - VSCode DevContainers
  - Docker extensions para IDEs
  - Ejercicio: Dev environment con hot-reload

- [ ] **Networking Básico**
  - Bridge network (default)
  - Host network
  - Container-to-container communication
  - Port mapping y conflicts
  - DNS interno de Docker
  - Ejercicio: Comunicación entre 3 services

---

## Nivel 2: Docker Avanzado

### 2.1 Optimización de Imágenes
**Tiempo estimado: 2-3 semanas**

- [ ] **Multi-Stage Builds**
  - Concepto de multi-stage
  - Build stage vs Runtime stage
  - Reducir tamaño de imagen
  - Compilación de TypeScript en build stage
  - Copiar artifacts entre stages
  - Ejercicio: Reducir imagen de 800MB a 100MB

- [ ] **Layer Caching y Optimización**
  - Cómo funciona el layer caching
  - Ordenar comandos para mejor cache
  - COPY package.json antes de npm install
  - Usar .dockerignore efectivamente
  - BuildKit y --cache-from
  - Ejercicio: Optimizar build time en 80%

- [ ] **Imágenes Base Eficientes**
  - Alpine Linux (pequeño pero riesgos)
  - Distroless images
  - Debian slim
  - Scratch para binarios estáticos
  - node:alpine vs node:slim
  - Security scanning (Trivy, Snyk)
  - Ejercicio: Comparar 5 base images

- [ ] **Best Practices de Seguridad**
  - No correr como root (USER directive)
  - Minimal surface attack
  - Secrets en build (BuildKit secrets)
  - Vulnerability scanning
  - Image signing (Docker Content Trust)
  - Read-only root filesystem
  - Ejercicio: Hardening de imagen

### 2.2 Docker para TypeScript/Node.js
**Tiempo estimado: 2 semanas**

- [ ] **Optimización Node.js**
  - Choosing right Node version
  - npm ci vs npm install
  - Production dependencies only
  - .dockerignore para node_modules
  - Package-lock.json en imagen
  - Health checks para Node apps
  - Ejercicio: Dockerfile óptimo para NestJS

- [ ] **TypeScript Build Optimization**
  - Compilar TypeScript en build stage
  - tsconfig para producción
  - Source maps en producción
  - Tree shaking y bundling (webpack/esbuild)
  - Ejercicio: Pipeline de build optimizado

- [ ] **Runtime Optimization**
  - NODE_ENV=production
  - Memory limits y heap size
  - Process managers (PM2 en containers?)
  - Graceful shutdown (SIGTERM)
  - Ejercicio: Container production-ready

### 2.3 Container Registries
**Tiempo estimado: 1-2 semanas**

- [ ] **Docker Hub**
  - Public vs Private repositories
  - Automated builds
  - Image tags strategy
  - Rate limiting (2020+)
  - Vulnerability scanning
  - Ejercicio: Publicar imagen pública

- [ ] **Cloud Container Registries**
  - AWS ECR (Elastic Container Registry)
  - Azure Container Registry (ACR)
  - Google Container Registry (GCR) / Artifact Registry
  - GitHub Container Registry (GHCR)
  - Comparación de pricing
  - Replication cross-region
  - Ejercicio: Publicar en 3 registries

- [ ] **Private Registries**
  - Harbor (open source)
  - JFrog Artifactory
  - GitLab Container Registry
  - Security scanning integrado
  - Webhooks y notificaciones
  - Ejercicio: Setup Harbor local

### 2.4 CI/CD con Docker
**Tiempo estimado: 2-3 semanas**

- [ ] **Building en CI**
  - GitHub Actions con Docker
  - GitLab CI Docker executor
  - Docker-in-Docker (DinD) vs Docker socket
  - Build caching en CI
  - Matrix builds (multi-platform)
  - Ejercicio: Pipeline de build

- [ ] **Testing en Containers**
  - Integration tests con docker-compose
  - Testcontainers para tests
  - Spinning up dependencies en CI
  - Parallel testing
  - Ejercicio: Test suite con DB real

- [ ] **Image Publishing Strategy**
  - Tagging strategy (semver, git sha)
  - Latest tag (¿usarlo o no?)
  - Environment-specific tags (dev, staging, prod)
  - Image promotion between environments
  - Ejercicio: Estrategia completa de tags

---

## Nivel 3: Kubernetes Básico

### 3.1 ¿Qué es Kubernetes?
**Tiempo estimado: 1-2 semanas**

- [ ] **Conceptos Fundamentales**
  - ¿Qué problemas resuelve Kubernetes?
  - Container orchestration
  - Arquitectura de Kubernetes (master/worker)
  - Control plane components
  - kubelet, kube-proxy
  - etcd (state store)
  - Ejercicio: Diagrama de arquitectura

- [ ] **Kubernetes vs Alternativas**
  - Docker Swarm (simple pero limitado)
  - Nomad (HashiCorp)
  - ECS/Fargate (AWS-only)
  - Cloud Run (GCP-only)
  - Cuándo usar cada uno
  - Ejercicio: Matriz de decisión

- [ ] **Opciones de Kubernetes**
  - Self-managed (kubeadm, kops)
  - Managed Kubernetes (EKS, AKS, GKE)
  - Kubernetes local (minikube, kind, k3d, Docker Desktop)
  - Lightweight (k3s, microk8s)
  - Ejercicio: Setup de minikube

### 3.2 Conceptos Core de Kubernetes
**Tiempo estimado: 3-4 semanas**

- [ ] **Pods**
  - ¿Qué es un Pod?
  - Multi-container Pods
  - Pod lifecycle
  - Init containers
  - Sidecar pattern
  - Pod manifest YAML
  - kubectl run, get, describe, logs
  - Ejercicio: Desplegar primer Pod

- [ ] **Deployments**
  - ¿Qué es un Deployment?
  - ReplicaSets (abstracción)
  - Declarative vs Imperative
  - Rolling updates
  - Rollbacks
  - Deployment strategies
  - kubectl apply, rollout
  - Ejercicio: Deployment de app Node.js

- [ ] **Services**
  - ¿Por qué Services?
  - ClusterIP (default, interno)
  - NodePort (external, básico)
  - LoadBalancer (cloud-specific)
  - Headless services
  - Service discovery (DNS interno)
  - Selectors y labels
  - Ejercicio: Exponer aplicación

- [ ] **Namespaces**
  - Organización lógica
  - Resource isolation
  - RBAC por namespace
  - Default, kube-system, kube-public
  - kubectl -n namespace
  - Ejercicio: Crear namespaces por environment

- [ ] **ConfigMaps y Secrets**
  - Configuración externa a imagen
  - ConfigMaps para config no sensible
  - Secrets para passwords, tokens
  - Mounting como files o env vars
  - kubectl create configmap/secret
  - Ejercicio: App con configuración externa

### 3.3 Kubectl y Manifests
**Tiempo estimado: 2 semanas**

- [ ] **kubectl Fundamentals**
  - kubectl get, describe, logs
  - kubectl apply vs create
  - kubectl exec para debugging
  - kubectl port-forward
  - kubectl delete
  - Context y namespaces
  - kubens y kubectx (herramientas)
  - Ejercicio: Cheatsheet personal

- [ ] **YAML Manifests**
  - Estructura básica de manifest
  - apiVersion, kind, metadata, spec
  - Labels y annotations
  - Multi-resource files (---)
  - Kustomize basics
  - Ejercicio: Manifest completo para app

- [ ] **Debugging en Kubernetes**
  - kubectl logs (-f, --previous)
  - kubectl describe (events)
  - kubectl exec para shell
  - kubectl port-forward para testing
  - kubectl get events
  - Stern para multi-pod logs
  - Ejercicio: Debugging de app crasheando

### 3.4 Storage en Kubernetes
**Tiempo estimado: 2-3 semanas**

- [ ] **Volumes**
  - emptyDir (temporal, efímero)
  - hostPath (nodo-specific, evitar)
  - ConfigMap y Secret volumes
  - Volume lifecycle
  - Ejercicio: Pod con volume temporal

- [ ] **Persistent Volumes (PV) y PVC**
  - PersistentVolume vs PersistentVolumeClaim
  - Storage Classes
  - Dynamic provisioning
  - Access modes (RWO, ROX, RWX)
  - Reclaim policies
  - Ejercicio: PostgreSQL con PVC

- [ ] **StatefulSets**
  - Diferencia con Deployments
  - Stable network identity
  - Ordered deployment y scaling
  - Headless services
  - volumeClaimTemplates
  - Ejercicio: MongoDB cluster

---

## Nivel 4: Kubernetes Avanzado

### 4.1 Networking Avanzado
**Tiempo estimado: 3-4 semanas**

- [ ] **Kubernetes Networking Model**
  - CNI (Container Network Interface)
  - Pod-to-Pod communication
  - Flat network space
  - Plugins: Calico, Flannel, Weave
  - Network policies
  - Ejercicio: Setup de network policies

- [ ] **Ingress Controllers**
  - ¿Qué es un Ingress?
  - Ingress vs Service LoadBalancer
  - Nginx Ingress Controller
  - Traefik
  - Path-based routing
  - Host-based routing
  - TLS/SSL termination
  - Ejercicio: Ingress para múltiples apps

- [ ] **Service Mesh (Intro)**
  - ¿Qué es un Service Mesh?
  - Istio (complejo pero poderoso)
  - Linkerd (simple, lightweight)
  - Traffic management
  - Observability
  - Security (mTLS)
  - Ejercicio: Deploy Linkerd

### 4.2 Configuración y Seguridad
**Tiempo estimado: 3-4 semanas**

- [ ] **RBAC (Role-Based Access Control)**
  - Service Accounts
  - Roles y ClusterRoles
  - RoleBindings
  - Least privilege principle
  - kubectl auth can-i
  - Ejercicio: RBAC para equipo de desarrollo

- [ ] **Security Best Practices**
  - Pod Security Standards (PSS)
  - Security Contexts
  - Read-only root filesystem
  - No privileged containers
  - Network Policies
  - Image scanning
  - Admission controllers
  - Ejercicio: Hardening de cluster

- [ ] **Secrets Management**
  - Kubernetes Secrets (base64, no encriptado)
  - External Secrets Operator
  - Sealed Secrets
  - HashiCorp Vault integration
  - AWS Secrets Manager / Azure Key Vault
  - Ejercicio: External Secrets con AWS

### 4.3 Observabilidad
**Tiempo estimado: 3-4 semanas**

- [ ] **Logging**
  - Container logs
  - Centralized logging (EFK stack)
  - Elasticsearch, Fluentd, Kibana
  - Loki (Grafana)
  - CloudWatch Container Insights
  - Ejercicio: Setup de Loki

- [ ] **Metrics y Monitoring**
  - Metrics Server
  - Prometheus (estándar de facto)
  - Grafana dashboards
  - kube-state-metrics
  - Node exporter
  - Custom metrics
  - Ejercicio: Prometheus + Grafana completo

- [ ] **Tracing**
  - Distributed tracing
  - Jaeger
  - OpenTelemetry
  - Instrumentación de apps
  - Ejercicio: Tracing en app TypeScript

- [ ] **Alerting**
  - Prometheus Alertmanager
  - Alert rules
  - Routing y receivers (Slack, PagerDuty)
  - Runbooks
  - Ejercicio: Alertas críticas

### 4.4 Scaling y Performance
**Tiempo estimado: 2-3 semanas**

- [ ] **Horizontal Pod Autoscaler (HPA)**
  - CPU-based scaling
  - Memory-based scaling
  - Custom metrics scaling
  - HPA v2 API
  - Ejercicio: HPA con métricas custom

- [ ] **Vertical Pod Autoscaler (VPA)**
  - ¿Qué es VPA?
  - VPA vs HPA
  - Recommendations
  - Ejercicio: VPA para app memory-intensive

- [ ] **Cluster Autoscaler**
  - Node autoscaling
  - Cloud-specific (EKS, GKE, AKS)
  - Scale up y scale down
  - Ejercicio: Cluster autoscaling en EKS

- [ ] **Resource Management**
  - Requests vs Limits
  - QoS classes (Guaranteed, Burstable, BestEffort)
  - LimitRanges
  - ResourceQuotas
  - Ejercicio: Resource tuning para app

---

## Nivel 5: Patrones de Orquestación

### 5.1 Deployment Patterns
**Tiempo estimado: 3-4 semanas**

- [ ] **Rolling Updates**
  - Strategy por defecto
  - maxUnavailable, maxSurge
  - Health checks para rolling
  - Rollback automático
  - Ejercicio: Rolling update zero-downtime

- [ ] **Blue/Green Deployments**
  - Dos ambientes completos
  - Switch de tráfico
  - Rollback instantáneo
  - Costos (doble recursos)
  - Ejercicio: Blue/Green con Services

- [ ] **Canary Deployments**
  - Despliegue gradual
  - Traffic splitting (Istio/Flagger)
  - Metrics-driven rollout
  - Automated rollback
  - Ejercicio: Canary con Flagger

- [ ] **A/B Testing**
  - Header-based routing
  - User segmentation
  - Metrics collection
  - Ejercicio: A/B test con Istio

### 5.2 GitOps
**Tiempo estimado: 3-4 semanas**

- [ ] **Qué es GitOps**
  - Git como single source of truth
  - Declarative infrastructure
  - Pull vs Push deployment
  - Beneficios de GitOps
  - Ejercicio: Git repo para manifests

- [ ] **Flux**
  - FluxCD architecture
  - GitRepository sources
  - Kustomization
  - Helm releases
  - Image automation
  - Ejercicio: Setup completo de Flux

- [ ] **ArgoCD**
  - ArgoCD architecture
  - Application CRD
  - Sync strategies
  - ApplicationSets
  - ArgoCD UI
  - Multi-cluster management
  - Ejercicio: ArgoCD para múltiples apps

- [ ] **GitOps Best Practices**
  - Repo structure (mono-repo vs multi-repo)
  - Environment promotion
  - Secrets in GitOps
  - Disaster recovery
  - Ejercicio: Estrategia completa de GitOps

### 5.3 Helm - Package Manager
**Tiempo estimado: 2-3 semanas**

- [ ] **Helm Basics**
  - ¿Qué es Helm?
  - Charts, releases, repositories
  - helm install, upgrade, rollback
  - Artifact Hub
  - Ejercicio: Instalar PostgreSQL con Helm

- [ ] **Creating Charts**
  - Chart structure (Chart.yaml, values.yaml, templates/)
  - Templating con Go templates
  - Values y overrides
  - Dependencies
  - Ejercicio: Chart para tu app

- [ ] **Helm Best Practices**
  - Versionamiento de charts
  - Values.yaml structure
  - Chart testing
  - Helm hooks
  - Ejercicio: Chart production-ready

### 5.4 Operators y CRDs
**Tiempo estimado: 3-4 semanas**

- [ ] **Custom Resource Definitions (CRDs)**
  - Extending Kubernetes API
  - Definir tu propio CRD
  - kubectl para custom resources
  - Ejercicio: CRD simple

- [ ] **Kubernetes Operators**
  - Operator pattern
  - Controller reconciliation loop
  - Operator Framework
  - Kubebuilder
  - Popular operators (Prometheus, MySQL, etc.)
  - Ejercicio: Deploy de operator existente

- [ ] **Building Operators**
  - Operator SDK
  - Reconcile logic
  - Watches y events
  - Testing operators
  - Ejercicio: Operator simple en TypeScript/Node

---

## Nivel 6: Producción y Enterprise

### 6.1 Multi-Cluster Management
**Tiempo estimado: 3-4 semanas**

- [ ] **Estrategias Multi-Cluster**
  - ¿Por qué múltiples clusters?
  - Por environment (dev/staging/prod)
  - Por región (latency, compliance)
  - Por tenant (multi-tenancy)
  - Ejercicio: Diseñar topología multi-cluster

- [ ] **Cluster Federation**
  - KubeFed (Kubernetes Federation)
  - Multi-cluster Services
  - Cross-cluster discovery
  - Ejercicio: Setup básico de federation

- [ ] **Multi-Cluster Tools**
  - Rancher
  - Google Anthos
  - Azure Arc
  - AWS EKS Anywhere
  - Ejercicio: Rancher para 3 clusters

### 6.2 Disaster Recovery y Backup
**Tiempo estimado: 2-3 semanas**

- [ ] **Backup Strategies**
  - Velero (backup tool estándar)
  - etcd backups
  - Persistent Volume backups
  - Application-level backups
  - Ejercicio: Backup y restore con Velero

- [ ] **High Availability**
  - Multi-zone deployments
  - Pod Disruption Budgets (PDB)
  - Topology spread constraints
  - Control plane HA
  - Ejercicio: HA setup completo

- [ ] **Disaster Recovery**
  - RTO y RPO objectives
  - DR testing
  - Cross-region DR
  - Runbooks de recuperación
  - Ejercicio: Plan de DR documentado

### 6.3 Cost Optimization
**Tiempo estimado: 2-3 semanas**

- [ ] **Resource Optimization**
  - Right-sizing de Pods
  - Requests y Limits optimization
  - VPA recommendations
  - Node pooling strategies
  - Spot instances / Preemptible nodes
  - Ejercicio: Reducir costos en 30%

- [ ] **Cost Monitoring**
  - Kubecost
  - Cloud provider cost tools
  - Chargeback por namespace/team
  - Budget alerts
  - Ejercicio: Setup de Kubecost

- [ ] **FinOps para Kubernetes**
  - Tagging strategy
  - Resource allocation
  - Idle resource detection
  - Ejercicio: Dashboard de costos

### 6.4 Kubernetes en Clouds
**Tiempo estimado: 3-4 semanas**

- [ ] **AWS EKS (Elastic Kubernetes Service)**
  - EKS architecture
  - eksctl y AWS CLI
  - IAM Roles for Service Accounts (IRSA)
  - AWS Load Balancer Controller
  - EBS CSI driver
  - Fargate para Pods
  - Ejercicio: Cluster EKS production-ready

- [ ] **Azure AKS (Azure Kubernetes Service)**
  - AKS architecture
  - az aks commands
  - Azure AD integration
  - Azure CNI vs kubenet
  - Azure Files / Disks
  - Virtual nodes
  - Ejercicio: Cluster AKS completo

- [ ] **Google GKE (Google Kubernetes Engine)**
  - GKE architecture
  - gcloud container commands
  - Workload Identity
  - GKE Autopilot vs Standard
  - Persistent Disks
  - GKE on-prem (Anthos)
  - Ejercicio: Cluster GKE Autopilot

- [ ] **Comparación de Managed Kubernetes**
  - Pricing comparison
  - Features comparison
  - Networking differences
  - Storage options
  - Integración con servicios cloud
  - Ejercicio: Matriz de decisión

### 6.5 CI/CD Avanzado para Kubernetes
**Tiempo estimado: 3-4 semanas**

- [ ] **Pipeline Completo**
  - Build image (multi-stage)
  - Security scanning (Trivy, Snyk)
  - Push to registry
  - Update manifests (Kustomize/Helm)
  - Deploy via GitOps
  - Smoke tests
  - Ejercicio: Pipeline end-to-end

- [ ] **Progressive Delivery**
  - Flagger (automated canaries)
  - Metrics analysis
  - Automated rollback
  - Notifications
  - Ejercicio: Canary deployment automated

- [ ] **Testing Strategies**
  - Unit tests en CI
  - Integration tests con kind
  - E2E tests en cluster efímero
  - Load testing (k6)
  - Chaos engineering (Chaos Mesh)
  - Ejercicio: Test suite completo

### 6.6 Proyecto Final Integrador
**Tiempo estimado: 6-8 semanas**

- [ ] **E-commerce Kubernetes-Native**

**Arquitectura:**
  - Frontend: React SPA (Nginx container)
  - API Gateway: Node.js/NestJS
  - Microservices: Products, Orders, Users, Payments
  - Database: PostgreSQL (StatefulSet) + Redis
  - Message Queue: RabbitMQ
  - Storage: MinIO (S3-compatible)
  - Service Mesh: Linkerd
  - Ingress: Nginx Ingress Controller
  - Observability: Prometheus + Grafana + Loki
  - GitOps: ArgoCD
  - CI/CD: GitHub Actions

**Funcionalidades:**
  - Catálogo de productos (CRUD)
  - Carrito de compras (Redis)
  - Autenticación JWT
  - Procesamiento de pedidos (async con RabbitMQ)
  - Procesamiento de pagos (mock Stripe)
  - Notificaciones por email
  - Upload de imágenes (MinIO)
  - Search con Elasticsearch
  - Rate limiting
  - Circuit breaker

**Requisitos técnicos:**
  - TypeScript estricto en todos los services
  - Helm charts para cada component
  - GitOps con ArgoCD
  - CI/CD completo (build, test, scan, deploy)
  - Observabilidad completa (logs, metrics, traces)
  - HA setup (multi-replica, PDB)
  - Resource limits optimizados
  - Network policies
  - RBAC configurado
  - Secrets con External Secrets Operator
  - HPA configurado
  - Deployment strategies (canary)
  - Disaster recovery plan
  - Documentación completa (arquitectura, runbooks)
  - Multi-environment (dev, staging, prod)
  - Tests (&gt;70% coverage)

---

## 📖 Recursos y Práctica

### Libros Recomendados
1. **"Kubernetes Up &amp; Running"** - Kelsey Hightower, Brendan Burns
2. **"The Kubernetes Book"** - Nigel Poulton
3. **"Kubernetes Patterns"** - Bilgin Ibryam, Roland Huß
4. **"Production Kubernetes"** - Josh Rosso, Rich Lander
5. **"Docker Deep Dive"** - Nigel Poulton
6. **"Kubernetes in Action"** - Marko Lukša
7. **"Cloud Native DevOps with Kubernetes"** - John Arundel, Justin Domingus

### Recursos Online
- [Kubernetes Official Docs](https://kubernetes.io/docs/) - Documentación oficial excelente
- [CNCF Landscape](https://landscape.cncf.io/) - Ecosistema cloud-native
- [Kubernetes The Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) - Setup manual de K8s
- [KillerCoda](https://killercoda.com/kubernetes) - Interactive scenarios
- [Kubernetes Patterns](https://k8spatterns.io/) - Patrones de diseño
- [Learnk8s](https://learnk8s.io/) - Excellent blog y courses
- [CNCF YouTube](https://www.youtube.com/c/cloudnativefdn) - Talks y webinars

### Cursos Recomendados
- **CKA** (Certified Kubernetes Administrator)
- **CKAD** (Certified Kubernetes Application Developer)
- **CKS** (Certified Kubernetes Security Specialist)
- Udemy - "Kubernetes for the Absolute Beginners"
- A Cloud Guru - Kubernetes courses
- Linux Foundation - Kubernetes courses

### Práctica Recomendada

#### Ejercicios Diarios (30-60 min)
- Desplegar apps en Kubernetes local
- Leer documentación oficial
- Practicar kubectl commands
- Explorar Helm charts en Artifact Hub
- Revisar YAML manifests de proyectos open source

#### Ejercicios Semanales (3-5 horas)
- Implementar un patrón nuevo
- Setup de herramienta del ecosistema
- Migrate app de Docker Compose a K8s
- Crear Helm chart para proyecto
- Code review de manifests

#### Proyectos Mensuales (10-20 horas)
- Deploy completo de app multi-tier
- Setup de observabilidad completa
- Implementación de GitOps
- CI/CD pipeline end-to-end
- Blog post sobre aprendizaje

### Sistema de Evaluación

#### Por cada concepto/herramienta:
- [ ] Entender el problema que resuelve
- [ ] Conocer alternativas
- [ ] Implementar desde cero
- [ ] Identificar cuándo usar y cuándo NO
- [ ] Conocer best practices
- [ ] Hacer 2-3 ejercicios prácticos

#### Criterios de Dominio:
- **Básico**: Puedes desplegar apps siguiendo tutoriales
- **Intermedio**: Puedes diseñar arquitecturas simples
- **Avanzado**: Puedes optimizar y troubleshoot
- **Experto**: Puedes diseñar para producción y enseñar a otros

---

## 🎯 Plan de Estudio Sugerido

### Opción Intensiva (5-6 meses)
- 20-30 horas/semana
- Enfoque full-time
- Completar todos los niveles
- Budget cloud: ~$100-200/mes
- Certificaciones: CKA + CKAD

### Opción Moderada (9-12 meses)
- 10-15 horas/semana
- Balance con trabajo
- Profundizar en cada área
- Budget cloud: ~$50-100/mes
- Certificación: CKAD

### Opción Pausada (15-18 meses)
- 5-10 horas/semana
- Aprendizaje sostenible
- Máxima práctica
- Budget cloud: ~$30-50/mes
- Usar clusters locales al máximo

---

## 💰 Gestión de Costos

### Clusters Locales (Gratis)
- **minikube**: Single-node cluster en VM
- **kind**: Kubernetes en Docker containers
- **k3d**: k3s en Docker (más rápido que kind)
- **Docker Desktop**: Kubernetes integrado
- **microk8s**: Lightweight, para Linux

### Free Tiers Cloud
- **GKE**: $300 créditos (3 meses)
- **AKS**: $200 créditos (30 días)
- **EKS**: Control plane ~$70/mes (no free tier)
- **Civo Cloud**: $250 créditos (k3s-based)
- **DigitalOcean**: $200 créditos (2 meses)

### Consejos para Minimizar Costos
1. **Usa clusters locales para learning**
2. **Apaga clusters cloud cuando no uses**
3. **Terraform/Pulumi para create/destroy fácil**
4. **Usa spot/preemptible nodes**
5. **t3.small/t3.medium nodes (pequeños)**
6. **Budget alerts configurados**
7. **Auto-shutdown con scripts**
8. **Comparte cluster con team de estudio**

---

## 🚀 Consejos para el Éxito

1. **Practica con clusters locales primero** - Antes de cloud
2. **Aprende kubectl de memoria** - Es tu herramienta diaria
3. **Lee la doc oficial** - Es excelente, no solo tutoriales
4. **Entiende YAML** - Lo escribirás mucho
5. **Usa GitOps desde el inicio** - No kubectl apply manual
6. **Automatiza todo** - Scripts, CI/CD, IaC
7. **Observabilidad es crítica** - Logs, metrics, traces
8. **Practica troubleshooting** - Rompe cosas a propósito
9. **Únete a comunidades** - CNCF Slack, Kubernetes Forum
10. **Certifícate** - CKA/CKAD validan tu conocimiento
11. **Documenta tu learning** - Blog posts, GitHub repos
12. **No temas a la complejidad inicial** - Kubernetes es complejo, normal
13. **Compara con Serverless** - Entiende trade-offs
14. **Piensa en portabilidad** - El valor real de K8s
15. **Contribuye a OSS** - Helm charts, operators, docs

---

## 📝 Tracking de Progreso

### Formato de Registro

Para cada concepto/herramienta:
```
Concepto/Tool: [Nombre]
Fecha: [DD/MM/YYYY]
Tiempo invertido: [X horas]
Costo: [$X.XX]
Nivel de comprensión: [Básico/Intermedio/Avanzado/Experto]
Ejercicios completados: [X/Y]
Proyecto GitHub: [URL]
Notas: [Insights, dificultades, comparaciones con Serverless]
```

### Milestones

- [ ] **Mes 1**: Docker mastery y primera app en Kubernetes local
- [ ] **Mes 2**: Kubernetes core concepts dominados
- [ ] **Mes 3**: Helm, ConfigMaps, Secrets en uso
- [ ] **Mes 4**: Observabilidad completa (Prometheus + Grafana)
- [ ] **Mes 5**: GitOps con ArgoCD
- [ ] **Mes 6**: Deployment en cloud (EKS/GKE/AKS)
- [ ] **Mes 7-9**: Patterns avanzados, service mesh
- [ ] **Mes 10-12**: Proyecto final y certificación

---

## 🎓 Certificaciones Kubernetes

### CKAD (Certified Kubernetes Application Developer)
- **Nivel**: Intermedio
- **Enfoque**: Deploying applications
- **Duración**: 2 horas
- **Costo**: $395
- **Recomendado para**: Developers
- **Cuándo**: Después de Nivel 3-4

### CKA (Certified Kubernetes Administrator)
- **Nivel**: Avanzado
- **Enfoque**: Cluster administration
- **Duración**: 2 horas
- **Costo**: $395
- **Recomendado para**: DevOps, SRE
- **Cuándo**: Después de Nivel 4-5

### CKS (Certified Kubernetes Security Specialist)
- **Nivel**: Expert
- **Enfoque**: Security
- **Duración**: 2 horas
- **Costo**: $395
- **Prerequisito**: CKA válido
- **Cuándo**: Después de CKA

### Orden Sugerido para Arquitecto Multicloud:
1. **CKAD** (entender deployment de apps)
2. **CKA** (entender operations)
3. **CKS** (opcional, si enfoque en security)

---

## 🔥 Proyectos de Práctica Sugeridos

### Nivel Principiante:
- **Hello World Deployment**: Simple web app
- **WordPress + MySQL**: StatefulSet + PVC
- **Node.js API + Redis**: Multi-tier app
- **Multi-container Pod**: Sidecar pattern

### Nivel Intermedio:
- **Blog Platform**: CRUD completo con DB
- **Microservices App**: 3-4 services comunicándose
- **GitOps Setup**: Flux o ArgoCD
- **Observability Stack**: Prometheus + Grafana + Loki
- **Helm Chart**: Para tu app

### Nivel Avanzado:
- **E-commerce**: Proyecto final descrito arriba
- **Service Mesh**: Istio o Linkerd
- **Multi-cluster**: Federation setup
- **Operator**: Custom CRD + controller
- **CI/CD Pipeline**: GitHub Actions + ArgoCD + Canary

---

## 🌉 Comparación: Kubernetes vs Serverless

### Para Arquitectos Multicloud: La Decisión Crítica

| Criterio | Kubernetes | Serverless (Lambda, etc.) |
|----------|------------|---------------------------|
| **Portabilidad** | ✅ Excelente (runs anywhere) | ❌ Vendor lock-in |
| **Control** | ✅ Total control | ❌ Runtime limitado |
| **Costos variables** | ❌ Costos base altos | ✅ Pay-per-use real |
| **Cold starts** | ✅ No cold starts | ❌ Cold starts significativos |
| **Scaling** | ✅ Predecible | ✅ Automático infinito |
| **Complexity** | ❌ Alta complejidad | ✅ Muy simple |
| **Long-running** | ✅ Sí (WebSockets, streams) | ❌ Max 15 min |
| **Dependencies** | ✅ Cualquier cosa | ❌ Limitado por layers |
| **Local dev** | ✅ Idéntico a producción | ⚠️ Emulación |
| **Networking** | ✅ Service mesh, etc. | ❌ Limitado |
| **Ecosystem** | ✅ CNCF enorme | ⚠️ Cloud-specific |
| **Skills** | ❌ Curva de aprendizaje alta | ✅ Fácil de empezar |

### Arquitecturas Híbridas (Lo Mejor de Ambos Mundos)

**Usa Kubernetes para:**
- Core API services (long-running)
- Databases y stateful apps
- WebSocket servers
- Microservices complejos
- ML model serving (con GPUs)

**Usa Serverless para:**
- Event processing (S3, EventBridge)
- Scheduled jobs (cron)
- API endpoints simples (CRUD)
- Image processing
- Webhooks

**Ejemplo de arquitectura híbrida:**
```
Frontend (S3 + CloudFront)
    ↓
API Gateway (Serverless)
    ↓
┌─────────────┬──────────────────┐
│   Lambda    │    Kubernetes    │
│  (simple)   │    (complex)     │
│             │                  │
│ - Auth      │ - Core API       │
│ - Events    │ - WebSockets     │
│ - Webhooks  │ - ML serving     │
│ - Cron      │ - Databases      │
└─────────────┴──────────────────┘
         ↓
    DynamoDB / RDS
```

---

## 🎯 Próximos Pasos

1. **Instala Docker Desktop** (incluye Kubernetes local)
2. **Sigue el QUICK_START.md** (próximo archivo)
3. **Completa tutorial interactivo** (KillerCoda)
4. **Despliega primera app en Kubernetes local**
5. **Únete a CNCF Slack** (#kubernetes-novice)
6. **Crea repo de learning en GitHub**
7. **Documenta tu progreso** (blog/notes)
8. **Decide: minikube, kind, o k3d** para local dev
9. **Planifica presupuesto cloud** (si vas a cloud)
10. **Comienza con Nivel 1** (no saltes conceptos)

---

## 🏆 Valor Para un Arquitecto Multicloud

### Por Qué Este Roadmap es Crítico

1. **Decisiones Informadas**
   - Sabrás cuándo recomendar Kubernetes vs Serverless
   - Entenderás trade-offs de costos
   - Podrás diseñar arquitecturas híbridas

2. **Portabilidad Real**
   - Kubernetes es el estándar cross-cloud
   - No estarás limitado a AWS/Azure/GCP
   - Podrás diseñar para multi-cloud real

3. **Credibilidad Técnica**
   - Hablarás el lenguaje de DevOps/SRE
   - Entenderás las necesidades de equipos
   - Podrás liderar decisiones de arquitectura

4. **Visión de Futuro**
   - Kubernetes es el futuro (y presente) de cloud
   - CNCF crece exponencialmente
   - GitOps es el nuevo standard

5. **Complemento Perfecto**
   - AwsServerless: Para workloads event-driven
   - ContainerOrchestration: Para apps stateful/long-running
   - MulticloudApps: Para true portabilidad

---

**¡Bienvenido al mundo de Container Orchestration!** 🐳☸️

*Este roadmap te llevará de cero a production-ready Kubernetes en 6-12 meses. Al completarlo, tendrás las skills para tomar decisiones arquitectónicas informadas entre Serverless, Containers, y arquitecturas híbridas.*

**Pro tip**: No necesitas ser un experto en Kubernetes para ser un gran arquitecto. Pero sí necesitas entender cuándo usarlo y cuándo no. Este roadmap te dará ese criterio.
