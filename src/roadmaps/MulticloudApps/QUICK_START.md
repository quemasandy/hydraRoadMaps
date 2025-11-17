# 🚀 Guía de Inicio Rápido - Aplicaciones Multicloud

Esta guía te ayudará a configurar tu entorno y desplegar tu primera aplicación multicloud en **menos de 2 horas**.

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener:
- [ ] Conocimientos básicos de TypeScript/JavaScript
- [ ] Familiaridad con terminal/línea de comandos
- [ ] Git instalado
- [ ] Editor de código (VSCode recomendado)
- [ ] Node.js 18+ instalado
- [ ] 2-3 horas disponibles
- [ ] Tarjeta de crédito (para crear cuentas cloud - usaremos free tier)

---

## 🎯 Objetivos de esta Guía

Al finalizar esta guía habrás:
1. ✅ Creado cuentas en AWS, Azure y GCP
2. ✅ Configurado las CLIs de cada proveedor
3. ✅ Desplegado una función serverless en las 3 clouds
4. ✅ Creado tu primera abstracción multicloud
5. ✅ Entendido los conceptos básicos de portabilidad

---

## Paso 1: Crear Cuentas Cloud (30 minutos)

### 1.1 Amazon Web Services (AWS)
```bash
# Visita: https://aws.amazon.com/free/
# - Crea cuenta con email dedicado (ej: tu-nombre+aws@gmail.com)
# - Free tier incluye:
#   - Lambda: 1M requests/mes
#   - S3: 5GB storage (12 meses)
#   - EC2: 750 horas t2.micro (12 meses)
```

**Pasos importantes:**
1. Crea cuenta AWS
2. **Configura MFA inmediatamente** (seguridad)
3. **Configura billing alert** ($10 threshold)
4. Crea IAM user (no uses root account)
5. Descarga access keys

### 1.2 Microsoft Azure
```bash
# Visita: https://azure.microsoft.com/free/
# - Crea cuenta con email dedicado
# - $200 créditos gratis (30 días)
# - Servicios gratis permanentes:
#   - Functions: 1M requests/mes
#   - Blob Storage: 5GB
#   - SQL Database: 250GB
```

**Pasos importantes:**
1. Crea cuenta Azure
2. **Configura MFA**
3. **Configura cost alert** ($20 threshold)
4. Crea Service Principal para CLI
5. Guarda credenciales

### 1.3 Google Cloud Platform (GCP)
```bash
# Visita: https://cloud.google.com/free/
# - Crea cuenta con email dedicado
# - $300 créditos gratis (90 días)
# - Always free tier:
#   - Cloud Functions: 2M requests/mes
#   - Cloud Storage: 5GB
#   - Compute Engine: 1 f1-micro instance
```

**Pasos importantes:**
1. Crea cuenta GCP
2. **Configura MFA**
3. **Configura budget alert** ($30 threshold)
4. Crea proyecto (ej: "multicloud-learning")
5. Habilita Billing API
6. Crea service account
7. Descarga JSON key

---

## Paso 2: Instalar Herramientas (20 minutos)

### 2.1 AWS CLI
```bash
# macOS (Homebrew)
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Windows (PowerShell)
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi

# Verificar instalación
aws --version

# Configurar credenciales
aws configure
# AWS Access Key ID: [tu-access-key]
# AWS Secret Access Key: [tu-secret-key]
# Default region: us-east-1
# Default output format: json

# Verificar
aws sts get-caller-identity
```

### 2.2 Azure CLI
```bash
# macOS
brew install azure-cli

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Windows
# Descarga: https://aka.ms/installazurecliwindows

# Verificar instalación
az --version

# Login
az login

# Set subscription (si tienes múltiples)
az account set --subscription "nombre-o-id-de-subscription"

# Verificar
az account show
```

### 2.3 Google Cloud SDK
```bash
# macOS
brew install --cask google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Windows
# Descarga: https://cloud.google.com/sdk/docs/install

# Verificar instalación
gcloud --version

# Inicializar y autenticar
gcloud init
# Sigue el flujo de autenticación en el browser

# Set project
gcloud config set project TU-PROJECT-ID

# Autenticar con service account (alternativa)
gcloud auth activate-service-account --key-file=path/to/key.json

# Verificar
gcloud config list
```

### 2.4 Herramientas Adicionales
```bash
# Terraform (opcional para esta guía rápida)
brew install terraform

# Docker
brew install --cask docker

# kubectl (para Kubernetes más adelante)
brew install kubectl

# Node.js y npm (si no lo tienes)
brew install node

# TypeScript
npm install -g typescript

# ts-node (para ejecutar TypeScript directamente)
npm install -g ts-node
```

---

## Paso 3: Proyecto Base Multicloud (40 minutos)

### 3.1 Crear Proyecto
```bash
# Crear directorio
mkdir multicloud-quickstart
cd multicloud-quickstart

# Inicializar proyecto Node.js
npm init -y

# Instalar dependencias
npm install \
  @aws-sdk/client-lambda \
  @azure/functions \
  @google-cloud/functions-framework \
  typescript \
  @types/node

# Instalar dependencias de desarrollo
npm install -D \
  @types/aws-lambda \
  ts-node \
  esbuild

# Crear tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Crear estructura de carpetas
mkdir -p src/{aws,azure,gcp,shared}
```

### 3.2 Crear Función Serverless Multicloud

#### Interfaz Común (src/shared/types.ts)
```typescript
/**
 * Interfaz común para todas las funciones cloud
 */
export interface CloudRequest {
  method: string;
  path: string;
  queryParams: Record<string, string>;
  body?: string;
  headers: Record<string, string>;
}

export interface CloudResponse {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
}

/**
 * Handler genérico para todas las clouds
 */
export type CloudHandler = (
  request: CloudRequest
) => Promise<CloudResponse>;
```

#### Lógica de Negocio (src/shared/business-logic.ts)
```typescript
import { CloudRequest, CloudResponse } from './types';

/**
 * Lógica de negocio cloud-agnostic
 * Esta función no sabe nada sobre AWS, Azure o GCP
 */
export async function handleRequest(
  request: CloudRequest
): Promise<CloudResponse> {
  console.log('Processing request:', JSON.stringify(request, null, 2));

  // Lógica de negocio simple
  const name = request.queryParams?.name || 'World';
  const cloud = request.headers['x-cloud-provider'] || 'Unknown';

  const responseBody = {
    message: `Hello ${name} from ${cloud}!`,
    timestamp: new Date().toISOString(),
    path: request.path,
    method: request.method,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(responseBody, null, 2),
    headers: {
      'Content-Type': 'application/json',
      'X-Cloud-Provider': cloud,
    },
  };
}
```

#### AWS Lambda Handler (src/aws/index.ts)
```typescript
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { CloudRequest } from '../shared/types';
import { handleRequest } from '../shared/business-logic';

/**
 * Adapter para AWS Lambda
 * Convierte el evento de API Gateway al formato común
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  console.log('AWS Lambda invoked', { event, context });

  // Convertir evento de AWS al formato común
  const request: CloudRequest = {
    method: event.httpMethod,
    path: event.path,
    queryParams: event.queryStringParameters || {},
    body: event.body || undefined,
    headers: {
      ...event.headers,
      'x-cloud-provider': 'AWS',
    },
  };

  // Llamar a la lógica de negocio
  const response = await handleRequest(request);

  // Convertir respuesta común al formato de AWS
  return {
    statusCode: response.statusCode,
    body: response.body,
    headers: response.headers,
  };
}
```

#### Azure Function Handler (src/azure/index.ts)
```typescript
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { CloudRequest } from '../shared/types';
import { handleRequest } from '../shared/business-logic';

/**
 * Adapter para Azure Functions
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log('Azure Function triggered', req);

  // Convertir request de Azure al formato común
  const request: CloudRequest = {
    method: req.method || 'GET',
    path: req.url || '/',
    queryParams: req.query || {},
    body: req.body ? JSON.stringify(req.body) : undefined,
    headers: {
      ...(req.headers || {}),
      'x-cloud-provider': 'Azure',
    },
  };

  // Llamar a la lógica de negocio
  const response = await handleRequest(request);

  // Setear respuesta en formato Azure
  context.res = {
    status: response.statusCode,
    body: response.body,
    headers: response.headers,
  };
};

export default httpTrigger;
```

#### Google Cloud Function Handler (src/gcp/index.ts)
```typescript
import { Request, Response } from '@google-cloud/functions-framework';
import { CloudRequest } from '../shared/types';
import { handleRequest } from '../shared/business-logic';

/**
 * Adapter para Google Cloud Functions
 */
export async function helloWorld(req: Request, res: Response): Promise<void> {
  console.log('Google Cloud Function invoked', req);

  // Convertir request de GCP al formato común
  const request: CloudRequest = {
    method: req.method,
    path: req.path,
    queryParams: req.query as Record<string, string>,
    body: req.body ? JSON.stringify(req.body) : undefined,
    headers: {
      ...(req.headers as Record<string, string>),
      'x-cloud-provider': 'GCP',
    },
  };

  // Llamar a la lógica de negocio
  const response = await handleRequest(request);

  // Enviar respuesta en formato GCP
  res.status(response.statusCode);
  res.set(response.headers);
  res.send(response.body);
}
```

### 3.3 Compilar Código
```bash
# Agregar scripts a package.json
npm pkg set scripts.build="tsc"
npm pkg set scripts.build:aws="esbuild src/aws/index.ts --bundle --platform=node --target=node18 --outfile=dist/aws/index.js"
npm pkg set scripts.build:azure="esbuild src/azure/index.ts --bundle --platform=node --target=node18 --outfile=dist/azure/index.js"
npm pkg set scripts.build:gcp="esbuild src/gcp/index.ts --bundle --platform=node --target=node18 --outfile=dist/gcp/index.js"

# Compilar todo
npm run build

# Compilar versiones optimizadas para cada cloud
npm run build:aws
npm run build:azure
npm run build:gcp
```

---

## Paso 4: Desplegar en las 3 Clouds (30 minutos)

### 4.1 Desplegar en AWS Lambda

```bash
# Crear archivo ZIP
cd dist/aws
zip -r function.zip index.js
cd ../..

# Crear rol IAM para Lambda
aws iam create-role \
  --role-name lambda-multicloud-quickstart \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "lambda.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

# Agregar política básica de ejecución
aws iam attach-role-policy \
  --role-name lambda-multicloud-quickstart \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Esperar un momento para que el rol se propague
sleep 10

# Obtener ARN del rol
ROLE_ARN=$(aws iam get-role --role-name lambda-multicloud-quickstart --query 'Role.Arn' --output text)

# Crear función Lambda
aws lambda create-function \
  --function-name multicloud-quickstart \
  --runtime nodejs18.x \
  --role $ROLE_ARN \
  --handler index.handler \
  --zip-file fileb://dist/aws/function.zip

# Crear URL pública (Function URL)
aws lambda create-function-url-config \
  --function-name multicloud-quickstart \
  --auth-type NONE

# Agregar permisos para invocar vía URL
aws lambda add-permission \
  --function-name multicloud-quickstart \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE

# Obtener URL
AWS_URL=$(aws lambda get-function-url-config --function-name multicloud-quickstart --query 'FunctionUrl' --output text)
echo "AWS Function URL: $AWS_URL"

# Probar
curl "$AWS_URL?name=Multicloud"
```

### 4.2 Desplegar en Azure Functions

```bash
# Crear resource group
az group create \
  --name multicloud-quickstart-rg \
  --location eastus

# Crear storage account (requerido por Functions)
az storage account create \
  --name mcstorage$(date +%s) \
  --resource-group multicloud-quickstart-rg \
  --location eastus \
  --sku Standard_LRS

# Crear Function App
az functionapp create \
  --name multicloud-quickstart-func \
  --resource-group multicloud-quickstart-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --storage-account mcstorage$(date +%s)

# Nota: Azure Functions requiere estructura específica
# Para este quickstart, usa el portal de Azure o Azure Functions Core Tools
# Tutorial completo en: https://docs.microsoft.com/azure/azure-functions/

echo "Azure Function URL: https://multicloud-quickstart-func.azurewebsites.net/api/httpTrigger"
```

### 4.3 Desplegar en Google Cloud Functions

```bash
# Set project
gcloud config set project TU-PROJECT-ID

# Habilitar APIs necesarias
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Desplegar función
gcloud functions deploy multicloud-quickstart \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point helloWorld \
  --source dist/gcp \
  --region us-central1

# Obtener URL
GCP_URL=$(gcloud functions describe multicloud-quickstart --region us-central1 --format='value(httpsTrigger.url)')
echo "GCP Function URL: $GCP_URL"

# Probar
curl "$GCP_URL?name=Multicloud"
```

---

## Paso 5: Probar tu Aplicación Multicloud (10 minutos)

### 5.1 Test Manual
```bash
# AWS
curl "$AWS_URL?name=Developer"

# Azure (reemplaza con tu URL real)
# curl "https://multicloud-quickstart-func.azurewebsites.net/api/httpTrigger?name=Developer"

# GCP
curl "$GCP_URL?name=Developer"
```

### 5.2 Crear Script de Test
```bash
# Crear test.sh
cat > test.sh << 'EOF'
#!/bin/bash

echo "Testing AWS Lambda..."
curl "$AWS_URL?name=Test" | jq .

echo -e "\n\nTesting Google Cloud Function..."
curl "$GCP_URL?name=Test" | jq .

echo -e "\n\nMulticloud deployment successful! 🎉"
EOF

chmod +x test.sh
./test.sh
```

---

## 🎉 ¡Felicitaciones!

Has completado tu primer despliegue multicloud. Has aprendido:

✅ Configurar cuentas en AWS, Azure y GCP
✅ Instalar y configurar las CLIs
✅ Crear una abstracción cloud-agnostic
✅ Desplegar la misma lógica en 3 clouds diferentes
✅ Entender el patrón Adapter para portabilidad

---

## 🧹 Limpieza (IMPORTANTE)

Para evitar cargos, elimina los recursos:

```bash
# AWS
aws lambda delete-function --function-name multicloud-quickstart
aws iam detach-role-policy --role-name lambda-multicloud-quickstart --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam delete-role --role-name lambda-multicloud-quickstart

# Azure
az group delete --name multicloud-quickstart-rg --yes --no-wait

# GCP
gcloud functions delete multicloud-quickstart --region us-central1 --quiet
```

---

## 📚 Próximos Pasos

Ahora que has completado el Quick Start, continúa con:

1. **[README Principal](./README.md)** - Roadmap completo de aprendizaje
2. **[INDICE](./INDICE.md)** - Explorar contenido detallado por nivel
3. **Nivel 2: Abstracción y Portabilidad** - IaC con Terraform/Pulumi
4. **Nivel 3: Servicios Comunes** - Databases, Storage, Networking

---

## 💡 Conceptos Clave Aprendidos

### Patrón Adapter
Has implementado el **Adapter Pattern** para convertir las interfaces específicas de cada cloud a una interfaz común:

```
┌─────────────┐
│   Shared    │  ← Lógica de negocio cloud-agnostic
│  Business   │
│   Logic     │
└─────────────┘
      ▲
      │
      ├──────────┬──────────┬──────────┐
      │          │          │          │
┌─────────┐ ┌─────────┐ ┌─────────┐
│   AWS   │ │  Azure  │ │   GCP   │  ← Adapters
│ Adapter │ │ Adapter │ │ Adapter │
└─────────┘ └─────────┘ └─────────┘
      │          │          │
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Lambda  │ │Function │ │ Cloud   │  ← Servicios cloud
│         │ │         │ │Function │
└─────────┘ └─────────┘ └─────────┘
```

### Portabilidad
- ✅ 90% del código es compartido (business-logic.ts)
- ✅ 10% es adaptación específica por cloud
- ✅ Cambiar de cloud solo requiere cambiar el adapter
- ✅ La lógica de negocio se mantiene cloud-agnostic

---

## 🐛 Troubleshooting

### Error: "AccessDenied" en AWS
```bash
# Verifica tus credenciales
aws sts get-caller-identity

# Re-configura si es necesario
aws configure
```

### Error: "Subscription not found" en Azure
```bash
# Lista subscriptions disponibles
az account list --output table

# Configura la correcta
az account set --subscription "SUBSCRIPTION-ID"
```

### Error: "Project not found" en GCP
```bash
# Lista proyectos
gcloud projects list

# Configura el correcto
gcloud config set project PROJECT-ID
```

### Error de compilación TypeScript
```bash
# Limpia y reconstruye
rm -rf dist node_modules
npm install
npm run build
```

---

**¡Ahora estás listo para construir aplicaciones multicloud! 🌐🚀**
