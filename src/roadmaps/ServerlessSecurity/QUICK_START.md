# 🔐 Quick Start Guide - Seguridad Serverless (DevSecOps)

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener configurado:

### 1. Entorno AWS Básico
```bash
# Verificar AWS CLI
aws --version

# Verificar credenciales
aws sts get-caller-identity

# Node.js 20+
node --version
npm --version
```

### 2. Instalar Herramientas de Seguridad

#### SAST Tools
```bash
# SonarQube Scanner (opcional para local)
npm install -g sonarqube-scanner

# ESLint con plugins de seguridad
npm install -g eslint
npm install --save-dev eslint-plugin-security
```

#### DAST Tools
```bash
# OWASP ZAP (descarga e instala desde https://www.zaproxy.org/)
# Verificar instalación (si usas CLI)
zap.sh --version
```

#### Dependency Scanning
```bash
# Snyk CLI
npm install -g snyk
snyk auth

# Verificar
snyk test --help
```

#### IaC Security
```bash
# Checkov (Python required)
pip3 install checkov

# Verificar
checkov --version
```

#### Secrets Scanning
```bash
# git-secrets
# macOS
brew install git-secrets

# Linux
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets
make install

# Verificar
git secrets --version

# TruffleHog
pip3 install truffleHog

# Verificar
trufflehog --version
```

### 3. AWS Security Services

#### Habilitar GuardDuty
```bash
# Habilitar GuardDuty en tu región
aws guardduty create-detector --enable

# Verificar
aws guardduty list-detectors
```

#### Habilitar Security Hub
```bash
# Habilitar Security Hub
aws securityhub enable-security-hub

# Habilitar CIS AWS Foundations Benchmark
aws securityhub batch-enable-standards \
  --standards-subscription-requests StandardsArn="arn:aws:securityhub:::ruleset/cis-aws-foundations-benchmark/v/1.2.0"

# Verificar
aws securityhub get-enabled-standards
```

#### CloudTrail (si no está habilitado)
```bash
# Verificar si CloudTrail está activo
aws cloudtrail describe-trails

# Crear trail si no existe
aws cloudtrail create-trail \
  --name security-audit-trail \
  --s3-bucket-name my-security-logs-bucket

# Iniciar logging
aws cloudtrail start-logging --name security-audit-trail
```

## 🎯 Primera Auditoría de Seguridad

### Paso 1: Clonar/Navegar al Proyecto
```bash
cd src/roadmaps/ServerlessSecurity

# Instalar dependencias
npm install
```

### Paso 2: Escanear Dependencias
```bash
# npm audit
npm audit

# Generar reporte detallado
npm audit --json > audit-report.json

# Snyk scan
snyk test

# Fix vulnerabilities automáticamente
npm audit fix
snyk wizard  # Interactivo para fixes
```

### Paso 3: Escanear Código Fuente (SAST)
```bash
# ESLint con plugin de seguridad
npx eslint --ext .ts,.js . --format html -o eslint-report.html

# Semgrep (open source SAST)
npx semgrep --config=auto .
```

### Paso 4: Escanear Infraestructura (IaC)
```bash
# Checkov para SAM templates
checkov -d . -o json > checkov-report.json

# Ver resultados
checkov -d .
```

### Paso 5: Escanear Secrets
```bash
# Inicializar git-secrets en el repo
git secrets --install
git secrets --register-aws

# Escanear archivos
git secrets --scan

# TruffleHog para escaneo profundo
trufflehog --regex --entropy=True .
```

## 🔍 Tu Primer Security Test

### Paso 1: Crear Lambda Vulnerable

```typescript
// 01-fundamentos-seguridad/owasp-serverless/vulnerable-lambda.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// ⚠️ VULNERABLE: SQL Injection-like vulnerability en DynamoDB
export const vulnerableHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // ❌ INSEGURO: Input no validado
  const userId = event.queryStringParameters?.userId;

  // ❌ INSEGURO: Uso directo de input en query
  const params = {
    TableName: 'Users',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId, // Sin validación!
    },
  };

  const result = await docClient.send(new QueryCommand(params));

  // ❌ INSEGURO: Exponer datos sensibles en logs
  console.log('Query result:', result);

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
};
```

### Paso 2: Crear Lambda Segura

```typescript
// 01-fundamentos-seguridad/owasp-serverless/secure-lambda.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// ✅ SEGURO: Schema validation
const UserIdSchema = z.string().uuid();

// ✅ SEGURO: Structured logging sin datos sensibles
function logSecure(level: string, message: string, metadata?: any) {
  console.log(
    JSON.stringify({
      level,
      message,
      timestamp: new Date().toISOString(),
      // Filtrar datos sensibles
      metadata: sanitizeForLogging(metadata),
    }),
  );
}

function sanitizeForLogging(data: any) {
  // Remover campos sensibles
  if (!data) return data;
  const sanitized = { ...data };
  delete sanitized.password;
  delete sanitized.ssn;
  delete sanitized.creditCard;
  return sanitized;
}

export const secureHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    // ✅ SEGURO: Validar input
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'userId is required' }),
      };
    }

    // ✅ SEGURO: Validar formato
    const validationResult = UserIdSchema.safeParse(userId);
    if (!validationResult.success) {
      logSecure('WARN', 'Invalid userId format', {
        errors: validationResult.error.errors,
      });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid userId format (must be UUID)' }),
      };
    }

    // ✅ SEGURO: Usar validated input
    const params = {
      TableName: process.env.USERS_TABLE || 'Users',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': validationResult.data,
      },
    };

    const result = await docClient.send(new QueryCommand(params));

    // ✅ SEGURO: Log sin datos sensibles
    logSecure('INFO', 'Query successful', { count: result.Count });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      },
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    // ✅ SEGURO: Error handling sin exponer detalles internos
    logSecure('ERROR', 'Query failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        // NO exponer stack trace en producción
      }),
    };
  }
};
```

### Paso 3: Comparar y Aprender

Ejecuta las auditorías:

```bash
# SAST scan
npx eslint vulnerable-lambda.ts secure-lambda.ts

# Snyk
snyk code test vulnerable-lambda.ts
snyk code test secure-lambda.ts

# Semgrep
npx semgrep --config=p/owasp-top-ten vulnerable-lambda.ts
```

## 🛡️ Configurar Pre-commit Hooks

### Paso 1: Instalar Husky
```bash
npm install --save-dev husky
npx husky install

# Agregar a package.json
npm set-script prepare "husky install"
```

### Paso 2: Crear Pre-commit Hook
```bash
npx husky add .husky/pre-commit "npm run security-check"
```

### Paso 3: Agregar Scripts de Seguridad
```json
// package.json
{
  "scripts": {
    "security-check": "npm run lint && npm run audit:deps && npm run scan:secrets",
    "lint": "eslint --ext .ts,.js .",
    "audit:deps": "npm audit --audit-level=moderate",
    "scan:secrets": "git secrets --scan",
    "scan:iac": "checkov -d .",
    "test:security": "jest --testMatch='**/*.security.test.ts'"
  }
}
```

## 🔥 Primera Penetration Test

### Paso 1: Desplegar API Vulnerable
```bash
# Deploy con SAM
sam build
sam deploy --guided
```

### Paso 2: Ejecutar OWASP ZAP

#### Opción A: ZAP GUI
1. Abrir OWASP ZAP
2. Automated Scan → Enter API URL
3. Attack → Start
4. Revisar alerts

#### Opción B: ZAP CLI
```bash
# Quick scan
zap-cli quick-scan https://your-api-url.com

# Full scan
zap-cli active-scan https://your-api-url.com

# Generar reporte
zap-cli report -o zap-report.html -f html
```

### Paso 3: Analizar Resultados

```bash
# Ver vulnerabilidades encontradas
cat zap-report.html | grep -A 5 "High Risk"

# Priorizar fixes
# 1. High Risk - Fix inmediatamente
# 2. Medium Risk - Fix en próximo sprint
# 3. Low Risk - Backlog
```

## 📊 Security Dashboard Local

### Paso 1: Agregar Scripts de Reporte
```typescript
// scripts/security-report.ts
import * as fs from 'fs';

interface SecurityReport {
  timestamp: string;
  findings: {
    dependencies: any;
    sast: any;
    secrets: any;
    iac: any;
  };
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

async function generateSecurityReport(): Promise<SecurityReport> {
  // Leer reportes generados
  const npmAudit = JSON.parse(fs.readFileSync('audit-report.json', 'utf-8'));
  const checkovReport = JSON.parse(fs.readFileSync('checkov-report.json', 'utf-8'));

  // Agregar más fuentes...

  const report: SecurityReport = {
    timestamp: new Date().toISOString(),
    findings: {
      dependencies: npmAudit,
      sast: {},
      secrets: {},
      iac: checkovReport,
    },
    summary: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
  };

  // Calcular summary...

  fs.writeFileSync('security-report.json', JSON.stringify(report, null, 2));
  console.log('Security report generated: security-report.json');

  return report;
}

generateSecurityReport();
```

### Paso 2: Ejecutar Reporte
```bash
# Generar reporte completo
npm run security:report

# Ver resumen
cat security-report.json | jq '.summary'
```

## 🚀 Próximos Pasos

### Día 1-3: Setup Inicial
- [ ] Todas las herramientas instaladas
- [ ] GuardDuty y Security Hub habilitados
- [ ] Pre-commit hooks configurados
- [ ] Primera auditoría completada

### Semana 1: Fundamentos
- [ ] Leer OWASP Serverless Top 10
- [ ] Completar vulnerable vs secure examples
- [ ] Ejecutar primera penetration test
- [ ] Documentar findings

### Semana 2: SAST/DAST
- [ ] Integrar SonarQube (o SonarCloud)
- [ ] Configurar OWASP ZAP automation
- [ ] Setup Snyk en CI/CD
- [ ] Fix vulnerabilidades críticas

### Semana 3-4: IAM y Secrets
- [ ] Audit IAM permissions
- [ ] Migrar secrets a Secrets Manager
- [ ] Implementar secret rotation
- [ ] Configurar least privilege policies

## 📖 Recursos Adicionales

### Cheat Sheets
- [OWASP Serverless Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Serverless_Security_Cheat_Sheet.html)
- [AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)
- [Lambda Security Checklist](https://github.com/aws-samples/aws-lambda-security-best-practices)

### Práctica
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)
- [DVWA (Damn Vulnerable Web App)](https://github.com/digininja/DVWA)
- [AWS Well-Architected Labs - Security](https://www.wellarchitectedlabs.com/security/)

### Comunidades
- [OWASP Slack](https://owasp.org/slack/invite)
- [AWS Security Community](https://community.aws/security)
- [r/netsec on Reddit](https://www.reddit.com/r/netsec/)

## ✅ Checklist de Quick Start

- [ ] AWS CLI configurado
- [ ] Node.js 20+ instalado
- [ ] Snyk instalado y autenticado
- [ ] Checkov instalado
- [ ] git-secrets configurado
- [ ] GuardDuty habilitado
- [ ] Security Hub habilitado
- [ ] CloudTrail activo
- [ ] Pre-commit hooks configurados
- [ ] Primera auditoría ejecutada
- [ ] Vulnerable vs Secure examples revisados
- [ ] OWASP ZAP scan ejecutado
- [ ] Security report generado

---

**¡Estás listo para comenzar tu viaje en Seguridad Serverless!** 🔐

Continúa con el [README principal](./README.md) para profundizar en cada nivel.

**Recuerda**: Siempre obtén autorización antes de realizar security testing, incluso en tus propios sistemas AWS.

**Pro tip**: Configura billing alerts antes de habilitar servicios de seguridad pagos como GuardDuty y Security Hub para evitar sorpresas en costos.
