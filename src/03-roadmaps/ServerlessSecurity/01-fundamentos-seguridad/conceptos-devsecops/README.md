# Conceptos de DevSecOps

## ¿Qué es DevSecOps?

DevSecOps es la práctica de integrar seguridad en cada fase del ciclo de vida de desarrollo de software (SDLC). Es la evolución de DevOps que hace que la seguridad sea responsabilidad compartida de todos los equipos.

### Principios Fundamentales

1. **Shift Left Security**
   - Integrar seguridad desde el inicio del desarrollo
   - Detectar vulnerabilidades temprano cuando son más baratas de corregir
   - Automatizar testing de seguridad en desarrollo local

2. **Security as Code**
   - Codificar políticas y controles de seguridad
   - Versionarlos junto con el código de aplicación
   - Revisar cambios de seguridad en pull requests

3. **Continuous Security**
   - Seguridad continua en todo el pipeline CI/CD
   - Monitoreo y detección en tiempo real
   - Respuesta automatizada a incidentes

4. **Shared Responsibility**
   - Desarrolladores escriben código seguro
   - Security team define políticas y herramientas
   - Operations mantiene infraestructura segura

## Modelo de Responsabilidad Compartida en AWS

### AWS Responsable de:
- Seguridad **DE** la nube
- Infraestructura física
- Hypervisor y red
- Servicios administrados

### Cliente Responsable de:
- Seguridad **EN** la nube
- Configuración de servicios
- Gestión de identidad y acceso (IAM)
- Encriptación de datos
- Código de aplicación
- Configuración de red

### En Serverless Específicamente:

**AWS Gestiona:**
- Infraestructura de Lambda
- Runtime patching
- Escalamiento automático
- Disponibilidad

**Tú Gestionas:**
- Código de la función
- IAM permissions
- Variables de entorno
- Dependencias
- API Gateway configuration
- Data encryption
- Logging y monitoring

## Security Principles para Serverless

### 1. Least Privilege
```typescript
// ❌ MAL: Permisos amplios
{
  "Effect": "Allow",
  "Action": "dynamodb:*",
  "Resource": "*"
}

// ✅ BIEN: Permisos específicos
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:GetItem",
    "dynamodb:PutItem"
  ],
  "Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/MyTable"
}
```

### 2. Defense in Depth
- Múltiples capas de seguridad
- WAF en API Gateway
- Lambda authorizer
- Input validation en código
- Encryption at rest y in transit
- Network isolation (VPC)

### 3. Zero Trust
- Nunca confiar, siempre verificar
- Autenticar cada request
- Validar permisos granulares
- Auditar todos los accesos

### 4. Fail Securely
```typescript
// ✅ BIEN: Denegar por defecto
try {
  const user = await authorize(token);
  return processRequest(user);
} catch (error) {
  // Si algo falla, denegar acceso
  return { statusCode: 403, body: 'Access denied' };
}
```

### 5. Separation of Concerns
- Lambdas pequeñas y enfocadas
- Una responsabilidad por función
- Facilita auditoría y testing

## DevSecOps Pipeline

### 1. Pre-commit
- git-secrets (detectar secrets)
- ESLint security rules
- Pre-commit hooks

### 2. Build
- SAST (SonarQube, Semgrep)
- Dependency scanning (Snyk, npm audit)
- IaC scanning (Checkov)

### 3. Test
- Unit tests de seguridad
- Integration tests
- Security test cases

### 4. Deploy
- DAST (OWASP ZAP)
- Penetration testing
- Compliance validation

### 5. Runtime
- GuardDuty (threat detection)
- CloudWatch monitoring
- Automated incident response

### 6. Feedback
- Security metrics
- Vulnerability remediation
- Continuous improvement

## Herramientas Clave

### SAST (Static Application Security Testing)
- **SonarQube**: Análisis de calidad y seguridad
- **Semgrep**: Pattern matching para vulnerabilidades
- **CodeQL**: Query language para code analysis

### DAST (Dynamic Application Security Testing)
- **OWASP ZAP**: Penetration testing automatizado
- **Burp Suite**: Manual + automated scanning

### SCA (Software Composition Analysis)
- **Snyk**: Vulnerabilidades en dependencias
- **npm audit**: Built-in NPM scanning
- **Dependabot**: Automated dependency updates

### IaC Security
- **Checkov**: CloudFormation, SAM, Terraform
- **tfsec**: Terraform-specific
- **Prowler**: AWS security assessment

### Secrets Management
- **git-secrets**: Pre-commit hook
- **TruffleHog**: Deep secret scanning
- **GitGuardian**: Continuous monitoring

## Métricas de Seguridad

### Vulnerabilidades
- Críticas: 0 toleradas
- Altas: < 5 en producción
- Medias: Tracked y priorizadas
- Bajas: Backlog

### Time to Remediate
- Críticas: < 24 horas
- Altas: < 7 días
- Medias: < 30 días

### Coverage
- SAST coverage: 100% del código
- Unit test security: > 80%
- Dependency scanning: 100%

### Compliance
- Failed security checks: 0
- Security policy violations: 0

## Recursos de Aprendizaje

### Estándares y Frameworks
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/)

### AWS Security
- [AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)
- [AWS Well-Architected - Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/)

### Comunidades
- [OWASP Community](https://owasp.org/)
- [AWS Security Community](https://community.aws/security)
- [r/netsec](https://www.reddit.com/r/netsec/)

## Próximos Pasos

1. Familiarízate con OWASP Serverless Top 10
2. Configura herramientas de seguridad locales
3. Implementa pre-commit hooks
4. Practica con ejemplos de código vulnerable
5. Aprende a ejecutar security scans

Continúa con los ejemplos prácticos en las otras carpetas del roadmap.
