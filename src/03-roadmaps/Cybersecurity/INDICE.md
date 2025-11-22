# 📑 Índice de Ejercicios de Ciberseguridad

## Navegación Rápida por Nivel

- [Nivel 1: Fundamentos de Seguridad](#nivel-1-fundamentos-de-seguridad)
- [Nivel 2: Seguridad Web](#nivel-2-seguridad-web)
- [Nivel 3: Seguridad de Redes](#nivel-3-seguridad-de-redes)
- [Nivel 4: Criptografía y Autenticación Avanzada](#nivel-4-criptografía-y-autenticación-avanzada)
- [Nivel 5: Pentesting y Defensa](#nivel-5-pentesting-y-defensa)
- [Nivel 6: Seguridad en Producción](#nivel-6-seguridad-en-producción)

---

## Nivel 1: Fundamentos de Seguridad

### 📂 Conceptos Básicos
`01-fundamentos-seguridad/conceptos-basicos/`

**Archivos:**
- `01-cia-triad.ts` - CIA Triad: Confidencialidad, Integridad, Disponibilidad
- `02-least-privilege.ts` - Principio de mínimo privilegio
- `03-defense-in-depth.ts` - Defensa en profundidad (capas de seguridad)
- `04-auth-vs-authz.ts` - Autenticación vs Autorización
- `05-threat-types.ts` - Tipos de amenazas (Malware, Phishing, DoS, MitM)

**Conceptos clave:**
- Principios fundamentales de seguridad
- Diferencia entre autenticación y autorización
- Estrategias de defensa en capas

---

### 📂 Threat Modeling
`01-fundamentos-seguridad/threat-modeling/`

**Archivos:**
- `01-stride.ts` - STRIDE methodology (Spoofing, Tampering, Repudiation, etc.)
- `02-dread.ts` - DREAD Risk Assessment
- `03-attack-trees.ts` - Attack Trees para análisis de ataques
- `04-attack-surface.ts` - Análisis de superficie de ataque

**Conceptos clave:**
- Modelado de amenazas con STRIDE
- Evaluación de riesgos con DREAD
- Construcción de Attack Trees
- Identificación de vectores de ataque

---

### 📂 Criptografía Fundamentos
`01-fundamentos-seguridad/crypto-fundamentos/`

**Archivos:**
- `01-symmetric-encryption.ts` - Cifrado simétrico (AES, XOR)
- `02-asymmetric-encryption.ts` - Cifrado asimétrico (RSA conceptual)
- `03-hashing.ts` - Funciones hash (SHA-256, MD5)
- `04-hmac.ts` - HMAC para autenticación de mensajes
- `05-digital-signature.ts` - Firma digital básica

**Conceptos clave:**
- Diferencia entre cifrado simétrico y asimétrico
- Propiedades de funciones hash
- HMAC para integridad
- Firma digital para no-repudio

---

## Nivel 2: Seguridad Web

### 📂 OWASP Top 10
`02-seguridad-web/owasp-top10/`

**Archivos:**
- `01-broken-access-control.ts` - A01: Control de acceso roto
- `02-cryptographic-failures.ts` - A02: Fallos criptográficos
- `03-injection.ts` - A03: Inyección (SQL, Command)
- `04-insecure-design.ts` - A04: Diseño inseguro
- `05-security-misconfiguration.ts` - A05: Configuración incorrecta
- `06-vulnerable-components.ts` - A06: Componentes vulnerables
- `07-auth-failures.ts` - A07: Fallos de autenticación
- `08-integrity-failures.ts` - A08: Fallos de integridad
- `09-logging-monitoring.ts` - A09: Falta de logging
- `10-ssrf.ts` - A10: SSRF (Server-Side Request Forgery)

**Conceptos clave:**
- OWASP Top 10 2021
- Vulnerabilidades web más comunes
- Mitigaciones para cada categoría

---

### 📂 XSS, CSRF y SQL Injection
`02-seguridad-web/xss-csrf-sqli/`

**Archivos:**
- `01-xss-reflected.ts` - XSS Reflected
- `02-xss-stored.ts` - XSS Stored
- `03-xss-dom.ts` - XSS DOM-based
- `04-xss-prevention.ts` - Prevención de XSS (sanitización, CSP)
- `05-csrf-vulnerable.ts` - CSRF vulnerable
- `06-csrf-protection.ts` - CSRF tokens, SameSite cookies
- `07-sqli-basic.ts` - SQL Injection básico
- `08-sqli-blind.ts` - Blind SQL Injection
- `09-sqli-prevention.ts` - Prepared statements, ORMs

**Conceptos clave:**
- Tipos de XSS y mitigaciones
- CSRF tokens y SameSite attribute
- SQL Injection y prepared statements
- Content Security Policy (CSP)

---

### 📂 Ataques a Autenticación
`02-seguridad-web/authentication-attacks/`

**Archivos:**
- `01-brute-force.ts` - Brute force attacks
- `02-credential-stuffing.ts` - Credential stuffing
- `03-session-hijacking.ts` - Session hijacking
- `04-cookie-theft.ts` - Cookie theft
- `05-rate-limiting.ts` - Rate limiting y throttling
- `06-mfa.ts` - Multi-Factor Authentication (MFA)
- `07-password-policies.ts` - Password strength y políticas

**Conceptos clave:**
- Ataques comunes a autenticación
- Rate limiting para prevenir brute force
- MFA para defensa en profundidad
- Password hashing con bcrypt/Argon2

---

## Nivel 3: Seguridad de Redes

### 📂 Protocolos Seguros
`03-seguridad-redes/protocolos-seguros/`

**Archivos:**
- `01-tls-handshake.ts` - TLS/SSL handshake simulation
- `02-https-implementation.ts` - HTTPS vs HTTP
- `03-ssh-authentication.ts` - SSH y autenticación por clave pública
- `04-ipsec.ts` - IPSec conceptual
- `05-dnssec.ts` - DNSSEC y DNS poisoning
- `06-ssl-attacks.ts` - SSL stripping, Downgrade attacks

**Conceptos clave:**
- TLS handshake y cifrado
- SSH key-based authentication
- IPSec para VPNs
- Ataques a SSL/TLS

---

### 📂 Firewall, IDS, IPS
`03-seguridad-redes/firewall-ids-ips/`

**Archivos:**
- `01-firewall-rules.ts` - Packet filtering rules
- `02-stateful-firewall.ts` - Stateful vs Stateless
- `03-ids-signature.ts` - IDS signature-based
- `04-ids-anomaly.ts` - IDS anomaly-based
- `05-ips.ts` - Intrusion Prevention System
- `06-log-analysis.ts` - Log analysis y pattern recognition

**Conceptos clave:**
- Firewalls stateful vs stateless
- IDS vs IPS
- Signature-based vs Anomaly-based detection
- Log correlation

---

### 📂 VPN y Tunneling
`03-seguridad-redes/vpn-tunneling/`

**Archivos:**
- `01-vpn-types.ts` - Site-to-Site vs Remote Access VPN
- `02-openvpn.ts` - OpenVPN conceptual
- `03-wireguard.ts` - WireGuard conceptual
- `04-split-tunneling.ts` - Split tunneling
- `05-vpn-kill-switch.ts` - Kill switch implementation
- `06-tor-anonymity.ts` - Tor y anonimato

**Conceptos clave:**
- VPN types y use cases
- Tunneling protocols
- Anonymity networks (Tor)

---

## Nivel 4: Criptografía y Autenticación Avanzada

### 📂 PKI y Certificados
`04-criptografia-autenticacion/pki-certificados/`

**Archivos:**
- `01-x509-certificates.ts` - X.509 certificate structure
- `02-ca-chain.ts` - Certificate Authority chain of trust
- `03-cert-signing.ts` - Certificate signing
- `04-crl.ts` - Certificate Revocation Lists
- `05-ocsp.ts` - OCSP (Online Certificate Status Protocol)

**Conceptos clave:**
- PKI architecture
- X.509 certificates
- Chain of trust
- Certificate revocation

---

### 📂 OAuth, JWT, SAML
`04-criptografia-autenticacion/oauth-jwt-saml/`

**Archivos:**
- `01-oauth-authorization-code.ts` - OAuth 2.0 Authorization Code flow
- `02-oauth-pkce.ts` - PKCE for mobile/SPA
- `03-oidc.ts` - OpenID Connect
- `04-jwt-structure.ts` - JWT structure y claims
- `05-jwt-validation.ts` - JWT signature validation
- `06-saml.ts` - SAML assertions
- `07-sso.ts` - Single Sign-On (SSO)
- `08-token-refresh.ts` - Token refresh y rotation

**Conceptos clave:**
- OAuth 2.0 flows
- JWT structure y validación
- SAML vs OAuth vs OIDC
- Token lifecycle management

---

### 📂 Patrones de Cifrado
`04-criptografia-autenticacion/encryption-patterns/`

**Archivos:**
- `01-encryption-at-rest.ts` - Encryption at rest
- `02-encryption-in-transit.ts` - Encryption in transit
- `03-kdf.ts` - Key Derivation Functions (PBKDF2, Argon2)
- `04-secure-random.ts` - Secure random number generation
- `05-envelope-encryption.ts` - Envelope encryption
- `06-key-rotation.ts` - Key rotation strategies

**Conceptos clave:**
- Encryption at rest vs in transit
- KDFs para password hashing
- Envelope encryption
- Key management

---

## Nivel 5: Pentesting y Defensa

### 📂 Vulnerability Scanning
`05-pentesting-defensa/vulnerability-scanning/`

**Archivos:**
- `01-port-scanning.ts` - Port scanning (Nmap-like)
- `02-service-detection.ts` - Service fingerprinting
- `03-vulnerability-database.ts` - CVE database simulation
- `04-fuzzing.ts` - Input fuzzing
- `05-sast.ts` - Static Application Security Testing
- `06-dast.ts` - Dynamic Application Security Testing
- `07-sca.ts` - Software Composition Analysis

**Conceptos clave:**
- Port scanning techniques
- Vulnerability databases (CVE)
- Fuzzing for input validation
- SAST vs DAST

---

### 📂 Explotación y Mitigación
`05-pentesting-defensa/exploitation-mitigacion/`

**Archivos:**
- `01-buffer-overflow.ts` - Buffer overflow conceptual
- `02-privilege-escalation.ts` - Privilege escalation
- `03-lateral-movement.ts` - Lateral movement
- `04-aslr.ts` - ASLR (Address Space Layout Randomization)
- `05-dep.ts` - DEP (Data Execution Prevention)
- `06-stack-canaries.ts` - Stack canaries

**Conceptos clave:**
- Exploitation techniques
- Mitigations: ASLR, DEP, Stack canaries
- Privilege escalation vectors

---

### 📂 Hardening y Best Practices
`05-pentesting-defensa/hardening-best-practices/`

**Archivos:**
- `01-os-hardening.ts` - OS hardening checklist
- `02-disable-services.ts` - Disable unnecessary services
- `03-patch-management.ts` - Patch management
- `04-cis-benchmarks.ts` - CIS Benchmarks
- `05-container-security.ts` - Docker security
- `06-secrets-management.ts` - Secrets management (Vault-like)

**Conceptos clave:**
- OS hardening
- CIS Benchmarks
- Container security
- Secrets management

---

## Nivel 6: Seguridad en Producción

### 📂 DevSecOps y CI/CD
`06-produccion-devsecops/devsecops-ci-cd/`

**Archivos:**
- `01-sast-integration.ts` - SAST in pipeline
- `02-dast-integration.ts` - DAST in pipeline
- `03-dependency-scanning.ts` - Dependency scanning
- `04-container-scanning.ts` - Container image scanning
- `05-iac-security.ts` - Infrastructure as Code security
- `06-secret-scanning.ts` - Secret scanning in repos
- `07-gitops-security.ts` - GitOps security practices

**Conceptos clave:**
- Shift-left security
- Security in CI/CD
- Automated scanning
- Secret detection

---

### 📂 Compliance y Regulaciones
`06-produccion-devsecops/compliance-regulaciones/`

**Archivos:**
- `01-gdpr-compliance.ts` - GDPR compliance checks
- `02-hipaa.ts` - HIPAA requirements
- `03-pci-dss.ts` - PCI-DSS checklist
- `04-soc2.ts` - SOC 2 controls
- `05-iso27001.ts` - ISO 27001
- `06-audit-automation.ts` - Compliance automation

**Conceptos clave:**
- GDPR, HIPAA, PCI-DSS
- SOC 2 Trust Services Criteria
- ISO 27001
- Automated compliance

---

### 📂 Incident Response y SOC
`06-produccion-devsecops/incident-response-soc/`

**Archivos:**
- `01-ir-lifecycle.ts` - Incident Response lifecycle
- `02-detection.ts` - Threat detection
- `03-containment.ts` - Containment strategies
- `04-eradication.ts` - Eradication
- `05-recovery.ts` - Recovery procedures
- `06-siem.ts` - SIEM conceptual
- `07-playbooks.ts` - Incident response playbooks
- `08-forensics.ts` - Forensics básico

**Conceptos clave:**
- IR lifecycle
- SOC operations
- SIEM
- Playbooks y runbooks

---

### 📂 Zero Trust Architecture
`06-produccion-devsecops/zero-trust-architecture/`

**Archivos:**
- `01-zero-trust-principles.ts` - Principios de Zero Trust
- `02-microsegmentation.ts` - Microsegmentación
- `03-iam.ts` - Identity and Access Management
- `04-conditional-access.ts` - Conditional Access
- `05-jit-access.ts` - Just-In-Time access
- `06-service-mesh.ts` - Service mesh security

**Conceptos clave:**
- "Never trust, always verify"
- Microsegmentación
- IAM y Conditional Access
- JIT access

---

## 📊 Progreso Recomendado

### Semanas 1-3: Fundamentos
- [ ] Conceptos Básicos - CIA, Least Privilege
- [ ] Threat Modeling - STRIDE, DREAD
- [ ] Crypto Fundamentos - AES, RSA, Hash, HMAC

### Semanas 4-7: Seguridad Web
- [ ] OWASP Top 10
- [ ] XSS, CSRF, SQLi
- [ ] Ataques a Autenticación

### Semanas 8-11: Redes
- [ ] Protocolos Seguros - TLS, SSH
- [ ] Firewall, IDS, IPS
- [ ] VPN y Tunneling

### Semanas 12-15: Crypto Avanzada
- [ ] PKI y Certificados
- [ ] OAuth, JWT, SAML
- [ ] Patrones de Cifrado

### Semanas 16-19: Pentesting
- [ ] Vulnerability Scanning
- [ ] Explotación y Mitigación
- [ ] Hardening

### Semanas 20-24: Producción
- [ ] DevSecOps CI/CD
- [ ] Compliance
- [ ] Incident Response
- [ ] Zero Trust

---

## 🎯 Hitos de Aprendizaje

**Después del Nivel 1:** Comprendes principios fundamentales de seguridad
**Después del Nivel 2:** Puedes identificar y mitigar vulnerabilidades web
**Después del Nivel 3:** Entiendes seguridad de redes y protocolos
**Después del Nivel 4:** Dominas criptografía y autenticación avanzada
**Después del Nivel 5:** Puedes realizar pentesting ético
**Después del Nivel 6:** Estás listo para liderar seguridad en producción

---

**¡Usa este índice para navegar rápidamente entre ejercicios!** 🛡️
