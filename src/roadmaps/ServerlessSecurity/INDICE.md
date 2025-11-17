# 📑 Índice Completo - Seguridad Serverless (DevSecOps)

## 🎯 Inicio Rápido
- [README Principal](./README.md) - Roadmap completo de aprendizaje
- [Quick Start Guide](./QUICK_START.md) - Guía de inicio rápido

## 📚 Contenido por Nivel

### Nivel 1: Fundamentos de Seguridad Serverless
**Ubicación:** `01-fundamentos-seguridad/`

#### Conceptos de DevSecOps
- `conceptos-devsecops/README.md` - ¿Qué es DevSecOps? Principios y prácticas
- `conceptos-devsecops/01-shared-responsibility.ts` - Modelo de responsabilidad compartida
- `conceptos-devsecops/02-security-principles.ts` - Least privilege, defense in depth

#### Threat Modeling
- `threat-modeling/README.md` - STRIDE, OWASP Serverless Top 10
- `threat-modeling/01-owasp-top10-examples.ts` - Ejemplos de vulnerabilidades
- `threat-modeling/02-attack-surface-analysis.ts` - Análisis de superficie de ataque
- `threat-modeling/03-stride-threat-model.ts` - Aplicar STRIDE

#### OWASP Serverless
- `owasp-serverless/01-injection-vulnerabilities.ts` - SQL, NoSQL, Command injection
- `owasp-serverless/02-broken-auth.ts` - Authentication vulnerabilities
- `owasp-serverless/03-sensitive-data-exposure.ts` - Data leakage patterns
- `owasp-serverless/04-security-misconfiguration.ts` - Common misconfigurations

---

### Nivel 2: Seguridad de AWS Lambda
**Ubicación:** `02-seguridad-lambda/`

#### Injection Prevention
- `injection-prevention/01-sql-nosql-injection.ts` - Parametrized queries
  - DynamoDB safe queries
  - Input validation
  - Expression attribute values
  - Secure ORM patterns

- `injection-prevention/02-command-injection.ts` - Shell command security
  - Input sanitization
  - Whitelist approach
  - Subprocess security

- `injection-prevention/03-input-validation.ts` - Comprehensive validation
  - Schema validation (Zod, Joi)
  - Type guards
  - Rate limiting
  - Content-type validation

#### Secrets Management
- `secrets-management/01-secrets-manager.ts` - AWS Secrets Manager
  - Create and rotate secrets
  - Automatic rotation functions
  - Cross-region replication
  - Version management

- `secrets-management/02-parameter-store.ts` - Systems Manager Parameter Store
  - SecureString parameters
  - Hierarchical organization
  - Parameter policies
  - Cost optimization

- `secrets-management/03-env-vars-security.ts` - Environment variables
  - Encryption at rest
  - Rotation strategies
  - Audit logging

- `secrets-management/04-secret-scanning.ts` - Pre-commit hooks
  - git-secrets setup
  - TruffleHog integration
  - GitGuardian configuration

#### IAM Permissions
- `iam-permissions/01-least-privilege.ts` - Execution roles
  - Minimal IAM policies
  - Resource-based policies
  - Condition keys
  - Permission boundaries

- `iam-permissions/02-cross-account-access.ts` - AssumeRole security
  - External ID
  - Session policies
  - Temporary credentials

- `iam-permissions/03-iam-access-analyzer.ts` - Permission auditing
  - Identify external access
  - Policy validation
  - Findings remediation

---

### Nivel 3: Seguridad de API Gateway
**Ubicación:** `03-seguridad-api-gateway/`

#### Authentication
- `authentication/01-cognito-auth.ts` - Cognito User Pools
  - JWT validation
  - MFA implementation
  - Password policies
  - Account takeover protection

- `authentication/02-lambda-authorizer.ts` - Custom authorizers
  - Token-based authorization
  - Request-based authorization
  - Caching strategies
  - Performance optimization

- `authentication/03-oauth-oidc.ts` - OAuth 2.0 / OpenID Connect
  - Authorization Code flow
  - Client Credentials flow
  - Scope management

#### Authorization
- `authorization/01-rbac.ts` - Role-Based Access Control
  - Cognito groups
  - Custom JWT claims
  - Multi-tenant RBAC

- `authorization/02-abac.ts` - Attribute-Based Access Control
  - Fine-grained permissions
  - Dynamic authorization
  - Context-based access

- `authorization/03-policy-enforcement.ts` - Policy as code
  - OPA integration
  - Cedar policies
  - Policy testing

#### Rate Limiting
- `rate-limiting/01-api-gateway-throttling.ts` - Throttling configuration
  - Account/Stage/Method limits
  - Burst limits
  - Usage plans

- `rate-limiting/02-ddos-protection.ts` - DDoS mitigation
  - AWS Shield
  - CloudFront integration
  - WAF rate-based rules

- `rate-limiting/03-custom-rate-limiter.ts` - Application-level rate limiting
  - Redis-based limiter
  - DynamoDB counter
  - Token bucket algorithm

---

### Nivel 4: Seguridad de Datos
**Ubicación:** `04-seguridad-datos/`

#### Encryption
- `encryption/01-kms-encryption.ts` - AWS KMS
  - Customer managed keys
  - Key rotation
  - Key policies
  - Envelope encryption

- `encryption/02-encryption-at-rest.ts` - Data at rest
  - DynamoDB encryption
  - S3 encryption (SSE-S3, SSE-KMS)
  - Lambda env vars encryption

- `encryption/03-encryption-in-transit.ts` - Data in transit
  - TLS enforcement
  - Certificate management (ACM)
  - VPC endpoints

- `encryption/04-client-side-encryption.ts` - Application encryption
  - Field-level encryption
  - Client-side libraries

#### Data Validation
- `data-validation/01-schema-validation.ts` - JSON Schema validation
  - Zod schemas
  - OpenAPI spec validation
  - Multi-layer validation

- `data-validation/02-sanitization.ts` - Data sanitization
  - HTML sanitization
  - SQL escaping
  - Path traversal prevention

- `data-validation/03-business-validation.ts` - Business logic
  - Constraint enforcement
  - Range checks
  - Cross-field validation

#### Secure Storage
- `secure-storage/01-dynamodb-security.ts` - DynamoDB security
  - Fine-grained access control
  - PITR and backups
  - VPC endpoints
  - Multi-tenant isolation

- `secure-storage/02-s3-security.ts` - S3 security
  - Bucket policies
  - Block public access
  - Versioning
  - Object Lock
  - Access logging

- `secure-storage/03-data-retention.ts` - Retention policies
  - Lifecycle policies
  - Secure deletion
  - GDPR compliance

---

### Nivel 5: Monitoring, Logging y Compliance
**Ubicación:** `05-monitoring-compliance/`

#### CloudTrail Logs
- `cloudtrail-logs/01-cloudtrail-setup.ts` - CloudTrail configuration
  - Multi-region trails
  - Log file validation
  - Event history analysis

- `cloudtrail-logs/02-log-analysis.ts` - Security event detection
  - CloudWatch Insights queries
  - Anomaly detection
  - Automated alerting

- `cloudtrail-logs/03-audit-trails.ts` - Compliance logging
  - Immutable logs
  - Log aggregation
  - Retention policies

#### Security Scanning
- `security-scanning/01-guardduty.ts` - Amazon GuardDuty
  - Threat detection
  - Findings analysis
  - Automated remediation

- `security-scanning/02-security-hub.ts` - AWS Security Hub
  - Centralized dashboard
  - CIS benchmarks
  - Automated compliance checks

- `security-scanning/03-config-rules.ts` - AWS Config
  - Compliance monitoring
  - Configuration tracking
  - Custom rules

- `security-scanning/04-vulnerability-scanning.ts` - Dependency scanning
  - npm audit automation
  - Snyk integration
  - Container scanning (Trivy)

#### Incident Response
- `incident-response/01-detection.ts` - Threat detection
  - Real-time monitoring
  - Alert triggers
  - Escalation policies

- `incident-response/02-containment.ts` - Automated containment
  - Lambda quarantine
  - Network isolation
  - IAM policy revocation

- `incident-response/03-forensics.ts` - Forensic analysis
  - Log preservation
  - Memory dumps
  - Chain of custody

- `incident-response/04-runbooks.md` - Response runbooks
  - Incident procedures
  - Communication templates
  - Post-mortem analysis

---

### Nivel 6: DevSecOps Avanzado
**Ubicación:** `06-devsecops-avanzado/`

#### SAST/DAST
- `sast-dast/01-sonarqube-integration.ts` - Static analysis
  - SonarQube setup
  - Custom rules
  - Quality gates

- `sast-dast/02-owasp-zap.ts` - Dynamic analysis
  - ZAP automation
  - API scanning
  - CI/CD integration

- `sast-dast/03-dependency-scanning.ts` - SCA
  - Snyk automation
  - Dependabot configuration
  - License compliance

- `sast-dast/04-iac-scanning.ts` - Infrastructure scanning
  - Checkov policies
  - SAM/CDK security
  - Terraform scanning

#### Security Pipeline
- `security-pipeline/01-security-gates.ts` - CI/CD gates
  - Pre-commit hooks
  - Build-time scanning
  - Deploy-time checks

- `security-pipeline/02-automated-testing.ts` - Security tests
  - Unit test security scenarios
  - Integration tests
  - Penetration testing automation

- `security-pipeline/03-deployment-strategies.ts` - Safe deployments
  - Blue/Green with security validation
  - Canary with monitoring
  - Automated rollback

- `security-pipeline/github-actions-security.yml` - GitHub Actions
  - Complete security pipeline
  - SAST/DAST/SCA integration
  - Automated remediation

#### Compliance Automation
- `compliance-automation/01-policy-as-code.ts` - OPA policies
  - Rego policy language
  - Policy testing
  - Policy enforcement

- `compliance-automation/02-compliance-as-code.ts` - Automated compliance
  - InSpec profiles
  - Custom compliance checks
  - Continuous validation

- `compliance-automation/03-auto-remediation.ts` - Self-healing
  - Security Hub actions
  - Lambda remediation
  - Step Functions workflows

- `compliance-automation/04-compliance-reporting.ts` - Reporting
  - Evidence collection
  - Compliance dashboards
  - Audit reports

---

## 🛠️ Archivos de Configuración

- `package.json.example` - Dependencias de seguridad
- `tsconfig.json.example` - TypeScript strict configuration
- `.gitignore` - Sensitive files exclusion
- `.pre-commit-config.yaml` - Pre-commit hooks
- `sonar-project.properties` - SonarQube configuration
- `checkov.yaml` - Checkov IaC scanning config

---

## 📊 Progreso Recomendado

### Semanas 1-3: Fundamentos
✅ OWASP Serverless Top 10 dominado
✅ Threat modeling básico
✅ Security tools configurados

### Semanas 4-7: Lambda Security
✅ Injection prevention implementado
✅ Secrets management automatizado
✅ IAM least privilege aplicado

### Semanas 8-11: API Security
✅ Authentication multi-factor
✅ Authorization con RBAC/ABAC
✅ Rate limiting y DDoS protection

### Semanas 12-15: Data Security
✅ Encryption at rest y in transit
✅ KMS key management
✅ Secure storage patterns

### Semanas 16-20: Monitoring
✅ CloudTrail y GuardDuty
✅ Security Hub configurado
✅ Incident response automation

### Semanas 21-30: DevSecOps
✅ SAST/DAST en pipeline
✅ Security automation completa
✅ Compliance as code
✅ Proyecto final seguro

---

## 🎯 Proyecto Final: Secure E-Commerce

**Ubicación:** `proyecto-final/`

Implementa:
- ✅ MFA authentication (Cognito)
- ✅ API Gateway con WAF
- ✅ Lambda con security hardening
- ✅ Encrypted DynamoDB
- ✅ Secure S3 uploads
- ✅ Secrets rotation automation
- ✅ GuardDuty + Security Hub
- ✅ Compliance reporting (PCI-DSS)
- ✅ CI/CD con security gates
- ✅ Incident response automation
- ✅ Security metrics dashboard

---

## 📖 Recursos Adicionales

### Checklists
- `checklists/lambda-security-checklist.md`
- `checklists/api-gateway-security-checklist.md`
- `checklists/pre-deployment-security.md`
- `checklists/incident-response-checklist.md`

### Scripts de Automatización
- `scripts/security-audit.sh` - Prowler automation
- `scripts/dependency-scan.sh` - npm audit + Snyk
- `scripts/iac-scan.sh` - Checkov scanning
- `scripts/rotate-secrets.ts` - Secret rotation

### Templates
- `templates/security-hub-custom-actions/` - Custom actions
- `templates/config-rules/` - Custom Config rules
- `templates/waf-rules/` - WAF rule templates
- `templates/iam-policies/` - Secure IAM policies

---

## 📝 Próximos Pasos

1. Empieza con [QUICK_START.md](./QUICK_START.md)
2. Sigue el [README principal](./README.md) nivel por nivel
3. Completa security challenges
4. Construye proyectos incrementales
5. Documenta vulnerabilidades encontradas
6. Contribuye a la comunidad

---

**¡Buena suerte en tu aprendizaje de Seguridad Serverless!** 🔐

*Recuerda: La seguridad es un viaje, no un destino. Mantente siempre actualizado con las últimas amenazas y mejores prácticas.*
