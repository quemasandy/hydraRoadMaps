# Stakeholder Management Roadmap

## 📚 Objetivo

Este roadmap te enseña a **establecer límites y procesos claros** para que las interacciones con QA y Management sean **breves y productivas**.

## 🎯 Para Quién

- Developers que sienten que pierden demasiado tiempo en reuniones
- Engineers interrumpidos constantemente por QA/PM
- Tech leads que necesitan proteger el tiempo de su equipo
- Cualquiera que quiera comunicarse más efectivamente con stakeholders

## 🗺️ Estructura del Roadmap

### 📘 Fundamentos (01-05)

Habilidades básicas que todo developer necesita:

- **01-comunicacion-efectiva**: Frameworks como BLUF, SBAR, 5W1H para comunicación clara
- **02-establecer-limites**: Técnicas para decir "no" profesionalmente y proteger tu tiempo
- **03-manejo-interrupciones**: Sistemas de triage y batching para minimizar distracciones
- **04-documentacion-clara**: Write once, reference many times - reduce repetitive questions
- **05-reuniones-productivas**: Hace meetings más cortas y efectivas (o evítalas completamente)

### 📙 Avanzado (06-10)

Técnicas intermedias para gestión proactiva:

- **06-gestion-expectativas**: Under-promise, over-deliver con scope y estimates claros
- **07-procesos-claros**: Workflows documentados para solicitudes comunes
- **08-comunicacion-asincrona**: Async-first culture para menos interrupciones
- **09-metricas-reportes**: Data-driven updates que responden preguntas antes de que las hagan
- **10-escalacion-efectiva**: Cuándo y cómo escalar issues apropiadamente

### 📕 Experto (11-15)

Habilidades avanzadas de liderazgo y negociación:

- **11-negociacion-tiempo**: Negotiating deadlines y trade-offs
- **12-gestion-tiempo**: Time-blocking, deep work protection, calendar management
- **13-feedback-loops**: Establishing continuous feedback with stakeholders
- **14-manejo-crisis**: Communication during production incidents and emergencies
- **15-stakeholder-mapping**: Understanding different stakeholder needs and communication styles

## 🚀 Cómo Usar Este Roadmap

### Para Beginners

Empieza en orden (01 → 05):

```bash
# Módulo 1: Comunicación efectiva
ts-node src/roadmaps/StakeholderManagement/01-comunicacion-efectiva/index.ts

# Practica los frameworks (BLUF, SBAR) en tus emails del día
# Luego avanza al siguiente módulo
```

### Para Intermediate

Si ya tienes buena comunicación, salta a:
- 02-establecer-limites (si te interrumpen mucho)
- 03-manejo-interrupciones (si pierdes focus constantemente)
- 05-reuniones-productivas (si pasas >15h/week en meetings)

### Para Advanced

Enfócate en:
- 06-gestion-expectativas (si hay frecuentes disappointments)
- 09-metricas-reportes (si te piden status updates constantes)
- 14-manejo-crisis (si liderás incident response)

## 💡 Principios Clave

### 1. Async-First

**Pregunta siempre:** "Can this be async?"

```typescript
// ❌ BAD: Immediate Slack message expecting instant response
"Hey, quick question about the API..."

// ✅ GOOD: Async with context
"[Non-urgent] Question about API auth flow.

Context: Working on feature X, need to understand how to...
Reference: [doc link]

No rush, respond when you have time. Thanks!"
```

### 2. Write Once, Reference Many

**Documentar la 3ra vez** que te preguntan algo:

```typescript
// 1st time: Respond directly
// 2nd time: Respond + mental note
// 3rd time: Document + share link
```

### 3. Protect Deep Work

**2-3 hour uninterrupted blocks** son crucial para trabajo complejo:

```typescript
// Sample calendar blocking
9:00-12:00  🚫 DEEP WORK (No meetings, Slack on DND)
12:00-13:00 🍽️ Lunch
13:00-14:00 📧 Batch email/Slack responses
14:00-16:00 💬 Office hours / Meetings OK
16:00-17:00 📝 Documentation / Planning
```

### 4. Clear Expectations

**Siempre clarify:**
- What (exactly what's needed)
- Why (business context)
- When (realistic deadline)
- Who (decision maker)

### 5. Boundaries ≠ Being Unhelpful

```typescript
// ❌ UNHELPFUL
"I'm busy, can't help"

// ✅ HELPFUL WITH BOUNDARIES
"I'm in deep work until 12pm. Can we discuss at 2pm?
Or if it's urgent and can't wait, please mark [URGENT] and explain why."
```

## 📊 Measurable Outcomes

After completing this roadmap, you should see:

✅ **Fewer interruptions**
- Track before/after using interruption log (Module 03)

✅ **Shorter meetings**
- Track meeting hours before/after (Module 05)
- Goal: <15 hours/week in meetings

✅ **Less repetitive questions**
- Track # of times you answer same question (Module 04)
- Document the 3rd time

✅ **More deep work time**
- Track uninterrupted 2+ hour blocks (Module 12)
- Goal: 3-4 blocks per week minimum

✅ **Better stakeholder satisfaction**
- Fewer "surprises" due to clear expectations (Module 06)
- Proactive updates reduce "status check" requests

## 🛠️ Herramientas Útiles

### Templates
- Email templates (Module 01)
- Meeting agenda templates (Module 05)
- Documentation templates (Module 04)
- Estimation templates (Module 06)

### Frameworks
- BLUF (Bottom Line Up Front)
- SBAR (Situation-Background-Assessment-Recommendation)
- 5W1H (Who, What, When, Where, Why, How)
- Decision trees for meetings, interruptions

### Metrics
- Interruption log
- Meeting audit
- Time tracking
- Documentation effectiveness

## 📖 Recommended Reading

- **"Deep Work"** by Cal Newport - Focus and productivity
- **"The Manager's Path"** by Camille Fournier - Engineering leadership
- **"Crucial Conversations"** - Difficult conversations
- **"Working Backwards"** by Amazon - Amazon's communication culture

## 🤝 Contributing

Si tienes más técnicas o examples, contribuye al roadmap!

Areas donde más ayuda se necesita:
- Real-world examples from your workplace
- Additional templates
- Metrics and tracking tools
- Cultural differences (US vs Europe vs Asia)

## ⚡ Quick Wins

Can't do the full roadmap ahora? Start here:

### Week 1: Communication
- Use BLUF in all emails this week
- Result: Clearer, faster responses

### Week 2: Boundaries
- Block 2 hours 3x this week for deep work
- Set Slack to DND during these blocks
- Result: Complete 1 complex task uninterrupted

### Week 3: Meetings
- Decline 1 meeting that could be an email
- Require agenda for all meetings you accept
- Result: Save 2-3 hours

### Week 4: Documentation
- Document the next question you get asked 3+ times
- Result: Save 15 min every time someone asks that question

## 🎓 Certification

Complete all 15 modules + exercises to earn:

**Stakeholder Management - Professional Certificate**

Requirements:
- [ ] Complete all 15 modules
- [ ] Practice exercises in each module
- [ ] Implement at least 3 techniques in your daily work
- [ ] Track improvements (fewer interruptions, shorter meetings, etc.)
- [ ] Share learnings with your team

---

## 🚦 Getting Started

```bash
# Start with module 01
cd src/roadmaps/StakeholderManagement/01-comunicacion-efectiva
ts-node index.ts

# Read the output, practice the techniques
# Then move to module 02
```

**Good luck!** 🎉

Remember: **Effective stakeholder management isn't about avoiding people, it's about making interactions purposeful and productive.**
