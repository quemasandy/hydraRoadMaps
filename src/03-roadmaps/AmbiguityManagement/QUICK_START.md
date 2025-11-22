# 🚀 Quick Start - Gestión de la Ambigüedad (10 minutos)

> **Objetivo:** Aplicar técnicas de clarificación de requisitos desde hoy mismo.

---

## ⚡ En 60 Segundos

La ambigüedad en requisitos cuesta tiempo y dinero. Este roadmap te enseña a:
1. **Identificar** requisitos vagos
2. **Interrogar** con preguntas poderosas
3. **Documentar** especificaciones claras
4. **Validar** con stakeholders

**Resultado:** Menos retrabajos, entregas más precisas, stakeholders más felices.

---

## 🎯 Empieza Aquí (Elige tu camino)

### Opción A: "Tengo un Requisito Vago AHORA"
👉 Ve directo a: [Las 3 Preguntas Mágicas](#las-3-preguntas-mágicas)

### Opción B: "Quiero Mejorar mi Proceso"
👉 Ve directo a: [Framework Rápido 5W1H](#framework-rápido-5w1h)

### Opción C: "Quiero Aprender Todo"
👉 Empieza con: [Roadmap Completo](./README.md)

---

## 🔥 Las 3 Preguntas Mágicas

Ante CUALQUIER requisito vago, pregunta esto:

### 1. "¿Puedes darme un ejemplo concreto?"
**Por qué funciona:** Fuerza a pasar de abstracto a específico.

**Ejemplo:**
- ❌ Vago: "El sistema debe ser fácil de usar"
- ✅ Claro: "Un usuario nuevo debe poder crear su primera tarea en menos de 2 minutos sin ayuda"

### 2. "¿Cómo sabremos que está correcto?"
**Por qué funciona:** Obliga a definir criterios de aceptación.

**Ejemplo:**
- ❌ Vago: "El reporte debe ser rápido"
- ✅ Claro: "El reporte debe generarse en menos de 5 segundos con hasta 10,000 registros"

### 3. "¿Qué NO debería hacer?"
**Por qué funciona:** Define límites y scope por exclusión.

**Ejemplo:**
- ❌ Vago: "Quiero un dashboard de métricas"
- ✅ Claro: "Dashboard de ventas. NO incluir métricas de operaciones ni finanzas"

---

## 📋 Framework Rápido: 5W1H

Para cualquier requisito, responde estas 6 preguntas:

| Pregunta | Ejemplo de Respuesta |
|----------|---------------------|
| **What** (Qué) | ¿Qué problema resuelve? → "Reducir tiempo de checkout" |
| **Why** (Por qué) | ¿Por qué es importante? → "40% de carritos abandonados en último paso" |
| **Who** (Quién) | ¿Quién lo usará? → "Usuarios móviles que compran por primera vez" |
| **When** (Cuándo) | ¿Cuándo se necesita? → "Antes de Black Friday (deadline: 15 Nov)" |
| **Where** (Dónde) | ¿Dónde se usará? → "Mobile app, no web desktop" |
| **How** (Cómo) | ¿Cómo debería funcionar? → "One-click checkout con Apple/Google Pay" |

### ✅ Template para copiar y pegar:

```markdown
## Requisito: [Nombre]

**What:**
**Why:**
**Who:**
**When:**
**Where:**
**How:**

## Criterios de Aceptación:
- [ ]
- [ ]
- [ ]
```

---

## 🎓 Los 5 Porqués (1 minuto de práctica)

Para llegar a la raíz de un problema:

**Ejemplo:**
1. **Problema:** "Necesitamos un sistema de notificaciones"
   - **Por qué?** → "Los usuarios no ven actualizaciones importantes"
2. **Por qué no las ven?** → "No revisan el dashboard regularmente"
3. **Por qué no lo revisan?** → "Tienen que iniciar sesión cada vez"
4. **Por qué tienen que iniciar sesión?** → "Las sesiones expiran en 1 hora"
5. **Por qué expiran tan rápido?** → "Política de seguridad antigua"

**Real requisito:** Extender duración de sesión o implementar "remember me" (más simple que sistema de notificaciones completo).

---

## 📝 Checklist: ¿Mi Requisito está Claro?

Antes de empezar a programar, verifica:

- [ ] ✅ **Específico:** Sin palabras vagas ("rápido", "fácil", "mejor")
- [ ] ✅ **Medible:** Tiene números o criterios verificables
- [ ] ✅ **Con ejemplos:** Al menos 1 ejemplo concreto y 1 contraejemplo
- [ ] ✅ **Consensuado:** Stakeholder confirmó entendimiento
- [ ] ✅ **Documentado:** Escrito en algún lugar (Jira, Notion, etc.)
- [ ] ✅ **Con scope:** Define qué SÍ y qué NO incluye
- [ ] ✅ **Testeable:** Puedes escribir un test para validarlo

**Si fallan 3+ checkboxes → Requisito aún ambiguo, NO comenzar a programar.**

---

## 🛠️ Herramientas que Necesitas (Gratis)

### Mínimo Viable:
- **Notepad/Notes** - Tomar notas en reuniones
- **Papel y lápiz** - Dibujar wireframes rápidos

### Recomendado:
- **Notion** o **Confluence** - Documentación de requisitos
- **Excalidraw** - Diagramas y wireframes rápidos
- **Miro** - Colaboración visual con stakeholders

### Avanzado:
- **Figma** - Prototipos interactivos
- **PlantUML** - Diagramas técnicos (C4, UML)
- **Swagger/OpenAPI** - Especificación de APIs

---

## 💬 Frases que Debes Usar Más

### En Reuniones:
- "¿Puedes darme un ejemplo de cuándo usarías esto?"
- "Para asegurarme de que entendí bien, lo que necesitas es... ¿correcto?"
- "¿Qué pasaría si...?" (edge cases)
- "¿Cómo sabríamos que está funcionando correctamente?"

### En Documentación:
- "Dado [contexto], cuando [acción], entonces [resultado]"
- "El sistema DEBE / DEBERÍA / PODRÍA..." (RFC 2119)
- "Fuera de scope: ..."
- "Suposiciones: ..."

### En Validación:
- "Déjame mostrarte un prototipo rápido"
- "¿Es esto lo que tenías en mente?"
- "¿Qué falta aquí?"

---

## 🚨 Red Flags de Ambigüedad

Palabras/frases que indican requisitos vagos:

| 🚩 Red Flag | ✅ Cómo Clarificar |
|------------|-------------------|
| "Fácil de usar" | → "Usuario nuevo completa tarea X en Y minutos" |
| "Rápido" | → "Respuesta < 500ms" |
| "Escalable" | → "Soporta 10,000 usuarios concurrentes" |
| "Mejor que la competencia" | → "Tiene features X, Y, Z que ellos no" |
| "Intuitivo" | → "95% usuarios completan sin ayuda" |
| "Flexible" | → "Permite configurar X, Y, Z" |
| "Robusto" | → "99.9% uptime, zero data loss" |
| "Como en X app" | → "Específicamente, quieres [feature]?" |

**Regla de oro:** Si no puedes medir o testear → es vago.

---

## 📊 Template de User Story (Copia y Pega)

```markdown
## User Story: [Título]

**Como** [rol/persona],
**Quiero** [acción/funcionalidad],
**Para** [beneficio/valor].

### Contexto:
[Por qué esto es importante ahora]

### Criterios de Aceptación:
- **Dado** [contexto/precondición]
- **Cuando** [acción del usuario]
- **Entonces** [resultado esperado]

### Ejemplos:
**Escenario 1: [Happy path]**
- Input: ...
- Output: ...

**Escenario 2: [Error case]**
- Input: ...
- Output: ...

### Fuera de Scope:
- ❌ [Qué NO incluye esta historia]

### Preguntas Pendientes:
- [ ] ¿...?

### Notas Técnicas:
- ...

### Estimación: [Story points]
```

---

## 🎯 Ejercicio de 5 Minutos

Toma un ticket de tu backlog actual y responde:

1. **5W1H:** What, Why, Who, When, Where, How
2. **3 Preguntas Mágicas:**
   - ¿Ejemplo concreto?
   - ¿Cómo sé que está correcto?
   - ¿Qué NO debería hacer?
3. **Checklist de claridad** (las 7 casillas de arriba)

**Si tardas más de 5 minutos** → El requisito es más ambiguo de lo que pensabas.

---

## 📚 Próximos Pasos

### Ahora mismo (10 min):
1. Aplica las 3 Preguntas Mágicas a tu próxima tarea
2. Usa el template de User Story
3. Verifica el checklist de claridad

### Esta semana (2 horas):
1. Lee [Nivel 1 del Roadmap](./README.md#nivel-1-fundamentos-de-análisis-de-requisitos)
2. Practica 5W1H en 3 requisitos reales
3. Implementa los 5 Porqués en una reunión

### Este mes (8 horas):
1. Completa Nivel 1 y 2 del roadmap completo
2. Crea un glosario de dominio para tu proyecto
3. Facilita una sesión de refinement usando estas técnicas

---

## 🔗 Enlaces Útiles

- [📖 Roadmap Completo](./README.md) - Todos los niveles en detalle
- [📑 Índice](./INDICE.md) - Navegación por temas
- [🗂️ Templates](./templates/) - Plantillas reutilizables
- [💼 Ejemplos](./examples/) - Casos reales resueltos

---

## 💡 Tip del Día

> **"El tiempo que inviertes clarificando antes de programar, lo ahorras 10x en debugging y retrabajos."**

**Regla práctica:**
- 1 hora clarificando = 10 horas ahorradas después
- 1 reunión de 30min con stakeholders = 1 semana de desarrollo correcto

---

## ❓ FAQ Rápido

**P: "No tengo tiempo para tanta clarificación"**
R: Los retrabajos te costarán más tiempo. Invierte 20% upfront, ahorra 80% después.

**P: "El stakeholder no sabe lo que quiere"**
R: Normal. Usa prototipos rápidos y ejemplos concretos para ayudarle a descubrirlo.

**P: "Los requisitos siempre cambian"**
R: Por eso validamos temprano y seguido. Mejor cambiar antes que después.

**P: "Soy dev, no BA. ¿Es para mí?"**
R: ¡SÍ! Devs que clarifican requisitos escriben mejor código y tienen menos bugs.

---

## 🎁 Bonus: Cheat Sheet de Bolsillo

```
╔════════════════════════════════════════╗
║  ANTE REQUISITO VAGO, PREGUNTA:        ║
╠════════════════════════════════════════╣
║  1. ¿Ejemplo concreto?                 ║
║  2. ¿Cómo sé que está correcto?        ║
║  3. ¿Qué NO debería hacer?             ║
╠════════════════════════════════════════╣
║  DOCUMENTA CON:                        ║
║  • Dado-Cuando-Entonces                ║
║  • 5W1H                                ║
║  • Criterios de aceptación             ║
╠════════════════════════════════════════╣
║  VALIDA:                               ║
║  • Prototipo rápido                    ║
║  • Walkthrough con stakeholder         ║
║  • Confirmar entendimiento             ║
╚════════════════════════════════════════╝
```

---

**🎉 ¡Listo! Ya puedes empezar a gestionar ambigüedad como un pro.**

**Siguiente paso:** Elige 1 técnica de esta guía y úsala HOY en tu trabajo.

---

**¿Preguntas? → Consulta el [README completo](./README.md)**
**¿Quieres profundizar? → Ve al [Nivel 1](./README.md#nivel-1-fundamentos-de-análisis-de-requisitos)**

---

*Versión: 1.0 | Última actualización: 2025-01-17*
