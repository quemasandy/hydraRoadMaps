# User Story Template

> Copy this template to create clear, unambiguous user stories

---

## 📝 User Story: [Título Descriptivo]

**Como** [rol/persona/tipo de usuario],
**Quiero** [acción/funcionalidad específica],
**Para** [beneficio/valor de negocio].

---

## 🎯 Contexto y Motivación

**¿Por qué esto es importante ahora?**
[Explica el problema de negocio, métricas actuales, pain points de usuarios]

**Business value:**
[Impacto esperado: revenue, retención, eficiencia, etc.]

---

## ✅ Criterios de Aceptación

Usa formato Given-When-Then (Dado-Cuando-Entonces):

### Criterio 1: [Nombre del escenario]
- **Dado** [contexto/precondición/estado inicial]
- **Cuando** [acción del usuario/evento]
- **Entonces** [resultado esperado/postcondición]

### Criterio 2: [Nombre del escenario]
- **Dado** [contexto/precondición/estado inicial]
- **Cuando** [acción del usuario/evento]
- **Entonces** [resultado esperado/postcondición]

### Criterio 3: [Nombre del escenario - edge cases]
- **Dado** [contexto/precondición/estado inicial]
- **Cuando** [acción del usuario/evento]
- **Entonces** [resultado esperado/postcondición]

---

## 💡 Ejemplos Concretos

### Ejemplo 1: Happy Path
**Escenario:** [Descripción del caso típico/exitoso]
- **Input:** [Qué hace el usuario / qué datos ingresan]
- **Expected Output:** [Qué debería pasar / qué debería ver]

### Ejemplo 2: Error Case
**Escenario:** [Descripción del caso de error]
- **Input:** [Qué causa el error]
- **Expected Output:** [Cómo debe manejarse el error]

### Ejemplo 3: Edge Case
**Escenario:** [Descripción del caso límite]
- **Input:** [Situación límite]
- **Expected Output:** [Comportamiento en límite]

---

## 🚫 Fuera de Scope

**Esta historia NO incluye:**
- ❌ [Funcionalidad que NO se hará en esta historia]
- ❌ [Feature que se postpone para v2]
- ❌ [Aspecto que se evaluará después]

**Razones:**
[Por qué estas cosas están fuera de scope]

---

## 🔍 Preguntas Pendientes

- [ ] [Pregunta 1 que necesita respuesta del stakeholder]
- [ ] [Pregunta 2 sobre implementación]
- [ ] [Pregunta 3 sobre dependencias]

---

## 📐 Requisitos No Funcionales

### Performance
- [ ] [Ej: Response time < 200ms p95]
- [ ] [Ej: Soportar 1000 usuarios concurrentes]

### Security
- [ ] [Ej: Autenticación requerida]
- [ ] [Ej: HTTPS obligatorio]

### Usability
- [ ] [Ej: Funciona en mobile y desktop]
- [ ] [Ej: Accesible WCAG 2.1 AA]

### Reliability
- [ ] [Ej: 99.9% uptime]
- [ ] [Ej: Graceful degradation si servicio X falla]

---

## 🔗 Dependencias

**Bloquea a:**
- [Lista de stories que dependen de esta]

**Bloqueada por:**
- [Lista de stories que deben completarse primero]

**Servicios/APIs necesarios:**
- [APIs externas requeridas]
- [Microservicios internos]

---

## 📊 Estimación

**Story Points:** [Fibonacci: 1, 2, 3, 5, 8, 13, 21]

**Complejidad:**
- [ ] Baja (1-3 pts)
- [ ] Media (5-8 pts)
- [ ] Alta (13+ pts)

**Esfuerzo estimado:** [X días/horas]

**Confidence level:** [Alta / Media / Baja]

---

## 🧪 Testing Strategy

### Unit Tests
- [ ] [Qué componentes necesitan unit tests]

### Integration Tests
- [ ] [Qué integraciones necesitan tests]

### E2E Tests
- [ ] [Qué flujos end-to-end testear]

### Manual Testing
- [ ] [Qué requiere QA manual]

---

## 📸 Wireframes/Mockups

[Incluir links a Figma, capturas de pantalla, o dibujos]

**Link:** [URL a diseño]

**Notas sobre diseño:**
- [Comentarios importantes sobre UI/UX]

---

## 📝 Notas Técnicas

### Approach propuesto:
[Descripción high-level de cómo se implementará]

### Alternativas consideradas:
1. [Opción A - pros/cons]
2. [Opción B - pros/cons]

### Decisión:
[Qué approach se eligió y por qué]

### Risks técnicos:
- ⚠️ [Risk 1 y mitigación]
- ⚠️ [Risk 2 y mitigación]

---

## ✔️ Definition of Done

- [ ] Código implementado y reviewed
- [ ] Tests escritos y pasando (coverage > 80%)
- [ ] Documentación actualizada
- [ ] Demoed a stakeholder y aprobado
- [ ] Deployed a staging
- [ ] QA testing completado
- [ ] Merged a main/master
- [ ] Deployed a production

---

## 📅 Timeline

**Created:** [DD/MM/YYYY]
**Target Sprint:** [Sprint X]
**Deadline:** [DD/MM/YYYY]
**Completed:** [DD/MM/YYYY]

---

## 👥 Stakeholders

**Product Owner:** [Nombre]
**Tech Lead:** [Nombre]
**Designer:** [Nombre]
**QA:** [Nombre]

---

## 🔄 Change Log

### [DD/MM/YYYY] - [Cambio]
- [Qué cambió y por qué]

---

## 📚 Referencias

- [Link a documentación relevante]
- [Link a issue relacionado]
- [Link a diseño técnico]

---

**Status:** [ ] To Do | [ ] In Progress | [ ] In Review | [ ] Done

---

## 🎯 Checklist de Calidad (Antes de Implementar)

- [ ] **Específico:** Sin palabras vagas ("rápido", "fácil", "mejor")
- [ ] **Medible:** Tiene números o criterios verificables
- [ ] **Con ejemplos:** Al menos 1 ejemplo concreto y 1 contraejemplo
- [ ] **Consensuado:** Stakeholder confirmó entendimiento
- [ ] **Documentado:** Toda la información necesaria está aquí
- [ ] **Con scope:** Define qué SÍ y qué NO incluye
- [ ] **Testeable:** Se pueden escribir tests para validar

**✅ Si todas las casillas están marcadas → Listo para implementar**
**❌ Si faltan 3+ casillas → Necesita más clarificación**
