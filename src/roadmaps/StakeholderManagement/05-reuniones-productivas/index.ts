/**
 * ==========================================
 * REUNIONES PRODUCTIVAS CON STAKEHOLDERS
 * ==========================================
 *
 * Las reuniones son caras (costo = tiempo × # personas).
 * Este ejercicio demuestra cómo hacer reuniones breves,
 * productivas y evitar reuniones innecesarias.
 *
 * 📚 CONCEPTOS CLAVE:
 * - "No meeting" por defecto: Email/async first
 * - Agenda clara: Todo meeting debe tener propósito definido
 * - Timebox: Meetings se expanden al tiempo disponible
 * - Action items: Todo meeting termina con next steps
 *
 * 🏢 USO EN BIG TECH:
 * - Amazon: No powerpoints, 6-page narratives leídos en silencio
 * - Shopify: "No meeting Wednesdays"
 * - Facebook: 25/50 min meetings (no 30/60)
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * Meetings mal manejados:
 * - Consumen 40-60% del tiempo de trabajo
 * - Usualmente improductivos (sin agenda, sin decisions)
 * - Interrumpen deep work
 * - Fatiga mental (Zoom fatigue)
 */

// ============================================
// FRAMEWORK: Meeting Decision Tree
// ============================================

interface MeetingRequest {
  purpose: string;
  attendees: string[];
  estimatedDuration: number; // minutes
  hasAgenda: boolean;
  requiresDecision: boolean;
}

class MeetingDecisionTree {
  /**
   * Decide si realmente necesitas una reunión
   */
  shouldHaveMeeting(request: MeetingRequest): {
    shouldMeet: boolean;
    reason: string;
    alternative?: string;
  } {
    // Regla 1: No agenda = no meeting
    if (!request.hasAgenda) {
      return {
        shouldMeet: false,
        reason: "No clear agenda provided",
        alternative: "Send agenda first. If simple, handle via email.",
      };
    }

    // Regla 2: Can this be an email?
    const canBeEmail = this.canBeHandledAsync(request);
    if (canBeEmail) {
      return {
        shouldMeet: false,
        reason: "This can be handled asynchronously",
        alternative:
          "Send document for async review. Use comments for feedback.",
      };
    }

    // Regla 3: Too many people = inefficient
    if (request.attendees.length > 8) {
      return {
        shouldMeet: false,
        reason: "Too many attendees (>8) - meeting will be inefficient",
        alternative:
          "Share document for review. Meet with core decision makers only.",
      };
    }

    // Regla 4: Too long = should be broken up
    if (request.estimatedDuration > 60) {
      return {
        shouldMeet: false,
        reason: "Meeting too long (>60 min)",
        alternative:
          "Break into multiple shorter meetings or share pre-read materials.",
      };
    }

    return {
      shouldMeet: true,
      reason: "Meets criteria for productive meeting",
    };
  }

  private canBeHandledAsync(request: MeetingRequest): boolean {
    const asyncKeywords = [
      "update",
      "status",
      "review",
      "feedback",
      "fyi",
      "heads up",
    ];

    const purposeLower = request.purpose.toLowerCase();
    return asyncKeywords.some((keyword) => purposeLower.includes(keyword));
  }
}

// ============================================
// TEMPLATE: Meeting Agenda
// ============================================

interface AgendaItem {
  topic: string;
  duration: number; // minutes
  owner: string;
  type: "discussion" | "decision" | "info-share";
  prepWork?: string;
}

class MeetingAgenda {
  private items: AgendaItem[] = [];
  private totalDuration = 0;

  constructor(
    private title: string,
    private date: Date,
    private attendees: string[],
  ) {}

  addItem(item: AgendaItem): void {
    this.items.push(item);
    this.totalDuration += item.duration;
  }

  generate(): string {
    return `
# ${this.title}

📅 **Date:** ${this.date.toLocaleDateString()} ${this.date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
⏱️ **Duration:** ${this.totalDuration} minutes
👥 **Attendees:** ${this.attendees.join(", ")}

## 🎯 Objective
[State the desired outcome of this meeting]

## 📋 Agenda

${this.items.map((item, i) => this.formatAgendaItem(item, i + 1)).join("\n\n")}

## 📝 Pre-work
${this.getPreWork()}

## ✅ Success Criteria
- [ ] All agenda items covered
- [ ] Decisions documented
- [ ] Action items assigned with owners and deadlines

## 🚫 Out of Scope
[Topics to defer to future meetings]
    `.trim();
  }

  private formatAgendaItem(item: AgendaItem, index: number): string {
    const typeEmoji = {
      discussion: "💬",
      decision: "✅",
      "info-share": "ℹ️",
    };

    return `
### ${index}. ${typeEmoji[item.type]} ${item.topic} (${item.duration} min)

**Owner:** ${item.owner}
**Type:** ${item.type}
${item.prepWork ? `**Prep:** ${item.prepWork}` : ""}
    `.trim();
  }

  private getPreWork(): string {
    const prepItems = this.items.filter((item) => item.prepWork);

    if (prepItems.length === 0) {
      return "None";
    }

    return prepItems
      .map((item) => `- ${item.topic}: ${item.prepWork}`)
      .join("\n");
  }
}

// ============================================
// TEMPLATE: Meeting Notes
// ============================================

interface ActionItem {
  task: string;
  owner: string;
  dueDate: Date;
  status: "todo" | "in-progress" | "done";
}

interface Decision {
  question: string;
  decision: string;
  rationale: string;
  decisionMaker: string;
}

class MeetingNotes {
  private decisions: Decision[] = [];
  private actionItems: ActionItem[] = [];
  private discussionNotes: string[] = [];

  constructor(
    private meetingTitle: string,
    private date: Date,
    private attendees: string[],
  ) {}

  addDecision(decision: Decision): void {
    this.decisions.push(decision);
  }

  addActionItem(item: ActionItem): void {
    this.actionItems.push(item);
  }

  addNote(note: string): void {
    this.discussionNotes.push(note);
  }

  generate(): string {
    return `
# ${this.meetingTitle} - Notes

📅 **Date:** ${this.date.toLocaleDateString()}
👥 **Attendees:** ${this.attendees.join(", ")}

## ✅ Decisions Made

${this.decisions.length > 0 ? this.decisions.map((d, i) => this.formatDecision(d, i + 1)).join("\n\n") : "No decisions made"}

## 📝 Action Items

${this.actionItems.length > 0 ? this.actionItems.map((item, i) => this.formatActionItem(item, i + 1)).join("\n") : "No action items"}

## 💬 Discussion Notes

${this.discussionNotes.length > 0 ? this.discussionNotes.map((note) => `- ${note}`).join("\n") : "No notes"}

## 🔄 Next Meeting
[Date and focus of next meeting, if applicable]
    `.trim();
  }

  private formatDecision(decision: Decision, index: number): string {
    return `
### Decision ${index}: ${decision.question}

**Decision:** ${decision.decision}

**Rationale:** ${decision.rationale}

**Decision Maker:** ${decision.decisionMaker}
    `.trim();
  }

  private formatActionItem(item: ActionItem, index: number): string {
    const checkbox = item.status === "done" ? "x" : " ";
    return `${index}. [${checkbox}] **${item.task}** - ${item.owner} (Due: ${item.dueDate.toLocaleDateString()})`;
  }
}

// ============================================
// TECHNIQUE: Standup Optimization
// ============================================

class StandupOptimizer {
  /**
   * Template para standup async (más eficiente que sync)
   */
  static getAsyncStandupTemplate(): string {
    return `
🗓️ **Daily Standup - [Date]**

Please post your update by 10am in #standup channel:

**Yesterday:**
- What you completed

**Today:**
- What you're working on

**Blockers:**
- Anything blocking you? Tag relevant people.
- If no blockers, write "None"

---

**Sync Discussion:** 10:15am (15 min max)
Only if there are blockers that need team discussion.
If no blockers → No sync meeting!
    `.trim();
  }

  /**
   * Optimizar standup sync si es necesario
   */
  static getSyncStandupRules(): string[] {
    return [
      "⏱️ TIMEBOXED: 15 minutes max for entire team",
      "🎯 FOCUS: Only blockers and coordination needed",
      "🚫 NO PROBLEM SOLVING: Take detailed discussions offline",
      "📝 UPDATES: Post async first, discuss blockers only in sync",
      "👥 OPTIONAL: If no blockers, skip the sync meeting",
      "📍 STAND UP: Literally stand to keep it short",
    ];
  }
}

// ============================================
// TECHNIQUE: Meeting Decline Templates
// ============================================

class MeetingDeclineTemplates {
  /**
   * Decline: No agenda
   */
  static noAgenda(meetingTitle: string): string {
    return `
Thanks for the invite to "${meetingTitle}".

I don't see an agenda. Could you share:
- What we're deciding/discussing?
- What preparation is needed?
- What's the desired outcome?

If it's a quick update, could we handle it via:
- Email summary?
- Async doc review?
- Slack thread?

Happy to join if there's a clear agenda!
    `.trim();
  }

  /**
   * Decline: Can be async
   */
  static canBeAsync(meetingTitle: string, alternative: string): string {
    return `
Thanks for thinking of me for "${meetingTitle}".

I think we can handle this more efficiently via ${alternative}.

Benefits:
- Everyone can review on their own schedule
- More thoughtful feedback vs live reactions
- Written record for future reference

Would you like me to:
- Review a doc and provide written feedback?
- Respond to specific questions via email?
- Something else?

Let's meet only if we need real-time discussion after async review.
    `.trim();
  }

  /**
   * Decline: Not the right person
   */
  static wrongPerson(meetingTitle: string, rightPerson: string): string {
    return `
Thanks for the invite to "${meetingTitle}".

I think ${rightPerson} would be more appropriate for this discussion because [reason].

I've CC'd them. ${rightPerson}, can you join instead?

Happy to provide context offline if needed!
    `.trim();
  }

  /**
   * Tentative: Need more info
   */
  static needMoreInfo(questions: string[]): string {
    return `
Marked as tentative. To confirm, I need:

${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Once I have this info, I can confirm if my attendance is valuable.
    `.trim();
  }
}

// ============================================
// TECHNIQUE: Meeting Efficiency Metrics
// ============================================

class MeetingMetrics {
  /**
   * Calcula el costo real de una reunión
   */
  static calculateCost(
    attendees: number,
    duration: number,
    avgHourlyRate: number,
  ): {
    totalCost: number;
    opportunityCost: string;
  } {
    const totalCost = (attendees * duration * avgHourlyRate) / 60;

    return {
      totalCost,
      opportunityCost: `${(duration * attendees) / 60} person-hours of deep work`,
    };
  }

  /**
   * Audit de meetings para encontrar patterns
   */
  static auditWeeklyMeetings(meetings: {
    title: string;
    duration: number;
    recurring: boolean;
    hadAgenda: boolean;
    hadActionItems: boolean;
  }[]): {
    totalHours: number;
    inefficientMeetings: number;
    recommendations: string[];
  } {
    const totalMinutes = meetings.reduce((sum, m) => sum + m.duration, 0);
    const totalHours = totalMinutes / 60;

    const inefficientMeetings = meetings.filter(
      (m) => !m.hadAgenda || !m.hadActionItems,
    ).length;

    const recommendations: string[] = [];

    // Recommendation 1: Meetings without agenda
    const noAgenda = meetings.filter((m) => !m.hadAgenda);
    if (noAgenda.length > 0) {
      recommendations.push(
        `${noAgenda.length} meetings had no agenda. Require agenda for all meetings.`,
      );
    }

    // Recommendation 2: Meetings without action items
    const noAction = meetings.filter((m) => !m.hadActionItems);
    if (noAction.length > 0) {
      recommendations.push(
        `${noAction.length} meetings had no action items. These might have been emails.`,
      );
    }

    // Recommendation 3: Too many hours in meetings
    if (totalHours > 15) {
      recommendations.push(
        `You spent ${totalHours.toFixed(1)} hours in meetings this week. Consider declining some.`,
      );
    }

    // Recommendation 4: Recurring meetings audit
    const recurring = meetings.filter((m) => m.recurring);
    if (recurring.length > 5) {
      recommendations.push(
        `You have ${recurring.length} recurring meetings. Audit if all are still necessary.`,
      );
    }

    return {
      totalHours,
      inefficientMeetings,
      recommendations,
    };
  }
}

// ============================================
// DEMOSTRACIÓN
// ============================================

console.log("=".repeat(60));
console.log("🎯 REUNIONES PRODUCTIVAS");
console.log("=".repeat(60));

// Ejemplo 1: Should this be a meeting?
const decisionTree = new MeetingDecisionTree();

const requests: MeetingRequest[] = [
  {
    purpose: "Status update on project",
    attendees: ["PM", "QA", "Dev1", "Dev2"],
    estimatedDuration: 30,
    hasAgenda: false,
    requiresDecision: false,
  },
  {
    purpose: "Decide on architecture approach for payments",
    attendees: ["Tech Lead", "Senior Dev", "Architect"],
    estimatedDuration: 45,
    hasAgenda: true,
    requiresDecision: true,
  },
];

console.log("\n📊 MEETING DECISION TREE:");
requests.forEach((req) => {
  const decision = decisionTree.shouldHaveMeeting(req);
  console.log(`\n"${req.purpose}":`);
  console.log(`  Should meet: ${decision.shouldMeet}`);
  console.log(`  Reason: ${decision.reason}`);
  if (decision.alternative) {
    console.log(`  Alternative: ${decision.alternative}`);
  }
});

// Ejemplo 2: Meeting Agenda
console.log("\n" + "=".repeat(60));
console.log("📋 EJEMPLO: MEETING AGENDA");
console.log("=".repeat(60));

const agenda = new MeetingAgenda(
  "Sprint Planning - Payment Features",
  new Date("2024-11-18T14:00:00"),
  ["PM (Sarah)", "Tech Lead (Mike)", "QA (Jane)", "Dev Team"],
);

agenda.addItem({
  topic: "Review completed work from last sprint",
  duration: 5,
  owner: "Mike",
  type: "info-share",
});

agenda.addItem({
  topic: "Prioritize payment refund features",
  duration: 15,
  owner: "Sarah",
  type: "decision",
  prepWork: "Review PRD at [link]",
});

agenda.addItem({
  topic: "Estimate effort for top priorities",
  duration: 20,
  owner: "Dev Team",
  type: "discussion",
});

agenda.addItem({
  topic: "Commit to sprint scope",
  duration: 10,
  owner: "Sarah & Mike",
  type: "decision",
});

console.log(agenda.generate());

// Ejemplo 3: Meeting Cost
console.log("\n" + "=".repeat(60));
console.log("💰 MEETING COST CALCULATOR");
console.log("=".repeat(60));

const cost = MeetingMetrics.calculateCost(
  6, // attendees
  60, // minutes
  100, // $100/hour average
);

console.log(`\nMeeting with 6 people for 60 minutes:`);
console.log(`  💵 Total cost: $${cost.totalCost}`);
console.log(`  ⏰ Opportunity cost: ${cost.opportunityCost}`);
console.log(`\n💡 Could this have been an email?`);

console.log("\n" + "=".repeat(60));
console.log("💡 MEJORES PRÁCTICAS");
console.log("=".repeat(60));

console.log(`
✅ DO's:

1. DEFAULT TO NO MEETING:
   Ask: "Can this be an email/doc/Slack thread?"

2. ALWAYS HAVE AGENDA:
   No agenda = Decline the meeting

3. TIMEBOX STRICTLY:
   25 min meetings (not 30)
   50 min meetings (not 60)
   Parkinson's Law: Work expands to time available

4. START/END ON TIME:
   Respect people's schedules

5. ASSIGN ACTION ITEMS:
   Every meeting should produce action items
   No action items = Probably didn't need meeting

6. SHARE NOTES:
   Document decisions and action items
   Share with all stakeholders (even those not in meeting)

7. RECURRING MEETING AUDIT:
   Quarterly: Review all recurring meetings
   Cancel or reduce frequency if not valuable

8. OPTIONAL ATTENDANCE:
   Mark people as "optional" if they don't need to be there
   FYI attendees can read notes instead

❌ DON'Ts:

1. DON'T HAVE "JUST IN CASE" MEETINGS:
   Meet when there's a clear need, not "just to sync"

2. DON'T INVITE EVERYONE:
   More people = Less productive
   Keep it to essential decision makers

3. DON'T PROBLEM SOLVE IN STANDUPS:
   Standup = Identify blockers
   Problem solving = Separate meeting with subset of people

4. DON'T SCHEDULE BACK-TO-BACK:
   Leave buffer for bio breaks, notes, context switching

5. DON'T HAVE MEETINGS BEFORE 10AM OR AFTER 4PM:
   Protect morning deep work time
   Respect end-of-day wind down

6. DON'T LET MEETINGS RUN OVER:
   If not done, schedule follow-up
   Don't hold people hostage

🎯 AMAZON'S 2-PIZZA RULE:
If you can't feed the meeting with 2 pizzas, it's too many people (6-8 max)

⏰ SHOPIFY'S NO MEETING WEDNESDAY:
Block entire days for deep work

📝 BASECAMP'S OFFICE HOURS:
Set specific times when you're available for questions
No random interruptions rest of the week
`);

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Menos meetings, más trabajo!");
console.log("=".repeat(60));

export {
  MeetingDecisionTree,
  MeetingAgenda,
  MeetingNotes,
  StandupOptimizer,
  MeetingDeclineTemplates,
  MeetingMetrics,
};
