/**
 * ==========================================
 * ESTABLECER LÍMITES CON STAKEHOLDERS
 * ==========================================
 *
 * Establecer límites claros y profesionales es fundamental para
 * mantener productividad y evitar burnout. Este ejercicio demuestra
 * cómo decir "no" profesionalmente y establecer expectativas claras.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Límites claros: Definir qué sí y qué no está en tu scope
 * - Asertividad: Comunicar límites sin ser agresivo ni pasivo
 * - Alternativas: Ofrecer opciones en lugar de solo decir "no"
 * - Consistencia: Mantener límites de forma consistente
 *
 * 🏢 USO EN BIG TECH:
 * Apple, Netflix, Amazon priorizan límites saludables:
 * - Apple: "Deep Work" time blocks sin meetings
 * - Netflix: "No brilliant jerks" - respeto por tiempo ajeno
 * - Amazon: "No meeting Wednesdays" en algunos teams
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * Sin límites claros:
 * - Interrupciones constantes
 * - Trabajo fuera de horario
 * - Context switching excesivo
 * - Burnout y baja productividad
 * - Pérdida de respeto profesional
 *
 * ✅ BENEFICIOS:
 * - Mayor enfoque y productividad
 * - Mejor calidad de trabajo
 * - Respeto de stakeholders
 * - Balance vida-trabajo
 * - Menos estrés
 */

// ============================================
// ❌ SIN LÍMITES (PROBLEMÁTICO)
// ============================================

/**
 * Comportamiento sin límites - lleva a sobrecarga
 */
class NoBoundariesEngineer {
  private workQueue: string[] = [];

  // ❌ Acepta todo sin cuestionar
  acceptAllRequests(request: string): void {
    this.workQueue.push(request);
    console.log(`[NO BOUNDARIES] Accepted: ${request}`);
    console.log(
      `  ⚠️ Work queue now: ${this.workQueue.length} items (OVERLOADED!)`,
    );
  }

  // ❌ Disponible 24/7
  respondImmediately(message: string): void {
    console.log(`[NO BOUNDARIES] Responding at ${new Date().toISOString()}`);
    console.log(`  ⚠️ Even if it's 11pm on Saturday!`);
  }

  // ❌ No protege tiempo de deep work
  allowConstantInterruptions(): void {
    console.log("[NO BOUNDARIES] Sure, interrupt me anytime!");
    console.log("  ⚠️ Never completes complex tasks - constant context switching");
  }

  // ❌ No comunica capacidad
  neverSaysNo(): string {
    return "Sure, I'll add it to my list!";
    // Problem: No menciona que ya tiene 20 cosas en la lista
  }
}

/**
 * CONSECUENCIAS:
 * - Workload insostenible
 * - Calidad baja por apuro
 * - Burnout
 * - Stakeholders no respetan el tiempo
 * - Promesas incumplidas
 */

// ============================================
// ✅ CON LÍMITES (SALUDABLE)
// ============================================

/**
 * TÉCNICA 1: Framework de Evaluación de Requests
 */
interface WorkRequest {
  title: string;
  requester: string;
  urgency: "critical" | "high" | "medium" | "low";
  effort: "1h" | "4h" | "1d" | "1w" | "1m";
  businessValue: "critical" | "high" | "medium" | "low";
  deadline?: Date;
}

class RequestEvaluator {
  /**
   * Evalúa si el request debe ser aceptado basado en criterio
   */
  evaluate(request: WorkRequest, currentCapacity: number): EvaluationResult {
    const score = this.calculateScore(request);
    const canAccept = currentCapacity > 0;

    return {
      accept: canAccept && score >= 7,
      score,
      reasoning: this.getReasoningMessage(request, score, canAccept),
      alternatives: canAccept ? [] : this.suggestAlternatives(request),
    };
  }

  private calculateScore(request: WorkRequest): number {
    let score = 0;

    // Score por urgencia
    const urgencyPoints = {
      critical: 5,
      high: 3,
      medium: 2,
      low: 1,
    };
    score += urgencyPoints[request.urgency];

    // Score por business value
    const valuePoints = {
      critical: 5,
      high: 3,
      medium: 2,
      low: 1,
    };
    score += valuePoints[request.businessValue];

    return score;
  }

  private getReasoningMessage(
    request: WorkRequest,
    score: number,
    canAccept: boolean,
  ): string {
    if (!canAccept) {
      return "At capacity - cannot take new work without trade-offs";
    }

    if (score >= 7) {
      return "High priority - aligns with business goals";
    }

    return "Low priority - should be scheduled for future sprint";
  }

  private suggestAlternatives(request: WorkRequest): string[] {
    return [
      "Schedule for next sprint",
      "Reduce scope for immediate delivery",
      "Delegate to another team member",
      "De-prioritize existing lower-priority work",
    ];
  }
}

interface EvaluationResult {
  accept: boolean;
  score: number;
  reasoning: string;
  alternatives: string[];
}

/**
 * TÉCNICA 2: Templates para Decir "No" Profesionalmente
 */
class ProfessionalNoResponse {
  /**
   * Template 1: No con explicación y alternativa
   */
  static respondWithAlternative(
    request: WorkRequest,
    reason: string,
    alternative: string,
  ): string {
    return `
Hi ${request.requester},

Thank you for reaching out about "${request.title}".

Unfortunately, I can't take this on right now because ${reason}.

However, I can offer the following alternative:
${alternative}

Would this work for your timeline?

Best regards
    `.trim();
  }

  /**
   * Template 2: No temporal con timeline claro
   */
  static respondWithTimeline(
    request: WorkRequest,
    currentCommitments: string[],
    availableDate: Date,
  ): string {
    return `
Hi ${request.requester},

I'd like to help with "${request.title}", but I'm currently committed to:
${currentCommitments.map((c, i) => `${i + 1}. ${c}`).join("\n")}

I'll have capacity starting ${availableDate.toLocaleDateString()}.

Options:
A) Schedule for ${availableDate.toLocaleDateString()}
B) Find another owner for immediate delivery
C) Reduce scope to fit in current sprint

Which would you prefer?
    `.trim();
  }

  /**
   * Template 3: No con redirect a persona apropiada
   */
  static respondWithRedirect(
    request: WorkRequest,
    appropriateOwner: string,
    reason: string,
  ): string {
    return `
Hi ${request.requester},

"${request.title}" is outside my area because ${reason}.

${appropriateOwner} would be the right person for this.
I've CC'd them on this thread.

${appropriateOwner}, can you help ${request.requester} with this?
    `.trim();
  }

  /**
   * Template 4: No con propuesta de trade-off
   */
  static respondWithTradeoff(
    request: WorkRequest,
    currentWork: string[],
  ): string {
    return `
Hi ${request.requester},

I can take on "${request.title}", but it will impact my current commitments:

CURRENT WORK:
${currentWork.map((w, i) => `${i + 1}. ${w}`).join("\n")}

TO ACCOMMODATE THIS:
We'd need to:
- Delay [current task X] by [N days], OR
- Reduce scope of [current task Y], OR
- Get additional resources

Please confirm which trade-off works best, and I'll adjust my priorities.
    `.trim();
  }
}

/**
 * TÉCNICA 3: Establecer Office Hours y Deep Work Blocks
 */
class WorkSchedule {
  private deepWorkBlocks: TimeBlock[] = [];
  private officeHours: TimeBlock[] = [];
  private unavailable: TimeBlock[] = [];

  constructor() {
    this.setupDefaultSchedule();
  }

  private setupDefaultSchedule(): void {
    // Deep work (no interruptions)
    this.deepWorkBlocks = [
      { day: "Monday", start: "9:00", end: "12:00", purpose: "Deep Work" },
      { day: "Wednesday", start: "9:00", end: "12:00", purpose: "Deep Work" },
      { day: "Friday", start: "9:00", end: "12:00", purpose: "Deep Work" },
    ];

    // Office hours (open for questions)
    this.officeHours = [
      {
        day: "Tuesday",
        start: "14:00",
        end: "16:00",
        purpose: "Office Hours - Q&A",
      },
      {
        day: "Thursday",
        start: "14:00",
        end: "16:00",
        purpose: "Office Hours - Q&A",
      },
    ];

    // Lunch / breaks
    this.unavailable = [
      { day: "Every day", start: "12:00", end: "13:00", purpose: "Lunch" },
    ];
  }

  getScheduleDescription(): string {
    return `
🗓️ MY WORK SCHEDULE:

⏰ DEEP WORK (Please don't interrupt - async communication only):
${this.deepWorkBlocks.map((b) => `  ${b.day} ${b.start}-${b.end}`).join("\n")}

💬 OFFICE HOURS (Available for questions/discussions):
${this.officeHours.map((b) => `  ${b.day} ${b.start}-${b.end}`).join("\n")}

🚫 UNAVAILABLE:
${this.unavailable.map((b) => `  ${b.day} ${b.start}-${b.end}`).join("\n")}

📧 For urgent issues outside these hours:
  - Ping me on Slack with [URGENT] prefix
  - I respond to emergencies within 1 hour
  - Non-urgent messages: responded within 24 hours

🔗 Book time with me: [calendly-link]
    `.trim();
  }

  isAvailableNow(day: string, time: string): {
    available: boolean;
    reason?: string;
    suggestion?: string;
  } {
    // Check if it's deep work time
    const isDeepWork = this.deepWorkBlocks.some(
      (block) => block.day === day && this.isWithinTimeRange(time, block),
    );

    if (isDeepWork) {
      return {
        available: false,
        reason: "Currently in deep work block",
        suggestion: this.getNextOfficeHours(day),
      };
    }

    // Check if unavailable
    const isUnavailable = this.unavailable.some((block) =>
      this.isWithinTimeRange(time, block),
    );

    if (isUnavailable) {
      return {
        available: false,
        reason: "Currently unavailable (lunch/break)",
        suggestion: "Please reach out after 13:00",
      };
    }

    return { available: true };
  }

  private isWithinTimeRange(time: string, block: TimeBlock): boolean {
    // Simplified time comparison
    return time >= block.start && time <= block.end;
  }

  private getNextOfficeHours(currentDay: string): string {
    const nextOfficeHour = this.officeHours[0];
    return `Next office hours: ${nextOfficeHour.day} ${nextOfficeHour.start}-${nextOfficeHour.end}`;
  }
}

interface TimeBlock {
  day: string;
  start: string;
  end: string;
  purpose: string;
}

/**
 * TÉCNICA 4: Email/Slack Auto-Responder durante Focus Time
 */
class FocusTimeResponder {
  static getAutoResponderMessage(returnTime: string): string {
    return `
🎯 FOCUS MODE

I'm currently in deep work mode and not monitoring messages.

⏰ I'll respond to non-urgent messages by: ${returnTime}

🚨 For urgent issues:
  - Production down: Page on-call engineer
  - Blocking your work: Use [URGENT] prefix, I'll check within 1 hour
  - General questions: Post in #engineering-help channel

📚 Resources while you wait:
  - Wiki: [link]
  - FAQ: [link]
  - Runbooks: [link]
    `.trim();
  }

  static getOOOMessage(returnDate: string, backup: string): string {
    return `
🏖️ OUT OF OFFICE

I'm out until ${returnDate} with limited access to email.

For urgent matters:
  📞 Contact: ${backup}
  📧 Email: ${backup}@company.com

For non-urgent items:
  I'll respond when I return on ${returnDate}

Thank you for your patience!
    `.trim();
  }
}

/**
 * TÉCNICA 5: Matriz de Decisión para Interrupciones
 */
class InterruptionDecisionMatrix {
  /**
   * Decide si interrumpir o esperar basado en criterio
   */
  shouldInterrupt(interruption: Interruption): InterruptionDecision {
    // Critical + Time-sensitive = Interrupt immediately
    if (
      interruption.severity === "critical" &&
      interruption.timeSensitive === true
    ) {
      return {
        shouldInterrupt: true,
        responseTime: "immediate",
        reason: "Critical and time-sensitive issue",
      };
    }

    // Production down = Always interrupt
    if (interruption.type === "production-down") {
      return {
        shouldInterrupt: true,
        responseTime: "immediate",
        reason: "Production outage",
      };
    }

    // Security issue = Always interrupt
    if (interruption.type === "security-issue") {
      return {
        shouldInterrupt: true,
        responseTime: "immediate",
        reason: "Security vulnerability",
      };
    }

    // High severity but not time-sensitive = Office hours
    if (interruption.severity === "high") {
      return {
        shouldInterrupt: false,
        responseTime: "within-4h",
        reason: "High priority but can wait for office hours",
      };
    }

    // Everything else = Async
    return {
      shouldInterrupt: false,
      responseTime: "within-24h",
      reason: "Non-urgent, will handle async",
    };
  }
}

interface Interruption {
  type:
    | "production-down"
    | "security-issue"
    | "bug-report"
    | "question"
    | "feature-request";
  severity: "critical" | "high" | "medium" | "low";
  timeSensitive: boolean;
}

interface InterruptionDecision {
  shouldInterrupt: boolean;
  responseTime: "immediate" | "within-1h" | "within-4h" | "within-24h";
  reason: string;
}

// ============================================
// DEMOSTRACIÓN
// ============================================

console.log("=".repeat(60));
console.log("🎯 ESTABLECER LÍMITES CON STAKEHOLDERS");
console.log("=".repeat(60));

console.log("\n❌ SIN LÍMITES:");
const noBoundaries = new NoBoundariesEngineer();
noBoundaries.acceptAllRequests("Urgent feature from PM");
noBoundaries.acceptAllRequests("Bug fix from QA");
noBoundaries.acceptAllRequests("Help colleague with issue");
noBoundaries.acceptAllRequests("Refactoring task");
noBoundaries.acceptAllRequests("New feature request");

console.log("\n✅ CON LÍMITES:");

// Ejemplo 1: Evaluar request
const evaluator = new RequestEvaluator();
const request: WorkRequest = {
  title: "Add export to CSV feature",
  requester: "Sarah (PM)",
  urgency: "medium",
  effort: "1w",
  businessValue: "low",
  deadline: new Date("2024-12-01"),
};

const evaluation = evaluator.evaluate(request, 0); // 0 = at capacity
console.log("\n📊 Request Evaluation:");
console.log(`  Request: ${request.title}`);
console.log(`  Score: ${evaluation.score}/10`);
console.log(`  Accept: ${evaluation.accept}`);
console.log(`  Reasoning: ${evaluation.reasoning}`);
console.log("  Alternatives:");
evaluation.alternatives.forEach((alt) => console.log(`    - ${alt}`));

// Ejemplo 2: Response templates
console.log("\n" + "=".repeat(60));
console.log("📧 EJEMPLO: Decir 'No' con Timeline");
console.log("=".repeat(60));

const responseWithTimeline = ProfessionalNoResponse.respondWithTimeline(
  request,
  [
    "Payment integration (critical) - Due Nov 20",
    "Security audit fixes (high) - Due Nov 18",
    "Performance optimization (high) - Due Nov 22",
  ],
  new Date("2024-11-25"),
);

console.log(responseWithTimeline);

// Ejemplo 3: Schedule
console.log("\n" + "=".repeat(60));
console.log("📅 EJEMPLO: Work Schedule con Límites");
console.log("=".repeat(60));

const schedule = new WorkSchedule();
console.log(schedule.getScheduleDescription());

// Ejemplo 4: Availability check
console.log("\n" + "=".repeat(60));
console.log("🔍 EJEMPLO: Checking Availability");
console.log("=".repeat(60));

const mondayMorning = schedule.isAvailableNow("Monday", "10:00");
console.log("\nMonday 10:00 AM:");
console.log(`  Available: ${mondayMorning.available}`);
if (!mondayMorning.available) {
  console.log(`  Reason: ${mondayMorning.reason}`);
  console.log(`  Suggestion: ${mondayMorning.suggestion}`);
}

// Ejemplo 5: Interruption decision
console.log("\n" + "=".repeat(60));
console.log("⚡ EJEMPLO: Interruption Decision Matrix");
console.log("=".repeat(60));

const decisionMatrix = new InterruptionDecisionMatrix();

const interruptions: Interruption[] = [
  {
    type: "production-down",
    severity: "critical",
    timeSensitive: true,
  },
  { type: "bug-report", severity: "high", timeSensitive: false },
  { type: "question", severity: "low", timeSensitive: false },
];

interruptions.forEach((int) => {
  const decision = decisionMatrix.shouldInterrupt(int);
  console.log(`\n${int.type} (${int.severity}):`);
  console.log(`  Interrupt? ${decision.shouldInterrupt}`);
  console.log(`  Response time: ${decision.responseTime}`);
  console.log(`  Reason: ${decision.reason}`);
});

// ============================================
// MEJORES PRÁCTICAS
// ============================================

console.log("\n" + "=".repeat(60));
console.log("💡 MEJORES PRÁCTICAS PARA ESTABLECER LÍMITES");
console.log("=".repeat(60));

/**
 * ✅ DO's:
 *
 * 1. SER PROACTIVO:
 *    Comunica tu schedule ANTES de que te interrumpan
 *    Pon en calendario tu "deep work" time
 *
 * 2. SER CONSISTENTE:
 *    Si dices "no meetings before 10am", mantén el límite
 *    Inconsistencia = stakeholders ignoran tus límites
 *
 * 3. OFRECER ALTERNATIVAS:
 *    ❌ "No puedo"
 *    ✅ "No puedo ahora, pero puedo el viernes a las 2pm"
 *
 * 4. EXPLICAR EL "POR QUÉ":
 *    "Necesito 2h de focus time para completar X (que es critical)"
 *
 * 5. SER PROFESIONAL:
 *    Límites ≠ ser grosero
 *    "Thanks for understanding my focus time" va mucho mejor
 *
 * 6. DOCUMENTAR TUS LÍMITES:
 *    Ponlos en:
 *    - Email signature
 *    - Slack status
 *    - Calendar
 *    - Team wiki
 *
 * 7. RESPETAR LÍMITES DE OTROS:
 *    Si quieres que respeten los tuyos, respeta los de ellos
 *
 * 8. HACER EXCEPCIONES CLARAS:
 *    Define qué es "truly urgent" que merece interrupción
 *
 * ❌ DON'Ts:
 *
 * 1. NO SEAS PASIVO-AGRESIVO:
 *    ❌ "Well, I GUESS I can do it" (resentfully)
 *    ✅ "I can't take this on, but here's an alternative"
 *
 * 2. NO DES EXCUSAS FALSAS:
 *    ❌ "I'm sick" (when you're not)
 *    ✅ "I'm at capacity with X, Y, Z"
 *
 * 3. NO SEAS INCONSISTENTE:
 *    Si aceptas interrupciones a veces, expect it siempre
 *
 * 4. NO IGNORES MENSAJES:
 *    ❌ Ghosting
 *    ✅ "Saw your message, will respond by EOD"
 *
 * 5. NO ESTABLEZCAS LÍMITES POCO REALISTAS:
 *    ❌ "Never contact me, only async"
 *    ✅ "Prefer async, but available for urgent issues"
 */

/**
 * 📋 SCRIPTS ÚTILES:
 */

const usefulScripts = {
  declineNewWork: `
    "I appreciate you thinking of me for this. Unfortunately, I'm at capacity with [current priority work].
    I can either take this on in [timeframe], or we can discuss de-prioritizing [existing work].
    Which would you prefer?"
  `,

  protectDeepWork: `
    "I have a focus block scheduled 9-12am. Can we discuss this at 2pm during my office hours?
    If it's urgent, please use [URGENT] prefix and I'll respond within 1 hour."
  `,

  pushBackScope: `
    "I understand this is important. To deliver quality work, I can either:
    A) Deliver [reduced scope] by [original deadline]
    B) Deliver [full scope] by [later deadline]
    Which aligns better with business needs?"
  `,

  redirectToAppropriateOwner: `
    "This is outside my area of expertise. [Person X] who owns [system Y] would be better suited.
    I've CC'd them. [Person X], can you help?"
  `,

  respondToAfterHoursMessage: `
    "I saw your message after hours. I'll respond tomorrow during work hours.
    If this is truly urgent, please page the on-call engineer at [oncall-number]."
  `,
};

console.log("\n📋 USEFUL SCRIPTS:");
Object.entries(usefulScripts).forEach(([situation, script]) => {
  console.log(`\n${situation}:`);
  console.log(script.trim());
});

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cómo estableces límites con tu manager vs con peers?
 *    Pista: Diferentes niveles de autoridad requieren diferentes approaches
 *
 * 2. ¿Cuándo es apropiado hacer excepciones a tus límites?
 *    Pista: Production emergencies, vs "everything is urgent"
 *
 * 3. ¿Cómo comunicas límites sin parecer "uncooperative"?
 *    Pista: Ofrecer alternativas, explicar el por qué
 *
 * 4. ¿Qué haces si stakeholders ignoran tus límites consistentemente?
 *    Pista: Escalate, document, involve manager
 *
 * 5. ¿Cómo balanceas "ser helpful" con "proteger tu tiempo"?
 *    Pista: Office hours, async help, documentation
 *
 * 6. ¿Deberías responder mensajes fuera de horario laboral?
 *    Pista: Depende de cultura de empresa, pero establecer expectativas
 *
 * 7. ¿Cómo manejas requests "urgent" que no son realmente urgent?
 *    Pista: Define criteria para urgencia, educar stakeholders
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Escribe tu work schedule con deep work blocks y office hours
 *    Compártelo con tu equipo
 *
 * 2. INTERMEDIO:
 *    Practica decir "no" a estos scenarios usando los templates:
 *    a) PM pide nueva feature cuando estás at capacity
 *    b) QA pide ayuda durante tu deep work block
 *    c) Colega pide code review urgente para algo no-urgent
 *
 * 3. AVANZADO:
 *    Crea tu Interruption Decision Matrix:
 *    - Define qué califica como "urgent"
 *    - Define response times por severity
 *    - Documenta exceptions
 *    - Comparte con stakeholders
 *
 * 4. EXPERTO:
 *    Audita tu última semana:
 *    - ¿Cuántas interrupciones tuviste?
 *    - ¿Cuántas fueron realmente urgent?
 *    - ¿Cuántas podrían haberse manejado async?
 *    - ¿Qué límites establecerías para reducir interrupciones?
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Practica establecer límites saludables!");
console.log("=".repeat(60));

export {
  WorkRequest,
  RequestEvaluator,
  EvaluationResult,
  ProfessionalNoResponse,
  WorkSchedule,
  TimeBlock,
  FocusTimeResponder,
  InterruptionDecisionMatrix,
  Interruption,
  InterruptionDecision,
};
