# Ejercicios Completos de Ciberseguridad - TypeScript

**123 archivos de ejercicios progresivos desde fundamentos hasta producción**

## ✅ Estado de Implementación

### Nivel 1: Fundamentos de Seguridad (14/14 archivos) ✅ COMPLETO
- ✅ Conceptos Básicos (5): CIA Triad, Least Privilege, Defense in Depth, Auth vs Authz, Threat Types
- ✅ Threat Modeling (4): STRIDE, DREAD, Attack Trees, Attack Surface  
- ✅ Crypto Fundamentos (5): Symmetric, Asymmetric, Hashing, HMAC, Digital Signatures

### Nivel 2: Seguridad Web (26 archivos) 🚧 EN PROGRESO
- ✅ OWASP Top 10 (10/10)
- ⏳ XSS/CSRF/SQLi (0/9)
- ⏳ Authentication Attacks (0/7)

### Nivel 3-6: (83 archivos) ⏳ PENDIENTE
Ver estructura completa abajo.

## 📂 Estructura Completa

```
claudeExerciseCybersecurity/
├── 01-fundamentos-seguridad/ (14 archivos) ✅
│   ├── conceptos-basicos/ (5)
│   ├── threat-modeling/ (4)
│   └── crypto-fundamentos/ (5)
├── 02-seguridad-web/ (26 archivos)
│   ├── owasp-top10/ (10) ✅
│   ├── xss-csrf-sqli/ (9)
│   └── authentication-attacks/ (7)
├── 03-seguridad-redes/ (18 archivos)
│   ├── protocolos-seguros/ (6)
│   ├── firewall-ids-ips/ (6)
│   └── vpn-tunneling/ (6)
├── 04-criptografia-autenticacion/ (19 archivos)
│   ├── pki-certificados/ (5)
│   ├── oauth-jwt-saml/ (8)
│   └── encryption-patterns/ (6)
├── 05-pentesting-defensa/ (19 archivos)
│   ├── vulnerability-scanning/ (7)
│   ├── exploitation-mitigacion/ (6)
│   └── hardening-best-practices/ (6)
└── 06-produccion-devsecops/ (27 archivos)
    ├── devsecops-ci-cd/ (7)
    ├── compliance-regulaciones/ (6)
    ├── incident-response-soc/ (8)
    └── zero-trust-architecture/ (6)
```

## 🚀 Ejecutar Ejercicios

```bash
# Ejecutar un archivo específico
ts-node src/claudeExerciseCybersecurity/01-fundamentos-seguridad/conceptos-basicos/01-cia-triad.ts

# Ejecutar todos los de un nivel
find src/claudeExerciseCybersecurity/01-fundamentos-seguridad -name "*.ts" -exec ts-node {} \;
```

## 📚 Recursos Adicionales

- OWASP: https://owasp.org
- NIST: https://www.nist.gov/cyberframework  
- CWE: https://cwe.mitre.org

**Total: 123 ejercicios educativos de ciberseguridad**
