/**
 * ==========================================
 * COMUNICACIÓN EFECTIVA CON STAKEHOLDERS
 * ==========================================
 *
 * La comunicación efectiva es la base para interacciones productivas
 * con QA, Product Managers y Management. Este ejercicio demuestra
 * cómo comunicar de forma clara, concisa y profesional.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Claridad: Mensajes concisos y sin ambigüedades
 * - Contexto: Proporcionar información relevante
 * - Estructura: Organizar información de forma lógica
 * - Propósito: Cada comunicación debe tener un objetivo claro
 *
 * 🏢 USO EN BIG TECH:
 * Amazon, Google, Microsoft usan frameworks de comunicación:
 * - Amazon: 6-page narratives, PR/FAQ documents
 * - Google: OKRs, Design Docs, DACI framework
 * - Microsoft: One-pagers, Executive summaries
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * Comunicación inefectiva causa:
 * - Reuniones innecesarias y largas
 * - Malentendidos y retrabajo
 * - Frustración en el equipo
 * - Pérdida de tiempo y productividad
 * - Decisiones incorrectas
 *
 * ✅ BENEFICIOS:
 * - Menos interrupciones
 * - Decisiones más rápidas
 * - Mejor alineación del equipo
 * - Mayor respeto profesional
 */

// ============================================
// ❌ COMUNICACIÓN INEFECTIVA
// ============================================

interface BadCommunication {
  subject: string;
  message: string;
  issues: string[];
}

/**
 * EJEMPLO MALO: Email vago y sin estructura
 *
 * 💥 PROBLEMAS:
 * - No está claro qué se necesita
 * - Falta contexto
 * - Sin call to action
 * - Requiere múltiples follow-ups
 */
const badEmail: BadCommunication = {
  subject: "Question",
  message: `
    Hey,

    I have a question about the thing we talked about yesterday.
    Can you help?

    Thanks
  `,
  issues: [
    "Subject no descriptivo",
    "No especifica qué 'thing'",
    "No proporciona contexto",
    "No indica urgencia",
    "Requiere respuesta para clarificar",
  ],
};

/**
 * EJEMPLO MALO: Actualización de status sin estructura
 */
const badStatusUpdate = {
  message: `
    Working on stuff. Some blockers. Will update later.
  `,
  issues: [
    "No específico sobre qué 'stuff'",
    "No detalla los blockers",
    "No indica timeline",
    "No sugiere siguiente paso",
    "Genera más preguntas",
  ],
};

// ============================================
// ✅ COMUNICACIÓN EFECTIVA
// ============================================

/**
 * FRAMEWORK 1: BLUF (Bottom Line Up Front)
 *
 * Usado en Amazon y organizaciones militares
 * Concepto: Empieza con la conclusión/decisión
 */
interface BLUFCommunication {
  bluf: string; // Bottom line up front
  background: string; // Contexto necesario
  details: string; // Detalles adicionales
  action: string; // Qué se necesita
}

const goodEmailBLUF: BLUFCommunication = {
  bluf: "Necesito aprobación para cambiar el schema de la base de datos antes del viernes",
  background:
    "La feature de pagos recurrentes requiere 2 nuevas tablas en PostgreSQL",
  details: `
    Tablas propuestas:
    - subscription_plans (id, name, price, billing_cycle)
    - user_subscriptions (id, user_id, plan_id, status, start_date)

    Impacto: Zero downtime, backward compatible
    Link al schema: [doc-link]
  `,
  action:
    "Por favor revisar el schema y aprobar antes del viernes 3pm para cumplir el sprint deadline",
};

function formatBLUFEmail(comm: BLUFCommunication): string {
  return `
Subject: [ACTION REQUIRED] Schema Change Approval Needed by Friday

📌 BLUF: ${comm.bluf}

📋 BACKGROUND:
${comm.background}

🔍 DETAILS:
${comm.details}

✅ ACTION REQUIRED:
${comm.action}
  `.trim();
}

/**
 * FRAMEWORK 2: SBAR (Situation-Background-Assessment-Recommendation)
 *
 * Usado en healthcare y tech para comunicación crítica
 */
interface SBARCommunication {
  situation: string; // Qué está pasando ahora
  background: string; // Contexto relevante
  assessment: string; // Tu análisis
  recommendation: string; // Qué sugieres
}

const productionIssueSBAR: SBARCommunication = {
  situation: "Production API está retornando 500 errors al 15% de requests",
  background: `
    - Empezó hace 30 minutos (2:30pm)
    - Afecta endpoint /api/payments/process
    - ~500 usuarios impactados
    - Dashboard: [link]
  `,
  assessment: `
    Análisis inicial:
    - Database connections pool está exhausted
    - Logs muestran timeout después de 30s
    - Coincide con deploy a las 2:00pm
    - Probable cause: Migration script no optimizada
  `,
  recommendation: `
    IMMEDIATE: Rollback deploy (ETA 5 min)
    SHORT-TERM: Aumentar connection pool temporalmente
    LONG-TERM: Review migration script performance

    Necesito aprobación para rollback inmediato.
  `,
};

function formatSBARAlert(comm: SBARCommunication): string {
  return `
Subject: 🚨 URGENT: Production API Issues - Rollback Needed

🔴 SITUATION:
${comm.situation}

📋 BACKGROUND:
${comm.background}

🔍 ASSESSMENT:
${comm.assessment}

💡 RECOMMENDATION:
${comm.recommendation}
  `.trim();
}

/**
 * FRAMEWORK 3: 5W1H (Who, What, When, Where, Why, How)
 *
 * Framework de periodismo adaptado a tech
 */
interface FiveW1H {
  who: string; // Quién está involucrado
  what: string; // Qué se necesita hacer
  when: string; // Timeline/deadline
  where: string; // Dónde aplica (sistema, ambiente)
  why: string; // Por qué es necesario
  how: string; // Cómo se implementará
}

const featureRequestFiveW1H: FiveW1H = {
  who: "QA Team (Sarah, Mike) + Backend Team (me)",
  what: "Implementar feature flags para canary deployments",
  when: `
    - Design doc: Nov 20
    - Implementation: Nov 27
    - QA Testing: Dec 1
    - Production: Dec 4
  `,
  where: "Production environment, Backend API",
  why: `
    Reasons:
    1. Reduce risk of breaking changes
    2. Enable gradual rollouts (5% → 25% → 100%)
    3. Faster rollback without redeployment
    4. QA can test in production safely
  `,
  how: `
    Approach:
    1. Use LaunchDarkly for feature flag management
    2. Implement flags at controller level
    3. Add metrics for flag evaluations
    4. Document flag lifecycle in wiki
  `,
};

function formatFiveW1H(info: FiveW1H): string {
  return `
Subject: [PROPOSAL] Feature Flags Implementation Plan

👥 WHO: ${info.who}

📦 WHAT: ${info.what}

⏰ WHEN:
${info.when}

📍 WHERE: ${info.where}

❓ WHY:
${info.why}

🔧 HOW:
${info.how}
  `.trim();
}

/**
 * FRAMEWORK 4: STAR (Situation-Task-Action-Result)
 *
 * Para status updates y retrospectivas
 */
interface STARUpdate {
  situation: string;
  task: string;
  action: string;
  result: string;
}

const sprintRetrospectiveSTAR: STARUpdate = {
  situation: "Sprint 23 completado - Payment integration feature",
  task: `
    Planned:
    - Integrate Stripe API
    - Implement webhook handlers
    - Add transaction logging
    - 13 story points total
  `,
  action: `
    Completed:
    ✅ Stripe API integration (5 pts)
    ✅ Webhook handlers (3 pts)
    ✅ Transaction logging (3 pts)
    ⏸️ Refund flow (2 pts) - moved to next sprint

    Unplanned work:
    - Fixed critical bug in previous payment flow (1 day)
    - Added extra error handling per QA feedback (0.5 day)
  `,
  result: `
    Results:
    - 11/13 points completed (85%)
    - 0 production bugs
    - QA found 2 minor issues (fixed same sprint)
    - Refund flow blocked by legal review (not engineering)

    Next sprint:
    - Complete refund flow (2 pts)
    - Add payment analytics dashboard (5 pts)
  `,
};

// ============================================
// TEMPLATES PRÁCTICOS
// ============================================

/**
 * Template 1: Bug Report para QA
 */
class BugReport {
  constructor(
    public title: string,
    public severity: "critical" | "high" | "medium" | "low",
    public environment: "production" | "staging" | "development",
    public stepsToReproduce: string[],
    public expected: string,
    public actual: string,
    public impact: string,
    public logs?: string,
    public screenshots?: string[],
  ) {}

  format(): string {
    return `
Subject: [${this.severity.toUpperCase()}] ${this.title}

🔴 SEVERITY: ${this.severity}
🌍 ENVIRONMENT: ${this.environment}

📝 STEPS TO REPRODUCE:
${this.stepsToReproduce.map((step, i) => `${i + 1}. ${step}`).join("\n")}

✅ EXPECTED BEHAVIOR:
${this.expected}

❌ ACTUAL BEHAVIOR:
${this.actual}

💥 IMPACT:
${this.impact}

${this.logs ? `📋 LOGS:\n${this.logs}\n` : ""}
${this.screenshots ? `📸 SCREENSHOTS:\n${this.screenshots.join("\n")}\n` : ""}
    `.trim();
  }
}

/**
 * Template 2: Daily Standup Update
 */
class StandupUpdate {
  constructor(
    public yesterday: string[],
    public today: string[],
    public blockers: { description: string; needsHelp: boolean }[],
  ) {}

  format(): string {
    const blockersText = this.blockers.length
      ? this.blockers
          .map((b) =>
            b.needsHelp
              ? `  🚫 ${b.description} [NEED HELP]`
              : `  ⚠️ ${b.description}`,
          )
          .join("\n")
      : "  ✅ None";

    return `
📅 YESTERDAY:
${this.yesterday.map((item) => `  ✅ ${item}`).join("\n")}

📅 TODAY:
${this.today.map((item) => `  🎯 ${item}`).join("\n")}

🚧 BLOCKERS:
${blockersText}
    `.trim();
  }
}

/**
 * Template 3: Technical Design Doc Summary
 */
interface DesignDocSummary {
  problem: string;
  proposedSolution: string;
  alternatives: string[];
  tradeoffs: { pro: string; con: string }[];
  timeline: string;
  risks: string[];
  openQuestions: string[];
}

function formatDesignDocSummary(doc: DesignDocSummary): string {
  return `
🎯 PROBLEM:
${doc.problem}

💡 PROPOSED SOLUTION:
${doc.proposedSolution}

🔀 ALTERNATIVES CONSIDERED:
${doc.alternatives.map((alt, i) => `${i + 1}. ${alt}`).join("\n")}

⚖️ TRADEOFFS:
${doc.tradeoffs.map((t, i) => `${i + 1}. ✅ Pro: ${t.pro}\n   ❌ Con: ${t.con}`).join("\n")}

⏰ TIMELINE:
${doc.timeline}

⚠️ RISKS:
${doc.risks.map((risk, i) => `${i + 1}. ${risk}`).join("\n")}

❓ OPEN QUESTIONS:
${doc.openQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}
  `.trim();
}

// ============================================
// DEMOSTRACIÓN: Comparación
// ============================================

console.log("=".repeat(60));
console.log("🎯 COMUNICACIÓN EFECTIVA CON STAKEHOLDERS");
console.log("=".repeat(60));

console.log("\n❌ COMUNICACIÓN INEFECTIVA:");
console.log(badEmail.message);
console.log("\nProblemas:");
badEmail.issues.forEach((issue) => console.log(`  - ${issue}`));

console.log("\n✅ COMUNICACIÓN EFECTIVA (BLUF):");
console.log(formatBLUFEmail(goodEmailBLUF));

console.log("\n" + "=".repeat(60));
console.log("🚨 EJEMPLO: Comunicación de Crisis (SBAR)");
console.log("=".repeat(60));
console.log(formatSBARAlert(productionIssueSBAR));

console.log("\n" + "=".repeat(60));
console.log("📋 EJEMPLO: Propuesta de Feature (5W1H)");
console.log("=".repeat(60));
console.log(formatFiveW1H(featureRequestFiveW1H));

console.log("\n" + "=".repeat(60));
console.log("🐛 EJEMPLO: Bug Report para QA");
console.log("=".repeat(60));

const bugReport = new BugReport(
  "Payment processing fails for amounts over $1000",
  "high",
  "production",
  [
    "Go to /checkout page",
    'Enter payment amount "$1500"',
    "Enter valid card details",
    'Click "Pay Now" button',
    "Observe error message",
  ],
  "Payment should process successfully and show confirmation",
  'Error message: "Payment failed: amount exceeds limit"',
  "Blocks all high-value transactions. ~20 customers affected per day",
  "Error log: PaymentService.ts:142 - AmountLimitExceeded",
  ["screenshot-error.png", "screenshot-network-tab.png"],
);

console.log(bugReport.format());

console.log("\n" + "=".repeat(60));
console.log("📅 EJEMPLO: Daily Standup Update");
console.log("=".repeat(60));

const standup = new StandupUpdate(
  ["Completed payment API integration", "Fixed 3 bugs from QA"],
  [
    "Implement webhook retry logic",
    "Write tests for edge cases",
    "Review QA's new test findings",
  ],
  [
    {
      description: "Waiting for API key from Product team",
      needsHelp: true,
    },
    {
      description: "Test environment unstable since morning",
      needsHelp: false,
    },
  ],
);

console.log(standup.format());

// ============================================
// MEJORES PRÁCTICAS
// ============================================

console.log("\n" + "=".repeat(60));
console.log("💡 MEJORES PRÁCTICAS DE COMUNICACIÓN");
console.log("=".repeat(60));

/**
 * ✅ DO's:
 *
 * 1. SER ESPECÍFICO:
 *    ❌ "The API is slow"
 *    ✅ "GET /api/users endpoint taking 5s (expected: <500ms)"
 *
 * 2. PROPORCIONAR CONTEXTO:
 *    ❌ "Need help with bug"
 *    ✅ "Bug in payment flow - blocking 20% of transactions since 2pm deploy"
 *
 * 3. INCLUIR CALL TO ACTION:
 *    ❌ "Here's the status"
 *    ✅ "Status attached. Please approve approach A or B by EOD Friday"
 *
 * 4. USAR ESTRUCTURA:
 *    ❌ Wall of text sin formato
 *    ✅ Bullets, headers, secciones claras
 *
 * 5. ANTICIPAR PREGUNTAS:
 *    Responde: What? Why? When? Who? How?
 *
 * 6. SER CONCISO:
 *    ❌ 3 paragraphs to say "yes"
 *    ✅ "Yes, approved. Will implement by Friday."
 *
 * 7. USAR FORMATO VISUAL:
 *    - Emojis para escaneo rápido (📌 🔴 ✅ ❌)
 *    - Bold para highlights
 *    - Bullets para listas
 *
 * 8. INCLUIR LINKS:
 *    No describir lo que está en doc, solo linkear
 *
 * ❌ DON'Ts:
 *
 * 1. NO SEAS VAGO:
 *    ❌ "Soon", "Later", "Some issues"
 *    ✅ "Friday 3pm", "2 bugs: X and Y"
 *
 * 2. NO ASUMAS CONTEXTO:
 *    No todos tienen el contexto que tú tienes
 *
 * 3. NO USES JARGON INNECESARIO:
 *    Explica acrónimos la primera vez
 *
 * 4. NO ENTIERRES EL PUNTO PRINCIPAL:
 *    Pon lo importante primero (BLUF)
 *
 * 5. NO ENVÍES SIN PROPÓSITO:
 *    Cada comunicación debe tener objetivo claro
 */

// ============================================
// CASOS DE USO ESPECÍFICOS
// ============================================

/**
 * 💼 COMUNICACIÓN CON QA:
 *
 * CUANDO:
 * - Reportar que feature está lista para testing
 * - Responder a bug reports
 * - Solicitar clarificación en test cases
 *
 * TIPS:
 * - Proporciona test credentials/data
 * - Documenta edge cases conocidos
 * - Indica qué NO cambió (para regression)
 * - Sé específico sobre el scope
 *
 * EJEMPLO:
 * Subject: [READY FOR QA] Payment Refunds Feature
 *
 * Feature ready for QA in staging environment.
 *
 * ✅ SCOPE:
 * - Full refunds for completed payments
 * - Partial refunds (min $1)
 * - Refund status tracking
 *
 * ⚠️ OUT OF SCOPE (future sprint):
 * - Scheduled refunds
 * - Bulk refunds
 *
 * 🔐 TEST ACCOUNTS:
 * - Admin: qa-admin@test.com / TestPass123
 * - User: qa-user@test.com / TestPass123
 *
 * 💳 TEST CARDS:
 * - Success: 4242 4242 4242 4242
 * - Decline: 4000 0000 0000 0002
 *
 * 📋 TEST CASES:
 * Link: [confluence-link]
 *
 * 📅 NEED FEEDBACK BY: Nov 22 (sprint ends Nov 24)
 */

/**
 * 💼 COMUNICACIÓN CON PM:
 *
 * CUANDO:
 * - Status updates
 * - Scope changes
 * - Blockers que impactan timeline
 * - Trade-off decisions
 *
 * TIPS:
 * - Focus en business impact
 * - Proporciona opciones, no solo problemas
 * - Sé claro sobre timeline implications
 * - Usa términos de negocio, no solo técnicos
 *
 * EJEMPLO:
 * Subject: [SCOPE CHANGE] Search Feature - Performance vs Timeline
 *
 * 📌 SITUATION:
 * Search feature 80% complete but performance testing shows issues.
 *
 * 🔍 ISSUE:
 * Current implementation searches 1M+ products in 3-5s
 * Target: <500ms (per PRD)
 *
 * 💡 OPTIONS:
 *
 * Option A: Elasticsearch integration
 * - Pros: Meets <500ms target, scalable to 10M+ products
 * - Cons: +2 weeks development, +$500/month infrastructure
 *
 * Option B: Database optimization + caching
 * - Pros: Ready in 3 days, no extra cost
 * - Cons: Performance 1-2s (not <500ms), doesn't scale beyond 2M products
 *
 * Option C: Ship basic search now, Elasticsearch in Q2
 * - Pros: Launch on time, iterate based on usage
 * - Cons: Suboptimal UX initially
 *
 * ❓ RECOMMENDATION:
 * Option C - Launch basic, measure adoption, invest in Elasticsearch if needed
 *
 * ⏰ NEED DECISION BY: Tomorrow EOD (to stay on sprint timeline)
 */

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuándo usar BLUF vs SBAR vs 5W1H?
 *    Pista: BLUF para decisiones, SBAR para urgencias, 5W1H para propuestas
 *
 * 2. ¿Cómo balancear "ser conciso" con "dar contexto suficiente"?
 *    Pista: BLUF first, then progressive disclosure
 *
 * 3. ¿Email vs Slack vs Meeting para diferentes tipos de comunicación?
 *    Pista: Urgencia, complejidad, número de stakeholders
 *
 * 4. ¿Cómo comunicar malas noticias (delays, bugs críticos)?
 *    Pista: SBAR + opciones + timeline claro
 *
 * 5. ¿Cómo adaptar comunicación para diferentes audiencias?
 *    Pista: CEO vs PM vs QA vs Engineering lead - diferentes prioridades
 *
 * 6. ¿Cuándo escribir doc extenso vs one-pager?
 *    Pista: Complejidad, stakeholders, decisión reversible vs irreversible
 *
 * 7. ¿Cómo medir si tu comunicación es efectiva?
 *    Pista: # de follow-ups, tiempo para decisión, claridad en feedback
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Convierte este mensaje vago en uno efectivo usando BLUF:
 *    "Hey, the thing isn't working. Can you check?"
 *
 * 2. INTERMEDIO:
 *    Escribe un bug report usando el template BugReport
 *    para un bug real que hayas encontrado
 *
 * 3. AVANZADO:
 *    Escribe un design doc summary (1 page) para una feature
 *    usando el formato DesignDocSummary
 *
 * 4. EXPERTO:
 *    Simula una crisis de producción y escribe:
 *    - Alerta inicial (SBAR)
 *    - Update cada 30 min
 *    - Post-mortem summary
 *    - Communication plan para stakeholders
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Practica comunicación clara y estructurada!");
console.log("=".repeat(60));

export {
  BLUFCommunication,
  SBARCommunication,
  FiveW1H,
  STARUpdate,
  BugReport,
  StandupUpdate,
  DesignDocSummary,
  formatBLUFEmail,
  formatSBARAlert,
  formatFiveW1H,
  formatDesignDocSummary,
};
