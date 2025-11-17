/**
 * ==========================================
 * DOCUMENTACIÓN CLARA Y EFECTIVA
 * ==========================================
 *
 * La documentación efectiva reduce drásticamente interrupciones
 * de QA y PM. "Write once, reference many times" es más eficiente
 * que responder las mismas preguntas repetidamente.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Self-service: Stakeholders encuentran respuestas sin ti
 * - Single source of truth: Una ubicación para cada tipo de info
 * - Living documentation: Docs que evolucionan con el código
 * - Just-in-time docs: Documentar cuando preguntan, no antes
 *
 * 🏢 USO EN BIG TECH:
 * - Stripe: API docs auto-generados + interactive examples
 * - Atlassian: Confluence templates for RFCs
 * - GitLab: Everything documented in handbook
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * Sin documentación:
 * - Mismas preguntas una y otra vez
 * - Knowledge silos (solo tú sabes cómo funciona)
 * - Onboarding lento
 * - Bus factor = 1 (te vas y todo se detiene)
 */

// ============================================
// FRAMEWORK: Documentation Types
// ============================================

/**
 * Diferentes tipos de documentación sirven diferentes propósitos
 */
enum DocType {
  README = "README", // Qué es, cómo empezar
  RUNBOOK = "RUNBOOK", // Cómo ejecutar operaciones comunes
  TROUBLESHOOTING = "TROUBLESHOOTING", // Cómo resolver problemas
  ARCHITECTURE = "ARCHITECTURE", // Cómo está diseñado el sistema
  API_DOCS = "API_DOCS", // Cómo usar las APIs
  FAQ = "FAQ", // Preguntas frecuentes
  CHANGELOG = "CHANGELOG", // Qué cambió y cuándo
  TESTING_GUIDE = "TESTING_GUIDE", // Cómo testear
}

interface DocumentationTemplate {
  type: DocType;
  purpose: string;
  audience: string[];
  updateFrequency: string;
  template: string;
}

// ============================================
// TEMPLATE: README
// ============================================

class READMEGenerator {
  static generate(project: {
    name: string;
    description: string;
    quickStart: string[];
    dependencies: string[];
  }): string {
    return `
# ${project.name}

## 📋 Description
${project.description}

## 🚀 Quick Start

\`\`\`bash
${project.quickStart.join("\n")}
\`\`\`

## 📦 Dependencies
${project.dependencies.map((dep) => `- ${dep}`).join("\n")}

## 📚 Documentation
- [Architecture](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Testing Guide](./docs/testing.md)
- [Troubleshooting](./docs/troubleshooting.md)

## 🐛 Found a bug?
See [TROUBLESHOOTING.md](./docs/troubleshooting.md) first.
Still stuck? Create an issue with:
- What you tried
- What you expected
- What actually happened
- Relevant logs

## 💬 Questions?
- Check [FAQ](./docs/faq.md)
- Ask in #engineering-help Slack channel
- Tag @team-name in your question
    `.trim();
  }
}

// ============================================
// TEMPLATE: RUNBOOK
// ============================================

interface RunbookEntry {
  task: string;
  whenToUse: string;
  prerequisites: string[];
  steps: { step: string; command?: string; expected?: string }[];
  troubleshooting: string;
}

class RunbookGenerator {
  static generate(entries: RunbookEntry[]): string {
    return `
# Runbook

${entries.map((entry) => this.formatEntry(entry)).join("\n\n---\n\n")}
    `.trim();
  }

  private static formatEntry(entry: RunbookEntry): string {
    return `
## ${entry.task}

**When to use:** ${entry.whenToUse}

**Prerequisites:**
${entry.prerequisites.map((p) => `- ${p}`).join("\n")}

**Steps:**

${entry.steps.map((step, i) => `
${i + 1}. ${step.step}
${step.command ? `   \`\`\`bash\n   ${step.command}\n   \`\`\`` : ""}
${step.expected ? `   Expected: ${step.expected}` : ""}
`).join("\n")}

**Troubleshooting:**
${entry.troubleshooting}
    `.trim();
  }
}

// ============================================
// TEMPLATE: FAQ
// ============================================

interface FAQItem {
  question: string;
  answer: string;
  tags: string[];
  relatedDocs?: string[];
}

class FAQGenerator {
  private items: FAQItem[] = [];

  addQuestion(item: FAQItem): void {
    this.items.push(item);
  }

  /**
   * Genera FAQ organizado por tags
   */
  generate(): string {
    // Group by tags
    const byTag = new Map<string, FAQItem[]>();

    this.items.forEach((item) => {
      item.tags.forEach((tag) => {
        const existing = byTag.get(tag) || [];
        existing.push(item);
        byTag.set(tag, existing);
      });
    });

    let output = "# Frequently Asked Questions\n\n";

    // Table of contents
    output += "## Categories\n\n";
    byTag.forEach((_, tag) => {
      output += `- [${tag}](#${tag.toLowerCase().replace(/\s+/g, "-")})\n`;
    });
    output += "\n---\n\n";

    // Questions by category
    byTag.forEach((items, tag) => {
      output += `## ${tag}\n\n`;

      items.forEach((item) => {
        output += `### ${item.question}\n\n`;
        output += `${item.answer}\n\n`;

        if (item.relatedDocs && item.relatedDocs.length > 0) {
          output += "**See also:**\n";
          item.relatedDocs.forEach((doc) => {
            output += `- [${doc}](${doc})\n`;
          });
          output += "\n";
        }
      });

      output += "---\n\n";
    });

    return output.trim();
  }
}

// ============================================
// TEMPLATE: Decision Log (ADR)
// ============================================

interface ArchitectureDecision {
  id: string;
  title: string;
  date: Date;
  status: "proposed" | "accepted" | "rejected" | "deprecated";
  context: string;
  decision: string;
  consequences: { positive: string[]; negative: string[] };
  alternatives: string[];
}

class ADRGenerator {
  static generate(adr: ArchitectureDecision): string {
    return `
# ADR ${adr.id}: ${adr.title}

**Date:** ${adr.date.toLocaleDateString()}
**Status:** ${adr.status}

## Context

${adr.context}

## Decision

${adr.decision}

## Alternatives Considered

${adr.alternatives.map((alt, i) => `${i + 1}. ${alt}`).join("\n")}

## Consequences

### Positive

${adr.consequences.positive.map((c) => `- ${c}`).join("\n")}

### Negative

${adr.consequences.negative.map((c) => `- ${c}`).join("\n")}

---

*This decision can be revisited if circumstances change significantly.*
    `.trim();
  }
}

// ============================================
// TEMPLATE: Testing Guide para QA
// ============================================

interface TestingGuide {
  feature: string;
  scope: { included: string[]; excluded: string[] };
  testEnvironment: {
    url: string;
    credentials: { username: string; password: string }[];
  };
  testData: { description: string; data: any }[];
  testCases: {
    scenario: string;
    steps: string[];
    expected: string;
    priority: "P0" | "P1" | "P2";
  }[];
  knownIssues: string[];
}

class TestingGuideGenerator {
  static generate(guide: TestingGuide): string {
    return `
# Testing Guide: ${guide.feature}

## 🎯 Scope

### ✅ Included
${guide.scope.included.map((item) => `- ${item}`).join("\n")}

### ❌ Excluded (Future Sprints)
${guide.scope.excluded.map((item) => `- ${item}`).join("\n")}

## 🌍 Test Environment

**URL:** ${guide.testEnvironment.url}

**Test Credentials:**
${guide.testEnvironment.credentials.map((cred) => `- ${cred.username} / ${cred.password}`).join("\n")}

## 📊 Test Data

${guide.testData.map((data) => `
### ${data.description}
\`\`\`json
${JSON.stringify(data.data, null, 2)}
\`\`\`
`).join("\n")}

## ✅ Test Cases

${guide.testCases.map((tc, i) => `
### ${i + 1}. ${tc.scenario} [${tc.priority}]

**Steps:**
${tc.steps.map((step, j) => `${j + 1}. ${step}`).join("\n")}

**Expected Result:**
${tc.expected}
`).join("\n---\n")}

## ⚠️ Known Issues

${guide.knownIssues.length > 0 ? guide.knownIssues.map((issue) => `- ${issue}`).join("\n") : "None"}

## 🐛 Reporting Bugs

When reporting bugs, include:
1. Test case that failed
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots/logs
5. Environment details

Template: [Bug Report Template](./bug-report-template.md)
    `.trim();
  }
}

// ============================================
// STRATEGY: Just-in-Time Documentation
// ============================================

class JITDocumentation {
  /**
   * Cuando te preguntan algo por 3ra vez, documéntalo
   */
  private questionCount = new Map<string, number>();

  recordQuestion(question: string): {
    shouldDocument: boolean;
    count: number;
  } {
    const count = (this.questionCount.get(question) || 0) + 1;
    this.questionCount.set(question, count);

    return {
      shouldDocument: count >= 3,
      count,
    };
  }

  /**
   * Response template cuando decides documentar
   */
  static getDocumentationResponse(
    question: string,
    answer: string,
    docLink: string,
  ): string {
    return `
${answer}

I've documented this here for future reference: ${docLink}

Feel free to update the doc if you find better ways to explain this!
    `.trim();
  }
}

// ============================================
// STRATEGY: Documentation Maintenance
// ============================================

class DocMaintenanceChecker {
  /**
   * Check si docs están outdated
   */
  static checkFreshness(doc: {
    lastUpdated: Date;
    relatedCodeFiles: string[];
  }): {
    isStale: boolean;
    reason?: string;
    suggestedAction?: string;
  } {
    const now = new Date();
    const daysSinceUpdate =
      (now.getTime() - doc.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

    // Docs más de 3 meses sin update probablemente están stale
    if (daysSinceUpdate > 90) {
      return {
        isStale: true,
        reason: `Last updated ${Math.floor(daysSinceUpdate)} days ago`,
        suggestedAction: "Review and update or mark as deprecated",
      };
    }

    return { isStale: false };
  }

  /**
   * Template para marcar docs como outdated
   */
  static getOutdatedWarning(correctDoc: string): string {
    return `
> ⚠️ **OUTDATED**
>
> This documentation is outdated.
> See ${correctDoc} for current information.
>
> Last updated: [date]
    `.trim();
  }
}

// ============================================
// DEMOSTRACIÓN
// ============================================

console.log("=".repeat(60));
console.log("📚 DOCUMENTACIÓN CLARA Y EFECTIVA");
console.log("=".repeat(60));

// Ejemplo 1: README
console.log("\n📄 EJEMPLO: README");
console.log("=".repeat(60));

const readme = READMEGenerator.generate({
  name: "Payment Processing Service",
  description: "Handles payment processing via Stripe integration",
  quickStart: [
    "npm install",
    "cp .env.example .env",
    "npm run dev",
    'Test: curl http://localhost:3000/health',
  ],
  dependencies: [
    "Node.js 18+",
    "PostgreSQL 14+",
    "Stripe API key",
    "Redis (optional, for caching)",
  ],
});

console.log(readme);

// Ejemplo 2: Testing Guide para QA
console.log("\n\n📋 EJEMPLO: TESTING GUIDE PARA QA");
console.log("=".repeat(60));

const testGuide: TestingGuide = {
  feature: "Payment Refunds",
  scope: {
    included: ["Full refunds", "Partial refunds", "Refund status tracking"],
    excluded: ["Scheduled refunds", "Bulk refunds"],
  },
  testEnvironment: {
    url: "https://staging.example.com",
    credentials: [
      { username: "qa-admin@test.com", password: "TestPass123" },
      { username: "qa-user@test.com", password: "TestPass123" },
    ],
  },
  testData: [
    {
      description: "Test payment for full refund",
      data: { paymentId: "pay_test123", amount: 5000, currency: "USD" },
    },
  ],
  testCases: [
    {
      scenario: "User can request full refund",
      steps: [
        "Login as qa-user@test.com",
        "Go to /payments",
        "Click on payment pay_test123",
        'Click "Request Refund" button',
        'Select "Full refund"',
        'Click "Confirm"',
      ],
      expected:
        "Refund status shows 'Processing'. Email sent to user. Payment status updated to 'Refunded' within 5 seconds.",
      priority: "P0",
    },
  ],
  knownIssues: ["Refund button disabled for payments < $1"],
};

console.log(TestingGuideGenerator.generate(testGuide));

// Ejemplo 3: FAQ
console.log("\n\n❓ EJEMPLO: FAQ");
console.log("=".repeat(60));

const faq = new FAQGenerator();

faq.addQuestion({
  question: "How do I run tests locally?",
  answer: "Run `npm test` for unit tests. For integration tests: `npm run test:integration`",
  tags: ["Testing", "Development"],
  relatedDocs: ["./docs/testing.md"],
});

faq.addQuestion({
  question: "Why is my payment failing in staging?",
  answer:
    "Check that you're using test card numbers (4242 4242 4242 4242 for success). Production cards don't work in staging.",
  tags: ["Testing", "Troubleshooting"],
  relatedDocs: ["./docs/test-data.md"],
});

console.log(faq.generate());

// Ejemplo 4: Just-in-Time Documentation
console.log("\n\n⏱️ EJEMPLO: JUST-IN-TIME DOCUMENTATION");
console.log("=".repeat(60));

const jitDoc = new JITDocumentation();

const question = "How do I deploy to staging?";

// Simular 3 veces la misma pregunta
for (let i = 1; i <= 3; i++) {
  const result = jitDoc.recordQuestion(question);
  console.log(
    `\nPregunta #${i}: "${question}"`,
  );
  console.log(`  Count: ${result.count}`);
  console.log(`  Should document: ${result.shouldDocument}`);

  if (result.shouldDocument) {
    console.log("\n  ✅ Creating documentation...");
    console.log(
      JITDocumentation.getDocumentationResponse(
        question,
        "Run: npm run deploy:staging",
        "https://wiki.company.com/deploy-guide",
      ),
    );
  }
}

console.log("\n" + "=".repeat(60));
console.log("💡 MEJORES PRÁCTICAS");
console.log("=".repeat(60));

console.log(`
✅ DO's:

1. START WITH WHY:
   Explica POR QUÉ algo se diseñó así, no solo CÓMO usarlo

2. USE EXAMPLES:
   Un ejemplo vale más que mil palabras
   ❌ "Use the API to create users"
   ✅ "curl -X POST /api/users -d '{"name":"John"}'"

3. KEEP IT FRESH:
   Docs desactualizados son peores que no tener docs
   Update docs when code changes

4. MAKE IT SEARCHABLE:
   Use keywords que stakeholders buscarían
   Think: "What would QA search for?"

5. LINK, DON'T DUPLICATE:
   Single source of truth
   Link to other docs, don't copy-paste

6. PROGRESSIVE DISCLOSURE:
   README = Quick start
   Deep dives = Separate docs

7. INCLUDE TROUBLESHOOTING:
   Document common errors and solutions

8. SHOW, DON'T TELL:
   Screenshots, diagrams, videos cuando sea útil

❌ DON'Ts:

1. DON'T DOCUMENT EVERYTHING UPFRONT:
   Just-in-time > Speculative documentation

2. DON'T WRITE NOVELS:
   Concise > Comprehensive
   People won't read 20-page docs

3. DON'T USE JARGON:
   Write for your audience (QA, PM, etc)

4. DON'T HIDE DOCS:
   Put them where people look:
   - README for basics
   - Wiki for deep dives
   - Code comments for implementation details

5. DON'T FORGET TO UPDATE:
   Stale docs cause more problems than they solve
`);

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Documenta para reducir interrupciones!");
console.log("=".repeat(60));

export {
  READMEGenerator,
  RunbookGenerator,
  FAQGenerator,
  ADRGenerator,
  TestingGuideGenerator,
  JITDocumentation,
  DocMaintenanceChecker,
};
