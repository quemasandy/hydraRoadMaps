/**
 * ==========================================
 * MANEJO DE INTERRUPCIONES
 * ==========================================
 *
 * Las interrupciones son inevitables al trabajar con QA y PM,
 * pero se pueden gestionar de forma que minimicen el impacto
 * en la productividad.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Context switching cost: 23 minutos promedio para recuperar focus
 * - Triage de interrupciones: No todas requieren atención inmediata
 * - Batch processing: Agrupar interrupciones similares
 * - Async-first: Preferir comunicación asíncrona cuando sea posible
 *
 * 🏢 USO EN BIG TECH:
 * - Meta: "Maker's schedule" vs "Manager's schedule"
 * - Basecamp: "Office hours" concept
 * - GitLab: "Async-first" culture
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * Interrupciones mal manejadas causan:
 * - Pérdida de 40-60% de productividad
 * - Errores por falta de concentración
 * - Frustración y burnout
 * - Trabajo fuera de horario para compensar
 */

// ============================================
// FRAMEWORK: Interrupt Triage System
// ============================================

type InterruptionUrgency = "immediate" | "same-day" | "this-week" | "backlog";

interface InterruptionRequest {
  from: string;
  subject: string;
  description: string;
  requestedResponseTime: string;
  channel: "slack" | "email" | "meeting" | "in-person";
}

class InterruptionTriageSystem {
  /**
   * Clasifica interrupciones según urgencia real (no percibida)
   */
  classify(interrupt: InterruptionRequest): {
    urgency: InterruptionUrgency;
    suggestedResponse: string;
    canDefer: boolean;
  } {
    // Keywords que indican urgencia real
    const criticalKeywords = [
      "production down",
      "security breach",
      "data loss",
      "customer can't access",
    ];

    const highKeywords = [
      "blocking",
      "can't deploy",
      "regression",
      "critical bug",
    ];

    const description = interrupt.description.toLowerCase();

    // Check for critical
    if (criticalKeywords.some((keyword) => description.includes(keyword))) {
      return {
        urgency: "immediate",
        suggestedResponse: "Drop everything, respond now",
        canDefer: false,
      };
    }

    // Check for high priority
    if (highKeywords.some((keyword) => description.includes(keyword))) {
      return {
        urgency: "same-day",
        suggestedResponse: "Respond within 2-4 hours",
        canDefer: true,
      };
    }

    // Check channel (in-person often perceived as urgent, but may not be)
    if (interrupt.channel === "in-person") {
      return {
        urgency: "same-day",
        suggestedResponse:
          "Acknowledge immediately, schedule time to discuss details",
        canDefer: true,
      };
    }

    // Everything else
    return {
      urgency: "this-week",
      suggestedResponse: "Batch with similar requests, respond within 24h",
      canDefer: true,
    };
  }

  /**
   * Genera respuesta apropiada para interrupciones que se pueden diferir
   */
  generateDeferralResponse(
    interrupt: InterruptionRequest,
    urgency: InterruptionUrgency,
  ): string {
    const responseTemplates = {
      "same-day": `
Hi ${interrupt.from},

Thanks for reaching out about "${interrupt.subject}".

I'm currently in deep work mode. I'll get back to you by end of day.

If this is blocking your work, please mark as [BLOCKING] and I'll prioritize.
      `.trim(),

      "this-week": `
Hi ${interrupt.from},

Noted "${interrupt.subject}". I'll review and respond within 24 hours.

If urgent, please clarify:
- What's blocking?
- What's the deadline?
- What's the business impact?
      `.trim(),

      backlog: `
Hi ${interrupt.from},

Added "${interrupt.subject}" to my backlog.

Current priorities are [X, Y, Z]. I can address this in [timeframe].

If timeline doesn't work, let's discuss priority trade-offs.
      `.trim(),
    };

    return responseTemplates[urgency];
  }
}

// ============================================
// TÉCNICA: Interruption Log
// ============================================

interface InterruptionLog {
  timestamp: Date;
  source: string;
  type: "bug-report" | "question" | "review-request" | "meeting" | "other";
  wasUrgent: boolean;
  timeToResolve: number; // minutes
  couldHaveBeenAsync: boolean;
}

class InterruptionAnalyzer {
  private logs: InterruptionLog[] = [];

  logInterruption(log: InterruptionLog): void {
    this.logs.push(log);
  }

  getWeeklyReport(): {
    totalInterruptions: number;
    trueUrgent: number;
    couldBeAsync: number;
    totalTimeLost: number;
    topInterrupters: Map<string, number>;
  } {
    const trueUrgent = this.logs.filter((l) => l.wasUrgent).length;
    const couldBeAsync = this.logs.filter((l) => l.couldHaveBeenAsync).length;
    const totalTimeLost = this.logs.reduce(
      (sum, l) => sum + l.timeToResolve,
      0,
    );

    const interrupterCounts = new Map<string, number>();
    this.logs.forEach((log) => {
      const count = interrupterCounts.get(log.source) || 0;
      interrupterCounts.set(log.source, count + 1);
    });

    return {
      totalInterruptions: this.logs.length,
      trueUrgent,
      couldBeAsync,
      totalTimeLost,
      topInterrupters: interrupterCounts,
    };
  }

  generateInsights(): string[] {
    const report = this.getWeeklyReport();
    const insights: string[] = [];

    // Insight 1: Urgency ratio
    const urgencyRatio = (report.trueUrgent / report.totalInterruptions) * 100;
    if (urgencyRatio < 20) {
      insights.push(
        `⚠️ Only ${urgencyRatio.toFixed(0)}% of interruptions were truly urgent. Consider educating stakeholders on urgency criteria.`,
      );
    }

    // Insight 2: Async potential
    const asyncRatio = (report.couldBeAsync / report.totalInterruptions) * 100;
    if (asyncRatio > 50) {
      insights.push(
        `📧 ${asyncRatio.toFixed(0)}% of interruptions could have been async. Consider office hours or async-first policy.`,
      );
    }

    // Insight 3: Time lost
    const hoursLost = report.totalTimeLost / 60;
    if (hoursLost > 10) {
      insights.push(
        `⏰ Lost ${hoursLost.toFixed(1)} hours this week to interruptions. Consider batching or delegation.`,
      );
    }

    // Insight 4: Top interrupters
    const topInterrupter = Array.from(report.topInterrupters.entries()).sort(
      (a, b) => b[1] - a[1],
    )[0];
    if (topInterrupter && topInterrupter[1] > 5) {
      insights.push(
        `👤 ${topInterrupter[0]} interrupted ${topInterrupter[1]} times. Consider 1:1 to align on communication preferences.`,
      );
    }

    return insights;
  }
}

// ============================================
// TÉCNICA: Batching Interruptions
// ============================================

class InterruptionBatcher {
  private queue: Map<string, InterruptionRequest[]> = new Map();

  /**
   * Agrupa interrupciones por tipo para procesarlas juntas
   */
  addToQueue(category: string, interrupt: InterruptionRequest): void {
    const existing = this.queue.get(category) || [];
    existing.push(interrupt);
    this.queue.set(category, existing);
  }

  /**
   * Procesa todas las interrupciones de una categoría juntas
   */
  processBatch(category: string): string {
    const items = this.queue.get(category) || [];

    if (items.length === 0) {
      return "No items in queue";
    }

    const response = `
Processed ${category} batch (${items.length} items):

${items.map((item, i) => `${i + 1}. ${item.subject} (from ${item.from})`).join("\n")}

All responses sent. Queue cleared.
    `.trim();

    this.queue.delete(category);
    return response;
  }

  getBatchSchedule(): string {
    return `
📋 BATCH PROCESSING SCHEDULE:

🐛 Bug Reports: Process at 11am and 4pm
❓ Questions: Office hours (Tue/Thu 2-4pm)
👀 Code Reviews: 3pm daily
📧 Email: 10am, 2pm, 5pm
💬 Slack: Check every 2 hours

⚠️ EXCEPTIONS (immediate response):
- Production down
- Security issues
- Customer-facing bugs
- Deployment blockers
    `.trim();
  }
}

// ============================================
// TÉCNICA: Protected Time Blocks
// ============================================

class ProtectedTimeManager {
  /**
   * Comunica protected time a stakeholders
   */
  static getProtectedTimeAnnouncement(): string {
    return `
🎯 PROTECTED DEEP WORK TIME

To maintain productivity, I'm implementing protected focus blocks:

🚫 NO INTERRUPTIONS:
  Monday, Wednesday, Friday: 9am-12pm

✅ DURING THIS TIME:
  - I won't respond to Slack/email
  - My status will show "Focus mode"
  - Non-urgent messages will be queued
  - I'll batch-respond after 12pm

🚨 EXCEPTIONS (will respond immediately):
  - Production outages
  - Security incidents
  - Messages marked [URGENT] with clear business impact

💬 NEED TO REACH ME?
  - Use office hours: Tue/Thu 2-4pm
  - Schedule via calendar: [link]
  - True emergencies: Ping with [URGENT] prefix

📊 WHY?
  Deep work requires 2-3 hour uninterrupted blocks.
  This helps me deliver higher quality work faster.

Thank you for understanding! 🙏
    `.trim();
  }

  /**
   * Auto-responder durante protected time
   */
  static getAutoResponse(blockEnds: string): string {
    return `
🎯 In focus mode until ${blockEnds}

Your message has been queued. I'll respond after ${blockEnds}.

🚨 Urgent? Use [URGENT] prefix and explain:
  - What's blocking?
  - Business impact?
  - Why can't wait until ${blockEnds}?

Otherwise, I'll get back to you soon!
    `.trim();
  }
}

// ============================================
// DEMOSTRACIÓN
// ============================================

console.log("=".repeat(60));
console.log("🎯 MANEJO DE INTERRUPCIONES");
console.log("=".repeat(60));

// Ejemplo 1: Triage
const triage = new InterruptionTriageSystem();

const interrupts: InterruptionRequest[] = [
  {
    from: "Sarah (QA)",
    subject: "Question about test case",
    description: "Hi, I have a question about how to test edge case X",
    requestedResponseTime: "ASAP",
    channel: "slack",
  },
  {
    from: "Mike (PM)",
    subject: "Production issue",
    description: "Production down - customers can't access payment page",
    requestedResponseTime: "Immediate",
    channel: "slack",
  },
  {
    from: "Jane (Dev)",
    subject: "Code review",
    description: "Can you review my PR for the new feature?",
    requestedResponseTime: "Today",
    channel: "email",
  },
];

console.log("\n📊 INTERRUPT TRIAGE:");
interrupts.forEach((int) => {
  const classification = triage.classify(int);
  console.log(`\n"${int.subject}" from ${int.from}:`);
  console.log(`  Urgency: ${classification.urgency}`);
  console.log(`  Action: ${classification.suggestedResponse}`);
  console.log(`  Can defer: ${classification.canDefer}`);

  if (classification.canDefer) {
    console.log("\n  Suggested response:");
    console.log(
      "  " + triage.generateDeferralResponse(int, classification.urgency),
    );
  }
});

// Ejemplo 2: Interruption Analysis
console.log("\n" + "=".repeat(60));
console.log("📈 INTERRUPTION ANALYSIS");
console.log("=".repeat(60));

const analyzer = new InterruptionAnalyzer();

// Simular semana de logs
analyzer.logInterruption({
  timestamp: new Date(),
  source: "QA Team",
  type: "bug-report",
  wasUrgent: false,
  timeToResolve: 15,
  couldHaveBeenAsync: true,
});

analyzer.logInterruption({
  timestamp: new Date(),
  source: "PM",
  type: "meeting",
  wasUrgent: false,
  timeToResolve: 30,
  couldHaveBeenAsync: true,
});

analyzer.logInterruption({
  timestamp: new Date(),
  source: "On-call",
  type: "bug-report",
  wasUrgent: true,
  timeToResolve: 120,
  couldHaveBeenAsync: false,
});

const insights = analyzer.generateInsights();
console.log("\nInsights:");
insights.forEach((insight) => console.log(`  ${insight}`));

// Ejemplo 3: Batching
console.log("\n" + "=".repeat(60));
console.log("📦 BATCH PROCESSING");
console.log("=".repeat(60));

const batcher = new InterruptionBatcher();
console.log(batcher.getBatchSchedule());

// Ejemplo 4: Protected Time
console.log("\n" + "=".repeat(60));
console.log("🛡️ PROTECTED TIME ANNOUNCEMENT");
console.log("=".repeat(60));

console.log(ProtectedTimeManager.getProtectedTimeAnnouncement());

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Gestiona interrupciones proactivamente!");
console.log("=".repeat(60));

export {
  InterruptionTriageSystem,
  InterruptionAnalyzer,
  InterruptionBatcher,
  ProtectedTimeManager,
  InterruptionRequest,
  InterruptionLog,
};
