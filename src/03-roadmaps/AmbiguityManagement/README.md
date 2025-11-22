# 🎯 Roadmap de Aprendizaje: Gestión de la Ambigüedad en Requisitos

## 📚 Tabla de Contenidos
- [Nivel 1: Fundamentos de Análisis de Requisitos](#nivel-1-fundamentos-de-análisis-de-requisitos)
- [Nivel 2: Técnicas de Interrogación](#nivel-2-técnicas-de-interrogación)
- [Nivel 3: Documentación y Especificaciones Técnicas](#nivel-3-documentación-y-especificaciones-técnicas)
- [Nivel 4: Gestión de Stakeholders](#nivel-4-gestión-de-stakeholders)
- [Nivel 5: Validación y Refinamiento](#nivel-5-validación-y-refinamiento)
- [Nivel 6: Casos Avanzados y Situaciones Complejas](#nivel-6-casos-avanzados-y-situaciones-complejas)
- [Recursos y Práctica](#recursos-y-práctica)

---

## Nivel 1: Fundamentos de Análisis de Requisitos

### 1.1 Entendiendo la Ambigüedad
**Tiempo estimado: 1-2 semanas**

- [ ] **¿Qué es la Ambigüedad en Requisitos?**
  - Definición y tipos de ambigüedad
  - Ambigüedad léxica (palabras múltiples significados)
  - Ambigüedad sintáctica (estructura de la oración)
  - Ambigüedad semántica (interpretación del significado)
  - Ambigüedad pragmática (contexto y suposiciones)
  - Costo de la ambigüedad en proyectos
  - Ejercicio: Identificar ambigüedad en requisitos reales

- [ ] **Causas Comunes de Requisitos Vagos**
  - Falta de experiencia técnica del stakeholder
  - Suposiciones implícitas no declaradas
  - Conocimiento del dominio no compartido
  - Comunicación asíncrona y malentendidos
  - Presión de tiempo en la recolección
  - Miedo a parecer ignorante (no hacer preguntas)
  - Ejercicio: Analizar proyectos fallidos por ambigüedad

- [ ] **El Costo de No Gestionar la Ambigüedad**
  - Retrabajos y refactorizaciones costosas
  - Features incorrectas o innecesarias
  - Conflictos con stakeholders
  - Deadlines incumplidos
  - Deuda técnica acumulada
  - ROI del tiempo invertido en clarificación
  - Ejercicio: Calcular costo de ambigüedad en un proyecto

### 1.2 Principios Fundamentales
**Tiempo estimado: 1-2 semanas**

- [ ] **Escucha Activa**
  - Técnicas de escucha profunda
  - Parafrasear para confirmar entendimiento
  - Lenguaje corporal y señales no verbales
  - Tomar notas estructuradas
  - Evitar interrupciones prematuras
  - Ejercicio: Role-playing de escucha activa

- [ ] **Mentalidad de Curiosidad**
  - Cultivar curiosidad genuina
  - Suspender juicios prematuros
  - Asumir que no sabemos todo
  - Hacer preguntas "tontas" sin miedo
  - Buscar el "porqué" detrás del "qué"
  - Ejercicio: Técnica de los "5 porqués"

- [ ] **Pensamiento Crítico**
  - Cuestionar suposiciones propias y ajenas
  - Identificar inconsistencias lógicas
  - Detectar missing information
  - Separar hechos de opiniones
  - Reconocer sesgos cognitivos
  - Ejercicio: Análisis crítico de un PRD

### 1.3 Frameworks de Requisitos
**Tiempo estimado: 1 semana**

- [ ] **User Stories (Agile)**
  - Formato: Como [rol], quiero [acción], para [beneficio]
  - Criterios INVEST (Independent, Negotiable, etc.)
  - Acceptance Criteria
  - Definition of Done
  - Ejercicio: Convertir requisitos vagos a User Stories

- [ ] **Use Cases (UML)**
  - Actores y escenarios
  - Flujo principal y alternativos
  - Precondiciones y postcondiciones
  - Ejercicio: Crear use case diagram

- [ ] **Job Stories (JTBD - Jobs To Be Done)**
  - Formato: Cuando [situación], quiero [motivación], para [resultado]
  - Enfoque en contexto y motivación
  - Ejercicio: Traducir user stories a job stories

---

## Nivel 2: Técnicas de Interrogación

### 2.1 Tipos de Preguntas Poderosas
**Tiempo estimado: 2-3 semanas**

- [ ] **Preguntas Abiertas vs Cerradas**
  - Cuándo usar cada tipo
  - Ventajas y desventajas
  - Ejercicio: Transformar preguntas cerradas en abiertas

- [ ] **Las 5 W's y 1 H**
  - What (Qué): ¿Qué problema resuelve?
  - Why (Por qué): ¿Por qué es importante?
  - Who (Quién): ¿Quién lo usará?
  - When (Cuándo): ¿Cuándo se necesita?
  - Where (Dónde): ¿Dónde se usará?
  - How (Cómo): ¿Cómo debería funcionar?
  - Ejercicio: Aplicar 5W1H a un requisito vago

- [ ] **Técnica STAR (Situation, Task, Action, Result)**
  - Obtener ejemplos concretos
  - Entender el contexto completo
  - Ejercicio: Entrevistar stakeholder con STAR

- [ ] **Ladder of Inference (Escalera de Inferencia)**
  - Descubrir suposiciones ocultas
  - Bajar de abstracciones a datos observables
  - Ejercicio: Desconstruir un requisito abstracto

### 2.2 Técnicas de Sondeo Profundo
**Tiempo estimado: 2-3 semanas**

- [ ] **Los 5 Porqués (5 Whys)**
  - Llegar a la raíz del problema
  - Evitar soluciones superficiales
  - Cuándo detenerse
  - Ejercicio: Aplicar 5 Whys a feature request

- [ ] **Refinamiento por Contraejemplos**
  - "¿Qué NO debería hacer el sistema?"
  - Definir límites y exclusiones
  - Edge cases y escenarios negativos
  - Ejercicio: Definir scope por contraejemplos

- [ ] **Escenarios de Ejemplo Concretos**
  - Example Mapping
  - Dado-Cuando-Entonces (Given-When-Then)
  - Ejemplos positivos y negativos
  - Ejercicio: Crear Example Map para una feature

- [ ] **Técnica de la Bola de Nieve**
  - Partir de lo conocido
  - Expandir gradualmente
  - Descubrir casos relacionados
  - Ejercicio: Mapear funcionalidad relacionada

### 2.3 Desambiguación de Términos
**Tiempo estimado: 2 semanas**

- [ ] **Glosario de Dominio (Ubiquitous Language)**
  - Crear diccionario compartido
  - Definir términos técnicos del negocio
  - Mantener consistencia terminológica
  - Ejercicio: Crear glosario para un dominio

- [ ] **Definiciones Operacionales**
  - Convertir conceptos vagos en medibles
  - "¿Cómo sabremos que se cumplió?"
  - Criterios cuantificables
  - Ejercicio: Definir "rápido", "fácil", "muchos"

- [ ] **Sinónimos y Homónimos**
  - Identificar palabras que significan lo mismo
  - Detectar palabras iguales con diferentes significados
  - Estandarizar vocabulario
  - Ejercicio: Unificar terminología en requisitos

### 2.4 Modelado Visual
**Tiempo estimado: 2 semanas**

- [ ] **Diagramas de Flujo**
  - Mapear procesos de negocio
  - Identificar puntos de decisión
  - Visualizar caminos alternativos
  - Ejercicio: Crear flowchart de proceso complejo

- [ ] **Wireframes y Mockups**
  - "Muéstrame cómo lo imaginas"
  - Prototipos rápidos en papel
  - Herramientas: Figma, Balsamiq, Excalidraw
  - Ejercicio: Wireframe de feature ambigua

- [ ] **Diagramas de Contexto**
  - Sistemas externos e integraciones
  - Flujo de datos
  - Actores y relaciones
  - Ejercicio: C4 Model - Context Diagram

- [ ] **Mapas Mentales**
  - Brainstorming estructurado
  - Relaciones entre conceptos
  - Ejercicio: Mind map de requisitos

---

## Nivel 3: Documentación y Especificaciones Técnicas

### 3.1 Especificaciones Claras
**Tiempo estimado: 2-3 semanas**

- [ ] **Características de Buenos Requisitos**
  - SMART: Specific, Measurable, Achievable, Relevant, Time-bound
  - Completos y autoconsistentes
  - Verificables y testeables
  - Trazables
  - Ejercicio: Evaluar requisitos con SMART

- [ ] **Estructura de Especificación Técnica**
  - Contexto y objetivos
  - Requisitos funcionales
  - Requisitos no funcionales
  - Restricciones y suposiciones
  - Casos de uso
  - Criterios de aceptación
  - Ejercicio: Escribir especificación completa

- [ ] **Requisitos No Funcionales (NFRs)**
  - Performance (latencia, throughput)
  - Escalabilidad
  - Seguridad
  - Usabilidad
  - Mantenibilidad
  - Compatibilidad
  - Ejercicio: Extraer NFRs implícitos

### 3.2 Documentación Técnica
**Tiempo estimado: 2-3 semanas**

- [ ] **Architecture Decision Records (ADRs)**
  - Documentar decisiones técnicas
  - Contexto, decisión, consecuencias
  - Ejercicio: Escribir ADR para decisión de arquitectura

- [ ] **RFCs (Request for Comments)**
  - Propuestas de diseño colaborativas
  - Estructura de RFC
  - Proceso de revisión
  - Ejercicio: Crear RFC para feature compleja

- [ ] **API Contracts y Schemas**
  - OpenAPI/Swagger specs
  - JSON Schema
  - GraphQL schemas
  - Contract-first development
  - Ejercicio: Definir API contract

- [ ] **Data Models y ER Diagrams**
  - Entidades y relaciones
  - Atributos y tipos
  - Constraints y reglas
  - Ejercicio: Modelar base de datos

### 3.3 Gestión de Requisitos Cambiantes
**Tiempo estimado: 2 semanas**

- [ ] **Versionado de Requisitos**
  - Tracking de cambios
  - Git para documentación
  - Change logs
  - Ejercicio: Sistema de versionado

- [ ] **Impact Analysis**
  - Evaluar impacto de cambios
  - Dependencias y afectaciones
  - Ejercicio: Análisis de impacto

- [ ] **Change Management Process**
  - Solicitud de cambios
  - Evaluación y aprobación
  - Comunicación de cambios
  - Ejercicio: Definir proceso de cambios

---

## Nivel 4: Gestión de Stakeholders

### 4.1 Identificación de Stakeholders
**Tiempo estimado: 2-3 semanas**

- [ ] **Mapeo de Stakeholders**
  - Identificar todos los interesados
  - Clasificación por poder e interés
  - Stakeholder matrix
  - Ejercicio: Crear stakeholder map

- [ ] **Roles y Responsabilidades**
  - Product Owner vs Business Analyst
  - Technical Lead vs Architect
  - End Users vs Decision Makers
  - Subject Matter Experts (SMEs)
  - Ejercicio: Matriz RACI

- [ ] **Expectativas y Motivaciones**
  - ¿Qué quiere cada stakeholder?
  - Conflictos de intereses
  - Alineación de objetivos
  - Ejercicio: Análisis de motivaciones

### 4.2 Facilitación de Reuniones
**Tiempo estimado: 2-3 semanas**

- [ ] **Preparation y Agenda**
  - Objetivos claros de la reunión
  - Pre-work y materiales
  - Timeboxing
  - Ejercicio: Crear agenda efectiva

- [ ] **Técnicas de Facilitación**
  - Mantener enfoque
  - Manejar dominadores y silenciosos
  - Tomar decisiones grupales
  - Ejercicio: Role-playing facilitación

- [ ] **Workshops de Requisitos**
  - Event Storming
  - User Story Mapping
  - Design Sprints
  - Ejercicio: Planear workshop

- [ ] **Manejo de Conflictos**
  - Requisitos contradictorios
  - Priorización en desacuerdo
  - Técnicas de negociación
  - Ejercicio: Resolver conflicto de requisitos

### 4.3 Comunicación Efectiva
**Tiempo estimado: 2 semanas**

- [ ] **Adaptación de Lenguaje**
  - Técnico vs no técnico
  - Usar metáforas y analogías
  - Evitar jerga innecesaria
  - Ejercicio: Explicar concepto técnico

- [ ] **Presentación de Hallazgos**
  - Storytelling con datos
  - Visualizaciones efectivas
  - Executive summaries
  - Ejercicio: Presentar análisis de requisitos

- [ ] **Feedback Loops**
  - Demostrar entendimiento temprano
  - Prototipos rápidos
  - Iteración continua
  - Ejercicio: Ciclo de feedback

---

## Nivel 5: Validación y Refinamiento

### 5.1 Técnicas de Validación
**Tiempo estimado: 2-3 semanas**

- [ ] **Revisiones por Pares**
  - Code review de especificaciones
  - Checklist de revisión
  - Ejercicio: Revisar especificación

- [ ] **Walkthroughs con Stakeholders**
  - Recorrer especificaciones
  - Confirmar entendimiento
  - Ejercicio: Planear walkthrough

- [ ] **Prototipos y MVPs**
  - Build to learn
  - Spike solutions
  - Proof of concepts
  - Ejercicio: Crear prototipo validación

- [ ] **Acceptance Test-Driven Development (ATDD)**
  - Escribir tests antes de implementar
  - Colaboración dev-QA-business
  - Ejemplos ejecutables
  - Ejercicio: Escribir acceptance tests

### 5.2 Refinamiento Iterativo
**Tiempo estimado: 2-3 semanas**

- [ ] **Backlog Refinement/Grooming**
  - Preparar historias para sprint
  - Descomponer epics
  - Estimar complejidad
  - Ejercicio: Sesión de refinement

- [ ] **Spike Stories**
  - Investigación técnica
  - Reducir incertidumbre
  - Time-boxed research
  - Ejercicio: Definir spike

- [ ] **Three Amigos Sessions**
  - Dev + QA + Business
  - Conversación antes de implementar
  - Descubrir edge cases
  - Ejercicio: Simular Three Amigos

### 5.3 Métricas y Calidad
**Tiempo estimado: 2 semanas**

- [ ] **Métricas de Calidad de Requisitos**
  - Completitud
  - Consistencia
  - Claridad
  - Verificabilidad
  - Ejercicio: Scorecard de calidad

- [ ] **Definition of Ready**
  - Cuándo un requisito está listo
  - Checklist de aceptación
  - Ejercicio: Crear DoR para equipo

- [ ] **Traceability Matrix**
  - Mapeo requisitos → diseño → código → tests
  - Coverage de requisitos
  - Ejercicio: Crear matriz trazabilidad

---

## Nivel 6: Casos Avanzados y Situaciones Complejas

### 6.1 Manejo de Ambigüedad Extrema
**Tiempo estimado: 3-4 semanas**

- [ ] **Requisitos "Build Me a Website"**
  - Starting from zero context
  - Técnica de discovery
  - Ejercicio: Caso extremo de ambigüedad

- [ ] **Innovación sin Precedentes**
  - "Algo que no existe aún"
  - Exploración de posibilidades
  - Design Thinking
  - Ejercicio: Requisitos de producto innovador

- [ ] **Dominios Altamente Regulados**
  - Compliance y requisitos legales
  - Interpretación de regulaciones
  - Subject Matter Experts
  - Ejercicio: Analizar requisito de compliance

- [ ] **Sistemas Legacy Sin Documentación**
  - Reverse engineering de requisitos
  - Entrevistas con usuarios antiguos
  - Observación y shadowing
  - Ejercicio: Documentar sistema legacy

### 6.2 Técnicas Avanzadas de Elicitación
**Tiempo estimado: 3-4 semanas**

- [ ] **Observation y Ethnographic Studies**
  - Shadowing de usuarios
  - Contextual inquiry
  - Ejercicio: Estudio etnográfico

- [ ] **Análisis Competitivo**
  - Feature comparison
  - Benchmarking
  - Ejercicio: Análisis competidores

- [ ] **Data-Driven Requirements**
  - Analytics y métricas
  - A/B testing insights
  - User behavior data
  - Ejercicio: Requisitos desde datos

- [ ] **AI-Assisted Requirement Analysis**
  - NLP para analizar requisitos
  - Detección automática de ambigüedad
  - Sugerencias de clarificación
  - Ejercicio: Usar AI para análisis

### 6.3 Gestión de Incertidumbre
**Tiempo estimado: 2-3 semanas**

- [ ] **Risk-Driven Requirements**
  - Identificar riesgos técnicos
  - Mitigación en requisitos
  - Ejercicio: Risk analysis

- [ ] **Set-Based Design**
  - Mantener opciones abiertas
  - Convergir gradualmente
  - Last Responsible Moment
  - Ejercicio: Set-based approach

- [ ] **Hypothesis-Driven Development**
  - Formular hipótesis
  - Experimentos para validar
  - Aprendizaje continuo
  - Ejercicio: Crear hipótesis de feature

### 6.4 Habilidades Complementarias
**Tiempo estimado: 2-3 semanas**

- [ ] **Domain-Driven Design (DDD)**
  - Bounded Contexts
  - Ubiquitous Language avanzado
  - Event Storming
  - Ejercicio: Event Storming session

- [ ] **Business Model Canvas**
  - Entender el negocio completo
  - Alinear requisitos con valor
  - Ejercicio: Crear Business Model Canvas

- [ ] **Value Stream Mapping**
  - Identificar desperdicio
  - Optimizar flujo de valor
  - Ejercicio: Map value stream

### 6.5 Proyecto Final Integrador
**Tiempo estimado: 6-8 semanas**

- [ ] **Caso Completo End-to-End**

**Escenario: "Cliente con Idea Vaga de SaaS"**

**Situación inicial:**
- Cliente dice: "Quiero una plataforma para gestionar proyectos, pero mejor que las existentes"
- Sin especificaciones claras
- Múltiples stakeholders
- Presupuesto limitado
- Timeline agresivo

**Deliverables del proyecto:**
1. **Discovery completo** (Semanas 1-2)
   - Entrevistas con stakeholders
   - Análisis competitivo
   - User research y personas
   - Problem statement clarificado

2. **Especificación técnica** (Semanas 3-4)
   - User stories priorizadas
   - Use cases detallados
   - API contracts
   - Data model
   - Architecture decision records
   - NFRs clarificados

3. **Prototipos y validación** (Semanas 5-6)
   - Wireframes y mockups
   - Prototype funcional (MVP)
   - User testing
   - Refinamiento basado en feedback

4. **Documentación final** (Semanas 7-8)
   - Technical design document
   - Implementation roadmap
   - Test plan
   - Risk analysis
   - Stakeholder sign-off

**Habilidades aplicadas:**
- Todas las técnicas de interrogación
- Manejo de stakeholders conflictivos
- Priorización bajo restricciones
- Comunicación técnica y no técnica
- Gestión de scope creep
- Validación iterativa
- Documentación comprehensiva

---

## 📖 Recursos y Práctica

### Libros Recomendados
1. **"Software Requirements"** - Karl Wiegers & Joy Beatty
2. **"User Story Mapping"** - Jeff Patton
3. **"The Art of Asking Great Questions"** - Warren Berger
4. **"Discover to Deliver"** - Ellen Gottesdiener & Mary Gorman
5. **"Impact Mapping"** - Gojko Adzic
6. **"Specification by Example"** - Gojko Adzic
7. **"Domain-Driven Design"** - Eric Evans
8. **"The Mom Test"** - Rob Fitzpatrick

### Recursos Online
- [IIBA (International Institute of Business Analysis)](https://www.iiba.org/)
- [BABOK (Business Analysis Body of Knowledge)](https://www.iiba.org/babok/)
- [Requirements Engineering Conference Papers](https://requirements-engineering.org/)
- [Mind the Product](https://www.mindtheproduct.com/) - Product management blog
- [Martin Fowler's Blog](https://martinfowler.com/) - Software design
- [C4 Model](https://c4model.com/) - Software architecture diagrams

### Herramientas Recomendadas
- **Documentación**: Notion, Confluence, Google Docs
- **Wireframing**: Figma, Balsamiq, Excalidraw
- **Diagramas**: Miro, Mural, Draw.io, PlantUML
- **Gestión de Requisitos**: Jira, Azure DevOps, Linear
- **Colaboración**: Zoom, Miro, FigJam
- **API Design**: Swagger/OpenAPI, Postman
- **Prototipos**: Figma, Framer, InVision

### Práctica Recomendada

#### Ejercicios Diarios (15-30 min)
- Leer un requisito y hacer 10 preguntas de clarificación
- Identificar ambigüedad en tickets de Jira reales
- Practicar los 5 Whys con situaciones cotidianas
- Escribir 3 user stories de una feature

#### Ejercicios Semanales (2-4 horas)
- Entrevistar a un stakeholder (puede ser colega)
- Crear especificación técnica completa de una feature
- Revisar requisitos de proyectos open source
- Facilitar una sesión de refinement

#### Proyectos Mensuales (8-16 horas)
- Proyectos integradores al final de cada nivel
- Analizar un proyecto fallido y sus requisitos
- Contribuir a documentación de proyectos open source
- Crear case study de análisis de requisitos

### Sistema de Evaluación

#### Por cada técnica:
- [ ] Entender cuándo y por qué usarla
- [ ] Practicar en situación simulada
- [ ] Aplicar en proyecto real
- [ ] Identificar limitaciones y alternativas
- [ ] Enseñar a otros la técnica
- [ ] Adaptar a contextos diferentes

#### Criterios de Dominio:
- **Básico**: Puedes aplicar técnicas con guía
- **Intermedio**: Puedes seleccionar técnica apropiada
- **Avanzado**: Puedes combinar técnicas y adaptarlas
- **Experto**: Puedes entrenar a otros y manejar casos extremos

---

## 🎯 Plan de Estudio Sugerido

### Opción Intensiva (3-4 meses)
- 20-30 horas/semana
- Enfoque full-time en aprendizaje
- Completar todos los niveles secuencialmente
- Aplicar inmediatamente en trabajo

### Opción Moderada (6-8 meses)
- 10-15 horas/semana
- Balance con trabajo
- Profundizar en cada técnica
- Práctica sostenida con proyectos reales

### Opción Pausada (10-12 meses)
- 5-10 horas/semana
- Aprendizaje sostenible
- Máxima retención y reflexión
- Enfoque en maestría sobre velocidad

---

## 🚀 Consejos para el Éxito

1. **Practica la escucha más que el habla** - Escucha 80%, habla 20%
2. **No hay preguntas tontas** - La curiosidad es tu superpoder
3. **Documenta todo** - La memoria falla, la documentación no
4. **Valida temprano y seguido** - No esperes a tener todo "perfecto"
5. **Usa ejemplos concretos** - Evita abstracciones sin ejemplos
6. **Dibuja siempre** - Una imagen vale más que 1000 palabras
7. **Confirma entendimiento** - Parafrasea y verifica
8. **Acepta la incertidumbre** - Es normal no saber todo al inicio
9. **Gestiona expectativas** - Comunica limitaciones y suposiciones
10. **Itera constantemente** - Los requisitos evolucionan, y eso está bien
11. **Construye relaciones** - La confianza facilita la comunicación
12. **Sé empático** - Entiende la perspectiva del stakeholder
13. **Prioriza sin piedad** - No todo es urgente e importante
14. **Desafía con respeto** - Cuestiona sin confrontar
15. **Aprende el dominio** - Invierte tiempo en entender el negocio

---

## 📝 Tracking de Progreso

### Formato de Registro

Para cada técnica completada, registra:
```
Técnica: [Nombre]
Fecha: [DD/MM/YYYY]
Tiempo invertido: [X horas]
Contexto de aplicación: [Proyecto/Situación]
Nivel de comprensión: [Básico/Intermedio/Avanzado/Experto]
Efectividad: [Alta/Media/Baja]
Lecciones aprendidas: [Insights, adaptaciones, errores]
Próximos pasos: [Cómo mejorar]
```

### Milestones

- [ ] **Mes 1**: Fundamentos - Identificar ambigüedad y hacer preguntas básicas
- [ ] **Mes 2**: Técnicas de interrogación - Aplicar 5W1H y 5 Whys efectivamente
- [ ] **Mes 3**: Documentación - Escribir especificaciones claras
- [ ] **Mes 4**: Stakeholders - Facilitar reuniones productivas
- [ ] **Mes 5**: Validación - Implementar loops de feedback
- [ ] **Mes 6**: Refinamiento - Iterar requisitos con confianza
- [ ] **Mes 7-8**: Casos avanzados - Manejar ambigüedad extrema
- [ ] **Mes 9-12**: Proyecto final y maestría consolidada

---

## 🎓 Próximos Pasos

1. **Auto-evaluación inicial**
   - ¿Cuál es tu rol actual? (Dev, BA, PM, etc.)
   - ¿Qué tan seguido trabajas con requisitos?
   - ¿Cuál es tu mayor desafío con requisitos vagos?

2. **Selecciona tu plan de estudio**
   - Intensivo/Moderado/Pausado
   - Define horarios semanales
   - Bloquea tiempo en calendario

3. **Prepara tu entorno de aprendizaje**
   - Crea repositorio de documentación
   - Configura herramientas (Notion, Miro, etc.)
   - Identifica proyectos para practicar

4. **Encuentra accountability partner**
   - Colega con mismo interés
   - Mentor en la organización
   - Comunidad online

5. **Comienza con Nivel 1**
   - No saltes niveles
   - Practica cada técnica antes de avanzar
   - Documenta tus aprendizajes

6. **Aplica inmediatamente**
   - No esperes a "saber todo"
   - Usa en tu trabajo diario
   - Empieza con técnicas simples

7. **Comparte tu progreso**
   - Blog posts internos
   - Lunch & learns
   - Retrospectivas de técnicas

---

## 🏆 Señales de Maestría

Sabrás que has dominado la gestión de ambigüedad cuando:

✅ **En reuniones:**
- Haces preguntas que otros no pensaron
- Identificas suposiciones ocultas rápidamente
- Llegas al fondo de requisitos vagos en minutos

✅ **En documentación:**
- Tus especificaciones rara vez tienen preguntas
- Los devs entienden qué construir sin ir y venir
- Los stakeholders confían en tu interpretación

✅ **En proyectos:**
- Reduces retrabajos por malentendidos
- Anticipas edge cases antes de implementar
- Tus estimaciones son más precisas

✅ **En el equipo:**
- Te buscan para clarificar requisitos complejos
- Facilitas conversaciones productivas
- Entrenas a otros en técnicas de elicitación

✅ **En tu mindset:**
- No te frustras con la ambigüedad, la disfrutas
- Ves la ambigüedad como oportunidad, no problema
- Tienes confianza para desafiar requisitos vagos

---

## 💡 Casos de Estudio

### Caso 1: "Quiero un Dashboard"
**Requisito vago:** "Necesitamos un dashboard para ver métricas"

**Aplicando técnicas:**
- 5W1H: ¿Qué métricas? ¿Para quién? ¿Para qué decisiones?
- Ejemplos concretos: "Muéstrame un reporte que usas hoy"
- Contraejemplos: "¿Qué NO debe mostrar el dashboard?"

**Resultado claro:**
- Dashboard de ventas para gerentes de área
- Métricas: Revenue, Conversión, CAC, LTV
- Actualización: Tiempo real
- Filtros: Región, Producto, Período
- Alertas: Cuando conversión < 2%

### Caso 2: "Que sea Rápido"
**Requisito vago:** "El sistema debe ser rápido"

**Aplicando técnicas:**
- Definición operacional: "¿Cuánto es rápido en segundos?"
- Escenarios: "¿Qué operación debe ser rápida?"
- Datos: "¿Cuál es la velocidad actual y objetivo?"

**Resultado claro:**
- Búsqueda de productos: < 200ms p95
- Checkout: < 1s p95
- Login: < 500ms p95
- Bajo carga: 1000 usuarios concurrentes

### Caso 3: "Como Uber pero para X"
**Requisito vago:** "Quiero una app como Uber pero para préstamos de libros"

**Aplicando técnicas:**
- Analogía deconstruída: "¿Qué de Uber específicamente?"
- Job to be done: "¿Qué problema resuelve?"
- Diferencias: "¿Qué NO debe ser como Uber?"

**Resultado claro:**
- Matching de lectores con libros cercanos
- Geolocalización de libros disponibles
- Sistema de ratings de prestamistas
- NO monetización de transacciones
- NO tracking en tiempo real

---

## 🔥 Ejercicios Prácticos por Nivel

### Nivel 1: Fundamentos
1. Analiza 10 tickets de Jira y marca ambigüedades
2. Lee un PRD y lista todas las suposiciones implícitas
3. Practica escucha activa en 3 reuniones esta semana

### Nivel 2: Interrogación
1. Aplica 5W1H a 5 requisitos diferentes
2. Haz los 5 Whys a una feature request real
3. Crea Example Map de una user story compleja

### Nivel 3: Documentación
1. Escribe especificación técnica de una feature en tu backlog
2. Crea ADR para una decisión técnica reciente
3. Define 10 NFRs para un sistema que conoces

### Nivel 4: Stakeholders
1. Mapea stakeholders de tu proyecto actual
2. Facilita una sesión de refinement
3. Resuelve un conflicto de requisitos

### Nivel 5: Validación
1. Escribe acceptance criteria para 5 user stories
2. Crea un prototipo para validar un requisito
3. Haz una sesión de Three Amigos

### Nivel 6: Avanzado
1. Analiza un proyecto fallido por mala gestión de requisitos
2. Documenta un sistema legacy sin documentación
3. Ejecuta el proyecto final integrador completo

---

**¡Buena suerte en tu viaje hacia la maestría en Gestión de la Ambigüedad!** 🎯

*Recuerda: La habilidad más valiosa no es tener todas las respuestas, sino hacer las preguntas correctas. La claridad no es un punto de partida, es el resultado de un proceso disciplinado de interrogación, documentación y validación.*

**Pro tip**: Mantén un "question bank" - una colección de preguntas poderosas que funcionan en diferentes contextos. Con el tiempo, desarrollarás intuición para saber qué preguntar cuándo.

---

## 📞 Comunidad y Soporte

- **Stack Overflow**: Etiqueta [requirements-engineering]
- **Reddit**: r/businessanalysis, r/agile
- **LinkedIn Groups**: Business Analysis, Product Management
- **Slack Communities**: Mind the Product, Product School
- **Conferences**: RE Conf, Agile Alliance, ProductCon

---

## 📜 Licencia y Contribuciones

Este roadmap es parte del proyecto de Design Patterns en TypeScript.
Contribuciones bienvenidas via pull requests.

---

**Versión:** 1.0
**Última actualización:** 2025-01-17
**Autor:** Andy (quemasandy/design-patterns-typescript)
