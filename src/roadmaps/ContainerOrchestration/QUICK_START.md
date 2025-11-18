# 🚀 Quick Start Guide - Container Orchestration

## ⏱️ Tiempo estimado: 30-60 minutos

Esta guía te llevará de cero a tu primer despliegue en Kubernetes en menos de una hora.

---

## 📋 Pre-requisitos

### Software Necesario
- [ ] **Node.js** (v18+): [nodejs.org](https://nodejs.org)
- [ ] **Docker Desktop**: [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
  - Incluye Docker Engine + Kubernetes local
  - Mac, Windows, Linux
- [ ] **kubectl**: Viene con Docker Desktop, o instala con:
  ```bash
  # Mac
  brew install kubectl

  # Windows (Chocolatey)
  choco install kubernetes-cli

  # Linux
  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  chmod +x kubectl
  sudo mv kubectl /usr/local/bin/
  ```

### Verificación
```bash
# Verificar instalaciones
docker --version        # Docker version 24.0.0+
node --version          # v18.0.0+
kubectl version --client # Client Version: v1.28.0+
```

---

## 🐳 Parte 1: Docker Básico (15-20 min)

### 1.1 Tu Primera Imagen Docker

Crea un proyecto de ejemplo:

```bash
mkdir hello-docker
cd hello-docker
```

**package.json:**
```json
{
  "name": "hello-docker",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

**index.js:**
```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Docker!',
    timestamp: new Date().toISOString(),
    hostname: require('os').hostname()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Runtime stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
USER node
CMD ["npm", "start"]
```

**.dockerignore:**
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
```

### 1.2 Build y Run

```bash
# Build image
docker build -t hello-docker:1.0.0 .

# Ver imágenes
docker images

# Run container
docker run -d -p 3000:3000 --name hello hello-docker:1.0.0

# Verificar
curl http://localhost:3000

# Ver logs
docker logs hello

# Ver containers corriendo
docker ps

# Detener y eliminar
docker stop hello
docker rm hello
```

### 1.3 Docker Compose para Multi-Container

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    volumes:
      - .:/app
      - /app/node_modules
    command: npm start

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  redis-data:
```

```bash
# Levantar stack completo
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener todo
docker-compose down
```

**✅ Checkpoint:** Tienes una app containerizada corriendo con Redis.

---

## ☸️ Parte 2: Kubernetes Básico (20-30 min)

### 2.1 Habilitar Kubernetes Local

**Docker Desktop:**
1. Abre Docker Desktop
2. Settings → Kubernetes
3. ✅ Enable Kubernetes
4. Apply & Restart (toma 2-5 min)

**Verificar:**
```bash
kubectl cluster-info
kubectl get nodes
# Deberías ver: docker-desktop   Ready
```

**Alternativa - minikube:**
```bash
# Mac/Linux
brew install minikube
minikube start

# Windows
choco install minikube
minikube start
```

### 2.2 Tu Primer Deployment en Kubernetes

**deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-k8s
  labels:
    app: hello
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hello
  template:
    metadata:
      labels:
        app: hello
    spec:
      containers:
      - name: hello
        image: hello-docker:1.0.0
        imagePullPolicy: Never  # Usar imagen local
        ports:
        - containerPort: 3000
        env:
        - name: PORT
          value: "3000"
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 3
```

**service.yaml:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello-service
spec:
  selector:
    app: hello
  type: LoadBalancer  # NodePort para minikube
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
```

### 2.3 Desplegar en Kubernetes

```bash
# Aplicar manifests
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Ver recursos
kubectl get deployments
kubectl get pods
kubectl get services

# Describir deployment
kubectl describe deployment hello-k8s

# Ver logs de un pod
kubectl logs -f <pod-name>

# Ver logs de todos los pods del deployment
kubectl logs -l app=hello --all-containers=true -f
```

### 2.4 Acceder a la Aplicación

**Docker Desktop Kubernetes:**
```bash
# El LoadBalancer está en localhost
curl http://localhost
# O abre http://localhost en el navegador
```

**Minikube:**
```bash
# Minikube necesita túnel
minikube service hello-service
# O usa port-forward
kubectl port-forward svc/hello-service 8080:80
# Luego: http://localhost:8080
```

### 2.5 Scaling y Updates

```bash
# Scale up
kubectl scale deployment hello-k8s --replicas=5
kubectl get pods

# Ver distribución de Pods
kubectl get pods -o wide

# Update de imagen (simular)
kubectl set image deployment/hello-k8s hello=hello-docker:1.0.1

# Ver rollout status
kubectl rollout status deployment/hello-k8s

# Rollback si hay problema
kubectl rollout undo deployment/hello-k8s

# Ver historial
kubectl rollout history deployment/hello-k8s
```

### 2.6 ConfigMaps y Secrets

**configmap.yaml:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_NAME: "Hello Kubernetes"
  LOG_LEVEL: "info"
  config.json: |
    {
      "feature_flags": {
        "new_ui": true
      }
    }
```

**secret.yaml:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
stringData:
  DATABASE_URL: "postgresql://user:pass@db:5432/mydb"
  API_KEY: "super-secret-key-123"
```

**deployment-with-config.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-k8s-configured
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello-configured
  template:
    metadata:
      labels:
        app: hello-configured
    spec:
      containers:
      - name: hello
        image: hello-docker:1.0.0
        imagePullPolicy: Never
        ports:
        - containerPort: 3000
        env:
        # Desde ConfigMap
        - name: APP_NAME
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: APP_NAME
        # Desde Secret
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secret
              key: DATABASE_URL
        # Mount ConfigMap como file
        volumeMounts:
        - name: config-volume
          mountPath: /app/config
          readOnly: true
      volumes:
      - name: config-volume
        configMap:
          name: app-config
          items:
          - key: config.json
            path: config.json
```

```bash
# Aplicar
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment-with-config.yaml

# Ver ConfigMap
kubectl get configmap app-config -o yaml

# Ver Secret (base64 encoded)
kubectl get secret app-secret -o yaml

# Verificar env vars en Pod
kubectl exec -it <pod-name> -- env | grep APP_NAME

# Ver archivo montado
kubectl exec -it <pod-name> -- cat /app/config/config.json
```

**✅ Checkpoint:** Tienes una app en Kubernetes con configuración externa.

---

## 🎯 Parte 3: Debugging y Comandos Útiles (10 min)

### 3.1 Comandos Esenciales

```bash
# Ver recursos en todos los namespaces
kubectl get all -A

# Describir un pod (ver events)
kubectl describe pod <pod-name>

# Logs de un pod
kubectl logs <pod-name>
kubectl logs <pod-name> --previous  # Logs del container anterior
kubectl logs -f <pod-name>          # Follow logs

# Ejecutar comando en pod
kubectl exec -it <pod-name> -- sh
kubectl exec -it <pod-name> -- ls -la

# Port forward para testing
kubectl port-forward pod/<pod-name> 8080:3000
kubectl port-forward service/hello-service 8080:80

# Ver eventos del cluster
kubectl get events --sort-by='.lastTimestamp'

# Ver uso de recursos
kubectl top nodes
kubectl top pods

# Eliminar recursos
kubectl delete pod <pod-name>
kubectl delete deployment hello-k8s
kubectl delete service hello-service

# Eliminar todo de un manifest
kubectl delete -f deployment.yaml
```

### 3.2 Troubleshooting Común

**Pod no arranca:**
```bash
# Ver estado
kubectl get pods

# Ver detalles y eventos
kubectl describe pod <pod-name>

# Ver logs
kubectl logs <pod-name>

# Causas comunes:
# - Image pull error (imagen no existe)
# - CrashLoopBackOff (app crashea al iniciar)
# - Insufficient resources (no hay CPU/memoria)
```

**Service no responde:**
```bash
# Ver endpoints
kubectl get endpoints hello-service

# Si endpoints está vacío, selector está mal
kubectl get pods --show-labels
kubectl describe service hello-service

# Probar desde dentro del cluster
kubectl run -it debug --image=alpine --rm -- sh
# Dentro del pod:
apk add curl
curl http://hello-service
```

### 3.3 Herramientas Útiles

```bash
# kubectx + kubens (cambiar contexto/namespace fácilmente)
brew install kubectx

# k9s (UI terminal para Kubernetes)
brew install k9s
k9s

# stern (multi-pod logs)
brew install stern
stern hello  # Ver logs de todos los pods que empiecen con "hello"

# kube-ps1 (prompt con contexto K8s)
brew install kube-ps1
```

---

## 📚 Parte 4: Siguientes Pasos

### 4.1 Arquitectura que Acabas de Crear

```
┌─────────────────────────────────────┐
│     Kubernetes Cluster (local)      │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Deployment: hello-k8s      │  │
│  │   (3 replicas)               │  │
│  │                              │  │
│  │  ┌─────┐  ┌─────┐  ┌─────┐  │  │
│  │  │Pod 1│  │Pod 2│  │Pod 3│  │  │
│  │  └─────┘  └─────┘  └─────┘  │  │
│  └──────────┬───────────────────┘  │
│             │                      │
│  ┌──────────▼───────────────────┐  │
│  │   Service: hello-service     │  │
│  │   (LoadBalancer)             │  │
│  └──────────┬───────────────────┘  │
└─────────────┼───────────────────────┘
              │
              ▼
         localhost:80
```

### 4.2 Qué Aprendiste

✅ **Docker:**
- Crear Dockerfiles multi-stage
- Build y run containers
- Docker Compose para multi-container apps

✅ **Kubernetes:**
- Deployments (con replicas)
- Services (LoadBalancer)
- ConfigMaps y Secrets
- Scaling y rolling updates
- kubectl basics
- Health checks (liveness/readiness)
- Resource limits

### 4.3 Recursos para Continuar

**Próximos temas:**
1. **Ingress Controllers** - Routing avanzado (múltiples apps)
2. **Persistent Volumes** - Storage para databases
3. **StatefulSets** - Para apps stateful (PostgreSQL, etc.)
4. **Helm** - Package manager para Kubernetes
5. **GitOps** - ArgoCD para deployments automatizados
6. **Observabilidad** - Prometheus + Grafana

**Tutoriales Interactivos:**
- [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/) - Official tutorial
- [KillerCoda K8s Scenarios](https://killercoda.com/kubernetes) - Interactive labs
- [Play with Kubernetes](https://labs.play-with-k8s.com/) - Browser-based clusters

**Práctica:**
1. Agrega PostgreSQL al deployment (StatefulSet + PVC)
2. Configura Nginx Ingress para path-based routing
3. Deploy múltiples apps en namespaces diferentes
4. Setup básico de Prometheus para métricas

### 4.4 Limpiar Recursos

```bash
# Eliminar todo lo creado
kubectl delete deployment hello-k8s
kubectl delete service hello-service
kubectl delete configmap app-config
kubectl delete secret app-secret

# Verificar
kubectl get all

# Detener Docker Compose
docker-compose down -v

# (Opcional) Desactivar Kubernetes en Docker Desktop
# Settings → Kubernetes → Disable
```

---

## 🎯 Comparación Rápida: Kubernetes vs Serverless

### Acabas de crear con Kubernetes:
```
✅ App corriendo 24/7
✅ 3 replicas (alta disponibilidad)
✅ Health checks automáticos
✅ Rolling updates sin downtime
✅ Configuración externa (ConfigMap/Secrets)
✅ Portabilidad total (corre en cualquier K8s)
```

### Lo mismo con AWS Lambda (Serverless):
```
✅ Costo $0 cuando no hay requests
✅ Scaling infinito automático
✅ Zero operational overhead
❌ Cold starts (latencia)
❌ Runtime limitado (15 min max)
❌ Vendor lock-in (AWS-specific)
```

### Cuándo Usar Cada Uno:

**Kubernetes para:**
- APIs de alta disponibilidad 24/7
- WebSocket servers
- Workloads predecibles
- Necesitas portabilidad
- Control total del runtime

**Serverless para:**
- Event processing (S3, EventBridge)
- Scheduled jobs (cron)
- Workloads bursty/intermitentes
- APIs con tráfico variable
- Quieres zero ops

**Arquitectura Híbrida (Recomendado):**
```
Frontend (S3 + CloudFront)
    ↓
┌─────────────┬──────────────┐
│  Serverless │  Kubernetes  │
│  (Lambda)   │    (EKS)     │
├─────────────┼──────────────┤
│ - Events    │ - Core API   │
│ - Cron      │ - WebSockets │
│ - Webhooks  │ - Databases  │
└─────────────┴──────────────┘
```

---

## ✅ Conclusión

**En 30-60 minutos has:**
1. ✅ Containerizado una app Node.js
2. ✅ Desplegado en Kubernetes local
3. ✅ Configurado replicas y health checks
4. ✅ Usado ConfigMaps y Secrets
5. ✅ Ejecutado rolling updates
6. ✅ Aprendido debugging básico

**Estás listo para:**
- Continuar con el [README principal](./README.md)
- Explorar el [INDICE](./INDICE.md) completo
- Profundizar en cada nivel del roadmap
- Decidir cuándo usar K8s vs Serverless
- Diseñar arquitecturas multicloud

---

## 🚀 Siguiente Paso Recomendado

**Si tienes 30 minutos más:**

Despliega PostgreSQL con persistent storage:

```yaml
# postgres-statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_PASSWORD
          value: "password123"
        - name: POSTGRES_DB
          value: "myapp"
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 1Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
  clusterIP: None  # Headless service for StatefulSet
```

```bash
kubectl apply -f postgres-statefulset.yaml
kubectl get statefulsets
kubectl get pvc
kubectl exec -it postgres-0 -- psql -U postgres
```

**Ahora tienes una database persistente en Kubernetes!** 🎉

---

**¡Felicitaciones! Has completado el Quick Start de Container Orchestration.** 🐳☸️

*Continúa con el [README.md](./README.md) para profundizar en cada concepto.*
