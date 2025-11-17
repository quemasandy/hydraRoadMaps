# 🚀 Quick Start Guide - AWS Serverless con TypeScript

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

### 1. Node.js y npm
```bash
# Verificar versión (requiere Node.js 20+)
node --version
npm --version

# Instalar desde https://nodejs.org/
```

### 2. AWS CLI
```bash
# Instalar AWS CLI
# macOS:
brew install awscli

# Linux:
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Windows:
# Descargar desde https://aws.amazon.com/cli/

# Verificar instalación
aws --version
```

### 3. Configurar Credenciales AWS
```bash
# Configurar credenciales
aws configure

# Ingresar:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (ej: us-east-1)
# - Default output format (json)

# Verificar configuración
aws sts get-caller-identity
```

### 4. Instalar Herramienta de IaC (elige una)

#### Opción A: AWS SAM (Recomendado para empezar)
```bash
# macOS
brew install aws-sam-cli

# Linux/Windows - ver https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

# Verificar
sam --version
```

#### Opción B: Serverless Framework
```bash
npm install -g serverless

# Verificar
serverless --version
```

#### Opción C: AWS CDK
```bash
npm install -g aws-cdk

# Verificar
cdk --version

# Bootstrap (primera vez)
cdk bootstrap
```

## 🎯 Tu Primera Lambda Function

### Paso 1: Clonar o crear proyecto
```bash
# Navegar al directorio de ejercicios
cd src/claudeExcerciseAwsServerless

# Instalar dependencias
npm install
```

### Paso 2: Crear una función simple
```typescript
// 01-fundamentos/typescript-serverless/hello-world.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Lambda!',
      timestamp: new Date().toISOString()
    })
  };
};
```

### Paso 3: Crear SAM template
```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  HelloWorldFunction:
    Type: AWS::Serverless::Function
    Properties:
      Runtime: nodejs20.x
      Handler: dist/hello-world.handler
      CodeUri: ./
      Events:
        HelloWorld:
          Type: Api
          Properties:
            Path: /hello
            Method: get
```

### Paso 4: Build y Deploy
```bash
# Build
sam build

# Deploy (primera vez - interactivo)
sam deploy --guided

# Deploy (subsecuentes)
sam deploy

# Ver logs
sam logs -n HelloWorldFunction --tail
```

### Paso 5: Probar
```bash
# Obtener URL del API
sam list endpoints

# Hacer request
curl https://<your-api-id>.execute-api.us-east-1.amazonaws.com/Prod/hello
```

## 📚 Siguientes Pasos

### Nivel 1: Fundamentos (Semana 1-2)
1. Lee `01-fundamentos/conceptos-serverless/README.md`
2. Estudia `01-fundamentos/typescript-serverless/01-tipos-aws-lambda.ts`
3. Practica con `01-fundamentos/iac-basics/`

### Nivel 2: Lambda Básico (Semana 3-4)
1. Implementa `02-lambda-basico/anatomia-lambda/01-hello-world.ts`
2. Experimenta con diferentes event sources
3. Aprende a hacer testing local

### Nivel 3: API + Database (Semana 5-7)
1. Crea tu primera REST API
2. Integra DynamoDB
3. Implementa CRUD completo

## 💡 Tips Iniciales

### 1. Usa AWS Free Tier
- Lambda: 1M requests gratis/mes
- DynamoDB: 25GB gratis
- API Gateway: 1M requests/mes (primeros 12 meses)

### 2. Configura Billing Alerts
```bash
# En la consola AWS:
# AWS Console → Billing → Budgets → Create Budget
# Configura alerta en $5, $10, $20
```

### 3. Limpia Recursos Regularmente
```bash
# Eliminar stack completo
sam delete

# O vía CloudFormation console
aws cloudformation delete-stack --stack-name <stack-name>
```

### 4. Testing Local
```bash
# Iniciar API localmente
sam local start-api

# Invocar función específica
sam local invoke HelloWorldFunction

# Con evento custom
sam local invoke -e events/api-gateway.json
```

### 5. Ver Logs en Tiempo Real
```bash
# CloudWatch Logs
aws logs tail /aws/lambda/HelloWorldFunction --follow

# O con SAM
sam logs -n HelloWorldFunction --tail
```

## 🐛 Troubleshooting Común

### Error: "Unable to locate credentials"
```bash
# Reconfigurar AWS CLI
aws configure

# O establecer variables de entorno
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
```

### Error: Build failed
```bash
# Verificar Node.js version
node --version  # Debe ser 20+

# Limpiar y rebuild
rm -rf .aws-sam
sam build
```

### Error: Stack already exists
```bash
# Eliminar stack existente
sam delete --stack-name <name>

# O usar --guided con otro nombre
sam deploy --guided
```

### Lambda timeout
```bash
# Aumentar timeout en template.yaml
Properties:
  Timeout: 30  # Segundos (default: 3)
```

## 📖 Recursos Adicionales

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [SAM Developer Guide](https://docs.aws.amazon.com/serverless-application-model/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎓 Comunidades

- [AWS Community](https://community.aws/)
- [Serverless Stack Community](https://sst.dev/discord)
- [r/aws on Reddit](https://www.reddit.com/r/aws/)
- [ServerlessLand](https://serverlessland.com/)

## ✅ Checklist Inicial

- [ ] Node.js 20+ instalado
- [ ] AWS CLI instalado y configurado
- [ ] SAM CLI instalado
- [ ] Cuenta AWS creada (Free Tier)
- [ ] Billing alerts configuradas
- [ ] Primera Lambda desplegada exitosamente
- [ ] Logs visibles en CloudWatch
- [ ] API Gateway funcionando
- [ ] Capaz de hacer cambios y re-deploy

---

**¡Estás listo para comenzar tu viaje en AWS Serverless!** 🚀

Empieza con el [README principal](./README.md) y sigue el roadmap nivel por nivel.
