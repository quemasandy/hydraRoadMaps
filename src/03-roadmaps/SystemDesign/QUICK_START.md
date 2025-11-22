# 🚀 Quick Start - System Design

## Comienza tu aprendizaje en 5 minutos

### 🎯 ¿Qué vas a aprender?

System Design (Diseño de Sistemas) es la habilidad de arquitecturar soluciones de software **escalables, confiables y mantenibles**. Es esencial para:
- Entrevistas de Senior Engineer y Tech Lead
- Tomar decisiones arquitectónicas en tu trabajo
- Entender cómo funcionan sistemas como Twitter, Netflix, Uber
- Crecer como ingeniero de software

---

## 📋 Antes de Empezar

### Prerequisitos
- [ ] Conocimientos básicos de programación
- [ ] Entendimiento de bases de datos (SQL básico)
- [ ] Familiaridad con HTTP/REST APIs
- [ ] (Opcional) Experiencia con cloud providers

### No necesitas ser experto en:
- ❌ Programación avanzada
- ❌ Algoritmos complejos
- ❌ DevOps/Infrastructure
- ❌ Ningún lenguaje específico

**System Design es más sobre conceptos y decisiones arquitectónicas que sobre código.**

---

## 🎓 Tu Primera Semana

### Día 1-2: Fundamentos Básicos
**Objetivo:** Entender qué es System Design

**Lee:**
1. [README - Nivel 1.1](./README.md#11-introducción-al-system-design)
2. [System Design Primer - Intro](https://github.com/donnemartin/system-design-primer#system-design-topics-start-here)

**Practica:**
- Identifica requerimientos funcionales y no funcionales de tu app favorita (Twitter, Instagram, etc.)

**Tiempo:** 2-3 horas

---

### Día 3-4: Estimaciones de Capacidad
**Objetivo:** Hacer cálculos back-of-envelope

**Aprende:**
- Números que debes memorizar:
  ```
  1 MB = 1,000 KB = 1,000,000 bytes
  1 Petabyte = 1,000 TB = 1,000,000 GB

  L1 cache reference: 0.5 ns
  Disk seek: 10 ms
  Network request (same datacenter): 500 μs
  Network request (cross-country): 150 ms

  1 servidor puede manejar: ~1,000 QPS (queries per second)
  ```

**Practica:**
- Ejercicio: Estimar storage para Twitter
  - 200M usuarios activos diarios
  - Cada usuario tweetea 2 veces/día
  - Cada tweet = 280 chars = ~280 bytes
  - Storage/día = 200M × 2 × 280 bytes = 112 GB/día

**Tiempo:** 2-3 horas

---

### Día 5-7: Tu Primer Diseño
**Objetivo:** Diseñar un sistema simple completo

**Sistema:** URL Shortener (como bit.ly)

**Paso 1: Requerimientos (5 min)**
- Funcionales:
  - Acortar URL larga → URL corta
  - Redirigir URL corta → URL original
- No funcionales:
  - Alta disponibilidad
  - Baja latencia (< 100ms)
  - 100M URLs/mes

**Paso 2: Estimaciones (5 min)**
- QPS: 100M URLs/mes ÷ 30 días ÷ 86400 seg = ~40 QPS (write)
- Leer/Escribir ratio = 100:1 → 4,000 QPS (read)
- Storage: 100M URLs × 500 bytes × 12 meses = 600 GB/año

**Paso 3: API Design (5 min)**
```
POST /api/v1/urls
{
  "long_url": "https://example.com/very/long/url"
}
→ returns: { "short_url": "https://bit.ly/abc123" }

GET /abc123
→ redirects to long_url
```

**Paso 4: High-Level Design (10 min)**
```
Cliente → Load Balancer → Web Servers → Cache (Redis)
                                      ↓
                                   Database
```

**Paso 5: Componentes Detallados (15 min)**
- **Hash function:** Base62 encoding (a-z, A-Z, 0-9)
- **Database:** SQL (id, long_url, short_url, created_at)
- **Cache:** Redis para URLs populares
- **Escala:** Sharding por hash de short_url

**Paso 6: Bottlenecks (5 min)**
- Database puede ser SPOF → Agregar replicación
- Cache miss rate alto → Aumentar TTL
- Collision de hashes → Implementar retry

**Tiempo:** 2-4 horas (con investigación)

---

## 📚 Recursos Esenciales

### 🎥 Video para Empezar (1 hora)
- [Gaurav Sen - System Design Basics](https://www.youtube.com/watch?v=xpDnVSmNFX0)

### 📖 Lectura Obligatoria (2-3 horas)
- [System Design Primer](https://github.com/donnemartin/system-design-primer) - Secciones:
  - Performance vs scalability
  - Latency vs throughput
  - CAP theorem
  - Load balancing
  - Caching

### 🛠️ Herramientas
- **Diagramas:** draw.io, Excalidraw, Lucidchart
- **Notas:** Notion, Obsidian, Markdown
- **Práctica:** [Pramp](https://www.pramp.com/) (mock interviews gratis)

---

## 🗓️ Plan de 30 Días

### Semana 1: Fundamentos
- Días 1-2: Introducción y requerimientos
- Días 3-4: Estimaciones y cálculos
- Días 5-7: Primer diseño (URL Shortener)

### Semana 2: Componentes Básicos
- Días 8-9: Load Balancing
- Días 10-11: Caching (implementar LRU)
- Días 12-14: Bases de datos (SQL vs NoSQL)

### Semana 3: Diseños Intermedios
- Días 15-16: Diseñar Rate Limiter
- Días 17-18: Diseñar Key-Value Store
- Días 19-21: Diseñar Notification System

### Semana 4: Sistema Complejo
- Días 22-28: Diseñar Twitter (completo)
- Días 29-30: Revisar y reforzar conceptos débiles

**Al terminar 30 días:** Habrás diseñado 5+ sistemas y entenderás fundamentos sólidos.

---

## ✅ Checklist de Primera Semana

- [ ] Entiendo qué es System Design y por qué importa
- [ ] Puedo identificar requerimientos funcionales vs no funcionales
- [ ] Sé hacer estimaciones básicas (QPS, storage)
- [ ] Conozco los números fundamentales (latencias)
- [ ] He diseñado mi primer sistema completo (URL Shortener)
- [ ] Puedo explicar CAP theorem
- [ ] Entiendo qué es un Load Balancer
- [ ] Sé qué es caching y cuándo usarlo

---

## 🎯 Tu Primer Ejercicio (AHORA)

**Tarea:** Diseña un sistema de "Paste Bin" (como Pastebin.com)

**Requerimientos:**
- Los usuarios pueden pegar texto y obtener URL única
- Texto debe ser accesible por URL
- Opcional: TTL para auto-delete

**Usa el framework:**
1. Requerimientos (funcionales y no funcionales)
2. Estimaciones (usuarios, QPS, storage)
3. API design (endpoints)
4. High-level design (diagrama de componentes)
5. Database schema
6. Identificar bottlenecks

**Tiempo sugerido:** 30-45 minutos

**Tip:** No busques la solución hasta intentarlo. No hay respuesta "perfecta".

---

## 🚦 Próximos Pasos

### Después de tu Primera Semana:

**Si quieres prepararte para entrevistas (3-4 meses):**
→ Ve al [Plan Intensivo](./README.md#opción-intensiva-3-4-meses)

**Si quieres aprender profundamente (6-12 meses):**
→ Ve al [Plan Moderado](./README.md#opción-moderada-6-8-meses)

**Si ya tienes experiencia:**
→ Salta directo a [Nivel 5: Casos de Estudio](./README.md#nivel-5-casos-de-estudio-clásicos)

---

## 💡 Tips para Principiantes

### DO's ✅
- **Piensa en voz alta** - Comunica tu proceso de pensamiento
- **Haz preguntas** - Nunca asumas requerimientos
- **Empieza simple** - High-level primero, detalles después
- **Dibuja diagramas** - Visualiza tu arquitectura
- **Discute trade-offs** - No hay solución perfecta

### DON'Ts ❌
- **No memorices soluciones** - Entiende los principios
- **No saltes estimaciones** - Son fundamentales
- **No ignores NFRs** - Disponibilidad y escalabilidad importan
- **No over-engineer** - Simplicidad primero
- **No te quedes callado** - La comunicación es clave

---

## 📞 ¿Necesitas Ayuda?

### Comunidades
- [Reddit r/systemdesign](https://reddit.com/r/systemdesign)
- [System Design Discord](https://discord.gg/systemdesign)
- [Blind](https://teamblind.com) - Tech workers forum

### Recursos Gratuitos
- [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [Awesome System Design](https://github.com/madd86/awesome-system-design)
- [ByteByteGo Newsletter](https://bytebytego.com/)

### Práctica con Mock Interviews
- [Pramp](https://www.pramp.com/) - Gratis
- [Interviewing.io](https://interviewing.io/) - Con ingenieros reales
- [Exponent](https://www.tryexponent.com/) - Videos y práctica

---

## 🏆 Sistema de Progreso

### Nivel 1: Novato (Semana 1-2)
- ✅ Has diseñado 1-2 sistemas simples
- ✅ Entiendes conceptos básicos
- ✅ Puedes hacer estimaciones simples

### Nivel 2: Principiante (Mes 1-2)
- ✅ Has diseñado 5-10 sistemas
- ✅ Entiendes componentes principales
- ✅ Puedes identificar bottlenecks

### Nivel 3: Intermedio (Mes 3-6)
- ✅ Has diseñado 20+ sistemas
- ✅ Puedes diseñar sistemas complejos
- ✅ Entiendes trade-offs profundamente

### Nivel 4: Avanzado (Mes 6-12)
- ✅ Puedes optimizar diseños existentes
- ✅ Conoces patrones avanzados
- ✅ Puedes liderar decisiones arquitectónicas

---

## 🎬 ¡Comienza Ahora!

1. **Lee:** [Nivel 1.1 del README](./README.md#11-introducción-al-system-design) (15 min)
2. **Mira:** [Video de Gaurav Sen](https://www.youtube.com/watch?v=xpDnVSmNFX0) (1 hora)
3. **Práctica:** Diseña URL Shortener siguiendo pasos arriba (1 hora)
4. **Repite:** 1 sistema nuevo cada 2-3 días

**En 30 días estarás diseñando sistemas complejos con confianza.**

---

## 📈 Tracking Template

```markdown
# Mi Progreso en System Design

## Semana 1
**Fecha inicio:** [DD/MM/YYYY]

### Sistemas Diseñados
1. [ ] URL Shortener
2. [ ] Paste Bin
3. [ ] [Otro sistema]

### Conceptos Dominados
- [ ] Requerimientos funcionales vs no funcionales
- [ ] Estimaciones de capacidad
- [ ] CAP theorem
- [ ] Load balancing básico

### Tiempo Invertido
- Día 1: [X] horas
- Día 2: [X] horas
- ...
- Total: [X] horas

### Notas
- Aprendizaje clave 1
- Desafío encontrado
- Recurso útil encontrado
```

---

**¡Éxito en tu viaje de System Design! 🚀**

*Recuerda: El mejor momento para empezar fue ayer. El segundo mejor momento es ahora.*

**Próximo paso:** Diseña tu primer sistema (URL Shortener) y comparte tu diseño con la comunidad para recibir feedback.
