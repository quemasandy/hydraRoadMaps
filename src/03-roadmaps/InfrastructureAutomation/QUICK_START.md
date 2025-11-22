# 🚀 Quick Start Guide - Infraestructura Moderna con AWS CDK y Terraform

## 📋 Prerequisitos

### 1. Cuenta AWS
```bash
# Crear cuenta AWS (Free Tier)
# https://aws.amazon.com/free/

# IMPORTANTE: Configurar billing alerts inmediatamente
# AWS Console → Billing → Budgets → Create Budget
# Configura alertas en $5, $10, $20, $50
```

### 2. Node.js y npm
```bash
# Verificar versión (requiere Node.js 20+)
node --version
npm --version

# Instalar desde https://nodejs.org/
# Recomendado: usar nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### 3. AWS CLI
```bash
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Windows
# Descargar desde https://aws.amazon.com/cli/

# Verificar instalación
aws --version
# Salida esperada: aws-cli/2.x.x
```

### 4. Configurar Credenciales AWS
```bash
# Opción 1: Configurar interactivamente
aws configure

# Ingresar:
# AWS Access Key ID: [tu access key]
# AWS Secret Access Key: [tu secret key]
# Default region: us-east-1
# Default output format: json

# Opción 2: Configurar manualmente
mkdir -p ~/.aws
cat > ~/.aws/credentials << EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_KEY
EOF

cat > ~/.aws/config << EOF
[default]
region = us-east-1
output = json
EOF

# Verificar configuración
aws sts get-caller-identity
# Debe mostrar tu Account ID, UserId y ARN
```

### 5. Instalar AWS CDK
```bash
# Instalar CDK CLI globalmente
npm install -g aws-cdk

# Verificar instalación
cdk --version
# Salida: 2.x.x

# Bootstrap CDK (primera vez en una región/cuenta)
cdk bootstrap aws://ACCOUNT-ID/REGION

# Ejemplo:
cdk bootstrap aws://123456789012/us-east-1
```

### 6. Instalar Terraform
```bash
# macOS
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Linux (Ubuntu/Debian)
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# Windows
# Descargar desde https://www.terraform.io/downloads

# Verificar instalación
terraform --version
# Salida: Terraform v1.x.x
```

---

## 🎯 Opción 1: Tu Primera Infraestructura con AWS CDK

### Paso 1: Crear proyecto CDK
```bash
# Crear directorio del proyecto
mkdir my-first-cdk-app
cd my-first-cdk-app

# Inicializar proyecto CDK con TypeScript
cdk init app --language typescript

# Estructura creada:
# my-first-cdk-app/
# ├── bin/
# │   └── my-first-cdk-app.ts    # Entry point
# ├── lib/
# │   └── my-first-cdk-app-stack.ts  # Stack definition
# ├── test/
# ├── cdk.json
# ├── package.json
# └── tsconfig.json

# Instalar dependencias
npm install
```

### Paso 2: Crear Stack Simple (S3 + Lambda)
```typescript
// lib/my-first-cdk-app-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class MyFirstCdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket
    const bucket = new s3.Bucket(this, 'MyFirstBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Para dev/testing
      autoDeleteObjects: true, // Para dev/testing
    });

    // Lambda Function
    const helloFunction = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          return {
            statusCode: 200,
            body: JSON.stringify({
              message: 'Hello from CDK Lambda!',
              timestamp: new Date().toISOString()
            })
          };
        }
      `),
      handler: 'index.handler',
    });

    // Grant Lambda permission to read from bucket
    bucket.grantRead(helloFunction);

    // API Gateway
    const api = new apigateway.LambdaRestApi(this, 'HelloApi', {
      handler: helloFunction,
      proxy: false,
    });

    const hello = api.root.addResource('hello');
    hello.addMethod('GET');

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: 'The name of the S3 bucket',
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });
  }
}
```

### Paso 3: Synthesize y Deploy
```bash
# Compilar TypeScript
npm run build

# Generar CloudFormation template
cdk synth
# Verás el template YAML generado

# Ver diferencias (primera vez mostrará todo como nuevo)
cdk diff

# Deploy a AWS
cdk deploy

# Confirmar cambios cuando se solicite (y)
# Espera 2-3 minutos mientras se crean los recursos

# Al finalizar, verás los Outputs:
# Outputs:
# MyFirstCdkAppStack.BucketName = myfirstcdkappstack-myfirstbucket...
# MyFirstCdkAppStack.ApiUrl = https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/
```

### Paso 4: Probar
```bash
# Obtener la URL de la API (del output anterior)
export API_URL="https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/"

# Hacer request
curl ${API_URL}hello

# Respuesta esperada:
# {"message":"Hello from CDK Lambda!","timestamp":"2024-11-17T..."}
```

### Paso 5: Cleanup
```bash
# IMPORTANTE: Eliminar recursos para evitar costos
cdk destroy

# Confirmar (y)
# Todos los recursos se eliminarán
```

---

## 🎯 Opción 2: Tu Primera Infraestructura con Terraform

### Paso 1: Crear proyecto Terraform
```bash
# Crear directorio del proyecto
mkdir my-first-terraform-app
cd my-first-terraform-app

# Crear archivos base
touch main.tf variables.tf outputs.tf providers.tf
```

### Paso 2: Configurar Provider
```hcl
# providers.tf
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
```

### Paso 3: Definir Variables
```hcl
# variables.tf
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "my-first-terraform"
}
```

### Paso 4: Crear Recursos (VPC + EC2)
```hcl
# main.tf
# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.project_name}-vpc"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.project_name}-igw"
    Environment = var.environment
  }
}

# Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.project_name}-public-subnet"
    Environment = var.environment
  }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name        = "${var.project_name}-public-rt"
    Environment = var.environment
  }
}

# Route Table Association
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Security Group
resource "aws_security_group" "web" {
  name        = "${var.project_name}-web-sg"
  description = "Allow HTTP inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-web-sg"
    Environment = var.environment
  }
}

# Data source para obtener la AMI más reciente de Amazon Linux 2
data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# EC2 Instance
resource "aws_instance" "web" {
  ami                    = data.aws_ami.amazon_linux_2.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y httpd
              systemctl start httpd
              systemctl enable httpd
              echo "<h1>Hello from Terraform! Instance ID: $(ec2-metadata --instance-id | cut -d ' ' -f 2)</h1>" > /var/www/html/index.html
              EOF

  tags = {
    Name        = "${var.project_name}-web-server"
    Environment = var.environment
  }
}
```

### Paso 5: Definir Outputs
```hcl
# outputs.tf
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "Public Subnet ID"
  value       = aws_subnet.public.id
}

output "instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.web.id
}

output "instance_public_ip" {
  description = "EC2 Instance Public IP"
  value       = aws_instance.web.public_ip
}

output "website_url" {
  description = "Website URL"
  value       = "http://${aws_instance.web.public_ip}"
}
```

### Paso 6: Initialize, Plan y Apply
```bash
# Inicializar Terraform (descarga providers)
terraform init
# Salida: Terraform has been successfully initialized!

# Validar sintaxis
terraform validate
# Salida: Success! The configuration is valid.

# Formatear código
terraform fmt

# Ver plan de ejecución
terraform plan
# Muestra todos los recursos que se crearán

# Aplicar cambios
terraform apply
# Revisar el plan y escribir 'yes' para confirmar
# Espera 2-3 minutos mientras se crean los recursos

# Salida final mostrará los outputs:
# Outputs:
# instance_id = "i-0123456789abcdef0"
# instance_public_ip = "54.123.45.67"
# website_url = "http://54.123.45.67"
# vpc_id = "vpc-0123456789abcdef0"
```

### Paso 7: Probar
```bash
# Obtener la URL del sitio web
export WEBSITE_URL=$(terraform output -raw website_url)

# Esperar 1-2 minutos para que el servidor web se inicie
sleep 120

# Probar el sitio web
curl $WEBSITE_URL

# Salida esperada:
# <h1>Hello from Terraform! Instance ID: i-0123456789abcdef0</h1>
```

### Paso 8: Inspeccionar State
```bash
# Ver el state
terraform show

# Listar recursos en el state
terraform state list

# Ver información de un recurso específico
terraform state show aws_instance.web

# Ver outputs
terraform output
```

### Paso 9: Cleanup
```bash
# IMPORTANTE: Eliminar recursos para evitar costos
terraform destroy

# Revisar recursos a eliminar y escribir 'yes' para confirmar
# Todos los recursos se eliminarán
```

---

## 🛠️ Configuración de Backend Remoto (Terraform)

### Crear S3 Bucket y DynamoDB Table para State
```bash
# Crear bucket para Terraform state
aws s3api create-bucket \
  --bucket my-terraform-state-$(aws sts get-caller-identity --query Account --output text) \
  --region us-east-1

# Habilitar versioning en el bucket
aws s3api put-bucket-versioning \
  --bucket my-terraform-state-$(aws sts get-caller-identity --query Account --output text) \
  --versioning-configuration Status=Enabled

# Crear tabla DynamoDB para locking
aws dynamodb create-table \
  --table-name terraform-state-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1
```

### Configurar Backend en Terraform
```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state-ACCOUNT_ID" # Reemplazar ACCOUNT_ID
    key            = "my-first-terraform/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}
```

```bash
# Re-inicializar Terraform con backend
terraform init -migrate-state
# Confirmar migración del state (yes)
```

---

## 📚 Estructura de Proyecto Recomendada

### CDK Project Structure
```
my-cdk-project/
├── bin/
│   └── app.ts                 # CDK App entry point
├── lib/
│   ├── stacks/
│   │   ├── network-stack.ts   # VPC, Subnets, etc.
│   │   ├── compute-stack.ts   # EC2, ECS, etc.
│   │   └── storage-stack.ts   # S3, RDS, etc.
│   └── constructs/
│       └── custom-construct.ts
├── test/
│   └── stacks.test.ts
├── cdk.json
├── package.json
├── tsconfig.json
└── README.md
```

### Terraform Project Structure
```
my-terraform-project/
├── modules/
│   ├── networking/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── compute/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── storage/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   │   └── ...
│   └── prod/
│       └── ...
├── backend.tf
├── providers.tf
└── README.md
```

---

## 🐛 Troubleshooting Común

### CDK

#### Error: "Need to perform AWS calls for account..."
```bash
# Bootstrap CDK en tu cuenta/región
cdk bootstrap
```

#### Error: "Cannot find module..."
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

#### Error: Stack already exists
```bash
# Eliminar stack existente
cdk destroy

# O renombrar stack en bin/app.ts
```

### Terraform

#### Error: "Backend initialization required"
```bash
# Re-inicializar Terraform
terraform init -reconfigure
```

#### Error: "Error locking state"
```bash
# Si estás seguro que no hay otro apply corriendo
terraform force-unlock LOCK_ID
```

#### Error: "Provider version constraint"
```bash
# Eliminar lock file y re-inicializar
rm .terraform.lock.hcl
terraform init -upgrade
```

#### Error: "No valid credential sources found"
```bash
# Re-configurar AWS CLI
aws configure

# O establecer variables de entorno
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_REGION="us-east-1"
```

---

## ✅ Checklist Inicial

### Setup General
- [ ] Cuenta AWS creada (Free Tier)
- [ ] Billing alerts configuradas ($5, $10, $20, $50)
- [ ] MFA habilitada en cuenta root
- [ ] IAM user creado para desarrollo
- [ ] AWS CLI instalado y configurado
- [ ] Credenciales AWS funcionando (`aws sts get-caller-identity`)

### CDK
- [ ] Node.js 20+ instalado
- [ ] AWS CDK instalado globalmente (`cdk --version`)
- [ ] CDK bootstrapped (`cdk bootstrap`)
- [ ] Primer stack CDK desplegado exitosamente
- [ ] Outputs visibles
- [ ] Capaz de hacer `cdk destroy`

### Terraform
- [ ] Terraform instalado (`terraform --version`)
- [ ] Primer proyecto Terraform inicializado (`terraform init`)
- [ ] Plan ejecutado exitosamente (`terraform plan`)
- [ ] Apply ejecutado exitosamente (`terraform apply`)
- [ ] Outputs visibles (`terraform output`)
- [ ] Capaz de hacer `terraform destroy`
- [ ] Backend remoto configurado (opcional para empezar)

---

## 📖 Próximos Pasos

### Después del Quick Start
1. Lee el [README principal](./README.md) completo
2. Revisa el [INDICE](./INDICE.md) de contenidos
3. Decide si empiezas con CDK o Terraform (o ambos)
4. Sigue el roadmap nivel por nivel
5. Practica destruyendo y reconstruyendo infraestructura

### Recursos de Aprendizaje
- [CDK Workshop](https://cdkworkshop.com/)
- [Terraform Getting Started](https://learn.hashicorp.com/terraform)
- [AWS Well-Architected Labs](https://www.wellarchitectedlabs.com/)
- [CDK Patterns](https://cdkpatterns.com/)
- [Terraform AWS Examples](https://github.com/terraform-aws-modules)

### Comunidades
- [CDK Slack](https://cdk.dev) - Únete al canal #general
- [Terraform Discuss](https://discuss.hashicorp.com/c/terraform-core)
- [r/Terraform](https://www.reddit.com/r/Terraform/)
- [r/aws](https://www.reddit.com/r/aws/)

---

## 💰 Tips de Gestión de Costos

### Reglas de Oro
1. **SIEMPRE configura billing alerts antes de comenzar**
2. **Ejecuta `cdk destroy` o `terraform destroy` después de practicar**
3. **Revisa AWS Cost Explorer semanalmente**
4. **Usa tags para tracking: Environment, ManagedBy, Project**
5. **Aprovecha el Free Tier al máximo**
6. **Evita recursos caros: NAT Gateway ($0.045/hora), Elastic IPs no usadas**

### Script de Cleanup Diario
```bash
#!/bin/bash
# cleanup.sh - Ejecutar al final del día de práctica

# CDK
cd my-cdk-projects/
for dir in */; do
  cd "$dir"
  cdk destroy --force
  cd ..
done

# Terraform
cd my-terraform-projects/
for dir in */; do
  cd "$dir"
  terraform destroy -auto-approve
  cd ..
done

# Verificar recursos huérfanos
aws ec2 describe-instances --filters "Name=tag:Environment,Values=dev" --query "Reservations[].Instances[].InstanceId"
aws s3 ls | grep -i "test\|dev\|tmp"
```

---

**¡Estás listo para comenzar tu viaje en Infraestructura como Código!** 🚀

**Tu meta inmediata**: Desplegar tu primera infraestructura con un solo comando en las próximas 2 horas.

**Siguientes 30 días**: Ser capaz de desplegar una arquitectura serverless completa (API Gateway + Lambda + DynamoDB) con `cdk deploy` o `terraform apply`, sin ningún paso manual en la consola AWS.

¡Manos a la obra! 💪
