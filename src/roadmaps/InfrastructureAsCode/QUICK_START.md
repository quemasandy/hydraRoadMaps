# 🚀 Quick Start Guide - Infrastructure as Code (Terraform/CDK)

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

### 1. Node.js y npm
```bash
# Verificar versión (requiere Node.js 20+)
node --version
npm --version

# Instalar desde https://nodejs.org/
```

### 2. Terraform
```bash
# macOS con Homebrew:
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Linux:
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# Windows con Chocolatey:
choco install terraform

# Verificar instalación
terraform --version
```

### 3. AWS CLI
```bash
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

### 4. AWS CDK
```bash
# Instalar AWS CDK globalmente
npm install -g aws-cdk

# Verificar instalación
cdk --version
```

### 5. Configurar Credenciales AWS
```bash
# Método 1: aws configure (básico)
aws configure

# Ingresar:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (ej: us-east-1)
# - Default output format (json)

# Método 2: AWS SSO (recomendado para organizaciones)
aws configure sso

# Verificar configuración
aws sts get-caller-identity
```

---

## 🎯 Opción A: Tu Primer Recurso con Terraform

### Paso 1: Crear Directorio de Proyecto
```bash
mkdir terraform-quickstart
cd terraform-quickstart
```

### Paso 2: Crear archivo `main.tf`
```hcl
# main.tf

# Configurar el provider de AWS
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.6.0"
}

provider "aws" {
  region = "us-east-1"
}

# Crear un bucket S3 simple
resource "aws_s3_bucket" "my_first_bucket" {
  bucket = "my-first-iac-bucket-${random_id.bucket_suffix.hex}"

  tags = {
    Name        = "Mi Primer Bucket IaC"
    Environment = "Learning"
    ManagedBy   = "Terraform"
  }
}

# Bloquear acceso público al bucket
resource "aws_s3_bucket_public_access_block" "my_bucket_pab" {
  bucket = aws_s3_bucket.my_first_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Generar sufijo aleatorio para nombre único
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Output del nombre del bucket
output "bucket_name" {
  value       = aws_s3_bucket.my_first_bucket.id
  description = "El nombre del bucket S3 creado"
}

output "bucket_arn" {
  value       = aws_s3_bucket.my_first_bucket.arn
  description = "El ARN del bucket S3"
}
```

### Paso 3: Inicializar Terraform
```bash
# Inicializar el directorio de trabajo
# Esto descarga los providers necesarios
terraform init
```

### Paso 4: Ver el Plan de Ejecución
```bash
# Ver qué recursos se crearán
terraform plan

# Salida esperada:
# + aws_s3_bucket.my_first_bucket
# + aws_s3_bucket_public_access_block.my_bucket_pab
# + random_id.bucket_suffix
```

### Paso 5: Aplicar los Cambios
```bash
# Crear la infraestructura
terraform apply

# Escribe 'yes' cuando se solicite confirmación
```

### Paso 6: Verificar el Recurso Creado
```bash
# Listar recursos en el state
terraform state list

# Ver detalles del bucket
terraform state show aws_s3_bucket.my_first_bucket

# Verificar en AWS CLI
aws s3 ls | grep my-first-iac-bucket
```

### Paso 7: Destruir los Recursos
```bash
# IMPORTANTE: Siempre destruye recursos de práctica
terraform destroy

# Escribe 'yes' cuando se solicite confirmación
```

---

## 🎯 Opción B: Tu Primera App con AWS CDK

### Paso 1: Crear Proyecto CDK
```bash
# Crear directorio
mkdir cdk-quickstart
cd cdk-quickstart

# Inicializar proyecto CDK con TypeScript
cdk init app --language typescript
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Bootstrap CDK (solo primera vez por cuenta/región)
```bash
# Bootstrap prepara tu cuenta AWS para CDK
cdk bootstrap
```

### Paso 4: Modificar el Stack (`lib/cdk-quickstart-stack.ts`)
```typescript
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class CdkQuickstartStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Crear un bucket S3
    const bucket = new s3.Bucket(this, 'MyFirstCdkBucket', {
      bucketName: `my-first-cdk-bucket-${this.account}`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Para práctica solamente
      autoDeleteObjects: true, // Para práctica solamente
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Crear una función Lambda simple
    const helloFunction = new lambda.Function(this, 'HelloFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Event:', JSON.stringify(event, null, 2));
          return {
            statusCode: 200,
            body: JSON.stringify({
              message: 'Hello from CDK Lambda!',
              timestamp: new Date().toISOString(),
            }),
          };
        };
      `),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    // Dar permisos a Lambda para leer el bucket
    bucket.grantRead(helloFunction);

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: 'Nombre del bucket S3',
    });

    new cdk.CfnOutput(this, 'FunctionName', {
      value: helloFunction.functionName,
      description: 'Nombre de la función Lambda',
    });

    new cdk.CfnOutput(this, 'FunctionArn', {
      value: helloFunction.functionArn,
      description: 'ARN de la función Lambda',
    });
  }
}
```

### Paso 5: Synthesize CloudFormation Template
```bash
# Generar template de CloudFormation
cdk synth

# Esto muestra el template YAML que se desplegará
```

### Paso 6: Ver el Diff (Primera vez será todo nuevo)
```bash
# Mostrar diferencias con el stack actual
cdk diff
```

### Paso 7: Deploy
```bash
# Desplegar el stack
cdk deploy

# Escribe 'y' cuando se solicite confirmación
```

### Paso 8: Probar la Lambda
```bash
# Obtener el nombre de la función desde los outputs
FUNCTION_NAME=$(aws cloudformation describe-stacks \
  --stack-name CdkQuickstartStack \
  --query 'Stacks[0].Outputs[?OutputKey==`FunctionName`].OutputValue' \
  --output text)

# Invocar la función
aws lambda invoke \
  --function-name $FUNCTION_NAME \
  --payload '{}' \
  response.json

# Ver la respuesta
cat response.json
```

### Paso 9: Destruir el Stack
```bash
# IMPORTANTE: Siempre destruye recursos de práctica
cdk destroy

# Escribe 'y' cuando se solicite confirmación
```

---

## 🧪 Crear Tests para CDK

### Paso 1: Instalar Dependencias de Testing
```bash
npm install --save-dev @types/jest
```

### Paso 2: Crear Test (`test/cdk-quickstart.test.ts`)
```typescript
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as CdkQuickstart from '../lib/cdk-quickstart-stack';

describe('CdkQuickstartStack', () => {
  test('S3 Bucket Created', () => {
    const app = new cdk.App();
    const stack = new CdkQuickstart.CdkQuickstartStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);

    // Verificar que se creó un bucket S3
    template.resourceCountIs('AWS::S3::Bucket', 1);

    // Verificar propiedades del bucket
    template.hasResourceProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    });
  });

  test('Lambda Function Created', () => {
    const app = new cdk.App();
    const stack = new CdkQuickstart.CdkQuickstartStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);

    // Verificar que se creó una función Lambda
    template.resourceCountIs('AWS::Lambda::Function', 1);

    // Verificar runtime
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs20.x',
    });
  });

  test('Lambda has S3 Read Permissions', () => {
    const app = new cdk.App();
    const stack = new CdkQuickstart.CdkQuickstartStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);

    // Verificar que existe una política IAM
    template.resourceCountIs('AWS::IAM::Policy', 1);
  });
});
```

### Paso 3: Ejecutar Tests
```bash
npm test
```

---

## 💡 Tips Iniciales

### 1. Configura Billing Alerts AHORA
```bash
# En la consola AWS:
# AWS Console → Billing → Budgets → Create Budget
# Configura alertas en $5, $10, $20, $50
```

### 2. Usa Variables de Entorno para Seguridad
```bash
# NUNCA pongas credenciales en código
# Usa variables de entorno o AWS SSO

# .bashrc o .zshrc
export AWS_PROFILE=development
export AWS_REGION=us-east-1
```

### 3. Terraform: Remote State Setup (Importante)
```bash
# Crear bucket para Terraform state (hacer solo una vez)
aws s3api create-bucket \
  --bucket my-terraform-state-bucket-$(whoami) \
  --region us-east-1

# Crear tabla DynamoDB para locking
aws dynamodb create-table \
  --table-name terraform-state-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

Luego actualiza `main.tf`:
```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state-bucket-<tu-usuario>"
    key            = "quickstart/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}
```

### 4. Comandos Útiles de Diagnóstico

#### Terraform
```bash
# Ver configuración actual
terraform show

# Formatear código
terraform fmt -recursive

# Validar sintaxis
terraform validate

# Obtener gráfico de dependencias
terraform graph | dot -Tpng > graph.png

# Limpiar caché
rm -rf .terraform
```

#### CDK
```bash
# Listar todos los stacks
cdk ls

# Ver metadata del stack
cdk metadata

# Verificar diferencias
cdk diff

# Ver CloudFormation template
cdk synth --no-staging

# Diagnosticar environment
cdk doctor
```

### 5. VSCode Extensions Recomendadas
```json
{
  "recommendations": [
    "hashicorp.terraform",
    "aws-scripting-guy.cdk-explorer",
    "amazonwebservices.aws-toolkit-vscode",
    "ms-azuretools.vscode-azureterraform"
  ]
}
```

---

## 🐛 Troubleshooting Común

### Error: "Unable to locate credentials"
```bash
# Verificar credenciales
aws sts get-caller-identity

# Reconfigurar si es necesario
aws configure

# O verificar variables de entorno
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY
```

### Terraform: Error de permisos IAM
```bash
# Tu usuario IAM necesita permisos suficientes
# Para práctica, puedes usar AdministratorAccess
# NUNCA en producción

# Verificar políticas adjuntas
aws iam list-attached-user-policies --user-name tu-usuario
```

### CDK: "Stack already exists"
```bash
# Si el stack ya existe, usa destroy primero
cdk destroy

# O especifica un nombre diferente en bin/cdk-quickstart.ts
```

### Terraform: State Lock Error
```bash
# Si el proceso se interrumpió, puede quedar locked
# Ver locks actuales
aws dynamodb scan --table-name terraform-state-lock

# Forzar unlock (cuidado!)
terraform force-unlock <LOCK_ID>
```

### Bucket Name Already Exists
```bash
# Los nombres de buckets S3 son globalmente únicos
# Usa tu nombre de usuario o timestamp
# Ejemplo: my-bucket-${whoami}-$(date +%s)
```

---

## 📚 Siguientes Pasos

### Nivel 1: Fundamentos (Semana 1-2)
1. ✅ Completaste el Quick Start
2. Lee `01-fundamentos/conceptos-iac/README.md`
3. Practica con `01-fundamentos/cloud-basics/`
4. Configura multi-cloud credentials (opcional)

### Nivel 2: Terraform Profundo (Semana 3-4)
1. Estudia HCL syntax en detalle
2. Crea tu primer módulo de Terraform
3. Setup remote state en S3
4. Implementa VPC completo con subnets

### Nivel 3: CDK Mastery (Semana 5-7)
1. Crea custom constructs
2. Implementa CDK patterns (API + Lambda)
3. Escribe tests completos
4. Setup CDK Pipelines

---

## ✅ Checklist Inicial

- [ ] Node.js 20+ instalado
- [ ] Terraform instalado y verificado
- [ ] AWS CLI instalado y configurado
- [ ] AWS CDK instalado globalmente
- [ ] Cuenta AWS creada (Free Tier)
- [ ] **Billing alerts configuradas** ⚠️ CRÍTICO
- [ ] Credenciales AWS configuradas
- [ ] Primer recurso con Terraform desplegado
- [ ] Primera app CDK desplegada
- [ ] Tests de CDK ejecutados exitosamente
- [ ] Recursos destruidos (terraform destroy / cdk destroy)
- [ ] Remote state configurado (Terraform)
- [ ] CDK bootstrapped en tu cuenta

---

## 💰 Control de Costos - IMPORTANTE

### Script de Limpieza Automática (Bash)
```bash
#!/bin/bash
# cleanup-all.sh - Destruir toda infraestructura de práctica

echo "🧹 Limpiando infraestructura de práctica..."

# Terraform
for dir in $(find . -name "*.tf" -type f -exec dirname {} \; | sort -u); do
  echo "Destruyendo recursos en: $dir"
  cd "$dir"
  terraform destroy -auto-approve
  cd -
done

# CDK
for dir in $(find . -name "cdk.json" -type f -exec dirname {} \; | sort -u); do
  echo "Destruyendo stack CDK en: $dir"
  cd "$dir"
  cdk destroy --all --force
  cd -
done

echo "✅ Limpieza completada"
```

### Configurar Cron Job (Linux/macOS)
```bash
# Destruir todo a las 11 PM diariamente
# Editar crontab
crontab -e

# Agregar línea:
0 23 * * * /path/to/cleanup-all.sh >> /tmp/cleanup.log 2>&1
```

---

## 🌟 Recursos Adicionales

### Documentation
- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [Terraform Registry](https://registry.terraform.io/)
- [CDK Patterns](https://cdkpatterns.com/)

### Interactive Learning
- [HashiCorp Learn - Terraform](https://learn.hashicorp.com/terraform)
- [AWS CDK Workshop](https://cdkworkshop.com/)
- [Terraform Associate Certification Path](https://learn.hashicorp.com/collections/terraform/certification)

### Communities
- [HashiCorp Discuss](https://discuss.hashicorp.com/)
- [CDK Slack](https://cdk.dev/) - cdk.dev para invitación
- [r/terraform](https://reddit.com/r/terraform)
- [r/aws](https://reddit.com/r/aws)

### Tools
- [tfswitch](https://tfswitch.warrensbox.com/) - Cambiar versiones de Terraform
- [tfenv](https://github.com/tfutils/tfenv) - Terraform version manager
- [LocalStack](https://localstack.cloud/) - AWS local testing
- [tfsec](https://github.com/aquasecurity/tfsec) - Security scanner

---

## 🎓 Próximos Desafíos

### Desafío 1: VPC Completo
Crea una VPC con:
- 2 subnets públicas
- 2 subnets privadas
- Internet Gateway
- NAT Gateway
- Route tables configuradas

### Desafío 2: API Serverless
Despliega:
- API Gateway
- Lambda function
- DynamoDB table
- Autenticación con Cognito

### Desafío 3: Multi-Environment
Setup:
- 3 environments (dev, staging, prod)
- Variables por environment
- Remote state separado
- CI/CD pipeline básico

---

**¡Estás listo para comenzar tu viaje en Infrastructure as Code!** 🚀

Empieza con el [README principal](./README.md) y sigue el roadmap nivel por nivel.

**RECUERDA**: Siempre ejecuta `terraform destroy` o `cdk destroy` después de cada sesión de práctica. ¡Tu billetera te lo agradecerá! 💰
