# 🚀 Quick Start - Cybersecurity Exercises

## Configuración Inicial (5 minutos)

### 1. Verificar Prerrequisitos

```bash
# Node.js 18+
node --version
# Debe mostrar v18.0.0 o superior

# npm 9+
npm --version
# Debe mostrar 9.0.0 o superior

# TypeScript
tsc --version
# Si no está instalado: npm install -g typescript ts-node
```

### 2. Crear package.json

```bash
cd src/claudeExerciseCybersecurity
```

Crea un archivo `package.json`:

```json
{
  "name": "cybersecurity-exercises",
  "version": "1.0.0",
  "description": "Ejercicios prácticos de Ciberseguridad con TypeScript",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint **/*.ts",
    "format": "prettier --write **/*.ts"
  },
  "dependencies": {
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "jose": "^5.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/jest": "^29.5.11",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "eslint": "^8.56.0",
    "prettier": "^3.2.4"
  }
}
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Configurar TypeScript

Crea `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### 5. Configurar Jest

Crea `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
};
```

---

## Tu Primer Ejercicio (10 minutos)

### Nivel 1: CIA Triad

```bash
# Ejecutar el ejercicio
ts-node 01-fundamentos-seguridad/conceptos-basicos/01-cia-triad.ts

# Ejecutar tests
npm test 01-cia-triad
```

### Qué Aprenderás

1. **Confidencialidad**: Proteger información sensible
2. **Integridad**: Prevenir modificaciones no autorizadas
3. **Disponibilidad**: Asegurar acceso cuando se necesita

### Ejemplo Rápido

```typescript
import { CIATriad } from './01-cia-triad';

const cia = new CIATriad();

// Confidencialidad: Cifrar datos
const encrypted = cia.encrypt('secret data', 'my-key');
console.log(encrypted);

// Integridad: Verificar hash
const hash = cia.hash('important message');
const isValid = cia.verifyIntegrity('important message', hash);
console.log(isValid); // true

// Disponibilidad: Check health
const isAvailable = cia.checkAvailability('https://example.com');
console.log(isAvailable);
```

---

## Estructura de Directorios

```
claudeExerciseCybersecurity/
├── README.md                           # Roadmap completo
├── INDICE.md                           # Índice navegable
├── QUICK_START.md                      # Esta guía
├── package.json                        # Dependencias
├── tsconfig.json                       # Config de TypeScript
├── jest.config.js                      # Config de tests
├── 01-fundamentos-seguridad/
│   ├── conceptos-basicos/
│   ├── threat-modeling/
│   └── crypto-fundamentos/
├── 02-seguridad-web/
│   ├── owasp-top10/
│   ├── xss-csrf-sqli/
│   └── authentication-attacks/
├── 03-seguridad-redes/
│   ├── protocolos-seguros/
│   ├── firewall-ids-ips/
│   └── vpn-tunneling/
├── 04-criptografia-autenticacion/
│   ├── pki-certificados/
│   ├── oauth-jwt-saml/
│   └── encryption-patterns/
├── 05-pentesting-defensa/
│   ├── vulnerability-scanning/
│   ├── exploitation-mitigacion/
│   └── hardening-best-practices/
└── 06-produccion-devsecops/
    ├── devsecops-ci-cd/
    ├── compliance-regulaciones/
    ├── incident-response-soc/
    └── zero-trust-architecture/
```

---

## Comandos Útiles

### Ejecutar un Ejercicio

```bash
# Ejercicio específico
ts-node 01-fundamentos-seguridad/conceptos-basicos/01-cia-triad.ts

# Con watch mode
nodemon --exec ts-node 01-fundamentos-seguridad/conceptos-basicos/01-cia-triad.ts
```

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests de un nivel específico
npm test 01-fundamentos-seguridad

# Tests en modo watch
npm run test:watch

# Tests con coverage
npm test -- --coverage
```

---

## Flujo de Trabajo Recomendado

### Para Cada Ejercicio

1. **Lee la teoría** - Entiende el concepto de seguridad

2. **Implementa el código** - Escribe en el archivo `.ts`

3. **Ejecuta manualmente** - Verifica la salida
   ```bash
   ts-node 01-fundamentos-seguridad/conceptos-basicos/01-cia-triad.ts
   ```

4. **Ejecuta los tests** - Asegura corrección
   ```bash
   npm test 01-cia-triad
   ```

5. **Experimenta** - Prueba ataques y defensas en sandbox

6. **Toma notas** - Documenta hallazgos y aprendizajes

---

## ⚠️ Disclaimer Ético

**IMPORTANTE:** Estos ejercicios son exclusivamente educativos.

### Reglas de Uso Ético

✅ **SÍ:**
- Practica en tus propios sistemas
- Usa entornos sandbox (VMs, Docker)
- Participa en CTFs legales
- Reporta vulnerabilidades responsablemente

❌ **NO:**
- Ataques sin autorización escrita
- Usar técnicas en sistemas ajenos
- Violar leyes de ciberseguridad
- Compartir exploits con intención maliciosa

### Responsible Disclosure

Si encuentras una vulnerabilidad real:
1. Documenta el hallazgo
2. Contacta al vendor/propietario
3. Da tiempo razonable para parche (90 días)
4. Publica solo después de fix (opcional)

---

## Tips para Aprender Efectivamente

### 1. Sandbox Todo
Usa VMs o containers para practicar:
```bash
# Crear VM con VirtualBox/VMware
# O usar Docker para ambientes aislados
docker run -it --rm ubuntu:latest bash
```

### 2. Piensa como Atacante
Para cada defensa, pregúntate:
- ¿Cómo la bypassearía?
- ¿Qué asume esta defensa?
- ¿Qué pasa si esa asunción falla?

### 3. Lee CVEs Reales
```bash
# Busca CVEs en https://cve.mitre.org
# Estudia cómo fueron explotados
# Aprende de las mitigaciones
```

### 4. Participa en CTFs
- HackTheBox (hackthebox.eu)
- TryHackMe (tryhackme.com)
- OverTheWire (overthewire.org)

### 5. Documenta Hallazgos
Escribe reports como si fueran para un cliente:
- Resumen ejecutivo
- Pasos de reproducción
- Impacto
- Recomendaciones

---

## Troubleshooting

### Error: "Cannot find module 'bcrypt'"
```bash
npm install bcrypt
# Si falla en Windows, necesitas build tools
```

### Error: "jsonwebtoken is not defined"
```bash
npm install jsonwebtoken @types/jsonwebtoken
```

### Tests Fallan
```bash
# Ejecuta con más detalle
npm test -- --verbose

# Ejecuta un test específico
npm test -- -t "should encrypt data"
```

---

## Recursos Adicionales

### Plataformas de Práctica
- **HackTheBox** - Labs de pentesting
- **TryHackMe** - Guided security training
- **OverTheWire** - Wargames
- **DVWA** - Damn Vulnerable Web App (local)

### Documentación
- **OWASP** - https://owasp.org
- **NIST Cybersecurity Framework** - https://nist.gov/cyberframework
- **CIS Benchmarks** - https://cisecurity.org/cis-benchmarks

### Comunidades
- r/netsec
- r/AskNetsec
- OWASP Slack
- DEF CON groups

---

## Certificaciones Recomendadas

**Beginner:**
- CompTIA Security+
- Certified Ethical Hacker (CEH)

**Intermediate:**
- OSCP (Offensive Security Certified Professional)
- GIAC Security Essentials (GSEC)

**Advanced:**
- CISSP (Certified Information Systems Security Professional)
- OSEP (Offensive Security Experienced Penetration Tester)

---

## Siguientes Pasos

Una vez completado el setup:

1. ✅ Lee [README.md](./README.md) para el roadmap completo
2. ✅ Usa [INDICE.md](./INDICE.md) para navegar ejercicios
3. ✅ Empieza con **Nivel 1** - Fundamentos de Seguridad
4. ✅ Practica **éticamente** en ambientes autorizados

---

**¡Estás listo para comenzar tu viaje en Ciberseguridad! 🛡️**

```bash
ts-node 01-fundamentos-seguridad/conceptos-basicos/01-cia-triad.ts
```

**Recuerda: Con gran poder viene gran responsabilidad. Usa estos conocimientos solo para el bien.** ⚖️
